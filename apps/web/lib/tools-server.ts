import { webSearch } from './web-bing';
import { extractCards } from './web-extract';
import { decorate } from './redirects';

export async function site_search({ query, domains_priority, limit_per_domain = 8 }: any) {
  const results: { url: string; title?: string; snippet?: string; domain?: string }[] = [];
  
  for (const d of domains_priority) {
    const r = await webSearch(`${query} site:${d}`, limit_per_domain);
    results.push(...r);
  }
  
  return { urls: results.map(r => r.url), hints: results };
}

export async function fetch_product_cards({ urls, max = 18 }: any) {
  const slice = urls.slice(0, max);
  const cards = await extractCards(slice);
  return { cards };
}

export async function rank_and_dedup({ cards, intent, take = 9 }: any) {
  const brandOrder: Record<string, number> = { 
    'thewarehouse.co.nz': 0, 
    'warehousestationery.co.nz': 1, 
    'noelleeming.co.nz': 2 
  };
  
  const scored = cards.map((c: any) => {
    const domain = (c.domain || '').toLowerCase();
    const brandScore = domain in brandOrder ? 100 - brandOrder[domain] * 10 : 0;
    const budgetScore = intent?.budget && c.price ? (c.price <= intent.budget ? 10 : -5) : 0;
    const brandPref = intent?.brand && c.title ? (new RegExp(intent.brand, 'i').test(c.title) ? 5 : 0) : 0;
    return { ...c, _score: brandScore + budgetScore + brandPref };
  });
  
  const dedup = new Map<string, any>();
  for (const c of scored.sort((a: any, b: any) => b._score - a._score)) {
    const key = (c.canonical || c.url || c.title).toLowerCase();
    if (!dedup.has(key)) dedup.set(key, c);
  }
  
  return { cards: Array.from(dedup.values()).slice(0, take) };
}

export async function decorate_redirects({ cards }: any) {
  const out = cards.map((c: any) => decorate(c));
  return { cards: out };
}

export async function log_event(params: any) {
  console.log('Event:', params.type, params.payload);
  return { success: true };
}
