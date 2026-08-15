# AGENTS.md

Guidance for agents working in this repo. Read this before adding or changing components.

## What this is

Drake Components (`dc-*`) — vanilla web components with **no build step**. Each component
is a plain ES module that registers a Custom Element. Consumers import the `.js` file
directly in a `<script type="module">`; there is no bundler, transpiler, or framework in
the runtime path. Storybook (Vite-powered) is dev/demo tooling only — it does not affect
how the components ship.

## Structure

```
src/
  index.js                        barrel file, re-exports every component
  components/
    <name>/
      dc-<name>.js                 the component
      dc-<name>.stories.js         Storybook stories
```

One folder per component, named after the tag without the `dc-` prefix (e.g. `button/` for
`<dc-button>`).

## Component conventions

Follow the existing components ([dc-button.js](src/components/button/dc-button.js),
[dc-card.js](src/components/card/dc-card.js),
[dc-dialog.js](src/components/dialog/dc-dialog.js)) as the reference pattern:

- `class Dc<Name> extends HTMLElement`, shadow DOM via `attachShadow({ mode: "open" })`.
- Styles as a module-level `CSSStyleSheet` built with `styles.replaceSync(/* css */ \`...\`)`
  and applied via `shadow.adoptedStyleSheets = [styles]` — not `<style>` tags.
- Shadow markup built with `shadow.innerHTML = /* html */ \`...\`` in the constructor. Keep
  the `/* css */` and `/* html */` comments — Prettier (`prettier-plugin-embed`) uses them to
  format the embedded template literals as real CSS/HTML.
- Reflected attributes: `static get observedAttributes()` lists them, and each gets a
  paired getter/setter on the class (getter reads via `getAttribute`/`hasAttribute` with a
  sane default, setter writes via `setAttribute`/`toggleAttribute`). Re-render in
  `attributeChangedCallback` and `connectedCallback`.
- Private DOM refs and internal state use real private fields (`#button`, `#dialog`, ...).
- Theming goes through CSS custom properties with a `--dc-<component>-<thing>` naming
  scheme (e.g. `--dc-button-bg`, `--dc-card-border-color`), each with a sensible fallback:
  `var(--dc-button-bg, #2563eb)`. Where a component has variants, prefer a two-level
  fallback so a var can be overridden globally or per-variant:
  `var(--dc-button-bg, var(--dc-button-primary-bg, #2563eb))`.
- End the file with:
  ```js
  if (!customElements.get("dc-<name>")) {
    customElements.define("dc-<name>", Dc<Name>);
  }
  ```
  (guards against duplicate registration if the module is evaluated twice.)

## JSDoc + editor type tooling

Every public attribute, slot, event, CSS custom property, and method **must** be
documented with JSDoc on the class, using the [Custom Elements Manifest](https://custom-elements-manifest.open-wc.org/)
tag vocabulary — see any existing component for the full pattern:

- `@element dc-<name>` on the class doc comment.
- `@attr {type} [name=default] - description` for each reflected attribute. Use an inline
  literal union for enums (e.g. `{"primary" | "secondary" | "danger"}`), **not** a
  `@typedef` reference — the VS Code data generator only turns inline unions into
  attribute-value autocomplete.
- `@slot` / `@slot name - description` for slots.
- `@fires {CustomEvent} event-name - description` for custom events.
- `@cssprop [--dc-name-thing=default] - description` for every themeable CSS custom
  property (yes, all of them — these are part of the public API and the css.customData
  hover docs are generated from this).
- `@type` on each getter and `@param` on each setter, so hovering the JS property (not
  just the HTML attribute) also shows a type. Define shared enum types once as
  `@typedef` (e.g. `DcButtonVariant`) and reuse them on the getter/setter — just don't use
  the typedef inside `@attr`, per above.

This JSDoc is consumed by `@custom-elements-manifest/analyzer` +
`custom-element-vs-code-integration` (both devDependencies) to generate, from
[custom-elements-manifest.config.js](custom-elements-manifest.config.js):

- `custom-elements.json` — the standard machine-readable manifest (referenced from
  `package.json`'s `"customElements"` field).
- `vscode.html-custom-data.json` — tag/attribute IntelliSense (incl. enum value
  autocomplete) for VS Code, wired up via `.vscode/settings.json`'s `html.customData`.
- `vscode.css-custom-data.json` — hover docs for the `--dc-*` custom properties, wired up
  via `.vscode/settings.json`'s `css.customData`.

**Whenever you add/rename/remove an attribute, slot, event, method, or CSS custom
property — or change its JSDoc — run `npm run analyze` afterwards** and commit the
regenerated `custom-elements.json` / `vscode.*.json` files. They're checked into the repo
(not gitignored) because there's no build step to generate them on install; they must stay
in sync by hand via this script.

## Adding a new component

1. Create `src/components/<name>/dc-<name>.js` following the conventions above.
2. Add `src/components/<name>/dc-<name>.stories.js` (see existing stories files for the
   `argTypes`/`args`/`render` pattern using `lit`'s `html` tag — `lit` is only used for
   Storybook templating, not shipped to consumers).
3. Export it from [src/index.js](src/index.js).
4. Add it to the component list in [README.md](README.md).
5. Run `npm run analyze` to regenerate the manifest/custom-data files.
6. Run `npx prettier --write .` before committing.

## Commands

```sh
npm install
npm run storybook   # dev server on :6006
npm run build        # build static storybook
npm run analyze      # regenerate custom-elements.json + vscode.*.json from JSDoc
npx prettier --write .
```

There is no automated test suite yet — Storybook (with the a11y addon) is the primary way
to visually and accessibly verify a component. If you add one, document it here.
