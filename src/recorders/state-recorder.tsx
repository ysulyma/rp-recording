import * as React from "react";

import {Recorder, RecorderPlugin, RecorderConfigureComponent} from "../recorder";

import {Player} from "ractive-player";

type CaptureDatum = [number, object];

const stateIcon = (
  <text
    fill="#FFF" fontFamily="Helvetica" fontSize="75"
    textAnchor="middle" x="50" y="75">R</text>
);

const targetsSym = Symbol.for("StateRecorder targets");
const listenerSym = Symbol.for("StateRecorder listener");

export class StateRecorder implements Recorder {
  private captureData: Map<React.Component, CaptureDatum[]>;
  private components: React.Component[];

  private captureStart: number;
  private pauseTime: number;
  private lastPauseTime: number;
  private paused: boolean;

  constructor(player: Player) {
    this.components = player[targetsSym];
  }

  beginRecording(time: number) {
    // begin new capturing
    this.captureData = new Map();
    this.captureStart = time;
    this.pauseTime = 0;
    this.paused = false;

    for (const component of this.components) {
      const events = [[0, component.state]] as CaptureDatum[];
      this.captureData.set(component, events);

      const listener = (state: object) => events.push([this.getTime(), state]);
      component[listenerSym] = listener;
    }
  }

  async endRecording(): Promise<any> {
    const ret = [];
    for (const component of this.components) {
      ret.push(this.captureData.get(component));
      delete component[listenerSym];
    }
    return ret;
  }

  pauseRecording(time: number) {
    this.paused = true;
    this.lastPauseTime = time;
  }

  resumeRecording(time: number) {
    this.pauseTime += time - this.lastPauseTime;
    this.paused = false;
  }

  getTime() {
    return parseFloat((performance.now() - this.captureStart - this.pauseTime).toFixed(2));
  }
}

export class StateConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ["recorder-plugin-icon"];

    if (this.state.active)
      classNames.push("active");

    return (
      <div className="recorder-plugin" title="Record state of React component">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? "red" : "#222"}/>
          {stateIcon}
        </svg>
        <span className="recorder-plugin-name">State</span>
      </div>
    );
  }
}

export function StateSaveComponent(props: {data: CaptureDatum[][]}) {
  return (
    <>
      <th key="head" scope="row">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100">
          {stateIcon}
        </svg>
      </th>
      <td key="cell">
        {props.data ?
          <textarea readOnly value={JSON.stringify(props.data)}></textarea> :
          "State data not yet available."
        }
      </td>
    </>
  );
}

export const StateRecorderPlugin = {
  name: "StateRecorder",
  recorder: StateRecorder,
  configureComponent: StateConfigureComponent,
  saveComponent: StateSaveComponent
};
