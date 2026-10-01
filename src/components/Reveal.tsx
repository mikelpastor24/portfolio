import { useEffect, useRef } from 'react'
import type { ReactNode } from 'react'

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (!element || motionPreference.matches || !('IntersectionObserver' in window)) return

    element.classList.add('reveal-pending')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        element.classList.remove('reveal-pending')
        observer.disconnect()
      }
    }, { threshold: 0.08 })
    observer.observe(element)

    const onMotionChange = () => {
      if (motionPreference.matches) {
        element.classList.remove('reveal-pending')
        observer.disconnect()
      }
    }
    motionPreference.addEventListener('change', onMotionChange)
    return () => {
      observer.disconnect()
      motionPreference.removeEventListener('change', onMotionChange)
      element.classList.remove('reveal-pending')
    }
  }, [])

  return <div ref={ref} className={`reveal ${className}`}>{children}</div>
}
