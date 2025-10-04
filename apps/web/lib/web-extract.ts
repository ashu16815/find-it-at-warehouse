import * as cheerio from 'cheerio';

function abs(s?: string, b?: string) { 
  try { 
    return s ? new URL(s, b).toString() : undefined; 
  } catch { 
    return undefined; 
  } 
}

export async function extractCards(urls: string[]) {
  const cards: any[] = [];
  
  for (const url of urls) {
    try {
      const html = await fetch(url, { 
        headers: { 'User-Agent': 'TWG-FindIt/1.0' } 
      }).then(r => r.text());
      
      const $ = cheerio.load(html);
      
      const title = $('meta[property="og:title"]').attr('content') || 
                   $('title').text() || 
                   'View product';
      
      const image = abs(
        $('meta[property="og:image"]').attr('content') || 
        $('img').first().attr('src'), 
        url
      );
      
      const priceTxt = $('[data-test="price"], [itemprop="price"]').first().text() || 
                      $('meta[property="product:price:amount"]').attr('content') || '';
      
      const price = priceTxt ? Number(priceTxt.replace(/[^0-9.]/g, '')) : undefined;
      
      const domain = new URL(url).hostname.replace(/^www\./, '');
      
      const merchant = /thewarehouse\.co\.nz$/.test(domain) ? 'The Warehouse' : 
                      /warehousestationery\.co\.nz$/.test(domain) ? 'Warehouse Stationery' : 
                      /noelleeming\.co\.nz$/.test(domain) ? 'Noel Leeming' : 
                      domain;
      
      const label = (/thewarehouse|warehousestationery|noelleeming/.test(domain)) ? 'TWG' : 'External';
      
      cards.push({ title, image, price, url, domain, merchant, label });
    } catch (error) {
      console.error(`Error extracting from ${url}:`, error);
    }
  }
  
  return cards;
}
