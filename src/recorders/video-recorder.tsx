import {IntransigentReturn, Recorder} from "../recorder";
import type {RecorderPlugin} from "../types";

interface RecordData {
  startDelay: number;
  stopDelay: number;
  url: string;
}

const icon = (
  <path fill="#FFF" stroke="#FFF" strokeWidth="1.0918" d="M38.186 22.503a5.694 5.694 0 0 0-5.706 5.706c0 .592.09 1.161.255 1.697H18.6a8.037 8.037 0 0 0-8.054 8.054v31.483a8.036 8.036 0 0 0 8.054 8.054h62.8a8.036 8.036 0 0 0 8.054-8.054V37.96a8.036 8.036 0 0 0-8.054-8.054H66.204a5.738 5.738 0 0 0 .255-1.697 5.694 5.694 0 0 0-5.707-5.706zM50.112 40.69a13.477 13.477 0 0 1 13.48 13.471v.005a13.477 13.477 0 0 1-13.475 13.477A13.477 13.477 0 0 1 36.639 54.17a13.477 13.477 0 0 1 13.473-13.48zm0 6.11a7.224 7.224 0 0 0-7.222 7.225 7.224 7.224 0 0 0 7.225 7.223 7.224 7.224 0 0 0 7.223-7.224v-.003a7.224 7.224 0 0 0-7.226-7.22z"/>
);

export class VideoRecorder extends Recorder<Blob, Blob> {
  private mediaRecorder: MediaRecorder;
  private promise: Promise<IntransigentReturn>;

  private baseTime: number;
  private blob: Blob;

  stream: MediaStream;
  private startTime: number;
  private endTime: number;

  intransigent = true;

  constructor() {
    super();
    const requestRecording = async function(){
      // Only need to do this once...
      window.removeEventListener("click", requestRecording);
      try {
        this.stream = await navigator.mediaDevices.getUserMedia({audio: true, video: true});
      } catch (e) {
        // User said no or browser rejected request due to insecure context
        console.log("no recording allowed");
      }
    }.bind(this);

    // Need user interaction to request media
    window.addEventListener("click", requestRecording);
  }

  beginRecording() {
    if (!this.stream)
      throw new Error("Navigator stream not available");
    
    this.promise = new Promise(async (resolve) => {
      // record the audio
      this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: "video/webm"});

      // subscribe to events
      this.mediaRecorder.addEventListener("dataavailable", e => {
        this.push(e.data);
      });

      let startDelay: number;
      this.mediaRecorder.addEventListener("start", () => {
        startDelay = this.manager.getTime();
      });

      this.mediaRecorder.addEventListener("stop", () => {
        resolve([startDelay, this.manager.getTime()]);
      });

      this.mediaRecorder.start();
    });
  }

  pauseRecording() {
    this.mediaRecorder.pause();
  }

  resumeRecording() {
    this.mediaRecorder.resume();
  }

  async endRecording() {
    this.mediaRecorder.stop();
    return this.promise;
  }

  finalizeRecording(chunks: Blob[]) {
    return new Blob(chunks, {type: "video/webm"});
  }
}

export function VideoSaveComponent(props: {data: Blob}) {
  return (
    <>
      {props.data ?
        <a download="video.webm" href={URL.createObjectURL(props.data)}>Download Video</a>
        :
        "Video not yet available"
      }
    </>
  );
}

const recorder = new VideoRecorder();
export const VideoRecorderPlugin: RecorderPlugin = {
  enabled: () => typeof recorder.stream !== "undefined",
  icon,
  key: "video",
  name: "Video",
  recorder,
  saveComponent: VideoSaveComponent,
  title: "Record video"
};
