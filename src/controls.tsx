import * as React from 'react';

import ThumbRecorder from './thumb-recorder';
import ObjectMap from './object-map';

// recorders
import {RecorderComponent} from './recorder';

import {AudioRecorderPlugin} from './recorders/audio-recorder';
import {CursorRecorderPlugin} from './recorders/cursor-recorder';
import {CueRecorderPlugin} from './recorders/cue-recorder';
import {KeyRecorderPlugin} from './recorders/key-recorder';
import {InputRecorderPlugin} from './recorders/input-recorder';
import {PlayRecorderPlugin} from './recorders/play-recorder';
import {StateRecorderPlugin} from './recorders/state-recorder';

import {$$} from './utils/dom';

import {Player, Utils} from 'ractive-player';
const {bind, constrain} = Utils.misc,
      {formatTimeMs} = Utils.time;

export default class EditorControls extends Player.PureReceiver {
  $recorderComponent: RecorderComponent;

  componentDidMount() {
    const {playback} = this.props.player;

    playback.hub.on('seek', () => this.forceUpdate());
    playback.hub.on('timeupdate', () => this.forceUpdate());
  }

  render() {
    const {playback, script} = this.props.player;

    const since = script.slides[script.slideIndex][1];
    const activeAudio = $$('audio').filter(audio => !audio.paused)[0];
    const audioProgress = activeAudio ? activeAudio.currentTime * 1000 : 0;

    return (
      <div className="editor-controls">
        <Player.Broadcaster>
          {false && <span className="rp-audio-progress">{formatTimeMs(audioProgress)}</span>}
          {<span className="rp-duration">{formatTimeMs(playback.currentTime - since)}</span>}
          <span className="rp-controls-slidename">
            {script.slideName}
          </span>
          <ObjectMap/>
          <ThumbRecorder/>
          <RecorderComponent
            ref={$component => this.$recorderComponent = $component}
            plugins={[
              CueRecorderPlugin, AudioRecorderPlugin, CursorRecorderPlugin,
              KeyRecorderPlugin, InputRecorderPlugin, PlayRecorderPlugin,
              StateRecorderPlugin]}/>
        </Player.Broadcaster>
      </div>
    );
  }
}
