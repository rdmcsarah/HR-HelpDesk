// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Separator } from './separator';

const meta = {
  title: 'Components/Separator',
  component: Separator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    orientation: {
      control: 'select',
      options: ['horizontal', 'vertical'],
      defaultValue: 'horizontal',
    },
    decorative: {
      control: 'boolean',
      defaultValue: true,
    },
  },
} satisfies Meta<typeof Separator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="text-sm font-medium leading-none">Section 1</div>
      <Separator orientation="horizontal" />
      <div className="text-sm font-medium leading-none">Section 2</div>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <div className="flex h-5 items-center space-x-4">
      <div className="text-sm font-medium leading-none">Section 1</div>
      <Separator orientation="vertical" />
      <div className="text-sm font-medium leading-none">Section 2</div>
      <Separator orientation="vertical" />
      <div className="text-sm font-medium leading-none">Section 3</div>
    </div>
  ),
};

export const CustomStyles: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="text-sm font-medium leading-none">Default</div>
      <Separator orientation="horizontal" />
      <div className="text-sm font-medium leading-none">Custom Color</div>
      <Separator orientation="horizontal" className="bg-primary" />
      <div className="text-sm font-medium leading-none">Custom Thickness</div>
      <Separator orientation="horizontal" className="h-0.5" />
    </div>
  ),
};

