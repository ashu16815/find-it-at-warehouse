import { NextRequest, NextResponse } from 'next/server';
import { consult } from '../../../../lib/ai';


export async function POST(req: NextRequest) {
  const body = await req.json();
  const out = await consult(body.query, body.context || {});
  return NextResponse.json(out);
}
