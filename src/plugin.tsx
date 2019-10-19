import * as React from "react";

import {Plugin, HookFunction, HookMap} from "ractive-player";

import {RecorderComponent, RecorderPlugin} from "./recorder";
import {AudioRecorderPlugin} from "./recorders/audio-recorder";
import {CueRecorderPlugin} from "./recorders/cue-recorder";

class EditorPlugin implements Plugin {
  private recorders: RecorderPlugin[];

  constructor() {
    this.recorders = [AudioRecorderPlugin, CueRecorderPlugin];
  }

  addRecorder(...plugins: RecorderPlugin[]) {
    this.recorders.push(...plugins);
  }

  setup(hook: HookFunction<keyof HookMap>) {
    hook("classNames", () => "editor");

    hook("canvasClick", () => false);

    hook("controls", () => {
      return (
        <RecorderComponent key="rp-recorder" plugins={this.recorders}/>
      );
    });
  }
}

export default new EditorPlugin();

export {Recorder, RecorderConfigureComponent, RecorderPlugin} from "./recorder";
