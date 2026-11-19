import { useEffect, useRef, useState } from "react";
import { navLinks } from "../data/site.js";

// Halo Tabs-style pill navigation, implemented with real links for correct page semantics.
// Cult UI's actual Halo Tabs swaps panels, not routes. See README for installing it for in-page tabs.
export default function SiteNav({ currentPath = "/" }) {
  const normalizedPath = currentPath === "/" ? "/" : currentPath.replace(/\/$/, "");
  const activeIndex = normalizedPath.startsWith("/projects/")
    ? 1
    : navLinks.findIndex((item) => item.href === normalizedPath);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });
  const track = useRef(null);
  const anchorRefs = useRef([]);

  useEffect(() => {
    const update = () => {
      const chosen = hoverIndex ?? Math.max(0, activeIndex);
      const trackEl = track.current;
      const anchor = anchorRefs.current[chosen];
      if (!trackEl || !anchor) return;
      const outer = trackEl.getBoundingClientRect();
      const inner = anchor.getBoundingClientRect();
      setPill({ left: inner.left - outer.left, width: inner.width, visible: true });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [hoverIndex, activeIndex]);

  return (
    <header className="nav-shell wrap">
      <a href="/" className="nav-brand" aria-label="Harshaa's Originals homepage">
        <span className="nav-monogram">H<span className="nav-slash">/</span>O</span>
        <span className="nav-wordmark">HARSHAA'S <span>ORIGINALS</span></span>
      </a>
      <nav className="nav-scroller" aria-label="Main navigation">
        <div className="halo-track" ref={track} onMouseLeave={() => setHoverIndex(null)}>
          <span
            className="halo-indicator"
            aria-hidden="true"
            style={{ transform: `translateX(${pill.left}px)`, width: pill.width, opacity: pill.visible ? 1 : 0 }}
          />
          {navLinks.map(({ href, label }, index) => {
            const active = index === activeIndex;
            return (
              <a key={href}
                ref={(element) => { anchorRefs.current[index] = element; }}
                href={href}
                aria-current={active ? "page" : undefined}
                className={`halo-link ${active ? "is-active" : ""}`}
                onMouseEnter={() => setHoverIndex(index)}
                onFocus={() => setHoverIndex(index)}
                onBlur={() => setHoverIndex(null)}
              >{label}</a>
            );
          })}
        </div>
      </nav>
      <span className="nav-status" title="Portfolio in development"><span className="status-led"/> BUILD 001</span>
    </header>
  );
}
