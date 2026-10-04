# Portfolio project review

Reviewed: 4 October 2026

## Animated 3D redesign — latest update

The previous static design has been replaced in response to Aaron's request for a highly animated portfolio:

- New electric-blue visual system, oversized animated typography, transparent layered panels, and a floating portrait.
- Real Three.js metallic torus knot with environment reflections, orbiting rings, satellite, particles, pointer parallax, and scroll-driven positioning. The scene loads in a separate chunk and responds to the selected theme.
- Explicit light/dark toggle with local storage persistence and an early theme script to avoid a flash of the wrong theme. Both palettes include tested text/button contrast.
- Animated headline, technology ribbon, staggered section/card reveals, pointer-driven card tilt/highlights, hover effects, and animated contact background.
- Explicit animation pause/resume control; system reduced motion takes priority. Hidden tabs stop rendering, mobile rendering is capped, and WebGL failure falls back to CSS orbit graphics.
- Aaron's supplied identity, portrait, 31 skills, education, employer, and GitHub are retained.

Verification: content/contrast checks and React interaction tests pass for theme switching/persistence, pause/resume, reduced motion, menu Escape/focus, skill filters, unavailable storage, and listener cleanup. CSS module references were reviewed. No browser surface was available, so GPU appearance, device frame rate, and viewport screenshots remain unverified. Historical findings and earlier designs below are retained for context and are superseded by this update where applicable.

Production build passed with no chunk-size warning: initial JavaScript 167.85 kB (54.39 kB gzip), separately loaded 3D renderer 482.36 kB (122.32 kB gzip), CSS 26.72 kB (6.28 kB gzip), portrait 99.93 kB.

## Personal redesign — 4 October 2026

This update supersedes the original WebGL portfolio and its sample project content. The page now presents Aaron's supplied biography, Lalitpur address, email, BCA studies from 2023 to present, current work at Top Tech Giants, and GitHub profile at `https://github.com/AaronShashankar`.

- Rebuilt the complete UI with warm neutral surfaces, forest-green accents, consistent typography, and system-aware dark colors.
- Added the supplied transparent portrait to a responsive hero frame. Vite bundles the PNG; image dimensions are specified and it receives high fetch priority.
- Organized all 31 supplied skills into six categories with accessible filter buttons and an announced result count. .NET, Java, and C# remain explicitly labelled basic.
- Replaced sample project claims with the actual work/education journey and links to the supplied employer and GitHub destinations.
- Added active section navigation, mobile disclosure behavior, stable email text, clipboard feedback, local Nepal time, and back-to-top navigation.
- Removed the former Three.js scene, custom cursor, marquees, magnetic effects, and their unused dependencies/source files. The page no longer requires WebGL.

Verification: content/component checks and production compilation passed. The build emitted 161.15 kB JavaScript (52.11 kB gzip), 16.71 kB CSS (4.09 kB gzip), and the 99.93 kB portrait, with no chunk-size warning. Text/button colors pass the automated 4.5:1 contrast checks in both themes; every CSS module class reference was checked. No live browser was available, so viewport screenshots, filter/menu event interaction, clipboard behavior, and screen-reader testing remain unverified. Personal employment details come from Aaron's message; the employer website could not be fetched during this session.

## Fixes applied — 4 October 2026

The findings below are retained as the original audit. The code has since been updated:

| Original findings | Resolution |
| --- | --- |
| 1, 2: Identity/contact/metadata | Unified Aaron's email, Nepal location, timezone, metadata, and accessible About label. Removed unverified years/project-count claims and generic social links. |
| 3: Project interactions | Added configurable URL links and an explicit unavailable state when no verified destination is supplied. Full descriptions remain readable. Real URLs still require owner input. |
| 4: Email text | Replaced the clipped ripple stack with stable, wrapping email text and a semantic mailto link. |
| 5: Mobile menu | Closed links are hidden, toggle controls the menu, Escape returns focus, outside clicks dismiss it, and links focus their destination. |
| 6: Reduced motion | Optional WebGL scene is disabled; pointer effects are gated; other continuous JavaScript animation loops were removed. CSS decorative motion respects reduced motion. |
| 7, 10: Skills layout/controls | Replaced the rotating carousel with a persistent semantic grid, eliminating hidden skills and pause/drag problems. |
| 8, 13: Biography/animation cleanup | Biography is always fully readable; counters and their animation lifecycle were removed. Scroll metrics and cursor updates are event-driven. |
| 9: Misleading drag cues | Removed fake grab/drag affordances and scroll-track instructions. |
| 11: Clock | Uses configured location/timezone and derives the actual offset through Intl. |
| 12: Initial bundle | Deferred Scene through React.lazy/Suspense. Initial JS is substantially smaller; the separate Three.js chunk remains large. |
| 14, 15: Tokens/configuration/maintenance | Defined borders, consumes contact configuration, uses project accent/link settings, removed unused GSAP/drei dependencies, renamed package, added README and a check command. |
| Responsive risks | Smaller nonclipping hero typography; normal-flow project grid with adaptive card height; earlier menu breakpoint; wrapping email/header/clock; theme-specific accents; native fragment links and anchor offsets. |
| GPU failure | Checks WebGL2 before mounting Canvas; error boundary, Canvas fallback, and context-loss handling preserve the page. |

`npm run check` validates rendered component output, identity/timezone, skills completeness, project linked/unavailable states, closed mobile navigation, and 4.5:1 text-token contrast against both solid theme surfaces. These checks do not measure contrast over the animated backdrop or prove runtime browser behavior.

Final verification: `npm run check` passed. `npm run build` passed in 27.01 seconds. Initial JavaScript: **171.59 kB / 55.37 kB gzip**, down from 999.74 kB / 278.04 kB gzip (about 83% smaller before compression). Deferred Scene: 823.21 kB / 221.65 kB gzip. CSS: 35.42 kB / 7.85 kB gzip. Vite still reports a size warning for the optional Scene chunk; it is no longer part of the initial page chunk.

**Remaining verification:** Browser access was unavailable during this session. Live viewport, keyboard, screen-reader, GPU failure, and Lighthouse tests remain unverified. Supplied project claims and real destination URLs still need owner verification. No test messages were sent.

## Result

The production build passes, but the portfolio has significant content, interaction, accessibility, and layout problems. Fix identity/contact information and unusable project interactions before publishing. The visual direction is consistent, but several effects interfere with reading or imply functionality that does not exist.

This is a source-code and production-build audit. Browser inventory returned no available browsers, and opening the in-app browser failed with `Browser is not available: iab`. **No screenshots, live viewport tests, Lighthouse scores, measured FPS, or screen-reader tests were obtained.** CSS layout consequences below are identified from implementation; viewport-dependent problems are explicitly listed as risks to reproduce.

## Checks performed

| Check | Result |
| --- | --- |
| Project inventory | Reviewed application entry points, content, all component implementations, hooks, and relevant styles/configuration. No project AGENTS.md found. |
| Production build | `npm run build` passed with Vite 5.4.21 in 54.70 seconds. Initial sandbox attempt failed with esbuild `spawn EPERM`; approved execution succeeded. This was an environment restriction, not an application build defect. |
| Output size | JS: 999.74 kB minified / 278.04 kB gzip. CSS: 35.31 kB / 7.80 kB gzip. HTML: 1.43 kB / 0.75 kB gzip. Vite emitted its >500 kB chunk warning. |
| Content consistency | Compared persona, hero, biography, contact details, metadata, and accessible section labels. Several contradictions confirmed. |
| Interaction audit | Checked anchors, click handlers, keyboard semantics, mobile menu state, scrolling, email animation, and carousel behavior. |
| Motion/lifecycle audit | Checked requestAnimationFrame loops, cleanup, visibility handling, and reduced-motion CSS/hook usage. |
| CSS reference scan | Found undefined `--border-subtle`, and referenced but absent `clockWrapper` and `statusText` classes. Missing classes alone are not necessarily visible defects. |
| Encoding check | Node UTF-8 reads confirmed bullets and em dashes are valid. PowerShell displayed some characters incorrectly; this is not evidence of broken page encoding. |
| Tests/lint | No project test suite, lint configuration, or test/lint scripts found. Dependency-owned tests were excluded from project test coverage. |

No application source fixes were made. Running the build regenerated `dist`.

## Confirmed findings

### 1. High — Contact information belongs to a different persona

**Evidence:** `src/data/content.js`: PERSONA identifies Aaron in Lalitpur with `aaronshasankar@gmail.com`; CONTACT_CONTENT uses `hello@inesokafor.dev`, Lisbon, and Ines social handles. ABOUT_CONTENT.extendedBio also says Lisbon. `Contact.jsx` uses CONTACT_CONTENT.email for its actual mailto destination.

**Impact:** A visitor contacting Aaron is directed to a different mailbox. The page contradicts itself about location and identity.

**Fix:** Use one verified persona for the email, location, timezone, biography, and social profiles. Confirm experience/project claims before retaining the supplied 8-year and 62+ project statistics.

**Acceptance:** Every displayed contact detail and the mailto destination matches the intended owner.

### 2. High — Search metadata and accessible About label name the wrong person

**Evidence:** `index.html` title and description identify Ines Okafor in Lisbon; `src/components/About/About.jsx` uses `aria-label="About Ines Okafor"`.

**Impact:** Browser tabs, metadata consumers, and assistive technology identify a different person from the visible navigation and hero.

**Fix:** Replace these values with verified Aaron metadata and derive the About label from PERSONA. Optional sharing metadata should also use the same identity.

### 3. High — Project cards cannot open projects

**Evidence:** `src/components/Work/Work.jsx` renders plain `<article>` cards with hover handlers and `data-cursor="pointer"`; `Work.module.css` applies `cursor: pointer`. There is no anchor, click action, or keyboard activation. WORK_PROJECTS has linkText values but no destination URLs; linkText is never rendered.

**Impact:** The main portfolio content looks interactive but provides no demo, repository, or case-study destination. Clamped descriptions cannot be expanded.

**Fix:** Add verified project URLs and visible semantic links. Provide fuller case studies where needed; retain a noninteractive appearance for cards without destinations.

**Acceptance:** Each project offers a working, keyboard-accessible destination or an explicit unavailable state.

### 4. High — Email hover translation moves both text copies out of view

**Evidence:** `Contact.module.css`: `.rippleChar` stacks two spans vertically; `.charHovered` translates the whole stack by `-100%`. The percentage is based on the stack's own height, so it moves both lines upward. `.emailTextWrapper` clips overflow and uses `height: 1.4em` while the characters independently use a larger clamped font size.

**Impact:** The replacement line is not positioned in the original line's slot; hover can leave the address blank. The wrapper also risks clipping text even before hover.

**Fix:** Translate by exactly one line, typically `-50%` of a two-line stack, and give the clipping wrapper a matching font size/line height. Verify hover, pointer leave, and keyboard focus.

### 5. High — Closed mobile navigation remains in the keyboard and accessibility tree

**Evidence:** `Nav.module.css` hides mobile `.navLinks` using opacity and pointer-events only. `Nav.jsx` does not apply hidden/inert or remove closed links from tab order. There is no Escape handler or focus return behavior.

**Impact:** Keyboard users can focus invisible menu links. Assistive technology can encounter links that visually appear unavailable.

**Fix:** Make the closed menu truly hidden/inert, associate the toggle with its menu using aria-controls, support Escape, and return focus on dismissal. Choose a clear disclosure or modal interaction model.

**Acceptance:** With the menu closed, Tab skips its links; with it open, all links are visible and usable.

### 6. High — Reduced-motion preferences do not stop JavaScript-driven effects

**Evidence:** `useReducedMotion.js` is defined but never imported by components. Scene useFrame callbacks keep rotating/displacing the sculpture, particles, and camera. Skills, Marquee, Cursor, and useSmoothScroll retain animation-frame loops; About counters still animate. Nav and Hero explicitly request smooth scroll with JavaScript. CSS overrides do not stop WebGL or JS loops.

**Impact:** Users requesting reduced motion still receive major background motion and scroll effects; hidden cursor/carousel styles do not eliminate their processing.

**Fix:** Wire the preference into effects and event handlers, use a static scene/list, set counters directly to final values, and request automatic scrolling when reduction is enabled.

### 7. High — Reduced-motion skills layout does not reserve height for the list

**Evidence:** `Skills.module.css` makes pill items static in its reduced-motion block, but `.carouselRing` remains absolutely positioned with a fixed 64px height (56px on mobile). Flex wrapping is applied to `.stage3D`, whose only direct child is that absolute ring, rather than to the pill container. The stage switches to height:auto.

**Impact:** The intended static list does not participate in normal layout; stacked pills can overflow their ring and be clipped by `.skillsSection { overflow: hidden }` or overlap subsequent content.

**Fix:** Reset the ring to position:static, width:100%, height:auto, and display:flex/grid with wrapping. Reset the stage and pill dimensions consistently.

**Acceptance:** All eight skills remain visible in normal flow at narrow widths with reduced motion enabled.

### 8. Medium — About word-reveal formula never fully reveals the final words

**Evidence:** `About.jsx` clamps scrollFactor to 1, then computes `wordProgress = clamp((scrollFactor - index / words.length) * 4)`. For words in the final quarter, the maximum progress is below 1. The last word approaches the original low opacity rather than full opacity.

**Impact:** The end of the main biography remains faded even after completing the reveal. The reduced-motion CSS forces full opacity, but the normal experience does not.

**Fix:** Normalize each word's start/end range so every word reaches progress 1 by the reveal's end; use a readable minimum opacity.

### 9. Medium — Drag instructions and grab cursors advertise missing interactions

**Evidence:** Work says “Drag or scroll to view track” but only a window scroll listener changes translation. Skills uses grab/grabbing cursors but only hover pause and automatic rotation exist. Scene also uses grab cursors with no drag control.

**Impact:** Mouse and touch users are encouraged to attempt gestures that do nothing.

**Fix:** Implement pointer drag with accessible alternatives, or change the wording/cursors to match actual behavior.

### 10. Medium — Skills cannot be paused through keyboard or touch controls

**Evidence:** `Skills.jsx` pauses rotation only on mouseenter; there is no pause button or keyboard equivalent. Hidden back-facing skills use visibility:hidden and change continuously.

**Impact:** Visitors cannot reliably stop and inspect the list, especially on touch devices; the accessible list changes as items rotate out of visibility.

**Fix:** Provide an explicit pause control and a persistent semantic skills list; treat the rotating presentation as decorative if a static accessible duplicate is supplied.

### 11. Medium — Contact clock ignores configuration and displays an inaccurate fixed offset

**Evidence:** `Contact.jsx` hardcodes Europe/Lisbon, Lisbon city text, and `WET / UTC+0`, ignoring PERSONA.timezone and CONTACT_CONTENT.officeTimezone/locationName. A local Intl check for 4 October 2026 returned `GMT+1` for Europe/Lisbon.

**Impact:** The clock shows another location's time; its displayed UTC offset can disagree with the formatted time during daylight saving.

**Fix:** Use the intended persona's timezone and derive the zone label from Intl rather than a fixed seasonal offset.

### 12. Medium — Production JavaScript is delivered as one large initial chunk

**Evidence:** Successful build reports a 999.74 kB JavaScript chunk, 278.04 kB gzip, and a size warning. App statically imports Scene and all sections.

**Impact:** Every visitor downloads/parses the Three.js scene along with ordinary content. Startup cost on slow phones is a risk; no actual load-time measurement was obtained.

**Fix:** Lazy-load the scene behind a lightweight fallback, then profile representative devices. Consider lower DPR/quality on constrained devices. GSAP and drei appear unused in source and should be reviewed for removal; unused installed packages do not automatically imply shipped bundle bytes.

### 13. Medium — Animation loops create avoidable rendering work and incomplete cleanup

**Evidence:** Skills calls setRotationAngle every frame, including when offscreen. About's StatCounter stores only the initial requestAnimationFrame ID; recursive requests are not tracked, so cleanup after the first frame cannot cancel the current request. Cursor's effect depends on isVisible, rebuilding listeners/loop when visibility changes. Only the Scene implements explicit tab visibility handling.

**Impact:** Unnecessary React updates and background work; counters can continue scheduling after unmount. Browser scheduling may throttle hidden tabs, but the code has no equivalent offscreen policy.

**Fix:** Animate decorative transforms through refs, pause offscreen work, track the latest frame ID for cancellation, and keep cursor listeners stable.

### 14. Low — Undefined CSS token removes intended borders

**Evidence:** `Contact.module.css` uses `var(--border-subtle)` for the footer divider and clock border. No definition exists in project CSS.

**Impact:** These border declarations are invalid at computed-value time and the intended separation is missing.

**Fix:** Define the token in both themes or use the existing glass-border token with an appropriate fallback. Review absent clockWrapper/statusText styles only if those wrappers were intended to have styling.

### 15. Low — Content configuration is only partially consumed

**Evidence:** CONTACT_CONTENT.headline, locationName, and officeTimezone are bypassed by hardcoded JSX; project linkText and accentColor are not used for their intended card configuration. Package name still references Ines. No README or quality-check scripts are provided.

**Impact:** Editing content.js does not consistently update the visible application, making persona changes and maintenance error-prone.

**Fix:** Use configuration consistently, remove unused fields, update package identity, and document setup/build plus a short regression checklist.

## UI risks requiring browser reproduction

These are plausible consequences of the current CSS, not screenshot-confirmed findings.

| Risk | Source evidence | Reproduction / likely fix |
| --- | --- | --- |
| Hero surname clipping | HERO_CONTENT.line2 is now the 11-character “Bishwakarma”; Hero uses a very large clamped font, an indented flex line, and overflow:hidden, with no wrapping. | Check 320, 375, 768, 1024, and 1440px widths after fonts load. Fit the complete name using responsive size/indent or deliberate line wrapping. |
| Short-screen project clipping | Sticky work viewport is 100vh with vertical padding; cards are fixed at 560px or 520px and the viewport clips overflow. | Check phone landscape, a 667px-tall phone, and 200% zoom. Allow adaptive card height or switch to a normal stacked/mobile scroll layout. |
| Sticky work behavior affected by ancestor overflow | App root has overflow-x:hidden, while Work depends on position:sticky. Overflow interaction can establish an unintended scroll container. | Verify pinning in actual browsers; use overflow:clip where appropriate or avoid overflow on sticky ancestors. |
| Header crowding | Full long persona name, availability, nav links, and optional role share one flex row; nav remains desktop until 680px. | Check 681–1024px and text zoom. Collapse earlier, constrain the brand, or simplify the row. |
| Email overflow at narrow widths | Unbroken address uses per-character flex spans; large text, arrow, gap, and horizontal padding compete for width. | Check 320/375px after correcting hover. Allow controlled wrapping, lower text size, or separate the arrow. |
| Light-theme legibility | Cyan remains #5CE1E6 on pale backgrounds; Hero gradient mixes dark ink with hardcoded near-white, and email hover uses a hardcoded dark surface with light-theme text. | Measure actual contrast on rendered backgrounds and inspect hover/focus in both themes. Use theme-specific accent/text/surface tokens. |
| Anchor/focus behavior | Nav prevents default anchors and scrolls without updating the fragment/focus; fixed header has no corresponding scroll-margin rule. | Test section links, back/forward, keyboard focus, and direct hashes. Preserve fragment semantics and add offsets/focus handling where needed. |
| GPU failure recovery | Scene starts with hasWebGL:true, checks support after mount, and has no application error boundary or explicit context-loss recovery. | Test WebGL disabled and context loss. Ensure text remains usable and the fallback is selected when Canvas initialization fails. |

## What is already working in the implementation

- Production compilation succeeds.
- Major sections use semantic main/nav/section/footer structure; the hero has one labelled h1.
- Global focus-visible styling exists, and the mobile menu toggle exposes aria-expanded.
- External social links use noopener/noreferrer.
- A CSS WebGL fallback and some reduced-motion/theme rules exist.
- Most event listeners and animation loops include cleanup; the Scene pauses rendering when the tab becomes hidden.

These positives are source-confirmed, not a complete accessibility or compatibility certification. The generic social homepage links still need replacement with actual profiles; their external availability was not checked.

## Recommended fix order

1. Correct owner identity, email, location, metadata, biography, accessible labels, and profile URLs.
2. Add project destinations and repair the email animation.
3. Fix mobile menu visibility/focus, reduced-motion behavior, and the static skills layout.
4. Correct the About reveal formula and replace misleading drag affordances.
5. Test/fix responsive layouts and light-theme contrast in a real browser.
6. Split/defer the 3D bundle, reduce unnecessary animation work, and fix cleanup/configuration gaps.

## Verification checklist after fixes

- Build again and compare initial JS transfer size.
- Inspect all sections at 320×568, 375×667, 768×1024, 1024×768, and 1440×900; include landscape and 200% zoom.
- Test light/dark themes and reduced motion; all skills must remain readable and all major motion must stop when requested.
- Navigate using only Tab, Shift+Tab, Enter, and Escape; check visible focus, menu dismissal, and project links.
- Hover/focus the email and confirm text remains visible and mailto uses the correct address; do not send a test message without authorization.
- Confirm no clipping in the hero, work cards, header, or contact area.
- Verify normal scroll pinning, resize while inside Work, direct section hashes, and back/forward behavior.
- Test WebGL unavailable/context loss and slow/offline font loading.
- Inspect browser console/network and obtain Lighthouse/axe results; record measured results rather than assumed scores.
- Confirm project claims and real profile destinations with the owner before publishing.
