import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import KPICard from './KPICard'
import { ArrowRight, Shield, BarChart3, Users } from 'lucide-react'

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
      tl.from(badgeRef.current, { y: 20, opacity: 0, duration: 0.6 })
        .from(titleRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.3')
        .from(descRef.current, { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
        .from(ctaRef.current?.children || [], { y: 20, opacity: 0, stagger: 0.15, duration: 0.6 }, '-=0.4')
        .from(statsRef.current, { y: 50, opacity: 0, duration: 1 }, '-=0.6')
    })
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={containerRef}
      className='relative min-h-screen pt-24 pb-16 overflow-hidden'
    >
      <div className='absolute inset-0 -z-10'>
        <div className='absolute top-0 right-0 w-[500px] sm:w-[600px] h-[500px] sm:h-[600px] bg-gradient-to-bl from-primary/5 via-secondary/5 to-transparent rounded-full blur-3xl' />
        <div className='absolute bottom-0 left-0 w-[400px] sm:w-[500px] h-[400px] sm:h-[500px] bg-gradient-to-tr from-accent/5 via-primary/5 to-transparent rounded-full blur-3xl' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] sm:w-[800px] h-[600px] sm:h-[800px] bg-gradient-to-r from-primary/[0.02] to-secondary/[0.02] rounded-full blur-3xl' />
      </div>

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div className='max-w-3xl mx-auto text-center mb-12 sm:mb-16'>
          <div ref={badgeRef} className='inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-primary mb-6'>
            <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
            Live — Enterprise-grade asset management
          </div>

          <h1
            ref={titleRef}
            className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6'
          >
            Real-Time{' '}
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Asset Visibility
            </span>
            {' '}&amp; Control
          </h1>

          <p
            ref={descRef}
            className='text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed px-4 sm:px-0'
          >
            Enterprise Asset &amp; Resource Management System that eliminates spreadsheets and paper logs.
            Gain complete visibility, automate compliance, and optimize resource utilization across your organization.
          </p>

          <div ref={ctaRef} className='flex flex-wrap items-center justify-center gap-3 sm:gap-4 mt-8'>
            <a
              href='#auth'
              className='inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm sm:text-base hover:opacity-90 transition-all shadow-lg shadow-primary/20'
            >
              Get Started Free
              <ArrowRight size={16} />
            </a>
            <a
              href='#demo'
              className='inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg border bg-card hover:bg-muted/50 transition-colors font-medium text-sm sm:text-base'
            >
              <Shield size={16} />
              See How It Works
            </a>
          </div>
        </div>

        <div ref={statsRef} className='grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mb-12 sm:mb-16'>
          <KPICard value={99.9} suffix='%' label='Uptime' description='Guaranteed platform availability' trend='up' />
          <KPICard value={47} suffix='%' label='Efficiency' description='Reduction in asset downtime' trend='up' />
          <KPICard value={12} suffix='k+' label='Assets' description='Managed across enterprise' trend='up' />
          <KPICard value={3.2} suffix='x' label='ROI' description='Average return on investment' trend='up' />
        </div>

        <div className='relative max-w-5xl mx-auto px-2 sm:px-0'>
          <div className='absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl blur-xl' />
          <div className='relative bg-card border rounded-2xl shadow-2xl overflow-hidden'>
            <div className='flex items-center gap-2 px-4 py-3 bg-muted/50 border-b'>
              <div className='w-3 h-3 rounded-full bg-rose-400' />
              <div className='w-3 h-3 rounded-full bg-amber-400' />
              <div className='w-3 h-3 rounded-full bg-emerald-400' />
              <span className='text-xs text-muted-foreground ml-2 truncate'>AssetFlow Dashboard — Enterprise Overview</span>
            </div>
            <div className='p-4 sm:p-6'>
              <div className='grid grid-cols-3 gap-3 sm:gap-4 mb-4'>
                <div className='h-16 sm:h-20 rounded-lg bg-gradient-to-br from-primary/5 to-secondary/5 border flex items-center justify-center'>
                  <div className='text-center'>
                    <BarChart3 className='w-4 sm:w-5 h-4 sm:h-5 text-primary mx-auto mb-0.5 sm:mb-1' />
                    <span className='text-[9px] sm:text-[10px] text-muted-foreground'>Asset Utilization</span>
                  </div>
                </div>
                <div className='h-16 sm:h-20 rounded-lg bg-gradient-to-br from-secondary/5 to-accent/5 border flex items-center justify-center'>
                  <div className='text-center'>
                    <Users className='w-4 sm:w-5 h-4 sm:h-5 text-secondary mx-auto mb-0.5 sm:mb-1' />
                    <span className='text-[9px] sm:text-[10px] text-muted-foreground'>Team Workload</span>
                  </div>
                </div>
                <div className='h-16 sm:h-20 rounded-lg bg-gradient-to-br from-accent/5 to-primary/5 border flex items-center justify-center'>
                  <div className='text-center'>
                    <Shield className='w-4 sm:w-5 h-4 sm:h-5 text-accent mx-auto mb-0.5 sm:mb-1' />
                    <span className='text-[9px] sm:text-[10px] text-muted-foreground'>Compliance</span>
                  </div>
                </div>
              </div>
              <div className='h-32 sm:h-48 rounded-lg bg-gradient-to-br from-muted/50 to-muted/30 border flex items-center justify-center'>
                <div className='text-center text-muted-foreground px-4'>
                  <div className='flex items-center gap-2 justify-center mb-2'>
                    <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                    <span className='text-xs font-medium'>Live Data Stream</span>
                  </div>
                  <span className='text-3xl sm:text-4xl font-light'>↗</span>
                  <p className='text-xs mt-1'>Real-time KPI dashboard — 12,400 assets tracked</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
