'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

// Sample data for demonstration (database integration ready for future)
function getData() {
  // Generate time series data for the last 30 days
  const timeSeries = [];
  const today = new Date();
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const twgRedirects = Math.floor(Math.random() * 20) + 5;
    const extRedirects = Math.floor(Math.random() * 15) + 3;
    timeSeries.push({
      date: date.toISOString().split('T')[0],
      twg: twgRedirects,
      external: extRedirects,
      total: twgRedirects + extRedirects
    });
  }

  return {
    timeSeries,
    topDomains: [
      { name: 'thewarehouse.co.nz', value: 45, color: '#D32F2F' },
      { name: 'noelleeming.co.nz', value: 32, color: '#1976D2' },
      { name: 'warehousestationery.co.nz', value: 28, color: '#388E3C' },
      { name: 'amazon.com.au', value: 15, color: '#FF9800' },
      { name: 'pbtech.co.nz', value: 12, color: '#9C27B0' },
      { name: 'harveynorman.co.nz', value: 8, color: '#607D8B' }
    ],
    totals: { total: 300, twg: 150, ext: 150 },
    coverage: 50,
    externalRevenueEstimate: 3.75,
    // Chart data for pie chart
    redirectBreakdown: [
      { name: 'TWG Brands', value: 150, color: '#D32F2F' },
      { name: 'External', value: 150, color: '#666666' }
    ]
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
        <h2 className="text-lg font-semibold mb-4">Redirects Over Time</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.timeSeries}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-NZ', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString('en-NZ', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
                formatter={(value, name) => [value, name === 'twg' ? 'TWG Brands' : name === 'external' ? 'External' : 'Total']}
              />
              <Line 
                type="monotone" 
                dataKey="twg" 
                stroke="#D32F2F" 
                strokeWidth={2}
                dot={{ fill: '#D32F2F', strokeWidth: 2, r: 4 }}
                name="TWG Brands"
              />
              <Line 
                type="monotone" 
                dataKey="external" 
                stroke="#666666" 
                strokeWidth={2}
                dot={{ fill: '#666666', strokeWidth: 2, r: 4 }}
                name="External"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Top Domains</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.topDomains} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11 }}
                  width={120}
                  tickFormatter={(value) => value.replace('.co.nz', '').replace('.com.au', '')}
                />
                <Tooltip 
                  formatter={(value, name) => [value, 'Redirects']}
                  labelFormatter={(value) => value}
                />
                <Bar dataKey="value" fill="#D32F2F" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-4">Redirect Breakdown</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.redirectBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.redirectBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value, name) => [value, name]}
                  labelFormatter={(value) => `${value} redirects`}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {data.redirectBreakdown.map((item, i) => (
              <div key={i} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-sm">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="rounded-lg border p-4">
          <h2 className="text-lg font-semibold mb-2">External Revenue (Estimate)</h2>
          <p className="text-sm text-neutral-600 mb-4">
            Assumes NZ$25 / 1000 external redirects (configure in code).
          </p>
          <div className="text-3xl font-semibold mb-4">NZ${data.externalRevenueEstimate.toFixed(2)}</div>
          
          <div className="space-y-3">
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>External Redirects</span>
                <span>{data.totals.ext}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-orange-500 h-2 rounded-full" 
                  style={{ width: `${(data.totals.ext / data.totals.total) * 100}%` }}
                ></div>
              </div>
            </div>
            
            <div className="text-sm">
              <div className="flex justify-between mb-1">
                <span>TWG Redirects</span>
                <span>{data.totals.twg}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-600 h-2 rounded-full" 
                  style={{ width: `${(data.totals.twg / data.totals.total) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}