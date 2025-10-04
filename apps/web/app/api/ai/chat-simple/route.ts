import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();
    
    console.log('Received query:', query);
    
    // Simple fallback response without external dependencies
    const products = [
      {
        title: "Sample Laptop - Intel Core i5, 8GB RAM, 256GB SSD",
        price: 599,
        merchant: "The Warehouse",
        domain: "thewarehouse.co.nz",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.thewarehouse.co.nz/search?q=laptop&meta=%7B%22brand%22%3A%22The%20Warehouse%22%7D",
        label: "TWG",
        in_stock: true
      },
      {
        title: "Sample Desktop Computer - AMD Ryzen 5, 16GB RAM, 512GB SSD",
        price: 799,
        merchant: "Warehouse Stationery", 
        domain: "warehousestationery.co.nz",
        image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=320&fit=crop&crop=center",
        redirect_url: "/api/redirect?u=https://www.warehousestationery.co.nz/search?q=computer&meta=%7B%22brand%22%3A%22Warehouse%20Stationery%22%7D",
        label: "TWG",
        in_stock: true
      }
    ];
    
    return NextResponse.json({
      message: `I found some great products for "${query}"! Here are my recommendations:`,
      products: products,
      intent: { budget: null, brand: null, size: null },
      note: 'Simple fallback mode - Azure OpenAI not configured'
    });
    
  } catch (error) {
    console.error('Simple Chat API Error:', error);
    
    return NextResponse.json({ 
      error: 'Internal server error', 
      message: 'Sorry, I encountered an error. Please try again.' 
    }, { status: 500 });
  }
}
