import hljs from "highlight.js/lib/core";
import html from "highlight.js/lib/languages/xml";
import css from "highlight.js/lib/languages/css";
import javascript from "highlight.js/lib/languages/javascript";
import { onWindowResize } from "./onWindowResize";
import * as prettier from "prettier/standalone";
import parserHtml from "prettier/parser-html";
import parserPostcss from "prettier/parser-postcss";
import parserBabel from "prettier/parser-babel";
import "highlight.js/styles/a11y-dark.css";
import tokensCss from "../styles/tokens.css?raw";

const plugins = [parserHtml, parserPostcss, parserBabel];

hljs.registerLanguage("html", html);
hljs.registerLanguage("css", css);
hljs.registerLanguage("javascript", javascript);

const debounce = (fn, wait = 250) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn.apply(this, args);
    }, wait);
  };
};

export default () => {
  const exampleCode = `<style>
  body {
    background-color: var(--dc-color-bg);
    color: var(--dc-color-text);
    padding: 1rem;
  }

  .inputs {
    display: flex;
    flex-direction: row;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
</style>

<h1>Drake Components Playground</h1>

<div class="inputs">
  <dc-input id="myInput" placeholder="Type something..."></dc-input>
  <dc-button id="myButton">Run</dc-button>
</div>

<dc-button onclick="this.nextElementSibling.show()"> Open dialog </dc-button>

<dc-dialog>
  <h2 style="margin: 0" slot="header">Dialog title</h2>
  <p style="margin: 0">
    A vanilla &lt;dc-dialog&gt; built on the native &lt;dialog&gt; element —
    focus trapping and Escape-to-close come for free.
  </p>
  <div slot="footer">
    <dc-button variant="secondary" onclick="this.closest('dc-dialog').close()">
      Cancel
    </dc-button>
    <dc-button variant="primary" onclick="this.closest('dc-dialog').close()">
      Confirm
    </dc-button>
  </div>
</dc-dialog>

<dc-icon name="heart"></dc-icon>

<script>
  function buttonClick() {
    alert(myInput.value);
  }
  const myInput = document.getElementById("myInput");
  const myButton = document.getElementById("myButton");

  myButton.onclick = buttonClick;
</script>`;

  const cssStyle = /* css */ `
    html {
      box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    html,
    body {
      margin: 0 !important;
      padding: 0 !important;
      min-height: 100vh;
      font-size: 16px;
    }

    .toolbar {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      height: 3rem;
      padding: 0 1rem;
      line-height: 1;
      border-bottom: 1px solid #e0e0e0;
      background: #f9f9f9;
      font-family: ICATextNy, sans-serif;
    }

    .toolbar .iframeWidth {
      margin-left: auto;
      font-size: 14px;
      color: #666;
    }

    .toolbar button {
      padding: 0.5rem 1rem;
      background: white;
      border: 1px solid #d0d0d0;
      border-radius: 4px;
      font-family: ICATextNy, sans-serif;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .toolbar button:hover:not(:disabled) {
      background: #f0f0f0;
      border-color: #b0b0b0;
    }

    .toolbar button:active:not(:disabled) {
      background: #e0e0e0;
    }

    .toolbar button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .repl {
      height: calc(100vh - 3rem);
      display: flex;
      position: relative;
    }

    .resizer {
      width: 5px;
      background: #d0d0d0;
      cursor: col-resize;
      flex-shrink: 0;
      position: relative;
      transition: background 0.2s ease;
    }

    .resizer:hover,
    .resizer.resizing {
      background: #e13205;
    }

    .resizer::after {
      content: "";
      position: absolute;
      top: 0;
      bottom: 0;
      left: -5px;
      right: -5px;
    }

    .iframe-overlay {
      display: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 9999;
    }

    .iframe-overlay.active {
      display: block;
    }

    .code-wrapper {
      display: grid;
      overflow: auto;
      position: relative;
      background: rgb(43 43 43);
      width: 50%;
      flex-shrink: 0;
    }

    #codeFontSize {
      position: absolute;
      top: 0;
      right: 0;
    }

    .code-wrapper > pre {
      margin: 0;
    }

    #code,
    .code-wrapper > pre {
      grid-column: 1;
      grid-row: 1;
    }

    #highlighted,
    #code {
      line-height: 1;
      font-family: monospace;
      font-size: var(--code-font-size, 16px);
      padding: 0.5rem 0.5rem 1rem 0.5rem;
      white-space: none;
      min-height: calc(100vh - 3rem);
    }

    #code {
      background: transparent;
      border: none;
      caret-color: #f8f8f2;
      color: transparent;
      overflow: hidden;
      resize: none;
    }
    #code:focus {
      outline: none;
    }

    #output {
      flex: 1;
      border: none;
    }
  `;

  const iframeSrcDoc = ({
    links = [],
    scripts = [],
  } = {}) => /* html */ `
<!doctype html>
    <html>
      <head>
        <style>
          ${tokensCss}
        </style>
        ${links.join("\n    ")}
        <style>
          html {
            box-sizing: border-box;
          }

          *,
          *:before,
          *:after {
            box-sizing: inherit;
          }

          html,
          body {
            margin: 0;
            padding: 0;
          }
          body {
            background: #f9f5f5;
          }
        </style>

        ${scripts.join("\n    ")}

        <script type="module">
          function iframe_update(source) {
            document.body.innerHTML = source;

            //important to only select scripts from inside body
            const scripts = document.body.querySelectorAll("script");

            if (scripts.length) {
              scripts.forEach((script) => {
                //needed to get the iframe to execute inserted javascript.
                const blob = new Blob([script.innerHTML], {
                  type: "text/javascript",
                });
                const url = URL.createObjectURL(blob);
                import(url);
              });
            }
          }
          window.addEventListener(
            "message",
            (event) => {
              // Only accept messages from parent window For srcdoc iframes, we verify
              // the message comes from parent by checking event.source
              if (event.source !== window.parent) {
                console.warn("Rejected postMessage from untrusted source");
                return;
              }
              iframe_update(event.data);
            },
            false,
          );
        </script>
      </head>
      <body></body>
    </html>`;

  const update = () => {
    const textarea = document.getElementById("code");
    const codeTag = document.getElementById("highlighted");

    codeTag.textContent = textarea.value;
    delete codeTag.dataset.highlighted;
    hljs.highlightElement(codeTag);

    window.requestAnimationFrame(() => {
      textarea.scrollTop = 0;
      textarea.scrollLeft = 0;
    });

    postToIframe();
  };

  const postToIframe = debounce(() => {
    const textarea = document.getElementById("code");
    const iframe = document.getElementById("output");

    iframe.contentWindow.postMessage(textarea.value, window.location.origin);
    localStorage.setItem("savedREPL", textarea.value);
  });

  const insertExampleAsk = () => {
    const status = confirm(
      "Are you sure you want remove existing code and insert example code?",
    );
    if (status) insertExample();
  };

  const insertExample = () => {
    const textarea = document.getElementById("code");
    textarea.value = exampleCode;
    update();
  };

  const prettifyCode = async () => {
    try {
      const textarea = document.getElementById("code");
      const prettifiedCode = await prettier.format(textarea.value, {
        parser: "html",
        plugins,
      });
      textarea.value = prettifiedCode;
      update();
    } catch (e) {
      alert("Failed to prettify");
    }
  };

  const handleKeydown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      insertTab(e.target, e.shiftKey);
    }
  };

  const insertTab = (textarea, dedent) => {
    const textToInsert = "  "; // 2 spaces

    const { selectionStart, selectionEnd } = textarea;

    if (dedent) {
      const startOfLine =
        textarea.value.slice(0, selectionStart).lastIndexOf("\n") + 1; // exclude newline character
      const canDedent =
        textarea.value.slice(
          selectionStart - textToInsert.length,
          selectionStart,
        ) === textToInsert;
      const canDedentLine = textarea.value
        .slice(startOfLine, selectionStart)
        .startsWith(textToInsert);

      if (canDedent || canDedentLine) {
        textarea.value = canDedent
          ? textarea.value.slice(0, selectionStart - textToInsert.length) +
            textarea.value.slice(selectionStart)
          : textarea.value.slice(0, startOfLine) +
            textarea.value.slice(startOfLine + textToInsert.length);
        textarea.selectionStart = selectionStart - textToInsert.length;
        textarea.selectionEnd = selectionEnd - textToInsert.length;
      }
    } else {
      textarea.value =
        textarea.value.slice(0, selectionStart) +
        textToInsert +
        textarea.value.slice(selectionStart);
      textarea.selectionStart = selectionStart + textToInsert.length;
      textarea.selectionEnd = selectionEnd + textToInsert.length;
    }

    update();
  };

  const initResizer = () => {
    const resizer = div.querySelector(".resizer");
    const overlay = div.querySelector(".iframe-overlay");
    let isResizing = false;

    const resize = (e) => {
      if (!isResizing) return;
      e.preventDefault();

      const replContainer = div.querySelector(".repl");
      const replRect = replContainer.getBoundingClientRect();
      const totalWidth = replContainer.offsetWidth;
      const mouseX = e.clientX - replRect.left;

      // Subtract resizer width (5px) to get the actual code panel width
      const resizerWidth = resizer.offsetWidth;
      const newWidth = mouseX - resizerWidth / 2;
      const percentage = (newWidth / totalWidth) * 100;

      if (percentage > 10 && percentage < 90) {
        codeWrapper.style.width = `${percentage}%`;
        updateIframeDisplaySize();
      }
    };

    const stopResize = () => {
      if (!isResizing) return;
      isResizing = false;
      resizer.classList.remove("resizing");
      overlay.classList.remove("active");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.removeEventListener("mousemove", resize);
      document.removeEventListener("mouseup", stopResize);
    };

    const startResize = (e) => {
      e.preventDefault();
      isResizing = true;
      resizer.classList.add("resizing");
      overlay.classList.add("active");
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", resize);
      document.addEventListener("mouseup", stopResize);
    };

    resizer.addEventListener("mousedown", startResize);
  };

  const updateIframeDisplaySize = () => {
    iframeWidth.innerHTML = `Result frame width ${iframe.clientWidth}px height ${iframe.clientHeight}px`;
  };

  const updateCodeFontSize = (e) => {
    const fontSize = e.target.value;
    codeWrapper.style.setProperty("--code-font-size", `${fontSize}px`);
    localStorage.setItem("repl-code-font-size", fontSize);
  };

  const applyTheme = (theme) => {
    iframe.contentDocument.documentElement.dataset.theme = theme;
    themeToggle.textContent =
      theme === "dark" ? "☀️ Light theme" : "🌙 Dark theme";
  };

  const toggleTheme = () => {
    const current = iframe.contentDocument.documentElement.dataset.theme;
    const next = current === "dark" ? "light" : "dark";
    localStorage.setItem("repl-theme", next);
    applyTheme(next);
  };

  /* main div */
  const div = document.createElement("div");

  div.innerHTML = `
    <style>${cssStyle}</style>
    <div class="toolbar">
      <button disabled id="exampleButton">Insert example</button>
      <button disabled id="prettierButton">Prettify code</button>
      <button disabled id="themeToggle">🌙 Dark theme</button>
      <div class="iframeWidth"></div>
    </div>
    <div class="repl">
      <div class="code-wrapper">
        <select id="codeFontSize" value="16">
          <option value="12">12</option>
          <option value="14">14</option>
          <option value="16" selected>16</option>
          <option value="18">18</option>
          <option value="20">20</option>
        </select>
        <pre><code class="html" id="highlighted"></code></pre>
        <textarea id="code" spellcheck="false"></textarea>
      </div>
      <div class="resizer"></div>
      <iframe id="output"></iframe>
      <div class="iframe-overlay"></div>
    </div>`;

  const exampleButton = div.querySelector("#exampleButton");
  const prettierButton = div.querySelector("#prettierButton");
  const themeToggle = div.querySelector("#themeToggle");
  const textarea = div.querySelector("#code");
  const iframe = div.querySelector("#output");
  const iframeWidth = div.querySelector(".iframeWidth");
  const codeWrapper = div.querySelector(".code-wrapper");
  const codeFontSize = div.querySelector("#codeFontSize");
  const htmlToIframe = { links: [], scripts: [] };

  Array.from(document.head.childNodes).forEach((node) => {
    if (node.nodeName === "LINK" && node.getAttribute("rel") === "stylesheet") {
      htmlToIframe.links.push(node.outerHTML);
    }
  });

  if (import.meta.env.DEV) {
    // Vite's dev server serves raw project source, so the component
    // registrations can be imported directly into the REPL iframe.
    htmlToIframe.scripts.push(
      '<script type="module" src="/src/index.js"></script>',
    );
  } else {
    // In a static Storybook build "/src/index.js" doesn't exist on disk,
    // but Storybook's bundled entry (which imports it transitively) ends
    // up as a module script in <head>, so reuse that instead.
    Array.from(document.head.childNodes).forEach((node) => {
      if (
        node.nodeName === "SCRIPT" &&
        node.getAttribute("type") === "module"
      ) {
        htmlToIframe.scripts.push(node.outerHTML);
      }
    });
  }

  exampleButton.addEventListener("click", insertExampleAsk);
  prettierButton.addEventListener("click", prettifyCode);
  themeToggle.addEventListener("click", toggleTheme);
  textarea.addEventListener("input", update);
  textarea.addEventListener("keydown", handleKeydown);

  iframe.srcdoc = iframeSrcDoc(htmlToIframe);
  codeFontSize.addEventListener("input", updateCodeFontSize);
  onWindowResize(updateIframeDisplaySize);
  initResizer();

  // restore font size from localStorage
  const savedFontSize = localStorage.getItem("repl-code-font-size");
  if (savedFontSize) {
    codeFontSize.value = savedFontSize;
    codeWrapper.style.setProperty("--code-font-size", `${savedFontSize}px`);
  }

  // restore previous REPL-code from localStorage
  iframe.addEventListener("load", () => {
    exampleButton.removeAttribute("disabled");
    prettierButton.removeAttribute("disabled");
    themeToggle.removeAttribute("disabled");

    const savedTheme = localStorage.getItem("repl-theme");
    applyTheme(savedTheme === "dark" ? "dark" : "light");

    const savedREPL = localStorage.getItem("savedREPL");
    if (savedREPL) {
      textarea.value = savedREPL;
    } else {
      textarea.value = exampleCode;
    }

    update();

    updateIframeDisplaySize();
  });

  return div;
};
