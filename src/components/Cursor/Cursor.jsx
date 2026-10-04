import React, { useEffect, useRef, useState } from 'react'
import styles from './Cursor.module.css'
import { useReducedMotion } from '../../hooks/useReducedMotion'

export default function Cursor() {
  const reducedMotion = useReducedMotion()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch || reducedMotion) return

    let mouseX = -100
    let mouseY = -100

    const onMouseMove = (e) => {
      mouseX = e.clientX
      mouseY = e.clientY
      setIsVisible(true)

      // Direct placement of central dot for zero latency
      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`
      }
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const onMouseLeave = () => setIsVisible(false)
    const onMouseEnter = () => setIsVisible(true)

    // Detect hovering over links, buttons or interactive elements
    const onMouseOver = (e) => {
      const target = e.target
      const isInteractive = Boolean(
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[role="button"]') ||
        target.closest('[data-cursor]') ||
        target.closest('.interactive')
      )
      setIsHovering(isInteractive)
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mouseover', onMouseOver, { passive: true })
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mouseover', onMouseOver)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)
    }
  }, [reducedMotion])

  return (
    <div
      className={`${styles.cursorContainer} ${isVisible ? styles.visible : ''} ${
        isHovering ? styles.hovering : ''
      } ${isClicking ? styles.clicking : ''}`}
      aria-hidden="true"
    >
      <div ref={ringRef} className={styles.cursorRing} />
      <div ref={dotRef} className={styles.cursorDot} />
    </div>
  )
}
