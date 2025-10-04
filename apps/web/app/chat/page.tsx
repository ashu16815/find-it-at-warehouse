'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Composer from '../../components/Chat/Composer.tsx';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  const [initialQuery, setInitialQuery] = useState('');

  useEffect(() => {
    if (query) {
      setInitialQuery(query);
    }
  }, [query]);

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Shop smarter. Ask anything.
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized product recommendations from The Warehouse Group brands, 
            with AI-powered insights and trusted external options when needed.
          </p>
        </div>
        
        {/* Show initial query if provided */}
        {initialQuery && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Searching for:</strong> {initialQuery}
            </p>
          </div>
        )}
        
        {/* Empty State */}
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
            <span className="text-4xl text-gray-400">💬</span>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start a conversation</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Ask me anything about products from The Warehouse Group brands. 
            I'll help you find the perfect items for your needs.
          </p>
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Try these examples:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {[
                "laptop under $600",
                "55 inch TV recommendations", 
                "office desk and chair setup",
                "kitchen appliances for healthy cooking"
              ].map((example, i) => (
                <span 
                  key={i} 
                  className="px-4 py-2 text-sm bg-gray-100 border border-gray-200 rounded-full text-gray-600"
                >
                  {example}
                </span>
              ))}
            </div>
          </div>
        </div>
      <Composer initialQuery={initialQuery} />
    </main>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
