// app/api/upload/route.ts
import { NextResponse } from 'next/server';
import { put } from '@vercel/blob';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const name = formData.get('name') as string;

    if (!file) {
      return NextResponse.json(
        { error: 'File is required' },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(file.name, buffer, {
      access: 'public',
      token: process.env.BLOB_READ_WRITE_TOKEN, // ✅ REQUIRED
       allowOverwrite: true,
    });

    const document = await prisma.document.create({
      data: {
        // reqId:reqId,
        name: name || file.name,
        fileName: file.name,
        fileUrl: blob.url,
        size: file.size,
        contentType: file.type || 'application/octet-stream',
      },
    });

    return NextResponse.json(document.fileUrl);
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  const documents = await prisma.document.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json(documents);
}
