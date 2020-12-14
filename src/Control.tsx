import * as React from "react";
import {useCallback, useEffect, useMemo, useReducer, useRef, useState} from "react";

import {Utils, usePlayer} from "ractive-player";
const {onClick} = Utils.mobile;
import type {Broadcast} from "ractive-player";

import type {RecorderPlugin} from "./types";
import RecordingManager from "./recording-manager";

import RecordingRow from "./RecordingRow";

interface Props {
  broadcast?: Broadcast;
  plugins: RecorderPlugin[];
}

export default function Control(props: Props) {
  const player = usePlayer();
  const [recordings, setRecordings] = useState([]);
  const forceUpdate = useForceUpdate();

  // recording manager
  const manager = useRef<RecordingManager>();

  useEffect(() => {
    manager.current = new RecordingManager(player);
    if (props.broadcast) {
      manager.current.broadcastTo(props.broadcast)
    }
    manager.current.hub.on("activechange", forceUpdate);
    manager.current.hub.on("pausedchange", forceUpdate);
  }, []);

  // active plugins
  const activePlugins = useRef<{[key: string]: boolean;}>(null);
  if (activePlugins.current === null) {
    activePlugins.current = {};

    for (const plugin of props.plugins) {
      activePlugins.current[plugin.name] = false;
    }
  };

  // plugins dictionary
  const [pluginsByName] = useState(() => {
    const dict = {};
    for (const plugin of props.plugins) {
      dict[plugin.name] = plugin;
    }
    return dict;
  });

  /* keyboard controls */
  // XXX fix this to use KeyMap (requires fixing KeyMap first...)
  // useEffect(() => {
  //   player.keymap.bind();
  // }, []);
  const onKeyDown = useCallback((e: KeyboardEvent) => {
    if (!player.captureKeys)
      return;

    const {paused, active, beginRecording, endRecording, pauseRecording, resumeRecording} = manager.current;

    if (e.code === "Digit2" && e.altKey && e.metaKey) {
      if (active) {
        endRecording().then(recording => setRecordings(prev => prev.concat(recording)));
      } else {
        beginRecording(props.plugins.filter(p => activePlugins.current[p.name]));
      }
    }

    else if (e.code === "Digit3" && e.altKey && e.metaKey && active) {
      paused ? resumeRecording() : pauseRecording();
    }

    else if (e.code === "Digit4" && e.altKey && e.metaKey && active) {
      endRecording();
    }
  }, []);

  useEffect(() => {
    document.body.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.removeEventListener("keydown", onKeyDown);      
    };
  }, []);

  // warn before closing if recordings exist
  const warn = useRef(false);
  warn.current = recordings.length > 0;

  useEffect(() => {
    window.addEventListener("beforeunload", (e: BeforeUnloadEvent) => {
      if (warn.current)
        e.returnValue = "You have recording data";
    });
  }, []);

  // show/hide control pane
  const [paneOpen, setPaneOpen] = useState(false);
  const togglePane = useMemo(() => onClick(() => {
    setPaneOpen(prev => !prev);
  }), []);

  const dialogStyle = {
    display: paneOpen ? "block" : "none"
  };

  // toggle plugin
  const setActive = useMemo(() => onClick<SVGSVGElement>((e) => {
    const name = e.currentTarget.dataset.plugin;
    activePlugins.current[name] = !activePlugins.current[name];
    forceUpdate();
  }), []);

  // JSX
  return (
    <div id="editor-recorder">
      <div id="editor-recorder-dialog" style={dialogStyle}>
        <table id="editor-recorder-commands">
          <tbody>
            <tr>
              <th><kbd>Alt+Cmd+2</kbd></th>
              <td>Start/Stop recording</td>
            </tr>
            <tr>
              <th><kbd>Alt+Cmd+3</kbd></th>
              <td>Pause/Resume recording</td>
            </tr>
            <tr>
              <th><kbd>Alt+Cmd+4</kbd></th>
              <td>Discard recording</td>
            </tr>
          </tbody>
        </table>

        <h3>Configuration</h3>
        {props.plugins.map((plugin, i) => {
          const classNames = ["recorder-plugin-icon"];

          if (activePlugins.current[plugin.name])
            classNames.push("active");

          const styles: React.CSSProperties = {};
          const enabled = typeof plugin.enabled === "undefined" || plugin.enabled();
          if (!enabled) {
            styles.opacity = 0.3;
          }

          return (
            <div className="recorder-plugin" key={plugin.name} title={plugin.title} style={styles}>
              <svg
                className={classNames.join(" ")} height="36" width="36" viewBox="0 0 100 100"
                data-plugin={plugin.name} {...(enabled ? setActive : {})}
              >
                <rect height="100" width="100" fill={activePlugins.current[plugin.name] ? "red" : "#222"}/>
                {plugin.icon}
              </svg>
              <span className="recorder-plugin-name">{plugin.name}</span>
            </div>
          );
        })}

        <h3>Saved data</h3>
        <ol className="recordings">
          {recordings.map((recording, i) => (
            <RecordingRow key={i} data={recording} pluginsByName={pluginsByName}/>
          ))}
        </ol>
      </div>
      <svg height="36" width="36" viewBox="-50 -50 100 100" {...togglePane}>
        <circle
          cx="0" cy="0" r="35" stroke="white" strokeWidth="5"
          fill={manager.current?.active ? (manager.current?.paused ? "yellow" : "red") : "#666"}
        />
      </svg>
    </div>
  );
}

function useForceUpdate() {
  const [flag, setFlag] = React.useState(false);
  return () => setFlag(_ => !_);
}
