import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import '@/app/globals.css';

// Storybook story for the Helpdesk Page
const MockPage = () => {
  // Mock empcode for Storybook
  const empcode = "12345";

  return (
  <div 
  className="min-h-screen flex items-center justify-center p-4 md:p-8"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed"
  }}
>
  <div className="w-full max-w-4xl  bg-opacity-90 rounded-lg ">
    <div className="p-6 md:p-8 space-y-6">
      <header className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-100">HR Help Desk</h1>
        <p className="text-lg text-gray-200 max-w-3xl mx-auto">
          You can ask any HR-related question or request an HR document by clicking 
          the buttons below. Our team is ready to assist you with all your HR needs.
        </p>
      </header>

      <div className="flex flex-col md:flex-row justify-center gap-6 mt-10">
        <Link href={`/${empcode}/question`} passHref>
          <Button
            className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
                      text-lg font-medium w-full md:w-auto min-w-[240px] transition-colors"
          >
            Ask a Question
          </Button>
        </Link>
        <Link href={`/${empcode}/hr_document`} passHref>
          <Button 
            className="bg-green-700 hover:bg-green-600 text-white py-6 px-8 rounded-lg 
                      text-lg font-medium w-full md:w-auto min-w-[240px]"
          >
            Request
          </Button>
        </Link>
      </div>
    </div>
  </div>
</div>
  );
};

export default {
  title: "App/Protected/HelpdeskPage",
  component: MockPage,
};

export const Default = () => <MockPage />;
