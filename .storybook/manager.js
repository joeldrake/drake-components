import React from "react";
import { addons, types } from "storybook/manager-api";
import { IconButton } from "storybook/internal/components";
import { GithubIcon, BoxIcon } from "@storybook/icons";

const LINKS = [
  {
    id: "github-link",
    title: "View on GitHub",
    href: "https://github.com/joeldrake/drake-components",
    Icon: GithubIcon,
  },
  {
    id: "npm-link",
    title: "View on npm",
    href: "https://www.npmjs.com/package/drake-components",
    Icon: BoxIcon,
  },
];

addons.register("drake-components/links", () => {
  for (const { id, title, href, Icon } of LINKS) {
    addons.add(id, {
      type: types.TOOL,
      title,
      match: ({ viewMode }) => !!viewMode,
      render: () => (
        <IconButton
          key={id}
          as="a"
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          title={title}
        >
          <Icon />
        </IconButton>
      ),
    });
  }
});
