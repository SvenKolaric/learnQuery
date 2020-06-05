// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cssClass = {
  add(
    htmlElement: HTMLElement,
    className: string,
  ) {
    htmlElement.classList.add(className);
  },
  remove(
    htmlElement: HTMLElement,
    className: string,
  ) {
    htmlElement.classList.remove(className);
  },
  toggle(
    htmlElement: HTMLElement,
    className: string,
  ) {
    htmlElement.classList.toggle(className);
  },
  has(
    htmlElement: HTMLElement,
    className: string,
  ) {
    return htmlElement.classList.contains(className);
  },
};
