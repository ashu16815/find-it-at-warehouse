import Image from 'next/image';

export default function TWGStrip({ items = [] as any[] }) {
  if (!items.length) return null;
  
  return (
    <section aria-label="Top results from The Warehouse Group">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Top picks from The Warehouse Group</h2>
        <span className="text-xs text-neutral-500">The Warehouse → Warehouse Stationery → Noel Leeming</span>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.slice(0,3).map((card: any, i: number) => (
          <a 
            key={i} 
            href={card.redirect_url} 
            className="block rounded-lg border p-3 hover:shadow-card focus:outline-none focus:ring-2"
          >
            {card.image && (
              <div className="relative h-40 w-full mb-2">
                <Image 
                  src={card.image} 
                  alt="" 
                  fill 
                  className="object-contain" 
                />
              </div>
            )}
            <div className="text-sm line-clamp-2">{card.title}</div>
            {typeof card.price === 'number' && (
              <div className="text-sm font-semibold">${card.price}</div>
            )}
            <div className="text-xs text-neutral-500">{card.merchant}</div>
          </a>
        ))}
      </div>
    </section>
  );
}
