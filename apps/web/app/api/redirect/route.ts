import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const target = decodeURIComponent(url.searchParams.get('u') || '');
  const metaRaw = url.searchParams.get('meta') || '{}';
  let meta: any = {};
  try { meta = JSON.parse(decodeURIComponent(metaRaw)); } catch {}
  
  // Fire-and-forget logging via background (Edge doesn't allow blocking DB writes easily; keep simple here)
  fetch(`${url.origin}/api/redirect/log`, { 
    method: 'POST', 
    body: JSON.stringify({ 
      target, 
      meta, 
      ua: req.headers.get('user-agent') || '', 
      ref: req.headers.get('referer') || '' 
    }) 
  }).catch(()=>{});
  
  return new Response(null, { status: 302, headers: { Location: target } });
}
