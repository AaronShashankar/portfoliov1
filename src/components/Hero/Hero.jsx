import React, { useState, useEffect } from 'react'
import { HERO_CONTENT } from '../../data/content'
import MagneticButton from '../UI/MagneticButton'
import styles from './Hero.module.css'

export default function Hero() {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    // Single orchestrated load moment triggering entrance cascade
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 150)
    return () => clearTimeout(timer)
  }, [])

  const letters1 = HERO_CONTENT.line1.split('')
  const letters2 = HERO_CONTENT.line2.split('')


  return (
    <section className={styles.heroSection} id="hero" tabIndex={-1} aria-label="Introduction">
      <div className={styles.heroContent}>
        {/* Tagline pill */}
        <div className={`${styles.taglineWrapper} ${isLoaded ? styles.visible : ''}`}>
          <span className={styles.taglineBadge}>{HERO_CONTENT.tagline}</span>
        </div>

        {/* Huge Name Split into Per-Letter Spans Rotating up in 3D */}
        <h1 className={styles.titleWrapper} aria-label={`${HERO_CONTENT.line1} ${HERO_CONTENT.line2}`}>
          {/* First name */}
          <div className={styles.lineMask} aria-hidden="true">
            {letters1.map((char, index) => {
              const delay = index * 0.045 + 0.1
              return (
                <span
                  key={`line1-${index}`}
                  className={`${styles.char3D} ${isLoaded ? styles.charIn : ''}`}
                  style={{
                    transitionDelay: `${delay}s`,
                  }}
                >
                  {char}
                </span>
              )
            })}
          </div>

          {/* Surname */}
          <div className={`${styles.lineMask} ${styles.lineIndented}`} aria-hidden="true">
            {letters2.map((char, index) => {
              const delay = (letters1.length + index) * 0.045 + 0.1
              return (
                <span
                  key={`line2-${index}`}
                  className={`${styles.char3D} ${isLoaded ? styles.charIn : ''}`}
                  style={{
                    transitionDelay: `${delay}s`,
                  }}
                >
                  {char}
                </span>
              )
            })}
          </div>
        </h1>

        {/* One-Line Intro */}
        <p className={`${styles.introLead} ${isLoaded ? styles.visible : ''}`}>
          {HERO_CONTENT.lead}
        </p>

        {/* Primary and Secondary Magnetic Buttons */}
        <div className={`${styles.buttonGroup} ${isLoaded ? styles.visible : ''}`}>
          <MagneticButton
            href={HERO_CONTENT.primaryCta.href}
            variant="primary"
            strength={0.3}
          >
            {HERO_CONTENT.primaryCta.label}
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <line x1="7" y1="17" x2="17" y2="7" />
              <polyline points="7 7 17 7 17 17" />
            </svg>
          </MagneticButton>

          <MagneticButton
            href={HERO_CONTENT.secondaryCta.href}
            variant="secondary"
            strength={0.3}
          >
            {HERO_CONTENT.secondaryCta.label}
          </MagneticButton>
        </div>
      </div>

      {/* Scroll Cue with Animated Line */}
      <a
        href="#work"
        className={`${styles.scrollCue} ${isLoaded ? styles.visible : ''}`}
        aria-label={HERO_CONTENT.scrollCue}
      >
        <span className={styles.scrollText}>{HERO_CONTENT.scrollCue}</span>
        <div className={styles.scrollIndicator}>
          <div className={styles.scrollDot} />
        </div>
      </a>
    </section>
  )
}
