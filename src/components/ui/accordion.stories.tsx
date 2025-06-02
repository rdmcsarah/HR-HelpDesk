// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './accordion';

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['single', 'multiple'],
      description: 'The type of accordion (single or multiple items can be opened)',
    },
    collapsible: {
      control: 'boolean',
      description: 'When type is "single", allows closing all items',
    },
  },
} satisfies Meta<typeof Accordion>;

export default meta;
type Story = StoryObj<typeof meta>;

const SingleTemplate = (args: any) => (
  <Accordion {...args} className="w-[400px]">
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

const MultipleTemplate = (args: any) => (
  <Accordion {...args} className="w-[400px]">
    <AccordionItem value="item-1">
      <AccordionTrigger>Is it accessible?</AccordionTrigger>
      <AccordionContent>
        Yes. It adheres to the WAI-ARIA design pattern.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-2">
      <AccordionTrigger>Is it styled?</AccordionTrigger>
      <AccordionContent>
        Yes. It comes with default styles that match the other components' aesthetic.
      </AccordionContent>
    </AccordionItem>
    <AccordionItem value="item-3">
      <AccordionTrigger>Is it animated?</AccordionTrigger>
      <AccordionContent>
        Yes. It's animated by default, but you can disable it if you prefer.
      </AccordionContent>
    </AccordionItem>
  </Accordion>
);

export const Single: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: SingleTemplate,
};

export const Multiple: Story = {
  args: {
    type: 'multiple',
  },
  render: MultipleTemplate,
};