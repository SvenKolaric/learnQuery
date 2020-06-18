interface EventsMap {
  events: Map<string, CallbackData>
}

interface CallbackData {
  callbacks: EventListener[],
  eventHandler: EventListener,
}

const elementMap: Map<HTMLElement, EventsMap> = new Map<HTMLElement, EventsMap>();

function eventHandler(event: Event) {
  // eslint-disable-next-line prefer-destructuring
  const target = <HTMLElement>event.target;
  if (target && elementMap.has(target) && elementMap.get(target)?.events.has(event.type)) {
    const callbackArray = elementMap.get(target)!.events.get(event.type);
    callbackArray!.callbacks.forEach((callback) => {
      callback(event);
    });
  }
}

function removeEvent(
  element: HTMLElement,
  event: string,
  eventHandlerEvn: EventListener,
) {
  if (element && event && eventHandlerEvn) {
    element.removeEventListener(event, eventHandlerEvn);
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const eventListener = {
  on(element: HTMLElement, event: string, callback: EventListener) {
    if (!elementMap.has(element)) {
      elementMap.set(element, {
        events: new Map([[event, { callbacks: [callback], eventHandler }]]),
      });
    } else {
      const mapEvent = elementMap.get(element)!.events;
      if (!mapEvent.has(event)) {
        mapEvent.set(event, { callbacks: [callback], eventHandler });
      } else {
        mapEvent.get(event)!.callbacks.push(callback);
      }
    }
    element.addEventListener(event, eventHandler);
  },

  off(element: HTMLElement, event?: string, callback?: EventListener) { // jako off
    if (elementMap.has(element)) {
      if (event && elementMap.get(element)!.events.has(event)) { //  pojednostavi event je vazna provjera
        const callbackData = elementMap.get(element)!.events.get(event);
        if (callbackData) {
          if (callback) { // vazna provjera
            const index = callbackData.callbacks.indexOf(callback, 0);
            if (index > -1) {
              callbackData.callbacks.splice(index, 1);
              if (callbackData.callbacks.length === 0) {
                elementMap.get(element)!.events.delete(event);
                removeEvent(element, event, callbackData.eventHandler);
              }
            }
          } else {
            removeEvent(element, event, callbackData.eventHandler);
            elementMap.get(element)!.events.delete(event);
          }
        }
      } else {
        elementMap.forEach((elementValue, elementKey) => {
          elementValue.events.forEach((eventValue, eventKey) => {
            removeEvent(elementKey, eventKey, eventValue.eventHandler);
          });
        });
        elementMap.clear();
      }
    }
  },

  trigger(element: HTMLElement, event: string) {
    const triggerEvent = new Event(event);
    element.dispatchEvent(triggerEvent);
  },

  delegate(element: HTMLElement, className: string, eventType: string, callback: EventListener) {
    // eslint-disable-next-line consistent-return
    element.addEventListener(eventType, (event: Event) => {
      // eslint-disable-next-line prefer-destructuring
      const target = <HTMLElement>event.target;
      if (target) {
        if (target.className === className) {
          return callback(event);
        }
        const targetClosest = target.closest(`.${className}`);
        if (targetClosest && element.contains(targetClosest)) {
          return callback(event);
        }
      }
    });
  },
};
