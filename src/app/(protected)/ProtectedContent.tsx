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
        <div className="loading-page">
          <h1>Loading...</h1>
        </div>
      ) : (
        <main>
          
           <SiteHeader empCode={empdata?.empcode || ""}/>
          {children}</main>
      )}
    </>
  );
}