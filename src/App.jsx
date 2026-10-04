import React, { lazy, Suspense, useEffect, useState } from 'react'
import SceneFallback from './components/Scene/SceneFallback'
import SceneBoundary from './components/Scene/SceneBoundary'
import { useReducedMotion } from './hooks/useReducedMotion'
const Scene = lazy(() => import('./components/Scene/Scene'))
import Cursor from './components/Cursor/Cursor'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import Marquee from './components/Marquee/Marquee'
import Work from './components/Work/Work'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Contact from './components/Contact/Contact'

import { useMouse } from './hooks/useMouse'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import styles from './App.module.css'

export default function App() {
  const reducedMotion = useReducedMotion()
  const [sceneReady, setSceneReady] = useState(false)
  useEffect(() => {
    if (reducedMotion) return
    // Let the text and navigation paint before requesting the optional GPU scene.
    const timer = setTimeout(() => setSceneReady(true), 800)
    return () => clearTimeout(timer)
  }, [reducedMotion])
  const mouseRef = useMouse()
  const { scrollRef, scrollProgress } = useSmoothScroll()

  return (
    <div className={styles.appRoot}>
      {/* 1. Global 3D Background Canvas (z-index 0) */}
      <SceneBoundary><Suspense fallback={<SceneFallback />} >
        {sceneReady && !reducedMotion ? <Scene mouseRef={mouseRef} scrollRef={scrollRef} /> : <SceneFallback />}
      </Suspense></SceneBoundary>
      <a className="skip-link" href="#app-content">Skip to content</a>

      {/* 2. Desktop Custom Cursor Follower */}
      <Cursor />

      {/* 3. Top Navigation & Global Scroll Progress */}
      <Nav scrollProgress={scrollProgress} />

      {/* 4. Main Scrollable Content */}
      <main id="app-content" tabIndex={-1} className={styles.mainContent}>
        {/* Hero Section */}
        <Hero />

        {/* Decorative marquee */}
        <Marquee />

        {/* Responsive project grid */}
        <Work />

        {/* Readable biography */}
        <About />

        {/* Persistent skills list */}
        <Skills />

        {/* Contact and local clock */}
        <Contact />
      </main>
    </div>
  )
}
