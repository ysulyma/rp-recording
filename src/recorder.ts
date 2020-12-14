import type {Broadcast, Player, ReplayData} from "ractive-player";

import type RecordingManager from "./recording-manager";

export type IntransigentReturn = [number, number];

export abstract class Recorder<T = unknown, F = T[]> {
  protected manager: RecordingManager;
  protected player: Player;

  /**
  A recorder is intransigent if it cannot be started immediately (e.g. AudioRecorder).
  */
  intransigent = false;

  beginRecording() {}

  pauseRecording() {}

  resumeRecording() {}

  endRecording(): Promise<IntransigentReturn> | void {}

  finalizeRecording(data: T[], startDelay = 0, stopDelay = 0): F {
    return data as unknown as F;
  }

  push: (value: T) => void;

  provide({push, manager, player}: {
    push: (value: T) => void;
    manager: RecordingManager;
    player: Player;
  }) {
    this.push = push;
    this.manager = manager;
    this.player = player;
  }

  getUpdate(data: T[], lastDuration: number) {}
}
