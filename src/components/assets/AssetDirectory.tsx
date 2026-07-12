import React, { useEffect, useState } from 'react';
import { Search, Filter, Plus, X, Package, ShieldAlert, Check } from 'lucide-react';

interface Asset {
  asset_id: number;
  asset_tag: string;
  name: string;
  category_name: string;
  serial_number: string;
  condition_status: string;
  lifecycle_status: string;
  is_shared_resource: boolean;
}

export default function AssetDirectory() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [categories, setCategories] = useState<{category_id: number, name: string}[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '', category_id: '', serial_number: '', acquisition_date: '', condition_status: 'Good', is_shared_resource: false
  });

  // Check user role to show/hide the Register button
  const userStr = localStorage.getItem('assetflow_user');
  const user = userStr ? JSON.parse(userStr) : null;
  const canRegister = user?.role === 'Admin' || user?.role === 'Asset Manager';

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('assetflow_token');
      // Build query string[cite: 4]
      const queryParams = new URLSearchParams();
      if (searchTerm) queryParams.append('search', searchTerm);
      if (filterStatus) queryParams.append('status', filterStatus);
      if (filterCategory) queryParams.append('category', filterCategory);

      const response = await fetch(`http://localhost:5005/api/assets?${queryParams.toString()}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch assets');
      
      const data = await response.json();
      setAssets(data);
    } catch (err: any) { setError(err.message); } 
    finally { setLoading(false); }
  };

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/admin/master-data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setCategories(data.categories);
      }
    } catch (err) { console.error('Failed to load categories', err); }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    // Debounce search slightly to avoid spamming the backend
    const timeoutId = setTimeout(() => fetchAssets(), 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, filterStatus, filterCategory]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccessMsg('');
    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/assets/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Failed to register asset');
      const data = await response.json();
      setSuccessMsg(`Success! Asset Tag ${data.asset_tag} generated.`);
      setShowModal(false);
      fetchAssets();
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) { setError(err.message); }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Asset Directory</h1>
          <p className="text-muted-foreground mt-1 text-sm">Search, filter, and track all organizational assets.</p>
        </div>
        
        {/* Role-Based Rendering: Only Admins/Managers see this[cite: 4] */}
        {canRegister && (
          <button 
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium shrink-0"
          >
            <Plus size={16} /> Register Asset
          </button>
        )}
      </div>

      {successMsg && (
        <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-lg flex items-center gap-3">
          <Check className="text-emerald-500" size={20} />
          <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{successMsg}</p>
        </div>
      )}

      {/* Filters & Search Bar[cite: 4] */}
      <div className="bg-card border border-border rounded-xl p-4 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input 
            type="text" 
            placeholder="Search by Tag, Name, or Serial..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-background border border-border rounded-md pl-10 pr-4 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none"
          />
        </div>
        <div className="flex gap-4">
          <select 
            className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
          </select>
          <select 
            className="bg-background border border-border rounded-md px-3 py-2 text-sm text-foreground focus:ring-2 focus:ring-primary focus:outline-none"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="Allocated">Allocated</option>
            <option value="Reserved">Reserved</option>
            <option value="Under Maintenance">Under Maintenance</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
      </div>

      {/* Asset Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-muted text-muted-foreground text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4">Asset Tag</th>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Condition</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading assets...</td></tr>
              ) : assets.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No assets found matching your criteria.</td></tr>
              ) : (
                assets.map(asset => (
                  <tr key={asset.asset_id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-primary">{asset.asset_tag}</td>
                    <td className="px-6 py-4 font-medium">
                      <div className="flex items-center gap-2">
                        {asset.is_shared_resource && <span className="bg-indigo-500/10 text-indigo-500 text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Shared</span>}
                        {asset.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{asset.category_name}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        asset.lifecycle_status === 'Available' ? 'bg-emerald-500/10 text-emerald-500' :
                        asset.lifecycle_status === 'Allocated' ? 'bg-blue-500/10 text-blue-500' :
                        asset.lifecycle_status === 'Under Maintenance' ? 'bg-orange-500/10 text-orange-500' :
                        'bg-destructive/10 text-destructive'
                      }`}>
                        {asset.lifecycle_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{asset.condition_status}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Registration Modal[cite: 4] */}
      {showModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-lg rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold flex items-center gap-2"><Package size={20} className="text-primary"/> Register New Asset</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X size={20} /></button>
            </div>
            
            {error && <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{error}</div>}

            <form onSubmit={handleRegister} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Asset Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" placeholder="e.g. Dell XPS 15" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Category</label>
                  <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="">Select Category...</option>
                    {categories.map(c => <option key={c.category_id} value={c.category_id}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-1">Initial Condition</label>
                  <select value={formData.condition_status} onChange={e => setFormData({...formData, condition_status: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none">
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1">Serial Number (Optional)</label>
                <input type="text" value={formData.serial_number} onChange={e => setFormData({...formData, serial_number: e.target.value})} className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:outline-none" />
              </div>

              <label className="flex items-center gap-3 p-3 border border-border rounded-md hover:bg-muted/50 cursor-pointer transition-colors">
                <input type="checkbox" checked={formData.is_shared_resource} onChange={e => setFormData({...formData, is_shared_resource: e.target.checked})} className="w-4 h-4 rounded border-border text-primary focus:ring-primary bg-background" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Shared Resource</span>
                  <span className="text-xs text-muted-foreground">Check this if users need to book this via the Calendar.</span>
                </div>
              </label>

              <div className="pt-4 mt-4 border-t border-border flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">Cancel</button>
                <button type="submit" className="bg-primary text-primary-foreground px-6 py-2 rounded-md text-sm font-medium hover:opacity-90 transition">Register Asset</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}