import * as React from "react";

import {Player, Plugin, HookFunction, HookMap} from "ractive-player";

import dragFunctionality from "./draggable";
import {RecorderPlugin} from "./recorder";

import ObjectMap from "./object-map";
import ThumbRecorder from "./thumb-recorder";

import {RecorderComponent} from "./recorder";
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
        <div className="editor-controls" key="rpe">
          <ObjectMap/>
          <ThumbRecorder/>
          <RecorderComponent plugins={this.recorders}/>
        </div>
      );
    });

    dragFunctionality();
  }
}

export default new EditorPlugin();

export {draggable} from "./draggable";

export {Recorder, RecorderConfigureComponent, RecorderPlugin} from "./recorder";
