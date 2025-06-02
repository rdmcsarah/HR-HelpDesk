import type { Meta, StoryObj } from '@storybook/react';
import { 
  Card, 
  CardHeader, 
  CardFooter, 
  CardTitle, 
  CardAction,
  CardDescription, 
  CardContent 
} from './card';
import { Button } from './button';
import { ThemeProvider } from 'next-themes';

const meta = {
  title: 'components/Card',
  component: Card,
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
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card Description</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card Content</p>
      </CardContent>
      <CardFooter>
        <p>Card Footer</p>
      </CardFooter>
    </Card>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card with action button</CardDescription>
        <CardAction>
          <Button variant="outline" size="sm">Action</Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p>This card has an action button in its header.</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline">Cancel</Button>
        <Button>Submit</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card>
      <CardContent>
        <p>A simple card with only content and no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>User Profile</CardTitle>
        <CardDescription>View and edit your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">Name</p>
              <p className="text-sm text-muted-foreground">John Doe</p>
            </div>
            <div>
              <p className="text-sm font-medium">Email</p>
              <p className="text-sm text-muted-foreground">john.doe@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium">Role</p>
              <p className="text-sm text-muted-foreground">Administrator</p>
            </div>
            <div>
              <p className="text-sm font-medium">Status</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-2">
        <Button variant="outline">Edit Profile</Button>
        <Button>Save Changes</Button>
      </CardFooter>
    </Card>
  ),
};

// Light mode variant
export const Light: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="light">
        <div className="p-4 bg-background rounded-lg">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Light Mode Card</CardTitle>
        <CardDescription>This card is displayed in light mode</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content shown in light mode theme</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

// Dark mode variant
export const Dark: Story = {
  decorators: [
    (Story) => (
      <ThemeProvider attribute="class" forcedTheme="dark">
        <div className="p-4 bg-background rounded-lg dark">
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Dark Mode Card</CardTitle>
        <CardDescription>This card is displayed in dark mode</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Content shown in dark mode theme</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};
