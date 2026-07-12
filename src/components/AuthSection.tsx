import { useState, useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { cn } from '@/lib/utils'
import { Mail, Lock, Eye, EyeOff, ArrowRight, Check, Loader2 } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

function AuthField({
  label,
  type,
  icon: Icon,
  placeholder,
}: {
  label: string
  type: string
  icon: React.ElementType
  placeholder: string
}) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'

  return (
    <div className='space-y-1.5'>
      <label className='text-xs font-medium text-muted-foreground'>{label}</label>
      <div className='relative'>
        <Icon size={14} className='absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' />
        <input
          type={isPassword ? (show ? 'text' : 'password') : type}
          placeholder={placeholder}
          className='w-full h-10 pl-9 pr-9 rounded-lg border bg-background text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-all'
        />
        {isPassword && (
          <button
            type='button'
            onClick={() => setShow(!show)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors'
            tabIndex={-1}
          >
            {show ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        )}
      </div>
    </div>
  )
}

function BenefitRow({ text }: { text: string }) {
  return (
    <div className='flex items-start gap-3'>
      <div className='w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5'>
        <Check size={10} className='text-primary' />
      </div>
      <span className='text-sm text-muted-foreground'>{text}</span>
    </div>
  )
}

export default function AuthSection() {
  const [tab, setTab] = useState<'signin' | 'signup'>('signin')
  const [loading, setLoading] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

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
      gsap.from(formRef.current, {
        x: -50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: formRef.current, start: 'top 80%' },
      })
      gsap.from(infoRef.current, {
        x: 50,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: { trigger: infoRef.current, start: 'top 80%' },
      })
    })
    return () => ctx.revert()
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => setLoading(false), 1500)
  }

  return (
    <section ref={sectionRef} id='auth' className='py-24 relative overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30 -z-10' />

      <div className='max-w-7xl mx-auto px-4 sm:px-6'>
        <div ref={headingRef} className='max-w-2xl mb-12 sm:mb-16'>
          <span className='text-xs font-semibold text-primary uppercase tracking-widest'>Get Started</span>
          <h2 className='text-3xl sm:text-4xl font-bold mt-3 mb-4'>
            Start managing assets with{' '}
            <span className='bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent'>
              confidence
            </span>
          </h2>
          <p className='text-muted-foreground leading-relaxed'>
            Join enterprises that trust AssetFlow for real-time visibility, ironclad security, and frictionless workflows.
          </p>
        </div>

        <div className='grid lg:grid-cols-2 gap-8 lg:gap-12 items-start'>
          <div ref={formRef}>
            <div className='bg-card border rounded-2xl shadow-sm overflow-hidden'>
              <div className='flex border-b'>
                <button
                  onClick={() => setTab('signin')}
                  className={cn(
                    'flex-1 py-3.5 text-sm font-medium transition-all relative',
                    tab === 'signin'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Sign In
                  {tab === 'signin' && (
                    <span className='absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full' />
                  )}
                </button>
                <button
                  onClick={() => setTab('signup')}
                  className={cn(
                    'flex-1 py-3.5 text-sm font-medium transition-all relative',
                    tab === 'signup'
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  Create Account
                  {tab === 'signup' && (
                    <span className='absolute bottom-0 left-1/4 right-1/4 h-0.5 bg-primary rounded-full' />
                  )}
                </button>
              </div>

              <form onSubmit={handleSubmit} className='p-5 sm:p-6 space-y-4'>
                {tab === 'signup' && (
                  <div className='grid sm:grid-cols-2 gap-4'>
                    <AuthField label='First Name' type='text' icon={Mail} placeholder='Jane' />
                    <AuthField label='Last Name' type='text' icon={Mail} placeholder='Doe' />
                  </div>
                )}

                <AuthField label='Work Email' type='email' icon={Mail} placeholder='jane@company.com' />
                <AuthField label='Password' type='password' icon={Lock} placeholder='••••••••' />

                {tab === 'signin' && (
                  <div className='flex items-center justify-between text-xs'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input type='checkbox' defaultChecked className='rounded border-border text-primary focus:ring-ring' />
                      <span className='text-muted-foreground'>Remember me</span>
                    </label>
                    <a href='#' className='text-primary hover:underline'>Forgot password?</a>
                  </div>
                )}

                {tab === 'signup' && (
                  <p className='text-xs text-muted-foreground'>
                    By creating an account, you agree to our{' '}
                    <a href='#' className='text-primary hover:underline'>Terms of Service</a> and{' '}
                    <a href='#' className='text-primary hover:underline'>Privacy Policy</a>.
                  </p>
                )}

                <button
                  type='submit'
                  disabled={loading}
                  className='w-full h-11 rounded-lg bg-primary text-primary-foreground font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-70'
                >
                  {loading ? (
                    <Loader2 size={16} className='animate-spin' />
                  ) : (
                    <>
                      {tab === 'signin' ? 'Sign In' : 'Create Account'}
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>

                <div className='relative'>
                  <div className='absolute inset-0 flex items-center'>
                    <span className='w-full border-t' />
                  </div>
                  <div className='relative flex justify-center text-xs'>
                    <span className='bg-card px-2 text-muted-foreground'>or continue with</span>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3'>
                  {['Google', 'Microsoft'].map((provider) => (
                    <button
                      key={provider}
                      type='button'
                      className='h-10 rounded-lg border bg-background text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all flex items-center justify-center gap-2'
                    >
                      <svg className='w-4 h-4' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2'>
                        <circle cx='12' cy='12' r='10' />
                        <path d='M12 8v8M8 12h8' />
                      </svg>
                      {provider}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>

          <div ref={infoRef} className='space-y-6 sm:space-y-8'>
            <div className='bg-card border rounded-2xl p-5 sm:p-6 shadow-sm'>
              <h3 className='font-semibold mb-4'>Why AssetFlow?</h3>
              <div className='space-y-3.5'>
                <BenefitRow text='Single sign-on with your corporate IdP (SAML/OIDC)' />
                <BenefitRow text='Role-based access for Admin, Manager, Technician, Auditor' />
                <BenefitRow text='End-to-end audit trails with tamper-evident logs' />
                <BenefitRow text='99.9% uptime SLA with enterprise-grade security' />
                <BenefitRow text='Dedicated onboarding & 24/7 support' />
              </div>
            </div>

            <div className='bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5 border rounded-2xl p-5 sm:p-6 shadow-sm'>
              <div className='flex items-center gap-3 mb-3'>
                <span className='w-2 h-2 rounded-full bg-emerald-500 animate-pulse' />
                <span className='text-xs font-semibold text-emerald-600 dark:text-emerald-400'>Trusted by enterprise teams</span>
              </div>
              <p className='text-sm text-muted-foreground leading-relaxed'>
                "AssetFlow replaced 6 spreadsheets and a paper-based sign-out system in under 2 weeks.
                Our audit time dropped by 73%."
              </p>
              <div className='flex items-center gap-3 mt-4'>
                <div className='w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-xs font-bold text-primary'>
                  MK
                </div>
                <div>
                  <p className='text-xs font-medium'>Marcus Kline</p>
                  <p className='text-[10px] text-muted-foreground'>CTO, OmniCorp Industries</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
