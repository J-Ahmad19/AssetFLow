import React, { useEffect, useState } from 'react';
import { ArrowRightLeft, ShieldAlert, Check, UserPlus, CornerDownRight } from 'lucide-react';

interface Asset { asset_id: number; asset_tag: string; name: string; lifecycle_status: string; }
interface User { user_id: number; name: string; email: string; }
interface Allocation { allocation_id: number; asset_tag: string; asset_name: string; assignee_name: string; expected_return_date: string; status: string; }
interface Transfer { transfer_id: number; asset_tag: string; asset_name: string; requested_by_name: string; current_holder_name: string; }

export default function AllocationTransferScreen() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [allocations, setAllocations] = useState<Allocation[]>([]);
  const [transfers, setTransfers] = useState<Transfer[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Form State
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');
  const [expectedReturn, setExpectedReturn] = useState('');
  
  // Conflict State
  const [conflictHolderId, setConflictHolderId] = useState<number | null>(null);
  const [conflictHolderName, setConflictHolderName] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('assetflow_token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [assetsRes, usersRes, allocRes] = await Promise.all([
        fetch('http://localhost:5005/api/assets', { headers }),
        fetch('http://localhost:5005/api/admin/master-data', { headers }),
        fetch('http://localhost:5005/api/allocations', { headers })
      ]);

      if (assetsRes.ok) setAssets(await assetsRes.json());
      if (usersRes.ok) setUsers((await usersRes.json()).employees);
      if (allocRes.ok) {
        const allocData = await allocRes.json();
        setAllocations(allocData.allocations);
        setTransfers(allocData.transfers);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  // Check for conflicts dynamically as the user selects an asset
  useEffect(() => {
    setConflictHolderId(null);
    setConflictHolderName(null);
    const asset = assets.find(a => a.asset_id.toString() === selectedAssetId);
    if (asset && asset.lifecycle_status === 'Allocated') {
      // Find the holder from the active allocations list
      const activeAlloc = allocations.find(al => al.asset_tag === asset.asset_tag);
      if (activeAlloc) {
        setConflictHolderName(activeAlloc.assignee_name);
        // Find user_id for the transfer payload
        const holderUser = users.find(u => u.name === activeAlloc.assignee_name);
        if (holderUser) setConflictHolderId(holderUser.user_id);
      }
    }
  }, [selectedAssetId, assets, allocations, users]);

  const handleAllocate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/allocations/allocate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ asset_id: selectedAssetId, assigned_to_user: selectedUserId, expected_return_date: expectedReturn })
      });

      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) {
          setConflictHolderName(data.current_holder_name);
          setConflictHolderId(data.current_holder_id);
          throw new Error(data.error);
        }
        throw new Error(data.error);
      }

      setSuccessMsg('Asset allocated successfully.');
      setSelectedAssetId(''); setSelectedUserId(''); setExpectedReturn('');
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) { setError(err.message); }
  };

  const handleTransferRequest = async () => {
    setError(''); setSuccessMsg('');
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/allocations/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ asset_id: selectedAssetId, requested_by: selectedUserId, current_holder: conflictHolderId })
      });

      if (!response.ok) throw new Error('Failed to request transfer');
      setSuccessMsg('Transfer request submitted to the workflow queue.');
      setSelectedAssetId(''); setSelectedUserId(''); setConflictHolderName(null);
      fetchData();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) { setError(err.message); }
  };

  const handleApproveTransfer = async (transfer_id: number) => {
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch(`http://localhost:5005/api/allocations/transfers/${transfer_id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setSuccessMsg('Transfer approved. Asset re-allocated.');
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) { console.error(err); }
  };

  const handleReturn = async (allocation_id: number) => {
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch(`http://localhost:5005/api/allocations/${allocation_id}/return`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ condition_notes: 'Returned in good condition' })
      });
      if (response.ok) {
        setSuccessMsg('Asset marked as returned.');
        fetchData();
        setTimeout(() => setSuccessMsg(''), 4000);
      }
    } catch (err) { console.error(err); }
  };

  if (loading) return <div className="p-8 text-center text-muted-foreground">Loading workflows...</div>;

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Allocation & Transfer</h1>
        <p className="text-muted-foreground mt-1 text-sm">Assign assets and manage overlap conflicts.</p>
      </div>

      {error && (
        <div className="bg-destructive/10 border-l-4 border-destructive p-4 rounded-lg flex items-center gap-3">
          <ShieldAlert className="text-destructive" size={20} />
          <p className="text-destructive font-medium text-sm">{error}</p>
        </div>
      )}

      {successMsg && (
        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-lg flex items-center gap-3">
          <Check className="text-emerald-500" size={20} />
          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{successMsg}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ACTION PANEL (Left) */}
        <div className="lg:col-span-1 bg-card border border-border rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2"><UserPlus size={18} className="text-primary"/> New Allocation</h2>
          
          <form onSubmit={handleAllocate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">Select Asset</label>
              <select required value={selectedAssetId} onChange={e => setSelectedAssetId(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                <option value="">Choose an asset...</option>
                {assets.map(a => (
                  <option key={a.asset_id} value={a.asset_id}>
                    {a.asset_tag} - {a.name} ({a.lifecycle_status})
                  </option>
                ))}
              </select>
            </div>

            {/* The Double-Allocation Blocker[cite: 4] */}
            {conflictHolderName ? (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-4 space-y-3 animate-in slide-in-from-top-2">
                <div className="flex gap-2 text-destructive">
                  <ShieldAlert size={18} className="shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-tight">Already allocated to {conflictHolderName}. Submit a transfer request below.</p>
                </div>
                <div>
                  <label className="block text-xs font-medium text-destructive mb-1">Request Transfer For</label>
                  <select required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full bg-background border border-destructive/30 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-destructive focus:outline-none">
                    <option value="">Select Employee...</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                  </select>
                </div>
                <button type="button" onClick={handleTransferRequest} className="w-full bg-destructive text-destructive-foreground py-2 rounded-md font-medium text-sm hover:opacity-90 transition">Submit Transfer Request</button>
              </div>
            ) : (
              /* Standard Allocation Form */
              <div className="space-y-4 animate-in fade-in">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Assign To</label>
                  <select required value={selectedUserId} onChange={e => setSelectedUserId(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="">Select Employee...</option>
                    {users.map(u => <option key={u.user_id} value={u.user_id}>{u.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Expected Return Date (Optional)</label>
                  <input type="date" value={expectedReturn} onChange={e => setExpectedReturn(e.target.value)} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
                </div>
                <button type="submit" className="w-full bg-primary text-primary-foreground py-2 rounded-md font-medium text-sm hover:opacity-90 transition">Allocate Asset</button>
              </div>
            )}
          </form>
        </div>

        {/* WORKFLOW QUEUES (Right) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Pending Transfers[cite: 4] */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-bold flex items-center gap-2"><ArrowRightLeft size={18} className="text-secondary"/> Pending Transfer Requests</h2>
            </div>
            <div className="p-0">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr><th className="px-6 py-3">Asset</th><th className="px-6 py-3">From</th><th className="px-6 py-3">To</th><th className="px-6 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {transfers.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-6 text-center text-muted-foreground">No pending transfers.</td></tr>
                  ) : transfers.map(t => (
                    <tr key={t.transfer_id} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium">{t.asset_tag} <span className="text-muted-foreground font-normal ml-1">{t.asset_name}</span></td>
                      <td className="px-6 py-3 text-muted-foreground">{t.current_holder_name}</td>
                      <td className="px-6 py-3 font-medium text-primary flex items-center gap-1"><CornerDownRight size={14}/> {t.requested_by_name}</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => handleApproveTransfer(t.transfer_id)} className="bg-secondary/10 text-secondary hover:bg-secondary hover:text-secondary-foreground px-3 py-1.5 rounded-md text-xs font-semibold transition-colors">Approve</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Active Allocations Table */}
          <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-border bg-muted/30">
              <h2 className="font-bold">Active Allocations</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground text-xs uppercase font-semibold">
                  <tr><th className="px-6 py-3">Asset</th><th className="px-6 py-3">Assigned To</th><th className="px-6 py-3">Due Date</th><th className="px-6 py-3 text-right">Action</th></tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allocations.length === 0 ? (
                    <tr><td colSpan={4} className="px-6 py-6 text-center text-muted-foreground">No active allocations.</td></tr>
                  ) : allocations.map(al => (
                    <tr key={al.allocation_id} className="hover:bg-muted/30">
                      <td className="px-6 py-3 font-medium">{al.asset_tag}</td>
                      <td className="px-6 py-3">{al.assignee_name}</td>
                      <td className="px-6 py-3 text-muted-foreground">{al.expected_return_date ? new Date(al.expected_return_date).toLocaleDateString() : '-'}</td>
                      <td className="px-6 py-3 text-right">
                        <button onClick={() => handleReturn(al.allocation_id)} className="border border-border text-muted-foreground hover:bg-muted px-3 py-1.5 rounded-md text-xs font-medium transition-colors">Return</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}