"use client";

import Navigation from "@/components/Navigation";
import { SiteHeader } from "@/components/site-header";
import { useEffect, useState } from "react";
import ClientWrapper from "../ClientWrapper";

interface Data {
  navMain: {
    title: string;
    icon?: string;
    isActive?: boolean;
    url: string;
    items?: {
      title: string;
      icon?: string;
      disabled?: boolean;
      target?: boolean;
      url: string;
      isActive?: boolean;
    }[];
  }[];
}

export default function ClientLayout({
  children,
  sessionAuth,
}: Readonly<{
  children: React.ReactNode;
  sessionAuth: string | undefined;
}>) {
  const data: Data = {
    navMain: [
      // ... your existing navigation data
    ],
  };

  const [uid, setUid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  // const [isMounted, setIsMounted] = useState<boolean>(false);

  // useEffect(() => {
  //   setIsMounted(true);
  // }, []);

  // useEffect(() => {
  //   if (!isMounted) return;

  //   try {
  //     if (sessionAuth) {
  //       console.log("Session auth found:", sessionAuth);
  //       // Decode JWT to get user info if needed
  //       try {
  //         const decoded = JSON.parse(atob(sessionAuth.split('.')[1]));
  //         setUid(decoded.username2);
  //         setIsAuthenticated(true);
  //       } catch (e) {
  //         console.error("Error decoding JWT:", e);
  //       }
  //       return;
  //     }

  //     // Fallback to localStorage if no session
  //     const storedUid = localStorage.getItem("uid");
  //     const storedToken = localStorage.getItem("token");

  //     setUid(storedUid);
  //     setToken(storedToken);

  //     if (storedUid && storedToken) {
  //       fetch("/api/login", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //         body: JSON.stringify({
  //           username: storedUid,
  //           token: storedToken,
  //         }),
  //       })
  //       .then(response => response.json())
  //       .then(data => {
  //         setIsAuthenticated(data.result === true);
  //       })
  //       .catch(error => {
  //         console.error("Login API error:", error);
  //         setIsAuthenticated(false);
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Auth check error:", error);
  //   }
  // }, [isMounted, sessionAuth]);

  // if (!isMounted) {
  //   return null;
  // }

useEffect(() => {
  const fetchAuth = async () => {
    const res = await fetch("/api/auth", {
      method: "GET",
      credentials: "include"
    });
    const response = await res.json();
    console.log("refeqfws", response.username);
    setUid(response.username);
    setIsAuthenticated(true);
  };
  fetchAuth();
}, []);
  

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col">
      {isAuthenticated ? (
        <>
          <ClientWrapper>
            <SiteHeader empCode={uid}/>
            <main className="flex-1 w-full">
              {children}
            </main>
          </ClientWrapper>
        </>
      ) : (
        <main className="flex-1">
          {children}
        </main>
      )}
    </div>
  );
}
