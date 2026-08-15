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

export class DcDialog extends HTMLElement {
  static get observedAttributes() {
    return ["open"];
  }

  #dialog;
  #syncingAttribute = false;

  constructor() {
    super();
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
  }

  connectedCallback() {
    this.#sync();
  }

  attributeChangedCallback() {
    this.#sync();
  }

  get open() {
    return this.hasAttribute("open");
  }

  set open(value) {
    this.toggleAttribute("open", Boolean(value));
  }

  show() {
    this.setAttribute("open", "");
  }

  close() {
    this.removeAttribute("open");
  }

  #sync() {
    if (!this.#dialog.isConnected && !this.isConnected) return;

    this.#syncingAttribute = true;
    if (this.open && !this.#dialog.open) {
      this.#dialog.showModal();
    } else if (!this.open && this.#dialog.open) {
      this.#dialog.close();
    }
    this.#syncingAttribute = false;
  }
}

if (!customElements.get("dc-dialog")) {
  customElements.define("dc-dialog", DcDialog);
}
