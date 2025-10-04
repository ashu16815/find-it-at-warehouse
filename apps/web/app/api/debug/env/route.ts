import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    AOAI_ENDPOINT: process.env.AOAI_ENDPOINT ? 'SET' : 'NOT SET',
    AOAI_API_VERSION: process.env.AOAI_API_VERSION || 'NOT SET',
    AOAI_API_KEY: process.env.AOAI_API_KEY ? 'SET' : 'NOT SET',
    AOAI_GPT5_DEPLOYMENT: process.env.AOAI_GPT5_DEPLOYMENT || 'NOT SET',
    AZURE_SEARCH_ENDPOINT: process.env.AZURE_SEARCH_ENDPOINT ? 'SET' : 'NOT SET',
    AZURE_SEARCH_KEY: process.env.AZURE_SEARCH_KEY ? 'SET' : 'NOT SET',
    DATABASE_URL: process.env.DATABASE_URL ? 'SET' : 'NOT SET'
  });
}
