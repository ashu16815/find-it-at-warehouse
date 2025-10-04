import { site_search, fetch_product_cards, rank_and_dedup, decorate_redirects, log_event } from './tools-server';

export async function chatWithTools(query: string, intent: any, conversationHistory: any[] = []) {
  const sys = `You are TWG Retail Shopping Consultant. You MUST search for products immediately when users ask for them.

CRITICAL RULES:
1. When user asks for ANY product (laptop, TV, camera, etc.) - IMMEDIATELY call site_search tool with their query
2. NEVER ask clarifying questions for specific product requests like "laptop under $600" or "TV recommendations"
3. ALWAYS use the complete tool chain: site_search → fetch_product_cards → rank_and_dedup → decorate_redirects
4. Return 3-6 product tiles with title, image, price, merchant, and tracked redirect URL
5. Only ask questions if the query is completely vague like just "help" or "what should I buy"
6. For ANY product request with details (budget, brand, type) - SEARCH IMMEDIATELY
7. Never fabricate prices/stock - only use data from tools
8. Label non-TWG products as "External"

EXAMPLES:
- "laptop under $600" → IMMEDIATELY search for laptops
- "Samsung TV" → IMMEDIATELY search for Samsung TVs  
- "camera recommendations" → IMMEDIATELY search for cameras
- "help me" → Ask what they need help with

SEARCH FIRST, ASK QUESTIONS ONLY IF ABSOLUTELY NECESSARY.`;

  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: sys },
      ...conversationHistory,
      { role: 'user', content: JSON.stringify({ query, intent }) }
    ],
    max_output_tokens: 900,
    tools: [
      {
        type: 'function',
        name: 'site_search',
        input_schema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'The search query to find products' },
            domains_priority: { type: 'array', items: { type: 'string' }, description: 'Priority domains to search' },
            limit_per_domain: { type: 'number', description: 'Number of results per domain' }
          },
          required: ['query']
        }
      },
      {
        type: 'function',
        name: 'fetch_product_cards',
        input_schema: {
          type: 'object',
          properties: {
            urls: { type: 'array', items: { type: 'string' }, description: 'URLs to extract product information from' },
            max: { type: 'number', description: 'Maximum number of products to fetch' }
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
            cards: { type: 'array', items: { type: 'object' }, description: 'Product cards to rank and deduplicate' },
            intent: { type: 'object', description: 'User intent for ranking' },
            take: { type: 'number', description: 'Number of top results to return' }
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
            cards: { type: 'array', items: { type: 'object' }, description: 'Product cards to add redirect URLs to' }
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
            type: { type: 'string', description: 'Event type to log' },
            payload: { type: 'object', description: 'Event data to log' }
          },
          required: ['type', 'payload']
        }
      }
    ]
  };

      const endpoint = process.env.AOAI_ENDPOINT?.replace(/\/$/, ''); // Remove trailing slash
      const url = `${endpoint}/openai/responses?api-version=${process.env.AOAI_API_VERSION}`;
  
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

  const response = await resp.json();
  
      // Process tool calls
      let finalProducts: any[] = [];
      if (response.output && response.output.length > 0) {
        for (const output of response.output) {
          if (output.type === 'function_call' && output.status === 'completed') {
            const toolName = output.name;
            const toolParams = JSON.parse(output.arguments || '{}');
            
            const tools = { site_search, fetch_product_cards, rank_and_dedup, decorate_redirects, log_event };
            
            if (tools[toolName as keyof typeof tools]) {
              try {
                const result = await tools[toolName as keyof typeof tools](toolParams);
                console.log(`Tool ${toolName} result:`, result);
                
                // If this is the final decorate_redirects call, extract products
                if (toolName === 'decorate_redirects' && result && 'cards' in result) {
                  finalProducts = (result as any).cards;
                }
              } catch (error) {
                console.error(`Tool ${toolName} error:`, error);
              }
            }
          }
        }
      }
      
      // If we got products from tools, return them
      if (finalProducts.length > 0) {
        return {
          ...response,
          products: finalProducts,
          message: 'I found some products for you!',
          source: 'azure_openai_tools'
        };
      }

  return response;
}
