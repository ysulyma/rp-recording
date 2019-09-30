import * as React from "react";
import {Player, Plugin, HookFunction, HookMap} from "ractive-player";

interface EditorPlugin extends Plugin {
	recorders: {};

  addRecorder(...plugins: RecorderPlugin[]): void;

	setup(hook: HookFunction<keyof HookMap>);
}

declare const RactiveEditor: EditorPlugin;

export default RactiveEditor;

export const draggable: {
	"data-ractive-editor-draggable": "yes";
}

export interface RecorderPlugin {
  name: string;
  recorder: {
    intransigent?: boolean;
    new(player: Player): Recorder;
  };
  configureComponent: typeof RecorderConfigureComponent;
  saveComponent: React.FC<{data: any}>;
}

export type IntransigentReturn = [number, number];

export interface Recorder {
  beginRecording(time: number): void;
  pauseRecording(time: number): void;
  resumeRecording(time: number): void;
  endRecording(time: number): Promise<IntransigentReturn> | void;
  finalizeRecording(startDelay: number, stopDelay: number): any;
}

export abstract class RecorderConfigureComponent extends React.PureComponent<{setPluginActive: (active: boolean) => void;}, {active: boolean;}> {
  toggleActive(): void;
}
