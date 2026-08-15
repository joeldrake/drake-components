const styles = new CSSStyleSheet();
styles.replaceSync(`
  :host {
    display: block;
  }

  .card {
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    background: #fff;
    overflow: hidden;
  }

  .header {
    padding: 1rem 1.25rem;
    border-bottom: 1px solid #e5e7eb;
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
    border-top: 1px solid #e5e7eb;
    display: flex;
    justify-content: flex-end;
    gap: 0.5rem;
  }

  .footer.is-empty {
    display: none;
  }
`);

export class DcCard extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: "open" });
    shadow.adoptedStyleSheets = [styles];

    const card = document.createElement("div");
    card.className = "card";

    const header = document.createElement("div");
    header.className = "header is-empty";
    const headerSlot = document.createElement("slot");
    headerSlot.name = "header";
    header.append(headerSlot);

    const body = document.createElement("div");
    body.className = "body";
    body.append(document.createElement("slot"));

    const footer = document.createElement("div");
    footer.className = "footer is-empty";
    const footerSlot = document.createElement("slot");
    footerSlot.name = "footer";
    footer.append(footerSlot);

    card.append(header, body, footer);
    shadow.append(card);

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
