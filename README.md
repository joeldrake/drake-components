# Drake Components

Vanilla web components with no build step. Shipped as plain ES modules. What you see is what you get.

https://drake-components.joeldrake.deno.net/

## Install

```sh
npm install drake-components
```

## Usage

Import all the components

```js
import "drake-components";
```

Or select just the one(s) you want

```js
import "drake-components/src/components/button/dc-button.js";
```

Use in your app/website

```html
<dc-button variant="primary">Click me</dc-button>
```

## Theming

Components can read their colors from a set of CSS custom properties
(`--dc-color-*`), defined in `src/styles/tokens.css`

To use your own brand colors, copy `tokens.css` into your project, edit the
values, and load your copy instead of the original.

Dark values are included and apply automatically when the OS is set to dark
(`prefers-color-scheme`). To force a theme regardless of the OS setting, set
`data-theme="dark"` or `data-theme="light"` on `<html>` (or any ancestor of
the components):

```html
<html data-theme="dark"></html>
```

Individual components also expose their own `--dc-*` custom properties
(e.g. `--dc-button-primary-bg`) for one-off overrides; see each component's
doc block for the full list. Those take priority over the shared tokens.

## Development

```sh
npm install
npm run storybook
```

Storybook itself uses Vite as its dev server/builder, separate from the components.

## License

MIT
