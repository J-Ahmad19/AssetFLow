import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function Footer() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const ctx = gsap.context(() => {
      gsap.from(ref.current?.children || [], {
        y: 30,
        opacity: 0,
        stagger: 0.15,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 90%' },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <footer ref={ref} className='border-t bg-card'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12'>
        <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8'>
          <div className='sm:col-span-2'>
            <div className='flex items-center gap-2 mb-4'>
              <div className='w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center'>
                <span className='text-white font-bold text-xs'>AF</span>
              </div>
              <span className='font-semibold'>AssetFlow</span>
            </div>
            <p className='text-sm text-muted-foreground max-w-sm leading-relaxed'>
              Enterprise Asset &amp; Resource Management System purpose-built for organizations
              that demand real-time visibility, ironclad security, and intuitive workflows.
            </p>
          </div>
          <div>
            <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4'>Platform</h4>
            <div className='flex flex-col gap-2.5'>
              {['Features', 'Integrations', 'Security', 'Pricing'].map((l) => (
                <a key={l} href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>{l}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className='text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4'>Company</h4>
            <div className='flex flex-col gap-2.5'>
              {['About', 'Blog', 'Careers', 'Contact'].map((l) => (
                <a key={l} href='#' className='text-sm text-muted-foreground hover:text-foreground transition-colors'>{l}</a>
              ))}
            </div>
          </div>
        </div>
        <div className='border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4'>
          <p className='text-xs text-muted-foreground'>
            &copy; {new Date().getFullYear()} AssetFlow. All rights reserved.
          </p>
          <div className='flex gap-4 text-xs text-muted-foreground'>
            <a href='#' className='hover:text-foreground transition-colors'>Privacy Policy</a>
            <a href='#' className='hover:text-foreground transition-colors'>Terms of Service</a>
            <a href='#' className='hover:text-foreground transition-colors'>Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
