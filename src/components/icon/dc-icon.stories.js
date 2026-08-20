import { html } from "lit";
import "./dc-icon.js";

export default {
  title: "Components/Icon",
  tags: ["autodocs"],
  argTypes: {
    name: { control: "text" },
    size: { control: "number" },
  },
  args: {
    name: "heart",
    size: 24,
  },
  render: (args) => html`<dc-icon
      name="${args.name}"
      size="${args.size}"
    ></dc-icon>`,
};

export const Default = {};

export const Sizes = {
  render: () => html`
    <div
      style="display: flex; align-items: center; gap: 0.75rem;"
    >
      <dc-icon name="heart" size="16"></dc-icon>
      <dc-icon name="heart" size="24"></dc-icon>
      <dc-icon name="heart" size="32"></dc-icon>
      <dc-icon name="heart" size="48"></dc-icon>
    </div>
  `,
};

export const CurrentColor = {
  render: () => html`
    <div
      style="display: flex; align-items: center; gap: 0.75rem;"
    >
      <span style="color: #2563eb;"><dc-icon name="star"></dc-icon></span>
      <span style="color: #dc2626;"><dc-icon name="star"></dc-icon></span>
      <span style="color: #16a34a;"><dc-icon name="star"></dc-icon></span>
    </div>
  `,
};

export const Gallery = {
  render: () => html`
    <div
      style="display: flex; flex-wrap: wrap; gap: 1.5rem; font-size: 0.75rem;"
    >
      ${[
        "heart",
        "star",
        "check",
        "x",
        "search",
        "settings",
        "trash-2",
        "arrow-right",
        "chevron-down",
        "bell",
        "user",
        "calendar",
      ].map(
        (name) => html`
          <div
            style="display: flex; flex-direction: column; align-items: center; gap: 0.375rem;"
          >
            <dc-icon name="${name}"></dc-icon>
            <span>${name}</span>
          </div>
        `,
      )}
    </div>
  `,
};

export const UnknownIcon = {
  args: { name: "not-a-real-icon" },
};
