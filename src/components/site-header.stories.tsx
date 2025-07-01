import React from "react";
import { SiteHeader } from "./site-header";
import type { Meta, StoryObj } from "@storybook/react";

const meta: Meta<typeof SiteHeader> = {
  title: "Components/SiteHeader",
  component: SiteHeader,
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof SiteHeader>;

export const Default: Story = {
  render: () => <SiteHeader />,
};
