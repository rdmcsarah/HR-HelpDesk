// import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     const response = await fetch('https://smsportal.mobilitycairo.com/api/generate-hmac', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest',
//       },
//       body: JSON.stringify(body),
//     });

//     if (!response.ok) {
//       const errorData = await response.json();
//       return NextResponse.json(
//         { error: errorData, message: 'Failed to generate HMAC' },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();

//     console.log(data)
//     return NextResponse.json(data, { status: 200 });
//   } catch (error) {
//     console.error('Proxy error:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// // Optional: Explicitly reject non-POST methods
// export async function GET() {
//   return NextResponse.json(
//     { message: 'Method not allowed' },
//     { status: 405 }
//   );
// }

import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('🔁 Incoming request to /api/proxy');
    console.log('📦 Request body:', body);

    const apiUrl = process.env.HMAC_API_URL;

    if (!apiUrl) {
      throw new Error('Missing HMAC_API_URL environment variable');
    }

    console.log('➡️ Proxying to:', apiUrl);

    // Optional: Add timeout support (20 seconds)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000); // 20s

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeout); // Clear timeout on success

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: 'Unknown error from upstream server' };
      }

      console.error('❌ Upstream server error:', errorData);

      return NextResponse.json(
        { error: errorData, message: 'Failed to generate HMAC' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('✅ Success:', data);

    return NextResponse.json(data, { status: 200 });

  } catch (error: any) {
    console.error('🔥 Proxy error:', error);

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}


export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}
