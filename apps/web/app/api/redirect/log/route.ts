import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '../../../../lib/db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const { target, meta, ua, ref } = await req.json();
  const domain = (meta?.domain || new URL(target).hostname || '').replace(/^www\./,'');
  
  await prisma.redirectEvent.create({ 
    data: { 
      targetUrl: target, 
      domain, 
      merchant: meta?.brand || domain, 
      label: meta?.label || 'External', 
      userAgent: ua, 
      referrer: ref 
    } 
  });
  
  return NextResponse.json({ ok: true });
}
