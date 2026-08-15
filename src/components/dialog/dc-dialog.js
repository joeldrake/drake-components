const styles = new CSSStyleSheet();
styles.replaceSync(/* css */ `
  dialog {
    font-family:
      "Inter",
      -apple-system,
      "Helvetica Neue",
      Helvetica,
      Arial,
      sans-serif;
    padding: 0;
    border: none;
    border-radius: 10px;
    background: var(--dc-dialog-bg, #fff);
    box-shadow:
      0 20px 25px -5px rgb(0 0 0 / 0.1),
      0 8px 10px -6px rgb(0 0 0 / 0.1);
    min-width: 320px;
    max-width: min(560px, calc(100vw - 2rem));
    view-transition-name: dc-dialog;
  }

  dialog::backdrop {
    background: var(--dc-dialog-backdrop, rgb(0 0 0 / 0.5));
  }

  .content {
    position: relative;
    padding: 1.5rem;
  }

  .close {
    position: absolute;
    top: 0.75rem;
    right: 0.75rem;
    width: 1.75rem;
    height: 1.75rem;
    border: none;
    border-radius: 6px;
    background: transparent;
    color: var(--dc-dialog-close-color, #6b7280);
    font-size: 1.125rem;
    line-height: 1;
    cursor: pointer;
  }

  .close:hover {
    background: var(--dc-dialog-close-bg-hover, #f3f4f6);
    color: var(--dc-dialog-close-color-hover, #111827);
  }

  .footer {
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 1.25rem;
  }

  .footer:empty {
    display: none;
  }
`);

// ::view-transition-* pseudo-elements are anchored to the document root, so
// they can't be reached from a shadow-root stylesheet - this has to be global.
function ensureViewTransitionStyles() {
  if (document.getElementById("dc-dialog-view-transition-styles")) return;

  const style = document.createElement("style");
  style.id = "dc-dialog-view-transition-styles";
  style.textContent = /* css */ `
    ::view-transition-old(dc-dialog),
    ::view-transition-new(dc-dialog) {
      animation-duration: 0.18s;
      animation-timing-function: ease;
    }

    ::view-transition-old(dc-dialog) {
      animation-name: dc-dialog-view-transition-out;
    }

    ::view-transition-new(dc-dialog) {
      animation-name: dc-dialog-view-transition-in;
    }

    @keyframes dc-dialog-view-transition-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
    }

    @keyframes dc-dialog-view-transition-out {
      to {
        opacity: 0;
        transform: scale(0.95);
      }
    }
  `;
  document.head.append(style);
}

/**
 * A modal dialog built on the native `<dialog>` element.
 *
 * @element dc-dialog
 *
 * @attr {boolean} [open=false] - Whether the dialog is open. Reflects `show()`/`close()`; showing/hiding it modally.
 *
 * @slot - Main dialog content.
 * @slot footer - Footer content, right-aligned below the main content. Hidden when empty.
 *
 * @fires {CustomEvent} dc-close - Fired when the dialog closes, whether via `close()`, the close button, Escape, or a backdrop click.
 *
 * @cssprop [--dc-dialog-bg=#fff] - Background color of the dialog.
 * @cssprop [--dc-dialog-backdrop=rgb(0 0 0 / 0.5)] - Background color of the `::backdrop`.
 * @cssprop [--dc-dialog-close-color=#6b7280] - Color of the close button icon.
 * @cssprop [--dc-dialog-close-bg-hover=#f3f4f6] - Background color of the close button on hover.
 * @cssprop [--dc-dialog-close-color-hover=#111827] - Color of the close button icon on hover.
 */
export class DcDialog extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  #dialog;
  #syncingAttribute = false;

  constructor() {
    super();
    ensureViewTransitionStyles();

    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [styles];

    shadow.innerHTML = /* html */ `
      <dialog
        role="dialog"
        aria-modal="true"
      >
        <div class="content">
          <button type="button" class="close" aria-label="Close">×</button>
          <slot></slot>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </dialog>
    `;

    this.#dialog = shadow.querySelector("dialog");
    shadow
      .querySelector(".close")
      .addEventListener("click", () => this.close());

    // Native <dialog> fires "close" both on Escape and on our own close() call.
    this.#dialog.addEventListener("close", () => {
      if (this.#syncingAttribute) return;
      this.removeAttribute("open");
      this.dispatchEvent(
        new CustomEvent("dc-close", { bubbles: true, composed: true }),
      );
    });

    // Clicking the ::backdrop dispatches the click at the <dialog> element itself.
    this.#dialog.addEventListener("click", (event) => {
      if (event.target === this.#dialog) this.close();
    });

    // Escape closes the dialog natively before any JS runs, which would skip
    // the view transition - take over the close so it animates too.
    this.#dialog.addEventListener("cancel", (event) => {
      if (!DcDialog.#canAnimate()) return;
      event.preventDefault();
      this.close();
    });
  }

  connectedCallback() {
    this.#sync();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  /** @type {boolean} */
  get open() {
    return this.hasAttribute("open");
  }

  /** @param {boolean} value */
  set open(value) {
    this.toggleAttribute("open", Boolean(value));
  }

  /** Opens the dialog modally. */
  show() {
    this.setAttribute("open", "");
  }

  /** Closes the dialog. */
  close() {
    this.removeAttribute("open");
  }

  #sync() {
    if (!this.#dialog.isConnected && !this.isConnected) return;
    if (this.open === this.#dialog.open) return;

    const applyState = () => {
      this.#syncingAttribute = true;
      if (this.open) {
        this.#dialog.showModal();
      } else {
        this.#dialog.close();
      }
      this.#syncingAttribute = false;
    };

    if (DcDialog.#canAnimate()) {
      document.startViewTransition(applyState);
    } else {
      applyState();
    }
  }

  static #canAnimate() {
    return (
      typeof document.startViewTransition === "function" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches
    );
  }
}

if (!customElements.get("dc-dialog")) {
  customElements.define("dc-dialog", DcDialog);
}
