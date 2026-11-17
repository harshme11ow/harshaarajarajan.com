# Harshaa's - Original's | Startup Placeholder

A functional, responsive retro-futuristic boot screen inspired by old industrial computer UIs, with a Prussian blue / ice-cyan palette.

## Preview

Open `index.html` in any browser. No installations or dependencies needed.

## Interactions

- The CRT powers on, boot log steps appear, progress bar fills, and the headline reveals.
- Click `[ R ] REBOOT` or press **R** to replay the introduction.
- Click `[ ESC ] SKIP` or press **Escape** to jump to the finished screen.
- `prefers-reduced-motion` is respected: visitors with reduced-motion preferences see the finished state immediately.
- A live clock displays the visitor's device time (decorative).

## Files

- `index.html` — content and structure.
- `styles.css` — all visuals, effects, responsive rules, and keyframe animations.
- `script.js` — boot/replay/skip logic and clock.
- `harshaa-startup-standalone.html` — same experience with all CSS and JavaScript embedded in one HTML file, convenient for one-file hosting.

## Publish to Cloudflare

### Cloudflare Workers / Astro

For an Astro project, copy these files into `public/` and ensure the project routes `/` appropriately, or port the page into an Astro component (recommended when you begin building the full portfolio).

### Zero-build static deploy

Deploy these three files as static assets on any static hosting service. The entrypoint is `index.html`. The standalone file can be renamed `index.html` and served without other files.

## Customize

In `styles.css`, change the variables at the top, particularly `--prussian`, `--ice`, `--pale`, and `--muted`. In `index.html`, change the main text and status messages. In `script.js`, change boot animation timing and diagnostics text reveal delays.

No external images, fonts, JavaScript libraries, or APIs are used. The radar artwork and CRT effects are CSS-generated.
