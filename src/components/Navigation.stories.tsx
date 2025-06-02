import type { Meta, StoryObj } from '@storybook/react';
import { I18nextProvider } from 'react-i18next';
import i18n from '../i18n';
import Navigation from './Navigation';
import React from 'react';
import { ThemeProvider } from 'next-themes';
import { LanguageProvider } from './LanguageProvider';
import {
  HomeIcon,
  GalleryVerticalEnd,
  BellIcon,
  CreditCardIcon,
  LanguagesIcon,
  LogOutIcon,
  MoreVerticalIcon,
  SearchIcon,
  UserCircleIcon,
} from 'lucide-react';

// Mock Next.js navigation hooks
const MockNextNavigation = ({ 
  children, 
  pathname = '/' 
}: { 
  children: React.ReactNode;
  pathname?: string;
}) => {
  // Mock implementation for usePathname
  React.useEffect(() => {
    // @ts-ignore - We're mocking the Next.js navigation hooks
    window.usePathname = () => pathname;
  }, [pathname]);

  return <>{children}</>;
};

const meta = {
  title: 'Layout/Navigation',
  component: Navigation,
  parameters: {
    layout: 'fullscreen',
    // Disable default padding and other storybook features that might interfere with fullscreen layout
    docs: {
      story: {
        inline: false,
        iframeHeight: '100vh',
      },
    },
  },
  decorators: [
    (Story, context) => {
      // Get the current pathname from the story parameters or default to '/'
      const pathname = context?.parameters?.nextjs?.navigation?.pathname || '/';
      // Get theme from story parameters or default to 'light'
      const theme = context?.parameters?.theme || 'light';
      
      return (
        <MockNextNavigation pathname={pathname}>
          <ThemeProvider 
            attribute="class" 
            defaultTheme={theme} 
            enableSystem={false} 
            forcedTheme={typeof window === 'undefined' ? 'light' : undefined}
          >
            <I18nextProvider i18n={i18n}>
              <LanguageProvider>
                <div style={{ height: '100vh', width: '100%' }} className={theme === 'dark' ? 'dark' : ''}>
                  <Story />
                </div>
              </LanguageProvider>
            </I18nextProvider>
          </ThemeProvider>
        </MockNextNavigation>
      );
    },
  ],
} satisfies Meta<typeof Navigation>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    data: {
      navMain: [
        {
          title: "Getting Started",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "home",
              url: "/",
            },
            {
              title: "about",
              url: "/about",
            },
          ],
        },
        {
          title: "Human Resources",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "hr",
              url: "/hr",
            },
          ],
        },
      
      ],
    },
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Content</h1>
        <p className="text-gray-600 mb-4">
          This is the main content area of the dashboard. In a real application, this would contain
          your page content.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="bg-white rounded-lg shadow p-4 border">
              <h2 className="font-semibold mb-2">Card {item}</h2>
              <p className="text-sm text-gray-500">
                Sample content for card {item}. This demonstrates how content would appear inside the navigation layout.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};

export const WithLongPageContent: Story = {
  args: {
    data: {
      navMain: [
        {
          title: "Getting Started",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "home",
              url: "/",
            },
            {
              title: "about",
              url: "/about",
            },
          ],
        },
        {
          title: "Human Resources",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "hr",
              url: "/hr",
            },
          ],
        },
        {
          title: "Building Your Application",
          icon: "GalleryVerticalEnd",
          url: "#",
          items: [
            { title: "Routing", url: "#" },
            { title: "Data Fetching", url: "#" },
            { title: "Rendering", url: "#" },
            { title: "Caching", url: "#" },
            { title: "Styling", url: "#" },
            { title: "Optimizing", url: "#" },
            { title: "Configuring", url: "#" },
            { title: "Testing", url: "#" },
            { title: "Authentication", url: "#" },
            { title: "Deploying", url: "#" },
            { title: "Upgrading", url: "#" },
            { title: "Examples", url: "#" },
          ],
        },
        {
          title: "Community",
          url: "#",
          items: [
            { title: "Contribution Guide", url: "#" },
          ],
        },
      ],
    },
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Page With Scrolling Content</h1>
        <p className="text-gray-600 mb-4">
          This story demonstrates how the navigation component handles a page with long content that requires scrolling.
        </p>
        {Array.from({ length: 20 }).map((_, index) => (
          <div key={index} className="mb-8 bg-white rounded-lg shadow p-4 border">
            <h2 className="font-semibold mb-2">Section {index + 1}</h2>
            <p className="text-sm text-gray-500">
              This is a content section with some example text. The sidebar should remain fixed while this content scrolls.
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris.
            </p>
          </div>
        ))}
      </div>
    ),
  },
};

export const AboutPageActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/about',
      },
    },
  },
  args: {
    data: {
      navMain: [
        {
          title: "Getting Started",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "home",
              url: "/",
            },
            {
              title: "about",
              url: "/about",
            },
          ],
        },
        {
          title: "Human Resources",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "hr",
              url: "/hr",
            },
          ],
        },
        {
          title: "Building Your Application",
          icon: "GalleryVerticalEnd",
          url: "#",
          items: [
            { title: "Routing", url: "#" },
            { title: "Data Fetching", url: "#" },
            { title: "Rendering", url: "#" },
            { title: "Caching", url: "#" },
            { title: "Styling", url: "#" },
            { title: "Optimizing", url: "#" },
            { title: "Configuring", url: "#" },
            { title: "Testing", url: "#" },
            { title: "Authentication", url: "#" },
            { title: "Deploying", url: "#" },
            { title: "Upgrading", url: "#" },
            { title: "Examples", url: "#" },
          ],
        },
        {
          title: "Community",
          url: "#",
          items: [
            { title: "Contribution Guide", url: "#" },
          ],
        },
      ],
    },
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">About Page</h1>
        <p className="text-gray-600 mb-4">
          This is the About page content. Note that the "About" item in the navigation should be highlighted
          as active.
        </p>
        <div className="bg-white rounded-lg shadow p-4 border mt-4">
          <h2 className="font-semibold mb-2">About this Application</h2>
          <p className="text-sm text-gray-500">
            This is a demo of the Navigation component with the About page active. The sidebar
            should show the About menu item as selected.
          </p>
        </div>
      </div>
    ),
  },
};

export const HRPageActive: Story = {
  parameters: {
    nextjs: {
      navigation: {
        pathname: '/hr',
      },
    },
  },
  args: {
    data: {
      navMain: [
        {
          title: "Getting Started",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "home",
              url: "/",
            },
            {
              title: "about",
              url: "/about",
            },
          ],
        },
        {
          title: "Human Resources",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "hr",
              url: "/hr",
            },
          ],
        },
        {
          title: "Building Your Application",
          icon: "GalleryVerticalEnd",
          url: "#",
          items: [
            { title: "Routing", url: "#" },
            { title: "Data Fetching", url: "#" },
            { title: "Rendering", url: "#" },
            { title: "Caching", url: "#" },
            { title: "Styling", url: "#" },
            { title: "Optimizing", url: "#" },
            { title: "Configuring", url: "#" },
            { title: "Testing", url: "#" },
            { title: "Authentication", url: "#" },
            { title: "Deploying", url: "#" },
            { title: "Upgrading", url: "#" },
            { title: "Examples", url: "#" },
          ],
        },
        {
          title: "Community",
          url: "#",
          items: [
            { title: "Contribution Guide", url: "#" },
          ],
        },
      ],
    },
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Human Resources</h1>
        <p className="text-gray-600 mb-4">
          This is the HR page content. Note that the "HR" item in the navigation should be highlighted
          as active.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="font-semibold mb-2">Employee Directory</h2>
            <p className="text-sm text-gray-500">
              Access and manage employee information from this section.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 border">
            <h2 className="font-semibold mb-2">Policies</h2>
            <p className="text-sm text-gray-500">
              Review company HR policies and guidelines.
            </p>
          </div>
        </div>
      </div>
    ),
  },
};

// Dark mode variants
export const DarkModeDefault: Story = {
  parameters: {
    theme: 'dark',
  },
  args: {
    data: {
      navMain: [
        {
          title: "Getting Started",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "home",
              url: "/",
            },
            {
              title: "about",
              url: "/about",
            },
          ],
        },
        {
          title: "Human Resources",
          icon: "HomeIcon",
          url: "#",
          items: [
            {
              title: "hr",
              url: "/hr",
            },
          ],
        },
      ],
    },
    children: (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Dashboard Content (Dark Mode)</h1>
        <p className="mb-4">
          This is the main content area of the dashboard in dark mode. It demonstrates how the navigation
          component appears with dark theme applied.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {[1, 2, 3, 4, 5, 6].map((item) => (
            <div key={item} className="rounded-lg shadow p-4 border">
              <h2 className="font-semibold mb-2">Card {item}</h2>
              <p className="text-sm">
                Sample content for card {item}. This demonstrates how content would appear inside the navigation layout with dark mode.
              </p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
};