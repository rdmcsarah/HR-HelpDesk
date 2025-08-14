import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();
  
  const cookieStore = await cookies();
  // Store in cookies
  cookieStore.set({
    name: 'employeeData',
    value: JSON.stringify(data),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 // 24 hours
  });

  return NextResponse.json({ success: true });
}

export async function GET() {
  const cookieStore = await cookies();
  const employeeData = cookieStore.get('employeeData');
  
  if (!employeeData) {
    return NextResponse.json({ data: null });
  }

  return NextResponse.json({ data: JSON.parse(employeeData.value) });
}
