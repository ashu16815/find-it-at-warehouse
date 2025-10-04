'use client';
import { useState, useEffect, useCallback } from 'react';
import TWGStrip from '../Product/TWGStrip';
import ExternalSection from '../Product/ExternalSection';

export default function MessageList({ messages = [], onNewMessage }) {
  const [localMessages, setLocalMessages] = useState(messages);

  // Update local messages when props change
  useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  // Add new message to local state
  const addMessage = useCallback((message) => {
    console.log('Adding message to chat:', message);
    const newMessage = {
      id: Date.now(),
      ...message,
      timestamp: new Date()
    };
    setLocalMessages(prev => [...prev, newMessage]);
    onNewMessage?.(newMessage);
  }, [onNewMessage]);

  // Expose addMessage function to parent
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).addChatMessage = addMessage;
      console.log('Exposed addChatMessage function to window');
    }
  }, [addMessage]);

  if (localMessages.length === 0) {
    return (
      <div className='min-h-[40vh] mb-4 text-sm text-neutral-600'>
        Start with a question like: <em>"Recommend a reliable 14" school laptop under $600"</em>.
      </div>
    );
  }

  return (
    <div className="space-y-6 mb-8">
      {localMessages.map((message) => (
        <div key={message.id} className="animate-fade-in-up">
          {/* User Message */}
          {message.type === 'user' && (
            <div className="flex justify-end">
              <div className="bg-brand-primary text-white px-4 py-2 rounded-2xl rounded-br-md max-w-[80%]">
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          )}

          {/* AI Response */}
          {message.type === 'ai' && (
            <div className="flex justify-start">
              <div className="bg-bg-alt border border-border px-4 py-3 rounded-2xl rounded-bl-md max-w-[90%]">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-brand-primary">✨</span>
                  <span className="text-sm font-medium text-ink">AI Assistant</span>
                </div>
                <p className="text-sm text-ink mb-3">{message.content}</p>
                
                {/* Show TWG Products */}
                {message.products && message.products.length > 0 && (
                  <TWGStrip items={message.products.slice(0, 3)} />
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
