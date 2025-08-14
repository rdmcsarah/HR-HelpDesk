import { NextResponse } from "next/server";
export async function POST(request: Request) {
  try {
    // 1. Parse the request body
    const requestBody = await request.json();

    const {token } = requestBody;

    // 2. Validate input
    if (!token) {
      console.error("Validation failed - missing username or token");
      return NextResponse.json(
        { message: "Username and token are required" },
        { status: 400 }
      );
    }

    // 3. Make the API call
    const apiResponse = await fetch("https://n8n.srv869586.hstgr.cloud/webhook/logged", {
      method: "POST",
 headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
    
    });

    // 4. Handle the response
    const responseData = await apiResponse.json();

    if (!apiResponse.ok) {
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