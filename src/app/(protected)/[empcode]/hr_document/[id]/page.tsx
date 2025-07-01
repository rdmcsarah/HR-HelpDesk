"use client";
import DataTableDemo from "@/components/table_1";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
  // const { empcode } = useParams<{ empcode: string }>();
  const [progress, setProgress] = useState(40);
  const [loading, setLoading] = useState(true);

  type Request = {
    documents: any;

    id: string;
    title: string;
    description: string;
    requestType: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date;
    reply: string;
    assignedToId: number;
    userId: string;
    assignedTo: string;
    replyDocumentUrl: string;
  };

  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);
  // const [error, setError] = useState('');
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch picture data
        const req = await fetch(`/api/reqs?id=${id}`);
        if (!req.ok) throw new Error("Failed to fetch pic");
        const data = await req.json();
        if (Array.isArray(data) && data.length > 0) setRequest(data[0]);
        setProgress(90);
        console.log("API Response:", data);

        // Fetch comments for this picture
      } catch (err: any) {
        console.error("Fetch error:", err);
        throw new Error(err.message || "Unknown error fetching pic");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md px-4">
          {/* <h2 className="text-xl font-semibold mb-4 text-gray-700">Loading Requests...</h2> */}

          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500">{Math.round(progress)}%</p>
        </div>
      </div>
    );
  }
  return (
    // <div className="bg-gray-100 w-full min-h-screen flex flex-col justify-center items-center">
<div
  className="min-h-screen flex flex-col items-center justify-start p-4 md:p-8"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
<div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
  {/* Page Header */}
  <header className="mb-10 text-center">
    <h1 className="text-3xl md:text-4xl font-serif font-bold text-white">
      Request Details
    </h1>
    <div className="mt-2 h-1 w-20 bg-green-600 mx-auto"></div>
  </header>
  
  {/* Request Card */}
  <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl">
    {/* Card Header */}
    <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Request Information</h2>
        <span className="text-green-100 text-sm font-medium">
          {request?.createdAt && `Submitted: ${new Date(request.createdAt).toLocaleDateString()}`}
        </span>
      </div>
    </div>
    
    {/* Card Content */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
      {/* Request Type */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Request Type</h3>
        <p className="text-lg font-medium text-gray-900">
          {request?.requestType || "Not specified"}
        </p>
      </div>
      
      {/* Status */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</h3>
        <div className="flex items-center">
          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            request?.status === 'Completed' 
              ? 'bg-green-100 text-green-800' 
              : request?.status === 'Pending'
              ? 'bg-yellow-100 text-yellow-800'
              : request?.status === 'Rejected'
              ? 'bg-red-100 text-red-800'
              : 'bg-gray-100 text-gray-800'
          }`}>
            {request?.status || "Unknown"}
          </span>
        </div>
      </div>
      
      {/* Description */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</h3>
        <p className="text-gray-800">
          {request?.description || "No description provided"}
        </p>
      </div>
      
      {/* Attached Document */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Attached Document</h3>
        {request?.replyDocumentUrl ? (
          <a
            href={request.replyDocumentUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center text-green-700 hover:text-green-600 hover:underline transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View attached document
          </a>
        ) : (
          <p className="text-gray-500 italic">No document attached</p>
        )}
      </div>
      
      {/* Official Reply */}
      <div className="space-y-2 md:col-span-2">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Official Reply</h3>
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
          {request?.reply ? (
            <p className="text-gray-800 whitespace-pre-wrap">{request.reply}</p>
          ) : (
            <div className="text-center py-6">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="mt-2 text-gray-500">No response yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
    
    {/* Card Footer */}
    <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center">
      <p className="text-sm text-gray-500">
        Request ID: <span className="font-mono font-medium">{request?.id || 'N/A'}</span>
      </p>
      {request?.updatedAt && (
        <p className="text-sm text-gray-500">
          Last updated: {new Date(request.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  </div>
</div>
</div>
  );
}
