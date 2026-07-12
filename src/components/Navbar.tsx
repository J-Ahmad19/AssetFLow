import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { cn } from '@/lib/utils'
import { useTheme } from '@/lib/theme'
import { Menu, X, Moon, Sun, LogIn, UserPlus } from 'lucide-react'

const navLinks = [
  { label: 'Features', href: '#features' },
  { label: 'Demo', href: '#demo' },
  { label: 'Security', href: '#security' },
  { label: 'Pricing', href: '#pricing' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()
  const headerRef = useRef<HTMLElement>(null)
  const linksRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!headerRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headerRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
      })
    })
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!linksRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(linksRef.current?.children || [], {
        y: -20,
        opacity: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: 'power2.out',
        delay: 0.3,
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <header
      ref={headerRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-background/80 backdrop-blur-xl border-b shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between'>
        <a href='#' className='flex items-center gap-2 shrink-0'>
          <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
            <span className='text-white font-bold text-sm'>AF</span>
          </div>
          <span className='font-semibold text-lg tracking-tight hidden sm:inline'>AssetFlow</span>
        </a>

        <nav ref={linksRef} className='hidden md:flex items-center gap-6 lg:gap-8'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors'
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className='flex items-center gap-2 sm:gap-3'>
          <button
            onClick={toggleTheme}
            className='p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all'
            aria-label='Toggle theme'
          >
            {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
          </button>

          <a
            href='#auth'
            className='hidden sm:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg border bg-card hover:bg-muted/50 transition-all'
          >
            <LogIn size={14} />
            Sign In
          </a>
          <a
            href='#auth'
            className='hidden sm:inline-flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-sm'
          >
            <UserPlus size={14} />
            Sign Up
          </a>

          <button
            className='md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all'
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label='Toggle menu'
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className='md:hidden bg-card/95 backdrop-blur-xl border-b px-4 sm:px-6 py-4 flex flex-col gap-3 shadow-lg'>
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className='text-sm text-muted-foreground hover:text-foreground transition-colors py-1'
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <div className='border-t pt-3 flex flex-col gap-2'>
            <a
              href='#auth'
              className='text-sm font-medium px-4 py-2.5 rounded-lg border bg-card text-center transition-all'
              onClick={() => setMobileOpen(false)}
            >
              Sign In
            </a>
            <a
              href='#auth'
              className='text-sm font-medium px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-center transition-all'
              onClick={() => setMobileOpen(false)}
            >
              Sign Up
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
