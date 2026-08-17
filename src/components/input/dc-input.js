import "../close-button/dc-close-button.js";
import {
  sharedStyles,
  createStyleSheet,
  HTMLElementBase,
} from "../../styles/shared.js";

const styles = createStyleSheet(/* css */ `
  :host {
    display: inline-block;
    width: 100%;
  }

  .wrapper {
    position: relative;
    display: flex;
    align-items: center;
  }

  input {
    font-size: 1rem;
    line-height: 1;
    width: 100%;
    border-radius: var(--dc-input-radius, 8px);
    border: 1px solid var(--dc-input-border, var(--dc-color-border, #d1d5db));
    background: var(--dc-input-bg, var(--dc-color-bg, #fff));
    color: var(--dc-input-color, var(--dc-color-text, #111827));
    outline: none;
    transition:
      border-color 0.15s ease,
      box-shadow 0.15s ease;
  }

  input::placeholder {
    color: var(
      --dc-input-placeholder-color,
      var(--dc-color-placeholder, #9ca3af)
    );
  }

  input:not(:disabled):hover {
    border-color: var(
      --dc-input-border-hover,
      var(--dc-color-border-hover, #9ca3af)
    );
  }

  input:focus-visible {
    border-color: var(
      --dc-input-border-focus,
      var(--dc-color-focus-ring, #2563eb)
    );
    box-shadow: 0 0 0 3px var(--dc-input-focus-ring, rgb(37 99 235 / 0.15));
  }

  input:disabled {
    cursor: not-allowed;
    opacity: 0.5;
    background: var(--dc-input-bg-disabled, var(--dc-color-bg-subtle, #f9fafb));
  }

  /* sizes */
  input.sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8125rem;
  }
  input.md {
    padding: 0.5rem 1rem;
  }
  input.lg {
    padding: 0.75rem 1.5rem;
  }

  .wrapper.has-value input {
    padding-right: 2.5rem;
  }

  .clear {
    display: none;
    position: absolute;
    right: calc(0.375rem - 1px);
    --dc-close-button-radius: calc(var(--dc-input-radius, 8px) - 5px);
  }

  .wrapper.has-value .clear {
    display: flex;
  }
`);

/** @typedef {"text" | "email" | "password" | "search" | "tel" | "url" | "number"} DcInputType */
/** @typedef {"sm" | "md" | "lg"} DcInputSize */

const TYPES = ["text", "email", "password", "search", "tel", "url", "number"];
const SIZES = ["sm", "md", "lg"];

/**
 * A text input with a clear button that appears when it has content.
 *
 * @element dc-input
 *
 * @attr {"text" | "email" | "password" | "search" | "tel" | "url" | "number"} [type="text"] - Type of the input.
 * @attr {"sm" | "md" | "lg"} [size="md"] - Size of the input.
 * @attr {string} [placeholder] - Placeholder text.
 * @attr {string} [name] - Name submitted with the input's form.
 * @attr {string} [value] - Initial value of the input.
 * @attr {boolean} [disabled=false] - Disables the input and prevents interaction.
 * @attr {string} [inputmode] - Hints the virtual keyboard to display, e.g. "decimal" or "numeric".
 *
 * @fires {CustomEvent} dc-input - Fired with `{ value }` on every value change, mirroring the native `input` event.
 * @fires {CustomEvent} dc-change - Fired with `{ value }` when the change is committed, mirroring the native `change` event.
 *
 * @cssprop [--dc-input-bg=#fff] - Background color.
 * @cssprop [--dc-input-border=#d1d5db] - Border color.
 * @cssprop [--dc-input-border-hover=#9ca3af] - Border color on hover.
 * @cssprop [--dc-input-border-focus=#2563eb] - Border color when focused.
 * @cssprop [--dc-input-focus-ring=rgb(37 99 235 / 0.15)] - Focus ring color.
 * @cssprop [--dc-input-color=#111827] - Text color.
 * @cssprop [--dc-input-placeholder-color=#9ca3af] - Placeholder text color.
 * @cssprop [--dc-input-bg-disabled=#f9fafb] - Background color when disabled.
 * @cssprop [--dc-input-radius=8px] - Border radius.
 */
export class DcInput extends HTMLElementBase {
  static get observedAttributes() {
    return [
      "type",
      "size",
      "placeholder",
      "name",
      "value",
      "disabled",
      "inputmode",
    ];
  }

  #wrapper;
  #input;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sharedStyles, styles];

    shadow.innerHTML = /* html */ `
      <div class="wrapper">
        <input part="input" />
        <dc-close-button class="clear" label="Clear"></dc-close-button>
      </div>
    `;

    this.#wrapper = shadow.querySelector(".wrapper");
    this.#input = shadow.querySelector("input");

    this.#input.addEventListener("input", () => this.#emitInput());
    this.#input.addEventListener("change", () => this.#emitChange());
    shadow.querySelector(".clear").addEventListener("click", () => {
      this.clear();
      this.#input.focus();
    });
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
  }

  /** @type {DcInputType} */
  get type() {
    const value = this.getAttribute("type");
    return TYPES.includes(value) ? value : "text";
  }

  /** @param {DcInputType} value */
  set type(value) {
    this.setAttribute("type", value);
  }

  /** @type {DcInputSize} */
  get size() {
    const value = this.getAttribute("size");
    return SIZES.includes(value) ? value : "md";
  }

  /** @param {DcInputSize} value */
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

  /** @type {string} */
  get value() {
    return this.#input.value;
  }

  /** @param {string} value */
  set value(value) {
    this.#input.value = value;
    this.#syncHasValue();
  }

  /** Clears the input's value and fires `dc-input`/`dc-change`. */
  clear() {
    if (this.value === "") return;
    this.value = "";
    this.#emitInput();
    this.#emitChange();
  }

  /** Focuses the input. */
  focus(options) {
    this.#input.focus(options);
  }

  #emitInput() {
    this.#syncHasValue();
    this.dispatchEvent(
      new CustomEvent("dc-input", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #emitChange() {
    this.dispatchEvent(
      new CustomEvent("dc-change", {
        detail: { value: this.value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  #syncHasValue() {
    this.#wrapper.classList.toggle(
      "has-value",
      this.value !== "" && !this.disabled,
    );
  }

  #render() {
    this.#input.type = this.type;
    this.#input.className = this.size;
    this.#input.placeholder = this.getAttribute("placeholder") ?? "";
    this.#input.name = this.getAttribute("name") ?? "";
    this.#input.disabled = this.disabled;
    this.#input.inputMode = this.getAttribute("inputmode") ?? "";
    if (
      this.hasAttribute("value") &&
      this.value !== this.getAttribute("value")
    ) {
      this.#input.value = this.getAttribute("value");
    }
    this.#syncHasValue();
  }
}

if (typeof customElements !== "undefined" && !customElements.get("dc-input")) {
  customElements.define("dc-input", DcInput);
}
