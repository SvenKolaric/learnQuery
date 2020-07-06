
import cssClass from '03.CSS_class_manipulation/src/cssClassManipulationTs';
import domSelector from '01.dom_selector/src/selectorTs';


// eslint-disable-next-line @typescript-eslint/no-unused-vars
class LearnQuery {
  private element: HTMLElement[];

  constructor(elementIdentifier: string) {
    this.element = domSelector(elementIdentifier);
  }

  addClass(className: string) {
    cssClass.add(this.element[0], className);
    return this;
  }
}

/*
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const learnQuery = (elementHtml: string) => {
  const element = domSelector(elementHtml);
  const api = {
    addClass(className: string) {
      cssClass.add(element[0] as HTMLElement, className);
      return api;
    },
  };
  return api;
};
 */
