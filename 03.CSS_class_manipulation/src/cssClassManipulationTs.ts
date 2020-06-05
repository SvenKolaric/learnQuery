/* eslint-disable @typescript-eslint/naming-convention */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
class cssClass {
  static add = (
    htmlElement: HTMLElement,
    className: string,
  ) => {
    htmlElement.classList.add(className);
  };

  static remove = (
    htmlElement: HTMLElement,
    className: string,
  ) => {
    htmlElement.classList.remove(className);
  };

  static toggle = (
    htmlElement: HTMLElement,
    className: string,
  ) => {
    htmlElement.classList.toggle(className);
  };

  static has = (
    htmlElement: HTMLElement,
    className: string,
  ) => htmlElement.classList.contains(className);
}
