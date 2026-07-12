import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Building2, Package, ArrowRightLeft, 
  Calendar, Wrench, ClipboardCheck, BarChart3, Bell, X 
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Organization Setup', path: '/organization', icon: Building2 },
  { name: 'Assets', path: '/assets', icon: Package },
  { name: 'Allocation & Transfer', path: '/allocations', icon: ArrowRightLeft },
  { name: 'Resource Booking', path: '/bookings', icon: Calendar },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench },
  { name: 'Audit', path: '/audit', icon: ClipboardCheck },
  { name: 'Reports', path: '/reports', icon: BarChart3 },
  { name: 'Notifications', path: '/notifications', icon: Bell },
];

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const location = useLocation();

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out md:translate-x-0 flex flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-border">
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-sm">
              <span className="text-white font-bold text-sm">AF</span>
            </div>
            <span className="font-semibold text-lg tracking-tight text-foreground">AssetFlow</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="md:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all duration-200",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <Icon size={18} className={isActive ? "text-primary" : "opacity-70"} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}