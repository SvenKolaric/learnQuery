const cssProp = (element: HTMLElement, cssProperty: string | { [index: string]: string }, value?: string) => {
  const styles = element.style;
  if (!value) {
    if (typeof cssProperty === "string") {
      return styles.getPropertyValue(cssProperty);
    } else {
      Object.keys(cssProperty).forEach(key => {
        styles.setProperty(key, cssProperty[key])
      });
    }
  } else {
    styles.setProperty(cssProperty as string, value);
  }
}
