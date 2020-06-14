interface Data {
  events: string[],
  callbacks: EventListener[],
}

const eventMap: Map<HTMLElement, Data> = new Map<HTMLElement, Data>();

function eventHandler(event: Event) {
  const { target } = event;
  if (target instanceof HTMLElement && eventMap.has(target)) {
    const callbackArray = eventMap.get(target)?.callbacks;
    callbackArray!.forEach((callback, index) => {
      if (eventMap.get(target)?.events[index] === event.type) {
        callback(event);
      }
    });
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventListener = {
  on(element: HTMLElement, event: string, callback: EventListener) {
    if (!eventMap.has(element)) {
      eventMap.set(element, {
        events: [event],
        callbacks: [callback],
      });
    } else {
      const dataObject = eventMap.get(element);
      dataObject!.callbacks.push(callback);
      dataObject!.events.push(event);
    }
    element.addEventListener(event, eventHandler);
  },
  off(element: HTMLElement, event?: string, callback?: EventListener) {
    if (event) {
      const dataObject = eventMap.get(element);
      if (callback) {
        const index = dataObject!.callbacks.indexOf(callback, 0);
        if (index > -1) {
          dataObject!.callbacks.splice(index, 1);
          dataObject!.events.splice(index, 1);
        }
      } else {
        // Removes all events not just clicks -> filter
        dataObject!.callbacks.length = 0;
        dataObject!.events.length = 0;
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
