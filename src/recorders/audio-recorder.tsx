// XXX BOOO
type MediaRecorder = any;
type BlobEvent = any;

declare const MediaRecorder: MediaRecorder;

import * as React from 'react';
import {Recorder, RecorderPlugin, RecorderConfigureComponent} from '../recorder';
import {on} from '../utils/events';

type Cue = [string, string];

interface AudioRecorderState {
  paneOpen: boolean;
  recording: boolean;
  files: string[];
  cues: Cue[][];
}

const audioIcon = (
  <svg x="0" y="10" height="80" viewBox="0 0 462.86 792.01">
    <g
      stroke="#FFF"
      transform="translate(-140.62 -173.21)"
    >
      <path
        opacity=".99"
        d="m568.57 620.93c0 116.77-94.66 211.43-211.43 211.43s-211.43-94.66-211.43-211.43v-0.00001"
        fillOpacity="0"
        transform="translate(14.904)"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        opacity=".99"
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
        opacity=".99"
        d="m197.14 920.93c0.00001-18.935 59.482-34.286 132.86-34.286 73.375 0 132.86 15.35 132.86 34.286z"
        transform="translate(42.047 34.286)"
        strokeLinecap="round"
        strokeWidth="20"
      />
      <path
        fill="#FFF"
        opacity=".99"
        strokeWidth="21.455"
        strokeLinecap="round"
        d="m372.06 183.94c-77.019-0.00001-139.47 62.45-139.47 139.47v289.62c0 77.019 62.45 139.47 139.47 139.47 77.019 0 139.44-62.45 139.44-139.47v-289.62c0-77.02-62.42-139.47-139.44-139.47z"
      />
    </g>
  </svg>
);

export class AudioRecorder implements Recorder {
  private recorder: MediaRecorder;
  private promise: Promise<string>;

  beginRecording(baseTime: number) {
    if (document.location.protocol !== 'https:') alert("Page must be accessed via HTTPS in order to record audio");
    
    this.promise = new Promise(async (resolve, reject) => {
      // record the audio
      const stream = await navigator.mediaDevices.getUserMedia({audio: true});

      const chunks: Blob[] = [];
      this.recorder = new MediaRecorder(stream);

      // subscribe to events
      on(this.recorder, 'dataavailable', (e: BlobEvent) => {
        chunks.push(e.data);
      });

      on(this.recorder, 'stop', () => {
        const blob = new Blob(chunks, {type: 'audio/webm'});

        resolve(URL.createObjectURL(blob));
      });

      // start recording with 1 second time between receiving 'ondataavailable' events
      this.recorder.start(1000);
    });
  }

  pauseRecording() {
    this.recorder.pause();
  }

  resumeRecording() {
    this.recorder.resume();
  }

  async endRecording() {
    this.recorder.stop();
    return this.promise;
  }
}

export class AudioConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ['recorder-plugin-icon']

    if (this.state.active)
      classNames.push('active');

    return (
      <div className="recorder-plugin" title="Record audio">
        <svg className={classNames.join(' ')} height="36" width="36" viewBox="0 0 100 100" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? 'red' : '#222'}/>
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
          <a download="audio.webm" href={props.data}>Download Audio</a> :
          "Audio not yet available"
        }
      </td>
    </>
  );
}

export const AudioRecorderPlugin = {
  name: "AudioRecorder",
  recorder: AudioRecorder,
  configureComponent: AudioConfigureComponent,
  saveComponent: AudioSaveComponent
};

