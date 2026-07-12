import React, { useState } from 'react';
import { Calendar, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

const ResourceBooking = () => {
  const [bookingStatus, setBookingStatus] = useState('');

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    // Fetch call to your backend route
    // const response = await fetch('http://localhost:5005/bookings', { ... });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 p-4 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Resource Booking</h1>
          <p className="text-muted-foreground mt-1 text-sm">Schedule shared resources and manage availability.</p>
        </div>
      </div>

      {/* Main Booking Card */}
      <div className="bg-card text-card-foreground p-6 sm:p-8 rounded-xl shadow-sm border border-border transition-all hover:shadow-md">
        <form onSubmit={handleBooking} className="space-y-6">
          
          {/* Resource Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Select Resource</label>
            <select className="w-full p-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-foreground transition-all">
              <option>Conference room B2 - Tue, 7 Jul</option>
            </select>
          </div>

          {/* Calendar View Mockup */}
          <div className="space-y-3 p-5 bg-muted/30 rounded-xl border border-border mt-8">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">Availability Schedule</h3>
            
            {/* Booked Slot - Uses Primary Theme */}
            <div className="bg-primary/10 border-l-4 border-primary p-3 rounded-lg flex items-center gap-3 shadow-sm transition-colors">
              <div className="flex items-center gap-2 font-mono text-primary font-bold w-20 shrink-0">
                <Clock size={16} /> 9:00
              </div>
              <span className="text-sm font-medium text-foreground">Booked - Procurement Team - 9 to 10</span>
            </div>
            
            {/* Conflict Slot - Uses Destructive Theme & custom animation */}
            <div className="bg-destructive/10 border-l-4 border-destructive p-3 rounded-lg flex flex-col sm:flex-row sm:items-center gap-3 shadow-sm border-dashed animate-pulse-glow">
              <div className="flex items-center gap-2 font-mono text-destructive font-bold w-20 shrink-0">
                <Clock size={16} /> 9:30
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-destructive">
                <AlertTriangle size={16} className="shrink-0" />
                <span>Requested 9:30 to 10:30 - conflict - slot is unavailable</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit" 
              className="flex items-center gap-2 bg-primary text-primary-foreground px-6 py-2.5 rounded-lg hover:opacity-90 transition shadow-sm font-medium"
            >
              <Calendar size={18} /> Book a slot
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ResourceBooking;