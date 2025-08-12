import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { jwtVerify } from 'jose';

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // Exclude public routes from middleware
  if (
    request.nextUrl.pathname.startsWith('/auth') ||
    request.nextUrl.pathname.startsWith('/api/auth') ||
    request.nextUrl.pathname.startsWith('/api/login') ||
    request.nextUrl.pathname.startsWith('/api/token') ||
    request.nextUrl.pathname.startsWith('/api/emps') ||
    request.nextUrl.pathname.startsWith('/api/reqs2') ||
     request.nextUrl.pathname.startsWith('/api/reqs') ||
          request.nextUrl.pathname.startsWith('/api/proxy')||
          request.nextUrl.pathname.startsWith('/api/mails')

  ) {
    return NextResponse.next();
  }

  const sessionAuth = request.cookies.get('session_auth');

  if (!sessionAuth?.value) {
    // Redirect to login if there's no session
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  try {
    // Verify the JWT token
    const secret = new TextEncoder().encode(
      process.env.token_encryption_key || 'default_secret'
    );
    
    const { payload } = await jwtVerify(sessionAuth.value, secret);
    
    // If verification successful, continue to the requested page
    const response = NextResponse.next();
    
    // Optionally attach the decoded user info to headers for route handlers
    response.headers.set('x-user-info', JSON.stringify(payload));
    
    return response;
  } catch (error) {
    // If token is invalid, clear the cookie and redirect to login
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('session_auth');
    return response;
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (authentication routes)
     * - api/login (login routes)
     * - api/token (token generation routes)
     * - auth (login pages)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api/auth|api/login|api/token|auth|_next/static|_next/image|favicon.ico).*)',
  ],
}
