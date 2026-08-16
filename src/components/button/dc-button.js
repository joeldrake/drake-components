import { sharedStyles } from "../../styles/shared.js";

const styles = new CSSStyleSheet();
styles.replaceSync(/* css */ `
  :host {
    display: inline-block;
  }

  button {
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 1rem;
    font-weight: 500;
    line-height: 1;
    border-radius: 9999px;
    border: 1px solid transparent;
    cursor: pointer;
    transition:
      background-color 0.15s ease,
      border-color 0.15s ease,
      opacity 0.15s ease;
  }

  button:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  button:focus-visible {
    outline: none;
  }

  /* sizes */
  button.sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  button.md {
    height: 36.5px;
    padding: 0.5rem 1rem;
  }
  button.lg {
    padding: 0.75rem 1.5rem;
  }

  /* variants */
  button.primary {
    background: var(
      --dc-button-bg,
      var(--dc-button-primary-bg, var(--dc-color-primary, #2563eb))
    );
    border-color: var(
      --dc-button-border,
      var(--dc-button-primary-border, var(--dc-color-primary, #2563eb))
    );
    color: var(
      --dc-button-color,
      var(--dc-button-primary-color, var(--dc-color-on-primary, #fff))
    );
  }
  button.primary:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(--dc-button-primary-bg-hover, var(--dc-color-primary-hover, #1d4ed8))
    );
    border-color: var(
      --dc-button-border-hover,
      var(
        --dc-button-primary-border-hover,
        var(--dc-color-primary-hover, #1d4ed8)
      )
    );
  }
  button.primary:focus-visible {
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px
        var(
          --dc-button-focus-ring,
          var(
            --dc-button-primary-focus-ring,
            var(--dc-color-focus-ring, #1d4ed8)
          )
        );
  }

  button.secondary {
    background: var(
      --dc-button-bg,
      var(--dc-button-secondary-bg, var(--dc-color-secondary, #fff))
    );
    border-color: var(
      --dc-button-border,
      var(--dc-button-secondary-border, var(--dc-color-border, #d1d5db))
    );
    color: var(
      --dc-button-color,
      var(--dc-button-secondary-color, var(--dc-color-on-secondary, #111827))
    );
  }
  button.secondary:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(
        --dc-button-secondary-bg-hover,
        var(--dc-color-secondary-hover, #f3f4f6)
      )
    );
    border-color: var(
      --dc-button-border-hover,
      var(--dc-button-secondary-border-hover, var(--dc-color-border, #d1d5db))
    );
  }
  button.secondary:focus-visible {
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px
        var(
          --dc-button-focus-ring,
          var(--dc-button-secondary-focus-ring, #6b7280)
        );
  }

  button.danger {
    background: var(
      --dc-button-bg,
      var(--dc-button-danger-bg, var(--dc-color-danger, #dc2626))
    );
    border-color: var(
      --dc-button-border,
      var(--dc-button-danger-border, var(--dc-color-danger, #dc2626))
    );
    color: var(
      --dc-button-color,
      var(--dc-button-danger-color, var(--dc-color-on-danger, #fff))
    );
  }
  button.danger:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(--dc-button-danger-bg-hover, var(--dc-color-danger-hover, #b91c1c))
    );
    border-color: var(
      --dc-button-border-hover,
      var(
        --dc-button-danger-border-hover,
        var(--dc-color-danger-hover, #b91c1c)
      )
    );
  }
  button.danger:focus-visible {
    box-shadow:
      0 0 0 2px #fff,
      0 0 0 4px
        var(--dc-button-focus-ring, var(--dc-button-danger-focus-ring, #b91c1c));
  }
`);

/** @typedef {"primary" | "secondary" | "danger"} DcButtonVariant */
/** @typedef {"sm" | "md" | "lg"} DcButtonSize */

const VARIANTS = ["primary", "secondary", "danger"];
const SIZES = ["sm", "md", "lg"];

/**
 * A button element with variant, size and disabled states.
 *
 * @element dc-button
 *
 * @attr {"primary" | "secondary" | "danger"} [variant="primary"] - Visual style of the button.
 * @attr {"sm" | "md" | "lg"} [size="md"] - Size of the button.
 * @attr {boolean} [disabled=false] - Disables the button and prevents interaction.
 *
 * @slot - Button label content.
 *
 * @cssprop [--dc-button-bg] - Background color, overrides the variant default for all variants.
 * @cssprop [--dc-button-border] - Border color, overrides the variant default for all variants.
 * @cssprop [--dc-button-color] - Text color, overrides the variant default for all variants.
 * @cssprop [--dc-button-bg-hover] - Background color on hover, overrides the variant default for all variants.
 * @cssprop [--dc-button-border-hover] - Border color on hover, overrides the variant default for all variants.
 * @cssprop [--dc-button-focus-ring] - Focus ring color, overrides the variant default for all variants.
 * @cssprop [--dc-button-primary-bg=#2563eb] - Background color for the `primary` variant.
 * @cssprop [--dc-button-primary-border=#2563eb] - Border color for the `primary` variant.
 * @cssprop [--dc-button-primary-color=#fff] - Text color for the `primary` variant.
 * @cssprop [--dc-button-primary-bg-hover=#1d4ed8] - Background color for the `primary` variant on hover.
 * @cssprop [--dc-button-primary-border-hover=#1d4ed8] - Border color for the `primary` variant on hover.
 * @cssprop [--dc-button-primary-focus-ring=#1d4ed8] - Focus ring color for the `primary` variant.
 * @cssprop [--dc-button-secondary-bg=#fff] - Background color for the `secondary` variant.
 * @cssprop [--dc-button-secondary-border=#d1d5db] - Border color for the `secondary` variant.
 * @cssprop [--dc-button-secondary-color=#111827] - Text color for the `secondary` variant.
 * @cssprop [--dc-button-secondary-bg-hover=#f3f4f6] - Background color for the `secondary` variant on hover.
 * @cssprop [--dc-button-secondary-border-hover=#d1d5db] - Border color for the `secondary` variant on hover.
 * @cssprop [--dc-button-secondary-focus-ring=#6b7280] - Focus ring color for the `secondary` variant.
 * @cssprop [--dc-button-danger-bg=#dc2626] - Background color for the `danger` variant.
 * @cssprop [--dc-button-danger-border=#dc2626] - Border color for the `danger` variant.
 * @cssprop [--dc-button-danger-color=#fff] - Text color for the `danger` variant.
 * @cssprop [--dc-button-danger-bg-hover=#b91c1c] - Background color for the `danger` variant on hover.
 * @cssprop [--dc-button-danger-border-hover=#b91c1c] - Border color for the `danger` variant on hover.
 * @cssprop [--dc-button-danger-focus-ring=#b91c1c] - Focus ring color for the `danger` variant.
 */
export class DcButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled"];
  }

  #button;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sharedStyles, styles];

    shadow.innerHTML = /* html */ `
      <button>
        <slot></slot>
      </button>
    `;
    this.#button = shadow.querySelector("button");
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  /** @type {DcButtonVariant} */
  get variant() {
    const value = this.getAttribute("variant");
    return VARIANTS.includes(value) ? value : "primary";
  }

  /** @param {DcButtonVariant} value */
  set variant(value) {
    this.setAttribute("variant", value);
  }

  /** @type {DcButtonSize} */
  get size() {
    const value = this.getAttribute("size");
    return SIZES.includes(value) ? value : "md";
  }

  /** @param {DcButtonSize} value */
  set size(value) {
    this.setAttribute("size", value);
  }

  /** @type {boolean} */
  get disabled() {
    return this.hasAttribute("disabled");
  }

  /** @param {boolean} value */
  set disabled(value) {
    this.toggleAttribute("disabled", Boolean(value));
  }

  #render() {
    this.#button.className = `${this.variant} ${this.size}`;
    this.#button.disabled = this.disabled;
  }
}

if (!customElements.get("dc-button")) {
  customElements.define("dc-button", DcButton);
}
