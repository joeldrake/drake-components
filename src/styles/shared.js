/**
 * Base styles shared across dc-* components. Adopt this alongside a
 * component's own stylesheet via `shadow.adoptedStyleSheets`; it sets
 * font-family on :host, which inherits into the shadow tree.
 */
export const sharedStyles = new CSSStyleSheet();
sharedStyles.replaceSync(/* css */ `
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
