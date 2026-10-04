import React from 'react'
import { SKILLS_LIST } from '../../data/content'
import styles from './Skills.module.css'

export default function Skills() {
  return <section id="skills" tabIndex={-1} className={styles.skillsSection} aria-labelledby="skills-title">
    <div className={styles.header}>
      <span className={styles.badge}>Capabilities / Stack</span>
      <h2 id="skills-title" className={styles.title}>Technological Palette</h2>
      <p className={styles.subtitle}>Tools and techniques I use to build thoughtful digital experiences.</p>
    </div>
    <ul className={styles.skillGrid}>
      {SKILLS_LIST.map((skill, index) => <li key={skill} className={styles.skillCard}>
        <span className={styles.pillIndex} aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
        <span className={styles.pillText}>{skill}</span>
      </li>)}
    </ul>
  </section>
}
