# Prussian Workstation · Harshaa portfolio hybrid

A **standalone, no-install** personal-engineering-portfolio homepage prototype mixing retro-computer interface design with futuristic movement and a Prussian-blue palette.

## Open the prototype

1. Extract the ZIP.
2. Open `index.html` in Chrome, Edge, or Firefox.
3. Scroll through the homepage, click a project, try the filters, and toggle the orbital scan / CRT controls in the header.
4. Try the responsive layout by narrowing the browser window.

No Node.js, server, build command, paid fonts, or external assets required. The only external link is the LinkedIn link.

## What's included

- `index.html`: complete homepage structure, including hero, selected projects, journal concepts, about, CV placeholder and lab.
- `styles.css`: shared retro-workstation base styles.
- `prussian.css`: **Prussian-blue hybrid theme** and animation enhancements. This is the best place to customize the look.
- `script.js`: filters, modal previews, responsive menu, CRT/scan controls, scroll entrances, scroll-progress indicator, and gentle hero parallax.
- `DESIGN_NOTES.md`: design rationale and next steps.
- `preview-desktop-hero.png` and `preview-mobile-hero.png`: sample screenshots.

## Features you can test

- Orbiting scanner sweep + floating satellite illustration, with **SCAN ON/OFF**.
- Optional CRT effect (**CRT ON/OFF**).
- Subtle hero parallax while scrolling on desktop.
- Scroll-reveal sections and page entrance animation.
- Scroll-reading progress indicator.
- Filter the four project cards (all / hardware / software).
- Click a project card to see its modal preview; close with button or Esc.
- Responsive mobile navigation.
- Playground idea generator.
- Motion-reduction support with `prefers-reduced-motion`.

## Important before you publish

- The project summaries are draft descriptions, not complete verified case studies. Replace them with your approved photos, exact contributions, test results and project links.
- The CV area currently says **FILE PENDING** and intentionally does not link to an invented PDF. Add your real CV before publishing.
- The journal entries are **draft ideas**, not full articles.
- The orbital data is a **fictional animation demo**, not live satellite telemetry.
- This is a **one-page prototype**, not yet a multi-page Astro site. Project modals demonstrate a page-opening interaction; real page transitions and dedicated `/projects/...` pages are future work.
- Video backgrounds are not included yet; these will be most effective once actual engineering footage is available.

## Next step: Astro + Cloudflare

Once the direction is approved, migrate `index.html` into `src/pages/index.astro`, turn its sections into Astro components, keep `prussian.css` as the global theme layer, and add real Markdown/MDX project case studies. Deploy the resulting static build on Cloudflare Workers Static Assets.
