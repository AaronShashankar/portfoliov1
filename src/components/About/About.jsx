import React from 'react'
import { ABOUT_CONTENT, PERSONA } from '../../data/content'
import styles from './About.module.css'

export default function About() {
  return <section id="about" tabIndex={-1} className={styles.aboutSection} aria-label={`About ${PERSONA.name}`}>
    <div className={styles.container}>
      <div className={styles.header}><span className={styles.badge}>{ABOUT_CONTENT.sectionTag}</span></div>
      <div className={styles.statementWrapper}><p className={styles.statementText}>{ABOUT_CONTENT.statement}</p></div>
      <div className={styles.bioWrapper}><p className={styles.bioText}>{ABOUT_CONTENT.extendedBio}</p></div>
      <div className={styles.statsGrid}>
        {ABOUT_CONTENT.stats.map(stat => <div key={stat.label} className={styles.statCard}>
          <div className={styles.statNumberWrapper}><span className={styles.statNumber}>{stat.value}{stat.suffix}</span><span className={styles.statUnit}>{stat.unit}</span></div>
          <div className={styles.statLabel}>{stat.label}</div><div className={styles.statSublabel}>{stat.sublabel}</div>
        </div>)}
      </div>
    </div>
  </section>
}
