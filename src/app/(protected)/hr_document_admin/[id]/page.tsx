"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Link } from "lucide-react";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { useEmployee } from "@/context/EmployeeContext";
type Request = {
  id: string;
  employeeId: string;
  empId: string;
  status: string;
  reply: string;
  requestType: string;
  description?: string;
  emp?: {
    name: string;
    employeeId: string;
    email: string;
    department: string;
    position: string;
    phone: string;
  };
  documentUrl: string;
  replyDocumentUrl: string;
  documentUrlNew:string[];
};


type Employee = {
 name: string;
    employeeId: string;
    email: string;
    department: string;
    position: string;
    phone: string;
};

type RequestHistory = {
  id: string;
  requestId: string;
  assignedto: string;
  assignedBy: string; 
}


 
export default function RequestDetailsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(10);
  const [empcode, setEmpcode] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

  const [formData, setFormData] = useState<Partial<Request>>({
    status: "PENDING",
    reply: "",
  });
  const [currentRequest, setCurrentRequest] = useState<Request | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitmsg, setSubmitMsg] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [requestHistory, setRequestHistory] = useState<RequestHistory | null>(null);

  // Fetch authentication data
  // useEffect(() => {
  //   const fetchAuth = async () => {
  //     const res = await fetch("/api/auth", {
  //       method: "GET",
  //       credentials: "include"
  //     });
  //     const response = await res.json();
  //     console.log("refeqfws", response.username);
  //     setEmpcode(response.username);
  //   };
  //   fetchAuth();
  // }, []);
const { empdata } = useEmployee();

useEffect(() => {

  setEmpcode(empdata?.empcode || "");


  },[empdata]);

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

  // Fetch request details
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        setLoading(true);
        setProgress(30);
        
        const empResponse = await fetch(`/api/emps?employeeId=${empcode}`);
        const empdata = await empResponse.json();

        const req_hist_response = await fetch(`/api/req_history?id=${id}`); 
        const req_hist_data = await req_hist_response.json();
        if (!req_hist_response.ok) throw new Error("Failed to fetch request history");
        setRequestHistory(req_hist_data);
        console.log("request history", req_hist_data);

        setEmployee(empdata[0]);
        const response = await fetch(`/api/reqs?id=${id}`);
        if (!response.ok) throw new Error("Failed to fetch request details");
        setProgress(70);
        const data = await response.json();
        
        if (Array.isArray(data) && data.length > 0) {
          setCurrentRequest(data[0]);
          setFormData({
            status: data[0].status || "PENDING",
            reply: data[0].reply || "",
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load request"
        );
      } finally {
        setProgress(100);
        setLoading(false);
      }
    };

    if (id && empcode) fetchRequestDetails();
  }, [id, empcode]);

  //UPDATEEEEE
const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);
  const [isUploadingg, setIsUploadingg] = useState(false);

  const handleFileChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    }
  };

  const handleRemoveFile2 = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

    //UPDATEEEEE

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);
    setError(null);
    setUploadStatus(null);
    setSubmitSuccess(false);
    setSubmitMsg(false);

    // let uploadedFileUrl = fileUrl;

    // // Handle file upload if a new file is selected
    // if (file) {
    //   const uploadData = new FormData();
    //   const renamedFile = new File([file], `/admin/${empcode}/${currentRequest?.emp?.employeeId}/${file.name}`, {
    //     type: file.type,
    //   });
    //   uploadData.append("file", renamedFile);

    //   try {
    //     const uploadResponse = await fetch(`/api/upload`, {
    //       method: 'POST',
    //       body: uploadData,
    //     });

    //     const uploadResult = await uploadResponse.json();

    //     if (!uploadResponse.ok) {
    //       throw new Error(uploadResult.message || 'File upload failed');
    //     }

    //     uploadedFileUrl = uploadResult;
    //     setFileUrl(uploadedFileUrl);
    //     setUploadStatus({
    //       success: true,
    //       message: 'File uploaded successfully!',
    //     });
    //     setFile(null);
    //   } catch (uploadError) {
    //     console.error('Upload error:', uploadError);
    //     setUploadStatus({
    //       success: false,
    //       message: uploadError instanceof Error ? uploadError.message : 'File upload failed',
    //     });
    //     setIsSubmitting(false);
    //     setIsUploading(false);
    //     return;
    //   }
    // }



  

    let uploadedFileUrl = null;
    const urls: string[] = [];
      for (const file of files) {
        const formData = new FormData();
        const renamedFile = new File([file], `/${empcode}/${file.name}`, {
          type: file.type,
        });
        formData.append("file", renamedFile);

        const res = await fetch(`/api/upload`, {
          method: "POST",
          body: formData,
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || t("Fileuploadfailed"));
        }

        urls.push(result); // Make sure API returns the uploaded URL string
      }

      setUploadedUrls(urls);
      setUploadStatus({ success: true, message: t("Filesuploadedsuccessfully") });
    // Handle file upload if a file is selected
    if (file) {
      const uploadData = new FormData();
      // If you need to change the file name, create a new File object (optional)
      const renamedFile = new File([file], `/${empcode}/${file.name}`, {
        type: file.type,
      });
      uploadData.append("file", renamedFile);

      try {
        ///////////////HEREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
        const uploadResponse = await fetch(`/api/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();
console.log("hhhhhhhhhhhh#########################",uploadResult)
        if (!uploadResponse.ok) {
          // throw new Error(uploadResult.message || "File upload failed");
          throw new Error(uploadResult.message || t("Fileuploadfailed"));
        }

        uploadedFileUrl = uploadResult;
        setFileUrl(uploadedFileUrl);
        setUploadStatus({
          success: true,
          message: t("Fileuploadedsuccessfully"),
        });
        setFile(null);
      } catch (uploadError) {
        console.error("Upload error:", uploadError);
        setUploadStatus({
          success: false,
          message:
            uploadError instanceof Error
              ? uploadError.message
              : "File upload failed",
        });
        setIsSubmitting(false);
        setIsUploading(false);
        return;
      }

      
    }











    try {
      // Update the request
      const updateResponse = await fetch(
        `/api/reqs2?id=${id}&currEmpId=${empcode}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            replyDocumentUrl: uploadedFileUrl,
            replydocumentUrlNew:urls
          }),
        }
      );

      if (!updateResponse.ok) {
        throw new Error(`Failed to update request ${empcode}`);
      }



      setSubmitSuccess(true);

      // Send notifications if status is being updated
      if (formData.status) {
        try {
          console.log("Sending notification...");
          setSubmitMsg(true);

   

const emailHtml = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333; line-height: 1.6;">
    <p>Dear <strong>${currentRequest?.emp?.name}</strong>,</p>

    <p>
      We would like to inform you that the status of your request 
      <strong>(Request Code: ${id})</strong> has been updated to: 
      <span style="color: #1a73e8; font-weight: bold;">${formData.status}</span>.
    </p>

    <p>
      You can view the updated request details by clicking the link below:
    </p>

    <p>
      <a 
        href="https://hr-helpdesk-final-tryon.vercel.app/hr_document/${id}" 
        target="_blank" 
        style="color: #ffffff; background-color: #1a73e8; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;"
      >
        View Request
      </a>
    </p>

    <p>
      If you have any questions, feel free to reach out to the HR Helpdesk team.
    </p>

    <p>Thank you,<br/>HR Helpdesk System</p>
  </div>
`;

          // Send email notification
          const emailResponse = await fetch(
            `/api/mails?employeeId=${currentRequest?.emp?.employeeId}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ html: emailHtml }),
            }
          );

          if (!emailResponse.ok) {
            const errorData = await emailResponse.json().catch(() => ({}));
            console.error("Email failed:", errorData.message || emailResponse.statusText);
            throw new Error(errorData.message || `Failed to send email: ${emailResponse.statusText}`);
          }

          const responseData = await emailResponse.json();
          console.log("Email sent successfully:", responseData);
        } catch (error) {
          console.error("Notification/Email error:", error);
        }
      }



              const phoneNumber = "20"+currentRequest?.emp?.phone;
              console.log(currentRequest?.emp)
              console.log("currentRequest?.emp?.namecurrentRequest?.emp?.namecurrentRequest?.emp?.name___________",phoneNumber)

  const notificationResponse = await fetch("/api/proxy", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: JSON.stringify({
      phoneNumber: phoneNumber,
      text: `Hi ${currentRequest?.emp?.name}, your request with Code ${id} has been updated to ${formData.status}.`,
    }),
  });

  // if (!notificationResponse.ok) {
  //   const errorData = await notificationResponse.json().catch(() => ({}));
  //   console.error("Notification failed:", errorData.message || notificationResponse.statusText);
  //   throw new Error(errorData.message || "Failed to send notification");
  // }
  console.log("Notification sent successfully");

      // Redirect after successful submission
      setTimeout(() => router.push(`/${id}/done_request`), 1500);
    } catch (err) {
      console.error("Error updating request: ", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    const fileInput = document.getElementById("file") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
    setUploadStatus(null);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 ${i18n.language === 'ar' ? 'rtl' : ''}`}>
        <div className="w-full max-w-md px-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300 ease-out dark:bg-green-500"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {Math.round(progress)}% {t("loading")}
          </p>
        </div>
      </div>
    );
  }
  return (
<div
  className="min-h-screen flex items-center justify-center p-4 md:p-8 dark:bg-gray-900"
  style={{
    backgroundImage: "url('/assets/bg1.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",
  }}
>
  <div className="bg-white rounded-2xl opacity-90 p-6 md:p-10 m-3 w-full max-w-4xl shadow-xl dark:bg-gray-800 dark:bg-opacity-90">
    <h1 className="text-3xl font-serif text-center text-gray-800 font-bold mb-8 dark:text-white">
      {t("requestDetails")}
    </h1>

    {/* Request Information Section */}
    <div className="bg-gray-50 rounded-xl p-6 mb-8 border border-gray-200 dark:bg-gray-700 dark:bg-opacity-50 dark:border-gray-600">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-200">
        {t("requestSummary")}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Requester Name */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("requesterName")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.emp?.name || t('notAvailable')}
          </p>
        </div>
        
        {/* Department */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("requesterDepartment")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.emp?.department 
              ? t(`departments.${currentRequest.emp.department}`, currentRequest.emp.department)
              : t('notAvailable')}
          </p>
        </div>
        
        {/* Employee ID */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("requesterId")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.emp?.employeeId || t('notAvailable')}
          </p>
        </div>
        
        {/* Position */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("requesterPosition")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.emp?.position 
              ? t(`positions.${currentRequest.emp.position}`, currentRequest.emp.position)
              : t('notAvailable')}
          </p>
        </div>
        
        {/* Request Type */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("requestType")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.requestType 
              ? t(`requestTypes.${currentRequest.requestType}`, currentRequest.requestType)
              : t('notAvailable')}
          </p>
        </div>
        
        {/* Status */}
        <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("currentStatus")}</Label>
          <p className="font-medium dark:text-gray-100">
            {currentRequest?.status 
              ? t(`statuss.${currentRequest.status}`, currentRequest.status)
              : t('notAvailable')}
          </p>
        </div>
        
        {/* Attached Document */}
        {/* <div>
          <Label className="text-gray-600 dark:text-gray-300">{t("attachedDocument")}</Label>
          {currentRequest?.documentUrl ? (
            <a
              href={currentRequest.documentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
            >
              <Link className="mr-2" size={16} />
              {currentRequest.documentUrl.split("/").pop()}
            </a>
          ) : (
            <p className="font-medium text-gray-500 dark:text-gray-400">{t('notAvailable')}</p>
          )}
        </div> */}
<div>
  <Label className="text-gray-600 dark:text-gray-300">{t("attachedDocument")}</Label>
  {currentRequest?.documentUrlNew && currentRequest.documentUrlNew.length > 0 ? (
    <div className="space-y-2">
      {currentRequest.documentUrlNew.map((url, index) => (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
        >
          <Link className="mr-2" size={16} />
          {url.split("/").pop() || `Document ${index + 1}`}
        </a>
      ))}
    </div>
  ) : currentRequest?.documentUrl ? ( // Fallback to check the old documentUrl if needed
    <a
      href={currentRequest.documentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center text-blue-500 hover:underline dark:text-blue-400"
    >
      <Link className="mr-2" size={16} />
      {currentRequest.documentUrl.split("/").pop()}
    </a>
  ) : (
    <p className="font-medium text-gray-500 dark:text-gray-400">{t('notAvailable')}</p>
  )}
</div>

        
        {/* Description */}
        {currentRequest?.description && (
          <div className="md:col-span-2">
            <Label className="text-gray-600 dark:text-gray-300">{t("description")}</Label>
            <p className="font-medium dark:text-gray-100">{currentRequest.description}</p>
          </div>
        )}
      </div>
    </div>

    {/* Update Form Section */}
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="relative w-full">
          <label htmlFor="status" className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
            {t("updateStatus")}
          </label>
          <div className="relative">
            <select
              id="status"
              name="status"
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 pr-10 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:ring-green-500 dark:focus:border-green-500"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="PENDING">{t("pending")}</option>
              <option value="COMPLETED">{t("completed")}</option>
              <option value="REJECTED">{t("rejected")}</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 dark:text-gray-400">
              <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M7 7l3-3 3 3m0 6l-3 3-3-3" />
              </svg>
            </div>
          </div>
        </div>

        <div>
          <Label htmlFor="reply" className="text-gray-700 dark:text-gray-300">
            {t("adminReply")}
          </Label>
          <textarea
            id="reply"
            name="reply"
            className="w-full rounded-xl border border-gray-300 p-3 focus:border-green-700 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:focus:border-green-500"
            placeholder={t("enterReply")}
            rows={4}
            value={formData.reply || ""}
            onChange={handleChange}
            required
          />
        </div>

        {/* <div className="col-span-2 space-y-2">
          <Label htmlFor="file" className="dark:text-gray-300">{t("selectFile")}</Label>
          <Input
            id="file"
            type="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            className="dark:border-gray-600 dark:text-gray-100 dark:file:bg-gray-600 dark:file:text-gray-100"
          />
          {uploadStatus && (
            <p
              className={`text-sm ${
                uploadStatus.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {uploadStatus.message}
            </p>
          )}
        </div> */}



             {/* <div className="md:col-span-2">
                        <Label
                          htmlFor="file"
                          className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
                        >
                          {t("attachments")}
                        </Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="file"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
                            className="bg-white flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-gray-600 dark:file:text-white"
                          />
                          {file && (
                            <button
                              type="button"
                              onClick={handleRemoveFile}
                              className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              title={t("removeFile")}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            </button>
                          )}
                        </div>
                        {uploadStatus && (
                          <p
                            className={`text-sm mt-2 ${
                              uploadStatus.success
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {uploadStatus.message}
                          </p>
                        )}
                      </div> */}



  <div className="md:col-span-2">
      <Label htmlFor="file" className="block text-gray-700 font-medium mb-2 dark:text-gray-300">
        {t("attachments")}
      </Label>

      <div className="flex items-center gap-2">
        <Input
          id="file"
          type="file"
          onChange={handleFileChange2}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xls,.xlsx"
          className="bg-white flex-1 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:file:bg-gray-600 dark:file:text-white"
          multiple
          disabled={isUploading}
        />
        {/* <button
          type="button"
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700"
          disabled={isUploading || files.length === 0}
        >
          {isUploading ? t("Uploading...") : t("Upload Files")}
        </button> */}
      </div>

      {/* File list */}
      {files.length > 0 && (
        <div className="mt-2 space-y-2">
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-2 rounded"
            >
              <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[75%]">
                {file.name}
              </span>
              <button
                type="button"
                onClick={() => handleRemoveFile2(index)}
                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                title={t("removeFile")}
                disabled={isUploading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload status message */}
      {uploadStatus && (
        <p
          className={`text-sm mt-2 ${
            uploadStatus.success ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
          }`}
        >
          {uploadStatus.message}
        </p>
      )}
    </div>

        
      </div>

      {error && (
        <div className="p-3 bg-red-50 text-red-600 rounded-lg dark:bg-red-900 dark:bg-opacity-30 dark:text-red-300">
          {error}
        </div>
      )}

      {submitSuccess && (
        <div className="p-3 bg-green-50 text-green-600 rounded-lg dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300">
          {t("requestUpdated")}
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          className="py-3 px-6 rounded-xl dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={() => router.back()}
        >
          {t("cancel")}
        </Button>

        {employee?.employeeId === requestHistory?.assignedto && (
          <Button
            type="submit"
            className="bg-green-700 hover:bg-green-600 py-3 px-6 rounded-xl text-white dark:bg-green-600 dark:hover:bg-green-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? t("updating") : t("updateRequest")}
          </Button>
        )}
      </div>
    </form>
  </div>
</div>
  );
}
