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
        <h2 style="margin: 0 0 0.5rem;">Dialog title</h2>
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

export const OpenByDefault = {
  render: () => html`
    <dc-dialog open>
      <h2 style="margin: 0 0 0.5rem;">Already open</h2>
      <p style="margin: 0; color: #4b5563;">
        Setting the "open" attribute opens the dialog immediately.
      </p>
      <div slot="footer">
        <dc-button variant="primary" onclick="this.closest('dc-dialog').close()"
          >Got it</dc-button
        >
      </div>
    </dc-dialog>
  `,
};
