import { html } from "lit";
import "./dc-close-button.js";

export default {
  title: "Components/Close Button",
  tags: ["autodocs"],
  argTypes: {
    label: { control: "text" },
  },
  args: {
    label: "Close",
  },
  render: (args) => html`<dc-close-button
      label="${args.label}"
    ></dc-close-button>`,
};

export const Default = {};
