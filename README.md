# Aaron's portfolio

React and Vite portfolio with a responsive project grid and an optional Three.js background.

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

Set a project's `url` to its real demo, repository, or case-study URL. Without a URL the card explicitly says its demo is unavailable. Add verified profile URLs to `CONTACT_CONTENT.socials`; an empty list hides the social area. The supplied project descriptions and metrics still require the owner's verification. Unverified experience/project-count claims were removed.

## UI behavior

- Projects and skills remain in normal document flow at all widths and zoom levels.
- Section links use native fragments and preserve browser history.
- Mobile navigation hides closed links, supports Escape and outside dismissal, and moves focus to selected sections.
- Reduced motion disables the optional WebGL scene and pointer motion; the biography and skills are always readable.
- The scene loads separately after the first content paint. GPU initialization errors and context loss switch to a CSS fallback.
- Theme tokens include legible light-mode accents. Email text wraps and stays visible on hover/focus.

## Verification

`npm run check` checks rendered component output and content contracts without launching a browser. It covers contact identity, timezone, all eight skills, project unavailable/linked states, and closed mobile navigation.

Before publishing, inspect 320×568, 375×667, 768×1024, 1024×768, and 1440×900, plus 200% zoom and landscape. Test keyboard navigation, Escape, section-link history, both themes, reduced motion, and disabled WebGL. Browser visual checks cannot be replaced by production compilation or static rendering checks.
