'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import Composer from '../../components/Chat/Composer.jsx';

export default function ChatPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');

  useEffect(() => {
    if (query) {
      // Auto-focus the input and set the initial query
      const input = document.querySelector('input');
      if (input) {
        input.value = query;
        input.focus();
      }
    }
  }, [query]);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-display font-bold text-ink mb-4">
            Shop smarter. Ask anything.
          </h1>
          <p className="text-body text-ink-muted max-w-2xl mx-auto">
            Get personalized product recommendations from The Warehouse Group brands, 
            with AI-powered insights and trusted external options when needed.
          </p>
        </div>
        
        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-bg-alt rounded-full flex items-center justify-center">
            <span className="text-4xl text-ink-muted">💬</span>
          </div>
          <h2 className="text-h2 font-semibold text-ink mb-2">Start a conversation</h2>
          <p className="text-body text-ink-muted mb-8 max-w-md mx-auto">
            Ask me anything about products from The Warehouse Group brands. 
            I'll help you find the perfect items for your needs.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-ink-muted mb-4">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "laptop under $600",
                "55 inch TV recommendations", 
                "office desk and chair setup",
                "kitchen appliances for healthy cooking"
              ].map((example, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 text-sm bg-bg-alt border border-border rounded-pill text-ink-muted"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      <Composer />
    </main>
  );
}