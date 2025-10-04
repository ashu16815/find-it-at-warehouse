import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const sitemap = {
    pages: [
      { path: '/', title: 'Home' },
      { path: '/chat', title: 'Conversational Shopping' },
      { path: '/admin/dashboard', title: 'Admin Dashboard' }
    ],
    apis: [
      { path: '/api/ai/chat', method: 'POST', description: 'Azure OpenAI tool-run chat' },
      { path: '/api/redirect', method: 'GET', description: 'Tracked redirect' },
      { path: '/api/redirect/log', method: 'POST', description: 'Persist redirect event' }
    ]
  };
  
  return NextResponse.json(sitemap, { 
    headers: { 'Cache-Control': 'public, max-age=300' } 
  });
}
