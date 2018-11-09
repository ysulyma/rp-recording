import * as React from 'react';

import {Player, Plugin} from 'ractive-player';

import EditorControls from './controls';
import dragFunctionality from './draggable';

class EditorPlugin {
  constructor() {
    this.recorders = {}
  }

  setup(hook) {
    hook('classNames', () => 'editor');

    hook('canvasClick', () => false);

    hook('controls', () => {
      return (
        <EditorControls key="rpe"/>
      );
    });

    dragFunctionality();
  }
}

export default new EditorPlugin();
