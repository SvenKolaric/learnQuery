interface Data {
  events: Map<string, EventListener[]>
}

const elementMap: Map<HTMLElement, Data> = new Map<HTMLElement, Data>();

function eventHandler(event: Event) {
  const { target } = event;
  if (target instanceof HTMLElement && elementMap.has(target)) {
    const callbackArray = elementMap.get(target)?.events.get(event.type);
    callbackArray!.forEach((callback) => {
      callback(event);
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventListener = {
  on(element: HTMLElement, event: string, callback: EventListener) {
    if (!elementMap.has(element)) {
      elementMap.set(element, {
        events: new Map([[event, [callback]]]),
      });
    } else {
      const mapEvent = elementMap.get(element)!.events;
      if (!mapEvent.has(event)) {
        mapEvent.set(event, [callback]);
      } else {
        mapEvent.get(event)!.push(callback);
      }
    }
    element.addEventListener(event, eventHandler);
  },
  off(element: HTMLElement, event?: string, callback?: EventListener) {
    if (event) {
      const callbackArray = elementMap.get(element)!.events.get(event);
      if (callback) {
        const index = callbackArray!.indexOf(callback, 0);
        if (index > -1) {
          callbackArray!.splice(index, 1);
        }
      } else {
        callbackArray!.length = 0;
      }
    } else {
      elementMap.clear();
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
