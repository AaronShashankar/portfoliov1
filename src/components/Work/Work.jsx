import React, { useRef, useState, useCallback } from 'react'
import { useReducedMotion } from '../../hooks/useReducedMotion'
import { WORK_PROJECTS } from '../../data/content'
import styles from './Work.module.css'

/**
 * Individual Card with 3D Tilt, Glare and Parallax Artwork
 */
function WorkCard({ project, index }) {
  const cardRef = useRef(null)
  const reducedMotion = useReducedMotion()
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, glareY: 50, isHovered: false })

  const handleMouseMove = useCallback((e) => {
    if (!cardRef.current || reducedMotion || window.matchMedia('(pointer: coarse)').matches) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    // Max 7 degrees tilt
    const maxAngle = 7
    const rotX = -((y - centerY) / centerY) * maxAngle
    const rotY = ((x - centerX) / centerX) * maxAngle

    const glareX = (x / rect.width) * 100
    const glareY = (y / rect.height) * 100

    setTilt({
      rotateX: rotX,
      rotateY: rotY,
      glareX,
      glareY,
      isHovered: true,
    })
  }, [reducedMotion])

  const handleMouseLeave = useCallback(() => {
    setTilt((prev) => ({
      ...prev,
      rotateX: 0,
      rotateY: 0,
      isHovered: false,
    }))
  }, [])

  // Render specific animated artwork per project
  const renderArtwork = () => {
    switch (project.artworkType) {
      case 'rings':
        // Tidepool: Pulsing concentric wave rings
        return (
          <div className={styles.artworkRings}>
            <div className={`${styles.concentricRing} ${styles.ring1}`} />
            <div className={`${styles.concentricRing} ${styles.ring2}`} />
            <div className={`${styles.concentricRing} ${styles.ring3}`} />
            <div className={`${styles.concentricRing} ${styles.ring4}`} />
            <div className={styles.ringCenterDot} />
          </div>
        )
      case 'equalizer':
        // Halcyon: Animated audio-bar equalizer
        return (
          <div className={styles.artworkEqualizer}>
            {Array.from({ length: 14 }).map((_, i) => (
              <div
                key={i}
                className={styles.eqBar}
                style={{
                  animationDelay: `${(i * 0.08) % 0.8}s`,
                  animationDuration: `${0.9 + (i % 5) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )
      case 'orbit':
        // Orbit Atlas: 3D orbiting rings with glowing core
        return (
          <div className={styles.artworkOrbit}>
            <div className={styles.orbitRingA}>
              <div className={styles.satelliteA} />
            </div>
            <div className={styles.orbitRingB}>
              <div className={styles.satelliteB} />
            </div>
            <div className={styles.orbitRingC} />
            <div className={styles.orbitCore} />
          </div>
        )
      case 'sheets':
        // Fieldnotes: Floating stacked 3D sheets
        return (
          <div className={styles.artworkSheets}>
            <div className={`${styles.sheetLayer} ${styles.sheetLayer1}`}>
              <div className={styles.sheetLine} />
              <div className={styles.sheetLineHalf} />
            </div>
            <div className={`${styles.sheetLayer} ${styles.sheetLayer2}`}>
              <div className={styles.sheetLine} />
              <div className={styles.sheetLineHalf} />
            </div>
            <div className={`${styles.sheetLayer} ${styles.sheetLayer3}`}>
              <div className={styles.sheetHeader} />
              <div className={styles.sheetLine} />
              <div className={styles.sheetLine} />
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <article
      ref={cardRef}
      className={styles.cardContainer}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        '--project-accent': project.accentColor,
        transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
        transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s ease-out',
      }}
    >
      {/* Glare Overlay */}
      <div
        className={styles.glareOverlay}
        style={{
          background: `radial-gradient(circle 320px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.18), transparent 70%)`,
          opacity: tilt.isHovered ? 1 : 0,
        }}
      />

      {/* Card Header & Metrics */}
      <div className={styles.cardHeader}>
        <div className={styles.cardMeta}>
          <span className={styles.cardIndex}>0{index + 1}</span>
          <span className={styles.cardYear}>{project.year}</span>
        </div>
        <span className={styles.cardBadge}>{project.metrics}</span>
      </div>

      {/* Interactive Parallax Artwork Stage */}
      <div
        className={styles.artworkStage}
        style={{
          transform: `translate3d(${tilt.rotateY * 1.5}px, ${-tilt.rotateX * 1.5}px, 20px)`,
          transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
        }}
      >
        {renderArtwork()}
      </div>

      {/* Card Content & Tags */}
      <div className={styles.cardContent}>
        <h3 className={styles.cardTitle}>{project.title}</h3>
        <p className={styles.cardSubtitle}>{project.subtitle}</p>
        <p className={styles.cardDescription}>{project.description}</p>
        {project.url ? <a className={styles.projectLink} href={project.url} target="_blank" rel="noopener noreferrer">{project.linkText} <span aria-hidden="true">↗</span></a>
          : <p className={styles.projectStatus}>Demo link not available yet</p>}

        <div className={styles.tagList}>
          {project.tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

export default function Work() {
  return <section id="work" tabIndex={-1} className={styles.pinContainer} aria-labelledby="work-title">
    <div className={styles.introPanel}>
      <span className={styles.introBadge}>Selected work</span>
      <h2 id="work-title" className={styles.introTitle}>Real-time craft,<br />spatial systems.</h2>
      <p className={styles.introDescription}>A selection of interactive interfaces and creative development projects.</p>
    </div>
    <div className={styles.projectGrid}>{WORK_PROJECTS.map((project, index) => <WorkCard key={project.id} project={project} index={index} />)}</div>
  </section>
}
