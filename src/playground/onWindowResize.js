import { debounce } from "./debounce";

let callbacks = [];

const onResize = debounce((evt) => {
  callbacks.forEach((fn) => fn(evt));
}, 50);

function registerListener() {
  window.addEventListener("resize", onResize, { passive: true });
}
function removeListener() {
  window.removeEventListener("resize", onResize, { passive: true });
}

export function onWindowResize(fn) {
  if (callbacks.length === 0) registerListener();

  callbacks.push(fn);

  return () => {
    callbacks = callbacks.filter((cb) => cb !== fn);
    if (callbacks.length === 0) removeListener();
  };
}
