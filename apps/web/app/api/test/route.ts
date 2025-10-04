import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET() {
  return NextResponse.json({ 
    message: 'Test API is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    return NextResponse.json({ 
      message: 'Test POST is working',
      received: body,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Failed to parse JSON',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 400 });
  }
}
