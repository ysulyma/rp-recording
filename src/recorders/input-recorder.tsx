import * as React from 'react';

import {Recorder, RecorderPlugin, RecorderConfigureComponent} from '../recorder';

import {Player} from 'ractive-player';

import {on, off} from '../utils/events';

type CaptureDatum = [number, any];
type FormElement = HTMLInputElement | HTMLTextAreaElement;

const inputIcon = (
  <text
    fill="#FFF" fontFamily="Helvetica" fontSize="75"
    textAnchor="middle" x="50" y="75">I</text>
);

const targetsSym = Symbol.for("InputRecorder targets");
const listenerSym = Symbol.for("InputRecorder listener");

export class InputRecorder implements Recorder {
  private inputs: FormElement[];

  private captureData: Map<FormElement, CaptureDatum[]>;
  
  private captureStart: number;
  private pauseTime: number;
  private lastPauseTime: number;
  private paused: boolean;

  constructor(player: Player) {
    this.inputs = player[targetsSym];
  }

  beginRecording(baseTime: number) {
    // begin new capturing
    this.captureData = new Map();
    this.captureStart = baseTime;
    this.pauseTime = 0;
    this.paused = false;

    for (const input of this.inputs) {
      const events = [[0, input.value]] as CaptureDatum[];
      this.captureData.set(input, events);

      const listener = () => events.push([this.getTime(), input.value]);
      input[listenerSym] = listener;
      on(input, "input", listener);
    }
  }

  pauseRecording(time: number) {
    this.paused = true;
    this.lastPauseTime = time;
  }

  resumeRecording(time: number) {
    this.pauseTime += time - this.lastPauseTime;
    this.paused = false;
  }

  async endRecording(): Promise<any> {
    const ret = [];
    for (const input of this.inputs) {
      ret.push(this.captureData.get(input));
      off(input, "input", input[listenerSym]);
    }
    return ret;
  }

  getTime() {
    return parseFloat((performance.now() - this.captureStart - this.pauseTime).toFixed(2));
  }
}

export class InputConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ['recorder-plugin-icon']

    if (this.state.active)
      classNames.push('active');

    return (
      <div className="recorder-plugin" title="Record input">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? 'red' : '#222'}/>
          {inputIcon}
        </svg>
        <span className="recorder-plugin-name">Input</span>
      </div>
    );
  }
}

export function InputSaveComponent(props: {data: CaptureDatum[][]}) {
  return (
    <>
      <th key="head" scope="row">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100">
          {inputIcon}
        </svg>
      </th>
      <td key="cell">
        {props.data ?
          <textarea readOnly value={JSON.stringify(props.data)}></textarea> :
          "Input data not yet available."
        }
      </td>
    </>
  );
}

export const InputRecorderPlugin = {
  name: "InputRecorder",
  recorder: InputRecorder,
  configureComponent: InputConfigureComponent,
  saveComponent: InputSaveComponent
};
