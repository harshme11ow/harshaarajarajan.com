# Harshaa's Originals — Astro + React portfolio starter

Designed for your existing Git repository at `harshaarajarajan.com/website`.

## Setup in VS Code (PowerShell)

1. Back up your current `website/src` and `website/astro.config.mjs` before overwriting anything. Do NOT delete your existing Git repository or `package.json`.
2. Copy `src/`, `astro.config.mjs`, and `tsconfig.json` from this kit **into your existing `website/` folder**. This should MERGE with your project; it does not need a new Astro project.
3. In the VS Code terminal, `cd` to `website/` and run:

```powershell
npm install
npm run dev
```

If your Astro React integration isn't already installed, run `npx astro add react` first. These files otherwise require only Astro + `@astrojs/react` + React. The animated satellite and Halo-style nav are lightweight React components with no extra packages.

## Cult UI — Halo Tabs Pill

The provided global navigation uses **real `<a href>` page links** with a glowing sliding Halo pill indicator. The genuine Cult UI **Halo Tabs** primitive is meant to switch tab panels inside one page and does not itself provide cross-page navigation. Using real links preserves browser history, native link behavior, accessibility, and Astro routing.

To install the **actual Cult UI Halo Tabs** component later for on-page tabs (such as project categories or about sections), see [the official Cult UI docs](https://www.cult-ui.com/docs/components/halo-tabs). Configure Tailwind v4 and shadcn in this existing project first:

```powershell
npx astro add tailwind
npx shadcn@latest init
npx shadcn@latest add @cult-ui/halo-tabs
```

The CLI will generate `src/components/ui/halo-tabs.tsx` (depending on your `components.json`). Inspect its exports and sample usage on the Cult UI docs page; it's not an Astro router. This starter purposely has no required dependency on that file, so the entire portfolio works before you install shadcn/Tailwind.

## File guide

- `src/layouts/BaseLayout.astro` — shared HTML shell, SEO, site navigation and footer
- `src/components/SiteNav.jsx` — globally active Halo pill-style route navigation
- `src/components/SatelliteScene.jsx` — interactive satellite illustration with dragging and selectable subsystems
- `src/components/ProjectCard.astro` — reusable project previews
- `src/data/projects.js` — editable descriptions of each engineering project
- `src/data/journal.js` — example journal entries; replace before publishing
- `src/data/site.js` — editable contact links and portfolio settings
- `src/styles/global.css` — theme, typography, layout and responsive styles
- `src/pages/` — Astro file-based routes, including projects/[slug] and journal/[slug]

## Update the content before publishing

- Replace draft project descriptions with your verified work and approved images.
- Replace example journal entries with your own writing.
- Add your GitHub handle, Instagram, and contact email in `src/data/site.js`.
- If you want a résumé download, add `public/resume.pdf` and set `resumePath: '/resume.pdf'` in `src/data/site.js`.
- Satellite illustration is an original, stylized *concept*, not an actual BoBa spacecraft model.
- You can later migrate journal and project text into Astro content collections or Markdown.

## Routes

`/`, `/projects`, `/projects/[slug]`, `/about`, `/cv`, `/journal`, `/journal/[slug]`, `/connect`, `/404`

## Verify

```powershell
npm run build
npm run dev
```

After local testing, commit your work from the existing Git repository root. Astro static output is `website/dist`, and Cloudflare builds should use `website` as the root if that's where your Astro project lives.
