import "./dc-button.js";

export default {
  title: "Components/Button",
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["primary", "secondary", "danger"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: { control: "boolean" },
    label: { control: "text" },
  },
  args: {
    variant: "primary",
    size: "md",
    disabled: false,
    label: "Click me",
  },
  render: (args) => `
    <dc-button variant="${args.variant}" size="${args.size}" ${args.disabled ? "disabled" : ""}>
      ${args.label}
    </dc-button>
  `,
};

export const Primary = {
  args: { variant: "primary" },
};

export const Secondary = {
  args: { variant: "secondary" },
};

export const Danger = {
  args: { variant: "danger", label: "Delete" },
};

export const Disabled = {
  args: { disabled: true },
};

export const Sizes = {
  render: (args) => `
    <div style="display: flex; align-items: center; gap: 0.75rem;">
      <dc-button variant="${args.variant}" size="sm">Small</dc-button>
      <dc-button variant="${args.variant}" size="md">Medium</dc-button>
      <dc-button variant="${args.variant}" size="lg">Large</dc-button>
    </div>
  `,
};
