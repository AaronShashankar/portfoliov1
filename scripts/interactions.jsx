import React from 'react'
import { act, create } from 'react-test-renderer'
import assert from 'node:assert/strict'
import { AppearanceProvider } from '../src/components/UI/Appearance'
import Nav from '../src/components/Nav/Nav'
import Skills from '../src/components/Skills/Skills'
import { readPreference, savePreference } from '../src/lib/preferences'

const storage = new Map()
const events = new Map()
const media = new Map()
let focusCount = 0
globalThis.window = {
  innerHeight: 900,
  localStorage: { getItem: key => storage.get(key) ?? null, setItem: (key, value) => storage.set(key, value) },
  matchMedia(query) {
    if (!media.has(query)) media.set(query, {
      matches: query === '(max-width: 800px)', listeners: new Set(),
      addEventListener(type, listener) { this.listeners.add(listener) },
      removeEventListener(type, listener) { this.listeners.delete(listener) },
    })
    return media.get(query)
  },
}
globalThis.document = {
  documentElement: { dataset: {}, style: {} },
  querySelector: () => null, querySelectorAll: () => [],
  addEventListener(type, listener) { if (!events.has(type)) events.set(type, new Set()); events.get(type).add(listener) },
  removeEventListener(type, listener) { events.get(type)?.delete(listener) },
}
globalThis.IntersectionObserver = class { observe() {} disconnect() {} }
window.IntersectionObserver = globalThis.IntersectionObserver
const createNodeMock = () => ({
  dataset: {}, style: { setProperty() {} },
  getBoundingClientRect: () => ({ top: 0, left: 0, width: 300, height: 250 }),
  focus() { focusCount++ }, contains() { return false },
})
let view
const mount = () => act(() => { view = create(<AppearanceProvider><Nav /><Skills /></AppearanceProvider>, { createNodeMock }) })
const button = label => view.root.findByProps({ 'aria-label': label })
mount()
assert.equal(document.documentElement.dataset.theme, 'dark')
act(() => button('Switch to light mode').props.onClick())
assert.equal(document.documentElement.dataset.theme, 'light')
assert.equal(storage.get('aaron-theme'), 'light')
act(() => button('Pause animations').props.onClick())
assert.equal(document.documentElement.dataset.motion, 'off')
assert.equal(storage.get('aaron-motion'), 'off')
act(() => view.unmount())
mount()
assert.equal(document.documentElement.dataset.theme, 'light', 'Theme must survive a remount')
assert.equal(document.documentElement.dataset.motion, 'off', 'Motion choice must survive a remount')
act(() => button('Resume animations').props.onClick())
assert.equal(document.documentElement.dataset.motion, 'on')
assert.equal(view.root.findByType('nav').props.hidden, true)
act(() => button('Open navigation menu').props.onClick())
assert.equal(view.root.findByType('nav').props.hidden, false)
act(() => events.get('keydown').forEach(listener => listener({ key: 'Escape' })))
assert.equal(view.root.findByType('nav').props.hidden, true)
assert.equal(focusCount, 1, 'Escape returns focus to the menu toggle')
const frontend = view.root.findAllByType('button').find(item => item.children.includes('Frontend'))
act(() => frontend.props.onClick())
assert.equal(view.root.findAllByType('li').length, 8)
assert.equal(frontend.props['aria-pressed'], true)
const all = view.root.findAllByType('button').find(item => item.children.includes('All skills'))
act(() => all.props.onClick())
assert.equal(view.root.findAllByType('li').length, 31)
const reduced = media.get('(prefers-reduced-motion: reduce)')
act(() => { reduced.matches = true; reduced.listeners.forEach(listener => listener()) })
assert.equal(document.documentElement.dataset.motion, 'off')
assert.equal(button('Resume animations').props.disabled, true)
act(() => { reduced.matches = false; reduced.listeners.forEach(listener => listener()) })
assert.equal(document.documentElement.dataset.motion, 'on')
act(() => button('Switch to dark mode').props.onClick())
assert.equal(document.documentElement.dataset.theme, 'dark')
act(() => view.unmount())
assert.ok([...events.values()].every(listeners => listeners.size === 0), 'Document listeners are cleaned up')
assert.ok([...media.values()].every(query => query.listeners.size === 0), 'Media listeners are cleaned up')
storage.set('aaron-theme', 'invalid-theme')
assert.equal(readPreference('aaron-theme', ['dark', 'light'], 'dark'), 'dark')
window.localStorage = { getItem() { throw new Error('Storage blocked') }, setItem() { throw new Error('Storage blocked') } }
assert.equal(readPreference('aaron-theme', ['dark', 'light'], 'dark'), 'dark')
assert.doesNotThrow(() => savePreference('aaron-theme', 'light'))
console.log('PASS: theme toggle/persistence, pause/resume, reduced motion, mobile Escape/focus, skill filtering, storage failure, and effect cleanup.')
