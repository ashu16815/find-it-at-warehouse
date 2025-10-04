import TileGrid from './TileGrid';

interface TWGStripProps {
  items: Array<{
    title: string;
    price?: number;
    merchant: string;
    domain: string;
    image?: string;
    redirect_url: string;
    label: 'TWG' | 'External';
    in_stock?: boolean;
    badges?: string[];
  }>;
  aiInsight?: string;
}

export default function TWGStrip({ items = [], aiInsight }: TWGStripProps) {
  if (!items.length) return null;
  
  return (
    <section 
      aria-label="Top results from The Warehouse Group" 
      className="mb-8 animate-fade-in-up"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-h2 font-semibold text-ink mb-1">
            Top picks from The Warehouse Group
          </h2>
          <p className="text-sm text-ink-muted">
            The Warehouse → Warehouse Stationery → Noel Leeming
          </p>
        </div>
        
        {/* AI Insight Pill */}
        {aiInsight && (
          <div className="inline-flex items-center gap-2 text-sm px-3 py-2 rounded-pill bg-bg-alt border border-border">
            <span className="text-brand-primary">✨</span>
            <span className="text-ink-muted">{aiInsight}</span>
          </div>
        )}
      </div>
      
      {/* Tiles Grid */}
      <TileGrid items={items.slice(0, 3)} />
    </section>
  );
}
