"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  Column,
} from "@tanstack/react-table";

import { Calendar } from "@/components/ui/calendar";
import { Calendar02 } from "@/components/calender";
import { useRouter, useSearchParams } from "next/navigation";

import { ArrowUpDown, CheckIcon, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
// If you have a DatePicker component, import it here. Example using react-datepicker:
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
import { CellContext } from "@tanstack/react-table";
import { useState, useEffect } from "react";
import { exportToExcel } from "@/lib/utils";
import { IconDownload, IconSearch } from "@tabler/icons-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@radix-ui/react-dropdown-menu";
import i18n from "@/i18n";
import { t } from "i18next";
import { DateRange } from "react-day-picker";

// For your specific data type
type RequestCellContext = CellContext<RequestWithAdmins, unknown>;
type Admin = {
  id: number;
  name: string;
  email: string;
  department: string;
  employeeId: string;
  empType: string;
  typeOfWork: string[];
};

type Request = {
  emp: Admin;
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  closedAt: Date | null;
  assignedToId: number | null;
  userId: string;
  assignedTo: string;
  reply: string;
  department: string;
  employeeId: string;
  empType: string;
  project: string;
  // assignedId: string | null;
  counter: number;
  assignedAt: Date | null;
  requestHistory: {
    assignedby: string;
    assignedto: string;
    time: Date;
  }[];
};
// type RequestHistory = {
//   assignedby: string;
//   assignedto: string;
// };
type RequestWithAdmins = Request & {
  admins?: Admin[];
};

interface DataTableProps {
  filter: string;
  data: Request[];
  inputTitles: string[];
  admins: Admin[];
  empcode: string;
  emp: Admin;
}

function AssignedToCell({
  row,
  employees,
  isLoadingEmployees,
  empcode,
}: {
  row: RequestCellContext["row"];
  employees: Admin[];
  isLoadingEmployees: boolean;
  empcode: string;
}) {
  // console.log("Selected fff ID:", row.original?.requestHistory?.assignedto);

  const [currentEmployeeId, setCurrentEmployeeId] = useState(
    Array.isArray(row.original?.requestHistory) &&
      row.original.requestHistory.length > 0
      ? row.original.requestHistory[row.original.requestHistory.length - 1]
          ?.assignedto || ""
      : ""
    // row.original?.assignedId || ""
  );

  // console.log("HEREEEEEEEEE",row.original)
  // for(const employee of employees) {

  //   console.log("TYPEOFWORK: ", employee.typeOfWork);
  // }

  const newEmployees = employees.filter((employee) => {
    let match;
    if (employee.empType === "SUPER_ADMIN" && empcode === employee.employeeId) {
      match = true;
    } else {
      // match = employee.typeOfWork=== row.original.requestType;

      match = employee.typeOfWork.includes(row.original.requestType);
    }

    if (match) {
      console.log("####################");
      console.log(
        "emp:",
        employee.typeOfWork,
        "requestType:",
        row.original.requestType
      );
      console.log("####################");
    }

    return match; // Only employees where this is `true` will be included
  });

  console.log("MATCHED", newEmployees); // This will log the filtered array

  const handleEmpChange = async (employeeId: string) => {
    const previous = currentEmployeeId;
    setCurrentEmployeeId(employeeId);

    console.log("row:", row.original);
    console.log("Selected Employee ID:", currentEmployeeId);

    try {
      const employee = employees.find((e) => e.employeeId === employeeId);
      if (!employee) throw new Error("Employee not found");

      const newCounter = (row.original.counter || 0) + 1;
      // First update the request assignment
      // const res = await fetch(
      //   `/api/reqs?id=${row.original.id}`,
      //   {
      //     method: "PUT",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({
      //       assignedId: employee.employeeId,
      //       adminId: empcode,
      //       counter: newCounter,
      //       assignedAt: new Date(),
      //     }),
      //   }
      // );
      const res = await fetch(`/api/reqs2?id=${row.original.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          assignedby: empcode,
          assignedto: employeeId,

          counter: newCounter,
          assignedAt: new Date(),
        }),
      });

      if (!res.ok) throw new Error(await res.text());

      // Only proceed with email if assignment was successful
//       const emailHtml = `
//   <div style="font-family: 'Arial', sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 8px rgba(0,0,0,0.05);">
//     <!-- Header -->
//     <div style="background: #2563eb; color: white; padding: 25px; text-align: center;">
//       <h1 style="margin: 0; font-size: 22px; font-weight: 600;">📋 New HR Request Assignment</h1>
//     </div>
    
//     <!-- Body Content -->
//     <div style="padding: 30px; color: #333; line-height: 1.6;">
//       <p style="font-size: 16px; margin-bottom: 20px;">Dear ${
//         employee.name || "Team Member"
//       },</p>
//       <p style="font-size: 16px;">A new HR request has been assigned to you. Please review the details below:</p>
      
//       <!-- Request Details Card -->
//       <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 20px; margin: 25px 0;">
//         <table style="width: 100%; border-collapse: collapse;">
//           <tr>
//             <td style="padding: 8px 0; width: 30%; font-weight: 600; color: #475569;">Request ID:</td>
//             <td style="padding: 8px 0;">${row.original.id}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 0; font-weight: 600; color: #475569;">Request Type:</td>
//             <td style="padding: 8px 0;">${row.original.requestType}</td>
//           </tr>
//           <tr>
//             <td style="padding: 8px 0; font-weight: 600; color: #475569;">Date Submitted:</td>
//             <td style="padding: 8px 0;">${new Date().toLocaleDateString(
//               "en-US",
//               {
//                 weekday: "long",
//                 year: "numeric",
//                 month: "long",
//                 day: "numeric",
//               }
//             )}</td>
//           </tr>
//         </table>
//       </div>
      
//       <!-- Action Button -->
//       <div style="text-align: center; margin: 30px 0;">
//         <a href="https://hr-helpdesk-final-tryon.vercel.app/hr_document_admin/${
//           row.original.id
//         }" 
//            style="display: inline-block; background: #2563eb; color: white; padding: 14px 28px; 
//                   text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 15px;
//                   box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); transition: background 0.3s;">
//            Access Request in HR Help Desk
//         </a>
//       </div>
      
//       <!-- Footer Note -->
//       <div style="border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 20px;">
//         <p style="font-size: 14px; color: #64748b; line-height: 1.5;">
//           <strong>Note:</strong> This is an automated notification. Please do not reply to this email.<br>
//           For any questions, contact the HR Help Desk at <a href="mailto:hrhelp@company.com" style="color: #2563eb;">hrhelp@company.com</a>.
//         </p>
//       </div>
//     </div>
    
//     <!-- Company Footer -->
//     <div style="background: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b;">
//       © ${new Date().getFullYear()} Company Name. All rights reserved.
//     </div>
//   </div>
// `;

const emailHtml = `
  <div style="font-family: Arial, sans-serif; font-size: 14px; color: #333;">
    <p>Dear ${employee.name},</p>
    
    <p>You have a new task assigned to you. Please click the link below to view the details:</p>
    
    <p>
      <a 
        href="https://hr-helpdesk.vercel.app/hr_document_admin/${row.original.id}" 
        style="color: #1a73e8; text-decoration: none;"
        target="_blank"
      >
        View Task Details
      </a>
    </p>

    <p>Thank you,<br/>HR Helpdesk System</p>
  </div>
`;

      // Send email notification
      // const emailResponse = await fetch(
      //   `/api/mails?employeeId=${employee.employeeId}`,
      //   {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ html: emailHtml }),
      //     // body: JSON.stringify({
      //     //   html: emailHtml,
      //     // }),
      //   }
      // );

      // if (!emailResponse.ok) {
      //   const errorText = await emailResponse.text();
      //   console.error("Email error:", errorText);
      //   throw new Error(`Failed to send email: ${errorText}`);
      // }
      // console.log(emailResponse);




//EMAILLLLLLLLLLLLLLLLLLLLLLLLLL
 // Send email notification
          const emailResponse = await fetch(
            `/api/mails?employeeId=${employee.employeeId}`,
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



          //ENDEMAILLLLLLLLLLLLLLLLLLLLLLLLLL

      // Update the counter in the row data
      


  
      row.original.counter = newCounter;
      toast.success("Request assigned and notification sent successfully!");
      // console.log("Email sent successfully!");



    } catch (e) {
      setCurrentEmployeeId(previous);
      console.error("Assignment error:", e);
      toast.error(
        e instanceof Error ? e.message : "Failed to update assignment"
      );
    }
  };

  if (isLoadingEmployees) {
    return <Skeleton className="h-6 w-full" />;
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentEmployeeId}
        onChange={(e) => handleEmpChange(e.target.value)}
        className="w-[150px] bg-white border border-gray-300 rounded-md px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300 dark:focus:ring-blue-600 dark:focus:border-blue-600"
      >
        <option value="" className="dark:bg-gray-800 dark:text-gray-300">
          {t("Unassigned")}
        </option>

        {newEmployees.map((emp) => (
          <option
            key={emp.employeeId}
            value={emp.employeeId}
            className="dark:bg-gray-800 dark:text-gray-300"
          >
            {/* {emp.name} */}
            {emp.name.trim().split(/\s+/).slice(0, 2).join(" ")}
          </option>
        ))}
      </select>
    </div>
  );
}
const createColumns = (
  employees: Admin[],
  isLoadingEmployees: boolean,
  emp: Admin,
  empcode: string,
  mounted: boolean,
  t: (key: string) => string
): ColumnDef<RequestWithAdmins>[] => [
  {
    accessorKey: "Request",
    header: () => (
      <div className="px-4 py-2 text-center">
        {mounted ? (
          <>{t("request")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const index = row.index + 1;
      const localizedIndex =
        i18n.language === "ar" ? index.toLocaleString("ar-EG") : index;

      return (
        <div className="px-2 py-3 text-center capitalize">{localizedIndex}</div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: () => (
      <div className="px-4 py-2 text-center">
        {mounted ? <>{t("ID")}</> : <span className="opacity-50">&nbsp;</span>}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.id}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "requestType",
    header: ({ column }) => (
      <Button
        variant="ghost"
        className="px-4 py-2 w-full justify-center font-semibold"
        onClick={() => {
          const isSorted = column.getIsSorted();
          if (!isSorted) {
            column.toggleSorting(false); // sort asc
          } else if (isSorted === "asc") {
            column.toggleSorting(true); // sort desc
          } else {
            column.clearSorting(); // reset sort
          }
        }}
      >
        {mounted ? (
          <>{t("RequestType")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}{" "}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center lowercase">
        {mounted ? t(row.original.requestType) : row.original.requestType}
      </div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "project",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("project")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">
        {mounted ? t(row.original.project) : row.original.project}
      </div>
    ),
    enableHiding: true,
  },
  ...(emp?.empType === "SUPER_ADMIN" || emp?.empType === "MANAGER"
    ? [
        {
          accessorKey: "assignedTo",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("assignedTo")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <AssignedToCell
                row={row}
                employees={employees}
                isLoadingEmployees={isLoadingEmployees}
                empcode={empcode}
              />
            </div>
          ),
          enableHiding: true,
        },
        {
          accessorKey: "Reassigned",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("reAssign")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => {
            const reassignCount = row.original.counter || 0;
            return (
              <div
                className={`px-4 py-2 text-center font-medium ${
                  reassignCount > 1 ? "text-orange-500" : ""
                }`}
              >
                {reassignCount > 1 ? t("reAssign") : "--------------"}
              </div>
            );
          },
          filterFn: (
            row: { original: { counter: any } },
            columnId: any,
            filterValue: boolean
          ) => {
            if (filterValue === true) {
              return (row.original.counter || 0) > 1;
            }
            if (filterValue === false) {
              return (row.original.counter || 0) <= 1;
            }
            return true; // show all when no filter is set
          },
          enableHiding: true,
        },
      ]
    : []),
  {
    accessorKey: "employeeName",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("requestby")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.emp?.name}</div>
    ),
    enableHiding: true,
  },
    {
    accessorKey: "empId",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("EmployeeId")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2 text-center">{row.original.emp?.employeeId}</div>
    ),
    enableHiding: true,
  },
  {
    accessorKey: "createdOn",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted && typeof t === "function" && t("createdOn") !== "createdOn"
          ? t("createdOn")
          : "Created On"}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.createdAt;
      if (!raw)
        return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      const localizedDate = date.toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : i18n.language
      );

      return (
        <div className="px-2 py-3 text-center">
          {mounted ? localizedDate : date.toLocaleDateString()}
        </div>
      );
    },
    enableHiding: true,
  },
  {
    accessorKey: "Assigned_On",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("Assigned_On")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.assignedAt;
      if (!raw)
        return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      const localizedDate = date.toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : i18n.language
      );

      return (
        <div className="px-2 py-3 text-center">
          {mounted ? localizedDate : date.toLocaleDateString()}
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("status")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const status = row.original.status;
      let colorClass = "";

      switch (status) {
        case "COMPLETED":
          colorClass = "text-green-600";
          break;
        case "PENDING":
          colorClass = "text-yellow-500";
          break;
        case "REJECTED":
          colorClass = "text-red-700";
          break;
        default:
          colorClass = "text-gray-500";
      }

      return (
        <div className={`px-2 py-3 text-center font-medium ${colorClass}`}>
          {mounted ? t(row.original.status) : row.original.status}
        </div>
      );
    },
    enableHiding: true,
  },

  // {
  //   accessorKey: "pendingTime",
  //   header: () => (
  //     <div className="px-4 py-2 text-center font-semibold">
  //       {mounted && typeof t === "function" && t("pendingTime") !== "pendingTime"
  //         ? t("pendingTime")
  //         : "Pending Time"}
  //     </div>
  //   ),
  // cell: ({ row }) => {
  //     const createdAt = row.original?.createdAt;
  //     const closedAt = row.original?.closedAt;

  //     if (!createdAt) {
  //       return <div className="px-2 py-3 text-center">------------</div>;
  //     }

  //     const createdDate = createdAt instanceof Date ? createdAt : new Date(createdAt);
  //     const currentDate = new Date();

  //     // Calculate the difference in days
  //     let diffDays = 0;

  //     if (closedAt) {
  //       const closedDate = closedAt instanceof Date ? closedAt : new Date(closedAt);
  //       diffDays = Math.floor((closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  //     } else {
  //       diffDays = Math.floor((currentDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24));
  //     }

  //     // Apply red color if pending for more than 5 days
  //     const textColorClass = !closedAt && diffDays > 5 ? "text-red-500 font-semibold" : "";

  //     return (
  //       <div className={`px-2 py-3 text-center ${textColorClass}`}>
  //         {mounted ? (
  //           <>
  //             {diffDays} {/* Just the number */}
  //             {" "} {/* Space */}
  //             {t(diffDays === 1 ? 'day' : 'days')} {/* Translated day/days */}
  //           </>
  //         ) : (
  //           diffDays
  //         )}
  //       </div>
  //     );
  //   },

  //   enableHiding: true,
  // },
  {
    accessorKey: "closureTime",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted &&
        typeof t === "function" &&
        t("closureTime") !== "closureTime"
          ? t("closureTime")
          : "closureTime"}
      </div>
    ),
    cell: ({ row }) => {
      const createdAt = row.original?.createdAt;
      const closedAt = row.original?.closedAt;

      if (!createdAt) {
        return <div className="px-2 py-3 text-center">------------</div>;
      }

      const createdDate =
        createdAt instanceof Date ? createdAt : new Date(createdAt);
      const currentDate = new Date();

      // Calculate the difference in days
      let diffDays = 0;

      if (closedAt) {
        const closedDate =
          closedAt instanceof Date ? closedAt : new Date(closedAt);
        diffDays = Math.floor(
          (closedDate.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
        );
      } else {
        diffDays = Math.floor(
          (currentDate.getTime() - createdDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );
      }

      // Apply red color if pending for more than 5 days
      const textColorClass =
        !closedAt && diffDays > 5 ? "text-red-500 font-semibold" : "";

      // Function to convert numbers to Arabic numerals if needed
      const formatNumber = (num: number) => {
        if (!mounted) return num;

        // Get current language from i18n
        const currentLang = i18n.language;

        // For Arabic, convert to Eastern Arabic numerals
        if (currentLang === "ar") {
          const arabicNumerals = [
            "٠",
            "١",
            "٢",
            "٣",
            "٤",
            "٥",
            "٦",
            "٧",
            "٨",
            "٩",
          ];
          return num
            .toString()
            .replace(/[0-9]/g, (d) => arabicNumerals[parseInt(d)]);
        }

        // For French, use comma as decimal separator (though we're dealing with integers)
        if (currentLang === "fr") {
          return num.toLocaleString("fr-FR");
        }

        // Default (English)
        return num.toLocaleString("en-US");
      };

      return (
        <div
          className={`px-2 py-3 text-center ${textColorClass}`}
          dir={i18n.language === "ar" ? "rtl" : "ltr"}
        >
          {mounted ? (
            <>
              {formatNumber(diffDays)} {/* Formatted number based on locale */}
              {/* {" "}{"("}
            {t("days")}{")"} */}
              {/* {t('day', { count: diffDays })} */}
            </>
          ) : (
            diffDays
          )}
        </div>
      );
    },
    enableHiding: true,
  },

  {
    accessorKey: "Closed On",
    header: () => (
      <div className="px-4 py-2 text-center font-semibold">
        {mounted ? (
          <>{t("closedon")}</>
        ) : (
          <span className="opacity-50">&nbsp;</span>
        )}
      </div>
    ),
    cell: ({ row }) => {
      const raw = row.original?.closedAt;
      if (!raw)
        return <div className="px-2 py-3 text-center">------------</div>;

      const date = raw instanceof Date ? raw : new Date(raw);
      const localizedDate = date.toLocaleDateString(
        i18n.language === "ar" ? "ar-EG" : i18n.language
      );

      return (
        <div className="px-2 py-3 text-center">
          {mounted ? localizedDate : date.toLocaleDateString()}
        </div>
      );
    },
  },
  ...(emp?.empType === "ADMIN"
    ? [
        {
          accessorKey: "userId",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("action")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <Link
                href={`/hr_document_admin/${row.original.id}`}
                className="inline-block bg-green-700 hover:bg-green-600 py-2 px-8 text-white rounded text-center"
              >
                {mounted ? (
                  <>{t("action")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
              </Link>
            </div>
          ),
          enableHiding: true,
        },
      ]
    : []),
  ...(emp?.empType === "SUPER_ADMIN" || emp?.empType === "MANAGER"
    ? [
        {
          accessorKey: "View",
          header: () => (
            <div className="px-4 py-2 text-center font-semibold">
              {mounted ? (
                <>{t("view")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </div>
          ),
          cell: ({ row }: RequestCellContext) => (
            <div className="px-4 py-2 text-center">
              <Link
                href={`/hr_document_admin/${row.original.id}`}
                className="inline-block bg-green-700 hover:bg-green-600 py-2 px-8 text-white rounded text-center"
              >
                {mounted ? (
                  <>{t("view")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
              </Link>
            </div>
          ),
          enableHiding: true,
        },
      ]
    : []),
];

export default function DataTable({
  filter,
  data,
  admins,
  inputTitles,
  empcode,
  emp,
}: DataTableProps) {
  const [tableData, setTableData] = useState<RequestWithAdmins[]>(data);
  const [employees, setEmployees] = useState<Admin[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true); // Start with true
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  // Add state for date range selection for export
  // const [startDate, setStartDate] = useState<Date | null>(null);
  // const [endDate, setEndDate] = useState<Date | null>(null);

  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [displayedMonth, setDisplayedMonth] = React.useState<Date>(
    startDate ?? new Date()
  );

  const { t, i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Apply RTL styling if needed when the component mounts
    if (i18n.language === "ar") {
      document.documentElement.dir = "rtl";
      document.documentElement.lang = "ar";
    } else {
      document.documentElement.dir = "ltr";
      document.documentElement.lang = i18n.language;
    }

    // Mark component as mounted to avoid hydration mismatch
    setMounted(true);
  }, [i18n.language]);

  React.useEffect(() => {
    setTableData(data);
    console.log("$$$$$$$$$$$$$");
    console.log("Data updated:", data[0]?.requestType);
  }, [data]);

  // Memoize columns to prevent unnecessary recreations
  // Memoize columns to prevent unnecessary recreations
  const columns = React.useMemo(
    () =>
      createColumns(employees, isLoadingEmployees, emp, empcode, mounted, t),
    [employees, isLoadingEmployees, emp, empcode, mounted, t]
  );
  // Fetch employees once

  // const [requestsWithEmployees,setRequestsWithEmployees]=useState()
  // ...existing code...
  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // const res = await fetch(

        let urls;
        if (emp.empType === "SUPER_ADMIN") {
          urls = [`/api/emps?empType=ADMIN`, `/api/emps?empType=SUPER_ADMIN`];
        } else {
          urls = [
            `/api/emps?managerId=${emp.employeeId}`,
            `/api/emps?empType=MANAGER`,
          ];
        }

        // Fetch all URLs and combine the results
        const responses = await Promise.all(urls.map((url) => fetch(url)));
        const data2 = await Promise.all(responses.map((res) => res.json()));

        // Combine the results from both requests
        const combinedResults = data2.flat();

        console.log("Combined Results:", data);
        setEmployees(combinedResults);
      } catch (error) {
        //ASSIGNINGG PARTTT

        console.error("Error fetching employees:", error);

        console.error(error);
        toast.error("Failed to load employee list");
      } finally {
        setIsLoadingEmployees(false);
      }
    };

    // Only fetch if we don't have employees yet
    if (employees.length === 0) {
      fetchEmployees();
    }
  }, [employees.length, emp.empType, emp.employeeId]);
  // ...existing code...

  const table = useReactTable({
    data: tableData,

    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    meta: {
      updateData: (rowIndex: number, columnId: any, value: any) => {
        setTableData((prev) =>
          prev.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },

    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      columnVisibility: {
        // Set initial visibility for columns if needed
      },
    },
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const urlParams = new URLSearchParams(searchParams?.toString() || "");
  const urlFilter = urlParams.get("filter") ?? "";
  const [inputValue, setInputValue] = useState(filter);
  function getDisplayedMonths(): [Date, Date] {
    const now = new Date();
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    return [now, nextMonth];
  }
  useEffect(() => {
    table.getColumn("id")?.setFilterValue(inputValue);

    // If filter is cleared, remove it from URL
    if (inputValue === "") {
      urlParams.delete("filter");
      router.replace(`${window.location.pathname}?${urlParams.toString()}`);
    }
  }, [inputValue, table, router]);
  useEffect(() => {
    setInputValue(filter);
  }, [filter]);

  // Initialize selected columns with visible columns
  React.useEffect(() => {
    const visibleColumns = table
      .getAllColumns()
      .filter((column) => column.getCanHide() && column.getIsVisible())
      .map((column) => column.id);
    setSelectedColumns(visibleColumns);
  }, [table]);

  const handleColumnToggle = (columnId: string) => {
    setSelectedColumns((prev) => {
      const newSelected = prev.includes(columnId)
        ? prev.filter((id) => id !== columnId)
        : [...prev, columnId];

      // Update table column visibility
      table
        .getAllColumns()
        .filter((column) => column.getCanHide())
        .forEach((column) => {
          column.toggleVisibility(newSelected.includes(column.id));
        });

      return newSelected;
    });
  };
  const ColumnSelector = () => {
    const [isOpen, setIsOpen] = useState(false);

    const formatColumnName = (id: string) => {
      return id === "select"
        ? "Selection"
        : id === "actions"
        ? "Actions"
        : id.replace(/([A-Z])/g, " $1").trim();
    };

    return (
      <div className="relative inline-block text-left">
        <div className="mb-2 relative">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 dark:border-gray-700 dark:text-gray-300"
              >
                {mounted ? (
                  <>{t("view")}</>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
                <ChevronDown className="ml-2 h-4 w-4 dark:text-gray-400" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="start"
              className="w-40 max-h-60 overflow-y-auto bg-white border border-gray-200 rounded-md shadow-lg z-50 dark:bg-gray-800 dark:border-gray-700 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
            >
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize px-4 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer dark:text-gray-300 dark:hover:bg-gray-700"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    <span
                      className={`flex items-center ${
                        column.getIsVisible() ? "font-medium" : "font-normal"
                      }`}
                    >
                      <CheckIcon
                        className={`mr-2 h-4 w-4 ${
                          column.getIsVisible()
                            ? "opacity-100 text-green-600 dark:text-green-400"
                            : "opacity-0"
                        }`}
                      />
                      {mounted ? t(column.id) : column.id}
                    </span>
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
  const [showPicker, setShowPicker] = useState(false);

  const handleExport = (startDate: Date, endDate: Date) => {
    // Helper to parse and format date as DD/MM/YYYY
    const formatDate = (date: Date | string | null | undefined) => {
      if (!date) return "------------";
      const d = date instanceof Date ? date : new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    // Filter rows by date interval (inclusive)
    const filteredRows = table.getFilteredRowModel().rows.filter((row) => {
      const original = row.original;
      const createdAt =
        original.createdAt instanceof Date
          ? original.createdAt
          : new Date(original.createdAt);
      // Compare only the date part (ignore time)
      const start = new Date(startDate);
      const end = new Date(endDate);
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      return createdAt >= start && createdAt <= end;
    });

    // Prepare the data for export from filtered rows only
    const exportData = filteredRows.map((row) => {
      const original = row.original;
      return {
        "Request Type": original.requestType,
        Status: original.status,
        "Request By": original.emp?.name,
        "Requester ID": original.emp?.employeeId,
        "Created At": formatDate(original.createdAt),
        "Assigned At": formatDate(original.assignedAt),
        "Project Name": original.project,
        "Closure Time": original.closedAt,
        "Closed At": formatDate(original.closedAt),
        Reassigned: original.counter > 1 ? "REASSIGNED" : "--------------",
        "Request ID": original.id,
        "AssignedTo ID":
          original.requestHistory?.length > 0
            ? original.requestHistory[original.requestHistory.length - 1]
                ?.assignedto || ""
            : "Unassigned",
        "Assigned By": original.emp?.name,
        status: original.status,
      };
    });

    // Format file name as DD-MM-YYYY
    const formatFileName = (date: Date | string | null | undefined) => {
      if (!date) return "";
      const d = date instanceof Date ? date : new Date(date);
      const day = String(d.getDate()).padStart(2, "0");
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const year = d.getFullYear();
      return `${day}-${month}-${year}`;
    };

    exportToExcel(
      exportData,
      `Requests_${formatFileName(startDate)}_to_${formatFileName(endDate)}`
    );
  };
const [employeeIdValue, setEmployeeIdValue] = useState("");

  console.log("Visibility State:", columnVisibility);
  console.log(
    "Columns:",
    table.getAllColumns().map((c) => c.id)
  );
  if (isLoadingEmployees) {
    return (
      <div className="w-full h-auto space-y-4 dark:bg-gray-900">
        {/* Title Skeleton */}
        <Skeleton className="h-10 w-1/4 rounded-lg bg-gray-200 dark:bg-gray-700" />

        {/* Filters Skeleton */}
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-1/3 rounded-lg bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-10 w-24 ml-auto rounded-lg bg-gray-200 dark:bg-gray-700" />
        </div>

        {/* Table Rows Skeleton */}
        <div className="rounded-md border space-y-2 p-4 border-gray-200 dark:border-gray-700">
          {[...Array(5)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-12 w-full rounded-lg bg-gray-200 dark:bg-gray-700"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-2 xs:p-4 dark:bg-gray-900 dark:text-gray-100">
      {/* Header Section */}
      <div className="flex flex-col xs:flex-row justify-between items-start xs:items-center gap-2 mb-4">
        <h1 className="text-xl xs:text-2xl sm:text-3xl font-serif pl-1 xs:pl-2">
          {mounted ? (
            <>{t("Requests")}</>
          ) : (
            <span className="opacity-50">&nbsp;</span>
          )}
        </h1>

        {emp?.empType === "SUPER_ADMIN" && (
          // <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm relative w-full xs:w-auto justify-end">
          //   <button
          //     onClick={() => setShowPicker((prev) => !prev)}
          //     className="px-3 xs:px-4 py-1 xs:py-2 bg-black text-white rounded-md shadow dark:bg-gray-700 dark:hover:bg-gray-600 text-xs xs:text-sm"
          //   >
          //     {mounted ? (
          //       <>{t("export")}</>
          //     ) : (
          //       <span className="opacity-50">&nbsp;</span>
          //     )}
          //   </button>

          //   {showPicker && (
          //     <>
          //       {/* Overlay to close picker when clicking outside */}
          //       <div
          //         className="fixed inset-0 z-10"
          //         onClick={() => setShowPicker(false)}
          //         style={{ background: "transparent" }}
          //       />

          //       <div
          //         dir={i18n.language === "ar" ? "rtl" : "ltr"}
          //         className="absolute z-20 flex flex-col gap-2 bg-white border rounded-md shadow-lg mx-1 dark:bg-gray-800 dark:border-gray-700"
          //         style={{
          //           top: "100%",
          //           [i18n.language === "ar" ? "left" : "right"]: 0,
          //           marginTop: "0.5rem",
          //           minWidth: "260px",
          //           maxWidth: "calc(100vw - 32px)",
          //           boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          //         }}
          //       >
          //         <div className="p-3 xs:p-4">
          //           {/* Start Date Section */}
          //           <div className="mb-3 xs:mb-4">
          //             <h3 className="font-medium mb-1 xs:mb-2 text-xs xs:text-sm dark:text-gray-300">{t("startDate")}</h3>
          //             <div className="flex gap-1 xs:gap-2 flex-wrap">
          //               <select
          //                 value={startDate?.getFullYear() || ""}
          //                 onChange={(e) => {
          //                   const year = parseInt(e.target.value);
          //                   const newDate = startDate
          //                     ? new Date(startDate)
          //                     : new Date();
          //                   newDate.setFullYear(year);
          //                   setStartDate(newDate);
          //                 }}
          //                 className="border rounded px-1 xs:px-2 py-1 flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //               >
          //                 <option value="">{t("year")}</option>
          //                 {Array.from(
          //                   { length: 10 },
          //                   (_, i) => new Date().getFullYear() - 5 + i
          //                 ).map((year) => (
          //                   <option key={year} value={year}>
          //                     {year}
          //                   </option>
          //                 ))}
          //               </select>

          //               <select
          //                 value={startDate?.getMonth() ?? ""}
          //                 onChange={(e) => {
          //                   const month = parseInt(e.target.value);
          //                   if (isNaN(month)) return;
          //                   const newDate = startDate
          //                     ? new Date(startDate)
          //                     : new Date();
          //                   newDate.setMonth(month);
          //                   setStartDate(newDate);
          //                 }}
          //                 className="border rounded px-1 xs:px-2 py-1 flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //               >
          //                 <option value="">{t("month")}</option>
          //                 {Array.from({ length: 12 }, (_, i) => i).map(
          //                   (month) => (
          //                     <option key={month} value={month}>
          //                       {new Date(0, month).toLocaleString(
          //                         i18n.language,
          //                         { month: "long" }
          //                       )}
          //                     </option>
          //                   )
          //                 )}
          //               </select>

          //               <DatePicker
          //                 selected={startDate || undefined}
          //                 onChange={(date) => setStartDate(date || undefined)}
          //                 selectsStart
          //                 startDate={startDate || undefined}
          //                 endDate={endDate || undefined}
          //                 placeholderText={t("day")}
          //                 showYearDropdown
          //                 showMonthDropdown
          //                 dropdownMode="select"
          //                 className="w-16 xs:w-20 px-1 xs:px-2 py-1 border rounded flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //                 maxDate={endDate || undefined}
          //                 locale={i18n.language}
          //               />
          //             </div>
          //           </div>

          //           {/* End Date Section */}
          //           <div className="mb-3 xs:mb-4">
          //             <h3 className="font-medium mb-1 xs:mb-2 text-xs xs:text-sm dark:text-gray-300">{t("endDate")}</h3>
          //             <div className="flex gap-1 xs:gap-2 flex-wrap">
          //               <select
          //                 value={endDate?.getFullYear() || ""}
          //                 onChange={(e) => {
          //                   const year = parseInt(e.target.value);
          //                   const newDate = endDate
          //                     ? new Date(endDate)
          //                     : new Date();
          //                   newDate.setFullYear(year);
          //                   setEndDate(newDate);
          //                 }}
          //                 className="border rounded px-1 xs:px-2 py-1 flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //               >
          //                 <option value="">{t("year")}</option>
          //                 {Array.from(
          //                   { length: 10 },
          //                   (_, i) => new Date().getFullYear() - 5 + i
          //                 ).map((year) => (
          //                   <option key={year} value={year}>
          //                     {year}
          //                   </option>
          //                 ))}
          //               </select>

          //               <select
          //                 value={endDate?.getMonth() ?? ""}
          //                 onChange={(e) => {
          //                   const month = parseInt(e.target.value);
          //                   if (isNaN(month)) return;
          //                   const newDate = endDate
          //                     ? new Date(endDate)
          //                     : new Date();
          //                   newDate.setMonth(month);
          //                   setEndDate(newDate);
          //                 }}
          //                 className="border rounded px-1 xs:px-2 py-1 flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //               >
          //                 <option value="">{t("month")}</option>
          //                 {Array.from({ length: 12 }, (_, i) => i).map(
          //                   (month) => (
          //                     <option key={month} value={month}>
          //                       {new Date(0, month).toLocaleString(
          //                         i18n.language,
          //                         { month: "long" }
          //                       )}
          //                     </option>
          //                   )
          //                 )}
          //               </select>

          //               <DatePicker
          //                 selected={endDate || undefined}
          //                 onChange={(date) => setEndDate(date || undefined)}
          //                 selectsEnd
          //                 startDate={startDate || undefined}
          //                 endDate={endDate || undefined}
          //                 placeholderText={t("day")}
          //                 showYearDropdown
          //                 showMonthDropdown
          //                 dropdownMode="select"
          //                 className="w-16 xs:w-20 px-1 xs:px-2 py-1 border rounded flex-1 min-w-[60px] xs:min-w-[80px] text-xs xs:text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          //                 minDate={startDate || undefined}
          //                 maxDate={new Date()}
          //                 locale={i18n.language}
          //               />
          //             </div>
          //           </div>

          //           {/* Validation Error Message */}
          //           {startDate && endDate && startDate > endDate && (
          //             <div className="text-red-500 text-xs xs:text-sm mb-2 dark:text-red-400">
          //               {t("dateValidationError")}
          //             </div>
          //           )}

          //           {/* Action Button */}
          //           <button
          //             onClick={() => {
          //               if (startDate && endDate && startDate <= endDate) {
          //                 handleExport(startDate, endDate);
          //                 setShowPicker(false);
          //               }
          //             }}
          //             disabled={!startDate || !endDate || startDate > endDate}
          //             className="mt-1 xs:mt-2 bg-black text-white px-2 xs:px-3 py-1 rounded disabled:opacity-50 w-full text-xs xs:text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
          //           >
          //             {t("confirmExport")}
          //           </button>
          //         </div>
          //       </div>
          //     </>
          //   )}
          // </div>

          //        <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm relative w-full xs:w-auto justify-end">
          //         <button
          //           onClick={() => setShowPicker((prev) => !prev)}
          //           className="px-3 xs:px-4 py-1 xs:py-2 bg-black text-white rounded-md shadow dark:bg-gray-700 dark:hover:bg-gray-600 text-xs xs:text-sm"
          //         >
          //           {mounted ? (
          //             <>{t("export")}</>
          //           ) : (
          //             <span className="opacity-50">&nbsp;</span>
          //           )}
          //         </button>

          //         {showPicker && (
          //           <>
          //             {/* Overlay to close picker when clicking outside */}
          //             <div
          //               className="fixed inset-0 z-10"
          //               onClick={() => setShowPicker(false)}
          //               style={{ background: "transparent" }}
          //             />

          //             <div
          //               dir={i18n.language === "ar" ? "rtl" : "ltr"}
          //               className="absolute z-20 flex flex-col gap-2 bg-white border rounded-md shadow-lg mx-1 dark:bg-gray-800 dark:border-gray-700"
          //               style={{
          //                 top: "100%",
          //                 [i18n.language === "ar" ? "left" : "right"]: 0,
          //                 marginTop: "0.5rem",
          //                 minWidth: "260px",
          //                 maxWidth: "calc(100vw - 32px)",
          //                 boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          //               }}
          //             >
          //               <div className="p-3 xs:p-4">
          //                 {/* Start Date Section */}
          //              <div className="p-3 xs:p-4">
          //   <Calendar
          //     mode="range"
          //     numberOfMonths={2}
          //     captionLayout="dropdown"
          //     fromYear={2000}
          //     toYear={2030}
          //     selected={{ from: startDate, to: endDate }}
          //     onSelect={(range: { from: any; to: any; }) => {
          //       setStartDate(range?.from || undefined)
          //       setEndDate(range?.to || undefined)
          //     }}
          //     className="rounded-lg border shadow bg-white dark:bg-gray-800 dark:border-gray-700"
          //   />

          //   {startDate && endDate && startDate > endDate && (
          //     <div className="text-red-500 text-xs xs:text-sm mt-2 dark:text-red-400">
          //       {t("dateValidationError")}
          //     </div>
          //   )}

          //   <button
          //     onClick={() => {
          //       if (startDate && endDate && startDate <= endDate) {
          //         handleExport(startDate, endDate);
          //         setShowPicker(false);
          //       }
          //     }}
          //     disabled={!startDate || !endDate || startDate > endDate}
          //     className="mt-3 bg-black text-white px-2 xs:px-3 py-1 rounded disabled:opacity-50 w-full text-xs xs:text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
          //   >
          //     {t("confirmExport")}
          //   </button>
          // </div>

          //               </div>
          //             </div>
          //           </>
          //         )}
          //       </div>

          //  <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm relative w-full xs:w-auto justify-end">
          //   <button
          //     onClick={() => setShowPicker((prev) => !prev)}
          //     className="px-3 xs:px-4 py-1 xs:py-2 bg-black text-white rounded-md shadow dark:bg-gray-700 dark:hover:bg-gray-600 text-xs xs:text-sm"
          //   >
          //     {mounted ? (
          //       <>{t("export")}</>
          //     ) : (
          //       <span className="opacity-50">&nbsp;</span>
          //     )}
          //   </button>

          //   {showPicker && (
          //     <>
          //       {/* Overlay to close picker when clicking outside */}
          //       <div
          //         className="fixed inset-0 z-10"
          //         onClick={() => setShowPicker(false)}
          //         style={{ background: "transparent" }}
          //       />

          //       <div
          //         dir={i18n.language === "ar" ? "rtl" : "ltr"}
          //         className="absolute z-20 flex flex-col gap-2 bg-white border rounded-md shadow-lg mx-1 dark:bg-gray-800 dark:border-gray-700"
          //         style={{
          //           top: "100%",
          //           [i18n.language === "ar" ? "left" : "right"]: 0,
          //           marginTop: "0.5rem",
          //           minWidth: "260px",
          //           maxWidth: "calc(100vw - 32px)",
          //           boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
          //         }}
          //       >
          //         <div className="p-3 xs:p-4">
          //           <div className="p-3 xs:p-4">
          //           <Calendar
          //   mode="range"
          //   numberOfMonths={2}
          //   captionLayout="dropdown-buttons"
          //   fromYear={2000}
          //   toYear={2030}
          //   month={displayedMonth}
          //   onMonthChange={setDisplayedMonth}
          //   showOutsideDays={false} // ✅ Prevent showing days outside current month
          //   selected={{ from: startDate, to: endDate }}
          //   onSelect={(range?: { from?: Date; to?: Date }) => {
          //     if (range?.from && range?.to) {
          //       setStartDate(range.from);
          //       setEndDate(range.to);
          //     } else if (range?.from) {
          //       setStartDate(range.from);
          //       setEndDate(undefined);
          //     }
          //   }}
          //   className="rounded-lg border shadow bg-white dark:bg-gray-800 dark:border-gray-700"
          // />

          //             {startDate && endDate && startDate > endDate && (
          //               <div className="text-red-500 text-xs xs:text-sm mt-2 dark:text-red-400">
          //                 {t("dateValidationError")}
          //               </div>
          //             )}

          //             <button
          //               onClick={() => {
          //                 if (startDate && endDate && startDate <= endDate) {
          //                   handleExport(startDate, endDate);
          //                   setShowPicker(false);
          //                 }
          //               }}
          //               disabled={!startDate || !endDate || startDate > endDate}
          //               className="mt-3 bg-black text-white px-2 xs:px-3 py-1 rounded disabled:opacity-50 w-full text-xs xs:text-sm dark:bg-gray-700 dark:hover:bg-gray-600"
          //             >
          //               {t("confirmExport")}
          //             </button>
          //           </div>
          //         </div>
          //       </div>
          //     </>
          //   )}
          // </div>

          <div className="flex items-center gap-1 xs:gap-2 text-xs xs:text-sm relative w-full xs:w-auto justify-end">
            <button
              onClick={() => setShowPicker((prev) => !prev)}
              className="px-3 xs:px-4 py-1 xs:py-2 bg-black text-white rounded-md shadow dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white text-xs xs:text-sm"
            >
              {mounted ? (
                <>{t("export")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </button>

            {showPicker && (
              <>
                {/* Transparent overlay to close picker */}
                <div
                  className="fixed inset-0 z-10 bg-transparent"
                  onClick={() => setShowPicker(false)}
                />

                <div
                  dir={i18n.language === "ar" ? "rtl" : "ltr"}
                  className="absolute z-20 flex flex-col gap-2 bg-white border border-gray-300 dark:bg-gray-800 dark:border-gray-700 rounded-md shadow-lg mx-1"
                  style={{
                    top: "100%",
                    [i18n.language === "ar" ? "left" : "right"]: 0,
                    marginTop: "0.5rem",
                    minWidth: "260px",
                    maxWidth: "calc(100vw - 32px)",
                    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
                  }}
                >
                  <div className="p-3 xs:p-4 text-gray-900 dark:text-gray-100">
                    <Calendar
                      mode="range"
                      numberOfMonths={2}
                      captionLayout="buttons" // Avoids duplicated dropdowns
                      fromYear={2000}
                      toYear={2030}
                      showOutsideDays={false}
                      selected={{ from: startDate, to: endDate }}
                      onSelect={(range?: { from?: Date; to?: Date }) => {
                        if (range?.from && range?.to) {
                          setStartDate(range.from);
                          setEndDate(range.to);
                        } else if (range?.from) {
                          setStartDate(range.from);
                          setEndDate(undefined);
                        }
                      }}
                      className="rounded-lg border shadow bg-white dark:bg-gray-800 dark:border-gray-700 text-gray-00 dark:text-gray-100"
                    


                    />

                    {startDate && endDate && startDate > endDate && (
                      <div className="text-red-500 dark:text-red-400 text-xs xs:text-sm mt-2">
                        {t("dateValidationError")}
                      </div>
                    )}
{/* 
                    <button
                      onClick={() => {
                        if (startDate && endDate && startDate <= endDate) {
                          handleExport(startDate, endDate);
                          setShowPicker(false);
                        }
                      }}
                      disabled={!startDate || !endDate || startDate > endDate}
                      className="mt-3 bg-black text-white px-2 xs:px-3 py-1 rounded w-full text-xs xs:text-sm disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
                    >
                      {t("confirmExport")}
                    </button> */}

                    <div className="flex justify-center mt-4">
  <button
    onClick={() => {
      if (startDate && endDate && startDate <= endDate) {
        handleExport(startDate, endDate);
        setShowPicker(false);
      }
    }}
    disabled={!startDate || !endDate || startDate > endDate}
    className="bg-black text-white px-3 py-1 rounded text-xs disabled:opacity-50 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-white"
  >
    {t("confirmExport")}
  </button>
</div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Filters Section */}
      <div className="flex flex-col gap-2 py-2 mb-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex flex-wrap items-center gap-1 xs:gap-2 w-full">
          {/* Status Filter */}
          <select
            value={
              (table.getColumn("status")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table
                .getColumn("status")
                ?.setFilterValue(e.target.value || undefined)
            }
            className="text-xs h-7 xs:h-8 w-[70px] xs:w-[80px] bg-white border border-gray-200 rounded px-1 xs:px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            <option value="">{mounted ? t("status") : "Status"}</option>
            <option value="COMPLETED">
              {mounted ? t("completed") : "Completed"}
            </option>
            <option value="PENDING">
              {mounted ? t("pending") : "Pending"}
            </option>
            <option value="REJECTED">
              {mounted ? t("rejected") : "Rejected"}
            </option>
          </select>

          {/* Request Type Filter */}
          <select
            value={
              (table.getColumn("requestType")?.getFilterValue() as string) ?? ""
            }
            onChange={(e) =>
              table
                .getColumn("requestType")
                ?.setFilterValue(e.target.value || undefined)
            }
            className="text-xs bg-white h-7 xs:h-8 w-[70px] xs:w-[80px] border border-gray-200 rounded px-1 xs:px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
          >
            <option value="">{mounted ? t("types") : "Types"}</option>
            {/* <option value="SALARY_CERTIFICATE">{t("SALARY_CERTIFICATE")}</option> */}
            <option value="MEDICAL_INSURANCE">{t("MEDICAL_INSURANCE")}</option>
            <option value="VACATION_REQUEST">{t("VACATION_REQUEST")}</option>
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
            <option value="SOCIAL_INSURANCE">{t("SOCIAL_INSURANCE")}</option>
            {/* <option value="PUBLIC_MEDICAL_INSURANCE">{t("PUBLIC_MEDICAL_INSURANCE")}</option>
        <option value="PRIVATE_MEDICAL_INSURANCE">{t("PRIVATE_MEDICAL_INSURANCE")}</option> */}
            <option value="LEAVE_REQUEST">{t("LEAVE_REQUEST")}</option>
            <option value="KELIO_PERMISSIONS">{t("KELIO_PERMISSIONS")}</option>
            <option value="OTHER">{t("OTHER")}</option>
          </select>

          {emp?.empType === "SUPER_ADMIN" && (
            <select
              value={
                (table.getColumn("Reassigned")?.getFilterValue() as string) ??
                ""
              }
              onChange={(e) => {
                const value = e.target.value;
                table
                  .getColumn("Reassigned")
                  ?.setFilterValue(
                    value === "true"
                      ? true
                      : value === "false"
                      ? false
                      : undefined
                  );
              }}
              className="text-xs bg-white h-7 xs:h-8 w-[90px] xs:w-[110px] border border-gray-200 rounded px-1 xs:px-2 focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300"
            >
              <option value="">{mounted ? t("reAssign") : "Reassigned"}</option>
              <option value="true">{mounted ? t("true") : "True"}</option>
              <option value="false">{mounted ? t("false") : "False"}</option>
            </select>
          )}

<div className="flex flex-wrap gap-2 items-center">
  <Input
    placeholder={mounted ? t("searchRequestId") : ""}
    value={inputValue || ""}
    onChange={(event) => {
      const value = event.target.value;
      setInputValue(value);
      table.getColumn("id")?.setFilterValue(value);
    }}
    className="h-8 w-[200px] sm:w-[250px] md:w-[300px] text-xs focus:ring-green-300 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400"
  />

  <Input
    placeholder={mounted ? t("searchEmployeeId") : ""}
    value={employeeIdValue}
    onChange={(event) => {
      const value = event.target.value;
      setEmployeeIdValue(value);
      table.getColumn("empId")?.setFilterValue(value);
    }}
    className="h-7 w-[120px] sm:w-[140px] md:w-[180px] px-2 text-xs focus:ring-green-300 focus:border-green-500 bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:placeholder-gray-400"
  />
</div>

        </div>

        <ColumnSelector />
      </div>

      {/* Table Section */}
      <div className="rounded-md border overflow-auto dark:border-gray-800">
        <Table>
          <TableHeader className="dark:bg-gray-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="dark:border-gray-800">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="font-medium dark:text-gray-300 text-xs xs:text-sm"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="dark:bg-gray-900">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="hover:bg-gray-50 transition-colors dark:hover:bg-gray-800 dark:border-gray-800"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className="py-2 xs:py-3 dark:text-gray-300 text-xs xs:text-sm"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={table.getAllColumns().length}
                  className="h-24 text-center text-gray-500 dark:text-gray-400 text-xs xs:text-sm"
                >
                  {t("No_requests_found")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Section */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2 xs:gap-4 py-2 xs:py-4">
        <div className="text-xs xs:text-sm text-gray-600 dark:text-gray-400">
          {/* Optional: Show entries count */}
        </div>

        <div className="flex items-center justify-end space-x-1 xs:space-x-2 py-2 xs:py-4">
          <div className="space-x-1 xs:space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 text-xs xs:text-sm"
            >
              {mounted ? (
                <>{t("previous")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800 text-xs xs:text-sm"
            >
              {mounted ? (
                <>{t("next")}</>
              ) : (
                <span className="opacity-50">&nbsp;</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
