/// <reference types="chrome"/>
import * as React from "react";

import * as dom from "./utils/dom";
const {$, $$} = dom;

import {requestFullScreen, exitFullScreen, isFullScreen} from "./polyfills";

import {Player, Utils} from "ractive-player";
const {bind, waitFor} = Utils.misc;
const sleep = Utils.misc.wait;

type Change = [HTMLElement, string, string];

interface ApiDefinition {
  type: "apiDefinition";
  methodNames: string[];
}

interface ApiReturn {
  type: "apiReturn";
  callId: number;
  value: any;
}

interface Api {
  captureTab: Function;
}

type Message = ApiDefinition | ApiReturn;

interface State {
  paneOpen: boolean;
  sheets: string[];
}

declare const RACTIVE_GLOBAL: any;

const THUMB_OPTIONS = {
  cols: 5,
  rows: 5,
  height: 100,
  width: 160,
  frequency: 4
};

// the actual thingy that gets exported
export default class ThumbRecorder extends React.PureComponent<{}, State> {
  private player: Player;
  static contextType = Player.Context;

  private port: any;

  constructor(props: {}, context: Player) {
    super(props, context);
    this.player = context;

    bind(this, ["recordThumbs", "togglePane"]);

    // initial state
    this.state = {
      paneOpen: false,
      sheets: []
    };
  }

  componentDidMount() {
    if (!window.hasOwnProperty("RACTIVE_GLOBAL")) (window as any).RACTIVE_GLOBAL = {};

    RACTIVE_GLOBAL.Controls = RACTIVE_GLOBAL.Controls || {};
    RACTIVE_GLOBAL.Controls.ThumbRecorder = this;
  }

  async recordThumbs() {
    // XXX should have interface to specify this instead of hard-coding.
    const extensionId = "fljhedgmfkefnmfglilbcjhacefdkhbn";

    const wasFullScreen = isFullScreen();

    const api = await wrapPortMaster(chrome.runtime.connect(extensionId)) as Api;

    const {frequency} = THUMB_OPTIONS;

    const thumbs = [];

    requestFullScreen();
    await waitFor(() => isFullScreen());
    const oldState = hideUI();

    await sleep(6000);

    const {playback} = this.player;
    for (let t = 0, len = playback.duration; t <= len; t += frequency * 1000) {
      playback.seek(t);

      await sleep(100);

      thumbs.push(await api.captureTab());
    }

    if (!wasFullScreen) exitFullScreen();
    restoreUI(oldState);

    const sheets = await processThumbs(thumbs);

    this.setState({
      sheets
    });
  }

  togglePane() {
    this.setState({
      paneOpen: !this.state.paneOpen
    });
  }

  render() {
    const {paneOpen} = this.state;

    const dialogStyle = {
      display: paneOpen ? "block" : "none"
    };

    return (
      <div id="editor-thumb-recorder">
        <div id="saved-thumbs-dialog" style={dialogStyle}>
          <button onClick={this.recordThumbs}>Record</button>
          <div id="sheets">
            {this.state.sheets.map((sheet, i) => (
              <a key={i} href={sheet} download={`${i}.png`}>Sheet {i}</a>
            ))}
          </div>
        </div>
        <svg onClick={this.togglePane} height="36" width="36" viewBox="0 0 100 100">
          <path d="M 10 70 a 1,1 0 0,1 80,0 z" fill="#FFC0CB" stroke="#FFF" strokeWidth="7"/>
          <path d="M 35 66.5 a 1,1 0 0,1 30,0 z" fill="#FFE0EB" stroke="none"/>
        </svg>
      </div>
    );
  }
}

function wrapPortMaster(port: chrome.runtime.Port) {
  let callCounter = 0;
  const returnPromises = {};

  return new Promise((resolve, reject) => {
    port.onMessage.addListener((msg: Message) => {
      switch (msg.type) {
        // receive callable API methods
        case "apiDefinition":
          const api = {};
          
          msg.methodNames.forEach(name => {
            api[name] = (...args: any[]) => {
              const callId = callCounter++;
              port.postMessage({type: "apiCall", callId, methodName: name, arguments: args});
              return new Promise((resolve, reject) => {
                returnPromises[callId] = resolve;
              });
            };
          });

          Object.freeze(api);

          // return API
          resolve(api);
          break;

        // receive returned value from child
        case "apiReturn":
          const {callId} = msg;
          returnPromises[callId](msg.value);
          delete returnPromises[callId];
          break;
      }
    });

    port.postMessage({type: "establish"});
  });
}

function hideUI(): Change[] {
  const changes = [
    [$(".rp-controls"), "display", "none"],
    [$(".rp-canvas"), "cursor", "none"],
    [document.body, "cursor", "none"]
  ] as [HTMLElement, string, string][];

  for (let i = 0; i < changes.length; ++i) {
    const [elt, prop, val] = changes[i];

    changes[i][2] = elt.style[prop];

    elt.style[prop] = val;
  }

  return changes;
}

function restoreUI(oldState: Change[]) {
  for (const [elt, prop, val] of oldState) {
    elt.style[prop] = val;
  }
}

async function processThumbs(thumbs: string[]) {
  const {rows, cols, height, width} = THUMB_OPTIONS,
        count = rows * cols;

  const canvas = dom.elt("canvas");
  canvas.setAttribute("width", (width * cols).toString());
  canvas.setAttribute("height", (height * rows).toString());

  const ctx = canvas.getContext("2d");
  const sheets = [];

  for (let sheetNum = 0, len = Math.ceil(thumbs.length / count); sheetNum < len; ++sheetNum) {
    ctx.clearRect(0, 0, width * cols, height * rows);

    const sheetImgs = await Promise.all(
      thumbs
      .slice(sheetNum * count, (sheetNum + 1) * count)
      .map(dataURI => {
        return new Promise<HTMLImageElement>((resolve, reject) => {
          const img = dom.elt("img");
          img.onload = () => resolve(img);
          img.src = dataURI;
        });
      })
    );

    for (let i = 0; i < rows; ++i) {
      for (let j = 0; j < cols; ++j) {
        const index = i * cols + j;

        if (index >= sheetImgs.length) break;
        ctx.drawImage(sheetImgs[index], j * width, i * height, width, height);
      }
    }

    sheets.push(canvas.toDataURL("image/png"));
  }

  return sheets;
}
