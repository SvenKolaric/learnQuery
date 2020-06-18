/* eslint-disable no-console */
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
  } else {
    console.warn(`EventHandler doesn't have the required data for event: "${event.type}" on element: ${target.id}`);
  }
}

function removeEvent(
  element: HTMLElement,
  event: string,
  eventHandlerEvn: EventListener,
) {
  if (element && event && eventHandlerEvn) {
    element.removeEventListener(event, eventHandlerEvn);
  } else {
    console.warn(`RemoveEvent is missing required data, element: ${element.id}, event: "${event}" or eventHandler`);
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

  off(element: HTMLElement, event?: string, callback?: EventListener) {
    if (elementMap.has(element)) {
      const eventMap = elementMap.get(element);
      if (event) {
        const callbackData = eventMap!.events.get(event);
        if (callbackData) {
          if (callback) {
            const index = callbackData.callbacks.indexOf(callback, 0);
            if (index > -1) {
              callbackData.callbacks.splice(index, 1);
              if (callbackData.callbacks.length === 0) {
                eventMap!.events.delete(event);
                removeEvent(element, event, callbackData.eventHandler);
              }
            } else {
              console.warn(`The callback function doesn't exist inside events.callbacks for event: "${event}" on element: ${element.id}`);
            }
          } else {
            removeEvent(element, event, callbackData.eventHandler);
            eventMap!.events.delete(event);
          }
        } else {
          console.warn(`The given element "${element.id}" doesn't have any event of type: "${event}"`);
        }
      } else {
        elementMap.forEach((elementValue, elementKey) => {
          elementValue.events.forEach((eventValue, eventKey) => {
            removeEvent(elementKey, eventKey, eventValue.eventHandler);
          });
        });
        elementMap.clear();
      }
    } else {
      console.warn(`The given element dosen't exist inside elementMap: ${element.id}`);
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
      } else {
        console.warn('Event target is null');
      }
    });
  },
};
