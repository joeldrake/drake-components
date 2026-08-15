const styles = new CSSStyleSheet();
styles.replaceSync(`
  dialog {
    font-family: inherit;
    padding: 0;
    border: none;
    border-radius: 10px;
    box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
    min-width: 320px;
    max-width: min(560px, calc(100vw - 2rem));
  }

  dialog::backdrop {
    background: rgb(0 0 0 / 0.5);
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
    color: #6b7280;
    font-size: 1.125rem;
    line-height: 1;
    cursor: pointer;
  }

  .close:hover {
    background: #f3f4f6;
    color: #111827;
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

    this.#dialog = document.createElement("dialog");
    this.#dialog.setAttribute("role", "dialog");
    this.#dialog.setAttribute("aria-modal", "true");

    const content = document.createElement("div");
    content.className = "content";

    const closeButton = document.createElement("button");
    closeButton.type = "button";
    closeButton.className = "close";
    closeButton.setAttribute("aria-label", "Close");
    closeButton.textContent = "×";
    closeButton.addEventListener("click", () => this.close());

    const body = document.createElement("slot");

    const footer = document.createElement("div");
    footer.className = "footer";
    footer.append(document.createElement("slot"));
    footer.lastElementChild.name = "footer";

    content.append(closeButton, body, footer);
    this.#dialog.append(content);
    shadow.append(this.#dialog);

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
