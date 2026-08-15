import { html } from "lit";
import "./dc-card.js";

export default {
  title: "Components/Card",
  tags: ["autodocs"],
};

export const Default = {
  render: () => html`
    <dc-card style="max-width: 320px;">
      Just a body — no header or footer slotted.
    </dc-card>
  `,
};

export const WithHeaderAndFooter = {
  render: () => html`
    <dc-card style="max-width: 320px;">
      <span slot="header">Card title</span>
      This card has both a header and a footer with actions.
      <div slot="footer">
        <dc-button variant="secondary">Cancel</dc-button>
        <dc-button variant="primary">Save</dc-button>
      </div>
    </dc-card>
  `,
};
