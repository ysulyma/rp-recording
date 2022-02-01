import * as React from "react";
import {EventEmitter} from "events";
import StrictEventEmitter from "strict-event-emitter-types";
import {Player, ReplayData} from "liqvid";

export const RecordingControl: (props: {
  manager?: RecordingManager;
  plugins?: RecorderPlugin[];
}) => JSX.Element;

export type IntransigentReturn = [number, number];

export class RecordingManager {
  active: boolean;
  duration: number;
  paused: boolean;
  hub: StrictEventEmitter<EventEmitter, {
    "cancel": void;
    "capture": (key: string, data: unknown) => void;
    "finalize": (key: string, data: unknown) => void;
    "pause": void;
    "resume": void;
    "start": void;
  }>;

  constructor(player?: Player);
  beginRecording(plugins: RecorderPlugin[]): void;
  capture<T>(key: string, value: unknown): void;
  endRecording(): Promise<{
    [key: string]: unknown;
  }>;
  getTime(): number;
  pauseRecording(): void;
  resumeRecording(): void;
  setPlayer(player: Player): void;
}

export class Recorder<T = unknown> {
  protected manager: RecordingManager;
  protected player: Player;

  intransigent: boolean;

  beginRecording(): void;
  pauseRecording(): void;
  resumeRecording(): void;
  endRecording(): Promise<IntransigentReturn> | void;
  finalizeRecording(startDelay: number, stopDelay: number): unknown;  
  push(value: T): void;
}

export class ReplayDataRecorder<T> extends Recorder<ReplayData<T>> {
  capture(time: number, value: T): void;
}

export type RecorderConfigureComponent = React.ComponentType<{
  setPluginActive: (active: boolean) => void;
}>;

export interface RecorderPlugin<T = unknown> {
  icon: JSX.Element;
  name: string;
  recorder: Recorder<T>;
  saveComponent: React.ComponentType<{data: unknown}>;
}

export const AudioRecorderPlugin: RecorderPlugin<Blob>;
export const MarkerRecorderPlugin: RecorderPlugin<[string, number]>;
