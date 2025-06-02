import type { Meta, StoryObj } from '@storybook/react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';

const meta = {
  title: 'Components/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open Popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Dimensions</h4>
            <p className="text-sm text-muted-foreground">
              Set the dimensions for the layer
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="width" className="text-sm">Width</label>
              <input
                id="width"
                defaultValue="100%"
                className="col-span-2 h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="maxWidth" className="text-sm">Max. width</label>
              <input
                id="maxWidth"
                defaultValue="300px"
                className="col-span-2 h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <label htmlFor="height" className="text-sm">Height</label>
              <input
                id="height"
                defaultValue="25px"
                className="col-span-2 h-8 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors"
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  ),
};

export const WithPositioning: Story = {
  render: () => (
    <div className="flex items-center justify-center gap-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Top</Button>
        </PopoverTrigger>
        <PopoverContent side="top" className="w-40 text-center">
          <p className="text-sm">This popover appears above the trigger</p>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </PopoverTrigger>
        <PopoverContent side="bottom" className="w-40 text-center">
          <p className="text-sm">This popover appears below the trigger</p>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Left</Button>
        </PopoverTrigger>
        <PopoverContent side="left" className="w-40 text-center">
          <p className="text-sm">This popover appears to the left of the trigger</p>
        </PopoverContent>
      </Popover>
      
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Right</Button>
        </PopoverTrigger>
        <PopoverContent side="right" className="w-40 text-center">
          <p className="text-sm">This popover appears to the right of the trigger</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};
