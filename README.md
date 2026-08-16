# Drake Components

Vanilla web components, no build step required. Every component registers itself as a
Custom Element with the `dc-` prefix.

**Homepage / Storybook:** https://drakecomponents.joeldrake.deno.net/

## Install

```sh
npm install drake-components
```

## Components

- `<dc-button>` — `variant` (`primary` | `secondary` | `danger`), `size` (`sm` | `md` | `lg`), `disabled`
- `<dc-dialog>` — `open` attribute, `show()` / `close()` methods, `dc-close` event, `slot="footer"`
- `<dc-card>` — `slot="header"`, default slot (body), `slot="footer"`
- `<dc-input>` — `type`, `size` (`sm` | `md` | `lg`), `placeholder`, `name`, `value`, `disabled`, clear button, `dc-input` / `dc-change` events
- `<dc-input-price>` — wraps `dc-input`, restricts input to a valid price and formats it (Swedish locale, two decimals) on blur
- `<dc-close-button>` — small round × button, `label` attribute, used internally by `dc-input`

## Usage

Import the component you need directly — no bundler required:

```html
<script type="module" src="./node_modules/drake-components/src/components/button/dc-button.js"></script>

<dc-button variant="primary">Click me</dc-button>
```

Or import everything at once via the barrel file:

```html
<script type="module" src="./node_modules/drake-components/src/index.js"></script>
```

Importing straight from the browser without a package manager works the same way — just
point the `<script>` tag at the component file wherever it's hosted:

```html
<script type="module" src="./src/components/button/dc-button.js"></script>
```

## Development

```sh
npm install
npm run storybook
```

Storybook itself uses Vite as its dev server/builder — that's separate from the components,
which ship as plain ES modules with no build step of their own.

## License

ISC
