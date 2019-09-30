import {Utils} from "ractive-player";

const {dragHelper} = Utils.interactivity;

import * as dom from "./utils/dom";
const {$, $$} = dom;

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
        left = Math.round(parseFloat(node.style.left.slice(0,-1))),
        top = Math.round(parseFloat(node.style.top.slice(0,-1)));
      } else {
        left = node.getAttribute(svgXAttr(node)),
        top = node.getAttribute(svgYAttr(node));
      }

      coordsBox.textContent = `(${left}%, ${top}%)`;

      document.body.appendChild(coordsBox);
    }

    function mouseMoveHTML(e: MouseEvent) {
      const offset = offsetParent(node);

      const x = offset.left + e.pageX - lastX,
            y = offset.top + e.pageY - lastY,
            left = x / offset.width * 100,
            top = y / offset.height * 100;

      lastX = e.pageX;
      lastY = e.pageY;

      Object.assign(node.style, {
        left: `${left}%`,
        top: `${top}%`
      });

      // update the box
      coordsBox.textContent = `(${Math.round(left)}%, ${Math.round(top)}%)`;
    }

    function mouseMoveSVG(e: MouseEvent) {
      if (!assertSVG(node)) return;

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
  while (parent = parent.parentNode as HTMLElement) {
    if (!["absolute", "relative"].includes(getComputedStyle(parent).position)) continue;

    const prect = parent.getBoundingClientRect();

    return { left: rect.left - prect.left, top: rect.top - prect.top, width: prect.width, height: prect.height };
  }

  return { left: rect.left, top: rect.top, width: innerWidth, height: innerHeight };
}

// global.offsetParent = offsetParent;

export const draggable = { "data-re-draggable": "yes" };

export default function() {
  (window as any)._edit = draggable;
  
  document.addEventListener("DOMContentLoaded", () => {
    $$("*[data-re-draggable]").forEach(Editor.makeDraggable);
  });
}

// TypeScript shenanigans
function assertHTML(node: DElement): node is HTMLElement {
  return true;
}

function assertSVG(node: DElement): node is SVGElement {
  return true;
}


function screenToSVGVector(svg: SVGSVGElement, dx: number, dy: number): [number, number] {
  const rect = svg.getBoundingClientRect(),
        viewBox = svg.viewBox.baseVal,
        aspectX = rect.width / viewBox.width,
        aspectY = rect.height / viewBox.height,
        svgDx = dx / aspectX,
        svgDy = dy / aspectY;

  return [svgDx, svgDy];
}
