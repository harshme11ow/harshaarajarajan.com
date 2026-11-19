import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { navLinks } from "../data/site.js";

// Use actual links with Astro's ClientRouter. The island persists between
// pages, so the pill moves from its CURRENT position instead of remounting.
const normalizePath = (path = "/") => {
  const clean = path.replace(/\/+$/, "");
  return clean || "/";
};

const findTab = (path) =>
  navLinks.findIndex(({ href }) =>
    href === "/"
      ? path === "/"
      : path === href || path.startsWith(`${href}/`)
  );

export default function SiteNav({ currentPath = "/" }) {
  const [pathname, setPathname] = useState(normalizePath(currentPath));
  const [pendingHref, setPendingHref] = useState(null);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [pill, setPill] = useState({ left: 0, width: 0 });
  const [ready, setReady] = useState(false);
  const track = useRef(null);
  const anchorRefs = useRef([]);
  const visualIndexRef = useRef(-1);

  const routeIndex = findTab(pathname);
  const pendingIndex = pendingHref === null ? -1 : findTab(normalizePath(pendingHref));
  const visualIndex = hoverIndex ?? (pendingIndex >= 0 ? pendingIndex : routeIndex);
  visualIndexRef.current = visualIndex;

  // Astro supplies new props to a persisted island when the route changes.
  useEffect(() => {
    setPathname(normalizePath(currentPath));
    setPendingHref(null);
    setHoverIndex(null);
  }, [currentPath]);

  // Also handle browser back/forward and Astro router swaps directly.
  useEffect(() => {
    const syncRoute = () => {
      setPathname(normalizePath(window.location.pathname));
      setPendingHref(null);
      setHoverIndex(null);
    };
    document.addEventListener("astro:after-swap", syncRoute);
    window.addEventListener("popstate", syncRoute);
    return () => {
      document.removeEventListener("astro:after-swap", syncRoute);
      window.removeEventListener("popstate", syncRoute);
    };
  }, []);

  const positionPill = () => {
    const container = track.current;
    const tab = anchorRefs.current[visualIndexRef.current];
    if (!container || !tab) return;

    const outer = container.getBoundingClientRect();
    const inner = tab.getBoundingClientRect();
    const next = { left: inner.left - outer.left, width: inner.width };
    setPill((previous) =>
      previous.left === next.left && previous.width === next.width
        ? previous
        : next
    );
  };

  useLayoutEffect(() => {
    positionPill();
  }, [visualIndex]);

  // Initial measurement is unanimated, preventing the old "slide from Home"
  // on a hard refresh. Later route changes animate normally.
  useEffect(() => {
    positionPill();
    const frame = requestAnimationFrame(() => setReady(true));
    const observer = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(positionPill)
      : null;
    if (track.current && observer) observer.observe(track.current);
    anchorRefs.current.forEach((tab) => tab && observer?.observe(tab));
    window.addEventListener("resize", positionPill);
    document.fonts?.ready.then(positionPill).catch(() => {});
    return () => {
      cancelAnimationFrame(frame);
      observer?.disconnect();
      window.removeEventListener("resize", positionPill);
    };
  }, []);

  return (
    <header className="nav-shell wrap">
      <a href="/" className="nav-brand" aria-label="Harshaa's Originals homepage">
        <span className="nav-monogram">H<span className="nav-slash">/</span>R</span>
        <span className="nav-wordmark">HARSHAA'S <span>ORIGINALS</span></span>
      </a>
      <nav className="nav-scroller" aria-label="Main navigation">
        <div className="halo-track" ref={track} onMouseLeave={() => setHoverIndex(null)}>
          <span
            className="halo-indicator"
            aria-hidden="true"
            style={{
              transform: `translateX(${pill.left}px)`,
              width: pill.width,
              opacity: ready && visualIndex >= 0 ? 1 : 0,
              transition: ready ? undefined : "none",
            }}
          />
          {navLinks.map(({ href, label }, index) => (
            <a
              key={href}
              ref={(element) => { anchorRefs.current[index] = element; }}
              href={href}
              aria-current={routeIndex === index ? "page" : undefined}
              className={`halo-link ${visualIndex === index ? "is-active" : ""}`}
              onMouseEnter={() => setHoverIndex(index)}
              onFocus={() => setHoverIndex(index)}
              onBlur={() => setHoverIndex(null)}
              onClick={(event) => {
                if (event.button === 0 && !event.metaKey && !event.ctrlKey && !event.altKey && !event.shiftKey) {
                  setHoverIndex(null);
                  setPendingHref(href);
                }
              }}
            >
              {label}
            </a>
          ))}
        </div>
      </nav>
      <span className="nav-status" title="Portfolio in development"><span className="status-led"/> BUILD 001</span>
    </header>
  );
}
