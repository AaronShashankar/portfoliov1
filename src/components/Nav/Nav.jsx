import React, { useEffect, useRef, useState } from 'react'
import { PERSONA, NAVIGATION_LINKS } from '../../data/content'
import Icon from '../UI/Icon'
import { useAppearance } from '../UI/Appearance'
import styles from './Nav.module.css'
const MOBILE_QUERY = '(max-width: 800px)'
export default function Nav() {
  const { theme, toggleTheme, motionEnabled, toggleMotion, reducedMotion } = useAppearance()
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches)
  const [active, setActive] = useState('')
  const toggleRef = useRef(null)
  const navRef = useRef(null)
  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY)
    const resize = () => { setMobile(query.matches); setOpen(false) }
    query.addEventListener('change', resize)
    return () => query.removeEventListener('change', resize)
  }, [])
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) if (entry.isIntersecting) setActive('#' + entry.target.id)
    }, { rootMargin: '-15% 0px -55% 0px' })
    const sections = document.querySelectorAll('section[id], footer[id]')
    sections.forEach(section => observer.observe(section))
    return () => observer.disconnect()
  }, [])
  useEffect(() => {
    if (!open) return
    const dismiss = e => { if (e.key === 'Escape') { setOpen(false); toggleRef.current?.focus() } }
    const outside = e => { if (!navRef.current?.contains(e.target) && !toggleRef.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('keydown', dismiss)
    document.addEventListener('pointerdown', outside)
    return () => { document.removeEventListener('keydown', dismiss); document.removeEventListener('pointerdown', outside) }
  }, [open])
  const navigate = (event, href) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    setOpen(false)
    requestAnimationFrame(() => document.querySelector(href)?.focus({ preventScroll: true }))
  }
  return <header className={styles.navContainer}>
    <div className={styles.navInner}>
      <a href="#hero" onClick={event => navigate(event, '#hero')} className={styles.brand} aria-label={`${PERSONA.name} — Back to top`}>aaron<span>.</span></a>
      <nav id="main-navigation" ref={navRef} hidden={mobile && !open} className={styles.navLinks} aria-label="Main navigation">
        {NAVIGATION_LINKS.map(link => <a key={link.label} href={link.href} aria-current={active === link.href ? 'location' : undefined} onClick={event => navigate(event, link.href)}>{link.label}</a>)}
      </nav>
      <div className={styles.controls}>
        <a className={styles.navContact} href={`mailto:${PERSONA.email}`}>Let’s connect <Icon size={16} /></a>
        <button type="button" className={styles.iconButton} onClick={toggleTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}><Icon key={theme} name={theme === 'dark' ? 'sun' : 'moon'} size={19} /></button>
        <button type="button" className={styles.iconButton} onClick={toggleMotion} disabled={reducedMotion} aria-label={motionEnabled ? 'Pause animations' : 'Resume animations'} title={reducedMotion ? 'Reduced motion is enabled in your system settings' : motionEnabled ? 'Pause animations' : 'Resume animations'}><Icon name={motionEnabled ? 'pause' : 'play'} size={17} /></button>
      </div>
      <button ref={toggleRef} type="button" className={styles.menuToggle} onClick={() => setOpen(value => !value)} aria-expanded={open} aria-controls="main-navigation" aria-label={open ? 'Close navigation menu' : 'Open navigation menu'}><span>{open ? 'Close' : 'Menu'}</span><span className={`${styles.menuIcon} ${open ? styles.menuOpen : ''}`} aria-hidden="true"><i /><i /></span></button>
    </div>
  </header>
}
