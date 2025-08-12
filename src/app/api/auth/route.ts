import {NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

// POST /api/auth
// Body: { username: string, token: string }
export async function POST(request: Request) {
  try {
    const { username2, token2 } = await request.json();
    if (!username2 || !token2) {
      return NextResponse.json({ error: "Missing username or token" }, { status: 400 });
    }



    const newToken = jwt.sign(
      { username2, token2 },
      process.env.token_encryption_key || 'default_secret',
      { expiresIn: '1h' }
    );






    // Set cookies for session (secure, httpOnly in production)
    const response = NextResponse.json({ message: "Session created" });
    response.cookies.set("session_auth", newToken, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      // secure: true, // Uncomment in production
    }); 
    
    
    // response.cookies.set("session_username", username2, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   path: "/",
    //   // secure: true, // Uncomment in production
    // });
    // response.cookies.set("session_token", token2, {
    //   httpOnly: true,
    //   sameSite: "lax",
    //   path: "/",
    //   // secure: true, // Uncomment in production
    // });
    return response;
  } catch (error) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}




export async function GET(request: NextRequest) {
  try {
    // ✅ Get cookie from request
    const sessionCookie = request.cookies.get("session_auth")?.value;

    if (!sessionCookie) {
      return NextResponse.json({ error: "No session cookie found" }, { status: 401 });
    }

    // ✅ Decode and verify JWT
    const decoded = jwt.verify(
      sessionCookie,
      process.env.token_encryption_key || "default_secret"
    ) as { username2: string; token2: string };

    // ✅ Return extracted username
    return NextResponse.json({ username: decoded.username2 });
  } catch (error) {
    return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
  }
}
