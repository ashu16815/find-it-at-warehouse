'use client';

import dynamic from 'next/dynamic';

// Import all Recharts components dynamically with no SSR
const ResponsiveContainer = dynamic(() => import('recharts').then(m => m.ResponsiveContainer), { ssr: false });
const AreaChart = dynamic(() => import('recharts').then(m => m.AreaChart), { ssr: false });
const Area = dynamic(() => import('recharts').then(m => m.Area), { ssr: false });
const XAxis = dynamic(() => import('recharts').then(m => m.XAxis), { ssr: false });
const YAxis = dynamic(() => import('recharts').then(m => m.YAxis), { ssr: false });
const Tooltip = dynamic(() => import('recharts').then(m => m.Tooltip), { ssr: false });
const BarChart = dynamic(() => import('recharts').then(m => m.BarChart), { ssr: false });
const Bar = dynamic(() => import('recharts').then(m => m.Bar), { ssr: false });

interface DashboardChartsProps {
  timeSeries: Array<{ date: string; TWG: number; External: number }>;
  topDomains: Array<{ name: string; value: number }>;
  externalRevenueEstimate: number;
}

export default function DashboardCharts({ timeSeries, topDomains, externalRevenueEstimate }: DashboardChartsProps) {
  return (
    <>
      <section className="rounded-lg border p-4">
        <h2 className="text-lg font-semibold mb-2">Redirects Over Time</h2>
        <div className="h-64">
          <ResponsiveContainer>
            <AreaChart data={timeSeries}>
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Area dataKey="TWG" type="monotone" stackId="1" />
              <Area dataKey="External" type="monotone" stackId="1" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </section>
      
      <section className="grid md:grid-cols-2 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">Top Domains</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={topDomains}>
                <XAxis dataKey="name" interval={0} angle={-15} textAnchor="end" height={60}/>
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">External Revenue (Estimate)</h2>
          <p className="text-sm text-neutral-600 mb-2">Assumes NZ$25 / 1000 external redirects (configure in code).</p>
          <div className="text-3xl font-semibold">NZ${externalRevenueEstimate.toFixed(2)}</div>
        </div>
      </section>
    </>
  );
}
