// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from './skeleton';
import { Avatar } from './avatar';

const meta = {
  title: 'Components/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const Card: Story = {
  render: () => (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  ),
};

export const List: Story = {
  render: () => (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[200px]" />
            <Skeleton className="h-4 w-[160px]" />
          </div>
        </div>
      ))}
    </div>
  ),
};

export const AvatarWithSkeleton: Story = {
  render: () => (
    <div className="flex flex-col space-y-5">
      <div className="flex items-center space-x-4">
        <div className="space-y-2">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
        <div className="space-y-2">
          <Avatar className="h-12 w-12">
            <Skeleton className="h-12 w-12 rounded-full" />
          </Avatar>
          <Skeleton className="h-4 w-[100px]" />
        </div>
      </div>
    </div>
  ),
};

