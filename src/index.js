import { DcButton } from "./components/button/dc-button.js";
import { DcDialog } from "./components/dialog/dc-dialog.js";
import { DcCard } from "./components/card/dc-card.js";
import { DcInput } from "./components/input/dc-input.js";
import { DcInputPrice } from "./components/input-price/dc-input-price.js";
import { DcCloseButton } from "./components/close-button/dc-close-button.js";
import { DcIcon, preloadIcons } from "./components/icon/dc-icon.js";

export {
  DcButton,
  DcDialog,
  DcCard,
  DcInput,
  DcInputPrice,
  DcCloseButton,
  DcIcon,
  preloadIcons,
};

/**
 * Builds a scoped {@link CustomElementRegistry} with every Drake component
 * defined in it, for apps that want an isolated set of `dc-*` elements
 * instead of sharing the page's global registry - e.g. a micro-frontend
 * that needs to run alongside another copy/version of this library without
 * a `customElements.define()` name clash.
 *
 * Hand the result to `attachShadow({ customElementRegistry })` on the app's
 * own root element. Elements created inside that shadow tree resolve
 * against the scoped registry instead of the global one - including the
 * ones this library's components render internally, like `dc-dialog`'s
 * `dc-close-button`: a shadow root doesn't reliably inherit its host's
 * registry just by omitting the option (browsers disagree on that), so
 * those components explicitly read `getRootNode().customElementRegistry`
 * and pass it through to their own internal `attachShadow()` call (see
 * `attachScopedShadow()` in utils/attach-scoped-shadow.js).
 *
 * Returns `null` in browsers that don't support scoped registries yet
 * (Firefox, as of this writing) - callers should treat that as "fall back
 * to the global registry" by omitting `customElementRegistry` entirely,
 * which is exactly what happens automatically since every component here
 * also self-registers on the global registry when its module is imported.
 *
 * @returns {CustomElementRegistry | null}
 *
 * @example
 * import { createDrakeComponentRegistry } from "drake-components";
 *
 * const registry = createDrakeComponentRegistry();
 * const appRoot = document.querySelector("#my-app");
 * const shadow = appRoot.attachShadow({
 *   mode: "open",
 *   // Spread so unsupported browsers get a plain shadow root and fall
 *   // back to the global registry instead of an `undefined` value.
 *   ...(registry ? { customElementRegistry: registry } : {}),
 * });
 *
 * shadow.innerHTML = `<dc-button>Click me</dc-button>`;
 */
export function createDrakeComponentRegistry() {
  if (typeof CustomElementRegistry !== "function") return null;

  const registry = new CustomElementRegistry();
  registry.define("dc-button", DcButton);
  registry.define("dc-dialog", DcDialog);
  registry.define("dc-card", DcCard);
  registry.define("dc-input", DcInput);
  registry.define("dc-input-price", DcInputPrice);
  registry.define("dc-close-button", DcCloseButton);
  registry.define("dc-icon", DcIcon);
  return registry;
}
