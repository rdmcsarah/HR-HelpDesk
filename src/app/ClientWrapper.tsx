// src/app/ClientWrapper.tsx
"use client";

import React, { ReactNode } from 'react';
import { ThemeProvider } from 'next-themes';

interface ClientWrapperProps {
  children: ReactNode;
}

// This component is necessary to wrap client components that use hooks
// since the root layout is a server component
const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return (
    <ThemeProvider 
      attribute="class" 
      defaultTheme="system" // Use system as default theme
      enableColorScheme
      forcedTheme={typeof window === 'undefined' ? 'light' : undefined} // Force light theme during SSR
    >
      {children}
    </ThemeProvider>
  );
};

export default ClientWrapper;
