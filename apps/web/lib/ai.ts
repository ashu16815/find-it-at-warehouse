export async function consult(query: string, context: any) {
  const sys = `You are an intelligent TWG retail shopping consultant for The Warehouse Group (TWG). Your role is to:

1. ALWAYS search TWG products first using the search_twg function
2. Prioritize results in this order: The Warehouse (thewarehouse.co.nz) → Warehouse Stationery (warehousestationery.co.nz) → Noel Leeming (noelleeming.co.nz)
3. When searching, use the user's exact query terms and any budget constraints
4. Ask clarifying questions ONLY when the user's request is very vague
5. Provide personalized recommendations based on TWG inventory
6. Never fabricate prices or stock information

TWG Brand Focus:
- The Warehouse: General merchandise, home goods, electronics
- Warehouse Stationery: Office supplies, computers, printers, furniture
- Noel Leeming: Premium technology, appliances, mobile devices

Search Strategy:
- Use the search_twg function with the user's query
- Include budget constraints if mentioned
- Prioritize TWG brands over external options
- Provide specific product recommendations with prices

Be conversational, helpful, and always prioritize The Warehouse Group brands.`;
  
  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: sys },
      { role: 'user', content: JSON.stringify({ query, context }) }
    ],
    max_output_tokens: 500,
    tools: [
      { 
        type: 'function', 
        name: 'search_twg', 
        input_schema: { 
          type: 'object', 
          properties: { 
            query: { type: 'string' }, 
            budget: { type: 'number' }, 
            brand: { type: 'string' }, 
            category: { type: 'string' }, 
            limit: { type: 'number' } 
          }, 
          required: ['query'] 
        } 
      },
      { 
        type: 'function', 
        name: 'search_external', 
        input_schema: { 
          type: 'object', 
          properties: { 
            query: { type: 'string' }, 
            limit: { type: 'number' } 
          }, 
          required: ['query'] 
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
  
  if (!resp.ok) {
    throw new Error('AOAI error: ' + (await resp.text()));
  }
  
  return resp.json();
}
