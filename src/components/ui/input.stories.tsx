// eslint-disable-next-line storybook/no-renderer-packages
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './input';
import { Search, Mail, Lock, Upload, User, Calendar } from 'lucide-react';

const meta = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placeholder: { control: 'text' },
    type: { 
      control: 'select', 
      options: ['text', 'password', 'email', 'number', 'search', 'file', 'date'] 
    },
    disabled: { control: 'boolean' },
    icon: { control: 'select' },
    iconPosition: { 
      control: 'radio',
      options: ['left', 'right']
    }
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text here...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter email...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
  },
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
  },
};

export const WithValue: Story = {
  args: {
    value: 'This is a default value',
  },
};

export const WithError: Story = {
  args: {
    placeholder: 'Error input',
    'aria-invalid': true,
  },
};

export const WithIconLeft: Story = {
  args: {
    placeholder: 'Search...',
    icon: Search,
    iconPosition: 'left'
  },
};

export const WithIconRight: Story = {
  args: {
    placeholder: 'Search...',
    icon: Search,
    iconPosition: 'right'
  },
};

export const EmailWithIcon: Story = {
  args: {
    type: 'email',
    placeholder: 'Enter your email...',
    icon: Mail,
    iconPosition: 'left'
  },
};

export const PasswordWithIcon: Story = {
  args: {
    type: 'password',
    placeholder: 'Enter password...',
    icon: Lock,
    iconPosition: 'right'
  },
};

export const FileInput: Story = {
  args: {
    type: 'file',
    className: 'cursor-pointer'
  },
};

export const FileInputWithIcon: Story = {
  args: {
    type: 'file',
    icon: Upload,
    iconPosition: 'left',
    className: 'cursor-pointer pl-10'
  },
};

export const DateInput: Story = {
  args: {
    type: 'date',
    icon: Calendar,
    iconPosition: 'left'
  },
};

