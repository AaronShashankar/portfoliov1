import React, { useEffect, useState } from 'react'
import { CONTACT_CONTENT, PERSONA } from '../../data/content'
import Icon from '../UI/Icon'
import styles from './Contact.module.css'
function LocalClock() {
  const [time, setTime] = useState('--:--')
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', { timeZone: CONTACT_CONTENT.officeTimezone, hour: '2-digit', minute: '2-digit', hour12: false, timeZoneName: 'shortOffset' })
    const update = () => setTime(formatter.format(new Date()))
    update()
    const timer = setInterval(update, 30000)
    return () => clearInterval(timer)
  }, [])
  return <span className={styles.clock} role="timer" aria-label={`Local time in ${PERSONA.location}`}>{time} in Nepal</span>
}
export default function Contact() {
  const [copyStatus, setCopyStatus] = useState('')
  useEffect(() => {
    if (!copyStatus) return
    const timer = setTimeout(() => setCopyStatus(''), 4000)
    return () => clearTimeout(timer)
  }, [copyStatus])
  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(CONTACT_CONTENT.email); setCopyStatus('Email copied to clipboard.') }
    catch { setCopyStatus('Select the email address to copy it, or use the email link.') }
  }
  return <footer id="contact" tabIndex={-1} className={styles.contact} aria-labelledby="contact-title">
    <div className="container">
      <div className={styles.contactGrid}>
        <div><p className="section-label">04 / LET’S CONNECT</p><h2 id="contact-title">Let’s build<br />something useful<span>.</span></h2><p className={styles.subhead}>{CONTACT_CONTENT.subhead}</p></div>
        <div className={styles.contactDetails}>
          <span className={styles.detailLabel}>DROP ME A LINE</span>
          <a className={styles.email} href={`mailto:${CONTACT_CONTENT.email}`}>{CONTACT_CONTENT.email} <Icon size={22} /></a>
          <button className={styles.copyButton} type="button" onClick={copyEmail}><Icon name={copyStatus === 'Email copied to clipboard.' ? 'check' : 'copy'} size={15} />{copyStatus === 'Email copied to clipboard.' ? 'Copied!' : 'Copy email address'}</button>
          <p className={styles.copyStatus} role="status">{copyStatus}</p>
          <a className={styles.github} href={PERSONA.github} target="_blank" rel="noopener noreferrer"><Icon name="github" /> Find me on GitHub <Icon size={16} /></a>
        </div>
      </div>
      <div className={styles.bottomBar}><span>© {PERSONA.copyrightYear} {PERSONA.name}</span><span className={styles.location}><Icon name="pin" size={14} />{PERSONA.location}<span aria-hidden="true">·</span><LocalClock /></span><a href="#hero">Back to top <span aria-hidden="true">↑</span></a></div>
    </div>
  </footer>
}
