require('dotenv').config({ path: './apps/web/.env.local' });

async function testToolDirect() {
  console.log('Testing site_search tool directly...');
  
  // Import the tool function
  const { site_search } = require('./apps/web/lib/tools-server.js');
  
  try {
    const result = await site_search({
      query: 'laptop under $600',
      domains_priority: ['thewarehouse.co.nz', 'warehousestationery.co.nz', 'noelleeming.co.nz'],
      limit_per_domain: 3
    });
    
    console.log('Tool result:', JSON.stringify(result, null, 2));
    
    // Check the URLs
    console.log('\nFirst 3 URLs:');
    result.urls.slice(0, 3).forEach((url, i) => {
      console.log(`${i + 1}. ${url}`);
    });
    
  } catch (error) {
    console.error('Tool error:', error);
  }
}

testToolDirect();
