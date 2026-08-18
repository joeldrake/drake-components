/**
 * Base styles shared across dc-* components. Interpolate this into a
 * component's own `<style>` block inside its shadow root; it sets
 * font-family on :host, which inherits into the shadow tree.
 */
export const sharedStyles = /* css */ `
  :host {
    font-family:
      "Inter",
      -apple-system,
      "Helvetica Neue",
      Helvetica,
      Arial,
      sans-serif;
  }
`;
