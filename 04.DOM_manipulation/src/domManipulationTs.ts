// eslint-disable-next-line @typescript-eslint/no-unused-vars
const dom = {
  remove(element: HTMLElement) {
    element.remove();
  },
  append(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.append(element);
  },
  after(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.after(element);
  },
  before(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.before(element);
  },
  prepend(targetElement: HTMLElement, element: HTMLElement) {
    targetElement.prepend(element);
  },
  val(element: HTMLInputElement) {
    return element.value ? element.value : element.textContent;
  },
};
