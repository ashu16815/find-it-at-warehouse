export function TileSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-bg animate-pulse">
      {/* Image skeleton */}
      <div className="aspect-[5/4] w-full bg-bg-alt rounded-t-lg" />
      
      {/* Content skeleton */}
      <div className="p-3">
        <div className="h-4 bg-bg-alt rounded mb-2" />
        <div className="h-4 bg-bg-alt rounded w-3/4 mb-2" />
        <div className="h-6 bg-bg-alt rounded w-1/2 mb-2" />
        <div className="flex justify-between">
          <div className="h-3 bg-bg-alt rounded w-1/3" />
          <div className="h-3 bg-bg-alt rounded w-1/4" />
        </div>
      </div>
    </div>
  );
}

export function TWGStripSkeleton() {
  return (
    <section className="mb-8">
      {/* Header skeleton */}
      <div className="mb-4">
        <div className="h-6 bg-bg-alt rounded w-1/2 mb-2" />
        <div className="h-4 bg-bg-alt rounded w-1/3" />
      </div>
      
      {/* Tiles skeleton */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <TileSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

export function ComposerSkeleton() {
  return (
    <div className="sticky bottom-4 z-40 mx-auto max-w-[1200px] px-6">
      <div className="bg-bg/85 backdrop-blur-sm rounded-2xl border border-border p-3 shadow-card">
        <div className="flex gap-2 items-center">
          <div className="flex-1 h-10 bg-bg-alt rounded-lg animate-pulse" />
          <div className="w-16 h-10 bg-bg-alt rounded-pill animate-pulse" />
        </div>
      </div>
    </div>
  );
}
