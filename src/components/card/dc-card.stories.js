import "./dc-card.js";

export default {
  title: "Components/Card",
  tags: ["autodocs"],
};

export const Default = {
  render: () => `
    <dc-card style="max-width: 320px;">
      Just a body — no header or footer slotted.
    </dc-card>
  `,
};

export const WithHeaderAndFooter = {
  render: () => `
    <dc-card style="max-width: 320px;">
      <span slot="header">Card title</span>
      This card has both a header and a footer with actions.
      <div slot="footer">
        <button type="button">Cancel</button>
        <button type="button">Save</button>
      </div>
    </dc-card>
  `,
};
