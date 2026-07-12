import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { FileSpreadsheet, ArrowRight, CheckCircle2, XCircle } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const comparisons = [
  {
    label: 'Asset tracking',
    old: 'Manual spreadsheets with stale data',
    new: 'Real-time live dashboard',
  },
  {
    label: 'Resource booking',
    old: 'Email chains & calendar conflicts',
    new: 'Smart overlap-free scheduling',
  },
  {
    label: 'Audit compliance',
    old: 'Paper logs & manual filing',
    new: 'Automated audit trails & reports',
  },
  {
    label: 'Maintenance',
    old: 'Reactive & undocumented fixes',
    new: 'Predictive & preventive workflows',
  },
  {
    label: 'Role access',
    old: 'Shared drives & password sharing',
    new: 'Granular RBAC with SSO',
  },
]

export default function UIDemoSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const visualRef = useRef<HTMLDivElement>(null)
  const comparisonRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!sectionRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children || [], {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: headingRef.current, start: 'top 85%' },
      })

      gsap.from(visualRef.current, {
        x: -60,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: { trigger: visualRef.current, start: 'top 80%' },
      })

      gsap.from(comparisonRef.current?.children || [], {
        x: 60,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: 'power3.out',
        scrollTrigger: { trigger: comparisonRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id='demo' className='py-20 sm:py-24 relative'>
      <div className='absolute inset-0 bg-gradient-to-b from-muted/20 via-background to-muted/20 -z-10' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div ref={headingRef} className='max-w-2xl mb-12 sm:mb-16'>
          <span className='text-xs font-semibold text-primary uppercase tracking-widest'>See the Difference</span>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4'>
            From manual chaos to{' '}
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              one-click clarity
            </span>
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            Replace spreadsheets, paper logs, and tribal knowledge with an intuitive platform
            your whole team will actually use.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-center'>
          <div ref={visualRef} className='relative'>
            <div className='absolute -inset-4 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-3xl blur-2xl' />
            <div className='relative bg-card border rounded-2xl shadow-xl overflow-hidden'>
              <div className='flex items-center gap-2 px-4 py-3 bg-muted/50 border-b'>
                <div className='w-3 h-3 rounded-full bg-rose-400' />
                <div className='w-3 h-3 rounded-full bg-amber-400' />
                <div className='w-3 h-3 rounded-full bg-emerald-400' />
                <span className='text-xs text-muted-foreground ml-2'>AssetFlow — intuitive asset management</span>
              </div>
              <div className='p-4 sm:p-5 space-y-3'>
                <div className='flex items-center justify-between p-3 rounded-lg bg-primary/[0.03] border'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-8 h-8 rounded bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold shrink-0'>SRV</div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium truncate'>Server Rack 04A</p>
                      <p className='text-[10px] text-emerald-600 dark:text-emerald-400'>● Active — 98.7% uptime</p>
                    </div>
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0 ml-2'>Due: PM 2026-Q3</span>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-primary/[0.03] border'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-8 h-8 rounded bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center text-xs font-bold shrink-0'>WKS</div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium truncate'>Workshop B — Lathe #7</p>
                      <p className='text-[10px] text-amber-600 dark:text-amber-400'>● Scheduled maintenance</p>
                    </div>
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0 ml-2'>Tomorrow 09:00</span>
                </div>
                <div className='flex items-center justify-between p-3 rounded-lg bg-primary/[0.03] border'>
                  <div className='flex items-center gap-3 min-w-0'>
                    <div className='w-8 h-8 rounded bg-gradient-to-br from-accent/20 to-emerald-500/20 flex items-center justify-center text-xs font-bold shrink-0'>FLT</div>
                    <div className='min-w-0'>
                      <p className='text-sm font-medium truncate'>Fleet Vehicle — Van 12</p>
                      <p className='text-[10px] text-rose-600 dark:text-rose-400'>● Overdue inspection</p>
                    </div>
                  </div>
                  <span className='text-xs text-muted-foreground shrink-0 ml-2'>Overdue 3d</span>
                </div>
              </div>
            </div>
          </div>

          <div ref={comparisonRef} className='space-y-3 sm:space-y-4'>
            <div className='grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 sm:mb-4'>
              <div className='flex items-center gap-2'>
                <FileSpreadsheet size={14} />
                <span>Old Way</span>
              </div>
              <div />
              <div className='flex items-center gap-2'>
                <CheckCircle2 size={14} className='text-emerald-600 dark:text-emerald-400' />
                <span>AssetFlow</span>
              </div>
            </div>
            {comparisons.map((item) => (
              <div
                key={item.label}
                className='grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-4 items-center p-3 rounded-lg bg-card border hover:shadow-sm transition-shadow'
              >
                <div className='flex items-center gap-2 min-w-0'>
                  <XCircle size={14} className='text-rose-400 shrink-0' />
                  <span className='text-xs sm:text-sm text-muted-foreground line-through truncate'>{item.old}</span>
                </div>
                <ArrowRight size={14} className='text-primary shrink-0' />
                <div className='flex items-center gap-2 min-w-0'>
                  <CheckCircle2 size={14} className='text-emerald-500 shrink-0' />
                  <span className='text-xs sm:text-sm font-medium truncate'>{item.new}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
