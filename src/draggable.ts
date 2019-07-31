import {aspectRatio, Utils} from "ractive-player";

const {screenToSVGVector} = Utils.graphics,
      {dragHelper} = Utils.interactivity;

import * as dom from "./utils/dom";
const {$, $$} = dom;

const global: any = window;

type DElement = HTMLElement | SVGElement;

const Editor = {
  makeDraggable(node: DElement) {
    let lastX: number,
        lastY: number,
        coordsBox: HTMLSpanElement;

    // CSS
    if (node instanceof HTMLElement || node instanceof SVGSVGElement) 
      node.style.position = "absolute";

    // attach handlers
    if (node instanceof HTMLElement || node instanceof SVGSVGElement)
      node.addEventListener("mousedown", dragHelper(mouseMoveHTML, mouseDown, mouseUp) as EventListener);
    else
      node.addEventListener("mousedown", dragHelper(mouseMoveSVG, mouseDown, mouseUp) as EventListener);

    function mouseDown(e: MouseEvent) {
      e.stopPropagation();
      e.preventDefault();

      lastX = e.pageX;
      lastY = e.pageY;

      // coords box
      coordsBox = dom.elt("span");
      coordsBox.className = "coordinates-box";

      let left, top;

      if (node instanceof HTMLElement || node instanceof SVGSVGElement) {
        left = Math.round(parseFloat(node.style.left.slice(0,-4)) / aspectRatio),
        top = Math.round(parseFloat(node.style.top.slice(0,-4)) / aspectRatio);
      } else {
        left = node.getAttribute(svgXAttr(node)),
        top = node.getAttribute(svgYAttr(node));
      }

      coordsBox.textContent = `(${left},${top})`;

      document.body.appendChild(coordsBox);
    }

    function mouseMoveHTML(e: MouseEvent) {
      const offset = offsetParent(node);

      const x = offset.left + e.pageX - lastX,
            y = offset.top + e.pageY - lastY,
            vmin = Math.min(innerWidth, innerHeight) / 100,
            left = x / vmin,
            top = y / vmin;

      lastX = e.pageX;
      lastY = e.pageY;

      Object.assign(node.style, {
        left: `${left}vmin`,
        top: `${top}vmin`
      });

      // update the box
      coordsBox.textContent = `(${Math.round(left / aspectRatio)}, ${Math.round(top / aspectRatio)})`;
    }

    function mouseMoveSVG(e: MouseEvent) {
      if (!assertSVG(node)) return;

      const [dx, dy] = screenToSVGVector(svgParent(node), e.pageX - lastX, e.pageY - lastY);
      lastX = e.pageX;
      lastY = e.pageY;

      if (node instanceof SVGGElement) {
        const t = node.transform.baseVal;
        window.t = t;
        if (t.numberOfItems === 0) {
          t.appendItem(node.ownerSVGElement.createSVGTransform());
        }
        t.consolidate();
        const m = t.getItem(0).matrix;

        m.e += dx, m.f += dy;

        coordsBox.textContent = `(${Math.round(m.e)}, ${Math.round(m.f)})`;
      } else {
        const x = parseFloat(node.getAttribute(svgXAttr(node))),
              y = parseFloat(node.getAttribute(svgYAttr(node)));

        node.setAttribute(svgXAttr(node), (x + dx).toString());
        node.setAttribute(svgYAttr(node), (y + dy).toString());

        coordsBox.textContent = `(${Math.round(x+dx)}, ${Math.round(y + dy)})`;
      }
    }

    function mouseUp(e: MouseEvent) {
      dom.remove(coordsBox);

      lastX = lastY = null;
    }
  }
};

/* figure out which attribute to modify to move */
function svgXAttr(node: SVGElement): string {
  switch (node.nodeName) {
    case "circle":
      return "cx";
    default:
      return "x";
  }
}

function svgYAttr(node: SVGElement): string {
  switch (node.nodeName) {
    case "circle":
      return "cy";
    default:
      return "y";
  }
}

// svg parent thingy
function svgParent(node: SVGElement): SVGSVGElement {
  let parent = node;
  while (parent = <SVGElement>parent.parentNode)
    if (parent.nodeName.toLowerCase() === "svg")
      return <SVGSVGElement>parent;
}

// stupid helper function
function offsetParent(node: HTMLElement | SVGElement) {
  if (typeof (<HTMLElement>node).offsetLeft !== "undefined" && typeof (<HTMLElement>node).offsetTop !== "undefined")
    return { left: (<HTMLElement>node).offsetLeft, top: (<HTMLElement>node).offsetTop };

  const rect = node.getBoundingClientRect();

  let parent = node;
  while (parent = <HTMLElement>parent.parentNode) {
    if (!["absolute", "relative"].includes(getComputedStyle(parent).position)) continue;

    const prect = parent.getBoundingClientRect();

    return { left: rect.left - prect.left, top: rect.top - prect.top };
  }

  return { left: rect.left, top: rect.top };
}

// global.offsetParent = offsetParent;

export default function() {
  global._edit = { "data-ractive-editor-draggable": "yes" };
  
  document.addEventListener("DOMContentLoaded", () => {
    $$("*[data-ractive-editor-draggable]").forEach(Editor.makeDraggable);
  });  
}

// TypeScript shenanigans
function assertHTML(node: DElement): node is HTMLElement {
  return true;
}

function assertSVG(node: DElement): node is SVGElement {
  return true;
}
