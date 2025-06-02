// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { ScrollArea, ScrollBar } from './scroll-area';

const meta = {
  title: 'Components/ScrollArea',
  component: ScrollArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ScrollArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-72 w-48 rounded-md border p-4">
      <div>
        <h4 className="mb-4 text-sm font-medium leading-none">Tags</h4>
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`item-${i}`}
            className="text-sm mb-2 border rounded-md px-2 py-1.5"
          >
            Tag {i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="h-72 w-96 rounded-md border">
      <div className="flex py-4">
        {Array.from({ length: 50 }).map((_, i) => (
          <div
            key={`box-${i}`}
            className="flex-shrink-0 flex items-center justify-center w-40 h-40 border rounded-md mx-2"
          >
            Card {i + 1}
          </div>
        ))}
      </div>
       <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};

export const WithContent: Story = {
  render: () => (
    <ScrollArea className="h-72 w-80 rounded-md border p-4">
      <h4 className="mb-4 text-sm font-medium leading-none">Lorem Ipsum</h4>
      <p className="text-sm">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget augue nec massa congue maximus. Proin sagittis, odio eu tempus ultrices, urna lorem rutrum enim, et maximus enim ipsum vel velit. Ut quis magna sed massa euismod commodo. Proin ac dui sit amet augue scelerisque tincidunt. Sed nunc elit, maximus id efficitur placerat, accumsan a dui. Cras ullamcorper neque at venenatis dignissim. Pellentesque non elit ullamcorper, pretium orci vel, luctus ipsum. Integer at diam sem.
      </p>
      <p className="text-sm mt-4">
        Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Donec eget suscipit tellus. Maecenas dictum dignissim erat quis tempor. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse potenti. Duis porta tortor leo, id maximus est commodo ut. Nulla vel tempus augue, eu vestibulum ante. Nulla facilisi.
      </p>
      <p className="text-sm mt-4">
        Donec congue erat at sem vulputate, nec volutpat turpis aliquet. Nullam et eros non ante hendrerit molestie eu vitae magna. Fusce ac erat dapibus, ullamcorper lorem eu, dictum turpis. Nulla neque diam, scelerisque at pretium a, mollis eget ex. Nulla pharetra pellentesque lacus, eu aliquam nibh faucibus eget. Etiam vitae augue dictum, cursus nunc non, vehicula arcu. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.
      </p>
    </ScrollArea>
  ),
};

