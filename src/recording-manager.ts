import {bind} from "@liqvid/utils/misc";
import {EventEmitter} from "events";
import type {Player} from "liqvid";
import type StrictEventEmitter from "strict-event-emitter-types";
import type {IntransigentReturn, Recorder} from "./recorder";
import type {RecorderPlugin} from "./types";

interface EventTypes {
  "cancel": void;
  "capture": (key: string, data: unknown) => void;
  "finalize": (key: string, data: unknown) => void;
  "pause": void;
  "resume": void;
  "start": void;
}

export class RecordingManager extends (EventEmitter as unknown as new () => StrictEventEmitter<EventEmitter, EventTypes>) {
  active: boolean;
  duration: number;
  paused: boolean;

  /**
  Time when recording began.
  */
  private baseTime: number;

  private captureData: {
    [key: string]: unknown[];
  };
  private player: Player;
  private plugins: RecorderPlugin[];

  private intransigentRecorder: Recorder;

  /**
  Time when last paused.
  */
  private lastPauseTime: number;

  /**
  Total duration that recording has been paused.
  */
  private pauseTime: number;

  constructor(player?: Player) {
    super();
    this.player = player;

    this.captureData = {};

    this.setMaxListeners(0);

    this.paused = false;
    this.active = false;

    bind(this, ["beginRecording", "endRecording", "pauseRecording", "resumeRecording", "capture"]);
  }

  beginRecording(plugins: RecorderPlugin[]) {
    this.plugins = plugins;

    // initialize
    this.pauseTime = 0;
    this.intransigentRecorder = void 0;

    // dependency injection for plugins
    for (const plugin of this.plugins) {
      const {recorder} = plugin;

      recorder.provide({
        push: (value: unknown) => this.capture(plugin.key, value),
        manager: this,
        player: this.player
      });
      
      this.captureData[plugin.key] = [];

      if (recorder.intransigent) {
        if (this.intransigentRecorder)
          throw new Error("At most one intransigent recorder is allowed");
        this.intransigentRecorder = recorder;
      }
    }

    // call this as close as possible to beginRecording() to minimize "lag"
    this.baseTime = performance.now();
    for (const plugin of this.plugins) {
      plugin.recorder.beginRecording();
    }

    this.paused = false;
    this.active = true;

    this.emit("start");
  }

  capture(key: string, value: unknown) {
    this.captureData[key].push(value);

    this.emit("capture", key, value);
  }

  /**
  End recording and collect finalized data from recorders.
  */
  async endRecording(): Promise<unknown> {
    const endTime = this.getTime();
    this.duration = endTime;
    const recording = {};

    let startDelay = 0,
        stopDelay = 0;

    let promise;

    // stop intransigentRecorder
    if (this.intransigentRecorder) {
      promise = this.intransigentRecorder.endRecording() as Promise<IntransigentReturn>;
    }

    // stop other recorders
    for (const plugin of this.plugins) {
      if (plugin.recorder === this.intransigentRecorder)
        continue;
      plugin.recorder.endRecording();
    }

    // get start/stop delays from intransigentRecorder
    if (this.intransigentRecorder) {
      try {
        const [startTime, stopTime] = await promise;
        startDelay = startTime;
        stopDelay = stopTime - endTime;      
        this.duration = this.duration + stopDelay - startDelay;
      } catch (e) {
        startDelay = 0;
        stopDelay = 0;
        console.error(e);
      }
    }

    // finalize
    for (const plugin of this.plugins) {
      recording[plugin.key] = plugin.recorder.finalizeRecording(this.captureData[plugin.key], startDelay, stopDelay);
      this.emit("finalize", plugin.key, recording[plugin.key]);
    }

    this.active = false;

    this.emit("finalize", undefined, undefined);

    return recording;
  }

  getTime() {
    return performance.now() - this.baseTime - this.pauseTime;
  }

  /**
  */
  pauseRecording() {
    this.lastPauseTime = performance.now();

    for (const plugin of this.plugins) {
      plugin.recorder.pauseRecording();
    }

    this.paused = true;
    this.emit("pause");
  }

  setPlayer(player: Player) {
    this.player = player;
  }
  
  /**
  Resume recording from paused state.
  */
  resumeRecording() {
    this.pauseTime += performance.now() - this.lastPauseTime;

    for (const plugin of this.plugins) {
      plugin.recorder.resumeRecording();
    }

    this.paused = false;
    this.emit("resume");
  }
}

// backwards compatibility
Object.defineProperty(RecordingManager.prototype, "hub", {get: function() {
  console.info(".hub is deprecated, RecordingManager now extends EventEmitter");
  return this;
}});
