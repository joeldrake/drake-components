import "../src/index.js";
import "../src/styles/tokens.css";

const style = document.createElement("style");
style.textContent = `
  body {
    background-color: var(--dc-color-bg);
    color: var(--dc-color-text);
  }
`;
document.head.appendChild(style);

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
    options: {
      storySort: {
        order: ["Introduction", "*"],
      },
    },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    docs: {
      // Show the actual rendered markup (real tags, resolved args) instead of
      // the render() function's JS source (template literals, ternaries, etc).
      source: { type: "dynamic" },
    },
  },
};

export default preview;
