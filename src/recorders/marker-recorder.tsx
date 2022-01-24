import * as React from "react";
import {useMemo, useState} from "react";

import {Recorder} from "../recorder";
import type {RecorderPlugin} from "../types";

import {Player, Utils} from "liqvid";
const {bind} = Utils.misc,
      {onClick} = Utils.mobile,
      {formatTimeMs} = Utils.time;

type Marker = [string, number];
type MarkerFormatted = [string, string];

const icon = (
  <text
    fill="#FFF" fontFamily="Helvetica" fontSize="75"
    textAnchor="middle" x="50" y="75">M</text>
);

export class MarkerRecorder extends Recorder<Marker, MarkerFormatted[]> {
  private cueCapture: Marker[];
  private lastTime: number;

  constructor() {
    super();
    bind(this, ["onMarkerUpdate"]);
  }

  beginRecording() {
    this.lastTime = 0;
    this.player.script.hub.on("markerupdate", this.onMarkerUpdate);
  }

  endRecording() {
    this.player.script.hub.off("markerupdate", this.onMarkerUpdate);
    this.captureMarker(this.player.script.markerName);
  }

  finalizeRecording(data: Marker[], startDelay: number, stopDelay: number) {
    data[0][1] -= startDelay;
    data[data.length - 1][1] += stopDelay;
    
    return data.map(cue => [cue[0], formatTimeMs(cue[1])] as MarkerFormatted);
  }

  onMarkerUpdate(prevIndex: number) {
    if (this.manager.paused)
      return;

    const {script} = this.player;

    this.captureMarker(script.markers[prevIndex][0]);
  }

  captureMarker(markerName: string) {
    const t = this.manager.getTime();
    this.push([markerName, t - this.lastTime]);

    this.lastTime = t;
  }
}

export function MarkerSaveComponent(props: {data: MarkerFormatted[]}) {
  return (
    <>
      <textarea readOnly value={format(props.data)}></textarea>
    </>
  );
}

export const MarkerRecorderPlugin: RecorderPlugin = {
  icon,
  key: "markers",
  name: "Markers",
  recorder: new MarkerRecorder,
  saveComponent: MarkerSaveComponent
};

function format(data: unknown) {
  return JSON.stringify(data, null, 2).replace(/\[\s+"(.+?)",\s+"(.+?)"\s+\]/g, "[\"$1\", \"$2\"]");
}
