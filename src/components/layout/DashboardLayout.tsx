import React, { useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/lib/theme';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem('assetflow_token');
    localStorage.removeItem('assetflow_user');
    window.location.href = '/login';
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Persistent Sidebar */}
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 md:ml-64 transition-all duration-300">
        
        {/* Global Top Header */}
        <header className="h-16 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)} 
              className="md:hidden p-2 -ml-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              <Menu size={20} />
            </button>
            <h2 className="font-medium text-muted-foreground hidden sm:block">Workspace</h2>
          </div>
          
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
            >
              {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="h-6 w-px bg-border hidden sm:block"></div>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-destructive transition-colors px-2 py-1.5 rounded-md hover:bg-destructive/10"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}