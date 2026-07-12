import React, { useEffect, useState } from 'react';
import { Activity } from 'lucide-react';

export default function ActivityFeed() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const response = await fetch('http://localhost:5005/api/insights/feed');
      if (response.ok) setLogs(await response.json());
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <p className="text-muted-foreground mt-1 text-sm">System-wide audit trails and events.</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="divide-y divide-border">
          {logs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No recent activity detected.</div>
          ) : logs.map((log, index) => (
            <div key={index} className="p-4 flex gap-4 hover:bg-muted/30 transition-colors">
              <div className="mt-1"><Activity size={16} className="text-primary"/></div>
              <div>
                <p className="text-sm font-medium">{log.detail}</p>
                <p className="text-xs text-muted-foreground mt-1">{new Date(log.created_at).toLocaleString()}</p>
              </div>
              <div className="ml-auto">
                <span className="text-[10px] uppercase tracking-wider font-bold bg-muted px-2 py-1 rounded text-muted-foreground">{log.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}