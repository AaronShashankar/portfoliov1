import React, { useEffect, useRef, useState } from 'react'
import { PERSONA, NAVIGATION_LINKS } from '../../data/content'
import styles from './Nav.module.css'

export default function Nav({ scrollProgress = 0 }) {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(() => window.matchMedia('(max-width: 1100px)').matches)
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  useEffect(() => {
    const query = window.matchMedia('(max-width: 1100px)')
    const resize = () => { setMobile(query.matches); setOpen(false) }
    query.addEventListener('change', resize)
    return () => query.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    if (!open) return
    const dismiss = e => {
      if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() }
    }
    const outside = e => {
      if (!navRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setOpen(false)
    }
    document.addEventListener('keydown', dismiss)
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', outside) }
  }, [open])
  const navigate = href => {
    setOpen(false)
    // Let the native anchor update the fragment; move keyboard focus to its destination.
    requestAnimationFrame(() => document.querySelector(href)?.focus({ preventScroll: true }))
  }
  return <>
    <div className={styles.progressBar} style={{ transform: `scaleX(${scrollProgress})` }} role="progressbar" aria-valuenow={Math.round(scrollProgress * 100)} aria-valuemin={0} aria-valuemax={100} aria-label="Page scroll progress" />
    <header className={`${styles.navContainer} ${styles.loaded}`}>
      <div className={styles.navInner}>
        <a href="#hero" className={styles.brand} onClick={() => navigate('#hero')} aria-label={`${PERSONA.name} — Back to top`}>
          <span className={styles.brandName}>{PERSONA.name}</span><span className={styles.brandRole}>{PERSONA.role}</span>
        </a>
        <div className={styles.statusPill}><span className={styles.pulseDot} aria-hidden="true" /><span>{PERSONA.availability}</span></div>
        <nav id="main-navigation" ref={navRef} hidden={mobile && !open} className={`${styles.navLinks} ${open ? styles.mobileOpen : ''}`} aria-label="Main navigation">
          {NAVIGATION_LINKS.map(link => <a key={link.label} href={link.href} className={styles.navLink} onClick={() => navigate(link.href)}>{link.label}</a>)}
        </nav>
        <button ref={toggleRef} className={styles.menuToggle} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}>
          <span className={`${styles.menuLine} ${open ? styles.lineOpen1 : ''}`} /><span className={`${styles.menuLine} ${open ? styles.lineOpen2 : ''}`} />
        </button>
      </div>
    </header>
  </>
}
