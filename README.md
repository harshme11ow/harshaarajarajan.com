# Harshaa's — Original's / Minimal Workstation v3

A minimalist retro-futuristic placeholder website. Deep Prussian blue, quiet workstation chrome, carefully spaced typography, an animated oscilloscope trace, and a 1.1-second CRT power-on sequence. Built with HTML, CSS and vanilla JavaScript, with no packages, React runtime, external fonts, images or network requests.

## Preview

- Open `index.html` in a browser, or open `standalone.html` (identical single-file build).
- Click **Replay startup** or press `R` to replay.
- Press `Escape` or click **Skip intro** to bypass the boot effect.
- Respects your OS **Reduce Motion** accessibility preference.

## Deploy to Cloudflare

### Existing Astro project
Place the content inside your Astro project as your homepage, or copy the files into `public/` as a standalone static landing page while working on the full website. If using `public/`, avoid a conflicting generated `index.html` route in Astro.

### Static Cloudflare Pages / Workers asset deployment
Set the static output directory to this folder, or place the three files in your configured static asset directory, and serve `index.html`.

## Customize

- `index.html`: heading, brand name, status messages, description.
- `styles.css`: color variables near the top, layout, animation timings.
- `script.js`: reboot sequencing, shortcuts, skip control.

Colors:
- `#071a28` main deep navy
- `#0a2537` Prussian-tinted surfaces
- `#a5cedc` quiet blue highlight
- `#eaf0ed` warm off-white copy

## Why no React, Motion Primitives, or Unicorn Studio embed?

This is a single, mostly static placeholder page. The precise power-on reveal and type entrance are lightweight and reliable with native CSS, rather than adding a JavaScript runtime, a library, or a third-party scene. For the full portfolio, Astro can host specific React components using Motion Primitives, and Unicorn Studio can be used for one or two more ambitious scenes if the design calls for them.

Reference inspiration:
- https://refero.design/
- https://motion-primitives.com/docs/text-effect
- https://www.unicorn.studio/docs/embed/

All code in this package is original rather than copied from third-party component collections.
