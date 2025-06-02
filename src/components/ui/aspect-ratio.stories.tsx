// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { AspectRatio } from './aspect-ratio';

const meta = {
  title: 'Components/AspectRatio',
  component: AspectRatio,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    ratio: { 
      control: 'number', 
      description: 'The ratio of the width to height (e.g., 16/9, 4/3, 1/1)',
    },
  },
} satisfies Meta<typeof AspectRatio>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    ratio: 16 / 9,
  },
  render: (args) => (
    <div className="w-[400px] rounded-md overflow-hidden">
      <AspectRatio {...args}>
        <img
          src="./sample1.svg"
          alt="Image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
};

export const Square: Story = {
  args: {
    ratio: 1,
  },
  render: (args) => (
    <div className="w-[400px] rounded-md overflow-hidden">
      <AspectRatio {...args}>
        <img
          src="https://source.unsplash.com/random/800x800?portrait"
          alt="Image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
};

export const Portrait: Story = {
  args: {
    ratio: 3 / 4,
  },
  render: (args) => (
    <div className="w-[300px] rounded-md overflow-hidden">
      <AspectRatio {...args}>
        <img
          src="https://source.unsplash.com/random/600x800?person"
          alt="Image"
          className="object-cover w-full h-full"
        />
      </AspectRatio>
    </div>
  ),
};