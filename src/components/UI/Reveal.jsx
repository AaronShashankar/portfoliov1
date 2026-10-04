import React, { useEffect, useRef } from 'react'
import { useAppearance } from './Appearance'

export default function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null)
  const { motionEnabled } = useAppearance()
  useEffect(() => {
    const element = ref.current
    if (!motionEnabled || !('IntersectionObserver' in window)) {
      element.dataset.visible = 'true'
      return
    }
    if (element.getBoundingClientRect().top < window.innerHeight * .92) return
    element.dataset.visible = 'false'
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { element.dataset.visible = 'true'; observer.disconnect() }
    }, { rootMargin: '0px 0px -6% 0px' })
    observer.observe(element)
    return () => { observer.disconnect(); element.dataset.visible = 'true' }
  }, [motionEnabled])
  return <div ref={ref} className={`reveal ${className}`} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>
}
