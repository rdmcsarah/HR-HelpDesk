import type { Meta, StoryObj } from '@storybook/react';
import { LoginForm } from './login-form';
import { ThemeProvider } from 'next-themes';

const meta = {
  title: 'Components/LoginForm',
  component: LoginForm,
  parameters: {
    layout: 'centered',
  },
  decorators: [
    (Story) => (
      <div className="w-full max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof LoginForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

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
};

// Mobile variant
export const Mobile: Story = {
  decorators: [
    (Story) => (
      <div className="w-[375px]">
        <Story />
      </div>
    ),
  ],
};
