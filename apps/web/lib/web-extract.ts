import * as cheerio from 'cheerio';

function abs(src?: string, base?: string) { 
  try { 
    return src ? new URL(src, base).toString() : undefined; 
  } catch { 
    return undefined; 
  } 
}

export async function extractCards(urls: string[]) {
  const cards: any[] = [];
  
  for (const url of urls) {
    try {
      const html = await fetch(url, { 
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' 
        } 
      }).then(r => r.text());
      
      const $ = cheerio.load(html);
      
      const title = $('meta[property="og:title"]').attr('content') || 
                   $('title').text() || 
                   $('h1').first().text() || 
                   'View product';
      
      const image = abs(
        $('meta[property="og:image"]').attr('content') || 
        $('img').first().attr('src'), 
        url
      );
      
      const priceTxt = $('[data-test="price"], [itemprop="price"]').first().text() || 
                      $('meta[property="product:price:amount"]').attr('content') || 
                      $('.price').first().text() || 
                      '';
      
      const price = priceTxt ? Number(priceTxt.replace(/[^0-9.]/g, '')) : undefined;
      const domain = new URL(url).hostname.replace(/^www\./, '');
      
      cards.push({ 
        title, 
        image, 
        price, 
        url, 
        domain, 
        merchant: merchantFrom(domain), 
        label: isTWG(domain) ? 'TWG' : 'External' 
      });
    } catch (err) {
      console.log(`Error extracting card from ${url}:`, err);
    }
  }
  
  return cards;
}

function isTWG(domain: string) { 
  return /(^|\.)thewarehouse\.co\.nz$/.test(domain) || 
         /(^|\.)warehousestationery\.co\.nz$/.test(domain) || 
         /(^|\.)noelleeming\.co\.nz$/.test(domain); 
}

function merchantFrom(domain: string) {
  if (/thewarehouse\.co\.nz$/.test(domain)) return 'The Warehouse';
  if (/warehousestationery\.co\.nz$/.test(domain)) return 'Warehouse Stationery';
  if (/noelleeming\.co\.nz$/.test(domain)) return 'Noel Leeming';
  return domain;
}
