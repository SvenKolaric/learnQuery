// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dom = {
  remove(element: HTMLElement) {
    element.remove();
  },
  append(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.append(element);
  },
  after(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.parentElement?.insertBefore(element, targetElement.nextSibling);
  },
  before(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.before(element);
  },
  prepend(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.prepend(element);
  },
  val(element: HTMLElement) {
    return (element as HTMLInputElement).value;
  },
};
