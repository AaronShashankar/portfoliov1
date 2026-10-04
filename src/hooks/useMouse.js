import { useEffect, useRef } from 'react'

/**
 * Tracks normalized mouse coords (-1 to 1) for 3D parallax
 * and raw client coordinates for custom cursor / magnetic elements.
 * Uses refs to avoid re-rendering entire component trees on mousemove.
 */
export function useMouse() {
  const mouse = useRef({
    // Normalized [-1, 1] coords
    x: 0,
    y: 0,
    // Target normalized coords
    targetX: 0,
    targetY: 0,
    // Raw viewport pixels
    clientX: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
    clientY: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
    isHoveringInteractive: false,
    isActive: false,
  })

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouse.current.clientX = e.clientX
      mouse.current.clientY = e.clientY
      mouse.current.targetX = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.targetY = -(e.clientY / window.innerHeight) * 2 + 1
      mouse.current.isActive = true
    }

    const handleMouseLeave = () => {
      mouse.current.isActive = false
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return mouse
}
