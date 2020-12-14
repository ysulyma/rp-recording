import * as React from "react";
import {useMemo, useState} from "react";

import {Recorder} from "../recorder";

import {Player, Utils} from "ractive-player";
const {bind} = Utils.misc,
      {onClick} = Utils.mobile,
      {formatTimeMs, parseTime} = Utils.time;
import type {ReplayData} from "ractive-player";

export class ReplayDataRecorder<T> extends Recorder<[number, T]> {
  private duration: number;

  constructor() {
    super();
    this.duration = 0;
    this.index = 0;
  }

  finalizeRecording(data: ReplayData<T>, startDelay = 0, stopDelay = 0) {
    for (let sum = 0, i = 0; i < data.length && sum < startDelay; ++i) {
      const dur = data[i][0];
      
      if (dur === 0) {
        continue;
      }
      if (sum + dur >= startDelay) {
        data[i][0] -= startDelay - sum;
        break;
      }
      sum += dur;
      data.splice(i, 1);
      --i;
    }

    return data;
  }

  capture(time: number, data: T) {
    this.push([time - this.duration, data]);
    this.duration = time;
  }

  getUpdate(data: ReplayData<T>) {
    const update = data.slice(this.index);
    this.index = data.length-1;
    return update;
  }
}

/**
Limit number to 2 decimal places to reduce filesize.
*/
function formatNum(x: number): number {
  return parseFloat(x.toFixed(2));
}
