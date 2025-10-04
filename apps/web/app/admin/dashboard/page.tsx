// Sample data for demonstration (database integration ready for future)
function getData() {
  return {
    timeSeries: [],
    topDomains: [
      { name: 'thewarehouse.co.nz', value: 45 },
      { name: 'noelleeming.co.nz', value: 32 },
      { name: 'warehousestationery.co.nz', value: 28 },
      { name: 'amazon.com.au', value: 15 },
      { name: 'pbtech.co.nz', value: 12 },
      { name: 'harveynorman.co.nz', value: 8 }
    ],
    totals: { total: 300, twg: 150, ext: 150 },
    coverage: 50,
    externalRevenueEstimate: 3.75
  };
}

export default function Dashboard() {
  const data = getData();

  return (
    <main className="mx-auto max-w-[1040px] p-6 space-y-8">
      <header className="mb-2">
        <h1 className="text-2xl font-semibold">Find it @ Warehouse — Analytics</h1>
        <p className="text-sm text-neutral-600">Last 30 days</p>
      </header>

      <section className="grid md:grid-cols-4 gap-4">
        <div className="rounded-lg border p-4">
          <div className="text-xs text-neutral-500">Total Redirects</div>
          <div className="text-2xl font-semibold">{data.totals.total}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-neutral-500">TWG Redirects</div>
          <div className="text-2xl font-semibold">{data.totals.twg}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-neutral-500">External Redirects</div>
          <div className="text-2xl font-semibold">{data.totals.ext}</div>
        </div>
        <div className="rounded-lg border p-4">
          <div className="text-xs text-neutral-500">TWG Coverage</div>
          <div className="text-2xl font-semibold">{data.coverage}%</div>
        </div>
      </section>

      <section className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">Redirects Over Time</h2>
        <div className="h-64 flex items-center justify-center text-gray-500">
          <div className="text-center">
            <p className="text-lg mb-2">📈 Chart visualization coming soon...</p>
            <p className="text-sm text-gray-400">
              {data.timeSeries.length > 0 
                ? `Showing ${data.totals.total} redirects over ${data.timeSeries.length} days`
                : 'No data available - run seed script to populate dashboard'
              }
            </p>
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Top Domains</h2>
          <div className="space-y-2">
            {data.topDomains.map((domain, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-sm">{domain.name}</span>
                <span className="text-sm font-medium">{domain.value}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">External Revenue (Estimate)</h2>
          <p className="text-sm text-neutral-600 mb-2">
            Assumes NZ$25 / 1000 external redirects (configure in code).
          </p>
          <div className="text-3xl font-semibold">NZ${data.externalRevenueEstimate.toFixed(2)}</div>
        </div>
      </section>
    </main>
  );
}