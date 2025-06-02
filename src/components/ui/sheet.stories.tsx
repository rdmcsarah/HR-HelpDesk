// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './sheet';
import { Button } from './button';

const meta = {
  title: 'Components/Sheet',
  component: Sheet,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Sheet>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Right: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Right)</Button>
      </SheetTrigger>
      <SheetContent side="right">
        <SheetHeader>          <SheetTitle>Edit Profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <h4 className="text-sm font-medium mb-3">Content goes here</h4>
          <p className="text-sm text-muted-foreground">
            You can put any content here, including forms, lists, or other UI components.
          </p>
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit">Save changes</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  ),
};

export const Left: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Left)</Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription>
            Navigation and settings options.
          </SheetDescription>
        </SheetHeader>
        <div className="py-4">
          <div className="space-y-3">
            {["Dashboard", "Analytics", "Team", "Settings"].map((item) => (
              <div key={item} className="px-2 py-2 text-sm hover:bg-accent rounded-md cursor-pointer">{item}</div>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Top: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Top)</Button>
      </SheetTrigger>
      <SheetContent side="top">
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
          <SheetDescription>
            Your recent notifications.
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <p className="text-sm">
            This content slides in from the top of the screen.
          </p>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

export const Bottom: Story = {
  render: () => (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open Sheet (Bottom)</Button>
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Quick Actions</SheetTitle>
          <SheetDescription>
            Access common tasks here.
          </SheetDescription>
        </SheetHeader>
        <div className="grid grid-cols-2 gap-4 py-4">
          <Button variant="outline" className="justify-start">
            New File
          </Button>
          <Button variant="outline" className="justify-start">
            New Folder
          </Button>
          <Button variant="outline" className="justify-start">
            Share
          </Button>
          <Button variant="outline" className="justify-start">
            Settings
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  ),
};

