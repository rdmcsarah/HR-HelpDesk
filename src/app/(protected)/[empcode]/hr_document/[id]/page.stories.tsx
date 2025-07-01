import React from "react";

// Mock the Page component's dependencies
const mockRequest = {
  documents: [],
  id: "REQ-12345",
  title: "Vacation Request",
  description: "Requesting annual leave for 2 weeks.",
  requestType: "Vacation",
  status: "Completed",
  createdAt: new Date("2024-06-01"),
  updatedAt: new Date("2024-06-02"),
  closedAt: new Date("2024-06-10"),
  reply: "Your request has been approved.",
  assignedToId: 101,
  userId: "emp001",
  assignedTo: "Manager A",
  replyDocumentUrl: "https://example.com/documents/approval.pdf",
};

const PageStory = () => {
  // Inline the main UI from your Page component, using mockRequest
  const request = mockRequest;
  const progress = 100;
  const loading = false;

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="w-full max-w-md px-4">
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
      <div className="w-full max-w-6xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-serif text-center text-gray-300 font-bold mb-8">
          Request Details
        </h1>
        <div className="bg-white bg-opacity-90 rounded-xl shadow-lg overflow-hidden">
          <div className="bg-green-700 px-6 py-4">
            <h2 className="text-xl font-semibold text-white">Request Information</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Request Type</h3>
              <p className="text-lg font-medium text-gray-900">
                {request?.requestType || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Status</h3>
              <div className="flex items-center">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  request?.status === 'Completed' 
                    ? 'bg-green-100 text-green-800' 
                    : request?.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {request?.status || "Unknown"}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Attached Document</h3>
              {request?.replyDocumentUrl ? (
                <a
                  href={request.replyDocumentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-green-800 hover:text-green-700 hover:underline transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {request.replyDocumentUrl.split("/").pop()}
                </a>
              ) : (
                <p className="text-gray-500 italic">No document attached</p>
              )}
            </div>
            <div className="space-y-1 md:col-span-2">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Official Reply</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                {request?.reply ? (
                  <p className="text-gray-800 whitespace-pre-wrap">{request.reply}</p>
                ) : (
                  <p className="text-gray-500 italic">No response yet</p>
                )}
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Request ID: {request?.id || 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default {
  title: "Pages/RequestDetailsPage",
  component: PageStory,
};

export const Default = () => <PageStory />;
