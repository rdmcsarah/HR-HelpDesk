// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider,
  TooltipTrigger 
} from './tooltip';
import { Button } from './button';
import { Info } from 'lucide-react';

const meta = {
  title: 'Components/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">
            <Info className="size-4" />
            <span className="sr-only">Info</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          This is a tooltip
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const TextTrigger: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover me</TooltipTrigger>
        <TooltipContent>
          This is a tooltip for text
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithDelay: Story = {
  render: () => (
    <TooltipProvider delayDuration={500}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">Hover me (with delay)</Button>
        </TooltipTrigger>
        <TooltipContent>
          This tooltip has 500ms delay
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

export const WithSideOffset: Story = {
  render: () => (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline">With offset</Button>
        </TooltipTrigger>
        <TooltipContent sideOffset={10}>
          This tooltip has a 10px offset
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
};

