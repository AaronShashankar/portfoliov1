import React, { useEffect, useRef, useState } from 'react'
import { useAppearance } from '../UI/Appearance'
import styles from './Scene.module.css'

export default function Scene() {
  const host = useRef(null)
  const controller = useRef(null)
  const { theme, motionEnabled } = useAppearance()
  const latest = useRef({ theme, motionEnabled })
  const [ready, setReady] = useState(false)
  useEffect(() => {
    latest.current = { theme, motionEnabled }
    controller.current?.update(theme, motionEnabled)
  }, [theme, motionEnabled])
  useEffect(() => {
    let cancelled = false
    // Defer the GPU library so content and controls paint immediately.
    const timer = setTimeout(() => {
      import('./renderer').then(({ createBackdrop }) => {
        if (cancelled) return
        try {
          controller.current = createBackdrop(host.current, () => setReady(false))
          controller.current.update(latest.current.theme, latest.current.motionEnabled)
          setReady(true)
        } catch { setReady(false) }
      }).catch(() => { if (!cancelled) setReady(false) })
    }, 180)
    return () => { cancelled = true; clearTimeout(timer); controller.current?.dispose(); controller.current = null }
  }, [])
  return <div className={styles.scene} aria-hidden="true">
    <div className={styles.ambient} />
    {!ready && <div className={styles.fallback}><div /><div /><div /></div>}
    <div ref={host} className={`${styles.canvas} ${ready ? styles.ready : ''}`} />
    <div className={styles.grid} />
  </div>
}
