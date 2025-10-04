export async function webSearch(query: string, count = 8) {
  // Azure Cognitive Search endpoint
  const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const searchKey = process.env.AZURE_SEARCH_KEY;
  
  // For now, we'll use a simple approach to search The Warehouse Group sites
  // In a real implementation, you'd have indexed these sites in Azure Cognitive Search
  const urls: string[] = [];
  
  // Generate search URLs for TWG sites
  const domains = ['thewarehouse.co.nz', 'warehousestationery.co.nz', 'noelleeming.co.nz'];
  
  for (const domain of domains) {
    for (let i = 0; i < Math.ceil(count / domains.length); i++) {
      urls.push(`https://${domain}/search?q=${encodeURIComponent(query)}&page=${i + 1}`);
    }
  }
  
  return urls.map(url => ({ url }));
}

// Azure Cognitive Search implementation (for future use when indexes are set up)
export async function azureCognitiveSearch(query: string, count = 8) {
  const searchEndpoint = process.env.AZURE_SEARCH_ENDPOINT;
  const searchKey = process.env.AZURE_SEARCH_KEY;
  
  const url = new URL(`${searchEndpoint}/indexes/products/docs/search`);
  url.searchParams.set('api-version', '2023-11-01');
  
  const searchBody = {
    search: query,
    top: count,
    select: 'url,title,price,image,merchant,domain'
  };
  
  try {
    const resp = await fetch(url.toString(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': searchKey
      },
      body: JSON.stringify(searchBody)
    });
    
    if (!resp.ok) {
      throw new Error(`Azure Search error: ${resp.status} ${resp.statusText}`);
    }
    
    const json = await resp.json();
    return json.value?.map((item: any) => ({ url: item.url })) || [];
  } catch (error) {
    console.error('Azure Cognitive Search error:', error);
    // Fallback to simple URL generation
    return webSearch(query, count);
  }
}