import type { Meta, StoryObj } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { LanguageProvider } from './LanguageProvider';

// Mock Next.js navigation hooks
const MockNextNavigation = ({ children }: { children: React.ReactNode }) => {
  // Mock implementation for Next.js navigation hooks
  React.useEffect(() => {
    // @ts-expect-error - We're mocking the Next.js navigation hooks
    window.usePathname = () => '/';
    // @ts-expect-error - We're mocking the Next.js search params
    window.useSearchParams = () => ({
      get: () => null,
      toString: () => '',
    });
  }, []);

  return <>{children}</>;
};

const meta = {
  title: 'Language/LanguageSwitcher',
  component: LanguageSwitcher,
  parameters: {
    layout: 'centered',
  },  decorators: [
    (Story) => (
      <MockNextNavigation>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md dark:bg-gray-800">
              <Story />
            </div>
          </LanguageProvider>
        </I18nextProvider>
      </MockNextNavigation>
    ),
  ],
} satisfies Meta<typeof LanguageSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

// Helper component with LanguageProvider for stories
const LanguageSwitcherWithProvider = () => {
  return (
    <LanguageProvider>
      <LanguageSwitcher />
    </LanguageProvider>
  );
};

export const Default: Story = {
  render: () => <LanguageSwitcherWithProvider />
  
};

export const WithCustomBackground: Story = {
  render: () => (
    <div className="bg-gray-100 dark:bg-gray-900 p-8 rounded-lg">
      <LanguageSwitcherWithProvider />
    </div>
  ),

};

// This story demonstrates how the component behaves with an initial language set
export const WithInitialArabic: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => {
    // Force Arabic language before rendering
    React.useEffect(() => {
      i18n.changeLanguage('ar');
    }, []);
    
    return <LanguageSwitcherWithProvider />;
  },
   tags: ['Arabic'],
};

// This story demonstrates how the component behaves with an initial language set
export const WithInitialFrench: Story = {
  render: () => {
    // Force French language before rendering
    React.useEffect(() => {
      i18n.changeLanguage('fr');
    }, []);
    
    return <LanguageSwitcherWithProvider />;
  },
};

// Dark mode variant
export const DarkMode: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  decorators: [
    (Story) => (
      <div className="dark bg-gray-900 p-8 rounded-lg">
        <Story />
      </div>
    ),
  ],
  render: () => <LanguageSwitcherWithProvider />,
};