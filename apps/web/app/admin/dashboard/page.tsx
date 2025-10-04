import { prisma } from '../../../lib/db';
import DashboardCharts from '../../../components/admin/DashboardCharts';

async function getData() {
  const last30 = new Date(Date.now() - 30*24*60*60*1000);
  const redirects = await prisma.redirectEvent.findMany({ 
    where: { ts: { gte: last30 } }, 
    orderBy: { ts: 'asc' } 
  });
  
  const byDay: Record<string, { date: string; TWG: number; External: number }> = {};
  redirects.forEach(r=>{ 
    const d=r.ts.toISOString().slice(0,10); 
    byDay[d] ||= {date:d,TWG:0,External:0}; 
    byDay[d][r.label==='TWG'?'TWG':'External']++; 
  });
  
  const timeSeries = Object.values(byDay);
  
  const byDomain: Record<string, number> = {};
  redirects.forEach(r=>{ byDomain[r.domain] = (byDomain[r.domain]||0)+1; });
  
  const topDomains = Object.entries(byDomain)
    .sort((a,b)=>b[1]-a[1])
    .slice(0,8)
    .map(([name,value])=>({name,value}));
  
  const totals = { 
    total: redirects.length, 
    twg: redirects.filter(r=>r.label==='TWG').length, 
    ext: redirects.filter(r=>r.label!=='TWG').length 
  };
  
  const coverage = totals.total ? Math.round((totals.twg / totals.total)*100) : 0;
  
  // Rough revenue estimate for external: assume RPM (revenue per 1000 redirects) configurable; use placeholder 25 NZD
  const externalRevenueEstimate = Math.round((totals.ext/1000)*25*100)/100;
  
  return { timeSeries, topDomains, totals, coverage, externalRevenueEstimate };
}

export default async function Dashboard() {
  const data = await getData();
  
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
      
      <DashboardCharts 
        timeSeries={data.timeSeries} 
        topDomains={data.topDomains} 
        externalRevenueEstimate={data.externalRevenueEstimate}
      />
    </main>
  );
}
