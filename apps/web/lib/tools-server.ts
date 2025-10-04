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
  
  // First, filter out invalid products
  const validCards = cards.filter((c: any) => {
    const title = (c.title || '').toLowerCase();
    const url = (c.url || '').toLowerCase();
    
    // Filter out invalid products
    if (
      title === 'product' ||
      title === 'just a moment...' ||
      title.includes('search results for') ||
      title.includes('cart') ||
      title.includes('minicart') ||
      url.includes('/cart/') ||
      url.includes('/search/update') ||
      !c.title ||
      !c.url ||
      c.title.length < 3
    ) {
      return false;
    }
    
    return true;
  });
  
  const scored = validCards.map((c: any) => {
    const d = (c.domain || '').toLowerCase();
    const title = (c.title || '').toLowerCase();
    
    // Brand priority score
    const brandScore = d in order ? 100 - order[d] * 10 : 0;
    
    // Budget score
    const budgetScore = intent?.budget && c.price ? (c.price <= intent.budget ? 10 : -5) : 0;
    
    // Brand preference score
    const prefScore = intent?.brand && c.title ? (new RegExp(intent.brand, 'i').test(c.title) ? 5 : 0) : 0;
    
    // Product relevance score - prioritize real products over toys/accessories
    let relevanceScore = 0;
    if (title.includes('chromebook') || title.includes('notebook') || title.includes('laptop')) {
      // Only count as real laptop if it's not a toy
      if (!title.includes('disney') && !title.includes('vtech') && !title.includes('fisher-price') && !title.includes('toy') && !title.includes('learning')) {
        relevanceScore = 50; // Real laptops get very high score
      } else {
        relevanceScore = -50; // Toy laptops get very negative score
      }
    } else if (title.includes('disney') || title.includes('vtech') || title.includes('fisher-price') || title.includes('toy') || title.includes('learning')) {
      relevanceScore = -50; // Toy laptops get very negative score
    } else if (title.includes('bag') || title.includes('case') || title.includes('accessory')) {
      relevanceScore = -30; // Accessories get lower score
    }
    
    // Price reasonableness score - very cheap items are likely toys
    const priceScore = c.price && c.price < 100 ? -30 : 0;
    
    return { ...c, _s: brandScore + budgetScore + prefScore + relevanceScore + priceScore };
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
