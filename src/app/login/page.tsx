"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useEmployee, EmployeeProvider } from '@/context/EmployeeContext';
import LoadingPage from './loadingPage';




export interface Employee {
  created_at: string; // ISO date string
  empcode: string;
  email: string;
  mobile: string;
  token: number;
  access: boolean;
  updated: string; // date string (YYYY-MM-DD)
  password: string | null;
  dob: string; // date string (YYYY-MM-DD)
  dep: string;
  managercode: string;
  name: string;
  namear: string;
  firstname: string;
  firstnamear: string;
  lastname: string;
  lastnamear: string;
  gender: "male" | "female" | string; // enum possible if known
  gradeinternal: string;
  gradeofficial: string;
  nationality: string;
  position: string;
  photo: string | null;
}



function LoginContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const { setEmpdata , empdata} = useEmployee();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  const [newEmpdata, setNewEmpdata] = useState<Employee | null>(null);  

  

  useEffect(() => {
    if (token) {
      fetch("https://n8n.srv869586.hstgr.cloud/webhook/logged", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((res) => res.json())
        .then(async (data) => {
          // Store in server session
          await fetch('/api/session', {
            method: 'POST',
            body: JSON.stringify(data[0]),
            headers: {
              'Content-Type': 'application/json'
            }
          });
          setEmpdata(data[0]);
          setNewEmpdata(data[0]);
        })
        .catch((err) => {
          setLoading(false);
          setError("Failed to fetch employee data");
          console.error("Error calling webhook:", err);
        });
    }
  }, [token, setEmpdata, router]);



  useEffect(() => {
    if (newEmpdata) {
      setLoading(false);
       router.push("/");
    }}, [newEmpdata]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  return (
    <div className="ssss">

              <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 `}>
  <div className="w-full max-w-md px-4">
    {/* Progress bar track */}
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      {/* Progress bar fill */}
      <div
        className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out dark:bg-green-500"
        style={{ width: `100%` }}
      ></div>
    </div>
    
    {/* Progress text */}
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      100% Loading
    </p>
  </div>
</div>
      {/* {loading ? <LoadingPage /> : null} */}
      {/* {error && <div className="error">{error}</div>}
        {JSON.stringify(empdata, null, 2)} */}
    </div>
  );
}

export default function Page() {
  return (
    <EmployeeProvider>
      <Suspense fallback={<LoadingPage />}>
        <LoginContent />
      </Suspense>
    </EmployeeProvider>
  );
}






