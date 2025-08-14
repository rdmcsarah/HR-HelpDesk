// src/context/AuthContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

export interface Employee {
  created_at: string;
  empcode: string;
  email: string;
  mobile: string;
  token: number;
  access: boolean;
  updated: string;
  password: string | null;
  dob: string;
  dep: string;
  managercode: string;
  name: string;
  namear: string;
  firstname: string;
  firstnamear: string;
  lastname: string;
  lastnamear: string;
  gender: "male" | "female" | string;
  gradeinternal: string;
  gradeofficial: string;
  nationality: string;
  position: string;
  photo: string | null;
}

interface AuthContextType {
  empdata: Employee | null;
  setEmpdata: (emp: Employee | null) => void;
}

const AuthContext = createContext<AuthContextType>({
  empdata: null,
  setEmpdata: () => {},
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [empdata, setEmpdata] = useState<Employee | null>(null);

  // Optional: Automatically fetch on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      fetch("https://n8n.srv869586.hstgr.cloud/webhook/logged", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setEmpdata(data[0]);
        })
        .catch(console.error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ empdata, setEmpdata }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
