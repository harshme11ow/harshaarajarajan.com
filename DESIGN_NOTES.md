# Design notes · Retro × futuristic

## North star

An old personal engineering workstation reconstructed with modern, smooth motion. **Tactile instead of sterile; sophisticated instead of gimmicky.** Recruiters should immediately find the engineering projects even if they ignore the animations.

## Palette

| Token | HEX | Role |
|---|---|---|
| Prussian Blue | `#003153` | Main brand, active navigation, borders and technical emphasis |
| Abyss | `#061724` | Deepest background |
| Midnight | `#0C304A` | Hero and panel atmosphere |
| Ice Cyan | `#90D8F2` | Illuminated text, HUD details, scan glow |
| Frost | `#DCEAF0` | Paper-like portfolio section backgrounds |
| Paper | `#EEF5F7` | Card surfaces and dialogs |
| Steel | `#456E88` | Secondary technical information |

All primary style variables are at the top of `prussian.css`.

## Borrowed from Retro

- Wide chunky window title bars and square window controls
- Sturdy card borders and offset hard shadows
- Monospace navigation and technical labels
- File archive / field notes / playful terminal copy
- Oversized human introduction and legible project summaries

## Borrowed from Futuristic

- Deep-blue, softly illuminated hero and journal sections
- Animated orbital radar sweep, halo, and satellite hovering
- Atmospheric blueprint grid in the hero
- Cyan glow, slow movement, and subtle visual parallax
- Scroll progress and content reveal animations

## Restraint and accessibility

- No long intro gate: introduction remains immediately readable.
- Animations are decorative; important links and project descriptions are usable without them.
- Honor reduced-motion settings and provide scanner toggle.
- No external fonts, telemetry feeds or videos in this demo.

## Next production work

1. Replace generated project drawings with actual annotated hardware photographs and project videos.
2. Break this prototype into components and content collections using Astro.
3. Create full project case-study pages and real page transitions.
4. Add a light, accessible scroll-driven video section only if it improves the story; prefer short compressed looping media with posters.
5. Test on mobile and with low-power devices; performance should remain a selling point.
6. Connect GitHub to Cloudflare and add the custom domain after the production site is ready.
