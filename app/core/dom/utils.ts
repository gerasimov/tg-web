function on(element: HTMLElement, eventName: string, func: (e: Event) => void) {
  element.addEventListener(eventName, func);
}

export { on };
