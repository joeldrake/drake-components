export function debounce(fn, waitMilliseconds = 300) {
  let timeoutId = null;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), waitMilliseconds);
  };
}
