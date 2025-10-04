import { site_search, fetch_product_cards, rank_and_dedup, decorate_redirects, log_event } from './tools-server';

export async function chatWithTools(query: string, intent: any, conversationHistory: any[] = []) {
  // Count clarifying questions in conversation history
  const questionCount = conversationHistory.filter(msg => 
    msg.role === 'assistant' && msg.content.includes('?')
  ).length;

  const sys = `You are TWG Retail Shopping Consultant. You help users find products from The Warehouse Group brands.

SMART CONVERSATION RULES:
1. DEFAULT TO ASKING CLARIFYING QUESTIONS unless the query is very specific
2. Only search immediately for queries that include BOTH product type AND specific details (budget, brand, size, etc.)
3. Ask clarifying questions for queries that are missing key information (budget, size, brand, use case)
4. NEVER ask more than 3 clarifying questions total in a conversation
5. Always prioritize TWG brands: The Warehouse → Warehouse Stationery → Noel Leeming

CLARIFYING QUESTION EXAMPLES (ask questions for these):
- "laptop" → "What's your budget range for the laptop? Are you looking for something under $500, $500-1000, or over $1000?"
- "TV" → "What size TV are you looking for? And what's your budget range?"
- "camera" → "Are you looking for a security camera for home monitoring, or a digital camera for photography?"
- "laptop for work" → "What's your budget range? And do you need Windows or are you open to Chromebooks?"
- "TV for bedroom" → "What size would work best for your bedroom? And what's your budget range?"
- "help" → "What type of products are you looking for? I can help you find electronics, home goods, office supplies, and more!"

SEARCH IMMEDIATELY ONLY FOR THESE (very specific queries):
- "laptop under $600" → Search immediately (has budget)
- "Samsung 55 inch TV" → Search immediately (has brand and size)
- "wireless security camera under $200" → Search immediately (has type, connectivity, and budget)
- "office chair ergonomic under $300" → Search immediately (has type, features, and budget)
- "MacBook Air 13 inch" → Search immediately (has brand and size)

AFTER SEARCHING:
- Analyze the search results and provide intelligent recommendations
- Present 3-6 best products with titles, images, prices, and merchants
- Highlight TWG products prominently and explain why they're good choices
- Provide brief analysis: "Based on your budget of $X, here are the best options..."
- Mention key features, value for money, and suitability for the user's needs
- Ask if they need more specific options or have other questions

IMPORTANT: When presenting search results, provide a helpful analysis like:
"Based on your budget of $500 for general use, I found some excellent laptop options from The Warehouse Group. Here are my top recommendations:

1. **Lenovo 11.6 inch Chromebook ($399)** - Perfect for general use, web browsing, and basic productivity. Great value for money.

2. **Lenovo 14 inch Notebook ($478)** - More powerful option with Windows 11, ideal if you need Microsoft Office compatibility.

The Chromebook is excellent for general use and saves you $100, while the Windows notebook offers more versatility for work tasks."

CONVERSATION CONTEXT: You have asked ${questionCount} clarifying questions so far. ${questionCount >= 3 ? 'Do not ask any more questions - search immediately with what you know.' : 'You can ask up to ' + (3 - questionCount) + ' more questions if needed.'}

Never fabricate prices/stock - only use data from search results.`;

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
