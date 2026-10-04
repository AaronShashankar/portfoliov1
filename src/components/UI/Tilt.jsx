import React, { useRef } from 'react'
import { useAppearance } from './Appearance'

export default function Tilt({ as: Element = 'div', children, className = '', ...props }) {
  const ref = useRef(null)
  const { motionEnabled } = useAppearance()
  const move = event => {
    if (!motionEnabled || event.pointerType === 'touch') return
    const rect = ref.current.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = (event.clientY - rect.top) / rect.height
    ref.current.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`)
    ref.current.style.setProperty('--tilt-y', `${(x - 0.5) * 7}deg`)
    ref.current.style.setProperty('--pointer-x', `${x * 100}%`)
    ref.current.style.setProperty('--pointer-y', `${y * 100}%`)
  }
  const reset = () => {
    ref.current.style.setProperty('--tilt-x', '0deg')
    ref.current.style.setProperty('--tilt-y', '0deg')
  }
  return <Element {...props} ref={ref} className={`tilt ${className}`} onPointerMove={move} onPointerLeave={reset}>{children}</Element>
}
