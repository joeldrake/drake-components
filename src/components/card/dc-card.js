import { sharedStyles } from "../../styles/shared.js";

const styles = new CSSStyleSheet();
styles.replaceSync(/* css */ `
  :host {
    display: block;
  }

  .card {
    border: 1px solid var(--dc-card-border-color, #e5e7eb);
    border-radius: 10px;
    background: var(--dc-card-bg, #fff);
    overflow: hidden;
  }

  .header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid var(--dc-card-border-color, #e5e7eb);
    font-weight: 600;
  }

  .header.is-empty {
    display: none;
  }

  .body {
    padding: 1.25rem;
  }

  .footer {
    padding: 1rem 1.25rem;
    border-top: 1px solid var(--dc-card-border-color, #e5e7eb);
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .footer.is-empty {
    display: none;
  }
`);

/**
 * A container with optional header and footer sections that auto-hide when empty.
 *
 * @element dc-card
 *
 * @slot - Main card content.
 * @slot header - Header content, shown above the main content. Hidden when empty.
 * @slot footer - Footer content, shown below the main content, right-aligned. Hidden when empty.
 *
 * @cssprop [--dc-card-border-color=#e5e7eb] - Border color for the card and its header/footer dividers.
 * @cssprop [--dc-card-bg=#fff] - Background color of the card.
 */
export class DcCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [sharedStyles, styles];

    shadow.innerHTML = /* html */ `
      <div class="card">
        <div class="header is-empty">
          <slot name="header"></slot>
        </div>
        <div class="body">
          <slot></slot>
        </div>
        <div class="footer is-empty">
          <slot name="footer"></slot>
        </div>
      </div>
    `;

    const header = shadow.querySelector(".header");
    const headerSlot = header.querySelector("slot");
    const footer = shadow.querySelector(".footer");
    const footerSlot = footer.querySelector("slot");

    const toggleEmpty = (container, slot) => () => {
      container.classList.toggle("is-empty", slot.assignedNodes().length === 0);
    };
    headerSlot.addEventListener("slotchange", toggleEmpty(header, headerSlot));
    footerSlot.addEventListener("slotchange", toggleEmpty(footer, footerSlot));
  }
}

if (!customElements.get("dc-card")) {
  customElements.define("dc-card", DcCard);
}
