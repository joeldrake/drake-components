import { DcDialog } from "../components/dialog/dc-dialog.js";

export default {
  title: "Scoped Registry",
};

/**
 * Manual verification that `dc-dialog` correctly propagates a scoped
 * `CustomElementRegistry` to the `<dc-close-button>` it renders internally,
 * via `attachScopedShadow()` (utils/attach-scoped-shadow.js). This isn't
 * automatic: a nested shadow root that omits `customElementRegistry` does
 * NOT reliably inherit its host's registry - browsers disagree on that - so
 * `dc-dialog` explicitly reads `getRootNode().customElementRegistry` and
 * passes it to its own internal `attachShadow()` call.
 *
 * To prove it, the scoped registry here defines a deliberately different
 * "dc-close-button": a red block reading "SCOPED" instead of the real
 * component. If propagation works, the dialog's close button (top right)
 * renders as that red block. If it instead shows the library's normal (×)
 * close button, `dc-dialog`'s internal shadow root fell back to the global
 * registry and the fix isn't working.
 *
 * Requires a browser with scoped registry support (Chrome/Edge 146+, Safari
 * 26+) - Firefox doesn't have it yet.
 */
export const ScopedRegistryInheritance = () => {
  const container = document.createElement("div");

  if (typeof CustomElementRegistry !== "function") {
    container.textContent =
      "This browser doesn't support scoped custom element registries (needs Chrome/Edge 146+ or Safari 26+).";
    return container;
  }

  class MarkerCloseButton extends HTMLElement {
    connectedCallback() {
      this.attachShadow({ mode: "open" }).innerHTML = `
        <button style="background:crimson;color:#fff;font:bold 11px sans-serif;padding:4px 8px;border:none;border-radius:4px;cursor:pointer;">
          SCOPED
        </button>
      `;
    }
  }

  const registry = new CustomElementRegistry();
  registry.define("dc-dialog", DcDialog);
  registry.define("dc-close-button", MarkerCloseButton);

  const host = document.createElement("div");
  const shadow = host.attachShadow({
    mode: "open",
    customElementRegistry: registry,
  });
  shadow.innerHTML = `
    <dc-dialog open>
      If the close button (top right) reads "SCOPED" in red, nested elements
      inherit the scoped registry as expected. If it shows the normal (×)
      close button instead, they fall back to the global registry.
    </dc-dialog>
  `;

  container.appendChild(host);
  return container;
};
