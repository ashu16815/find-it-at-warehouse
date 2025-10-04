import { site_search, fetch_product_cards, rank_and_dedup, decorate_redirects, log_event } from './tools-server';

export async function chatWithTools(query: string, intent: any, conversationHistory: any[] = []) {
  const sys = `You are TWG Retail Shopping Consultant. You MUST search for products immediately when users ask for them.

CRITICAL RULES:
1. When user asks for ANY product (laptop, TV, camera, etc.) - IMMEDIATELY call site_search tool with their EXACT query
2. NEVER ask clarifying questions for specific product requests like "laptop under $600" or "TV recommendations"
3. ALWAYS use the complete tool chain: site_search → fetch_product_cards → rank_and_dedup → decorate_redirects
4. Return 3-6 product tiles with title, image, price, merchant, and tracked redirect URL
5. Only ask questions if the query is completely vague like just "help" or "what should I buy"
6. For ANY product request with details (budget, brand, type) - SEARCH IMMEDIATELY
7. Never fabricate prices/stock - only use data from tools
8. Label non-TWG products as "External"

TOOL USAGE EXAMPLES:
- User: "laptop under $600" → Call site_search with query: "laptop under $600"
- User: "Samsung TV" → Call site_search with query: "Samsung TV"
- User: "camera recommendations" → Call site_search with query: "camera recommendations"
- User: "help me" → Ask what they need help with

IMPORTANT: Always pass the user's EXACT query to the site_search tool. Do not modify or interpret it.

SEARCH FIRST, ASK QUESTIONS ONLY IF ABSOLUTELY NECESSARY.`;

  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: sys },
      ...conversationHistory,
      { role: 'user', content: `Search for: ${query}` }
    ],
    max_output_tokens: 2000,
    tools: [
      {
        type: 'function',
        name: 'site_search',
        description: 'Search for products on The Warehouse Group websites',
        parameters: {
          type: 'object',
          properties: {
            query: { 
              type: 'string', 
              description: 'The search query to find products (e.g., "laptop under $600", "Samsung TV", "security camera")' 
            },
            domains_priority: { 
              type: 'array', 
              items: { type: 'string' }, 
              description: 'Priority domains to search',
              default: ['thewarehouse.co.nz', 'warehousestationery.co.nz', 'noelleeming.co.nz']
            },
            limit_per_domain: { 
              type: 'number', 
              description: 'Number of results per domain',
              default: 8
            }
          },
          required: ['query']
        }
      },
      {
        type: 'function',
        name: 'fetch_product_cards',
        description: 'Extract product information from URLs',
        parameters: {
          type: 'object',
          properties: {
            urls: { 
              type: 'array', 
              items: { type: 'string' }, 
              description: 'URLs to extract product information from' 
            },
            max: { 
              type: 'number', 
              description: 'Maximum number of products to fetch',
              default: 18
            }
          },
          required: ['urls']
        }
      },
      {
        type: 'function',
        name: 'rank_and_dedup',
        description: 'Rank and deduplicate product cards',
        parameters: {
          type: 'object',
          properties: {
            cards: { 
              type: 'array', 
              items: { type: 'object' }, 
              description: 'Product cards to rank and deduplicate' 
            },
            intent: { 
              type: 'object', 
              description: 'User intent for ranking' 
            },
            take: { 
              type: 'number', 
              description: 'Number of top results to return',
              default: 9
            }
          },
          required: ['cards']
        }
      },
      {
        type: 'function',
        name: 'decorate_redirects',
        description: 'Add tracked redirect URLs to product cards',
        parameters: {
          type: 'object',
          properties: {
            cards: { 
              type: 'array', 
              items: { type: 'object' }, 
              description: 'Product cards to add redirect URLs to' 
            }
          },
          required: ['cards']
        }
      },
      {
        type: 'function',
        name: 'log_event',
        description: 'Log events for analytics',
        parameters: {
          type: 'object',
          properties: {
            type: { 
              type: 'string', 
              description: 'Event type to log' 
            },
            payload: { 
              type: 'object', 
              description: 'Event data to log' 
            }
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
