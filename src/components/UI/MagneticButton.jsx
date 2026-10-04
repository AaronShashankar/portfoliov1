import React, { useRef, useState } from 'react'
import styles from './MagneticButton.module.css'
import { useReducedMotion } from '../../hooks/useReducedMotion'

/**
 * Magnetic button that pulls smoothly toward the cursor on hover
 * and springs back to center on mouse leave.
 */
export default function MagneticButton({
  children,
  onClick,
  href,
  className = '',
  variant = 'primary', // 'primary' | 'secondary' | 'ghost'
  strength = 0.35,
  ...props
}) {
  const reducedMotion = useReducedMotion()
  const buttonRef = useRef(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const handleMouseMove = (e) => {
    if (!buttonRef.current || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return
    const rect = buttonRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distanceX = (e.clientX - centerX) * strength
    const distanceY = (e.clientY - centerY) * strength

    setPosition({ x: distanceX, y: distanceY })
  }

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 })
  }

  const Comp = href ? 'a' : 'button'
  const combinedClass = `${styles.magneticWrapper} ${styles[variant]} ${className}`

  return (
    <Comp
      ref={buttonRef}
      href={href}
      onClick={onClick}
      className={combinedClass}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out',
      }}
      data-cursor="magnetic"
      {...props}
    >
      <span
        className={styles.contentInner}
        style={{
          transform: `translate3d(${position.x * 0.4}px, ${position.y * 0.4}px, 0)`,
          transition: position.x === 0 && position.y === 0 ? 'transform 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)' : 'transform 0.1s ease-out',
        }}
      >
        {children}
      </span>
    </Comp>
  )
}
