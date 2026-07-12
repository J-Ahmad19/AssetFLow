import React, { useEffect, useState } from 'react';
import { ClipboardCheck, CheckCircle, AlertTriangle, XCircle, Lock, Plus, X } from 'lucide-react';

interface AuditCycle { audit_cycle_id: number; name: string; status: string; department_name: string | null; end_date: string; }
interface AuditAsset { asset_id: number; asset_tag: string; asset_name: string; verification_status: string | null; }

export default function AuditCycleManager() {
  const [cycles, setCycles] = useState<AuditCycle[]>([]);
  const [activeCycleAssets, setActiveCycleAssets] = useState<AuditAsset[]>([]);
  const [expandedCycleId, setExpandedCycleId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [newCycleData, setNewCycleData] = useState({ name: '', end_date: '' });

  const fetchCycles = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/audits', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` }
      });
      if (response.ok) setCycles(await response.json());
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchCycles(); }, []);

  const handleExpandCycle = async (cycle_id: number) => {
    if (expandedCycleId === cycle_id) {
      setExpandedCycleId(null);
      return;
    }
    setExpandedCycleId(cycle_id);
    try {
      const response = await fetch(`http://localhost:5005/api/audits/${cycle_id}/assets`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` }
      });
      if (response.ok) setActiveCycleAssets(await response.json());
    } catch (err) { console.error(err); }
  };

  const handleRecordStatus = async (asset_id: number, status: string) => {
    // Optimistic UI Update for instant real-time feel
    setActiveCycleAssets(prev => prev.map(a => a.asset_id === asset_id ? { ...a, verification_status: status } : a));
    
    try {
      await fetch('http://localhost:5005/api/audits/record', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` },
        body: JSON.stringify({ audit_cycle_id: expandedCycleId, asset_id, verification_status: status })
      });
    } catch (err) { console.error('Failed to save record', err); }
  };

  const closeCycle = async (id: number) => {
    if(!window.confirm("Are you sure? This will lock the cycle and mark missing assets as 'Lost'.")) return;
    try {
      await fetch(`http://localhost:5005/api/audits/${id}/close`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` }
      });
      fetchCycles();
      setExpandedCycleId(null);
    } catch (err) { console.error(err); }
  };

  const handleCreateCycle = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('http://localhost:5005/api/audits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('assetflow_token')}` },
        body: JSON.stringify(newCycleData)
      });
      setShowModal(false);
      setNewCycleData({ name: '', end_date: '' });
      fetchCycles();
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading audit cycles...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Cycles</h1>
          <p className="text-muted-foreground mt-1 text-sm">Execute structured verifications and manage discrepancies.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium"
        >
          <Plus size={16} /> New Cycle
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {cycles.map(cycle => (
          <div key={cycle.audit_cycle_id} className="bg-card border border-border rounded-xl shadow-sm overflow-hidden flex flex-col">
            
            {/* Cycle Header */}
            <div className="p-5 border-b border-border hover:bg-muted/30 cursor-pointer transition-colors" onClick={() => handleExpandCycle(cycle.audit_cycle_id)}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2"><ClipboardCheck size={20} className="text-primary"/> {cycle.name}</h3>
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${cycle.status === 'Open' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>{cycle.status}</span>
              </div>
              <p className="text-sm text-muted-foreground">Scope: {cycle.department_name || 'Organization-wide'}</p>
            </div>

            {/* Expanded Active Asset List[cite: 3] */}
            {expandedCycleId === cycle.audit_cycle_id && (
              <div className="bg-muted/10 p-5 flex-1 border-b border-border">
                {cycle.status === 'Open' ? (
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    {activeCycleAssets.map(asset => (
                      <div key={asset.asset_id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 bg-background border border-border rounded-lg gap-3 shadow-sm">
                        <div>
                          <p className="font-mono text-sm font-bold text-primary">{asset.asset_tag}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[150px]">{asset.asset_name}</p>
                        </div>
                        
                        {/* Real-time Toggles[cite: 4] */}
                        <div className="flex gap-1.5 shrink-0">
                          <button 
                            onClick={() => handleRecordStatus(asset.asset_id, 'Verified')}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold border transition-colors ${asset.verification_status === 'Verified' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600' : 'border-transparent text-muted-foreground hover:bg-muted'}`}
                          >
                            <CheckCircle size={14} /> Verified
                          </button>
                          <button 
                            onClick={() => handleRecordStatus(asset.asset_id, 'Missing')}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold border transition-colors ${asset.verification_status === 'Missing' ? 'bg-destructive/10 border-destructive/30 text-destructive' : 'border-transparent text-muted-foreground hover:bg-muted'}`}
                          >
                            <XCircle size={14} /> Missing
                          </button>
                          <button 
                            onClick={() => handleRecordStatus(asset.asset_id, 'Damaged')}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded text-xs font-bold border transition-colors ${asset.verification_status === 'Damaged' ? 'bg-orange-500/10 border-orange-500/30 text-orange-600' : 'border-transparent text-muted-foreground hover:bg-muted'}`}
                          >
                            <AlertTriangle size={14} /> Damaged
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-6 text-sm text-muted-foreground">
                    This cycle is closed. Discrepancies have been locked.
                  </div>
                )}
              </div>
            )}

            {/* Cycle Footer Actions */}
            <div className="p-4 bg-background mt-auto">
              {cycle.status === 'Open' ? (
                <button onClick={() => closeCycle(cycle.audit_cycle_id)} className="w-full flex items-center justify-center gap-2 bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground py-2 rounded-md text-sm font-bold transition-colors">
                  <Lock size={14} /> Close Cycle & Generate Report
                </button>
              ) : (
                <button className="w-full border border-border text-foreground py-2 rounded-md text-sm font-medium hover:bg-muted transition">
                  View Discrepancy Report
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* New Cycle Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-md rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Initiate Audit Cycle</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateCycle} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Cycle Name</label>
                <input type="text" required value={newCycleData.name} onChange={e => setNewCycleData({...newCycleData, name: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:ring-primary focus:outline-none" placeholder="e.g. Q3 Organization Audit" />
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Target End Date</label>
                <input type="date" required value={newCycleData.end_date} onChange={e => setNewCycleData({...newCycleData, end_date: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 focus:ring-primary focus:outline-none" />
              </div>
              <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium mt-2">Start Cycle</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}