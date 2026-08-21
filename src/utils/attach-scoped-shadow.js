/**
 * Like `element.attachShadow({ mode: "open" })`, but for components that
 * render other `dc-*` elements inside their own shadow DOM (e.g. dc-dialog's
 * dc-close-button). A shadow root created without an explicit
 * `customElementRegistry` does NOT reliably inherit the registry of the
 * tree it's created in - browsers disagree on this, so it can silently fall
 * back to the global registry. Reading `getRootNode().customElementRegistry`
 * and passing it through explicitly avoids depending on that ambiguity: it
 * keeps a component's internal dc-* references resolving against whichever
 * registry (scoped or global) the component itself was resolved against.
 *
 * @param {HTMLElement} element
 * @returns {ShadowRoot}
 */
export function attachScopedShadow(element) {
  const registry = element.getRootNode().customElementRegistry;
  return element.attachShadow(
    registry ? { mode: "open", customElementRegistry: registry } : { mode: "open" },
  );
}
