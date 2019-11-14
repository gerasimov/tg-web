function on(element: HTMLElement, eventName: string, func: (e: Event) => void) {
  element.addEventListener(eventName, func);
}

function off(element: HTMLElement, eventName: string, func: (e: Event) => void) {
  element.removeEventListener(eventName, func);
}

export { on, off };
