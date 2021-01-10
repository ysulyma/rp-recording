import * as React from "react";

export type {RecorderPlugin} from "./types";

import RecordingControl from "./Control";
export {RecordingControl};

import RecordingManager from "./recording-manager";
export {RecordingManager};

export {Recorder} from "./recorder";
export {ReplayDataRecorder} from "./recorders/replay-data-recorder";

export {AudioRecorderPlugin} from "./recorders/audio-recorder";
export {MarkerRecorderPlugin} from "./recorders/marker-recorder";
