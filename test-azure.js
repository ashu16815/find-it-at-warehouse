#!/usr/bin/env node

// Test script to verify Azure OpenAI configuration
require('dotenv').config({ path: './apps/web/.env.local' });

const testAzureConfig = async () => {
  console.log('🔍 Testing Azure OpenAI Configuration...\n');
  
  const config = {
    endpoint: process.env.AOAI_ENDPOINT,
    apiKey: process.env.AOAI_API_KEY,
    deployment: process.env.AOAI_GPT5_DEPLOYMENT,
    apiVersion: process.env.AOAI_API_VERSION || '2025-04-01-preview'
  };
  
  console.log('Configuration Status:');
  console.log(`✅ AOAI_ENDPOINT: ${config.endpoint ? 'SET' : '❌ NOT SET'}`);
  console.log(`✅ AOAI_API_KEY: ${config.apiKey ? 'SET' : '❌ NOT SET'}`);
  console.log(`✅ AOAI_GPT5_DEPLOYMENT: ${config.deployment ? 'SET' : '❌ NOT SET'}`);
  console.log(`✅ AOAI_API_VERSION: ${config.apiVersion}\n`);
  
  if (!config.endpoint || !config.apiKey || !config.deployment) {
    console.log('❌ Azure OpenAI is NOT properly configured');
    console.log('\nMissing variables:');
    if (!config.endpoint) console.log('  - AOAI_ENDPOINT');
    if (!config.apiKey) console.log('  - AOAI_API_KEY');
    if (!config.deployment) console.log('  - AOAI_GPT5_DEPLOYMENT');
    console.log('\n📖 See AZURE_SETUP.md for configuration instructions');
    return false;
  }
  
  console.log('🧪 Testing Azure OpenAI connection...');
  
  try {
    const url = `${config.endpoint}/openai/responses?api-version=${config.apiVersion}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': config.apiKey
      },
      body: JSON.stringify({
        model: config.deployment,
        input: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: 'Say hello' }
        ],
        temperature: 0.2,
        max_output_tokens: 100
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Azure OpenAI connection successful!');
      console.log(`Response: ${data.choices?.[0]?.message?.content || 'No content'}`);
      return true;
    } else {
      const error = await response.text();
      console.log('❌ Azure OpenAI connection failed');
      console.log(`Status: ${response.status}`);
      console.log(`Error: ${error}`);
      return false;
    }
  } catch (error) {
    console.log('❌ Azure OpenAI connection failed');
    console.log(`Error: ${error.message}`);
    return false;
  }
};

testAzureConfig().then(success => {
  if (success) {
    console.log('\n🎉 Azure OpenAI is ready! Your chat will now use AI responses.');
  } else {
    console.log('\n⚠️  Azure OpenAI is not configured. Chat will use fallback mode.');
  }
  process.exit(success ? 0 : 1);
});
