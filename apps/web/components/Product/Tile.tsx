import Image from 'next/image';

interface TileProps {
  card: {
    title: string;
    price?: number;
    merchant: string;
    domain: string;
    image?: string;
    redirect_url: string;
    label: 'TWG' | 'External';
    in_stock?: boolean;
    badges?: string[];
  };
  index?: number;
}

export default function Tile({ card, index = 0 }: TileProps) {
  const isTWG = card.label === 'TWG';
  
  return (
    <a 
      href={card.redirect_url} 
      className="group block rounded-lg border border-border bg-bg hover:shadow-card focus:outline-none focus:ring-2 focus:ring-brand-primary focus:ring-offset-2 transition-all animate-fade-in-up"
      style={{ animationDelay: `${index * 50}ms` }}
      aria-label={`View ${card.title} from ${card.merchant}`}
    >
      {/* Image Container - 5:4 aspect ratio */}
      <div className="relative aspect-[5/4] w-full overflow-hidden rounded-t-lg bg-bg-alt">
        {card.image ? (
          <Image 
            src={card.image} 
            alt={card.title || 'Product image'}
            fill 
            className="object-contain transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-ink-muted">
            <div className="w-12 h-12 bg-border rounded-lg flex items-center justify-center">
              <span className="text-xs">No image</span>
            </div>
          </div>
        )}
        
        {/* Badges */}
        {card.badges && card.badges.length > 0 && (
          <div className="absolute top-2 left-2 flex gap-1">
            {card.badges.slice(0, 2).map((badge, i) => (
              <span 
                key={i}
                className="px-2 py-1 text-xs font-medium bg-brand-primary text-white rounded-sm"
              >
                {badge}
              </span>
            ))}
          </div>
        )}
        
        {/* Stock indicator */}
        {card.in_stock !== false && (
          <div className="absolute top-2 right-2">
            <div className="w-2 h-2 bg-success rounded-full" title="In stock" />
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-3">
        {/* Title */}
        <h3 className="text-sm font-medium text-ink line-clamp-2 mb-2 leading-tight">
          {card.title || 'View product'}
        </h3>
        
        {/* Price */}
        {typeof card.price === 'number' && (
          <div className="text-lg font-semibold text-ink mb-2">
            ${card.price.toLocaleString()}
          </div>
        )}
        
        {/* Meta */}
        <div className="flex items-center justify-between text-xs text-ink-muted">
          <span className="font-medium">{card.merchant}</span>
          <span className={`px-2 py-1 rounded-sm text-xs font-medium ${
            isTWG 
              ? 'bg-brand-primary/10 text-brand-primary' 
              : 'bg-ink-muted/10 text-ink-muted'
          }`}>
            {isTWG ? 'TWG' : 'External'}
          </span>
        </div>
      </div>
    </a>
  );
}