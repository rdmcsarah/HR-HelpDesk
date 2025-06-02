import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './label';
import { ThemeProvider } from 'next-themes';
import { Input } from './input';

const meta = {
  title: 'components/Label',
  component: Label,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="p-8">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Email address',
    htmlFor: 'email',
  },
};

export const WithInput: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

// Required label
export const Required: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="required-field" className="after:content-['*'] after:ml-0.5 after:text-red-500">
        Required field
      </Label>
      <Input type="text" id="required-field" placeholder="Required field" />
    </div>
  ),
};

// Disabled label
export const Disabled: Story = {
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="disabled-field">Disabled field</Label>
      <Input type="text" id="disabled-field" disabled placeholder="Disabled field" />
    </div>
  ),
};

// Light mode variant
export const Light: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="light">
        <div className="p-4 bg-background border rounded-lg">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};

// Dark mode variant
export const Dark: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="dark">
        <div className="p-4 bg-background border rounded-lg dark">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  render: (args) => (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Label htmlFor="email">Email</Label>
      <Input type="email" id="email" placeholder="Email" />
    </div>
  ),
};
