/* selectors */
export function $<K extends keyof ElementTagNameMap>(selector: K, context?: ParentNode): ElementTagNameMap[K] | null;
export function $(selector: string, context?: ParentNode): Element;
export function $(selector: string, context: ParentNode = document) {
  return context.querySelector(selector);
}

export function $$<K extends keyof ElementTagNameMap>(selector: K, context?: ParentNode): ElementTagNameMap[K][];
export function $$(selector: string, context?: ParentNode): Element[];
export function $$(selector: string, context: ParentNode = document) {
  return Array.from(context.querySelectorAll(selector));
}

/* manipulation */
export function elt<K extends keyof ElementTagNameMap>(name: K): ElementTagNameMap[K];
export function elt(name: string): Element;
export function elt(name: string) {
  return document.createElement(name);
}

export function fragmentFromHTML(str: string) {
  const t = document.createElement('template');
  t.innerHTML = str;
  return t.content.cloneNode(true) as DocumentFragment;
}

export function remove(elt: Node) {
  elt.parentNode.removeChild(elt);
}

