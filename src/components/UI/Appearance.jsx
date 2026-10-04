import React, { createContext, useContext, useEffect, useState } from 'react'
import { readPreference, savePreference } from '../../lib/preferences'

const AppearanceContext = createContext({ theme: 'dark', motionEnabled: true, reducedMotion: false, toggleTheme() {}, toggleMotion() {} })

export function AppearanceProvider({ children }) {
  const [theme, setTheme] = useState(() => readPreference('aaron-theme', ['dark', 'light'], 'dark'))
  const [paused, setPaused] = useState(() => readPreference('aaron-motion', ['on', 'off'], 'on') === 'off')
  const [reducedMotion, setReducedMotion] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const motionEnabled = !paused && !reducedMotion

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)')
    const change = () => setReducedMotion(query.matches)
    query.addEventListener('change', change)
    return () => query.removeEventListener('change', change)
  }, [])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    document.documentElement.style.colorScheme = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'dark' ? '#080D17' : '#F0F4FC')
    savePreference('aaron-theme', theme)
  }, [theme])
  useEffect(() => {
    document.documentElement.dataset.motion = motionEnabled ? 'on' : 'off'
    savePreference('aaron-motion', paused ? 'off' : 'on')
  }, [motionEnabled, paused])

  return <AppearanceContext.Provider value={{ theme, motionEnabled, reducedMotion,
    toggleTheme: () => setTheme(value => value === 'dark' ? 'light' : 'dark'),
    toggleMotion: () => setPaused(value => !value),
  }}>{children}</AppearanceContext.Provider>
}
export const useAppearance = () => useContext(AppearanceContext)
