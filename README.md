# Drake Components

Vanilla web components, no build step required. Every component registers itself as a
Custom Element with the `dc-` prefix.

## Components

- `<dc-button>` — `variant` (`primary` | `secondary` | `danger`), `size` (`sm` | `md` | `lg`), `disabled`
- `<dc-dialog>` — `open` attribute, `show()` / `close()` methods, `dc-close` event, `slot="footer"`
- `<dc-card>` — `slot="header"`, default slot (body), `slot="footer"`

## Usage

Import the component you need directly in the browser — no bundler required:

```html
<script type="module" src="./src/components/button/dc-button.js"></script>

<dc-button variant="primary">Click me</dc-button>
```

Or import everything at once via the barrel file:

```html
<script type="module" src="./src/index.js"></script>
```

## Development

```sh
npm install
npm run storybook
```

Storybook itself uses Vite as its dev server/builder — that's separate from the components,
which ship as plain ES modules with no build step of their own.
