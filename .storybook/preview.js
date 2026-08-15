import "../src/index.js";

/** @type { import('@storybook/web-components-vite').Preview } */
const preview = {
  parameters: {
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
