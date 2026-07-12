import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Shield, Lock, KeyRound, FileCheck, Fingerprint, Bell } from 'lucide-react'
import { cn } from '@/lib/utils'

gsap.registerPlugin(ScrollTrigger)

const rbacFeatures = [
  {
    icon: Shield,
    title: 'Role-Based Access Control',
    description: 'Define granular permissions per role — Admin, Manager, Technician, Auditor, Viewer — with zero configuration overhead.',
  },
  {
    icon: Lock,
    title: 'Data Segmentation',
    description: 'Users see only what they need. Multi-site and multi-department isolation built in by default.',
  },
  {
    icon: Fingerprint,
    title: 'SSO & MFA',
    description: 'Enterprise SSO (SAML/OIDC) with mandatory multi-factor authentication for all privileged actions.',
  },
  {
    icon: FileCheck,
    title: 'Audit Logs',
    description: 'Immutable, tamper-evident logs of every action — who did what, when, and from where.',
  },
  {
    icon: Bell,
    title: 'Policy Automation',
    description: 'Automated compliance enforcement — flag unauthorized access attempts and enforce least-privilege policies.',
  },
  {
    icon: KeyRound,
    title: 'Credential Management',
    description: 'Automated key rotation, API token lifecycle management, and integration with your existing IdP.',
  },
]

const roleCards = [
  { role: 'Admin', bg: 'from-primary/10 to-primary/5', border: 'border-primary/20', text: 'text-primary' },
  { role: 'Manager', bg: 'from-secondary/10 to-secondary/5', border: 'border-secondary/20', text: 'text-secondary' },
  { role: 'Technician', bg: 'from-accent/10 to-accent/5', border: 'border-accent/20', text: 'text-accent' },
  { role: 'Auditor', bg: 'from-emerald-500/10 to-emerald-500/5', border: 'border-emerald-500/20', text: 'text-emerald-600 dark:text-emerald-400' },
]

export default function RBACSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const rolesRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

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

      gsap.from(rolesRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.12,
        duration: 0.6,
        ease: 'back.out(1.7)',
        scrollTrigger: { trigger: rolesRef.current, start: 'top 85%' },
      })

      gsap.from(featuresRef.current?.children || [], {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: 'power3.out',
        scrollTrigger: { trigger: featuresRef.current, start: 'top 85%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id='security' className='py-20 sm:py-24 relative'>
      <div className='absolute inset-0 bg-gradient-to-b from-background via-muted/10 to-background -z-10' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div ref={headingRef} className='max-w-2xl mb-12 sm:mb-16'>
          <span className='text-xs font-semibold text-primary uppercase tracking-widest'>Enterprise Security</span>
          <h2 className='text-2xl sm:text-3xl md:text-4xl font-bold mt-3 mb-4'>
            Secure by design.{' '}
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              Role-perfect by default.
            </span>
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            Granular role-based access control ensures every user sees only what they need — 
            no more, no less. Built for SOC 2, ISO 27001, and FedRAMP compliance.
          </p>
        </div>

        <div ref={rolesRef} className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-12 sm:mb-16'>
          {roleCards.map(({ role, bg, border, text }) => (
            <div
              key={role}
              className={cn(
                'rounded-xl border p-4 sm:p-5 bg-gradient-to-br text-center',
                bg, border
              )}
            >
              <div className={cn('text-xl sm:text-2xl font-bold', text)}>{role}</div>
              <div className='flex flex-wrap gap-1.5 justify-center mt-3'>
                {['Full Access', 'Reports', 'Settings'].slice(0, role === 'Auditor' ? 2 : 3).map((p) => (
                  <span key={p} className='text-[10px] px-2 py-0.5 rounded-full bg-card border text-muted-foreground'>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div ref={featuresRef} className='grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
          {rbacFeatures.map((feature) => {
            const Icon = feature.icon
            return (
              <div key={feature.title} className='flex gap-3 sm:gap-4 p-4 rounded-xl bg-card border hover:shadow-md transition-all'>
                <div className='w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-primary/5 border flex items-center justify-center shrink-0'>
                  <Icon className='w-4 sm:w-5 h-4 sm:h-5 text-primary' />
                </div>
                <div className='min-w-0'>
                  <h4 className='text-sm font-semibold mb-1'>{feature.title}</h4>
                  <p className='text-xs text-muted-foreground leading-relaxed'>{feature.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
