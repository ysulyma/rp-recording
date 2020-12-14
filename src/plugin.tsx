import * as React from "react";

import type {Broadcast, Plugin, HookFunction, HookMap} from "ractive-player";

import Control from "./Control";
import {AudioRecorderPlugin} from "./recorders/audio-recorder";
import {MarkerRecorderPlugin} from "./recorders/marker-recorder";

import type {RecorderPlugin} from "./types";

class EditorPlugin implements Plugin {
  private broadcast?: Broadcast;
  private recorders: RecorderPlugin[];

  constructor() {
    this.recorders = [AudioRecorderPlugin, MarkerRecorderPlugin];
  }

  addRecorder(...plugins: RecorderPlugin[]) {
    this.recorders.push(...plugins);
  }

  broadcastTo(broadcast: Broadcast) {
    this.broadcast = broadcast;
  }

  setup(hook: HookFunction<keyof HookMap>) {
    hook("classNames", () => "editor");

    hook("canvasClick", () => false);

    hook("controls", () => {
      return (
        <Control key="rp-recorder" broadcast={this.broadcast} plugins={this.recorders}/>
      );
    });
  }
}

export default new EditorPlugin();

export {Recorder} from "./recorder";
export {ReplayDataRecorder} from "./recorders/replay-data-recorder";
