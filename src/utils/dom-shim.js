/**
 * Side-effect import: patches `HTMLElement` and `customElements` onto
 * globalThis when running outside a browser (e.g. SSR in Node), so that
 * `class X extends HTMLElement` and `customElements.define(...)` don't throw
 * just from being evaluated. ES modules run their imports before the rest of
 * the importing module's body, so importing this first guarantees the class
 * declaration below it always sees a defined `HTMLElement`.
 *
 * Inspired by @lit-labs/ssr-dom-shim, trimmed to what dc-* components need.
 */
if (typeof globalThis.HTMLElement === "undefined") {
  globalThis.HTMLElement = class HTMLElement {};
  globalThis.customElements = {
    define() {},
    get() {},
  };
}
