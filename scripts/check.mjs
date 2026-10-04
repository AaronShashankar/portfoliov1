import { build } from 'esbuild'
import { mkdir, rm, rmdir, readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const directory = path.resolve('.checks')
await mkdir(directory, { recursive: true })
const output = path.join(directory, 'render-check.mjs')
const interactions = path.join(directory, 'interaction-check.mjs')
try {
  const css = await readFile('src/index.css', 'utf8')
  const luminance = hex => {
    const values = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722
  }
  const themeBoundary = css.indexOf(':root[data-theme="light"]')
  const themeBlocks = [css.slice(0, themeBoundary), css.slice(themeBoundary, css.indexOf('/* Reset'))]
  for (const [index, block] of themeBlocks.entries()) {
    const tokens = Object.fromEntries([...block.matchAll(/--(bg|bg2|ink|muted|accent|on-accent): (#[0-9A-Fa-f]{6})/g)].map(match => [match[1], match[2]]))
    for (const name of ['ink', 'muted', 'accent']) {
      for (const surface of ['bg', 'bg2']) {
        const a = luminance(tokens[name]), b = luminance(tokens[surface])
        const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
        assert.ok(ratio >= 4.5, `Theme ${index}: ${name} on ${surface} contrast ${ratio.toFixed(2)} is below 4.5`)
      }
    }
    const a = luminance(tokens['on-accent']), b = luminance(tokens.accent)
    assert.ok((Math.max(a, b) + .05) / (Math.min(a, b) + .05) >= 4.5, `Theme ${index}: button text contrast`)
  }
  console.log('PASS: text tokens meet 4.5:1 contrast on both solid theme surfaces.')
  const portrait = await readFile('src/myImage-removebg-preview.png')
  assert.equal(portrait.readUInt32BE(16), 433)
  assert.equal(portrait.readUInt32BE(20), 577)
  await build({
    stdin: { contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import assert from 'node:assert/strict';
      import { PERSONA, CONTACT_CONTENT, SKILLS_LIST, SKILL_GROUPS, EMPLOYER, EDUCATION, NAVIGATION_LINKS } from './src/data/content.js';
      import Contact from './src/components/Contact/Contact.jsx';
      import Skills from './src/components/Skills/Skills.jsx';
      import Work from './src/components/Work/Work.jsx';
      import Nav from './src/components/Nav/Nav.jsx';
      import About from './src/components/About/About.jsx';
      import Hero from './src/components/Hero/Hero.jsx';
      import App from './src/App.jsx';
      globalThis.window = { matchMedia: query => ({ matches: query === '(max-width: 800px)' }) };
      assert.equal(CONTACT_CONTENT.email, PERSONA.email);
      assert.equal(CONTACT_CONTENT.locationName, PERSONA.location);
      assert.equal(CONTACT_CONTENT.officeTimezone, PERSONA.timezone);
      assert.match(new Intl.DateTimeFormat('en', { timeZone: PERSONA.timezone, timeZoneName: 'shortOffset' }).format(new Date('2026-10-04T12:00:00Z')), /GMT\\+5:45/);
      const contact = renderToStaticMarkup(<Contact />);
      assert.ok(contact.includes('mailto:' + PERSONA.email));
      assert.ok(contact.includes(PERSONA.location));
      assert.ok(!contact.includes('inesokafor') && !contact.includes('Lisbon'));
      assert.ok(contact.includes('href="' + PERSONA.github + '"'));
      const skills = renderToStaticMarkup(<Skills />);
      assert.equal((skills.match(/<li(?: |>)/g) || []).length, SKILLS_LIST.length);
      for (const skill of SKILLS_LIST) assert.ok(skills.includes(skill));
      assert.equal(SKILLS_LIST.length, 31);
      assert.equal(new Set(SKILLS_LIST).size, SKILLS_LIST.length);
      for (const skill of ['PostgreSQL', 'TanStack Query', 'Docker Compose', 'React Testing Library', '.NET (basic)', 'Java (basic)', 'C# (basic)']) assert.ok(SKILLS_LIST.includes(skill));
      for (const group of SKILL_GROUPS) assert.ok(skills.includes('>' + group.title.replaceAll('&', '&amp;') + '<'));
      assert.ok(skills.includes('aria-pressed="true"'));
      const work = renderToStaticMarkup(<Work />);
      assert.equal((work.match(/<article/g) || []).length, 2);
      assert.ok(work.includes(EMPLOYER.name) && work.includes('href="' + EMPLOYER.url + '"'));
      assert.ok(work.includes(EDUCATION.period));
      assert.ok(!work.includes('Tidepool') && !work.includes('Halcyon'));
      const mobileNav = renderToStaticMarkup(<Nav />);
      assert.match(mobileNav, /<nav[^>]*hidden=""/);
      assert.ok(mobileNav.includes('aria-controls="main-navigation"'));
      assert.ok(mobileNav.includes('aria-expanded="false"'));
      assert.ok(mobileNav.includes('Switch to light mode'));
      assert.ok(mobileNav.includes('Pause animations'));
      assert.ok(renderToStaticMarkup(<About />).includes('About ' + PERSONA.name));
      const hero = renderToStaticMarkup(<Hero />);
      assert.ok(hero.includes('alt="' + PERSONA.name + '"'));
      assert.ok(hero.includes('src="data:image/png;base64,'));
      assert.ok(hero.includes('fetchpriority="high"'));
      const app = renderToStaticMarkup(<App />);
      assert.equal((app.match(/<h1 /g) || []).length, 1);
      for (const link of NAVIGATION_LINKS) assert.ok(app.includes('id="' + link.href.slice(1) + '"'));
      assert.ok(app.includes('id="app-content"') && app.includes('Skip to content'));
      console.log('PASS: personal details, 31 unique skills, education/employer, portrait, GitHub links, mobile navigation, and page landmarks.');
    `, resolveDir: process.cwd(), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'esm', packages: 'external',
    loader: { '.css': 'empty', '.png': 'dataurl' }, outfile: output,
  })
  await import(pathToFileURL(output).href)
  await build({ entryPoints: ['scripts/interactions.jsx'], bundle: true, platform: 'node', format: 'esm', packages: 'external', loader: { '.css': 'empty' }, outfile: interactions })
  await import(pathToFileURL(interactions).href)
} finally {
  await rm(output, { force: true })
  await rm(interactions, { force: true })
  await rmdir(directory).catch(() => {})
}
