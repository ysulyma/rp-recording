import * as React from 'react';

import {Recorder, RecorderConfigureComponent, RecorderPlugin} from '../recorder';

import {Player} from 'ractive-player';

const playIcon = (
 <path d="M 12,26 18.5,22 18.5,14 12,10 z M 18.5,22 25,18 25,18 18.5,14 z" fill="white"/>
);

export class PlayRecorder implements Recorder {
  private player: Player;

  constructor(player: Player) {
    this.player = player;
  }

  beginRecording(baseTime: number) {
    this.player.playback.play();
  }

  async endRecording() {
    this.player.playback.pause();
  }

  pauseRecording() {}
  resumeRecording() {}
}

export class PlayConfigureComponent extends RecorderConfigureComponent {
  render() {
    const classNames = ['recorder-plugin-icon']

    if (this.state.active)
      classNames.push('active');

    return (
      <div className="recorder-plugin" title="Play video when recording starts">
        <svg className={classNames.join(' ')} height="36" width="36" viewBox="0 0 36 36" onClick={this.toggleActive}>
          <rect height="100" width="100" fill={this.state.active ? 'red' : '#222'}/>
          {playIcon}
        </svg>
        <span className="recorder-plugin-name">Play</span>
      </div>
    );
  }
}

export function PlaySaveComponent(): null {
  return null;
}

export const PlayRecorderPlugin = {
  name: "PlayRecorder",
  recorder: PlayRecorder,
  configureComponent: PlayConfigureComponent,
  saveComponent: PlaySaveComponent
};
