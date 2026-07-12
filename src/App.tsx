import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import UIDemoSection from '@/components/UIDemoSection'
import RBACSection from '@/components/RBACSection'
import AuthSection from '@/components/AuthSection'
import Footer from '@/components/Footer'

// Import the new Auth components
import LoginForm from '@/components/auth/LoginForm'
import SignupForm from '@/components/auth/SignupForm'

// 1. Group your landing page sections into a clean, reusable component
const LandingPage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <UIDemoSection />
    <RBACSection />
    <AuthSection />
  </>
)

export default function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className='min-h-screen bg-background text-foreground flex flex-col'>
          {/* Navbar stays outside the Routes so it appears on every page */}
          <Navbar />
          
          {/* main flex-grow ensures the footer is always pushed to the bottom */}
          <main className='flex-grow'>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              
              <Route 
                path="/login" 
                element={
                  <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
                    <LoginForm />
                  </div>
                } 
              />
              
              <Route 
                path="/signup" 
                element={
                  <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12 px-4">
                    <SignupForm />
                  </div>
                } 
              />

              {/* 
                Future Protected Route Example 
                <Route path="/dashboard" element={<Dashboard />} /> 
              */}
            </Routes>
          </main>

          {/* Footer stays outside the Routes so it appears on every page */}
          <Footer />
        </div>
      </Router>
    </ThemeProvider>
  )
}