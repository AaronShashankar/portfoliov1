import React, { useState } from 'react'
import { SKILL_GROUPS, SKILLS_LIST } from '../../data/content'
import Icon from '../UI/Icon'
import Reveal from '../UI/Reveal'
import Tilt from '../UI/Tilt'
import styles from './Skills.module.css'
export default function Skills() {
  const [filter, setFilter] = useState('all')
  const groups = filter === 'all' ? SKILL_GROUPS : SKILL_GROUPS.filter(group => group.id === filter)
  const count = groups.reduce((total, group) => total + group.items.length, 0)
  return <section id="skills" tabIndex={-1} className={styles.skillsSection} aria-labelledby="skills-title">
    <div className="container section">
      <div className={styles.header}><div><p className="section-label">02 / MY TOOLKIT</p><h2 id="skills-title" className="section-heading">The right tools.<br /><span>A growing skill set.</span></h2></div><p className={styles.intro}>From interfaces to infrastructure, here’s the technology I work with — and what I’m learning next.</p></div>
      <div className={styles.filters} role="group" aria-label="Filter skills by category">
        {[{ id: 'all', title: 'All skills' }, ...SKILL_GROUPS].map(group => <button key={group.id} type="button" aria-pressed={filter === group.id} onClick={() => setFilter(group.id)} className={filter === group.id ? styles.selected : ''}>{group.title}{group.id === 'all' && <span>{SKILLS_LIST.length}</span>}</button>)}
      </div>
      <p className={styles.resultCount} role="status">Showing {count} skills across {groups.length} {groups.length === 1 ? 'category' : 'categories'}</p>
      <div className={styles.skillGrid}>
        {groups.map((group, index) => <Reveal key={`${filter}-${group.id}`} delay={(index % 3) * 90}><Tilt as="article" className={styles.skillCard}>
          <div className={styles.cardHeading}><span className={styles.icon}><Icon name={group.icon} /></span><span className={styles.count}>{String(group.items.length).padStart(2, '0')} SKILLS</span></div>
          <h3>{group.title}</h3><p>{group.description}</p>
          <ul className={styles.tags}>{group.items.map(skill => <li key={skill}>{skill}</li>)}</ul>
        </Tilt></Reveal>)}
      </div>
    </div>
  </section>
}
