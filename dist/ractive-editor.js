/*!
 * Copyright (c) 2018 Yuri Sulyma
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 */
var RactiveEditor =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/plugin.tsx");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/draggable.ts":
/*!**************************!*\
  !*** ./src/draggable.ts ***!
  \**************************/
/*! exports provided: draggable, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "draggable", function() { return draggable; });
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/dom */ "./src/utils/dom.ts");

const { dragHelper } = ractive_player__WEBPACK_IMPORTED_MODULE_0__["Utils"].interactivity;

const { $, $$ } = _utils_dom__WEBPACK_IMPORTED_MODULE_1__;
const Editor = {
    makeDraggable(node) {
        let lastX, lastY, coordsBox;
        if (node instanceof HTMLElement || node instanceof SVGSVGElement)
            node.style.position = "absolute";
        if (node instanceof HTMLElement || node instanceof SVGSVGElement)
            node.addEventListener("mousedown", dragHelper(mouseMoveHTML, mouseDown, mouseUp));
        else
            node.addEventListener("mousedown", dragHelper(mouseMoveSVG, mouseDown, mouseUp));
        function mouseDown(e) {
            e.stopPropagation();
            e.preventDefault();
            lastX = e.pageX;
            lastY = e.pageY;
            coordsBox = _utils_dom__WEBPACK_IMPORTED_MODULE_1__["elt"]("span");
            coordsBox.className = "coordinates-box";
            let left, top;
            if (node instanceof HTMLElement || node instanceof SVGSVGElement) {
                left = Math.round(parseFloat(node.style.left.slice(0, -1))),
                    top = Math.round(parseFloat(node.style.top.slice(0, -1)));
            }
            else {
                left = node.getAttribute(svgXAttr(node)),
                    top = node.getAttribute(svgYAttr(node));
            }
            coordsBox.textContent = `(${left}%, ${top}%)`;
            document.body.appendChild(coordsBox);
        }
        function mouseMoveHTML(e) {
            const offset = offsetParent(node);
            const x = offset.left + e.pageX - lastX, y = offset.top + e.pageY - lastY, left = x / offset.width * 100, top = y / offset.height * 100;
            lastX = e.pageX;
            lastY = e.pageY;
            Object.assign(node.style, {
                left: `${left}%`,
                top: `${top}%`
            });
            coordsBox.textContent = `(${Math.round(left)}%, ${Math.round(top)}%)`;
        }
        function mouseMoveSVG(e) {
            if (!assertSVG(node))
                return;
            const [dx, dy] = screenToSVGVector(svgParent(node), e.pageX - lastX, e.pageY - lastY);
            lastX = e.pageX;
            lastY = e.pageY;
            if (node instanceof SVGGElement) {
                const t = node.transform.baseVal;
                if (t.numberOfItems === 0) {
                    t.appendItem(node.ownerSVGElement.createSVGTransform());
                }
                t.consolidate();
                const m = t.getItem(0).matrix;
                m.e += dx, m.f += dy;
                coordsBox.textContent = `(${Math.round(m.e)}, ${Math.round(m.f)})`;
            }
            else {
                const x = parseFloat(node.getAttribute(svgXAttr(node))), y = parseFloat(node.getAttribute(svgYAttr(node)));
                node.setAttribute(svgXAttr(node), (x + dx).toString());
                node.setAttribute(svgYAttr(node), (y + dy).toString());
                coordsBox.textContent = `(${Math.round(x + dx)}, ${Math.round(y + dy)})`;
            }
        }
        function mouseUp(e) {
            _utils_dom__WEBPACK_IMPORTED_MODULE_1__["remove"](coordsBox);
            lastX = lastY = null;
        }
    }
};
function svgXAttr(node) {
    switch (node.nodeName) {
        case "circle":
            return "cx";
        default:
            return "x";
    }
}
function svgYAttr(node) {
    switch (node.nodeName) {
        case "circle":
            return "cy";
        default:
            return "y";
    }
}
function svgParent(node) {
    let parent = node;
    while (parent = parent.parentNode)
        if (parent.nodeName.toLowerCase() === "svg")
            return parent;
}
function offsetParent(node) {
    if (assertHTML(node)) {
        if (typeof node.offsetLeft !== "undefined" && typeof node.offsetTop !== "undefined") {
            return {
                left: node.offsetLeft,
                top: node.offsetTop,
                width: node.offsetParent.getBoundingClientRect().width,
                height: node.offsetParent.getBoundingClientRect().height
            };
        }
    }
    const rect = node.getBoundingClientRect();
    let parent = node;
    while (parent = parent.parentNode) {
        if (!["absolute", "relative"].includes(getComputedStyle(parent).position))
            continue;
        const prect = parent.getBoundingClientRect();
        return { left: rect.left - prect.left, top: rect.top - prect.top, width: prect.width, height: prect.height };
    }
    return { left: rect.left, top: rect.top, width: innerWidth, height: innerHeight };
}
const draggable = { "data-re-draggable": "yes" };
/* harmony default export */ __webpack_exports__["default"] = (function () {
    window._edit = draggable;
    document.addEventListener("DOMContentLoaded", () => {
        $$("*[data-re-draggable]").forEach(Editor.makeDraggable);
    });
});
function assertHTML(node) {
    return true;
}
function assertSVG(node) {
    return true;
}
function screenToSVGVector(svg, dx, dy) {
    const rect = svg.getBoundingClientRect(), viewBox = svg.viewBox.baseVal, aspectX = rect.width / viewBox.width, aspectY = rect.height / viewBox.height, svgDx = dx / aspectX, svgDy = dy / aspectY;
    return [svgDx, svgDy];
}


/***/ }),

/***/ "./src/object-map.tsx":
/*!****************************!*\
  !*** ./src/object-map.tsx ***!
  \****************************/
/*! exports provided: setIdMap, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "setIdMap", function() { return setIdMap; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ObjectMap; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils/dom */ "./src/utils/dom.ts");


const { bind } = ractive_player__WEBPACK_IMPORTED_MODULE_1__["Utils"].misc;

const STYLES = [
    "left", "top", "position", "height", "width"
];
let instance;
const setIdMap = (idMap) => {
    if (!instance)
        throw new Error();
    instance.setIdMap(idMap);
};
class ObjectMap extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(props, context) {
        super(props, context);
        this.player = context;
        instance = this;
        bind(this, ["copyData", "togglePane", "checkBox"]);
        this.state = {
            selectedIds: new Set(),
            paneOpen: false,
            editing: null
        };
    }
    shouldComponentUpdate(nextProps, nextState) {
        if (nextState.paneOpen !== this.state.paneOpen)
            return true;
        if (nextState.editing !== this.state.editing)
            return true;
        if (!setEq(nextState.selectedIds, this.state.selectedIds))
            return true;
        return false;
    }
    setIdMap(idMap) {
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
            const node = Object(_utils_dom__WEBPACK_IMPORTED_MODULE_2__["$"])(`#${id}`);
            data[id] = node ? reactify(node) : this.idMap.props.map[id];
        }
        const id32 = document.location.pathname.split("/")[2];
        const file = await fetch(`/d/editor/${id32}/save_object`, {
            body: JSON.stringify(data),
            headers: [
                ["Content-Type", "application/json"],
                ["X-Requested-With", "XMLHttpRequest"],
                ["X-CSRF-Token", window.csrfToken]
            ],
            method: "POST"
        });
        const text = await file.text();
        console.log(text);
    }
    checkBox(e) {
        const [, id] = e.target.id.match(/^eo-checkbox-(.+)$/);
        const S = new Set(this.state.selectedIds);
        S[e.target.checked ? "add" : "delete"](id);
        this.setState({ selectedIds: S });
    }
    select(id) {
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
        const { markers } = this.player.script;
        const { paneOpen, editing } = this.state;
        const dialogStyle = {
            display: paneOpen ? "block" : "none"
        };
        const editNode = editing ? Object(_utils_dom__WEBPACK_IMPORTED_MODULE_2__["$"])(`#${editing}`) : null;
        const foundIds = (this.idMap ? Array.from(this.idMap.foundIds).sort() : []);
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-objects-thing" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-objects-dialog", style: dialogStyle },
                editing &&
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-objects-editing-dialog" },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", null, editing),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("select", { value: editNode.dataset.fromFirst }, markers.map(slide => react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("option", { key: slide[0], value: slide[0] }, slide[0])))),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("table", { className: "idmap-selected" },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tbody", null, foundIds.map(id => (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tr", { key: id },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { checked: this.state.selectedIds.has(id), onChange: this.checkBox, id: `eo-checkbox-${id}`, type: "checkbox" })),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("label", { htmlFor: `eo-checkbox-${id}` }, id),
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { onClick: e => this.select(id) }, "i"))))))),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { onClick: this.copyData }, "Update data")),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("svg", { onClick: this.togglePane, height: "36", width: "36", viewBox: "0 0 100 100" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("text", { dominantBaseline: "middle", fill: "#FFF", fontFamily: "Verdana", textAnchor: "middle", x: 50, y: 50, fontSize: 50 }, "{}"))));
    }
}
ObjectMap.contextType = ractive_player__WEBPACK_IMPORTED_MODULE_1__["Player"].Context;
function reactify(node) {
    const ret = {};
    const allowedAttributes = ["data-from-first", "data-from-last", "data-during", "transform"];
    for (const attr of Array.from(node.attributes)) {
        if (!attr.specified)
            continue;
        if (!allowedAttributes.includes(attr.nodeName))
            continue;
        ret[attr.nodeName] = attr.textContent;
    }
    if (node.style) {
        ret.style = {};
        for (let i = 0; i < node.style.length; ++i) {
            const prop = node.style.item(i);
            if (!STYLES.includes(prop))
                continue;
            ret.style[dashToCamel(prop)] = node.style[prop];
        }
    }
    return ret;
}
function dashToCamel(str) {
    return str.split("-")
        .map((s, i) => i === 0 ? s : s[0].toUpperCase() + s.slice(1))
        .join("");
}
function setEq(a, b) {
    return a.size === b.size && [...a].every(value => b.has(value));
}


/***/ }),

/***/ "./src/plugin.tsx":
/*!************************!*\
  !*** ./src/plugin.tsx ***!
  \************************/
/*! exports provided: default, draggable, RecorderConfigureComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _draggable__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./draggable */ "./src/draggable.ts");
/* harmony import */ var _object_map__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./object-map */ "./src/object-map.tsx");
/* harmony import */ var _thumb_recorder__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./thumb-recorder */ "./src/thumb-recorder.tsx");
/* harmony import */ var _recorder__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./recorder */ "./src/recorder.tsx");
/* harmony import */ var _recorders_audio_recorder__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./recorders/audio-recorder */ "./src/recorders/audio-recorder.tsx");
/* harmony import */ var _recorders_cue_recorder__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./recorders/cue-recorder */ "./src/recorders/cue-recorder.tsx");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "draggable", function() { return _draggable__WEBPACK_IMPORTED_MODULE_1__["draggable"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "RecorderConfigureComponent", function() { return _recorder__WEBPACK_IMPORTED_MODULE_4__["RecorderConfigureComponent"]; });








class EditorPlugin {
    constructor() {
        this.recorders = [_recorders_audio_recorder__WEBPACK_IMPORTED_MODULE_5__["AudioRecorderPlugin"], _recorders_cue_recorder__WEBPACK_IMPORTED_MODULE_6__["CueRecorderPlugin"]];
    }
    addRecorder(plugin) {
        this.recorders.push(plugin);
    }
    setup(hook) {
        hook("classNames", () => "editor");
        hook("canvasClick", () => false);
        hook("controls", () => {
            return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: "editor-controls", key: "rpe" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_object_map__WEBPACK_IMPORTED_MODULE_2__["default"], null),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_thumb_recorder__WEBPACK_IMPORTED_MODULE_3__["default"], null),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"](_recorder__WEBPACK_IMPORTED_MODULE_4__["RecorderComponent"], { plugins: this.recorders })));
        });
        Object(_draggable__WEBPACK_IMPORTED_MODULE_1__["default"])();
    }
}
/* harmony default export */ __webpack_exports__["default"] = (new EditorPlugin());




/***/ }),

/***/ "./src/polyfills.ts":
/*!**************************!*\
  !*** ./src/polyfills.ts ***!
  \**************************/
/*! exports provided: fullscreenEnabled, requestFullScreen, exitFullScreen, isFullScreen, onFullScreenChange */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fullscreenEnabled", function() { return fullscreenEnabled; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "requestFullScreen", function() { return requestFullScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "exitFullScreen", function() { return exitFullScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "isFullScreen", function() { return isFullScreen; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onFullScreenChange", function() { return onFullScreenChange; });
const id = (_) => _;
const fullscreenEnabled = ["fullscreenEnabled", "webkitFullscreenEnabled", "mozFullScreenEnabled", "msFullscreenEnabled"]
    .map(_ => document[_])
    .concat(false)
    .find(_ => _ !== undefined);
const requestFullScreen = ["requestFullscreen", "webkitRequestFullscreen", "mozRequestFullScreen", "msRequestFullscreen"]
    .map(_ => document.body[_])
    .concat(() => { })
    .find(id)
    .bind(document.body);
const exitFullScreen = ["exitFullscreen", "webkitExitFullscreen", "mozCancelFullScreen", "msExitFullscreen"]
    .map(_ => document[_])
    .concat(async () => { })
    .find(id)
    .bind(document);
const isFullScreen = () => ["fullscreen", "webkitIsFullScreen", "mozFullScreen"]
    .map(_ => document[_])
    .find(_ => _ !== undefined);
function onFullScreenChange(callback) {
    for (const event of ["fullscreenchange", "webkitfullscreenchange", "mozfullscreenchange", "MSFullscreenChange"])
        document.addEventListener(event, callback);
}


/***/ }),

/***/ "./src/recorder.tsx":
/*!**************************!*\
  !*** ./src/recorder.tsx ***!
  \**************************/
/*! exports provided: RecorderConfigureComponent, RecorderComponent */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecorderConfigureComponent", function() { return RecorderConfigureComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "RecorderComponent", function() { return RecorderComponent; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_events__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/events */ "./src/utils/events.ts");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_2__);



const { bind } = ractive_player__WEBPACK_IMPORTED_MODULE_2__["Utils"].misc;
class RecorderConfigureComponent extends react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"] {
    constructor(props) {
        super(props);
        bind(this, ["toggleActive"]);
        this.state = {
            active: false
        };
    }
    toggleActive() {
        this.props.setPluginActive(!this.state.active);
        this.setState({ active: !this.state.active });
    }
}
class RecorderComponent extends react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"] {
    constructor(props, context) {
        super(props, context);
        this.plugins = props.plugins;
        this.player = context;
        this.isPluginActive = {};
        this.pluginMap = {};
        for (const plugin of this.plugins) {
            this.pluginMap[plugin.name] = plugin;
            this.isPluginActive[plugin.name] = false;
        }
        this.activeRecorders = new Map();
        bind(this, ["togglePane", "onKeyDown", "beginRecording", "endRecording"]);
        this.state = {
            isPaneOpen: false,
            isRecording: false,
            recordings: [],
            paused: false
        };
    }
    componentDidMount() {
        Object(_utils_events__WEBPACK_IMPORTED_MODULE_1__["on"])(document.body, "keydown", this.onKeyDown);
        Object(_utils_events__WEBPACK_IMPORTED_MODULE_1__["on"])(window, "beforeunload", (e) => {
            if (this.state.recordings.length > 0)
                e.returnValue = "You have recording data";
        });
    }
    onKeyDown(e) {
        if (!this.player.$controls.captureKeys)
            return;
        if (e.code === "Digit2" && e.altKey && e.metaKey) {
            this.state.isRecording ? this.endRecording(true) : this.beginRecording();
        }
        if (e.code === "Digit3" && e.altKey && e.metaKey && this.state.isRecording) {
            this.state.paused ? this.resumeRecording() : this.pauseRecording();
        }
        else if (e.code === "Digit4" && e.altKey && e.metaKey && this.state.isRecording) {
            this.endRecording(false);
        }
    }
    beginRecording() {
        const baseTime = performance.now();
        this.activeRecorders.clear();
        this.intransigentRecorder = void 0;
        for (const plugin of this.plugins) {
            if (!this.isPluginActive[plugin.name])
                continue;
            const recorder = new plugin.recorder(this.player);
            recorder.beginRecording(baseTime);
            this.activeRecorders.set(plugin, recorder);
            if (plugin.recorder.intransigent) {
                if (this.intransigentRecorder)
                    throw new Error("At most one intransigent recorder is allowed");
                this.intransigentRecorder = recorder;
            }
        }
        if (this.activeRecorders.size === 0)
            alert("No recorders active!");
        this.setState({
            isRecording: true
        });
    }
    pauseRecording() {
        const time = performance.now();
        for (const plugin of this.plugins) {
            if (!this.isPluginActive[plugin.name])
                continue;
            this.activeRecorders.get(plugin).pauseRecording(time);
        }
        this.setState({ paused: true });
    }
    resumeRecording() {
        const time = performance.now();
        for (const plugin of this.plugins) {
            if (!this.isPluginActive[plugin.name])
                continue;
            this.activeRecorders.get(plugin).resumeRecording(time);
        }
        this.setState({ paused: false });
    }
    endRecording(save) {
        const time = performance.now();
        const recording = {};
        if (this.intransigentRecorder) {
            const promise = this.intransigentRecorder.endRecording(time);
            for (const recorder of this.activeRecorders.values()) {
                if (recorder === this.intransigentRecorder)
                    continue;
                recorder.endRecording(time);
            }
            if (save) {
                promise.then(([startDelay, stopDelay]) => {
                    for (const [plugin, recorder] of this.activeRecorders.entries()) {
                        recording[plugin.name] = recorder.finalizeRecording(startDelay, stopDelay);
                    }
                    this.setState({
                        isRecording: false,
                        recordings: this.state.recordings.concat([recording])
                    });
                });
            }
            else {
                this.setState({ isRecording: false });
            }
        }
        else {
            for (const [plugin, recorder] of this.activeRecorders.entries()) {
                recorder.endRecording(time);
                if (!save)
                    continue;
                recording[plugin.name] = recorder.finalizeRecording(0, 0);
            }
            this.setState({
                isRecording: false,
                recordings: save ? this.state.recordings.concat([recording]) : this.state.recordings
            });
        }
    }
    togglePane() {
        this.setState({
            isPaneOpen: !this.state.isPaneOpen
        });
    }
    render() {
        const dialogStyle = {
            display: this.state.isPaneOpen ? "block" : "none"
        };
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-recorder" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-recorder-dialog", style: dialogStyle },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("table", { id: "editor-recorder-commands" },
                    react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tbody", null,
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tr", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("th", null,
                                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("kbd", null, "Alt+Cmd+2")),
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", null, "Start/Stop recording")),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tr", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("th", null,
                                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("kbd", null, "Alt+Cmd+3")),
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", null, "Pause/Resume recording")),
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tr", null,
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("th", null,
                                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("kbd", null, "Alt+Cmd+4")),
                            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", null, "Discard recording")))),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", null, "Configuration"),
                this.plugins.map((plugin, i) => {
                    const Component = plugin.configureComponent;
                    const setPluginActive = (val) => this.isPluginActive[plugin.name] = val;
                    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](Component, Object.assign({ key: i }, { setPluginActive })));
                }),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("h3", null, "Saved data"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("ol", { className: "recordings" }, this.state.recordings.map((recording, i) => (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](RecordingRow, { key: i, data: recording, pluginMap: this.pluginMap }))))),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("svg", { onClick: this.togglePane, height: "36", width: "36", viewBox: "-50 -50 100 100" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("circle", { cx: "0", cy: "0", r: "35", stroke: "white", strokeWidth: "5", fill: this.state.isRecording ? (this.state.paused ? "yellow" : "red") : "#666" }))));
    }
}
RecorderComponent.contextType = ractive_player__WEBPACK_IMPORTED_MODULE_2__["Player"].Context;
class RecordingRow extends react__WEBPACK_IMPORTED_MODULE_0__["Component"] {
    constructor(props, context) {
        super(props, context);
        this.player = context;
        this.state = {
            name: "Untitled"
        };
    }
    render() {
        const { data, pluginMap } = this.props;
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("li", { className: "recording-row" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("input", { onBlur: this.player.resumeKeyCapture, onFocus: this.player.suspendKeyCapture, onChange: e => this.setState({ name: e.target.value }), className: "recording-name", type: "text", value: this.state.name }),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("table", { className: "recording-results" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tbody", null, Object.keys(data).map(pluginName => {
                    const plugin = pluginMap[pluginName], PluginComponent = plugin.saveComponent;
                    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("tr", { key: pluginName },
                        react__WEBPACK_IMPORTED_MODULE_0__["createElement"](PluginComponent, { data: data[pluginName] })));
                })))));
    }
}
RecordingRow.contextType = ractive_player__WEBPACK_IMPORTED_MODULE_2__["Player"].Context;


/***/ }),

/***/ "./src/recorders/audio-recorder.tsx":
/*!******************************************!*\
  !*** ./src/recorders/audio-recorder.tsx ***!
  \******************************************/
/*! exports provided: AudioRecorder, AudioConfigureComponent, AudioSaveComponent, AudioRecorderPlugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioRecorder", function() { return AudioRecorder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioConfigureComponent", function() { return AudioConfigureComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioSaveComponent", function() { return AudioSaveComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AudioRecorderPlugin", function() { return AudioRecorderPlugin; });
/* harmony import */ var _types_MediaRecorder__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../types/MediaRecorder */ "./src/types/MediaRecorder.ts");
/* harmony import */ var _types_MediaRecorder__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_types_MediaRecorder__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _recorder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../recorder */ "./src/recorder.tsx");



const audioIcon = (react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("svg", { x: "0", y: "10", height: "80", viewBox: "0 0 462.86 792.01" },
    react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("g", { stroke: "#FFF", transform: "translate(-140.62 -173.21)" },
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("path", { d: "m568.57 620.93c0 116.77-94.66 211.43-211.43 211.43s-211.43-94.66-211.43-211.43v-0.00001", fillOpacity: "0", transform: "translate(14.904)", strokeLinecap: "round", strokeWidth: "20" }),
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("path", { d: "m568.57 620.93c0 116.77-94.66 211.43-211.43 211.43s-211.43-94.66-211.43-211.43v-0.00001", fillOpacity: "0", transform: "translate(14.904)", strokeLinecap: "round", strokeWidth: "40" }),
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("path", { d: "m372.05 832.36v114.29", strokeWidth: "30", fill: "none" }),
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("path", { fill: "#FFF", d: "m197.14 920.93c0.00001-18.935 59.482-34.286 132.86-34.286 73.375 0 132.86 15.35 132.86 34.286z", transform: "translate(42.047 34.286)", strokeLinecap: "round", strokeWidth: "20" }),
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("path", { fill: "#FFF", strokeWidth: "21.455", strokeLinecap: "round", d: "m372.06 183.94c-77.019-0.00001-139.47 62.45-139.47 139.47v289.62c0 77.019 62.45 139.47 139.47 139.47 77.019 0 139.44-62.45 139.44-139.47v-289.62c0-77.02-62.42-139.47-139.44-139.47z" }))));
class AudioRecorder {
    static init() {
        if (location.protocol !== "https:")
            return;
        try {
            navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
                this.stream = stream;
            });
        }
        catch (e) {
            console.log("no recording allowed");
        }
    }
    beginRecording(baseTime) {
        if (!AudioRecorder.stream)
            throw new Error("Navigator stream not available");
        if (document.location.protocol !== "https:")
            throw new Error("Page must be accessed via HTTPS in order to record audio");
        this.baseTime = baseTime;
        this.promise = new Promise(async (resolve, reject) => {
            const chunks = [];
            this.recorder = new MediaRecorder(AudioRecorder.stream, { mimeType: "audio/webm" });
            this.recorder.addEventListener("dataavailable", e => {
                chunks.push(e.data);
            });
            this.recorder.addEventListener("start", () => {
                this.startTime = performance.now();
            });
            this.recorder.addEventListener("stop", () => {
                const stopDelay = performance.now() - this.endTime;
                this.blob = new Blob(chunks, { type: "audio/webm" });
                resolve([this.startTime - baseTime, stopDelay]);
            });
            this.recorder.start();
        });
    }
    pauseRecording() {
        this.recorder.pause();
    }
    resumeRecording() {
        this.recorder.resume();
    }
    async endRecording(endTime) {
        this.endTime = endTime;
        this.recorder.stop();
        return this.promise;
    }
    finalizeRecording() {
        return URL.createObjectURL(this.blob);
    }
}
AudioRecorder.intransigent = true;
AudioRecorder.init();
class AudioConfigureComponent extends _recorder__WEBPACK_IMPORTED_MODULE_2__["RecorderConfigureComponent"] {
    render() {
        const classNames = ["recorder-plugin-icon"];
        if (this.state.active)
            classNames.push("active");
        return (react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("div", { className: "recorder-plugin", title: "Record audio" },
            react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("svg", { className: classNames.join(" "), height: "36", width: "36", viewBox: "0 0 100 100", onClick: this.toggleActive },
                react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("rect", { height: "100", width: "100", fill: this.state.active ? "red" : "#222" }),
                audioIcon),
            react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("span", { className: "recorder-plugin-name" }, "Audio")));
    }
}
function AudioSaveComponent(props) {
    return (react__WEBPACK_IMPORTED_MODULE_1__["createElement"](react__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null,
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("th", { key: "head", scope: "row" },
            react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("svg", { className: "recorder-plugin-icon", height: "36", width: "36", viewBox: "0 0 100 100" },
                react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("rect", { height: "100", width: "100", fill: "#222" }),
                audioIcon)),
        react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("td", { key: "cell" }, props.data ?
            react__WEBPACK_IMPORTED_MODULE_1__["createElement"](react__WEBPACK_IMPORTED_MODULE_1__["Fragment"], null,
                react__WEBPACK_IMPORTED_MODULE_1__["createElement"]("a", { download: "audio.webm", href: props.data }, "Download Audio")) :
            "Audio not yet available")));
}
const AudioRecorderPlugin = {
    name: "AudioRecorder",
    recorder: AudioRecorder,
    configureComponent: AudioConfigureComponent,
    saveComponent: AudioSaveComponent
};


/***/ }),

/***/ "./src/recorders/cue-recorder.tsx":
/*!****************************************!*\
  !*** ./src/recorders/cue-recorder.tsx ***!
  \****************************************/
/*! exports provided: CueRecorder, CueConfigureComponent, CueSaveComponent, CueRecorderPlugin */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CueRecorder", function() { return CueRecorder; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CueConfigureComponent", function() { return CueConfigureComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CueSaveComponent", function() { return CueSaveComponent; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "CueRecorderPlugin", function() { return CueRecorderPlugin; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _recorder__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../recorder */ "./src/recorder.tsx");
/* harmony import */ var _utils_events__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/events */ "./src/utils/events.ts");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_3__);




const { bind } = ractive_player__WEBPACK_IMPORTED_MODULE_3__["Utils"].misc, { formatTimeMs, parseTime } = ractive_player__WEBPACK_IMPORTED_MODULE_3__["Utils"].time;
const cueIcon = (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("text", { fill: "#FFF", fontFamily: "Helvetica", fontSize: "75", textAnchor: "middle", x: "50", y: "75" }, "Q"));
class CueRecorder {
    constructor(player) {
        this.player = player;
        bind(this, ["onKeyDown"]);
    }
    beginRecording(time) {
        this.cueCapture = [];
        this.lastTime = 0;
        this.captureStart = time;
        this.paused = false;
        this.pauseTime = 0;
        Object(_utils_events__WEBPACK_IMPORTED_MODULE_2__["on"])(document.body, "keydown", this.onKeyDown);
    }
    pauseRecording(time) {
        this.paused = true;
        this.lastPauseTime = time;
    }
    resumeRecording(time) {
        this.pauseTime += time - this.lastPauseTime;
        this.paused = false;
    }
    endRecording(time) {
        Object(_utils_events__WEBPACK_IMPORTED_MODULE_2__["off"])(document.body, "keydown", this.onKeyDown);
        this.captureCues(time, this.player.script.markerName);
    }
    finalizeRecording(startDelay, stopDelay) {
        console.dir({
            startDelay,
            stopDelay,
            cueSum: this.cueCapture.map(_ => _[1]).reduce((a, b) => a + b, 0)
        });
        this.cueCapture[0][1] -= startDelay;
        this.cueCapture[this.cueCapture.length - 1][1] += stopDelay;
        return this.cueCapture.map(cue => [cue[0], formatTimeMs(cue[1])]);
    }
    onKeyDown(e) {
        const t = performance.now();
        if (this.paused)
            return;
        const { script } = this.player;
        if (!this.player.$controls.captureKeys)
            return;
        if (e.key.toLowerCase() === "e")
            this.captureCues(t, script.markers[script.markerIndex - 1][0]);
    }
    captureCues(time, markerName) {
        const t = time - this.captureStart - this.pauseTime;
        this.cueCapture.push([markerName, t - this.lastTime]);
        this.lastTime = t;
    }
}
class CueConfigureComponent extends _recorder__WEBPACK_IMPORTED_MODULE_1__["RecorderConfigureComponent"] {
    render() {
        const classNames = ["recorder-plugin-icon"];
        if (this.state.active)
            classNames.push("active");
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { className: "recorder-plugin", title: "Record cues" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("svg", { className: classNames.join(" "), height: "36", width: "36", viewBox: "0 0 100 100", onClick: this.toggleActive },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("rect", { height: "100", width: "100", fill: this.state.active ? "red" : "#222" }),
                cueIcon),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("span", { className: "recorder-plugin-name" }, "Cues")));
    }
}
function CueSaveComponent(props) {
    return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"](react__WEBPACK_IMPORTED_MODULE_0__["Fragment"], null,
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("th", { key: "head", scope: "row" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("svg", { className: "recorder-plugin-icon", height: "36", width: "36", viewBox: "0 0 100 100" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("rect", { height: "100", width: "100", fill: "#222" }),
                cueIcon)),
        react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("td", { key: "cell" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("textarea", { readOnly: true, value: JSON.stringify(props.data) }))));
}
const CueRecorderPlugin = {
    name: "CueRecorder",
    recorder: CueRecorder,
    configureComponent: CueConfigureComponent,
    saveComponent: CueSaveComponent
};
function format(data) {
    return JSON.stringify(data, null, 2).replace(/\[\s+"(.+?)",\s+"(.+?)"\s+\]/g, `["$1", "$2"]`);
}


/***/ }),

/***/ "./src/thumb-recorder.tsx":
/*!********************************!*\
  !*** ./src/thumb-recorder.tsx ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return ThumbRecorder; });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils_dom__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils/dom */ "./src/utils/dom.ts");
/* harmony import */ var _polyfills__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./polyfills */ "./src/polyfills.ts");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ractive-player */ "ractive-player");
/* harmony import */ var ractive_player__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(ractive_player__WEBPACK_IMPORTED_MODULE_3__);


const { $, $$ } = _utils_dom__WEBPACK_IMPORTED_MODULE_1__;


const { bind, waitFor } = ractive_player__WEBPACK_IMPORTED_MODULE_3__["Utils"].misc;
const sleep = ractive_player__WEBPACK_IMPORTED_MODULE_3__["Utils"].misc.wait;
const THUMB_OPTIONS = {
    cols: 5,
    rows: 5,
    height: 100,
    width: 160,
    frequency: 4
};
class ThumbRecorder extends react__WEBPACK_IMPORTED_MODULE_0__["PureComponent"] {
    constructor(props, context) {
        super(props, context);
        this.player = context;
        bind(this, ["recordThumbs", "togglePane"]);
        this.state = {
            paneOpen: false,
            sheets: []
        };
    }
    componentDidMount() {
        if (!window.hasOwnProperty("RACTIVE_GLOBAL"))
            window.RACTIVE_GLOBAL = {};
        RACTIVE_GLOBAL.Controls = RACTIVE_GLOBAL.Controls || {};
        RACTIVE_GLOBAL.Controls.ThumbRecorder = this;
    }
    async recordThumbs() {
        const extensionId = "fljhedgmfkefnmfglilbcjhacefdkhbn";
        const wasFullScreen = Object(_polyfills__WEBPACK_IMPORTED_MODULE_2__["isFullScreen"])();
        const api = await wrapPortMaster(chrome.runtime.connect(extensionId));
        const { frequency } = THUMB_OPTIONS;
        const thumbs = [];
        Object(_polyfills__WEBPACK_IMPORTED_MODULE_2__["requestFullScreen"])();
        await waitFor(() => Object(_polyfills__WEBPACK_IMPORTED_MODULE_2__["isFullScreen"])());
        const oldState = hideUI();
        await sleep(6000);
        const { playback } = this.player;
        for (let t = 0, len = playback.duration; t <= len; t += frequency * 1000) {
            playback.seek(t);
            await sleep(100);
            thumbs.push(await api.captureTab());
        }
        if (!wasFullScreen)
            Object(_polyfills__WEBPACK_IMPORTED_MODULE_2__["exitFullScreen"])();
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
        const { paneOpen } = this.state;
        const dialogStyle = {
            display: paneOpen ? "block" : "none"
        };
        return (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "editor-thumb-recorder" },
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "saved-thumbs-dialog", style: dialogStyle },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("button", { onClick: this.recordThumbs }, "Record"),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("div", { id: "sheets" }, this.state.sheets.map((sheet, i) => (react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("a", { key: i, href: sheet, download: `${i}.png` },
                    "Sheet ",
                    i))))),
            react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("svg", { onClick: this.togglePane, height: "36", width: "36", viewBox: "0 0 100 100" },
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("path", { d: "M 10 70 a 1,1 0 0,1 80,0 z", fill: "#FFC0CB", stroke: "#FFF", strokeWidth: "7" }),
                react__WEBPACK_IMPORTED_MODULE_0__["createElement"]("path", { d: "M 35 66.5 a 1,1 0 0,1 30,0 z", fill: "#FFE0EB", stroke: "none" }))));
    }
}
ThumbRecorder.contextType = ractive_player__WEBPACK_IMPORTED_MODULE_3__["Player"].Context;
function wrapPortMaster(port) {
    let callCounter = 0;
    const returnPromises = {};
    return new Promise((resolve, reject) => {
        port.onMessage.addListener((msg) => {
            switch (msg.type) {
                case "apiDefinition":
                    const api = {};
                    msg.methodNames.forEach(name => {
                        api[name] = (...args) => {
                            const callId = callCounter++;
                            port.postMessage({ type: "apiCall", callId, methodName: name, arguments: args });
                            return new Promise((resolve, reject) => {
                                returnPromises[callId] = resolve;
                            });
                        };
                    });
                    Object.freeze(api);
                    resolve(api);
                    break;
                case "apiReturn":
                    const { callId } = msg;
                    returnPromises[callId](msg.value);
                    delete returnPromises[callId];
                    break;
            }
        });
        port.postMessage({ type: "establish" });
    });
}
function hideUI() {
    const changes = [
        [$(".rp-controls"), "display", "none"],
        [$(".rp-canvas"), "cursor", "none"],
        [document.body, "cursor", "none"]
    ];
    for (let i = 0; i < changes.length; ++i) {
        const [elt, prop, val] = changes[i];
        changes[i][2] = elt.style[prop];
        elt.style[prop] = val;
    }
    return changes;
}
function restoreUI(oldState) {
    for (let [elt, prop, val] of oldState) {
        elt.style[prop] = val;
    }
}
async function processThumbs(thumbs) {
    const { rows, cols, height, width } = THUMB_OPTIONS, count = rows * cols;
    const canvas = _utils_dom__WEBPACK_IMPORTED_MODULE_1__["elt"]("canvas");
    canvas.setAttribute("width", (width * cols).toString());
    canvas.setAttribute("height", (height * rows).toString());
    const ctx = canvas.getContext("2d");
    const sheets = [];
    for (let sheetNum = 0, len = Math.ceil(thumbs.length / count); sheetNum < len; ++sheetNum) {
        ctx.clearRect(0, 0, width * cols, height * rows);
        const sheetImgs = await Promise.all(thumbs
            .slice(sheetNum * count, (sheetNum + 1) * count)
            .map(dataURI => {
            return new Promise((resolve, reject) => {
                const img = _utils_dom__WEBPACK_IMPORTED_MODULE_1__["elt"]("img");
                img.onload = () => resolve(img);
                img.src = dataURI;
            });
        }));
        for (let i = 0; i < rows; ++i) {
            for (let j = 0; j < cols; ++j) {
                const index = i * cols + j;
                if (index >= sheetImgs.length)
                    break;
                ctx.drawImage(sheetImgs[index], j * width, i * height, width, height);
            }
        }
        sheets.push(canvas.toDataURL("image/png"));
    }
    return sheets;
}


/***/ }),

/***/ "./src/types/MediaRecorder.ts":
/*!************************************!*\
  !*** ./src/types/MediaRecorder.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



/***/ }),

/***/ "./src/utils/dom.ts":
/*!**************************!*\
  !*** ./src/utils/dom.ts ***!
  \**************************/
/*! exports provided: $, $$, elt, fragmentFromHTML, remove */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$", function() { return $; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "$$", function() { return $$; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "elt", function() { return elt; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fragmentFromHTML", function() { return fragmentFromHTML; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "remove", function() { return remove; });
function $(selector, context = document) {
    return context.querySelector(selector);
}
function $$(selector, context = document) {
    return Array.from(context.querySelectorAll(selector));
}
function elt(name) {
    return document.createElement(name);
}
function fragmentFromHTML(str) {
    const t = document.createElement("template");
    t.innerHTML = str;
    return t.content.cloneNode(true);
}
function remove(elt) {
    elt.parentNode.removeChild(elt);
}


/***/ }),

/***/ "./src/utils/events.ts":
/*!*****************************!*\
  !*** ./src/utils/events.ts ***!
  \*****************************/
/*! exports provided: off, on */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "off", function() { return off; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "on", function() { return on; });
function off(element, type, handler) {
    return element.removeEventListener(type, handler);
}
function on(element, ...args) {
    let [type, selector, handler] = args;
    if (element instanceof Array) {
        element.map(elt => on(elt, ...args));
        return;
    }
    if (args.length === 2)
        handler = selector, selector = null;
    if (selector) {
        element.addEventListener(type, (e) => {
            let target = e.target;
            while (target != element) {
                if (target.matches(selector)) {
                    return handler.call(target, e, target);
                }
                target = target.parentNode;
            }
        }, true);
    }
    else
        element.addEventListener(type, handler);
}


/***/ }),

/***/ "ractive-player":
/*!********************************!*\
  !*** external "RactivePlayer" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = RactivePlayer;

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = React;

/***/ })

/******/ });