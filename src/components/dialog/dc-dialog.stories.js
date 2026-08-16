import { html } from "lit";
import "./dc-dialog.js";
import "../button/dc-button.js";

export default {
  title: "Components/Dialog",
  tags: ["autodocs"],
};

export const Default = {
  render: () => html`
    <div>
      <dc-button variant="primary" onclick="this.nextElementSibling.show()">
        Open dialog
      </dc-button>
      <dc-dialog>
        <h2 style="margin: 0;" slot="header">Dialog title</h2>
        <p style="margin: 0; color: #4b5563;">
          A vanilla &lt;dc-dialog&gt; built on the native &lt;dialog&gt; element
          — focus trapping and Escape-to-close come for free.
        </p>
        <div slot="footer">
          <dc-button
            variant="secondary"
            onclick="this.closest('dc-dialog').close()"
            >Cancel</dc-button
          >
          <dc-button
            variant="primary"
            onclick="this.closest('dc-dialog').close()"
            >Confirm</dc-button
          >
        </div>
      </dc-dialog>
    </div>
  `,
};

export const HeaderAndScrollingContent = {
  render: () => html`
        <dc-button
      variant="primary"
      onclick="this.nextElementSibling.show()"
    >
      Open dialog
    </dc-button>
    <dc-dialog>
      <h2 slot="header" style="margin: 0;">Dialog title</h2>
      <div style="border: 5px dotted grey;height:2000px">Scrolling div</div>
      <div slot="footer">
        <dc-button onclick="this.closest('dc-dialog').close()">Close</dc-button>
      </div>
    </dc-dialog>
  `,
};
