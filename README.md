# Aaron's portfolio

React and Vite portfolio with an animated hero, interactive Three.js background, floating portrait, grouped skill filters, work/education journey, and contact links.

## Run locally

Use Node.js 20 or newer.

```sh
npm ci
npm run dev
npm run check
npm run build
npm run preview
```

## Update content

Edit `src/data/content.js`. Persona is the source for contact email, location, and timezone. Keep the title and description in `index.html` aligned with any future identity changes.

The page uses only the personal details and links provided by Aaron. Update `EMPLOYER`, `EDUCATION`, and `SKILL_GROUPS` as your experience grows. Beginner technologies are explicitly marked basic. GitHub links use `PERSONA.github`. The portrait is `src/myImage-removebg-preview.png`; it is imported by Vite so it also works in production builds.

## UI behavior

- Dark mode is the initial presentation. The sun/moon control switches between complete light and dark themes and saves the choice in local storage before the next page paint.
- A metallic 3D knot rotates within orbiting rings, responds to the pointer, and moves with scrolling. Its lighting/colors follow the selected theme. Three.js loads separately from the content bundle.
- Headline entrances, floating portrait/tags, a moving technology ribbon, staggered scroll reveals, card tilt, hover lighting, and button sweeps provide motion throughout the page.
- The pause control stops decorative motion and the WebGL render loop. Reduced-motion preferences take priority. The GPU loop also stops when the tab is hidden; mobile uses a lower resolution and frame rate.
- GPU initialization failure or context loss leaves a CSS orbital fallback behind the readable content.
- Biography, grouped skills, and journey remain in normal flow at all widths and zoom levels.
- Section links use native fragments and preserve browser history.
- Mobile navigation hides closed links, supports Escape and outside dismissal, and moves focus to selected sections.
- Skills can be filtered using keyboard-accessible category buttons; the selected button and result count are announced.
- Theme tokens include legible text and button colors. Email text wraps and stays visible on hover/focus.
- The copy-email button reports success or an alternative when clipboard access is unavailable.

## Verification

`npm run check` validates content, portrait inclusion, anchors, and theme contrast. React interaction tests cover theme changes/persistence, pause/resume, reduced motion, mobile Escape/focus, skill filtering, blocked storage, and listener cleanup. These are component tests; they do not emulate a GPU or prove visual rendering.

Before publishing, inspect 320×568, 375×667, 768×1024, 1024×768, and 1440×900, plus 200% zoom and landscape. Test keyboard navigation, both themes, pause/resume, scroll/pointer motion, reduced motion, GPU fallback, category filters, email copying, and delayed fonts. Browser visual checks cannot be replaced by production compilation or component tests.
