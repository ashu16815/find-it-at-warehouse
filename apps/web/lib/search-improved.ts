import * as cheerio from 'cheerio';

type Card = {
  title: string;
  price?: number;
  in_stock?: boolean;
  merchant: string;
  domain: string;
  sku?: string;
  image?: string;
  specs?: Record<string,string>;
  redirect_url: string;
  label: 'TWG' | 'External';
  relevance?: number;
};

type SearchOpts = { budget?: number; category?: string; limit?: number };

const TWG_SITES = [
  { name: 'The Warehouse', domain: 'thewarehouse.co.nz', base: 'https://www.thewarehouse.co.nz' },
  { name: 'Warehouse Stationery', domain: 'warehousestationery.co.nz', base: 'https://www.warehousestationery.co.nz' },
  { name: 'Noel Leeming', domain: 'noelleeming.co.nz', base: 'https://www.noelleeming.co.nz' },
];

function absolutify(url: string | undefined, base: string): string | undefined {
  if (!url) return undefined;
  try {
    return new URL(url, base).toString();
  } catch {
    return undefined;
  }
}

export async function searchTWG(query: string, opts: SearchOpts): Promise<Card[]> {
  const cards: Card[] = [];
  const limit = opts.limit || 6;
  
  for (const site of TWG_SITES) {
    try {
      // Try different search URL patterns for each site
      let searchUrl = `${site.base}/search?q=${encodeURIComponent(query)}`;
      
      console.log(`Searching ${site.name}: ${searchUrl}`);
      
      const html = await fetch(searchUrl, { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        } 
      }).then(r => {
        if (!r.ok) {
          console.log(`Search failed for ${site.name}: ${r.status} ${r.statusText}`);
          return null;
        }
        return r.text();
      }).catch(err => {
        console.log(`Search error for ${site.name}:`, err.message);
        return null;
      });
      
      if (!html) continue;
      
      const $ = cheerio.load(html);
      
      // Look for product links with various patterns
      const productSelectors = [
        'a[href*="/p/"]',
        'a[href*="/product/"]', 
        'a[href*="/products/"]',
        'a[href*="/item/"]',
        '.product-item a',
        '.product-card a',
        '[data-testid*="product"] a'
      ];
      
      const anchors = new Set<string>();
      
      productSelectors.forEach(selector => {
        $(selector).each((_, el) => {
          const href = $(el).attr('href');
          if (href && !href.includes('javascript:') && !href.includes('#')) {
            try {
              const fullUrl = new URL(href, site.base).toString();
              anchors.add(fullUrl);
            } catch (e) {
              // Skip invalid URLs
            }
          }
        });
      });
      
      console.log(`Found ${anchors.size} product links on ${site.name}`);
      
      // Process each product link
      for (const href of Array.from(anchors).slice(0, Math.min(limit, 10))) {
        try {
          const rel = href.replace(site.base, '');
          const $a = $(`a[href='${rel}']`).first();
          
          // Try multiple selectors for title
          const titleSelectors = [
            '[data-test="product-title"]',
            '.product-title',
            '.product-name', 
            'h3',
            'h4',
            '.title',
            '[data-testid*="title"]'
          ];
          
          let title = '';
          for (const selector of titleSelectors) {
            title = $a.find(selector).text().trim();
            if (title) break;
          }
          
          // Fallback to link text or URL-based title
          if (!title) {
            title = $a.text().trim() || href.split('/').pop()?.replace(/[-_]/g, ' ') || 'View product';
          }
          
          // Try multiple selectors for image
          const imgSelectors = [
            'img[src]',
            'img[data-src]',
            'img[data-lazy]',
            '[data-testid*="image"] img'
          ];
          
          let imgRaw = '';
          for (const selector of imgSelectors) {
            imgRaw = $a.find(selector).attr('src') || $a.find(selector).attr('data-src') || $a.find(selector).attr('data-lazy') || '';
            if (imgRaw) break;
          }
          
          const image = imgRaw ? absolutify(imgRaw, site.base) : undefined;
          
          // Try multiple selectors for price
          const priceSelectors = [
            '[data-test="price"]',
            '.price',
            '.product-price',
            '.cost',
            '[data-testid*="price"]',
            '.amount'
          ];
          
          let priceText = '';
          for (const selector of priceSelectors) {
            priceText = $a.closest('[data-test="product-card"], .product-card, .product-item').find(selector).text() || '';
            if (priceText) break;
          }
          
          const price = priceText ? Number(priceText.replace(/[^0-9.]/g,'')) : undefined;
          
          // Only add if we have a meaningful title
          if (title && title !== 'View product' && title.length > 3) {
            cards.push({ 
              title, 
              price, 
              merchant: site.name, 
              domain: site.domain, 
              image, 
              redirect_url: `/api/redirect?u=${encodeURIComponent(href)}&meta=${encodeURIComponent(JSON.stringify({ brand: site.name, domain: site.domain }))}`, 
              label: 'TWG' 
            });
          }
        } catch (err) {
          console.log(`Error processing product link ${href}:`, err.message);
        }
      }
    } catch (err) {
      console.log(`Error searching ${site.name}:`, err.message);
    }
  }
  
  console.log(`Total products found: ${cards.length}`);
  return cards;
}

export async function searchExternal(query: string, opts: SearchOpts): Promise<Card[]> {
  // TODO: integrate Bing Custom Search or Skimlinks catalog; label as External
  return [];
}
