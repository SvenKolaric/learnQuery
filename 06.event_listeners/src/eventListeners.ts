interface Data {
  htmlElements: HTMLElement[],
  callbacks: EventListener[],
}

const eventMap: Map<string, Data> = new Map<string, Data>();

function eventHandler(event: Event) {
  if (eventMap.has(event.type)) {
    const callbackArray = eventMap.get(event.type)?.callbacks;
    callbackArray!.forEach((callback, index) => {
      if (eventMap.get(event.type)?.htmlElements[index] === event.target) {
        callback(event);
      }
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventListener = {
  on(element: HTMLElement, event: string, callback: EventListener) {
    if (!eventMap.has(event)) {
      eventMap.set(event, {
        htmlElements: [element],
        callbacks: [callback],
      });
    } else {
      const dataObject = eventMap.get(event);
      dataObject!.callbacks.push(callback);
      dataObject!.htmlElements.push(element);
    }
    element.addEventListener(event, eventHandler);
  },
  off(element: HTMLElement, event?: string, callback?: EventListener) {
    if (event) {
      const dataObject = eventMap.get(event);
      if (callback) {
        const index = dataObject!.callbacks.indexOf(callback, 0);
        if (index > -1) {
          dataObject!.callbacks.splice(index, 1);
          dataObject!.htmlElements.splice(index, 1);
        }
      } else {
        dataObject!.callbacks.length = 0;
        dataObject!.htmlElements.length = 0;
      }
    } else {
      eventMap.clear();
    }
  },
  trigger(element: HTMLElement, event: string) {
    const triggerEvent = new Event(event);
    element.dispatchEvent(triggerEvent);
  },
  delegate(element: HTMLElement, className: string, eventType: string, callback: Function) {
    // eslint-disable-next-line consistent-return
    element.addEventListener(eventType, (event: Event) => {
      const { target } = event;
      if (target instanceof Element) {
        if (target.className === className) {
          return callback();
        }
        const targetClosest = target.closest(`.${className}`);
        if (targetClosest && element.contains(targetClosest)) {
          return callback();
        }
      }
    });
  },
};
