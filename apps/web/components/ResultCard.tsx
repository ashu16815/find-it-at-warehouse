import Image from 'next/image';

export default function ResultCard({ card }: any) {
  return (
    <a 
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
      <div className="text-xs text-neutral-500">
        {card.domain} · {card.label === 'TWG' ? 'TWG' : 'External'}
      </div>
    </a>
  );
}
