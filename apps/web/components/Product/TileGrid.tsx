import Tile from './Tile';

export default function TileGrid({ items = [] as any[] }) {
  if (!items.length) return null;
  
  return (
    <div className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4'>
      {items.map((c, i) => (
        <Tile key={i} card={c}/>
      ))}
    </div>
  );
}
