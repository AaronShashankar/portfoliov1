import { build } from 'esbuild'
import { mkdir, rm, rmdir, readFile } from 'node:fs/promises'
import assert from 'node:assert/strict'
import { pathToFileURL } from 'node:url'
import path from 'node:path'

const directory = path.resolve('.checks')
await mkdir(directory, { recursive: true })
const output = path.join(directory, 'render-check.mjs')
try {
  const css = await readFile('src/index.css', 'utf8')
  const luminance = hex => {
    const values = hex.slice(1).match(/../g).map(value => parseInt(value, 16) / 255)
      .map(value => value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4)
    return values[0] * .2126 + values[1] * .7152 + values[2] * .0722
  }
  const themeBlocks = [css.slice(0, css.indexOf('@media')), css.slice(css.indexOf('@media'), css.indexOf('/* Reset'))]
  for (const [index, block] of themeBlocks.entries()) {
    const tokens = Object.fromEntries([...block.matchAll(/--(bg|bg2|ink|muted|cyan|pink|violet): (#[0-9A-Fa-f]{6})/g)].map(match => [match[1], match[2]]))
    for (const name of ['ink', 'muted', 'cyan', 'pink', 'violet']) {
      for (const surface of ['bg', 'bg2']) {
        const a = luminance(tokens[name]), b = luminance(tokens[surface])
        const ratio = (Math.max(a, b) + .05) / (Math.min(a, b) + .05)
        assert.ok(ratio >= 4.5, `Theme ${index}: ${name} on ${surface} contrast ${ratio.toFixed(2)} is below 4.5`)
      }
    }
  }
  console.log('PASS: text tokens meet 4.5:1 contrast on both solid theme surfaces.')
  await build({
    stdin: { contents: `
      import React from 'react';
      import { renderToStaticMarkup } from 'react-dom/server';
      import assert from 'node:assert/strict';
      import { PERSONA, CONTACT_CONTENT, SKILLS_LIST, WORK_PROJECTS } from './src/data/content.js';
      import Contact from './src/components/Contact/Contact.jsx';
      import Skills from './src/components/Skills/Skills.jsx';
      import Work from './src/components/Work/Work.jsx';
      import Nav from './src/components/Nav/Nav.jsx';
      import About from './src/components/About/About.jsx';
      globalThis.window = { matchMedia: query => ({ matches: query === '(max-width: 1100px)' }) };
      assert.equal(CONTACT_CONTENT.email, PERSONA.email);
      assert.equal(CONTACT_CONTENT.locationName, PERSONA.location);
      assert.equal(CONTACT_CONTENT.officeTimezone, PERSONA.timezone);
      assert.match(new Intl.DateTimeFormat('en', { timeZone: PERSONA.timezone, timeZoneName: 'shortOffset' }).format(new Date('2026-10-04T12:00:00Z')), /GMT\\+5:45/);
      const contact = renderToStaticMarkup(<Contact />);
      assert.ok(contact.includes('mailto:' + PERSONA.email));
      assert.ok(contact.includes(PERSONA.location));
      assert.ok(!contact.includes('inesokafor') && !contact.includes('Lisbon'));
      const skills = renderToStaticMarkup(<Skills />);
      assert.equal((skills.match(/<li /g) || []).length, SKILLS_LIST.length);
      for (const skill of SKILLS_LIST) assert.ok(skills.includes(skill));
      const work = renderToStaticMarkup(<Work />);
      assert.equal((work.match(/<article/g) || []).length, WORK_PROJECTS.length);
      assert.equal((work.match(/Demo link not available yet/g) || []).length, WORK_PROJECTS.filter(p => !p.url).length);
      const previousURL = WORK_PROJECTS[0].url;
      WORK_PROJECTS[0].url = 'https://example.com/case-study';
      const linkedWork = renderToStaticMarkup(<Work />);
      assert.ok(linkedWork.includes('href="https://example.com/case-study"'));
      assert.ok(linkedWork.includes(WORK_PROJECTS[0].linkText));
      WORK_PROJECTS[0].url = previousURL;
      const mobileNav = renderToStaticMarkup(<Nav />);
      assert.match(mobileNav, /<nav[^>]*hidden=""/);
      assert.ok(mobileNav.includes('aria-controls="main-navigation"'));
      assert.ok(mobileNav.includes('aria-expanded="false"'));
      assert.ok(renderToStaticMarkup(<About />).includes('About ' + PERSONA.name));
      console.log('PASS: identity, timezone, contact, complete skills, project states, mobile menu, and About label.');
    `, resolveDir: process.cwd(), loader: 'jsx' },
    bundle: true, platform: 'node', format: 'esm', packages: 'external',
    loader: { '.css': 'empty' }, outfile: output,
  })
  await import(pathToFileURL(output).href)
} finally {
  await rm(output, { force: true })
  await rmdir(directory).catch(() => {})
}
