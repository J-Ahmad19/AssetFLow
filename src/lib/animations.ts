import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export function useGSAPAnimation(
  selector: string,
  animation: gsap.TweenVars = {},
  trigger?: gsap.DOMTarget,
  scrollTrigger?: boolean
) {
  useEffect(() => {
    const els = document.querySelectorAll(selector)
    if (!els.length) return

    const ctx = gsap.context(() => {
      const vars: gsap.TweenVars = { ...animation }
      if (scrollTrigger && trigger) {
        vars.scrollTrigger = {
          trigger,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        }
      }
      gsap.fromTo(els, { opacity: 0, y: 40, ...vars }, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out', ...vars })
    })

    return () => ctx.revert()
  }, [selector])
}

export function useCountUp(
  ref: React.RefObject<HTMLElement | null>,
  end: number,
  duration: number = 2,
  suffix: string = ''
) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const ctx = gsap.context(() => {
      const obj = { val: 0 }
      gsap.to(obj, {
        val: end,
        duration,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
        },
        onUpdate: () => {
          el.textContent = `${Math.round(obj.val)}${suffix}`
        },
      })
    })

    return () => ctx.revert()
  }, [ref, end, duration, suffix])
}
