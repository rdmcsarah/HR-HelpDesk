"use client";

import { useEmployee } from '@/context/EmployeeContext';
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/site-header";

export default function ProtectedContent({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  const { empdata, setEmpdata } = useEmployee();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check server session when component mounts
    if (!empdata) {
      fetch('/api/session')
        .then(res => res.json())
        .then(response => {
          if (response.data) {
            setEmpdata(response.data);
          }else{
            // console.error("No employee data found in session response");
            location.href = 'https://rdmc-portal.com'; // Redirect to login if no employee data
          }
        });
    }
  }, []);

  useEffect(() => {
    if (empdata) {
      setLoading(false);
    }
  }, [empdata]);

  

  return (
    <>
      {/* <pre>
        {JSON.stringify(empdata, null, 2)}
      </pre> */}

      {loading ? (
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
      ) : (
        <main>
          
           <SiteHeader empCode={empdata?.empcode || ""}/>
          {children}</main>
      )}
    </>
  );
}