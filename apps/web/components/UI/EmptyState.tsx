'use client';
import Link from 'next/link';

interface EmptyStateProps {
  title?: string;
  message?: string;
  examples?: string[];
  onTryExample?: (example: string) => void;
}

export default function EmptyState({ 
  title = "We couldn't find that",
  message = "Try refining your search or ask the assistant for help",
  examples = [
    "55\" TV under $1,000",
    "Quiet mechanical keyboard for home office", 
    "School laptop under $600 with long battery"
  ],
  onTryExample
}: EmptyStateProps) {
  return (
    <div className="text-center py-12 px-6">
      {/* Visual placeholder */}
      <div className="w-24 h-24 mx-auto mb-6 bg-bg-alt rounded-full flex items-center justify-center">
        <span className="text-4xl text-ink-muted">🔍</span>
      </div>
      
      {/* Title */}
      <h2 className="text-h2 font-semibold text-ink mb-2">
        {title}
      </h2>
      
      {/* Message */}
      <p className="text-body text-ink-muted mb-8 max-w-md mx-auto">
        {message}
      </p>
      
      {/* Examples */}
      <div className="space-y-3">
        <p className="text-sm text-ink-muted mb-4">Try these examples:</p>
        <div className="flex flex-wrap gap-2 justify-center">
          {examples.map((example, i) => (
            <button
              key={i}
              onClick={() => onTryExample?.(example)}
              className="px-4 py-2 text-sm bg-bg-alt border border-border rounded-pill hover:bg-border transition-colors focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2"
            >
              {example}
            </button>
          ))}
        </div>
      </div>
      
      {/* Actions */}
      <div className="mt-8 flex gap-3 justify-center">
        <Link 
          href="/chat"
          className="inline-flex items-center justify-center px-4 py-2 rounded-pill bg-brand-primary text-white text-sm font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all"
        >
          Ask the assistant
        </Link>
        <button 
          onClick={() => window.location.reload()}
          className="inline-flex items-center justify-center px-4 py-2 rounded-pill border border-border text-sm font-medium hover:bg-bg-alt focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all"
        >
          Refine filters
        </button>
      </div>
    </div>
  );
}
