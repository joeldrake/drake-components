import { customElementVsCodePlugin } from "custom-element-vs-code-integration";

export default {
  globs: ["src/components/**/*.js"],
  exclude: ["**/*.stories.js"],
  outdir: ".",
  litelement: false,
  plugins: [customElementVsCodePlugin()],
};
