import { ThemeProvider } from '@/lib/theme'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import FeaturesSection from '@/components/FeaturesSection'
import UIDemoSection from '@/components/UIDemoSection'
import RBACSection from '@/components/RBACSection'
import AuthSection from '@/components/AuthSection'
import Footer from '@/components/Footer'

export default function App() {
  return (
    <ThemeProvider>
      <div className='min-h-screen bg-background text-foreground'>
        <Navbar />
        <main>
          <HeroSection />
          <FeaturesSection />
          <UIDemoSection />
          <RBACSection />
          <AuthSection />
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  )
}
