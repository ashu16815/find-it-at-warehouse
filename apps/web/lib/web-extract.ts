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
      const domain = new URL(url).hostname.replace(/^www\./, '');
      
      // Check if this is a search result page
      if (url.includes('/search?q=')) {
        console.log(`Processing search result page: ${url}`);
        
        // Extract product links from search results
        const productLinks: string[] = [];
        
        // Try different selectors for product links
        $('a[href*="/p/"], a[href*="/product/"], a[href*="/item/"]').each((_, el) => {
          const href = $(el).attr('href');
          if (href) {
            const productUrl = abs(href, url);
            if (productUrl && !productLinks.includes(productUrl)) {
              productLinks.push(productUrl);
            }
          }
        });
        
        // Also try data attributes and other common patterns
        $('[data-product-url], [data-href]').each((_, el) => {
          const productUrl = $(el).attr('data-product-url') || $(el).attr('data-href');
          if (productUrl) {
            const fullUrl = abs(productUrl, url);
            if (fullUrl && !productLinks.includes(fullUrl)) {
              productLinks.push(fullUrl);
            }
          }
        });
        
        console.log(`Found ${productLinks.length} product links from search page`);
        
        // Extract product details from each product link
        for (const productUrl of productLinks.slice(0, 5)) { // Limit to 5 products per search page
          try {
            const productHtml = await fetch(productUrl, { 
              headers: { 'User-Agent': 'TWG-FindIt/1.0' } 
            }).then(r => r.text());
            
            const $product = cheerio.load(productHtml);
            
            const title = $product('meta[property="og:title"]').attr('content') || 
                         $product('h1').first().text() || 
                         $product('title').text() || 
                         'Product';
            
            const image = abs(
              $product('meta[property="og:image"]').attr('content') || 
              $product('img[alt*="product"], img[class*="product"]').first().attr('src') ||
              $product('img').first().attr('src'), 
              productUrl
            );
            
            const priceTxt = $product('[data-test="price"], [itemprop="price"], .price').first().text() || 
                            $product('meta[property="product:price:amount"]').attr('content') || '';
            
            let price = priceTxt ? Number(priceTxt.replace(/[^0-9.]/g, '')) : undefined;
            
            // Convert cents to dollars if price seems too high (likely in cents)
            if (price && price > 1000) {
              price = price / 100;
            }
            
            const merchant = /thewarehouse\.co\.nz$/.test(domain) ? 'The Warehouse' : 
                            /warehousestationery\.co\.nz$/.test(domain) ? 'Warehouse Stationery' : 
                            /noelleeming\.co\.nz$/.test(domain) ? 'Noel Leeming' : 
                            domain;
            
            const label = (/thewarehouse|warehousestationery|noelleeming/.test(domain)) ? 'TWG' : 'External';
            
            cards.push({ 
              title: title.trim(), 
              image, 
              price, 
              url: productUrl, 
              domain, 
              merchant, 
              label 
            });
            
            console.log(`Extracted product: ${title.trim()}`);
          } catch (productError) {
            console.error(`Error extracting product from ${productUrl}:`, productError);
          }
        }
      } else {
        // Handle individual product pages
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
        
        let price = priceTxt ? Number(priceTxt.replace(/[^0-9.]/g, '')) : undefined;
        
        // Convert cents to dollars if price seems too high (likely in cents)
        if (price && price > 1000) {
          price = price / 100;
        }
        
        const merchant = /thewarehouse\.co\.nz$/.test(domain) ? 'The Warehouse' : 
                        /warehousestationery\.co\.nz$/.test(domain) ? 'Warehouse Stationery' : 
                        /noelleeming\.co\.nz$/.test(domain) ? 'Noel Leeming' : 
                        domain;
        
        const label = (/thewarehouse|warehousestationery|noelleeming/.test(domain)) ? 'TWG' : 'External';
        
        cards.push({ title, image, price, url, domain, merchant, label });
      }
    } catch (error) {
      console.error(`Error extracting from ${url}:`, error);
    }
  }
  
  return cards;
}
