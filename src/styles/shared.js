/**
 * Constructable stylesheets don't exist outside a browser (e.g. during SSR).
 * Importing a dc-* component must not throw in that environment, so
 * stylesheet creation is guarded and only does real work once actually
 * running in a browser. See dom-shim.js for the `HTMLElement` equivalent.
 */
export function createStyleSheet(cssText) {
  if (typeof CSSStyleSheet === "undefined") return undefined;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(cssText);
  return sheet;
}

/**
 * Base styles shared across dc-* components. Adopt this alongside a
 * component's own stylesheet via `shadow.adoptedStyleSheets`; it sets
 * font-family on :host, which inherits into the shadow tree.
 */
export const sharedStyles = createStyleSheet(/* css */ `
  :host {
    font-family:
      "Inter",
      -apple-system,
      "Helvetica Neue",
      Helvetica,
      Arial,
      sans-serif;
  }
`);
