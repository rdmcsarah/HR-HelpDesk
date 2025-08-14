"use client";

import { createContext, useContext, ReactNode, useState } from 'react';
import { Employee } from '@/app/login/page';

interface EmployeeContextType {
  empdata: Employee | null;
  setEmpdata: (employee: Employee | null) => void;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export function EmployeeProvider({ children }: { children: ReactNode }) {
  const [empdata, setEmpdata] = useState<Employee | null>(null);

  return (
    <EmployeeContext.Provider value={{ empdata, setEmpdata }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployee must be used within an EmployeeProvider');
  }
  return context;
}
