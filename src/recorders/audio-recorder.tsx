import "../types/MediaRecorder";

import * as React from "react";
import {Recorder, RecorderPlugin, RecorderConfigureComponent, IntransigentReturn} from "../recorder";

interface RecordData {
  startDelay: number;
  stopDelay: number;
  url: string;
}

const audioIcon = (
  <svg x="0" y="10" height="80" viewBox="0 0 462.86 792.01">
    <g
      stroke="#FFF"
      transform="translate(-140.62 -173.21)"
    >
      <path
        d="m568.57 620.93c0 116.77-94.66 211.43-211.43 211.43s-211.43-94.66-211.43-211.43v-0.00001"
        fillOpacity="0"
        transform="translate(14.904)"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        d="m568.57 620.93c0 116.77-94.66 211.43-211.43 211.43s-211.43-94.66-211.43-211.43v-0.00001"
        fillOpacity="0"
        transform="translate(14.904)"
        strokeLinecap="round"
        strokeWidth="40"
      />
      <path
        d="m372.05 832.36v114.29"
        strokeWidth="30"
        fill="none"
      />
      <path
        fill="#FFF"
        d="m197.14 920.93c0.00001-18.935 59.482-34.286 132.86-34.286 73.375 0 132.86 15.35 132.86 34.286z"
        transform="translate(42.047 34.286)"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        fill="#FFF"
        strokeWidth="21.455"
        strokeLinecap="round"
        d="m372.06 183.94c-77.019-0.00001-139.47 62.45-139.47 139.47v289.62c0 77.019 62.45 139.47 139.47 139.47 77.019 0 139.44-62.45 139.44-139.47v-289.62c0-77.02-62.42-139.47-139.44-139.47z"
      />
    </g>
  </svg>
);

export class AudioRecorder implements Recorder {
  private recorder: MediaRecorder;
  private promise: Promise<IntransigentReturn>;

  private baseTime: number;
  private blob: Blob;

  private stream: MediaStream;
  private startTime: number;
  private endTime: number;

  private static stream: MediaStream;

  static intransigent = true;

  /* this is responsible for most of start delay */
  static init() {
    if (location.protocol !== "https:") return;
    
    try {
      navigator.mediaDevices.getUserMedia({audio: true}).then(stream => {
        this.stream = stream;
      });
    } catch (e) {
      console.log("no recording allowed");
    }
  }

  beginRecording(baseTime: number) {
    if (!AudioRecorder.stream)
      throw new Error("Navigator stream not available");
    if (document.location.protocol !== "https:")
      throw new Error("Page must be accessed via HTTPS in order to record audio");

    this.baseTime = baseTime;
    
    this.promise = new Promise(async (resolve, reject) => {
      // record the audio
      const chunks: Blob[] = [];
      this.recorder = new MediaRecorder(AudioRecorder.stream, {mimeType: "audio/webm"});

      // subscribe to events
      this.recorder.addEventListener("dataavailable", e => {
        chunks.push(e.data);
      });

      this.recorder.addEventListener("start", () => {
        this.startTime = performance.now();
      });

      this.recorder.addEventListener("stop", () => {
        const stopDelay = performance.now() - this.endTime;

        this.blob = new Blob(chunks, {type: "audio/webm"});

        resolve([this.startTime - baseTime, stopDelay]);
      });

      this.recorder.start();
    });
  }

  pauseRecording() {
    this.recorder.pause();
  }

  resumeRecording() {
    this.recorder.resume();
  }

  async endRecording(endTime: number) {
    this.endTime = endTime;
    this.recorder.stop();
    return this.promise;
  }

  finalizeRecording() {
    return URL.createObjectURL(this.blob);
  }
}
AudioRecorder.init();

export class AudioConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ["recorder-plugin-icon"];

    if (this.state.active)
      classNames.push("active");

    return (
      <div className="recorder-plugin" title="Record audio">
        <svg className={classNames.join(" ")} height="36" width="36" viewBox="0 0 100 100" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? "red" : "#222"}/>
          {audioIcon}
        </svg>
        <span className="recorder-plugin-name">Audio</span>
      </div>
    );
  }
}

export function AudioSaveComponent(props: {data: string}) {
  return (
    <>
      <th key="head" scope="row">
        <svg className="recorder-plugin-icon" height="36" width="36" viewBox="0 0 100 100">
          <rect height="100" width="100" fill="#222"/>
          {audioIcon}
        </svg>
      </th>
      <td key="cell">
        {props.data ?
          <>
            <a download="audio.webm" href={props.data}>Download Audio</a>
          </> :
          "Audio not yet available"
        }
      </td>
    </>
  );
}

export const AudioRecorderPlugin: RecorderPlugin = {
  name: "AudioRecorder",
  recorder: AudioRecorder,
  configureComponent: AudioConfigureComponent,
  saveComponent: AudioSaveComponent
};
