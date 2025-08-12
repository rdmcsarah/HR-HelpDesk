import type { Meta, StoryObj } from '@storybook/react';
import { Button } from "@/components/ui/button";
import DataTableDemo from "@/components/table_1";
import '@/app/globals.css';

// Create mock data for the stories
const mockRequests = [
  {
    id: 1,
    title: "Vacation Request",
    description: "Annual leave request for summer vacation",
    requestType: "Leave",
    status: "Pending",
    createdAt: new Date("2025-06-01"),
    updatedAt: new Date("2025-06-01"),
    closedAt: new Date("2025-06-15"),
    comments: ["Approved by manager"],
    assignedToId: 101,
    userId: "EMP123",
    assignedTo: "HR Manager"
  },
  {
    id: 2,
    title: "Salary Certificate",
    description: "Request for salary certificate",
    requestType: "Document",
    status: "Completed",
    createdAt: new Date("2025-05-15"),
    updatedAt: new Date("2025-05-16"),
    closedAt: new Date("2025-05-16"),
    comments: ["Document generated", "Sent to employee"],
    assignedToId: 102,
    userId: "EMP123",
    assignedTo: "HR Officer"
  }
];

// Create a mock version of the page component for Storybook
const MockHRDocumentPage = () => {
  const inputTitles = [
    "title",
    "description",
    "requestType",
    "status",
    "id",
    "status",
    "createdAt",
    "updatedAt",
    "closedAt",
    "comments",
    "assignedToId",
    "userId",
    "assignedTo",
  ];

  return (
    <div className="min-h-screen bg-gray-100 justify-center p-4 md:p-8 flex flex-col items-center">
      <DataTableDemo 
        data={mockRequests} 
        inputTitles={inputTitles} 
        empcode="EMP123" 
      />

      <div className="grid grid-rows-2 md:grid-cols-2 gap-x-4 gap-y-2 w-full max-w-4xl mt-2">
        <h1 className="text-xl font-semibold md:py-4 flex md:justify-start">
          You can press here for a new Request
        </h1>
        <div className="md:py-4">
          <Button 
            className="bg-green-700 hover:bg-green-600 md:py-5 py-4 w-40 md:px-18 text-white"
            onClick={() => console.log('Navigate to New Request')}
          >
            New Request
          </Button>
        </div>
      </div>
    </div>
  );
};

// Loading state version of the component
const LoadingState = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="w-full max-w-md px-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div 
            className="w-[70%] bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
          ></div>
        </div>
        <p className="mt-2 text-sm text-gray-500">70%</p>
      </div>
    </div>
  );
};

const meta = {
  title: 'Pages/HRDocument',
  component: MockHRDocumentPage,
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#f3f4f6' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
  },
  decorators: [
    (Story) => (
      <div style={{ minHeight: '100vh' }}>
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
} satisfies Meta<typeof MockHRDocumentPage>;

export default meta;
type Story = StoryObj<typeof MockHRDocumentPage>;

export const Default: Story = {
  args: {},
};

export const Loading: Story = {
  render: () => <LoadingState />,
};

export const WithNoRequests: Story = {
  render: () => (
    <MockHRDocumentPage />
  ),
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
};
