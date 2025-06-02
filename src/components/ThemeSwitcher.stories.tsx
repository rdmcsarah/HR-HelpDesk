import type { Meta, StoryObj } from '@storybook/react';
import { ThemeSwitcher } from './ThemeSwitcher';
import { ThemeProvider } from 'next-themes';

const meta = {
  title: 'Components/ThemeSwitcher',
  component: ThemeSwitcher,
  parameters: {
    layout: 'centered',
  },  decorators: [
    (Story) => (
      <ThemeProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        forcedTheme={typeof window === 'undefined' ? 'light' : undefined}
      >
        <div className="p-4 flex justify-center items-center">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <div className="p-8 bg-background border rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const LightMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="light">
        <div className="p-8 bg-background border rounded-lg">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export const DarkMode: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="dark">
        <div className="p-8 bg-background border rounded-lg dark">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};
