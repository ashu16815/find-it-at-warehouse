import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = decodeURIComponent(url.searchParams.get('u') || '');
  const metaRaw = url.searchParams.get('meta') || '{}';
  let meta: any = {};
  try { meta = JSON.parse(decodeURIComponent(metaRaw)); } catch {}
  
  // Log the redirect event
  console.log('Redirect Event:', {
    target,
    meta,
    userAgent: req.headers.get('user-agent') || '',
    referrer: req.headers.get('referer') || '',
    timestamp: new Date().toISOString()
  });
  
  return new Response(null, { status: 302, headers: { Location: target } });
}
