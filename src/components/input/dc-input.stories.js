import { html } from "lit";
import "./dc-input.js";

export default {
  title: "Components/Input",
  tags: ["autodocs"],
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "search", "tel", "url", "number"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    placeholder: { control: "text" },
    value: { control: "text" },
    disabled: { control: "boolean" },
  },
  args: {
    type: "text",
    size: "md",
    placeholder: "Type something...",
    value: "",
    disabled: false,
  },
  render: (args) => html`
    <dc-input
      type="${args.type}"
      size="${args.size}"
      placeholder="${args.placeholder}"
      value="${args.value}"
      ?disabled="${args.disabled}"
    ></dc-input>
  `,
};

export const Default = {};

export const WithValue = {
  args: { value: "Hello world" },
};

export const Disabled = {
  args: { disabled: true, value: "Can't touch this" },
};

export const Sizes = {
  render: (args) => html`
    <div
      style="display: flex; flex-direction: column; gap: 0.75rem; width: 240px;"
    >
      <dc-input size="sm" placeholder="Small" value="${args.value}"></dc-input>
      <dc-input size="md" placeholder="Medium" value="${args.value}"></dc-input>
      <dc-input size="lg" placeholder="Large" value="${args.value}"></dc-input>
    </div>
  `,
};
