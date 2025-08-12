"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { BellIcon } from "lucide-react"; // or your preferred icon library
import LanguageSwitcher from "./LanguageSwitcher";
import { useRouter } from "next/navigation";
import "@/i18n"; // Import the i18n configuration
import { useTranslation } from "react-i18next";
import ThemeSwitcher from "./ThemeSwitcher";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

interface Employee {
  employeeId: string;
  name: string;
  email: string;
  department: string;
  position: string;
  empType: string;
}

type Request = {
  includes(id: number): unknown;
  id: number;
  title: string;
  description: string;
  requestType: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  closedAt: Date;
  comments: string[];
  assignedToId: number;
  empId: string;
  assignedTo: string;
};

export function SiteHeader({ empCode }: { empCode: string | null }) {
  console.log("SiteHeader empCode:", empCode);
  // const { empcode } = useParams();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [readNotifications, setReadNotifications] = useState<number[]>([]);
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

  const [requests, setRequests] = useState<Request[]>([]);
  const [isAnimating, setIsAnimating] = useState(true);

  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        const response = await fetch(`/api/emps?employeeId=${empCode}`);
        if (!response.ok) throw new Error("Failed to fetch employee details");
        const data = await response.json();
        setEmployee(data[0] || null);
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Failed to load employee data"
        );
      }
    };

    fetchRequestDetails();
  }, [empCode]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/reqs2?ring`);
        if (!response.ok) throw new Error("Failed to fetch requests");
        const data = await response.json();

        if (Array.isArray(data)) {
          setRequests(data);
          setPendingRequestsCount(data.length);
        } else {
          setRequests(data);
        }
      } catch (err) {
        console.error(
          err instanceof Error ? err.message : "Failed to load requests"
        );
      }
    };

    fetchData();
  }, []);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Add click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        dropdownRef.current &&
        !(dropdownRef.current as HTMLElement).contains(target)
      ) {
        // Check if the click is outside the dropdown and button
        const button = document.querySelector(".notification-button");
        if (button && !button.contains(target)) {
          setIsOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // const toggleAnimation = () => {
  //   setIsAnimating(!isAnimating);
  // };

  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleNotifications = () => {
    setIsOpen(!isOpen);
    // Mark notifications as read when opening
    if (!isOpen && pendingRequestsCount > 0) {
      setPendingRequestsCount(0);
      setIsAnimating(false);
      // You might want to actually mark them as read in your backend here
    }
  };
  return (  
    <header className="bg-background flex h-16 w-full items-center border-b px-2 sm:px-4 shadow-sm dark:bg-gray-900 dark:border-gray-800">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-4">
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="max-w-[140px] xs:max-w-[180px] sm:max-w-none truncate">
              <h1 className="text-xs xs:text-sm sm:text-xl font-bold leading-none flex flex-wrap items-center gap-1 sm:gap-3 m-0 sm:m-2 dark:text-white">
                <Link href={`/helpdesk`} passHref>
                  <HomeIcon className="w-5 h-5 xs:w-6 xs:h-6 text-gray-600 hover:text-primary dark:text-gray-300 dark:hover:text-primary transition-colors cursor-pointer" />
                </Link>

                {mounted ? (
                  <>
                    <span className="whitespace-nowrap">{t("welcome")}</span>
                    {employee?.name && (
                      <span className="text-primary dark:text-primary-300 truncate whitespace-nowrap">
                        {/* {employee.name} */}
                        {employee.name.split(" ")[0]}{" "}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="opacity-50">&nbsp;</span>
                )}
              </h1>
              
              {/* <p className="text-[10px] xs:text-xs text-muted-foreground ml-1 sm:ml-2 dark:text-gray-400 truncate">
                {employee && (
                  <>


                    {employee.position && t(employee.position)}
                      {employee.position && employee.department && " • "} 
                    {employee.department && t(employee.department)} 
                  </>
                )}
              </p> */}

              {mounted && (
  <p className="text-[10px] xs:text-xs text-muted-foreground ml-1 sm:ml-2 dark:text-gray-400 truncate">
    {employee && (
      <>

        {employee.position && t(employee.position)}
        {employee.position && employee.department && " • "}
        {employee.department && t(employee.department)}
      </>
    )}


    
  </p>
)}
            </div>
          </div>
        </div>

        {/* Right section: Bell and Language Switcher together */}
        <div className="flex items-center gap-1 sm:gap-4">
          {employee?.empType === "SUPER_ADMIN" && (
            <div className="relative" ref={dropdownRef}>
              <button
                className="focus:outline-none relative notification-button dark:text-gray-300 p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleNotifications();
                }}
              >
                <BellIcon
                  className={`h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 transition-colors ${
                    pendingRequestsCount > 0 && isAnimating
                      ? "text-red-500 animate-pulse dark:text-red-400"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                />
                {pendingRequestsCount > 0 && (
                  <span className="absolute -right-1 -top-1 xs:-right-2 xs:-top-2 flex h-4 w-4 xs:h-5 xs:w-5 items-center justify-center rounded-full bg-red-600 text-[8px] xs:text-xs text-white shadow-md dark:bg-red-500">
                    {pendingRequestsCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {isOpen && (
                <div
                  className={`absolute mt-2 w-[280px] xs:w-72 sm:w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50 transform transition-all duration-300 ease-in-out dark:bg-gray-800 dark:ring-gray-700 ${
                    isOpen
                      ? "translate-y-0 opacity-100"
                      : "-translate-y-2 opacity-0"
                  }`}
                  style={{
                    maxHeight: "calc(100vh - 100px)",
                    overflowY: "auto",
                    [i18n.language === "ar" ? "left" : "right"]: 0,
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    <div className="px-3 xs:px-4 py-2 border-b border-gray-200 font-semibold text-gray-700 text-xs xs:text-sm sticky top-0 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300">
                      {t("notifications")}
                    </div>
                    {requests.length > 0 ? (
                      requests.map((notification) => {
                        const isRead = readNotifications.includes(
                          notification.id
                        );
                        return (
                          <div
                            key={notification.id}
                            onClick={() => {
                              if (!isRead) {
                                setReadNotifications([
                                  ...readNotifications,
                                  notification.id,
                                ]);
                                setPendingRequestsCount((prev) => prev - 1);
                              }
                              router.push(
                                `/hr_document_admin?filter=${notification.id}`
                              );
                            }}
                            className={`px-3 xs:px-4 py-2 xs:py-3 cursor-pointer transition-colors text-xs xs:text-sm ${
                              isRead
                                ? "bg-white text-gray-400 dark:bg-gray-800 dark:text-gray-500"
                                : "bg-blue-50 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                            } hover:bg-blue-100 dark:hover:bg-gray-600`}
                          >
                            <div className="font-semibold">
                              {t(notification.requestType)}
                            </div>
                            <div className="text-[10px] xs:text-xs text-gray-500 dark:text-gray-400">
                              {t("double_click_to_view_details")}
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="px-3 xs:px-4 py-2 xs:py-3 text-xs xs:text-sm text-gray-500 dark:text-gray-400">
                        {t("no_new_notifications")}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}


          {(employee?.empType === "SUPER_ADMIN" ||
    employee?.empType === "ADMIN" ||
    employee?.empType === "MANAGER") && (
    <button
      onClick={() => router.push("/hr_document_admin")}
      className="ml-2 text-sm px-3 py-1 rounded-md bg-green-600 text-white hover:bg-green-700 transition"
    >
      {t("admin")}
    </button>
  )}
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
