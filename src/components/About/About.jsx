import React from 'react'
import { ABOUT_CONTENT, PERSONA, EDUCATION, EMPLOYER } from '../../data/content'
import Icon from '../UI/Icon'
import styles from './About.module.css'
export default function About() {
  return <section id="about" tabIndex={-1} className="container section" aria-label={`About ${PERSONA.name}`}>
    <div className={styles.aboutGrid}>
      <div><p className="section-label">01 / A LITTLE ABOUT ME</p><h2 className="section-heading">Always curious.<br /><span>Always building.</span></h2></div>
      <div><p className={styles.statement}>{ABOUT_CONTENT.statement}</p><p className={styles.bio}>{ABOUT_CONTENT.extendedBio}</p><a href="#work" className="text-link">Follow my journey <Icon size={17} /></a></div>
    </div>
    <div className={styles.facts}>
      <div className={styles.fact}><Icon name="pin" /><div><span>Based in</span><strong>{PERSONA.location}</strong></div></div>
      <div className={styles.fact}><Icon name="book" /><div><span>Education · {EDUCATION.period}</span><strong>{EDUCATION.degree}</strong></div></div>
      <div className={styles.fact}><Icon name="code" /><div><span>Currently working at</span><a href={EMPLOYER.url} target="_blank" rel="noopener noreferrer">{EMPLOYER.name} <Icon size={14} /></a></div></div>
    </div>
  </section>
}
