"use client";

import { LanguageProvider } from "@/components/LanguageProvider";
import ClientWrapper from "@/app/ClientWrapper";
import { EmployeeProvider } from '@/context/EmployeeContext';
import ProtectedContent from './ProtectedContent';

export default function ProtectedServerLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClientWrapper>
      <LanguageProvider>
        <EmployeeProvider>
          <ProtectedContent>
            {children}
          </ProtectedContent>
        </EmployeeProvider>
      </LanguageProvider>
    </ClientWrapper>
  );
}