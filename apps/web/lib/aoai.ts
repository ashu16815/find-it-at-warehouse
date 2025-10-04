export async function chatWithTools(query: string, intent: any, conversationHistory: any[] = []) {
  const sys = `You are TWG Retail Shopping Consultant. Your role is to:

1. ALWAYS maintain conversation context - if the user gives a short answer like "outdoor" or "wireless", understand it as a response to your previous questions
2. Ask clarifying questions when the user's request is vague or incomplete
3. Understand the user's specific needs, budget, and preferences
4. Search TWG products first (The Warehouse → Warehouse Stationery → Noel Leeming)
5. Provide personalized recommendations based on their answers
6. Never fabricate prices or stock information

CONVERSATION CONTEXT RULES:
- If user gives a short answer (1-2 words), treat it as a response to your most recent question
- Build on previous answers to ask follow-up questions
- Don't restart the conversation unless the user explicitly changes topics
- Keep track of what information you've already gathered

Examples of clarifying questions:
- "What's your budget range for this item?"
- "What specific features are most important to you?"
- "Is this for personal use or business?"
- "Do you have any brand preferences?"
- "What size/color are you looking for?"
- "Are you looking for indoor or outdoor security cameras?"
- "Do you need wireless or wired cameras?"

When you have enough information, use these tools in order:
1. site_search to find product URLs from TWG sites first
2. fetch_product_cards to get product details from those URLs
3. rank_and_dedup to prioritize TWG brands and remove duplicates
4. decorate_redirects to create tracked redirect URLs

Be conversational, helpful, and always prioritize The Warehouse Group brands.`;
  
  // Build conversation history
  const messages = [
    { role: 'system', content: sys },
    ...conversationHistory,
    { role: 'user', content: JSON.stringify({ query, intent }) }
  ];

  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: messages,
    max_output_tokens: 1500,
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
  console.log('Making Azure OpenAI request to:', url);
  console.log('Request body:', JSON.stringify(body, null, 2));
  
  const resp = await fetch(url, { 
    method: 'POST', 
    headers: { 
      'Content-Type': 'application/json', 
      'api-key': process.env.AOAI_API_KEY || '' 
    }, 
    body: JSON.stringify(body) 
  });
  
  console.log('Azure OpenAI response status:', resp.status);
  
  if (!resp.ok) {
    const errorText = await resp.text();
    console.error('Azure OpenAI error:', errorText);
    throw new Error('AOAI error: ' + errorText);
  }
  
  const result = await resp.json();
  console.log('Azure OpenAI response:', JSON.stringify(result, null, 2));
  return result;
}
