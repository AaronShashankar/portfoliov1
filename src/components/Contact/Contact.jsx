import React, { useEffect, useState } from 'react'
import { CONTACT_CONTENT, PERSONA } from '../../data/content'
import styles from './Contact.module.css'

function LocalClock() {
  const [clock, setClock] = useState({ time: '--:--:--', zone: '' })
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: CONTACT_CONTENT.officeTimezone, hour: '2-digit', minute: '2-digit',
      second: '2-digit', hour12: false, timeZoneName: 'shortOffset',
    })
    const update = () => {
      const parts = formatter.formatToParts(new Date())
      setClock({ time: parts.filter(p => p.type !== 'timeZoneName').map(p => p.value).join('').trim(),
        zone: parts.find(p => p.type === 'timeZoneName')?.value || '' })
    }
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [])
  return <div className={styles.clockContainer} role="timer" aria-label={`Local time in ${CONTACT_CONTENT.locationName}`}>
    <span className={styles.clockDot} aria-hidden="true" /><span className={styles.clockCity}>{CONTACT_CONTENT.locationName}</span>
    <span className={styles.clockTime}>{clock.time}</span><span className={styles.clockZone}>{clock.zone}</span>
  </div>
}

export default function Contact() {
  return <footer id="contact" tabIndex={-1} className={styles.contactSection} aria-label="Contact information">
    <div className={styles.container}>
      <div className={styles.header}><span className={styles.badge}>Get in touch</span></div>
      <h2 className={styles.headline}>{CONTACT_CONTENT.headline}</h2>
      <p className={styles.subhead}>{CONTACT_CONTENT.subhead}</p>
      <div className={styles.emailArea}><a href={`mailto:${CONTACT_CONTENT.email}`} className={styles.magneticEmail}>
        <span className={styles.emailAddress}>{CONTACT_CONTENT.email}</span><span className={styles.emailArrow} aria-hidden="true">↗</span>
      </a></div>
      <div className={styles.bottomBar}>
        <LocalClock />
        {CONTACT_CONTENT.socials.length > 0 && <div className={styles.socialsWrapper}>
          {CONTACT_CONTENT.socials.map(social => <a key={social.name} href={social.href} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>{social.name} <span aria-hidden="true">↗</span></a>)}
        </div>}
        <div className={styles.copyright}>© {PERSONA.copyrightYear} {PERSONA.name}. All rights reserved.</div>
      </div>
    </div>
  </footer>
}
