// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import React from 'react';
import {
  Sidebar,
  SidebarProvider,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from './sidebar';
import { Home, Settings, Users, FileText, HelpCircle, LogOut } from 'lucide-react';

const meta = {
  title: 'Components/Sidebar',
  component: SidebarProvider,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SidebarProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Users />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FileText />
                <span>Reports</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HelpCircle />
                <span>Help</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4">
          <SidebarMenuButton>
            <LogOut />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <div className="p-4">
        <SidebarTrigger />
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="mt-2">Your dashboard content goes here.</p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

export const Floating: Story = {
  render: () => (
    <SidebarProvider>
      <Sidebar variant="floating">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Admin Dashboard</h2>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive>
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Users />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="p-4">
        <SidebarTrigger />
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Main Content</h1>
          <p className="mt-2">This example uses the floating variant of the sidebar.</p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

export const IconMode: Story = {
  render: () => (
    <SidebarProvider defaultOpen={false}>
      <Sidebar collapsible="icon">
        <SidebarHeader className="p-4">
          <h2 className="text-lg font-semibold">Admin</h2>
        </SidebarHeader>
        <SidebarContent className="flex-1">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton isActive tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Users">
                <Users />
                <span>Users</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
      </Sidebar>
      <div className="p-4">
        <SidebarTrigger />
        <div className="mt-4">
          <h1 className="text-2xl font-bold">Icon Mode</h1>
          <p className="mt-2">This example shows the sidebar in icon-only mode.</p>
        </div>
      </div>
    </SidebarProvider>
  ),
};

