import React , { useEffect, useState } from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function ReportsAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:5005/api/insights/analytics');
      if (response.ok) setData(await response.json());
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-8 text-center text-muted-foreground">Compiling insights...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-muted-foreground mt-1 text-sm">Real-time operational intelligence.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Utilization Chart Block */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="font-bold flex items-center gap-2 mb-6"><BarChart3 size={18} className="text-primary"/> Utilization by Category</h2>
          <div className="space-y-4">
            {data.utilization.map((cat: any) => {
              const percentage = cat.total > 0 ? Math.round((cat.allocated / cat.total) * 100) : 0;
              return (
                <div key={cat.category}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium">{cat.category}</span>
                    <span className="text-muted-foreground">{percentage}% Allocated</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Maintenance Frequency Block */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="font-bold flex items-center gap-2 mb-6"><TrendingUp size={18} className="text-secondary"/> Maintenance Pipeline</h2>
          <div className="flex flex-wrap gap-4">
             {data.maintenance.length === 0 ? <p className="text-muted-foreground text-sm">No maintenance data available.</p> : null}
             {data.maintenance.map((m: any) => (
               <div key={m.status} className="bg-background border border-border p-4 rounded-lg flex-1 min-w-[120px] text-center">
                 <p className="text-2xl font-bold">{m.count}</p>
                 <p className="text-xs text-muted-foreground uppercase tracking-wider mt-1">{m.status}</p>
               </div>
             ))}
          </div>
        </div>
      </div>
    </div>
  );
}