import React, { useEffect, useState } from 'react';
import { ClipboardCheck, CheckCircle, AlertTriangle, XCircle, Lock } from 'lucide-react';

interface AuditCycle { audit_cycle_id: number; name: string; status: string; department_name: string | null; end_date: string; }

export default function AuditCycleManager() {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCycles = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/audits', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` }
      });
      if (response.ok) setCycles(await response.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCycles(); }, []);

  const closeCycle = async (id: number) => {
    try {
      await fetch(`http://localhost:5005/api/audits/${id}/close`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` }
      });
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading audit cycles...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Audit Cycles</h1>
        <p className="text-muted-foreground mt-1 text-sm">Execute structured verifications and manage discrepancies.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cycles.map(cycle => (
          <div key={cycle.audit_cycle_id} className="bg-card border border-border rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-start">
              <h3 className="font-bold text-lg">{cycle.name}</h3>
              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cycle.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>{cycle.status}</span>
            </div>
            <p className="text-sm text-muted-foreground">Scope: {cycle.department_name || 'Organization-wide'}</p>
            
            {cycle.status === 'Open' ? (
              <div className="space-y-3 pt-2">
                <p className="text-xs font-medium text-foreground mb-2">Simulated Auditor Toggles:</p>
                <div className="grid grid-cols-3 gap-2">
                  <button className="flex flex-col items-center p-2 rounded bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20 transition-colors">
                    <CheckCircle size={16} className="mb-1" /><span className="text-[10px] font-bold">Verified</span>
                  </button>
                  <button className="flex flex-col items-center p-2 rounded bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors">
                    <XCircle size={16} className="mb-1" /><span className="text-[10px] font-bold">Missing</span>
                  </button>
                  <button className="flex flex-col items-center p-2 rounded bg-orange-500/10 text-orange-600 hover:bg-orange-500/20 transition-colors">
                    <AlertTriangle size={16} className="mb-1" /><span className="text-[10px] font-bold">Damaged</span>
                  </button>
                </div>
                <button onClick={() => closeCycle(cycle.audit_cycle_id)} className="w-full mt-4 flex items-center justify-center gap-2 bg-secondary text-secondary-foreground py-2 rounded-md text-sm font-medium hover:opacity-90 transition">
                  <Lock size={14} /> Close Cycle & Generate Report
                </button>
              </div>
            ) : (
              <div className="pt-2">
                <button className="w-full border border-border text-foreground py-2 rounded-md text-sm font-medium hover:bg-muted transition">View Discrepancy Report</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}