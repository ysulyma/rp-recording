import * as React from "react";
import {Recorder, RecorderConfigureComponent, RecorderPlugin} from "../recorder";

import {Player, Utils} from "ractive-player";
const {bind} = Utils.misc,
      {formatTimeMs, parseTime} = Utils.time;

type Cue = [string, number];
type CueFormatted = [string, string];

const cueIcon = (
  <text
    fill="#FFF" fontFamily="Helvetica" fontSize="75"
    textAnchor="middle" x="50" y="75">Q</text>
);

export class CueRecorder implements Recorder {
  private player: Player;

  private captureStart: number;

  private pauseTime: number;
  private lastPauseTime: number;
  private paused: boolean;

  private cueCapture: Cue[];
  private lastTime: number;

  constructor(player: Player) {
    this.player = player;

    bind(this, ["onKeyDown"]);
  }

  beginRecording(time: number) {
    this.cueCapture = [];
    this.lastTime = 0;

    this.captureStart = time;
    this.paused = false;
    this.pauseTime = 0;

    document.body.addEventListener("keydown", this.onKeyDown);
  }

  pauseRecording(time: number) {
    this.paused = true;
    this.lastPauseTime = time;
  }

  resumeRecording(time: number) {
    this.pauseTime += time - this.lastPauseTime;
    this.paused = false;
  }

  endRecording(time: number) {
    document.body.removeEventListener("keydown", this.onKeyDown);
    this.captureCues(time, this.player.script.markerName);
  }

  finalizeRecording(startDelay: number, stopDelay: number) {
    this.cueCapture[0][1] -= startDelay;
    this.cueCapture[this.cueCapture.length - 1][1] += stopDelay;
    
    return this.cueCapture.map(cue => [cue[0], formatTimeMs(cue[1])]);
  }

  onKeyDown(e: KeyboardEvent) {
    const t = performance.now();
    if (this.paused) return;

    const {script} = this.player;
    if (!this.player.controls.captureKeys) return;

    if (e.key.toLowerCase() === "e")
      this.captureCues(t, script.markers[script.markerIndex - 1][0]);
  }

  captureCues(time: number, markerName: string) {
    const t = time - this.captureStart - this.pauseTime;
    this.cueCapture.push([markerName, t - this.lastTime]);

    this.lastTime = t;
  }
}

export class CueConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ["recorder-plugin-icon"];

    if (this.state.active)
      classNames.push("active");

    return (
      <div className="recorder-plugin" title="Record cues">
        <svg className={classNames.join(" ")} height="36" width="36" viewBox="0 0 100 100" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? "red" : "#222"}/>
          {cueIcon}
        </svg>
        <span className="recorder-plugin-name">Cues</span>
      </div>
    );
  }
}

export function CueSaveComponent(props: {data: CueFormatted[]}) {
  return (
    <>
      <th key="head" scope="row">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100">
          <rect height="100" width="100" fill="#222"/>
          {cueIcon}
        </svg>
      </th>
      <td key="cell">
        <textarea readOnly value={JSON.stringify(props.data)}></textarea>
      </td>
    </>
  );
}

export const CueRecorderPlugin = {
  name: "CueRecorder",
  recorder: CueRecorder,
  configureComponent: CueConfigureComponent,
  saveComponent: CueSaveComponent
};

function format(data: any) {
  return JSON.stringify(data, null, 2).replace(/\[\s+"(.+?)",\s+"(.+?)"\s+\]/g, "[\"$1\", \"$2\"]");
}
