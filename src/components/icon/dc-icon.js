// Makes `extends HTMLElement` below safe to evaluate outside a browser (SSR).
import "../../utils/dom-shim.js";

// Pinned (not @latest) so icon markup can't change under us and stays
// cacheable indefinitely by jsDelivr/the browser. Bump by hand when needed.
const ICON_CDN_BASE =
  "https://cdn.jsdelivr.net/npm/lucide-static@1.33.0/icons/";
const DEFAULT_SIZE = 24;
const NAME_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Shared across every <dc-icon> instance so the same icon is only ever
// fetched once per page, no matter how many elements use it.
const svgCache = new Map();

function fetchIconMarkup(name) {
  if (svgCache.has(name)) return svgCache.get(name);

  const promise = fetch(`${ICON_CDN_BASE}${name}.svg`).then((response) => {
    if (!response.ok) {
      throw new Error(`dc-icon: icon "${name}" not found (${response.status})`);
    }
    return response.text();
  });

  // Don't cache a failed lookup - a typo'd name shouldn't be poisoned forever.
  promise.catch(() => svgCache.delete(name));
  svgCache.set(name, promise);
  return promise;
}

const styles = /* css */ `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    color: var(--dc-icon-color, inherit);
    vertical-align: middle;
  }

  .icon,
  .icon svg {
    display: block;
    width: 100%;
    height: 100%;
  }
`;

const html = /* html */ `<span
    class="icon"
    part="icon"
    aria-hidden="true"
  ></span>`;

/**
 * Renders an icon by name as inline SVG, fetched from a CDN (lucide-static)
 * so it inherits `currentColor` and can be styled like any other element.
 *
 * @element dc-icon
 *
 * @attr {string} name - Icon name, matching a lucide icon filename (e.g. "heart", "arrow-right").
 * Browse available names at https://lucide.dev/icons/
 * @attr {number} [size=24] - Width/height in pixels. Applied immediately so the icon's box is
 * reserved before the SVG has finished loading, avoiding layout shift.
 *
 * @cssprop [--dc-icon-color=inherit] - Icon color.
 */
export class DcIcon extends HTMLElement {
  static get observedAttributes() {
    return ["name", "size"];
  }

  #container;
  #requestId = 0;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });

    shadow.innerHTML = `
      <style>
        ${styles}
      </style>
      ${html}
    `;
    this.#container = shadow.querySelector(".icon");
  }

  connectedCallback() {
    this.#applySize();
    this.#load();
  }

  attributeChangedCallback(name) {
    if (name === "size") this.#applySize();
    if (name === "name") this.#load();
  }

  /** @type {string} */
  get name() {
    return this.getAttribute("name") ?? "";
  }

  /** @param {string} value */
  set name(value) {
    this.setAttribute("name", value);
  }

  /** @type {number} */
  get size() {
    const value = Number(this.getAttribute("size"));
    return Number.isFinite(value) && value > 0 ? value : DEFAULT_SIZE;
  }

  /** @param {number} value */
  set size(value) {
    this.setAttribute("size", String(value));
  }

  #applySize() {
    const px = `${this.size}px`;
    this.style.width = px;
    this.style.height = px;
  }

  async #load() {
    const name = this.name;
    const requestId = ++this.#requestId;
    this.#container.replaceChildren();

    if (!name) return;
    if (!NAME_PATTERN.test(name)) {
      console.error(`dc-icon: invalid icon name "${name}"`);
      return;
    }

    try {
      const markup = await fetchIconMarkup(name);
      // The name (or the element itself) may have moved on while this was
      // in flight - drop stale responses instead of racing them in.
      if (requestId !== this.#requestId) return;

      const svg = new DOMParser().parseFromString(
        markup,
        "image/svg+xml",
      ).documentElement;
      svg.querySelectorAll("script").forEach((el) => el.remove());
      svg.setAttribute("width", "100%");
      svg.setAttribute("height", "100%");

      this.#container.replaceChildren(svg);
    } catch (err) {
      if (requestId !== this.#requestId) return;
      console.error(err);
    }
  }
}

if (typeof customElements !== "undefined" && !customElements.get("dc-icon")) {
  customElements.define("dc-icon", DcIcon);
}
