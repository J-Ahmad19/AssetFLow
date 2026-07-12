import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Download } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsAnalytics() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('assetflow_token');
        const response = await fetch('http://localhost:5005/api/insights/analytics', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.ok) {
          setData(await response.json());
        }
      } catch (error) {
        console.error("Failed to fetch analytics", error);
      }
    };
    fetchData();
  }, []);

  if (!data) return <div className="p-8 text-center text-muted-foreground flex items-center justify-center min-h-[400px]">Compiling insights...</div>;

  // --- Prepare Data for Utilization Bar Chart ---
  const utilizationLabels = data.utilization.map((item: any) => item.category);
  const allocatedData = data.utilization.map((item: any) => item.allocated);
  const availableData = data.utilization.map((item: any) => item.total - item.allocated);

  const utilizationChartData = {
    labels: utilizationLabels,
    datasets: [
      {
        label: 'Allocated',
        data: allocatedData,
        backgroundColor: 'rgba(99, 102, 241, 0.8)', // Primary color
        borderRadius: 4,
      },
      {
        label: 'Available',
        data: availableData,
        backgroundColor: 'rgba(99, 102, 241, 0.2)', // Muted primary
        borderRadius: 4,
      }
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' as const, labels: { color: '#8b8d97' } },
    },
    scales: {
      x: { 
        stacked: true, 
        grid: { display: false, drawBorder: false },
        ticks: { color: '#8b8d97' }
      },
      y: { 
        stacked: true, 
        grid: { color: 'rgba(139, 141, 151, 0.1)', drawBorder: false },
        ticks: { color: '#8b8d97', stepSize: 1 }
      },
    },
  };

  // --- Prepare Data for Maintenance Pipeline Line Chart ---
  // We map the pipeline stages logically to form a timeline-like graph
  const pipelineOrder = ['Pending', 'Approved', 'Technician assigned', 'In Progress', 'Resolved'];
  
  // Initialize counts to 0 for all stages to ensure the chart renders a continuous line
  const maintenanceMap = new Map(pipelineOrder.map(status => [status, 0]));
  data.maintenance.forEach((m: any) => {
    maintenanceMap.set(m.status, m.count);
  });

  const maintenanceLabels = Array.from(maintenanceMap.keys());
  const maintenanceCounts = Array.from(maintenanceMap.values());

  const maintenanceChartData = {
    labels: maintenanceLabels,
    datasets: [
      {
        label: 'Assets in Stage',
        data: maintenanceCounts,
        borderColor: 'rgba(236, 72, 153, 0.8)', // Secondary/Accent color
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        borderWidth: 2,
        tension: 0.3, // Adds a smooth curve
        fill: true,
        pointBackgroundColor: 'rgba(236, 72, 153, 1)',
      }
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index' as const, intersect: false },
    },
    scales: {
      x: { 
        grid: { display: false, drawBorder: false },
        ticks: { color: '#8b8d97', maxRotation: 45, minRotation: 45 }
      },
      y: { 
        grid: { color: 'rgba(139, 141, 151, 0.1)', drawBorder: false },
        ticks: { color: '#8b8d97', stepSize: 1 }
      },
    },
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm">Real-time operational intelligence.</p>
        </div>
        <button className="flex items-center gap-2 bg-secondary text-secondary-foreground px-4 py-2 rounded-lg hover:opacity-90 transition shadow-sm text-sm font-medium">
          <Download size={16} /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Utilization Chart Block */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-[400px]">
          <h2 className="font-bold flex items-center gap-2 mb-6 text-foreground"><BarChart3 size={18} className="text-primary"/> Utilization by Department / Category</h2>
          <div className="flex-1 w-full relative">
            <Bar data={utilizationChartData} options={barOptions as any} />
          </div>
        </div>

        {/* Maintenance Frequency Block */}
        <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col h-[400px]">
          <h2 className="font-bold flex items-center gap-2 mb-6 text-foreground"><TrendingUp size={18} className="text-secondary"/> Maintenance Pipeline</h2>
          <div className="flex-1 w-full relative">
            <Line data={maintenanceChartData} options={lineOptions as any} />
          </div>
        </div>

      </div>

      {/* Extracted Insights List (Mocked structure for the bottom section of Screen 9) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Most Used Assets</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="font-medium text-foreground">Room B2</span> <span className="text-muted-foreground">34 bookings this month</span></li>
            <li className="flex justify-between"><span className="font-medium text-foreground">Van AF-343</span> <span className="text-muted-foreground">21 trips this month</span></li>
            <li className="flex justify-between"><span className="font-medium text-foreground">Projector AF-838</span> <span className="text-muted-foreground">18 uses</span></li>
          </ul>
        </div>
        <div className="bg-card border border-border rounded-xl shadow-sm p-6">
          <h3 className="font-bold text-sm text-muted-foreground uppercase tracking-wider mb-4">Idle Assets</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex justify-between"><span className="font-medium text-foreground">Camera AF-0301</span> <span className="text-destructive">Unused 60+ days</span></li>
            <li className="flex justify-between"><span className="font-medium text-foreground">Chair AF-0410</span> <span className="text-destructive">Unused 45 days</span></li>
          </ul>
        </div>
      </div>
    </div>
  );
}