import * as React from 'react';

import {Utils} from 'ractive-player';
const {bind} = Utils.misc;

import {$} from './utils/dom';

const STYLES = [
  'left', 'top', 'position', 'height', 'width'
];

// this is a disgrace
export default class ObjectMap extends React.PureComponent<{}, {data: any, paneOpen: boolean}> {
  constructor(props: {}) {
    super(props);

    bind(this, ['copyData', 'togglePane']);

    // initial state
    this.state = {
      data: {},
      paneOpen: false
    };
  }

  async copyData() {
    const map = window[Symbol.for('XXX hack IdMap')];

    if (!map) {
      console.log("This feature is still a hacky mess. Must set window[@XXX hack IdMap]");
      return;
    }

    const data = {};

    for (const id of Object.keys(map).sort()) {
      const node = $(`#${id}`) as HTMLElement | SVGElement;

      data[id] = node ? reactify(node) : map[id];
    }

    const id32 = document.location.pathname.split('/')[2];

    const file = await fetch(`/d/editor/${id32}/save_object`, {
      body: JSON.stringify(data),
      headers: [
        ['Content-Type', 'application/json'],
        ["X-Requested-With", "XMLHttpRequest"],
        ["X-CSRF-Token", window.csrfToken]
      ],
      method: 'POST'
    });
    const text = await file.text();

    console.log(text);
    // this.setState({data});
  }

  togglePane() {
    this.setState({
      paneOpen: !this.state.paneOpen
    });
  }

  render() {
    const {paneOpen} = this.state;

    const dialogStyle = {
      display: paneOpen ? 'block' : 'none'
    };

    return (
      <div id="editor-objects-thing">
        <div id="editor-objects-dialog" style={dialogStyle}>
          <textarea readOnly value={JSON.stringify(this.state.data, null, 2)}/>
          <button onClick={this.copyData}>Update data</button>
        </div>
        <svg onClick={this.togglePane} height="36" width="36" viewBox="0 0 100 100">
          <text dominantBaseline="middle" fill="#FFF" fontFamily="Verdana" textAnchor="middle" x={50} y={50} fontSize={50}>{`{}`}</text>
        </svg>
      </div>
    );
  }
}

function reactify(node: HTMLElement | SVGElement) {
  const ret: any = {};

  const allowedAttributes = ['transform'];

  // copy attributes
  for (const attr of Array.from(node.attributes)) {
    if (!attr.specified) continue;
    if (!allowedAttributes.includes(attr.nodeName)) continue;

    ret[attr.nodeName] = attr.textContent;
  }

  // style needs to be handled separately for React
  if (node.style) {
    ret.style = {};
    for (let i = 0; i < node.style.length; ++i) {
      const prop = node.style.item(i);
      if (!STYLES.includes(prop)) continue;
      ret.style[dashToCamel(prop)] = node.style[prop];
    }
  }

  return ret;
}

function dashToCamel(str: string) {
  return str.split('-')
        .map((s, i) => i === 0 ? s : s[0].toUpperCase() + s.slice(1))
        .join('');
}
