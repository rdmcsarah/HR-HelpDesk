import { NextResponse } from 'next/server';

// export async function POST(request: Request) {
//   try {
//     const body = await request.json();
//     console.log("we are here")
//     const response = await fetch('https://smsportal.mobilitycairo.com/api/generate-hmac', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'X-Requested-With': 'XMLHttpRequest',
//       },
//       body: JSON.stringify(body),
//     });
//     console.log("we are here",response)

//     if (!response.ok) {
//       const errorData = await response.json();
//       return NextResponse.json(
//         { error: errorData, message: 'Failed to generate HMAC' },
//         { status: response.status }
//       );
//     }

//     const data = await response.json();

//     // console.log(data)
//     return NextResponse.json(data, { status: 200 });
//   } catch (error:unknown) {
//     console.error('Proxy error:', error);
//     return NextResponse.json(
//       { error},
//       { status: 500 }
//     );
//   }
// }

// Optional: Explicitly reject non-POST methods
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Incoming request bodyvvv hereeeeeeeeee", body);

    const response = await fetch('https://smsportal.mobilitycairo.com/api/generate-hmac', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify(body),
    });

    console.log("Response status:", response.status);

    const rawText = await response.text(); // <-- get raw text
    console.log("Raw response:", rawText);

    if (!response.ok) {
      return NextResponse.json(
        { error: rawText, message: 'Failed to generate HMAC' },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { error: rawText, message: 'Non-JSON response from SMS portal' },
        { status: 502 }
      );
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: unknown) {
    console.error("Proxy error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
