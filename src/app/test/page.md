"use client"
import { useEmployee } from '@/context/EmployeeContext';
import { use, useEffect, useState } from 'react';

export default function ExcelUploader() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);


  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/emps_data', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload file');
    } finally {
      setIsLoading(false);
    }
  };

// useEffect(() => {
//   const fetchAuth = async () => {
//     const res = await fetch("/api/auth", {
//       method: "GET",
//       credentials: "include"
//     });
//     const response = await res.json();
//     console.log("refeqfws", response.username);
//   };
//   fetchAuth();
// }, []);
const { empdata } = useEmployee();

// useEffect(() => {

//   setEmpcode(empdata?.empcode || "");


//   },[empdata]);

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Employee Excel Upload g</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Select Excel File:
          </label>
          <input
            type="file"
            accept=".xlsx, .xls"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Only .xlsx or .xls files with employee data
          </p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !file}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {isLoading ? 'Processing...' : 'Upload & Process First 3 Records'}
        </button>
      </form>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-6 p-4 bg-green-50 rounded-md">
          <h2 className="font-bold mb-2">Upload Results:</h2>
          <div className="text-sm">
            <p>Message: {result.message}</p>
            <p>Records processed: {result.count}</p>
            <details className="mt-2">
              <summary className="cursor-pointer font-medium">View details</summary>
              <pre className="bg-gray-100 p-2 mt-1 rounded overflow-auto max-h-60">
                {JSON.stringify(result.employees, null, 2)}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
}