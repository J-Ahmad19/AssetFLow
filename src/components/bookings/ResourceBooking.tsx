import React, { useState, useEffect } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

interface Resource { asset_id: number; asset_tag: string; name: string; }
interface Booking { booking_id: number; start_time: string; end_time: string; user_name: string; status: string; }

const ResourceBooking = () => {
  const [resources, setResources] = useState<Resource[]>([]);
  const [selectedAssetId, setSelectedAssetId] = useState<string>('');
  const [bookings, setBookings] = useState<Booking[]>([]);
  
  // Form State
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  
  // Status State
  const [conflictError, setConflictError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/bookings/resources', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setResources(data);
        if (data.length > 0) setSelectedAssetId(data[0].asset_id.toString());
      }
    };
    fetchResources();
  }, []);

  useEffect(() => {
    if (!selectedAssetId) return;
    const fetchSchedule = async () => {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch(`http://localhost:5005/api/bookings/${selectedAssetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) setBookings(await response.json());
    };
    fetchSchedule();
  }, [selectedAssetId]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const token = localStorage.getItem('assetflow_token');
      const response = await fetch('http://localhost:5005/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ 
          asset_id: selectedAssetId, 
          start_time: startTime, 
          end_time: endTime 
        })
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setConflictError(data.error);
        } else {
          throw new Error(data.error);
        }
        return;
      }

      setSuccessMsg('Slot successfully booked!');
      setStartTime('');
      setEndTime('');
      
      // Refresh Schedule
      const schedResponse = await fetch(`http://localhost:5005/api/bookings/${selectedAssetId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (schedResponse.ok) setBookings(await schedResponse.json());
      
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (error: any) {
      setConflictError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDateTime = (dateString: string) => {
    const d = new Date(dateString);
    return d.toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 sm:p-8">
      
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Booking</h1>
          <p className="text-muted-foreground mt-1 text-sm">Schedule shared resources and manage availability.</p>
        </div>
      </div>

      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-sm border border-border transition-all hover:shadow-md">
        
        {successMsg && (
          <div className="bg-emerald-500/10 border-l-4 border-emerald-500 p-4 rounded-lg flex items-center gap-3 mb-6">
            <CheckCircle className="text-emerald-500" size={20} />
            <p className="text-emerald-600 dark:text-emerald-400 font-medium text-sm">{successMsg}</p>
          </div>
        )}

        <form onSubmit={handleBooking} className="space-y-6">
          
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Resource</label>
            <select 
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
            >
              {resources.length === 0 && <option>No shared resources available</option>}
              {resources.map(res => (
                <option key={res.asset_id} value={res.asset_id}>
                  {res.name} ({res.asset_tag})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Start Time</label>
              <input 
                type="datetime-local" 
                required
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">End Time</label>
              <input 
                type="datetime-local" 
                required
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full p-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground transition-all"
              />
            </div>
          </div>

          <div className="space-y-3 p-5 bg-muted/30 rounded-xl border border-border mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Availability Schedule</h3>
            
            {bookings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming bookings for this resource.</p>
            ) : (
              bookings.map((booking) => (
                <div key={booking.booking_id} className="bg-primary/10 border-l-4 border-primary p-3 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm transition-colors">
                  <div className="flex items-center gap-2 font-mono text-primary font-bold w-40 shrink-0 text-sm">
                    <Clock size={16} /> {formatDateTime(booking.start_time)}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    Booked - {booking.user_name} - Until {formatDateTime(booking.end_time)}
                  </span>
                </div>
              ))
            )}
            
            {/* Conditional Conflict Slot rendering */}
            {conflictError && (
              <div className="bg-destructive/10 border-l-4 border-destructive p-3 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm border-dashed animate-pulse-glow mt-4">
                <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                  <AlertTriangle size={16} className="shrink-0" />
                  <span>{conflictError}</span>
                </div>
              </div>
            )}
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={loading || resources.length === 0}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm font-medium disabled:opacity-50"
            >
              <Calendar size={18} /> {loading ? 'Processing...' : 'Book a slot'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResourceBooking;