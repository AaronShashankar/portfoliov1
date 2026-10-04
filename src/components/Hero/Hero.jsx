import React from 'react'
import { PERSONA, EMPLOYER } from '../../data/content'
import portrait from '../../myImage-removebg-preview.png'
import Icon from '../UI/Icon'
import Tilt from '../UI/Tilt'
import styles from './Hero.module.css'

export default function Hero() {
  return <section id="hero" className={styles.hero} tabIndex={-1} aria-labelledby="hero-title">
    <div className={styles.heroGrid}>
      <div className={styles.copy}>
        <p className={styles.eyebrow}><span className="status-dot" />{PERSONA.name}</p>
        <h1 id="hero-title"><span className={styles.line}><span>CODE.</span></span><span className={styles.line}><span className={styles.outline}>CREATE.</span></span><span className={styles.line}><span className={styles.gradient}>CONNECT.</span></span></h1>
        <p className={styles.intro}>Software developer. Curious mind.<br />Building web applications, APIs, and what comes next.</p>
        <div className={styles.actions}><a href="#skills" className="button button-primary">Explore my world <Icon /></a><a href={PERSONA.github} target="_blank" rel="noopener noreferrer" className="button button-secondary"><Icon name="github" /> GitHub</a></div>
        <div className={styles.meta}><span><Icon name="pin" size={14} />{PERSONA.location}</span><span>BCA STUDENT · 2023 — NOW</span></div>
      </div>
      <div id="scene-anchor" className={styles.visualStage}>
        <div className={styles.floatingTag}><span className={styles.tagDot} /><span>Ideas into<br /><strong>real experiences.</strong></span></div>
        <span className={styles.coordinate} aria-hidden="true">LALITPUR / NEPAL<br />CREATING WHAT’S NEXT</span>
        <div className={styles.portraitFloat}><Tilt className={styles.portraitCard}><div className={styles.portraitCrop}><img src={portrait} alt="Aaron Shasankar Bishwakarma" width="433" height="577" fetchpriority="high" decoding="async" /></div><div className={styles.photoCaption}><span>THE HUMAN BEHIND IT</span><strong>Hey, I’m Aaron <span aria-hidden="true">↗</span></strong></div></Tilt></div>
        <a className={styles.currentWork} href={EMPLOYER.url} target="_blank" rel="noopener noreferrer"><span className="status-dot" /><span>Currently at<strong>{EMPLOYER.name} <Icon size={14} /></strong></span></a>
      </div>
    </div>
    <div className={styles.heroFooter}><a href="#about"><span className={styles.scrollIcon} aria-hidden="true">↓</span>SCROLL TO DISCOVER</a><span>DEVELOPMENT · DESIGN · CURIOSITY</span><span className={styles.edition}>PORTFOLIO / {PERSONA.copyrightYear}</span></div>
  </section>
}
