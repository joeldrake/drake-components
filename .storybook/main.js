/** @type { import('@storybook/web-components-vite').StorybookConfig } */
const config = {
  stories: [
    "../src/components/**/*.stories.js",
    "../src/playground/**/*.stories.js",
  ],
  addons: ["@storybook/addon-a11y", "@storybook/addon-docs"],
  framework: "@storybook/web-components-vite",
};
export default config;
