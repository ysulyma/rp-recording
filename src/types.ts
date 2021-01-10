import * as React from "react";

import type {Recorder} from "./recorder";

export interface RecorderPlugin {
  enabled?: () => boolean;
  icon: JSX.Element;
  key: string;
  name: string;
  recorder: Recorder;
  saveComponent: React.FC<{data: any}>;
  title?: string;
}
