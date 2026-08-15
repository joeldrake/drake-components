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
    font-weight: 600;
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
    background: #2563eb;
    border-color: #2563eb;
    color: #fff;
  }
  button.primary:not(:disabled):hover {
    background: #1d4ed8;
    border-color: #1d4ed8;
  }

  button.secondary {
    background: #fff;
    border-color: #d1d5db;
    color: #111827;
  }
  button.secondary:not(:disabled):hover {
    background: #f3f4f6;
  }

  button.danger {
    background: #dc2626;
    border-color: #dc2626;
    color: #fff;
  }
  button.danger:not(:disabled):hover {
    background: #b91c1c;
    border-color: #b91c1c;
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
