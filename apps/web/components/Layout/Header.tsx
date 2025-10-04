import Link from 'next/link';

export default function Header() {
  return (
    <header className="py-4 border-b border-border bg-bg/80 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="flex items-center justify-between">
          {/* TWG Lockup */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <img 
              src="/twg-lockup.svg" 
              alt="Find it @ Warehouse" 
              className="h-8 w-auto"
            />
            <span className="sr-only">Find it @ Warehouse - Shop smarter. Ask anything.</span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-4">
            <Link 
              href="/chat" 
              className="inline-flex items-center justify-center px-4 py-2 rounded-pill bg-brand-primary text-white text-sm font-medium hover:opacity-95 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all"
            >
              Ask AI
            </Link>
            <Link 
              href="/results" 
              className="text-sm text-ink-muted hover:text-ink transition-colors"
            >
              Browse
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
