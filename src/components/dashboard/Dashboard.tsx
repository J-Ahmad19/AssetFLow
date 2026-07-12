import React, { useEffect, useState } from 'react';
import { 
  Package, CheckCircle, Wrench, Calendar, 
  ArrowRightLeft, Clock, AlertTriangle, PlusCircle
} from 'lucide-react';

interface DashboardKPIs {
  assetsAvailable: number;
  assetsAllocated: number;
  maintenanceToday: number;
  activeBookings: number;
  pendingTransfers: number;
  upcomingReturns: number;
  overdueReturns: number;
}

export default function Dashboard() {
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchKPIs = async () => {
      try {
        const token = localStorage.getItem('assetflow_token');
        const response = await fetch('http://localhost:5005/api/dashboard/kpis', {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch dashboard data');
        const data = await response.json();
        setKpis(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchKPIs();
  }, []);

  if (loading) return <div className="p-8 text-center text-muted-foreground flex justify-center items-center h-64">Loading operational snapshot...</div>;
  if (error) return <div className="p-8 text-center text-destructive flex justify-center items-center h-64">Error: {error}</div>;
  if (!kpis) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Operational Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time overview of your asset ecosystem.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
            <PlusCircle size={16} /> Register Asset
          </button>
          <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
            <Calendar size={16} /> Book Resource
          </button>
          <button className="flex items-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
            <Wrench size={16} /> Raise Maintenance
          </button>
        </div>
      </div>

      {/* Overdue Returns Alert */}
      {kpis.overdueReturns > 0 && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg flex items-start gap-3 shadow-sm animate-pulse-glow">
          <AlertTriangle className="text-destructive shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="text-destructive font-semibold text-sm">Action Required: Overdue Returns</h3>
            <p className="text-destructive/80 text-sm mt-1">You have {kpis.overdueReturns} asset(s) that are past their expected return date.</p>
          </div>
        </div>
      )}

      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <KPICard title="Assets Available" value={kpis.assetsAvailable} icon={<CheckCircle size={22} className="text-emerald-500"/>} />
        <KPICard title="Assets Allocated" value={kpis.assetsAllocated} icon={<Package size={22} className="text-blue-500"/>} />
        <KPICard title="Active Bookings" value={kpis.activeBookings} icon={<Calendar size={22} className="text-indigo-500"/>} />
        <KPICard title="Maintenance Today" value={kpis.maintenanceToday} icon={<Wrench size={22} className="text-orange-500"/>} />
        <KPICard title="Pending Transfers" value={kpis.pendingTransfers} icon={<ArrowRightLeft size={22} className="text-purple-500"/>} />
        <KPICard title="Upcoming Returns" value={kpis.upcomingReturns} icon={<Clock size={22} className="text-teal-500"/>} />
      </div>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string, value: number | string, icon: React.ReactNode }) {
  return (
    <div className="bg-card text-card-foreground p-5 rounded-xl shadow-sm border border-border flex items-center justify-between hover:border-primary/40 hover:shadow-md transition-all group">
      <div>
        <p className="text-sm font-medium text-muted-foreground mb-1 group-hover:text-foreground transition-colors">{title}</p>
        <h3 className="text-3xl font-bold tracking-tight">{value}</h3>
      </div>
      <div className="p-3 bg-muted rounded-full group-hover:bg-primary/10 transition-colors">
        {icon}
      </div>
    </div>
  );
}