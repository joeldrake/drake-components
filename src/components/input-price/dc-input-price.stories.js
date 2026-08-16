import { html } from "lit";
import "./dc-input-price.js";

export default {
  title: "Components/InputPrice",
  tags: ["autodocs"],
  argTypes: {
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    size: "md",
    placeholder: "0,00",
    value: "",
    disabled: false,
  },
  render: (args) => html`
    <dc-input-price
      size="${args.size}"
      placeholder="${args.placeholder}"
      value="${args.value}"
      ?disabled="${args.disabled}"
    ></dc-input-price>
  `,
};

export const Default = {};

export const WithValue = {
  args: { value: "1234.5" },
};

export const Negative = {
  args: { value: "-99.9" },
};

export const Disabled = {
  args: { disabled: true, value: "199" },
};

export const Sizes = {
  render: (args) => html`
    <div
      style="display: flex; flex-direction: column; gap: 0.75rem; width: 240px;"
    >
      <dc-input-price
        size="sm"
        placeholder="Small"
        value="${args.value}"
      ></dc-input-price>
      <dc-input-price
        size="md"
        placeholder="Medium"
        value="${args.value}"
      ></dc-input-price>
      <dc-input-price
        size="lg"
        placeholder="Large"
        value="${args.value}"
      ></dc-input-price>
    </div>
  `,
};
