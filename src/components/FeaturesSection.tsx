import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import {
  GitBranch,
  CalendarCheck,
  ClipboardCheck,
  Wrench,
} from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Feature {
  icon: React.ReactNode
  title: string
  description: string
  details: string[]
  gradient: string
  darkGradient: string
}

const features: Feature[] = [
  {
    icon: <GitBranch className='w-6 h-6' />,
    title: 'Structured Asset Lifecycles',
    description: 'End-to-end lifecycle management from procurement to disposal with full audit trails.',
    details: [
      'Automated depreciation tracking',
      'Condition monitoring & alerts',
      'Digital twin integration',
    ],
    gradient: 'from-primary/10 to-primary/5',
    darkGradient: 'dark:from-primary/15 dark:to-primary/5',
  },
  {
    icon: <CalendarCheck className='w-6 h-6' />,
    title: 'Overlap-Free Resource Booking',
    description: 'Smart scheduling that eliminates double-booking and maximizes resource utilization.',
    details: [
      'Real-time availability calendar',
      'Conflict detection & resolution',
      'Automated check-in/check-out',
    ],
    gradient: 'from-secondary/10 to-secondary/5',
    darkGradient: 'dark:from-secondary/15 dark:to-secondary/5',
  },
  {
    icon: <ClipboardCheck className='w-6 h-6' />,
    title: 'Automated Audit Cycles',
    description: 'Schedule, track, and document audits with automated compliance reporting.',
    details: [
      'Custom audit templates',
      'Regulatory compliance checks',
      'Auto-generated reports',
    ],
    gradient: 'from-accent/10 to-accent/5',
    darkGradient: 'dark:from-accent/15 dark:to-accent/5',
  },
  {
    icon: <Wrench className='w-6 h-6' />,
    title: 'Maintenance Workflows',
    description: 'Proactive and reactive maintenance orchestration with predictive insights.',
    details: [
      'Preventive maintenance schedules',
      'Work order automation',
      'Predictive failure analytics',
    ],
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    darkGradient: 'dark:from-emerald-500/15 dark:to-emerald-500/5',
  },
]

function FeatureCard({ feature }: { feature: Feature }) {
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!cardRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 60,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.current,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <div
      ref={cardRef}
      className='group relative bg-card rounded-xl border p-5 sm:p-6 hover:shadow-lg transition-all duration-300'
    >
      <div className={cn(
        'w-11 h-11 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br flex items-center justify-center mb-4 text-primary border',
        feature.gradient,
        feature.darkGradient,
        'group-hover:scale-110 transition-transform duration-300'
      )}>
        {feature.icon}
      </div>
      <h3 className='text-base sm:text-lg font-semibold mb-2'>{feature.title}</h3>
      <p className='text-sm text-muted-foreground mb-4 leading-relaxed'>{feature.description}</p>
      <ul className='space-y-1.5'>
        {feature.details.map((detail, i) => (
          <li key={i} className='flex items-start gap-2 text-xs text-muted-foreground'>
            <span className='w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0' />
            {detail}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!headingRef.current) return
    const ctx = gsap.context(() => {
      gsap.from(headingRef.current?.children || [], {
        y: 30,
        opacity: 0,
        stagger: 0.2,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id='features' className='py-20 sm:py-24 relative'>
      <div className='absolute inset-0 bg-gradient-to-b from-transparent via-muted/30 to-transparent -z-10' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div ref={headingRef} className='max-w-2xl mb-12 sm:mb-16'>
          <span className='text-xs font-semibold text-primary uppercase tracking-widest'>Platform Features</span>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4'>
            Everything you need to{' '}
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              manage assets at scale
            </span>
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            Purpose-built for enterprises that need complete control over their asset lifecycle,
            resource allocation, and compliance workflows.
          </p>
        </div>

        <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6'>
          {features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>
      </div>
    </section>
  )
}
