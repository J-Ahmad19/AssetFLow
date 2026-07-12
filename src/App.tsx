import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import UIDemoSection from '@/components/UIDemoSection'
import RBACSection from '@/components/RBACSection'
import Footer from '@/components/Footer'

// Auth & Dashboard Components
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'
import Dashboard from '@/components/dashboard/Dashboard'
import DashboardLayout from '@/components/layout/DashboardLayout'

import OrganizationSetup from '@/components/admin/OrganizationSetup';
import AssetDirectory from '@/components/assets/AssetDirectory';
import AllocationTransferScreen from '@/components/workflows/AllocationTransferScreen';
import AuditCycleManager from '@/components/audits/AuditCycleManager';
import ReportsAnalytics from '@/components/insights/ReportsAnalytics';
import ActivityFeed from '@/components/insights/ActivityFeed';
import ResourceBooking from './components/bookings/ResourceBooking';
import MaintenanceKanban from './components/maintenance/MaintenanceKanban';



// 1. Move Navbar inside the LandingPage so it ONLY shows here
const LandingPage = () => (
  <>
    <Navbar />
    <HeroSection />
    <FeaturesSection />
    <UIDemoSection />
    <RBACSection />
  </>
)

// 2. Protected Route Logic
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('assetflow_token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        {/* Notice how flex-col is removed here, DashboardLayout handles its own flex */}
        <div className='min-h-screen bg-background text-foreground'>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<div className="flex items-center justify-center min-h-screen py-12 px-4"><LoginForm /></div>} />
            <Route path="/signup" element={<div className="flex items-center justify-center min-h-screen py-12 px-4"><SignupForm /></div>} />

            {/* Protected Routes wrapped in DashboardLayout */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Dashboard />
                  </DashboardLayout>
                </ProtectedRoute>
              } 
            />
            <Route 
                path="/organization" 
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      <OrganizationSetup />
                    </DashboardLayout>
                  </ProtectedRoute>
                } 
            />
            <Route 
                  path="/assets" 
                  element={
                    <ProtectedRoute>
                      <DashboardLayout>
                        <AssetDirectory />
                      </DashboardLayout>
                    </ProtectedRoute>
                  } 
                />
                <Route 
                    path="/allocations" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <AllocationTransferScreen />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/bookings" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <ResourceBooking />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/maintenance" 
                    element={
                      <ProtectedRoute>
                        <DashboardLayout>
                          <MaintenanceKanban />
                        </DashboardLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/audit" element={<ProtectedRoute><DashboardLayout><AuditCycleManager /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/reports" element={<ProtectedRoute><DashboardLayout><ReportsAnalytics /></DashboardLayout></ProtectedRoute>} />
                  <Route path="/notifications" element={<ProtectedRoute><DashboardLayout><ActivityFeed /></DashboardLayout></ProtectedRoute>} />
                               
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  )
}