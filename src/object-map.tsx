import * as React from "react";

import {IdMap, Player, Utils} from "ractive-player";
const {bind} = Utils.misc;

import {$} from "./utils/dom";

const STYLES = [
  "left", "top", "position", "height", "width"
];

interface State {
  selectedIds: Set<string>;
  paneOpen: boolean;
  editing: string;
}

let instance: ObjectMap;

export const setIdMap = (idMap: any) => {
  if (!instance) throw new Error();
  instance.setIdMap(idMap);
};

// this is a disgrace
export default class ObjectMap extends React.Component<{}, State> {
  private idMap: IdMap;
  static contextType = Player.Context;
  private player: Player;

  constructor(props: {}, context: Player) {
    super(props, context);
    this.player = context;

    instance = this;

    bind(this, ["copyData", "togglePane", "checkBox"]);

    // initial state
    this.state = {
      selectedIds: new Set(),
      paneOpen: false,
      editing: null
    };
  }

  shouldComponentUpdate(nextProps: {}, nextState: State) {
    if (nextState.paneOpen !== this.state.paneOpen) return true;
    if (nextState.editing !== this.state.editing) return true;
    if (!setEq(nextState.selectedIds, this.state.selectedIds)) return true;

    return false;
  }

  setIdMap(idMap: IdMap) {
    this.idMap = idMap;
    this.setState({
      selectedIds: new Set(Object.keys(idMap.props.map))
    });
  }

  async copyData() {
    const selectedIds = Array.from(this.state.selectedIds).sort();

    if (!this.idMap) {
      console.log("Must call Editor.plugins.IdMap.setIdMap");
      return;
    }

    const data = {};

    for (const id of selectedIds) {
      const node = $(`#${id}`) as HTMLElement | SVGElement;

      data[id] = node ? reactify(node) : this.idMap.props.map[id];
    }

    const id32 = document.location.pathname.split("/")[2];

    const file = await fetch(`/d/editor/${id32}/save_object`, {
      body: JSON.stringify(data),
      headers: [
        ["Content-Type", "application/json"],
        ["X-Requested-With", "XMLHttpRequest"],
        ["X-CSRF-Token", (window as any).csrfToken]
      ],
      method: "POST"
    });
    const text = await file.text();

    console.log(text);
    // this.setState({data});
  }

  checkBox(e: React.ChangeEvent<HTMLInputElement>) {
    const [, id] = e.target.id.match(/^eo-checkbox-(.+)$/);
    const S = new Set(this.state.selectedIds);
    S[e.target.checked ? "add" : "delete"](id);
    this.setState({selectedIds: S});
  }

  select(id: string) {
    this.setState({
      editing: (this.state.editing === id) ? null : id
    });
  }

  togglePane() {
    this.setState({
      paneOpen: !this.state.paneOpen
    });
  }

  render() {
    const {markers} = this.player.script;
    const {paneOpen, editing} = this.state;

    const dialogStyle = {
      display: paneOpen ? "block" : "none"
    };

    const editNode = editing ? $(`#${editing}`) : null;

    const foundIds = (this.idMap ? Array.from(this.idMap.foundIds).sort() : []);
    // console.log(editNode && editNode.dataset["data-from-first"]);

    return (
      <div id="editor-objects-thing">
        <div id="editor-objects-dialog" style={dialogStyle}>
          {editing &&
          <div id="editor-objects-editing-dialog">
            <span>{editing}</span>
            <select value={editNode.dataset.fromFirst}>{markers.map(slide =>
              <option
                key={slide[0]}
                value={slide[0]}
              >{slide[0]}</option>
            )}</select>
          </div>}
          <table className="idmap-selected">
            <tbody>
              {foundIds.map(id => (
                <tr key={id}>
                  <td>
                    <input
                      checked={this.state.selectedIds.has(id)} onChange={this.checkBox}
                      id={`eo-checkbox-${id}`}
                      type="checkbox"/>
                  </td>
                  <td>
                    <label htmlFor={`eo-checkbox-${id}`}>{id}</label>
                    <span onClick={e => this.select(id)}>i</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={this.copyData}>Update data</button>
        </div>
        <svg onClick={this.togglePane} height="36" width="36" viewBox="0 0 100 100">
          <text dominantBaseline="middle" fill="#FFF" fontFamily="Verdana" textAnchor="middle" x={50} y={50} fontSize={50}>{"{}"}</text>
        </svg>
      </div>
    );
  }
}

function reactify(node: HTMLElement | SVGElement) {
  const ret: any = {};

  const allowedAttributes = ["data-from-first", "data-from-last", "data-during", "transform"];

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
  return str.split("-")
  .map((s, i) => i === 0 ? s : s[0].toUpperCase() + s.slice(1))
  .join("");
}

function setEq<K>(a: Set<K>, b: Set<K>) {
  return a.size === b.size && [...a].every(value => b.has(value));
}

