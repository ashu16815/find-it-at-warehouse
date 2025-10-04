import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='mt-16 border-t'>
      <div className='mx-auto max-w-[1200px] px-4 py-6 text-sm text-neutral-600 flex flex-wrap gap-4 items-center'>
        <span>Results prioritise The Warehouse Group brands.</span>
        <nav className='ml-auto flex gap-4'>
          <Link href='/.well-known/sitemap.json' className='hover:underline'>Sitemap</Link>
          <Link href='/legal/privacy' className='hover:underline'>Privacy</Link>
          <Link href='/legal/terms' className='hover:underline'>Terms</Link>
        </nav>
      </div>
    </footer>
  );
}
