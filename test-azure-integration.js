require('dotenv').config({ path: './apps/web/.env.local' });

async function testAzureIntegration() {
  console.log('Testing Azure OpenAI Integration...');
  
  const endpoint = process.env.AOAI_ENDPOINT?.replace(/\/$/, '');
  const url = `${endpoint}/openai/responses?api-version=${process.env.AOAI_API_VERSION}`;
  
  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: 'You are TWG Retail Shopping Consultant. You MUST search for products immediately when users ask for them.' },
      { role: 'user', content: 'Search for: laptop under $600' }
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
              description: 'The search query to find products' 
            }
          },
          required: ['query']
        }
      }
    ]
  };
  
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AOAI_API_KEY || ''
      },
      body: JSON.stringify(body)
    });
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.log('Error Response:', errorText);
      return;
    }
    
    const response = await resp.json();
    console.log('Response Status:', response.status);
    console.log('Response Output:', JSON.stringify(response.output, null, 2));
    
    // Check if tools were called
    const toolCalls = response.output?.filter(output => output.type === 'function_call');
    console.log('Tool Calls:', toolCalls.length);
    
    if (toolCalls.length > 0) {
      console.log('Tool Call Details:', JSON.stringify(toolCalls[0], null, 2));
    }
    
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testAzureIntegration();
