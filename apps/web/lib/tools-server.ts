import { webSearch } from './web-bing';
import { extractCards } from './web-extract';
import { decorate } from './redirects';

export async function site_search({ query, domains_priority = ['thewarehouse.co.nz', 'warehousestationery.co.nz', 'noelleeming.co.nz'], limit_per_domain = 8 }: any) {
  const urls: string[] = [];
  
  // Generate proper TWG search URLs (no site: operators needed)
  console.log('Generating TWG search URLs for query:', query);
  for (const d of domains_priority) {
    for (let i = 0; i < limit_per_domain; i++) {
      urls.push(`https://${d}/search?q=${encodeURIComponent(query)}&page=${i + 1}`);
    }
  }
  
  console.log('Generated URLs:', urls.slice(0, 3), '... (total:', urls.length, ')');
  return { urls };
}

export async function fetch_product_cards({ urls, max = 18 }: any) {
  const cards = await extractCards(urls.slice(0, max));
  return { cards };
}

export async function rank_and_dedup({ cards, intent, take = 9 }: any) {
  const order: Record<string, number> = { 
    'thewarehouse.co.nz': 0, 
    'warehousestationery.co.nz': 1, 
    'noelleeming.co.nz': 2 
  };
  
  const scored = cards.map((c: any) => {
    const d = (c.domain || '').toLowerCase();
    const brandScore = d in order ? 100 - order[d] * 10 : 0;
    const budgetScore = intent?.budget && c.price ? (c.price <= intent.budget ? 10 : -5) : 0;
    const prefScore = intent?.brand && c.title ? (new RegExp(intent.brand, 'i').test(c.title) ? 5 : 0) : 0;
    
    return { ...c, _s: brandScore + budgetScore + prefScore };
  });
  
  const dedup = new Map<string, any>();
  for (const c of scored.sort((a: any, b: any) => b._s - a._s)) {
    const key = (c.canonicalUrl || c.url || c.title).toLowerCase();
    if (!dedup.has(key)) dedup.set(key, c);
  }
  
  return { cards: Array.from(dedup.values()).slice(0, take) };
}

export async function decorate_redirects({ cards }: any) {
  return { cards: cards.map((c: any) => decorate(c)) };
}

export async function log_event({ type, payload }: any) {
  // This would typically log to a telemetry system
  console.log('Event logged:', type, payload);
  return { success: true };
}
