const styles = new CSSStyleSheet();
styles.replaceSync(/* css */ `
  :host {
    display: inline-block;
  }

  button {
    font-family:
      "Inter",
      -apple-system,
      "Helvetica Neue",
      Helvetica,
      Arial,
      sans-serif;
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

  /* sizes */
  button.sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  button.md {
    padding: 0.5rem 1rem;
  }
  button.lg {
    padding: 0.75rem 1.5rem;
  }

  /* variants */
  button.primary {
    background: var(--dc-button-bg, var(--dc-button-primary-bg, #2563eb));
    border-color: var(
      --dc-button-border,
      var(--dc-button-primary-border, #2563eb)
    );
    color: var(--dc-button-color, var(--dc-button-primary-color, #fff));
  }
  button.primary:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(--dc-button-primary-bg-hover, #1d4ed8)
    );
    border-color: var(
      --dc-button-border-hover,
      var(--dc-button-primary-border-hover, #1d4ed8)
    );
  }

  button.secondary {
    background: var(--dc-button-bg, var(--dc-button-secondary-bg, #fff));
    border-color: var(
      --dc-button-border,
      var(--dc-button-secondary-border, #d1d5db)
    );
    color: var(--dc-button-color, var(--dc-button-secondary-color, #111827));
  }
  button.secondary:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(--dc-button-secondary-bg-hover, #f3f4f6)
    );
    border-color: var(
      --dc-button-border-hover,
      var(--dc-button-secondary-border-hover, #d1d5db)
    );
  }

  button.danger {
    background: var(--dc-button-bg, var(--dc-button-danger-bg, #dc2626));
    border-color: var(
      --dc-button-border,
      var(--dc-button-danger-border, #dc2626)
    );
    color: var(--dc-button-color, var(--dc-button-danger-color, #fff));
  }
  button.danger:not(:disabled):hover {
    background: var(
      --dc-button-bg-hover,
      var(--dc-button-danger-bg-hover, #b91c1c)
    );
    border-color: var(
      --dc-button-border-hover,
      var(--dc-button-danger-border-hover, #b91c1c)
    );
  }
`);

const VARIANTS = ["primary", "secondary", "danger"];
const SIZES = ["sm", "md", "lg"];

export class DcButton extends HTMLElement {
  static get observedAttributes() {
    return ["variant", "size", "disabled"];
  }

  #button;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [styles];

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

  get variant() {
    const value = this.getAttribute("variant");
    return VARIANTS.includes(value) ? value : "primary";
  }

  set variant(value) {
    this.setAttribute("variant", value);
  }

  get size() {
    const value = this.getAttribute("size");
    return SIZES.includes(value) ? value : "md";
  }

  set size(value) {
    this.setAttribute("size", value);
  }

  get disabled() {
    return this.hasAttribute("disabled");
  }

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
