import * as React from "react";
import {useCallback, useEffect, useMemo, useReducer, useRef, useState} from "react";

import {KeyMap, Utils, usePlayer} from "ractive-player";
const {onClick} = Utils.mobile;
const {useForceUpdate} = Utils.react;

import type {RecorderPlugin} from "./types";
import RecordingManager from "./recording-manager";

import RecordingRow from "./RecordingRow";

import {AudioRecorderPlugin} from "./recorders/audio-recorder";
import {MarkerRecorderPlugin} from "./recorders/marker-recorder";

interface Props {
  manager?: RecordingManager;
  plugins?: RecorderPlugin[];
}

interface Action {
  command: string;
  seq: string;
}

interface State {
  start: string;
  pause: string;
  discard: string;
}

const mac = navigator.platform === "MacIntel";
const bindings = {
  start: mac ? "Alt+Meta+2" : "Ctrl+Alt+2",
  pause: mac ? "Alt+Meta+3" : "Ctrl+Alt+3",
  discard: mac ? "Alt+Meta+4" : "Ctrl+Alt+4"
};

export default function Control(props: Props) {
  const player = usePlayer();
  const [recordings, setRecordings] = useState([]);
  const forceUpdate = useForceUpdate();

  // default plugins
  // is this bad
  const plugins = useMemo(() => [
    AudioRecorderPlugin, MarkerRecorderPlugin, ...(props.plugins ?? [])
  ], [props.plugins]);

  // prevent canvasClick
  useEffect(() => {
    player.hub.on("canvasClick", () => false);
  }, []);

  // recording manager
  const manager = useRef<RecordingManager>();

  useEffect(() => {
    manager.current = props.manager ?? new RecordingManager(player);
    manager.current.hub.on("finalize", forceUpdate);
    manager.current.hub.on("start", forceUpdate);
    manager.current.hub.on("pause", forceUpdate);
    manager.current.hub.on("resume", forceUpdate);
  }, []);

  // active plugins
  const activePlugins = useRef<{[key: string]: boolean;}>(null);
  if (activePlugins.current === null) {
    activePlugins.current = {};

    for (const plugin of plugins) {
      activePlugins.current[plugin.key] = false;
    }
  };

  // plugins dictionary
  const [pluginsByKey] = useState(() => {
    const dict = {};
    for (const plugin of plugins) {
      dict[plugin.key] = plugin;
    }
    return dict;
  });

  /* commands */
  const start = useCallback(() => {
    const {active, beginRecording, endRecording} = manager.current;
    if (active) {
      endRecording().then(recording => setRecordings(prev => prev.concat(recording)));
    } else {
      beginRecording(plugins);
    }
  }, []);

  const pause = useCallback(() => {
    const {active, paused, pauseRecording, resumeRecording} = manager.current;
    if (active) {
      paused ? resumeRecording() : pauseRecording();
    }
  }, []);

  const discard = useCallback(async () => {
    const {active, endRecording, hub} = manager.current;
    if (active) {
      const listeners = hub.listeners("finalize") as (Parameters<typeof hub.on>[1])[];
      for (const listener of listeners) {
        hub.off("finalize", listener);
      }
      try {
        await endRecording();
      } catch (e) {
        console.error(e);
      }

      for (const listener of listeners) {
        hub.on("finalize", listener);
      }

      forceUpdate();
    }
  }, []);

  /* keyboard controls */
  // just to make React shut up about onChange
  const prevent = useCallback(() => {}, []);

  const callbacks = useMemo(() => ({start, pause, discard}), []);

  const reducer: React.Reducer<State, Action> = useCallback((state, action) => {
    // rebind
    player.keymap.unbind(state[action.command], callbacks[action.command]);
    player.keymap.bind(action.seq, callbacks[action.command]);

    // return new state
    return {
      ...state,
      [action.command]: action.seq
    };
  }, []);

  const [state, dispatch] = useReducer(reducer, bindings);

  // initial bind
  useEffect(() => {
    for (const key in state) {
      player.keymap.bind(state[key], callbacks[key]);
    }
  }, []);

  // onBlur event, triggers rebind
  const onBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
    e.preventDefault();

    const name = e.currentTarget.getAttribute("name");

    // bind sequence
    const seq = e.currentTarget.dataset.value;
    dispatch({command: name, seq});

    // resume key capture
    player.resumeKeyCapture();
  }, []);
  
  // display shortcut sequence
  const identifyKey = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const seq = KeyMap.identify(e);
    e.currentTarget.dataset.value = seq;
    e.currentTarget.value = fmtSeq(seq);
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
    const key = e.currentTarget.dataset.plugin;
    activePlugins.current[key] = !activePlugins.current[key];
    forceUpdate();
  }), []);

  /* render */
  const commands = [
    ["Start/Stop recording", "start"],
    ["Pause recording", "pause"],
    ["Discard recording", "discard"]
  ];

  return (
    <div id="rp-recording">
      <div id="rp-recording-dialog" style={dialogStyle}>
        <table id="rp-recording-configuration">
          <tbody>
            <tr>
              <th colSpan={2}>Commands</th>
            </tr>
            {commands.map(([desc, key]) => (
              <tr key={key}>
                <th scope="row">{desc}</th>
                <td>
                  <input
                    onBlur={onBlur} readOnly onFocus={player.suspendKeyCapture} onKeyDown={identifyKey}
                    className="shortcut" name={key} type="text" value={fmtSeq(state[key])}/>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Configuration</h3>
        {plugins.map((plugin, i) => {
          const classNames = ["recorder-plugin-icon"];

          if (activePlugins.current[plugin.key])
            classNames.push("active");

          const styles: React.CSSProperties = {};
          const enabled = typeof plugin.enabled === "undefined" || plugin.enabled();
          if (!enabled) {
            styles.opacity = 0.3;
          }

          return (
            <div className="recorder-plugin" key={plugin.key} title={plugin.title} style={styles}>
              <svg
                className={classNames.join(" ")} height="36" width="36" viewBox="0 0 100 100"
                data-plugin={plugin.key} {...(enabled ? setActive : {})}
              >
                <rect height="100" width="100" fill={activePlugins.current[plugin.key] ? "red" : "#222"}/>
                {plugin.icon}
              </svg>
              <span className="recorder-plugin-name">{plugin.name}</span>
            </div>
          );
        })}

        <h3>Saved data</h3>
        <ol className="recordings">
          {recordings.map((recording, i) => (
            <RecordingRow key={i} data={recording} pluginsByKey={pluginsByKey}/>
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

function fmtSeq(str: string) {
  if (navigator.platform !== "MacIntel")
    return str;
  if (str === void 0)
    return str;
  return str.split("+").map(k => {
    if (k === "Ctrl")
      return "^";
    else if (k === "Alt")
      return "⌥"
    if (k === "Shift")
      return "⇧";
    if (k === "Meta")
      return "⌘";
    return k;
  }).join("");
}
