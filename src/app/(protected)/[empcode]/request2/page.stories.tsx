import type { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import '@/app/globals.css';

const meta: Meta = {
  title: 'Pages/RequestForm',
  parameters: {
    layout: 'fullscreen',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light', value: '#ffffff' },
        { name: 'dark', value: '#1a1a1a' },
      ],
    },
    docs: {
      description: {
        component:
          'Professional request form page for submitting HR and project-related requests. Includes file upload, validation, and notification logic.',
      },
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
};

export default meta;
type Story = StoryObj;

const RequestFormStory = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    requestType: '',
    empId: 'EMP001',
    status: 'PENDING',
    documentUrl: null,
    project: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);
    setError(null);
    setUploadStatus(null);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsUploading(false);
      setUploadStatus({ success: true, message: 'File uploaded successfully!' });
    }, 1000);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8"
      style={{
        backgroundImage: "url('/assets/bg1.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      <div className="bg-white rounded-2xl opacity-90 p-10 m-3 py-20 w-[1000px]">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-6">
            {/* Title */}
            <div className="col-span-2">
              <Label htmlFor="title">Request Title*</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="rounded-2xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none w-full"
              />
            </div>

            {/* Request Type */}
            <div className="col-span-2">
              <Label htmlFor="requestType">Request Type*</Label>
              <select
                id="requestType"
                name="requestType"
                className="rounded-2xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none w-full"
                value={formData.requestType}
                onChange={handleChange}
                required
              >
                <option value="">Select Request Type</option>
                <option value="SALARY_CERTIFICATE">Salary Certificate</option>
                <option value="MEDICAL_INSURANCE">Medical Insurance</option>
                <option value="VACATION_REQUEST">Vacation Request</option>
                <option value="HR_LETTTER">HR Letter</option>
                <option value="Debit_Card">Debit Card</option>
                <option value="Payment_Slip">Payment Slip</option>
                <option value="Medical_Reimbursement">Medical Reimbursement</option>
                <option value="Khazna_Tech">Khazna Tech</option>
                <option value="HumanPlus_Creation">HumanPlus Creation</option>
                <option value="ONBOARDING_PROCESS">Onboarding Process</option>
                <option value="RESIGNATION_PROCESS">Resignation Process</option>
                <option value="CONTRACTS">Contracts</option>
                <option value="SOCIAL_INSURANCE">Social Insurance</option>
                <option value="PUBLIC_MEDICAL_INSURANCE">Public Medical Insurance</option>
                <option value="PRIVATE_MEDICAL_INSURANCE">Private Medical Insurance</option>
                <option value="LEAVE_REQUEST">Leave Request</option>
                <option value="KELIO_PERMISSIONS">Kelio Permissions</option>
                <option value="OTHER">Other</option>
                <option value="https://hrservices.mobilitycairo.com/selfservice/auth/login">HPlus</option>
              </select>
            </div>

            {/* Project Type */}
            <div className="col-span-2">
              <Label htmlFor="project">Project Type*</Label>
              <select
                id="project"
                name="project"
                className="rounded-2xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none w-full"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">Select Project Type</option>
                <option value="LRT">LRT</option>
                <option value="L3">L3</option>
              </select>
            </div>

            {/* Description */}
            <div className="col-span-2">
              <Label htmlFor="description">Request Description*</Label>
              <textarea
                id="description"
                name="description"
                className="rounded-2xl border border-gray-300 p-4 focus:border-green-700 focus:outline-none w-full"
                placeholder="Please provide a brief description of your request"
                rows={4}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            {/* File Upload */}
            <div className="col-span-2 space-y-2">
              <Label htmlFor="file">Select File (optional)</Label>
              <Input
                id="file"
                type="file"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              />
              {uploadStatus && (
                <p
                  className={`text-sm ${
                    uploadStatus.success ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {uploadStatus.message}
                </p>
              )}
            </div>
          </div>

          {/* Error message */}
          {error && <p className="text-red-500 mt-4">{error}</p>}

          {/* Submit button */}
          <Button
            type="submit"
            className="bg-green-700 hover:bg-green-600 py-4 w-40 mt-8 text-white"
            disabled={isSubmitting || isUploading}
          >
            {isSubmitting || isUploading ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
};

export const Default: Story = {
  render: () => <RequestFormStory />,
};

export const MobileView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => <RequestFormStory />,
};

export const TabletView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
  render: () => <RequestFormStory />,
};

export const DesktopView: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
  render: () => <RequestFormStory />,
};