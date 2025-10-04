export async function chatWithTools(query: string, intent: any) {
  const sys = `You are TWG Retail Shopping Consultant. Strict TWG-first order: thewarehouse.co.nz → warehousestationery.co.nz → noelleeming.co.nz. 

When a user asks for products, you should:
1. Use site_search to find product URLs from TWG sites first
2. Use fetch_product_cards to get product details from those URLs
3. Use rank_and_dedup to prioritize TWG brands and remove duplicates
4. Use decorate_redirects to create tracked redirect URLs
5. Only expand to open web if TWG results are insufficient

Always prioritize The Warehouse Group brands and provide helpful, conversational responses.`;
  
  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: sys },
      { role: 'user', content: `User query: "${query}"\nIntent: ${JSON.stringify(intent)}` }
    ],
    temperature: 0.2,
    max_output_tokens: 900,
    tools: [
      { 
        type: 'function', 
        name: 'site_search', 
        input_schema: { 
          type: 'object', 
          properties: { 
            query: { type: 'string' }, 
            domains_priority: { type: 'array', items: { type: 'string' } }, 
            limit_per_domain: { type: 'number' } 
          }, 
          required: ['query','domains_priority'] 
        } 
      },
      { 
        type: 'function', 
        name: 'fetch_product_cards', 
        input_schema: { 
          type: 'object', 
          properties: { 
            urls: { type: 'array', items: { type: 'string' } }, 
            max: { type: 'number' } 
          }, 
          required: ['urls'] 
        } 
      },
      { 
        type: 'function', 
        name: 'rank_and_dedup', 
        input_schema: { 
          type: 'object', 
          properties: { 
            cards: { type: 'array', items: { type: 'object' } }, 
            intent: { type: 'object' }, 
            take: { type: 'number' } 
          }, 
          required: ['cards'] 
        } 
      },
      { 
        type: 'function', 
        name: 'decorate_redirects', 
        input_schema: { 
          type: 'object', 
          properties: { 
            cards: { type: 'array', items: { type: 'object' } } 
          }, 
          required: ['cards'] 
        } 
      },
      { 
        type: 'function', 
        name: 'log_event', 
        input_schema: { 
          type: 'object', 
          properties: { 
            type: { type: 'string' }, 
            payload: { type: 'object' } 
          }, 
          required: ['type','payload'] 
        } 
      }
    ]
  };
  
  const url = `${process.env.AOAI_ENDPOINT}/openai/responses?api-version=${process.env.AOAI_API_VERSION}`;
  const resp = await fetch(url, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
      'api-key': process.env.AOAI_API_KEY || '' 
    }, 
    body: JSON.stringify(body) 
  });
  
  if (!resp.ok) throw new Error('AOAI error: ' + (await resp.text()));
  return resp.json();
}
