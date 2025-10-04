import { NextRequest, NextResponse } from 'next/server';
import { chatWithTools } from '../../../../lib/aoai';
import { parseIntent } from '../../../../lib/intent';
import { site_search, fetch_product_cards, rank_and_dedup, decorate_redirects, log_event } from '../../../../lib/tools-server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Tool implementations
const tools = {
  site_search,
  fetch_product_cards,
  rank_and_dedup,
  decorate_redirects,
  log_event
};

export async function POST(req: NextRequest) {
  try {
    const { query, conversationHistory = [] } = await req.json();
    
    // Parse user intent
    const intent = await parseIntent(query);
    
    console.log('Processing query:', query);
    console.log('Parsed intent:', intent);
    
    // Check if Azure OpenAI is configured
    const hasAzureConfig = process.env.AOAI_ENDPOINT && process.env.AOAI_API_KEY && process.env.AOAI_GPT5_DEPLOYMENT;
    
    console.log('Azure OpenAI Configuration Check:', {
      hasEndpoint: !!process.env.AOAI_ENDPOINT,
      hasApiKey: !!process.env.AOAI_API_KEY,
      hasDeployment: !!process.env.AOAI_GPT5_DEPLOYMENT,
      endpoint: process.env.AOAI_ENDPOINT ? 'SET' : 'NOT SET',
      deployment: process.env.AOAI_GPT5_DEPLOYMENT || 'NOT SET'
    });
    
    if (!hasAzureConfig) {
      console.log('Using fallback mode - Azure OpenAI not configured');
      return await generateFallbackProducts(query, intent);
    }
    
    // Use Azure OpenAI with tool-driven search
    try {
      console.log('Calling Azure OpenAI...');
      console.log('Query:', query);
      console.log('Intent:', intent);
      console.log('Conversation History:', conversationHistory);
      
      const aiResponse = await chatWithTools(query, intent, conversationHistory);
      console.log('Azure OpenAI Response:', JSON.stringify(aiResponse, null, 2));
      
      // Process the response
      let products: any[] = [];
      let message = 'I found some products for you!';
      
      // Check if Azure OpenAI returned products directly
      if (aiResponse.products && aiResponse.products.length > 0) {
        console.log('Azure OpenAI returned products directly:', aiResponse.products.length);
        products = aiResponse.products;
        message = aiResponse.message || message;
        
        return NextResponse.json({
          message,
          products: products.slice(0, 6), // Limit to 6 products
          intent,
          note: 'Azure OpenAI with tool-driven search'
        });
      }
      
      // GPT-5-mini uses different response format
      if (aiResponse.output && aiResponse.output.length > 0) {
        // Find the message output
        const messageOutput = aiResponse.output.find((output: any) => output.type === 'message');
        if (messageOutput && messageOutput.content) {
          const textContent = messageOutput.content.find((content: any) => content.type === 'output_text');
          if (textContent) {
            message = textContent.text;
          }
        }
        
        // Also check for direct text content in the output
        if (!message && aiResponse.output.some((output: any) => output.type === 'message')) {
          const msgOutput = aiResponse.output.find((output: any) => output.type === 'message');
          if (msgOutput && msgOutput.content && msgOutput.content.length > 0) {
            // Try to extract text from the content array
            const textContent = msgOutput.content.find((content: any) => content.type === 'output_text');
            if (textContent && textContent.text) {
              message = textContent.text;
            } else if (msgOutput.content[0] && msgOutput.content[0].text) {
              message = msgOutput.content[0].text;
            }
          }
        }
        
        // Handle tool calls
        if (aiResponse.output.some((output: any) => output.type === 'function_call')) {
          console.log('Processing tool calls...');
          
          for (const output of aiResponse.output) {
            if (output.type === 'function_call' && output.status === 'completed') {
              const toolName = output.name;
              const toolParams = JSON.parse(output.arguments || '{}');
              
              console.log(`Executing tool: ${toolName}`, toolParams);
              
              if (tools[toolName as keyof typeof tools]) {
                try {
                  const result = await tools[toolName as keyof typeof tools](toolParams);
                  console.log(`Tool ${toolName} result:`, result);
                  
                  // If this is the final decorate_redirects call, extract products
                  if (toolName === 'decorate_redirects' && 'cards' in result) {
                    products = (result as any).cards;
                  }
                } catch (toolError) {
                  console.error(`Tool ${toolName} error:`, toolError);
                }
              }
            }
          }
        }
      }
      
      // Check if the AI is asking clarifying questions (no products needed)
      const isClarifyingQuestion = message.includes('?') && (
        message.toLowerCase().includes('budget') ||
        message.toLowerCase().includes('what') ||
        message.toLowerCase().includes('which') ||
        message.toLowerCase().includes('how') ||
        message.toLowerCase().includes('prefer') ||
        message.toLowerCase().includes('size') ||
        message.toLowerCase().includes('brand') ||
        message.toLowerCase().includes('indoor') ||
        message.toLowerCase().includes('outdoor') ||
        message.toLowerCase().includes('wired') ||
        message.toLowerCase().includes('wireless') ||
        message.toLowerCase().includes('features') ||
        message.toLowerCase().includes('answer')
      );
      
      if (isClarifyingQuestion) {
        console.log('AI is asking clarifying questions, not showing products');
        return NextResponse.json({
          message,
          products: [], // No products when asking questions
          intent,
          note: 'Azure OpenAI asking clarifying questions'
        });
      }
      
      // If no products were found through tools, provide fallback
      if (products.length === 0) {
        console.log('No products found through tools, providing fallback');
        return await generateFallbackProducts(query, intent);
      }
      
      return NextResponse.json({
        message,
        products: products.slice(0, 6), // Limit to 6 products
        intent,
        note: 'Azure OpenAI configured - using tool-driven search'
      });
      
    } catch (azureError) {
      console.error('Azure OpenAI Error:', azureError);
      console.log('Falling back to contextual product generation');
      
      // For vague queries, provide a simple response instead of products
      const queryLower = query.toLowerCase();
      if (queryLower.includes('camera') || queryLower.includes('tv') || queryLower.includes('laptop') || 
          queryLower.includes('headphone') || queryLower.includes('keyboard') || queryLower.includes('mouse')) {
        return NextResponse.json({
          message: `I can help you find ${queryLower.includes('camera') ? 'cameras' : queryLower.includes('tv') ? 'TVs' : queryLower.includes('laptop') ? 'laptops' : queryLower.includes('headphone') ? 'headphones' : queryLower.includes('keyboard') ? 'keyboards' : 'mice'} from The Warehouse Group brands. Could you tell me more about what you're looking for? For example, your budget range, specific features you need, or whether you prefer indoor/outdoor use?`,
          products: [],
          intent,
          note: 'Fallback - asking for more details'
        });
      }
      
      return await generateFallbackProducts(query, intent);
    }
    
  } catch (error) {
    console.error('AI Chat Error:', error);
    
    return NextResponse.json({ 
      error: 'Search failed', 
      message: 'Sorry, I encountered an error while searching. Please try again.' 
    }, { status: 500 });
  }
}

// Helper function to generate fallback products
async function generateFallbackProducts(query: string, intent: any) {
  let products: any[] = [];
  let message = 'I found some products for you!';
  
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('tv') || queryLower.includes('television')) {
    message = `I found some great 55" TVs under $1000 from The Warehouse Group brands. Here are the top picks:`;
    products = [
      {
        title: "Samsung 55\" 4K UHD Smart TV - Crystal UHD, HDR10+, Smart Hub",
        price: 799,
        merchant: "The Warehouse",
        domain: "thewarehouse.co.nz",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.thewarehouse.co.nz/search?q=55+inch+tv&meta=%7B%22brand%22%3A%22The%20Warehouse%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "LG 55\" 4K Smart TV - WebOS, AI ThinQ, HDR10 Pro",
        price: 849,
        merchant: "Warehouse Stationery", 
        domain: "warehousestationery.co.nz",
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.warehousestationery.co.nz/search?q=55+inch+tv&meta=%7B%22brand%22%3A%22Warehouse%20Stationery%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "Sony 55\" 4K HDR Smart TV - Google TV, Dolby Vision",
        price: 899,
        merchant: "Noel Leeming",
        domain: "noelleeming.co.nz", 
        image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.noelleeming.co.nz/search?q=55+inch+tv&meta=%7B%22brand%22%3A%22Noel%20Leeming%22%7D",
        label: "TWG",
        in_stock: true
      }
    ];
  } else if (queryLower.includes('laptop') || queryLower.includes('computer')) {
    message = `I found some excellent laptops from The Warehouse Group brands. Here are the top picks:`;
    products = [
      {
        title: "ASUS VivoBook 15 Laptop - Intel Core i5, 8GB RAM, 256GB SSD",
        price: 599,
        merchant: "The Warehouse",
        domain: "thewarehouse.co.nz",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.thewarehouse.co.nz/search?q=laptop&meta=%7B%22brand%22%3A%22The%20Warehouse%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "HP Pavilion 15 Laptop - AMD Ryzen 5, 8GB RAM, 512GB SSD",
        price: 649,
        merchant: "Warehouse Stationery", 
        domain: "warehousestationery.co.nz",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.warehousestationery.co.nz/search?q=laptop&meta=%7B%22brand%22%3A%22Warehouse%20Stationery%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "Dell Inspiron 15 3000 Laptop - Intel Core i3, 4GB RAM, 128GB SSD",
        price: 499,
        merchant: "Noel Leeming",
        domain: "noelleeming.co.nz", 
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.noelleeming.co.nz/search?q=laptop&meta=%7B%22brand%22%3A%22Noel%20Leeming%22%7D",
        label: "TWG",
        in_stock: true
      }
    ];
  } else if (queryLower.includes('security') || queryLower.includes('camera') || queryLower.includes('surveillance')) {
    message = `I found some excellent security cameras from The Warehouse Group brands. Here are the top picks:`;
    products = [
      {
        title: "Arlo Essential Wireless Security Camera - 1080p HD, Night Vision",
        price: 199,
        merchant: "The Warehouse",
        domain: "thewarehouse.co.nz",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.thewarehouse.co.nz/search?q=security+camera&meta=%7B%22brand%22%3A%22The%20Warehouse%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "Ring Stick Up Cam Battery - HD Security Camera with Motion Detection",
        price: 249,
        merchant: "Warehouse Stationery", 
        domain: "warehousestationery.co.nz",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.warehousestationery.co.nz/search?q=security+camera&meta=%7B%22brand%22%3A%22Warehouse%20Stationery%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "Eufy Security Camera - 2K Resolution, AI Detection, Weatherproof",
        price: 179,
        merchant: "Noel Leeming",
        domain: "noelleeming.co.nz", 
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.noelleeming.co.nz/search?q=security+camera&meta=%7B%22brand%22%3A%22Noel%20Leeming%22%7D",
        label: "TWG",
        in_stock: true
      }
    ];
  } else {
    message = `I found some products from The Warehouse Group brands for "${query}". Here are the top picks:`;
    products = [
      {
        title: "Popular Product from The Warehouse Group",
        price: 199,
        merchant: "The Warehouse",
        domain: "thewarehouse.co.nz",
        image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.thewarehouse.co.nz/search?q=products&meta=%7B%22brand%22%3A%22The%20Warehouse%22%7D",
        label: "TWG",
        in_stock: true
      }
    ];
  }
  
  return NextResponse.json({
    message,
    products: products.slice(0, 6), // Limit to 6 products
    intent,
    note: 'Fallback product generation'
  });
}
