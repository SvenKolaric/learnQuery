/* eslint-disable no-console */
interface EventsMap {
  events: Map<string, EventListener[]>
}

const elementMap: Map<HTMLElement, EventsMap> = new Map<HTMLElement, EventsMap>();

function eventHandler(event: Event) {
  // eslint-disable-next-line prefer-destructuring
  const target = <HTMLElement>event.target;
  if (target && elementMap.has(target) && elementMap.get(target)?.events.has(event.type)) {
    const callbackArray = elementMap.get(target)!.events.get(event.type);
    callbackArray!.forEach((callback) => {
      callback(event);
    });
  } else {
    console.warn(`EventHandler doesn't have the required data for event: "${event.type}" on element: ${target.id}`);
  }
}

function removeEvent(
  element: HTMLElement,
  event: string,
) {
  if (element && event) {
    element.removeEventListener(event, eventHandler);
  } else {
    console.warn(`RemoveEvent is missing required data, element: ${element.id}, event: "${event}"`);
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
    if (elementMap.has(element)) {
      const eventMap = elementMap.get(element);
      if (event) {
        const callbackArray = eventMap!.events.get(event);
        if (callbackArray) {
          if (callback) {
            const index = callbackArray.indexOf(callback, 0);
            if (index > -1) {
              callbackArray.splice(index, 1);
              if (callbackArray.length === 0) {
                eventMap!.events.delete(event);
                removeEvent(element, event);
                if (eventMap!.events.size === 0) {
                  elementMap.delete(element);
                }
              }
            } else {
              console.warn(`The callback function doesn't exist inside events.callbacks for event: "${event}" on element: ${element.id}`);
            }
          } else {
            removeEvent(element, event);
            eventMap!.events.delete(event);
            if (eventMap!.events.size === 0) {
              elementMap.delete(element);
            }
          }
        } else {
          console.warn(`The given element "${element.id}" doesn't have any event of type: "${event}"`);
        }
      } else {
        elementMap.forEach((elementValue, elementKey) => {
          elementValue.events.forEach((eventValue, eventKey) => {
            removeEvent(elementKey, eventKey);
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
