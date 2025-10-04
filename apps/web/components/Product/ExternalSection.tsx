import TileGrid from './TileGrid';

interface ExternalSectionProps {
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
}

export default function ExternalSection({ items = [] }: ExternalSectionProps) {
  if (!items.length) return null;
  
  return (
    <section 
      aria-label="External product results" 
      className="mt-8 animate-fade-in-up"
      style={{ animationDelay: '200ms' }}
    >
      {/* Header with disclosure */}
      <div className="mb-4">
        <h2 className="text-h2 font-semibold text-ink mb-2">
          Beyond Warehouse
        </h2>
        <p className="text-sm text-ink-muted">
          External results may be sponsored
        </p>
      </div>
      
      {/* Tiles Grid */}
      <TileGrid items={items} />
    </section>
  );
}
