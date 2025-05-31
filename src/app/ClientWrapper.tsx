// src/app/ClientWrapper.tsx
"use client";

import React, { ReactNode } from 'react';

interface ClientWrapperProps {
  children: ReactNode;
}

// This component is necessary to wrap client components that use hooks
// since the root layout is a server component
const ClientWrapper: React.FC<ClientWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default ClientWrapper;
