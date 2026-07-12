import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, User, Wrench, AlertTriangle } from 'lucide-react';

// --- Types & Interfaces ---
interface MaintenanceRequest {
  request_id: number;
  status: string;
  asset_tag: string;
  asset_name: string;
  issue_description: string;
}

interface ColumnDef {
  id: string;
  title: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
}

// --- Column Configuration ---
const COLUMNS: ColumnDef[] = [
  { id: 'Pending', title: 'Pending', icon: Clock, color: 'text-amber-500', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/20' },
  { id: 'Approved', title: 'Approved', icon: CheckCircle, color: 'text-blue-500', bgColor: 'bg-blue-500/10', borderColor: 'border-blue-500/20' },
  { id: 'Technician Assigned', title: 'Technician Assigned', icon: User, color: 'text-purple-500', bgColor: 'bg-purple-500/10', borderColor: 'border-purple-500/20' },
  { id: 'In Progress', title: 'In Progress', icon: Wrench, color: 'text-orange-500', bgColor: 'bg-orange-500/10', borderColor: 'border-orange-500/20' },
  { id: 'Resolved', title: 'Resolved', icon: CheckCircle, color: 'text-emerald-500', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/20' }
];

export default function MaintenanceKanban() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('http://localhost:5005/api/maintenance');
      
      // If backend fails, fallback to mock data instead of crashing the UI
      if (!response.ok) {
        console.warn('Backend not found (404). Falling back to mock data for UI testing.');
        setRequests([
          { request_id: 1, status: 'Pending', asset_tag: 'LAP-001', asset_name: 'MacBook Pro M2', issue_description: 'Screen flickering heavily.' },
          { request_id: 2, status: 'Approved', asset_tag: 'MON-042', asset_name: 'Dell 27" Monitor', issue_description: 'Power button unresponsive.' },
          { request_id: 3, status: 'In Progress', asset_tag: 'SRV-009', asset_name: 'Database Server', issue_description: 'Routine cooling fan replacement.' }
        ]);
        setLoading(false);
        return;
      }

      const data: MaintenanceRequest[] = await response.json();
      setRequests(data);
    } catch (err: any) {
      console.error('Failed to fetch requests:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, requestId: number) => {
    e.dataTransfer.setData('requestId', requestId.toString());
    // Optional: make the dragging card look slightly transparent
    if (e.currentTarget) {
      setTimeout(() => {
        (e.target as HTMLElement).classList.add('opacity-50');
      }, 0);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
    (e.target as HTMLElement).classList.remove('opacity-50');
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Required to allow dropping
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>, newStatus: string) => {
    e.preventDefault();
    const requestIdStr = e.dataTransfer.getData('requestId');
    if (!requestIdStr) return;
    
    const requestId = parseInt(requestIdStr, 10);

    // Optimistic UI update
    setRequests(prev => prev.map(req => 
      req.request_id === requestId 
        ? { ...req, status: newStatus } 
        : req
    ));

    try {
      // Backend update
      const response = await fetch(`http://localhost:5005/api/maintenance/${requestId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newStatus })
      });
      
      if (!response.ok) throw new Error('Update failed');
    } catch (err) {
      console.error('Failed to update status:', err);
      // Revert state on failure
      fetchRequests(); 
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)] text-muted-foreground">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <Wrench className="animate-bounce" size={24} />
          <p>Loading workflow board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center text-destructive flex justify-center items-center h-64 gap-2">
        <AlertTriangle size={20} /> Error: {error}
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-8 h-[calc(100vh-4rem)] flex flex-col animate-in fade-in duration-500">
      
      {/* Header matching Dashboard/Booking style */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 mb-8 shrink-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Maintenance Workflow</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Drag cards to update statuses. Approving moves asset to <span className="font-semibold text-foreground">Under Maintenance</span>, resolving returns it to <span className="font-semibold text-foreground">Available</span>.
          </p>
        </div>
      </div>

      {/* Kanban Board Container */}
      <div className="flex-1 flex gap-6 overflow-x-auto pb-4 custom-scrollbar">
        {COLUMNS.map(column => {
          const columnRequests = requests.filter(req => req.status === column.id);
          
          return (
            <div 
              key={column.id}
              className="flex-shrink-0 w-80 flex flex-col bg-muted/20 rounded-xl border border-border transition-colors hover:bg-muted/30"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              {/* Column Header */}
              <div className={`p-4 border-b border-border flex items-center justify-between bg-card rounded-t-xl ${column.borderColor} border-b-2`}>
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-md ${column.bgColor}`}>
                    <column.icon size={16} className={column.color} />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm tracking-wide">{column.title}</h3>
                </div>
                <span className="text-xs font-bold bg-background px-2.5 py-1 rounded-full text-muted-foreground border border-border shadow-sm">
                  {columnRequests.length}
                </span>
              </div>

              {/* Draggable Cards Area */}
              <div className="flex-1 p-3 space-y-3 overflow-y-auto min-h-[200px]">
                {columnRequests.map(request => (
                  <div
                    key={request.request_id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, request.request_id)}
                    onDragEnd={handleDragEnd}
                    className="bg-card p-4 rounded-xl border border-border shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/50 hover:shadow-md transition-all group"
                  >
                    {/* Asset Tag & ID */}
                    <div className="flex justify-between items-start mb-3">
                      <span className="inline-flex items-center rounded-md bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary ring-1 ring-inset ring-primary/20">
                        {request.asset_tag}
                      </span>
                      <span className="text-[10px] font-medium text-muted-foreground">
                        REQ-{request.request_id.toString().padStart(4, '0')}
                      </span>
                    </div>
                    
                    {/* Card Content */}
                    <h4 className="text-sm font-semibold text-foreground mb-1.5 group-hover:text-primary transition-colors">
                      {request.asset_name}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {request.issue_description || 'No issue description provided.'}
                    </p>
                  </div>
                ))}
                
                {/* Empty State Drop Zone Indicator */}
                {columnRequests.length === 0 && (
                  <div className="h-full w-full flex items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-muted-foreground/50 text-sm font-medium">
                    Drop here
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}