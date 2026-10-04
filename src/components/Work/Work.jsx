import React from 'react'
import { PERSONA, EMPLOYER, EDUCATION } from '../../data/content'
import Icon from '../UI/Icon'
import Tilt from '../UI/Tilt'
import styles from './Work.module.css'
export default function Work() {
  return <section id="work" tabIndex={-1} className="container section" aria-labelledby="work-title">
    <div className={styles.heading}><div><p className="section-label">03 / THE JOURNEY SO FAR</p><h2 id="work-title" className="section-heading">Learning by doing.</h2></div><p>Studying the foundations.<br />Putting them into practice.</p></div>
    <div className={styles.journeyGrid}>
      <Tilt as="article" className={styles.workCard}><div className={styles.cardTop}><span className={styles.label}>WORK</span><span className={styles.current}><span className="status-dot" />Current</span></div><Icon name="code" size={30} /><h3>{EMPLOYER.name}</h3><p>I’m currently working at Top Tech Giants, alongside my BCA studies.</p><a className="text-link" href={EMPLOYER.url} target="_blank" rel="noopener noreferrer">Visit the company <Icon size={17} /></a></Tilt>
      <Tilt as="article" className={styles.workCard}><div className={styles.cardTop}><span className={styles.label}>EDUCATION</span><span className={styles.period}>{EDUCATION.period}</span></div><Icon name="book" size={30} /><h3>Bachelor of Computer Application</h3><p>Currently pursuing my BCA, building a foundation in computer applications and software development.</p><span className={styles.studyTag}>BCA · In progress</span></Tilt>
    </div>
    <a className={styles.githubBand} href={PERSONA.github} target="_blank" rel="noopener noreferrer"><span className={styles.githubIcon}><Icon name="github" size={26} /></span><span><strong>See what I’m building.</strong><span>Explore my repositories and follow my work on GitHub.</span></span><Icon name="arrow" size={24} /></a>
  </section>
}
