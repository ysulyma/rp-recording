import * as React from "react";

import type {Recorder} from "./recorder";

export interface RecorderPlugin {
  enabled?: () => boolean;
  icon: JSX.Element;
  name: string;
  recorder: Recorder;
  saveComponent: React.FC<{data: any}>;
  title?: string;
}
