import {Player, Utils} from "ractive-player";
const {bind} = Utils.misc;
import type {Broadcast, ReplayData} from "ractive-player";

import {EventEmitter} from "events";
import type StrictEventEmitter from "strict-event-emitter-types";

import type {IntransigentReturn, Recorder} from "./recorder";
import type {RecorderPlugin} from "./types";

interface EventTypes {
  "activechange": boolean;
  "pausedchange": boolean;
}

export default class RecordingManager {
  /**
  Time when recording began.
  */
  private baseTime: number;

  private broadcast?: Broadcast;

  private captureData: {
    [key: string]: unknown[];
  }
  private player: Player;
  private plugins: RecorderPlugin[];

  hub: StrictEventEmitter<EventEmitter, EventTypes>;

  private intransigentRecorder: Recorder;

  /**
  Time when last paused.
  */
  private lastPauseTime: number;

  /**
  Total duration that recording has been paused.
  */
  private pauseTime: number;

  private __paused: boolean;
  private __active: boolean;

  private pollTimeout: number;

  /**
  Last duration we pushed to the server.
  */
  lastBroadcastDuration: number;

  constructor(player: Player) {
    this.player = player;

    this.captureData = {};

    this.hub = new EventEmitter() as StrictEventEmitter<EventEmitter, EventTypes>;
    this.hub.setMaxListeners(0);

    this.__paused = false;
    this.__active = false;

    bind(this, ["beginRecording", "endRecording", "pauseRecording", "resumeRecording", "capture", "poll"]);
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
        push: (value: unknown) => this.capture(plugin, value),
        manager: this,
        player: this.player
      });
      
      this.captureData[plugin.name] = [];

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

    if (this.broadcast) {
      this.broadcast.start()
      .then(() => requestAnimationFrame(this.poll));
    }
    this.paused = false;
    this.active = true;
  }

  capture<T>(plugin: RecorderPlugin, value: unknown) {
    this.captureData[plugin.name].push(value);
  }

  /**
  @param broadcast
  */
  broadcastTo(broadcast: Broadcast) {
    this.broadcast = broadcast;
    this.lastBroadcastDuration = 0;
  }

  async poll() {
    const duration = this.getTime();
    const update = {};
    for (const plugin of this.plugins) {
      update[plugin.name] = plugin.recorder.getUpdate(this.captureData[plugin.name], this.lastBroadcastDuration);
    }
    this.lastBroadcastDuration = await this.broadcast.push(duration, update);

    if (this.active)
      window.setTimeout(this.poll, 100);
  }

  /**
  @param save True to save the recording, false to discard it.
  */
  async endRecording(): Promise<any> {
    const endTime = this.getTime();
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
      const [startTime, stopTime] = await promise;
      startDelay = startTime;
      stopDelay = stopTime - endTime;      
    }

    // finalize
    for (const plugin of this.plugins) {
      recording[plugin.name] = plugin.recorder.finalizeRecording(this.captureData[plugin.name], startDelay, stopDelay);
    }

    // clean up
    this.active = false;

    return recording;
  }

  /**
  Whether recording is currently paused.
  */
  get paused() {
    return this.__paused;
  }

  set paused(paused) {
    if (paused === this.__paused)
      return;

    this.__paused = paused;
    this.hub.emit("pausedchange", this.__paused);
  }

  /**
  Whether recording is in progress.
  */
  get active() {
    return this.__active;
  }

  set active(active) {
    if (active === this.__active)
      return;

    this.__active = active;
    this.hub.emit("activechange", this.__active);
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
  }
}
