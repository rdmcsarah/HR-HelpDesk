"use client";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function page() {
  const { empcode, token } = useParams<{ empcode: string; token: string }>();
  const router = useRouter();

  if (empcode === undefined || token === undefined) {
    return <div>Error: Missing parameters</div>;
  }

  useEffect(() => {
    const authenticate = async () => {
      try {
        // First verify login
        const loginResponse = await fetch("/api/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: empcode,
            token: token,
          }),
        });
        
        const loginResult = await loginResponse.json();
        if (!loginResult.result) {
          console.error("Authentication failed:", loginResult);
          router.push("/auth/" + empcode);
          return;
        }

        // Generate JWT token on the server
        // const tokenResponse = await fetch("/api/token", {
        //   method: "POST",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   body: JSON.stringify({
        //     username: empcode,
        //     token: token,
        //   }),
        // });

        // const tokenResult = await tokenResponse.json();
        // if (!tokenResult.token) {
        //   console.error("Token generation failed:", tokenResult);
        //   return;
        // }

        // Create session with the new token
       const result2 = await fetch("/api/auth", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username2: empcode,
            token2: token,
          }),
        });

        

        if(result2.ok){
          console.log("result2 ok", result2)
          router.push("/" );
        }

        console.log("Authentication successful");
      } catch (error) {
        console.error("Authentication error:", error);
      }
    };

    authenticate();
  }, [empcode, token, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      Loading authentication...
    </div>
  );
}
