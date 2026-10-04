import React from 'react'
import { AppearanceProvider } from './components/UI/Appearance'
import Reveal from './components/UI/Reveal'
import Scene from './components/Scene/Scene'
import Nav from './components/Nav/Nav'
import Hero from './components/Hero/Hero'
import About from './components/About/About'
import Skills from './components/Skills/Skills'
import Work from './components/Work/Work'
import Contact from './components/Contact/Contact'

function TechRibbon() {
  const words = ['React', 'Python', 'Django', 'JavaScript', 'Full stack', 'Always learning']
  return <div className="tech-ribbon" aria-hidden="true"><div className="ribbon-track">{[0, 1].map(copy => <div className="ribbon-group" key={copy}>{words.map(word => <span key={word}>{word}<b>✳</b></span>)}</div>)}</div></div>
}
export default function App() {
  return <AppearanceProvider>
    <Scene />
    <a className="skip-link" href="#app-content">Skip to content</a>
    <Nav />
    <main id="app-content" tabIndex={-1}>
      <Hero /><TechRibbon />
      <Reveal><About /></Reveal>
      <Reveal><Skills /></Reveal>
      <Reveal><Work /></Reveal>
    </main>
    <Reveal><Contact /></Reveal>
  </AppearanceProvider>
}
