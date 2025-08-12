import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {

const { searchParams } = new URL(request.url);
    const requestId = searchParams.get("id") || undefined;
    
    
    const latestHistory = await prisma.request_History.findFirst({
      where: {
        requestId: requestId
      },
      orderBy: {
        time: 'desc' // Sort by time in descending order to get the latest
      },

    });
    
    return NextResponse.json(latestHistory);
  } catch (error) {
    console.error('Error fetching latest request history:', error);
    throw error;
  }
}
export const dynamic = 'force-dynamic' // If you need full dynamic behavior


export async function DELETE() 
{
  try {
    // Delete all records from request_History
    await prisma.request_History.deleteMany({});
    
    return NextResponse.json({ message: 'All request history records deleted successfully.' });
  } catch (error) {
    console.error('Error deleting request history:', error);
    return NextResponse.json({ error: 'Failed to delete request history.' }, { status: 500 });
  }
}