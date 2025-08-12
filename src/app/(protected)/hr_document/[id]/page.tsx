

"use client";
import DataTableDemo from "@/components/table_1";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import { Label } from "@radix-ui/react-dropdown-menu";
import { LinkIcon } from "lucide-react";

export default function Page() {
  const [progress, setProgress] = useState(40);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  // RTL/LTR handling
  useEffect(() => {
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }
    setMounted(true);
  }, [i18n.language]);

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
    replydocumentUrlNew:string[]
  };

  const { id } = useParams();
  const [request, setRequest] = useState<Request | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const req = await fetch(`/api/reqs?id=${id}`);
        if (!req.ok) throw new Error(t("fetchError"));
        const data = await req.json();
        if (Array.isArray(data) && data.length > 0) setRequest(data[0]);
        setProgress(90);
      } catch (err: any) {
        console.error("Fetch error:", err);
        throw new Error(err.message || t("unknownError"));
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, t]);

  if (loading) {
    return (
           <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ${i18n.language === 'ar' ? 'rtl' : ''}`}>
  <div className="w-full max-w-md px-4">
    {/* Progress bar track */}
    <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
      {/* Progress bar fill */}
      <div
        className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out dark:bg-green-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    
    {/* Progress text */}
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
      {Math.round(progress)}% {t("loading")}
    </p>
  </div>
</div>
    );
  }

  // Status translations
  const getTranslatedStatus = (status: string) => {
    const statusTranslations: Record<string, Record<string, string>> = {
      Completed: {
        en: "Completed",
        fr: "Terminé",
        ar: "مكتمل"
      },
      Pending: {
        en: "Pending",
        fr: "En attente",
        ar: "قيد الانتظار"
      },
      Rejected: {
        en: "Rejected",
        fr: "Rejeté",
        ar: "مرفوض"
      }
    };
    return statusTranslations[status]?.[i18n.language] || status;
  };

  return (
  <div
  className={`min-h-screen flex flex-col items-center justify-start p-4 md:p-8 dark:bg-gray-900 ${i18n.language === 'ar' ? 'rtl' : ''}`}
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
  <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">


<div className="mb-8">
  <button
    onClick={() => window.history.back()}
    className="inline-flex items-center px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 hover:text-green-600 dark:hover:text-green-400 font-medium"
  >
    <svg 
      className="w-5 h-5 mr-2" 
      fill="none" 
      stroke="currentColor" 
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M10 19l-7-7m0 0l7-7m-7 7h18" 
      />
    </svg>
    {t("back")}
  </button>
</div>

    <header className="mb-10 text-center">
      <h1 className="text-3xl md:text-4xl font-serif font-bold text-white dark:text-gray-100">
        {t("requestDetails")}
      </h1>
      <div className="mt-2 h-1 w-20 bg-green-600 mx-auto dark:bg-green-500"></div>
    </header>
    
    <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 hover:shadow-2xl dark:bg-gray-800 dark:shadow-gray-900">
      <div className="bg-gradient-to-r from-green-700 to-green-600 px-6 py-5 dark:from-green-800 dark:to-green-700">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">
            {t("requestInformation")}
          </h2>
          <span className="text-green-100 text-sm font-medium dark:text-green-200">
            {request?.createdAt && 
              `${t("submitted")}: ${new Date(request.createdAt).toLocaleDateString(i18n.language)}`
            }
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
        {/* Request Type */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {t("requestType")}
          </h3>
          <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {request?.requestType 
              ? t(`requestTypes.${request.requestType}`, request.requestType)
              : t('notAvailable')}
          </p>
        </div>
        
        {/* Status */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {t("status")}
          </h3>
          <div className="flex items-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              request?.status === 'Completed' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300' 
                : request?.status === 'Pending'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300'
                : request?.status === 'Rejected'
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300'
                : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
            }`}>
              {request?.status 
                ? t(`statuss.${request.status}`, request.status)
                : t('notAvailable')}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {t("description")}
          </h3>
          <p className="text-gray-800 dark:text-gray-200">
            {request?.description || t("noDescription")}
          </p>
        </div>
        
        {/* Attached Document */}
        {/* <div className="space-y-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {t("attachedDocument")}
          </h3>
          {request?.replyDocumentUrl ? (
            <a
              href={request.replyDocumentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-green-700 hover:text-green-600 hover:underline transition-colors dark:text-green-500 dark:hover:text-green-400"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              {t("viewDocument")}
            </a>
          ) : (
            <p className="text-gray-500 italic dark:text-gray-400">{t("noDocument")}</p>
          )}
        </div> */}
<div>
  <Label className="text-gray-600 dark:text-gray-300">{t("attachedDocument")}</Label>
  {request?.replydocumentUrlNew && request?.replydocumentUrlNew.length > 0 ? (
    <div className="space-y-2">
      {request.replydocumentUrlNew.map((url, index) => (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
        >
          <LinkIcon className="mr-2" size={16} /> {/* Changed from Link to LinkIcon */}
          {url.split("/").pop() || `Document ${index + 1}`}
        </a>
      ))}
    </div>
  ) : request?.replyDocumentUrl ? ( // Note: changed to replyDocumentUrl for the fallback
    <a
      href={request.replyDocumentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
    >
      <LinkIcon className="mr-2" size={16} />
      {request.replyDocumentUrl.split("/").pop()}
    </a>
  ) : (
    <p className="font-medium text-gray-500 dark:text-gray-400">{t('notAvailable')}</p>
  )}
</div>


        
        
        {/* Official Reply */}
        <div className="space-y-2 md:col-span-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider dark:text-gray-400">
            {t("officialReply")}
          </h3>
          <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 dark:bg-gray-700 dark:border-gray-600">
            {request?.reply ? (
              <p className="text-gray-800 whitespace-pre-wrap dark:text-gray-200">{request.reply}</p>
            ) : (
              <div className="text-center py-6">
                <svg className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-2 text-gray-500 dark:text-gray-400">{t("noResponse")}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-between items-center dark:bg-gray-700 dark:border-gray-600">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {t("requestID")}: <span className="font-mono font-medium dark:text-gray-300">{request?.id || t("notAvailable")}</span>
        </p>
        {request?.updatedAt && (
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("lastUpdated")}: {new Date(request.updatedAt).toLocaleString(i18n.language)}
          </p>
        )}
      </div>
    </div>
  </div>
</div>
  );
}
