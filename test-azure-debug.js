require('dotenv').config({ path: './apps/web/.env.local' });

async function testAzureOpenAI() {
  console.log('Environment Variables:');
  console.log('AOAI_ENDPOINT:', process.env.AOAI_ENDPOINT);
  console.log('AOAI_API_VERSION:', process.env.AOAI_API_VERSION);
  console.log('AOAI_API_KEY:', process.env.AOAI_API_KEY ? 'SET' : 'NOT SET');
  console.log('AOAI_GPT5_DEPLOYMENT:', process.env.AOAI_GPT5_DEPLOYMENT);
  
  const endpoint = process.env.AOAI_ENDPOINT?.replace(/\/$/, '');
  const url = `${endpoint}/openai/responses?api-version=${process.env.AOAI_API_VERSION}`;
  
  console.log('\nAPI URL:', url);
  
  const body = {
    model: process.env.AOAI_GPT5_DEPLOYMENT,
    input: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello, can you help me?' }
    ],
    max_output_tokens: 100,
    tools: [
      {
        type: 'function',
        name: 'test_tool',
        description: 'A simple test tool',
        parameters: {
          type: 'object',
          properties: {
            message: { 
              type: 'string', 
              description: 'A test message' 
            }
          },
          required: ['message']
        }
      }
    ]
  };
  
  console.log('\nRequest Body:', JSON.stringify(body, null, 2));
  
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.AOAI_API_KEY || ''
      },
      body: JSON.stringify(body)
    });
    
    console.log('\nResponse Status:', resp.status);
    console.log('Response Headers:', Object.fromEntries(resp.headers.entries()));
    
    if (!resp.ok) {
      const errorText = await resp.text();
      console.log('Error Response:', errorText);
      return;
    }
    
    const response = await resp.json();
    console.log('\nSuccess Response:', JSON.stringify(response, null, 2));
    
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

testAzureOpenAI();
