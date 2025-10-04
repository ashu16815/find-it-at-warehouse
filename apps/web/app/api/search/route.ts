import { NextRequest, NextResponse } from 'next/server';
import { searchTWG } from '../../../lib/search';
import { searchExternal } from '../../../lib/external';
import { v4 as uuid } from 'uuid';

export const runtime = 'edge';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') ?? '';
  const budget = Number(searchParams.get('budget') || 0) || undefined;
  const category = searchParams.get('category') || undefined;
  const query_id = uuid();
  
  const twg = await searchTWG(q, { limit: 12 });
  let external: any[] = [];
  
  if (!twg || twg.length < 3) {
    external = await searchExternal(q, { limit: 9 });
  }
  
  // Simple ranking: prioritize The Warehouse, then Warehouse Stationery, then Noel Leeming
  const brandOrder = { 
    'The Warehouse': 0, 
    'Warehouse Stationery': 1, 
    'Noel Leeming': 2 
  } as Record<string, number>;
  
  const rankedTWG = twg
    .sort((a, b) => brandOrder[a.merchant] - brandOrder[b.merchant])
    .slice(0, 3);
  
  const payload = { 
    query_id, 
    twg: rankedTWG, 
    external 
  };
  
  return NextResponse.json(payload, { 
    headers: { 'x-query-id': query_id } 
  });
}
