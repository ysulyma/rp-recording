import * as React from 'react';

import {on} from './utils/events';

import {Player, Utils} from 'ractive-player';
const {bind} = Utils.misc;

export interface RecorderPlugin {
  name: string;
  recorder: {new(player: Player): Recorder};
  configureComponent: typeof RecorderConfigureComponent;
  saveComponent: React.SFC<{data: any}>;
}

export interface Recorder {
  beginRecording(time: number): void;
  pauseRecording(time: number): void;
  resumeRecording(time: number): void;
  endRecording(time: number): Promise<any>;
}

interface RCCProps {
  setPluginActive: (active: boolean) => void;
}

interface RCCState {
  active: boolean;
}

export abstract class RecorderConfigureComponent extends React.PureComponent<RCCProps, RCCState> {
  constructor(props: RCCProps) {
    super(props);

    bind(this, ['toggleActive']);

    this.state = {
      active: false
    };
  }

  toggleActive() {
    this.props.setPluginActive(!this.state.active);
    this.setState({active: !this.state.active});
  }
}

interface RecorderComponentProps {
  plugins: RecorderPlugin[];
}

interface RecorderComponentState {
  isPaneOpen: boolean;
  isRecording: boolean;
  recordings: any[];
  paused: boolean;
}

export class RecorderComponent extends Player.PureReceiver<RecorderComponentProps, RecorderComponentState> {
  player: Player;
  private plugins: RecorderPlugin[];
  pluginMap: {[x: string]: RecorderPlugin};
  private isPluginActive: {[x: string]: boolean};
  private activeRecorders: Map<RecorderPlugin, Recorder>;

  constructor(props: RecorderComponentProps & {player: Player}) {
    super(props);
    this.plugins = props.plugins;
    this.player = props.player;

    this.isPluginActive = {};
    this.pluginMap = {};

    for (const plugin of this.plugins) {
      this.pluginMap[plugin.name] = plugin;
      this.isPluginActive[plugin.name] = false;
    }

    this.activeRecorders = new Map();

    bind(this, ['togglePane', 'onKeyDown', 'beginRecording', 'endRecording']);

    this.state = {
      isPaneOpen: false,
      isRecording: false,
      recordings: [],
      paused: false
    };
  }

  componentDidMount() {
    on(document.body, 'keydown', this.onKeyDown);
    on(window, 'beforeunload', (e: BeforeUnloadEvent) => {
      if (this.state.recordings.length > 0)
        e.returnValue = "You have recording data";
    });
  }

  onKeyDown(e: KeyboardEvent) {
    if (!this.player.$controls.captureKeys) return;

    if (e.code === 'Digit2' && e.altKey && e.metaKey) {
      this.state.isRecording ? this.endRecording(true) : this.beginRecording();
    }

    if (e.code === 'Digit3' && e.altKey && e.metaKey && this.state.isRecording) {
      this.state.paused ? this.resumeRecording() : this.pauseRecording();
    }

    else if (e.code === 'Digit4' && e.altKey && e.metaKey && this.state.isRecording) {
      this.endRecording(false)
    }
  }

  beginRecording() {
    const baseTime = performance.now();

    this.activeRecorders.clear();

    for (const plugin of this.plugins) {
      if (!this.isPluginActive[plugin.name]) continue;

      const recorder = new plugin.recorder(this.player);
      recorder.beginRecording(baseTime);
      this.activeRecorders.set(plugin, recorder);
    }

    if (this.activeRecorders.size === 0) alert('No recorders active!');

    this.setState({
      isRecording: true
    });
  }

  pauseRecording() {
    const time = performance.now();

    for (const plugin of this.plugins) {
      if (!this.isPluginActive[plugin.name]) continue;

      this.activeRecorders.get(plugin).pauseRecording(time);
    }

    this.setState({paused: true});
  }

  resumeRecording() {
    const time = performance.now();

    for (const plugin of this.plugins) {
      if (!this.isPluginActive[plugin.name]) continue;

      this.activeRecorders.get(plugin).resumeRecording(time);
    }

    this.setState({paused: false});
  }

  endRecording(save: boolean) {
    const time = performance.now();
    const recording = {};

    for (const plugin of this.plugins) {
      if (!this.isPluginActive[plugin.name]) continue;

      const promise = this.activeRecorders.get(plugin).endRecording(time);
      if (!save) continue;

      recording[plugin.name] = void 0;

      promise.then(value => {
        console.log('done recording ' + plugin.name);
        recording[plugin.name] = value;
        this.forceUpdate()
      });
    }

    this.setState({
      isRecording: false,
      recordings: save ? this.state.recordings.concat([recording]) : this.state.recordings
    });
  }

  togglePane() {
    this.setState({
      isPaneOpen: !this.state.isPaneOpen
    });
  }

  render() {
    const dialogStyle = {
      display: this.state.isPaneOpen ? 'block' : 'none'
    };

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

          <Player.Broadcaster>
            <h3>Configuration</h3>
            {this.plugins.map((plugin, i) => {
              const Component = plugin.configureComponent;
              const setPluginActive = (val: boolean) => this.isPluginActive[plugin.name] = val;
              return (<Component key={i} {...{setPluginActive}}/>);
            })}

            <h3>Saved data</h3>
            <ol className="recordings">
              {this.state.recordings.map((recording, i) => (
                <RecordingRow key={i} data={recording} pluginMap={this.pluginMap}/>
              ))}
            </ol>
          </Player.Broadcaster>
        </div>
        <svg onClick={this.togglePane} height="36" width="36" viewBox="-50 -50 100 100">
          <circle cx="0" cy="0" r="35" stroke="white" strokeWidth="5" fill={this.state.isRecording ? (this.state.paused ? "blue" : "red") : "#666"}/>
        </svg>
      </div>
    );
  }
}

interface RecordingRowProps {
  data: any;
  pluginMap: any;
}

class RecordingRow extends Player.Receiver<RecordingRowProps, {name: string}> {
  private player: Player;

  constructor(props: RecordingRowProps & {player: Player}) {
    super(props);
    this.player = props.player;
    console.log(this.props);

    this.state = {
      name: "Untitled"
    };
  }

  render() {
    const {data, pluginMap} = this.props;
    const receiveKeyInput = {
      onFocus: () => this.player.$controls.captureKeys = false,
      onBlur: () => this.player.$controls.captureKeys = true
    };

    return (
      <li className="recording-row">
        <input
          {...receiveKeyInput}
          className="recording-name"
          onChange={e => this.setState({name: e.target.value})}
          type="text" value={this.state.name}/>
        <table className="recording-results">
        <tbody>
          {Object.keys(data).map(pluginName => {
            const plugin = pluginMap[pluginName],
                  PluginComponent = plugin.saveComponent;

            return (
            <tr key={pluginName}>
              <PluginComponent data={data[pluginName]}/>
            </tr>);
          })}
        </tbody>
        </table>
      </li>
    );
  }
}