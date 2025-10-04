// TWG-first search: use on-site search pages and parse to product cards with images.
import * as cheerio from 'cheerio';

function absolutify(src?: string, base?: string): string | undefined { 
  if (!src) return undefined; 
  try { 
    return new URL(src, base).toString(); 
  } catch { 
    return undefined; 
  } 
}

export type Card = { 
  title: string; 
  price?: number; 
  merchant: string; 
  domain: string; 
  image?: string; 
  redirect_url: string; 
  label: 'TWG'|'External'; 
};

const TWG_SITES = [
  { name: 'The Warehouse', domain: 'thewarehouse.co.nz', base: 'https://www.thewarehouse.co.nz' },
  { name: 'Warehouse Stationery', domain: 'warehousestationery.co.nz', base: 'https://www.warehousestationery.co.nz' },
  { name: 'Noel Leeming', domain: 'noelleeming.co.nz', base: 'https://www.noelleeming.co.nz' },
];

export async function searchTWG(query: string, { limit = 12 } = {}) {
  const cards: Card[] = [];
  
  for (const site of TWG_SITES) {
    const url = `${site.base}/search?q=${encodeURIComponent(query)}`;
    const html = await fetch(url, { headers: { 'User-Agent': 'TWG-FindIt/1.0' } }).then(r=>r.text()).catch(()=>null);
    if (!html) continue;
    
    const $ = cheerio.load(html);
    const anchors = new Set<string>();
    $("a[href*='/p/'], a[href*='/product/'], a[href*='/products/']").each((_,el)=>{
      const href = $(el).attr('href'); 
      if (href) anchors.add(new URL(href, site.base).toString()); 
    });
    
    for (const href of Array.from(anchors).slice(0, limit)) {
      const rel = href.replace(site.base, '');
      const $a = $(`a[href='${rel}']`).first();
      const title = ($a.find('[data-test="product-title"]').text() || $a.attr('title') || $a.text() || 'View product').trim();
      const imgRaw = $a.find('img').attr('src') || $a.find('img').attr('data-src') || $('meta[property="og:image"]').attr('content') || undefined;
      const image = absolutify(imgRaw, site.base);
      const priceText = $a.closest('[data-test="product-card"]').find('[data-test="price"]').text() || '';
      const price = priceText ? Number(priceText.replace(/[^0-9.]/g,'')) : undefined;
      
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
  }
  
  return cards;
}

