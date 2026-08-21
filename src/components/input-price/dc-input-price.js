import "../input/dc-input.js";
// Makes `extends HTMLElement` below safe to evaluate outside a browser (SSR).
import "../../utils/dom-shim.js";
import { sharedStyles } from "../../styles/shared.js";

const styles = /* css */ `
  :host {
    display: inline-block;
    width: 100%;
  }

  dc-input {
    width: 100%;
  }
`;

const html = /* html */ `<dc-input
    part="input"
    inputmode="decimal"
  ></dc-input>`;

const PRICE_FORMATTER = new Intl.NumberFormat("sv-SE", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/** @typedef {"sm" | "md" | "lg"} DcInputSize */

const SIZES = ["sm", "md", "lg"];

// Intl.NumberFormat("sv-SE") renders negative numbers with the Unicode minus
// sign (U+2212), not a plain hyphen-minus. Recognize both so a formatted
// value re-entering the filter (retyping, re-blurring, attribute updates)
// doesn't have its sign silently stripped.
const MINUS_SIGNS = ["-", "−"];

/**
 * Filters raw input text down to a valid, partial price: digits, at most one
 * decimal separator (`.` or `,`), and an optional leading minus sign. Also
 * tracks where `cursorPos` (an index into `raw`) ends up in the filtered
 * result, so callers can keep the caret in place after stripped characters
 * (e.g. a thousands-separator space) shift the text around it.
 *
 * @param {string} raw
 * @param {number} [cursorPos]
 * @returns {{ value: string, cursor: number }}
 */
function filterRawValueWithCursor(raw, cursorPos = raw.length) {
  let out = "";
  let hasSeparator = false;
  let cursor = 0;

  for (let i = 0; i < raw.length; i++) {
    const char = raw[i];
    const kept =
      (i === 0 && MINUS_SIGNS.includes(char)) ||
      (char >= "0" && char <= "9") ||
      (!hasSeparator && (char === "." || char === ","));

    if (kept) {
      out += char;
      if (char === "." || char === ",") hasSeparator = true;
    }
    if (i < cursorPos) cursor = out.length;
  }

  return { value: out, cursor };
}

/**
 * Filters raw input text down to a valid, partial price: digits, at most one
 * decimal separator (`.` or `,`), and an optional leading minus sign.
 *
 * @param {string} raw
 * @returns {string}
 */
function filterRawValue(raw) {
  return filterRawValueWithCursor(raw).value;
}

/**
 * Formats raw input text as a Swedish price with two decimals. Returns an
 * empty string if the value doesn't resolve to a number (e.g. it's empty or
 * only a minus sign / decimal separator).
 *
 * @param {string} raw
 * @returns {string}
 */
function formatValue(raw) {
  const filtered = filterRawValue(raw);
  const numeric = Number(filtered.replace(",", "."));
  return filtered === "" || Number.isNaN(numeric)
    ? ""
    : PRICE_FORMATTER.format(numeric);
}

/**
 * A price input, wrapping `dc-input`. Restricts typed input to digits, a
 * single decimal separator and a leading minus sign, then formats the value
 * as a Swedish price (two decimals) on blur.
 *
 * @element dc-input-price
 *
 * @attr {"sm" | "md" | "lg"} [size="md"] - Size of the input.
 * @attr {string} [placeholder] - Placeholder text.
 * @attr {string} [name] - Name submitted with the input's form.
 * @attr {string} [value] - Initial value of the input.
 * @attr {boolean} [disabled=false] - Disables the input and prevents interaction.
 *
 * @fires {CustomEvent} dc-input - Fired with `{ value }` on every value change, mirroring the native `input` event.
 * @fires {CustomEvent} dc-change - Fired with `{ value }` when the change is committed, mirroring the native `change` event.
 */
export class DcInputPrice extends HTMLElement {
  static get observedAttributes() {
    return ["size", "placeholder", "name", "value", "disabled"];
  }

  #input;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        ${sharedStyles}${styles}
      </style>
      ${html}
    `;

    this.#input = shadow.querySelector("dc-input");

    this.#input.addEventListener("dc-input", (event) => {
      event.stopPropagation();
      const raw = event.detail.value;
      const nativeInput = this.#input.shadowRoot.querySelector("input");
      const { value: filtered, cursor } = filterRawValueWithCursor(
        raw,
        nativeInput.selectionStart ?? raw.length,
      );
      if (filtered !== this.#input.value) {
        this.#input.value = filtered;
        nativeInput.setSelectionRange(cursor, cursor);
      }
      this.#emitInput();
    });

    this.#input.addEventListener("dc-change", (event) => {
      event.stopPropagation();
      this.#emitChange();
    });

    this.#input.addEventListener("focusout", () => this.#formatOnBlur());

    // The clear button lives inside dc-input's own shadow tree, so moving
    // focus there is just an internal focus change to dc-input from the
    // outside — it doesn't reliably raise a "focusout" on the text input in
    // every browser (e.g. Safari doesn't focus buttons on click). Format
    // explicitly when it gains focus too.
    this.#input.shadowRoot
      .querySelector(".clear")
      .addEventListener("focusin", () => this.#formatOnBlur());
  }

  connectedCallback() {
    this.#render();
  }

  attributeChangedCallback() {
    this.#render();
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
    this.#input.value = filterRawValue(value ?? "");
  }

  /** Clears the input's value and fires `dc-input`/`dc-change`. */
  clear() {
    this.#input.clear();
  }

  /** Focuses the input. */
  focus(options) {
    this.#input.focus(options);
  }

  #formatOnBlur() {
    const formatted = formatValue(this.#input.value);
    if (formatted === this.#input.value) return;
    this.#input.value = formatted;
    this.#emitInput();
    this.#emitChange();
  }

  #emitInput() {
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

  #render() {
    this.#input.size = this.size;
    this.#input.setAttribute(
      "placeholder",
      this.getAttribute("placeholder") ?? "",
    );
    this.#input.setAttribute("name", this.getAttribute("name") ?? "");
    this.#input.disabled = this.disabled;
    if (
      this.hasAttribute("value") &&
      this.value !== this.getAttribute("value")
    ) {
      const raw = this.getAttribute("value");
      this.#input.value = this.matches(":focus-within")
        ? filterRawValue(raw)
        : formatValue(raw);
    }
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("dc-input-price")
) {
  customElements.define("dc-input-price", DcInputPrice);
}
