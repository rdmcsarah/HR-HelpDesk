import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Parse the request body
    const requestBody = await request.json();
    console.log("Request body:", requestBody); // Debug log

    const { username,  token } = requestBody;

    // 2. Validate input
    if (!username || !token) {
      console.error("Validation failed - missing username or token");
      return NextResponse.json(
        { message: "Username and token are required" },
        { status: 400 }
      );
    }

    // 3. Make the API call
    const apiResponse = await fetch("https://portal10.vercel.app/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, token }),
    });

    // 4. Handle the response
    const responseData = await apiResponse.json();
    console.log("API Response:", responseData); // Debug log

    if (!apiResponse.ok) {
      console.error("API Error:", responseData);
      return NextResponse.json(
        { 
          message: responseData.message || "Authentication failed",
          details: responseData 
        },
        { status: apiResponse.status }
      );
    }

    // 5. Return successful response
    return NextResponse.json(responseData);

  } catch (error) {
    // 6. Handle unexpected errors
    console.error("Server Error:", error);
    return NextResponse.json(
      { 
        message: "Internal Server Error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}