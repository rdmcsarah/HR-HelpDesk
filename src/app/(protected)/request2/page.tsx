"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useParams } from "next/navigation";
import React, { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "@/i18n";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n";
import { set } from "date-fns";
import { useEmployee } from '@/context/EmployeeContext';
import { json } from "stream/consumers";
export default function Page() {
  type Employee = {
 name: string;
    employeeId: string;
    email: string;
    department: string;
    position: string;
    phone: string;
};


  const router = useRouter();
  const params = useParams();
  // const empcode = (params?.empcode as string)?.toUpperCase();
  const [titleError, setTitleError] = useState("");
const [empcode, setEmpcode] = useState<string | "">("");
const [authenticated, setIsAuthenticated] = useState(false);
// useEffect(() => {
//   const fetchAuth = async () => {
//     const res = await fetch("/api/auth", {
//       method: "GET",
//       credentials: "include"
//     });
//     const response = await res.json();
//     console.log("refeqfws", response.username);
//     setEmpcode(response.username);
//     setIsAuthenticated(true);
//   };
//   fetchAuth();
// }, []);
const { empdata } = useEmployee();

useEffect(() => {

  setEmpcode(empdata?.empcode || "");


  },[empdata]);


  type Request = {
    id: string;
    title: string;
    description: string;
    requestType: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
    closedAt: Date | null;
    assignedToId: number | null;
    empId: string | "";
    assignedTo: string | null;
  };



  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requestType: "",
    empId: empcode,
    status: "PENDING",
    documentUrl: null,
    project: "",
  });

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      empId: empcode,
    }));
  }, [empcode]);

  console.log(formData);
  const [mounted, setMounted] = useState(false);
  const { t, i18n } = useTranslation();

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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [uploadStatus, setUploadStatus] = useState<{
    success: boolean;
    message: string;
  } | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
const [empData, setEmpData] = useState<Employee[] | null>(null);

useEffect(() => {
  let isCancelled = false;

  const fetchRequestDetails = async () => {
    try {
      const empResponse = await fetch(`/api/emps?employeeId=${empcode}`);
      if (!empResponse.ok) {
        throw new Error(`Error ${empResponse.status}`);
      }
      const empdata = await empResponse.json();
      if (!isCancelled) setEmpData(empdata);
    } catch (err) {
      if (!isCancelled) {
        setError(err instanceof Error ? err.message : `Failed to load request`);
      }
    }
  };

  if (empcode) fetchRequestDetails();

  return () => {
    isCancelled = true; // cleanup on unmount or dependency change
  };
}, [empcode]);

   useEffect(() => {

    console.log("empData######################################", empData?.[0].phone);


    
    }, [empData]);

const [files, setFiles] = useState<File[]>([]);
  const [uploadedUrls, setUploadedUrls] = useState<string[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setIsUploading(true);
    setError(null);
    setUploadStatus(null);

    // Basic validation
    if (
      !formData.title.trim() ||
      // !formData.description.trim() ||
      !formData.requestType
    ) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      setIsUploading(false);
      return;
    }

    let uploadedFileUrl = null;

    // Handle file upload if a file is selected
    if (file) {
      const uploadData = new FormData();
      // If you need to change the file name, create a new File object (optional)
      const renamedFile = new File([file], `/${empcode}/${file.name}`, {
        type: file.type,
      });
      uploadData.append("file", renamedFile);

      try {
        const uploadResponse = await fetch(`/api/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadResult = await uploadResponse.json();

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

    // Merge uploaded file URL into formData
    const finalData = {
      ...formData,
      documentUrl: uploadedFileUrl,
    };

    try {
      const response = await fetch("/api/reqs2", {
        method: "POST",
       
        body: JSON.stringify(finalData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log("Error data:", errorData);
        throw new Error(errorData.error || "Failed to submit request");
      }

      const data = await response.json();
      setRequestId(data.id);
      console.log("Request submitted successfully:", data);
      const phoneNumber = "20"+empData?.[0].phone;
      console.log("Employee phone number#######################131#:", phoneNumber);
      console.log("Sending notification...");
      const notificationResponse = await fetch("/api/proxy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-With": "XMLHttpRequest",
        },
        body: JSON.stringify({
          phoneNumber: phoneNumber,
          text: `Your request (ID: ${data.id}) has been submitted successfully. You will be notified once processed.`,
        }),
      });

      // if (!notificationResponse.ok) {
      //   throw new Error(`Failed to send notification`);
      // }
      console.log("Notification sent successfully");
      router.push(`/${data.id}/done_request`);
    } catch (err) {
      console.error("Error submitting request:", err);
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
      setIsUploading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

  //   if (value.startsWith("http")) {
  //     window.open(value, "_blank");
  //   }
  //   setFormData((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

    if (value === "https://hrservices.mobilitycairo.com/selfservice/auth/login") {
    window.open(value, "_blank");
    
    // Reset the value so it's not selected
    setFormData((prev) => ({
      ...prev,
      [name]: "",
    }));
  } else {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }
};





 
  // const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   if (e.target.files?.[0]) {
  //     const selectedFile = e.target.files[0];
  //     setFile(selectedFile);

  //     // Set default name only if name field is empty
  //   }
  // };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {




    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      

      // List of allowed MIME types
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      ];

      // Maximum file size (5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB in bytes

      // Check if file type is allowed
      if (!allowedTypes.includes(selectedFile.type)) {
        setUploadStatus({
          success: false,
          message: t(
            "File type not allowed. Please upload PDF, Word, Excel, or image files only."
          ),
        });
        // Reset file input
        e.target.value = "";
        return;
      }

      // Check file size
      if (selectedFile.size > maxSize) {
        setUploadStatus({
          success: false,
          message: t("File size too large. Maximum allowed size is 5MB."),
        });
        // Reset file input
        e.target.value = "";
        return;
      }

      setFile(selectedFile);
    }
  };
   
  

  const handleRemoveFile = () => {
    setFile(null);
    // If you're using a ref for the file input, reset it:
    const fileInput = document.getElementById(
      "file"
    ) as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
    // Also clear any upload status if needed
    setUploadStatus(null);
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 md:p-8 lg:p-12 dark:bg-gray-900"
      style={{
        backgroundImage: "url('/assets/bg1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >

      {/* <pre>{JSON.stringify(empdata,null,2)}</pre> */}



      <div className="bg-white rounded-2xl bg-opacity-90 p-6 md:p-10 lg:p-12 w-full max-w-[1000px] my-8 shadow-xl dark:bg-gray-800 dark:bg-opacity-90">
        <form onSubmit={handleSubmit}>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center dark:text-white">
            {t("submitYourRequest")}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label
                htmlFor="title"
                className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
              >
                {t("requestTitle")}*
              </Label>
              {/* <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  const originalValue = e.target.value;
                  const filteredValue = originalValue.replace(
                    /[^a-zA-Z0-9 ]/g,
                    ""
                  );
                  if (originalValue !== filteredValue) {
                    setTitleError(t("noSpecialChars"));
                  } else {
                    setTitleError("");
                  }
                  setFormData((prev) => ({
                    ...prev,
                    title: filteredValue.slice(0, 30),
                  }));
                }}
                required
                className={`rounded-xl bg-white border ${
                  titleError ? "border-red-500" : "border-gray-300"
                } p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none w-full transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-900`}
                placeholder={t("titlePlaceholder")}
                maxLength={30}
              /> */}

              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={(e) => {
                  const originalValue = e.target.value;
                  const filteredValue = originalValue.replace(
                    /[^\u0621-\u064A\u0660-\u0669a-zA-Z0-9 ]/g, // allow Arabic letters, Arabic-Indic digits, Latin letters, digits, space
                    ""
                  );
                  if (originalValue !== filteredValue) {
                    setTitleError(t("noSpecialChars"));
                  } else {
                    setTitleError("");
                  }
                  setFormData((prev) => ({
                    ...prev,
                    title: filteredValue.slice(0, 30),
                  }));
                }}
                required
                className={`rounded-xl bg-white border ${
                  titleError ? "border-red-500" : "border-gray-300"
                } p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none w-full transition dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-900`}
                placeholder={t("titlePlaceholder")}
                maxLength={30}
              />

              <div className="flex justify-between mt-1">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {formData.title.length}/30 {t("characters")}
                </p>
                {titleError && (
                  <p className="text-sm text-red-600 dark:text-red-400">
                    {titleError}
                  </p>
                )}
              </div>
            </div>

            {/* Request Type */}
            <div className="md:col-span-2">
              <Label
                htmlFor="requestType"
                className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
              >
                {t("requestType")}*
              </Label>
              <select
                id="requestType"
                name="requestType"
                className="appearance-none rounded-xl border border-gray-300 p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none w-full transition bg-white pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-900"
                value={formData.requestType}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectRequestType")}</option>
             
                <option value="MEDICAL_INSURANCE">
                  {t("MEDICAL_INSURANCE")}
                </option>
                <option value="VACATION_REQUEST">
                  {t("VACATION_REQUEST")}
                </option>
                <option value="HR_LETTTER">{t("HR_LETTTER")}</option>
                <option value="Debit_Card">{t("Debit_Card")}</option>
                <option value="Payment_Slip">{t("Payment_Slip")}</option>
                <option value="Medical_Reimbursement">
                  {t("Medical_Reimbursement")}
                </option>
                <option value="Khazna_Tech">{t("Khazna_Tech")}</option>
                <option value="HumanPlus_Creation">
                  {t("HumanPlus_Creation")}
                </option>
                <option value="ONBOARDING_PROCESS">
                  {t("ONBOARDING_PROCESS")}
                </option>
                <option value="RESIGNATION_PROCESS">
                  {t("RESIGNATION_PROCESS")}
                </option>
                <option value="CONTRACTS">{t("CONTRACTS")}</option>
                <option value="SOCIAL_INSURANCE">
                  {t("SOCIAL_INSURANCE")}
                </option>
               
                <option value="LEAVE_REQUEST">{t("LEAVE_REQUEST")}</option>
                <option value="KELIO_PERMISSIONS">
                  {t("KELIO_PERMISSIONS")}
                </option>
                <option value="OTHER">{t("OTHER")}</option>
                <option value="https://hrservices.mobilitycairo.com/selfservice/auth/login">
                  {t("HPlus")}
                </option>
              </select>
            </div>

            {/* Project Type */}
            <div className="relative">
              <select
                id="project"
                name="project"
                className="appearance-none rounded-xl border border-gray-300 p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none w-full transition bg-white pr-10 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-900"
                value={formData.project}
                onChange={handleChange}
                required
              >
                <option value="">{t("selectProjectType")}</option>
                <option value="RDMC">{t("RDMC")}</option>
                <option value="L3">{t("L3")}</option>
                <option value="LRT">{t("LRT")}</option>
              </select>
            </div>

            {/* Description */}
  <div className="md:col-span-2">
  <Label
    htmlFor="description"
    className="block text-gray-700 font-medium mb-2 dark:text-gray-300"
  >
    {t("requestDescription")}{" "}
    <span className="text-gray-400 text-sm">({t("optional")})</span>
  </Label>

  <textarea
    id="description"
    name="description"
    className="rounded-xl border border-gray-300 p-3 focus:border-green-600 focus:ring-2 focus:ring-green-200 focus:outline-none w-full transition min-h-[120px] dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:border-green-500 dark:focus:ring-green-900"
    placeholder={t("descriptionPlaceholder")}
    rows={4}
    maxLength={500}
    value={formData.description}
    onChange={handleChange}
  />

  <div className="flex justify-between mt-1 text-sm">
    <span
      className={`${
        formData.description.length >= 500
          ? "text-red-600 dark:text-red-400 font-medium"
          : "text-gray-500 dark:text-gray-400"
      }`}
    >
      {formData.description.length >= 500
        ? t("maxLengthReached")
        : `${formData.description.length}/300`}
    </span>
  </div>
</div>



            {/* File Upload */}
            <div className="md:col-span-2">
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
            </div>


          </div>

          {error && (
            <div className="mt-6 p-3 bg-red-50 rounded-lg dark:bg-red-900 dark:bg-opacity-30">
              <p className="text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex justify-center mt-8">
            <Button
              type="submit"
              className="bg-green-600 hover:bg-green-700 py-3 px-8 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition duration-300 w-full sm:w-auto dark:bg-green-700 dark:hover:bg-green-600"
              disabled={isSubmitting || isUploading}
            >
              {isSubmitting || isUploading ? (
                <span className="flex items-center justify-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  {t("processing")}
                </span>
              ) : (
                t("submitRequest")
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
