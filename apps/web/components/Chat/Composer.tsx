'use client';
import { useState, useEffect, useRef } from 'react';

interface Message {
  id: number;
  type: 'user' | 'ai';
  content: string;
  products?: any[];
  timestamp: Date;
}

interface ComposerProps {
  initialQuery?: string;
}

export default function Composer({ initialQuery = '' }: ComposerProps) {
  const [text, setText] = useState(initialQuery);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize messages state
  useEffect(() => {
    console.log('Composer mounted');
  }, []);

  // Handle initial query
  useEffect(() => {
    if (initialQuery) {
      setText(initialQuery);
      console.log('Initial query set:', initialQuery);
    }
  }, [initialQuery]);

  // Debug text state changes
  useEffect(() => {
    console.log('Text state changed:', text);
  }, [text]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log('Form submitted!', { text, loading });
    
    if (loading) return;
    
    // If no text, just return without doing anything
    if (!text.trim()) {
      console.log('No text to submit');
      return;
    }
    
    const userMessage = text.trim();
    console.log('Submitting message:', userMessage);
    setLoading(true);
    
    // Clear the input immediately
    console.log('Clearing input text');
    setText('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    // Add user message to local state
    const newUserMessage: Message = {
      id: Date.now(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newUserMessage]);
    
    try {
      // Build conversation history for context
      const conversationHistory = messages.map(msg => ({
        role: msg.type === 'user' ? 'user' : 'assistant',
        content: msg.type === 'user' ? msg.content : msg.content
      }));

          const res = await fetch('/api/ai/chat', { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              query: userMessage,
              conversationHistory: conversationHistory
            }) 
          });
      const data = await res.json();
      
      // Add AI response to local state
      const newAIMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: data.message || 'I found some products for you!',
        products: data.products || [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, newAIMessage]);
    } catch (err) {
      console.error('Error:', err);
      // Add error message to local state
      const errorMessage: Message = {
        id: Date.now() + 1,
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        products: [],
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally { 
      setLoading(false);
    }
  }

  return (
    <div className="sticky bottom-4 z-40 mx-auto max-w-[1200px] px-6">
      {/* Messages Display */}
      {messages.length > 0 && (
        <div className="mb-4 space-y-4 max-h-96 overflow-y-auto">
          {messages.map((message) => (
            <div key={message.id} className="animate-fade-in-up">
              {/* User Message */}
              {message.type === 'user' && (
                <div className="flex justify-end">
                  <div className="bg-red-600 text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              )}

              {/* AI Response */}
              {message.type === 'ai' && (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border border-gray-200 px-4 py-3 rounded-2xl rounded-bl-md max-w-[90%]">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-red-600">✨</span>
                      <span className="text-sm font-medium text-gray-900">AI Assistant</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">{message.content}</p>
                    
                    {/* Show TWG Products */}
                    {message.products && message.products.length > 0 && (
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3">
                        {message.products.slice(0, 3).map((product, i) => (
                          <a
                            key={i}
                            href={product.redirect_url}
                            className="block rounded-lg border border-gray-200 bg-white hover:shadow-md transition-all"
                          >
                            {product.image && (
                              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-t-lg bg-gray-100">
                                <img 
                                  src={product.image} 
                                  alt="Product" 
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            )}
                            <div className="p-3">
                              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                                {product.title || 'View product'}
                              </h3>
                              <div className="flex items-center justify-between text-xs text-gray-500">
                                <span className="font-medium">{product.merchant}</span>
                                <span className="px-2 py-1 rounded-sm text-xs font-medium bg-red-100 text-red-600">TWG</span>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      
      {/* Input Form */}
      <form onSubmit={onSubmit} className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 p-4 shadow-lg">
        <div className="flex gap-3 items-center">
          <input
            ref={inputRef}
            key={messages.length} // Force re-render when messages change
            className="flex-1 outline-none text-base bg-transparent placeholder:text-gray-400 text-gray-900"
            placeholder="Ask anything: laptop under $600, TV recommendations, office setup..."
            value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') {
                console.log('Enter key pressed');
                e.preventDefault();
                onSubmit(e);
              }
            }}
            disabled={loading}
            autoFocus
          />
          <button 
            type="submit"
            disabled={loading}
            className={`px-6 py-3 rounded-full text-sm font-medium min-h-[44px] transition-all ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2'
            }`}
            style={{ minWidth: '80px' }}
          >
            {loading ? 'Searching...' : 'Ask AI'}
          </button>
        </div>
      </form>
    </div>
  );
}
