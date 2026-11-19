import { useEffect, useState } from "react";

// Only mounted by src/pages/index.astro. Other routes never boot.
export default function HomeBoot() {
  const [visible, setVisible] = useState(true);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    // Keep the page immediately usable for people who prefer reduced motion.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVisible(false);
      return;
    }

    const startExit = window.setTimeout(() => setExiting(true), 1150);
    const remove = window.setTimeout(() => setVisible(false), 1470);
    return () => {
      window.clearTimeout(startExit);
      window.clearTimeout(remove);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className={`home-boot${exiting ? " is-exiting" : ""}`}>
      <div className="home-boot-beam" aria-hidden="true" />
      <div className="home-boot-caption" aria-hidden="true">
        <strong>H/R — ORIGINALS</strong>
        <span>INITIALIZING WORKSTATION_</span>
      </div>
      <button className="home-boot-skip" type="button" onClick={() => setVisible(false)}>
        SKIP INTRO ↗
      </button>
    </div>
  );
}
