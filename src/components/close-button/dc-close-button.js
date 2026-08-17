import { createStyleSheet, HTMLElementBase } from "../../styles/shared.js";

const styles = createStyleSheet(/* css */ `
  :host {
    display: inline-flex;
  }

  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.75rem;
    height: 1.75rem;
    padding: 0;
    border: none;
    border-radius: var(--dc-close-button-radius, 6px);
    background: transparent;
    color: var(--dc-close-button-color, var(--dc-color-text-muted, #6b7280));
    font-size: 1.125rem;
    line-height: 1;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      color 0.15s ease;
  }

  button:hover {
    background: var(
      --dc-close-button-bg-hover,
      var(--dc-color-secondary-hover, #f3f4f6)
    );
    color: var(--dc-close-button-color-hover, var(--dc-color-text, #111827));
  }

  button:focus-visible {
    outline: none;
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px var(--dc-close-button-focus-ring, #6b7280);
  }
`);

/**
 * A small round button with an × icon, used to close or clear things.
 *
 * @element dc-close-button
 *
 * @attr {string} [label="Close"] - Accessible label for the button.
 *
 * @cssprop [--dc-close-button-color=#6b7280] - Icon color.
 * @cssprop [--dc-close-button-bg-hover=#f3f4f6] - Background color on hover.
 * @cssprop [--dc-close-button-color-hover=#111827] - Icon color on hover.
 * @cssprop [--dc-close-button-focus-ring=#6b7280] - Focus ring color.
 * @cssprop [--dc-close-button-radius=6px] - Border radius.
 */
export class DcCloseButton extends HTMLElementBase {
  static get observedAttributes() {
    return ["label"];
  }

  #button;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [styles];

    shadow.innerHTML = /* html */ `
      <button type="button">×</button>
    `;
    this.#button = shadow.querySelector("button");
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    this.#button.setAttribute(
      "aria-label",
      this.getAttribute("label") ?? "Close",
    );
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("dc-close-button")
) {
  customElements.define("dc-close-button", DcCloseButton);
}
