import * as React from 'react';

import {on, off} from './utils/events';

import {aspectRatio, Utils} from 'ractive-player';

const {bind} = Utils.misc;

interface State {
  paths: any[];
  pathsPaneOpen: boolean;
  recording: boolean;
}

// the actual thingy that gets exported
export default class BrushRecorder extends React.PureComponent<{}, State> {
  private captureData: any[];
  private mousemoveCallback: Function;

  private lastX: number;
  private lastY: number;
  private motions: [number, number][];

  constructor(props) {
    super(props);

    bind(this, ['onKeyDown', 'onMouseMove', 'togglePane']);

    // initial state
    this.state = {
      paths: [],
      pathsPaneOpen: false,
      recording: false
    };
  }

  componentDidMount() {
    on(document.body, 'keydown', this.onKeyDown);
  }

  togglePane() {
    this.setState({
      pathsPaneOpen: !this.state.pathsPaneOpen
    });
  }

  onKeyDown(e: KeyboardEvent) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (e.key.toLowerCase() !== 'c') return;

    if (this.state.recording) {
      off(document.body, 'mousemove', this.onMouseMove);

      this.setState({recording: false});
    } else {
      this.path = <ShowPath stroke="blue"/>;

      // begin new capturing
      SHARED.setCanvasState({
        content: [this.path]
      });
      on(document.body, 'mousemove', this.onMouseMove);

      this.setState({recording: true});
    }
  }

  onMouseMove(e: MouseEvent) {
    const dx = e.clientX - this.lastX,
          dy = e.clientY - this.lastY;

    window.path = this.path;

    // this.path.pushPath(dx, dy);
  }

  render() {
    const {paths, pathsPaneOpen} = this.state;

    const dialogStyle = {
      display: pathsPaneOpen ? 'block' : 'none'
    };

    return (
      <div id="editor-brush-recorder">
{/*        <div id="saved-paths">
          <div id="saved-paths-dialog" style={dialogStyle}>
            <ol>
              {paths.map((path, i) => (
                <li key={i}>
                  <svg onClick={() => this.replayMouse(path)} viewBox="0 0 100 100">
                    <rect fill="#af1866" x="0" y="0" height="100" width="100"/>
                    <path d="M 20 80 L 20 20 L 80 50 z" fill="white"/>
                  </svg>
                  <progress value="0" max="100"></progress>
                  <button onClick={() => console.log(JSON.stringify(path))}>Copy</button>
                </li>
              ))}
            </ol>
          </div>
        </div>*/}
        <svg height="36" width="36" viewBox="0 0 100 100">
          <circle fill={this.state.recording ? 'green' : 'pink'} cx="50" cy="50" r="30" stroke="#FFF" strokeWidth="5"/>
        </svg>
      </div>
    );
  }
}

class ShowPath extends React.Component<any, any> {
  constructor(props) {
    super(props);

    this.state = {
      path: []
    };
  }

  pushPath(x, y) {
    const path = this.state.path;
    path.push([x, y]);

    this.setState({
      path: path
    });
  }

  render() {
    const d = [
      'M 0 0',
      this.state.path.map(([dx, dy]) => `l ${dx} ${dy}`)
    ].join(' ');

    return (
      <svg height="500" viewBox="0 0 100 100">
        <path d={d} stroke="blue" fill="none"/>
      </svg>
    );
  }
}

function pp(o: Object) {
  console.log(JSON.stringify(o, null, 2));
}
