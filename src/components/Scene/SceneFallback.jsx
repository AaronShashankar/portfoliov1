import React from 'react'
import styles from './Scene.module.css'
export default function SceneFallback() {
  return <div className={styles.fallbackContainer} aria-hidden="true"><div className={styles.fallbackOrb} /><div className={styles.fallbackRing1} /><div className={styles.fallbackRing2} /><div className={styles.fallbackGrid} /></div>
}
