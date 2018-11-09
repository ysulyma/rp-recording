// delegated events à la jQuery
// also just shorthand
export function off<T extends EventTarget>(element: T, type: string, handler: (e: Event) => void): void {
  return element.removeEventListener(type, handler);
}

export function on(element: any, ...args: any[]): void {
  let [type, selector, handler] = args;

  if (element instanceof Array) {
    element.map(elt => on(elt, ...args));
    return;
  }

  if (args.length === 2) handler = selector, selector = null;

  if (selector) {
    element.addEventListener(type, (e: Event) => {
      let target = e.target as Element;

      while (target != element) {
        if ((target as Element).matches(selector)) {
          return handler.call(target, e, target);
        }
        target = target.parentNode as Element;
      }
    }, true);
  }
  else element.addEventListener(type, handler);
}
