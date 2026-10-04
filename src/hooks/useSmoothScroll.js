import { useEffect, useRef, useState } from 'react'

// Event-driven metrics avoid idle animation loops and per-frame React updates.
export function useSmoothScroll() {
  const scrollRef = useRef({ currentY: 0, progress: 0, velocity: 0 })
  const [scrollProgress, setScrollProgress] = useState(0)
  useEffect(() => {
    const update = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
      const progress = Math.min(1, Math.max(0, window.scrollY / max))
      scrollRef.current = { currentY: window.scrollY, progress, velocity: 0 }
      setScrollProgress(progress)
    }
    update()
    const observer = new ResizeObserver(update)
    observer.observe(document.body)
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => { observer.disconnect(); window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])
  return { scrollRef, scrollProgress }
}
