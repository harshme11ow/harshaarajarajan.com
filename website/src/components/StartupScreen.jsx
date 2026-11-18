
import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "motion/react";

import "./StartupScreen.css";

const bootMessages = [
  "CHECKING DISPLAY ........ OK",
  "MOUNTING /PROJECTS ....... OK",
  "INITIALIZING ARCHIVE .... OK",
];

export default function StartupScreen() {
  const reducedMotion = useReducedMotion();

  const [booting, setBooting] = useState(true);
  const [cycle, setCycle] = useState(0);
  const [showLog, setShowLog] = useState(false);

  // Complete the startup sequence automatically.
  useEffect(() => {
    if (reducedMotion) {
      setBooting(false);
      return;
    }

    const timer = setTimeout(() => {
      setBooting(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, [cycle, reducedMotion]);

  function replay() {
    setShowLog(false);
    setBooting(true);
    setCycle((previous) => previous + 1);
  }

  // Reusable entrance animation.
  function reveal(delay = 0) {
    return {
      initial: { opacity: 0, y: 18 },
      animate: {
        opacity: booting ? 0 : 1,
        y: booting ? 18 : 0,
      },
      transition: {
        duration: reducedMotion ? 0 : 0.75,
        delay: reducedMotion ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      },
    };
  }

  return (
    <div className="workstation">

      {/* Subtle background texture */}
      <div className="screen-texture" aria-hidden="true" />

      {/* POWER-ON SEQUENCE */}
      <AnimatePresence>
        {booting && !reducedMotion && (
          <motion.div
            key={cycle}
            className="boot-overlay"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.45 }}
          >
            <div className="power-line" />

            <div className="boot-message">
              <span>H/O — SYSTEM 001</span>
              <span>INITIALIZING DISPLAY_</span>
            </div>

            <button
              className="skip-button"
              onClick={() => setBooting(false)}
              type="button"
            >
              SKIP INTRO ↗
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP NAVIGATION */}
      <header className="topbar">

        <div className="brand">
          <div className="brand-icon">H/O</div>
          <span>HARSHAA'S ORIGINALS</span>
        </div>

        <span className="topbar-version">
          EST. 2026 / V.01
        </span>

      </header>

      {/* MAIN CONTENT */}
      <main className="hero">

        <section className="hero-copy">

          <motion.div
            className="system-status"
            {...reveal(0.05)}
          >
            <span className="status-light" />
            <span>SYSTEM / UNDER CONSTRUCTION</span>
          </motion.div>

          <motion.h1 {...reveal(0.16)}>
            Website
            <br />
            <span>in progress.</span>
          </motion.h1>

          <motion.p
            className="hero-description"
            {...reveal(0.32)}
          >
            An evolving collection of engineering projects,
            experiments, and things made out of curiosity.
          </motion.p>

          <motion.div
            className="hero-actions"
            {...reveal(0.45)}
          >
            <button
              className="replay-button"
              onClick={replay}
              type="button"
            >
              <span aria-hidden="true">↻</span>
              REPLAY STARTUP
            </button>

            <span className="build-label">
              BUILD 001 / 2026
            </span>
          </motion.div>

        </section>

        {/* VINTAGE COMPUTER PANEL */}
        <motion.aside
          className="terminal-panel"
          aria-label="Retro workstation terminal"
          {...reveal(0.38)}
        >

          <div className="terminal-header">
            <span>TERMINAL / DISPLAY_01</span>

            <div className="window-controls" aria-hidden="true">
              <i />
              <i />
              <i />
            </div>
          </div>

          <div className="terminal-body">

            <div className="terminal-meta">
              <span>HARSHAA_OS / V1.0</span>
              <span>LOCAL</span>
            </div>

            <div className="terminal-center">

              <div className="terminal-prompt">
                <span>&gt;</span>
                <span className="terminal-cursor" />
              </div>

              <p>Awaiting deployment.</p>

            </div>

            {/* Animated signal display */}
            <div className="signal-display">

              <div className="signal-header">
                <span>DISPLAY SIGNAL</span>
                <span>CH_01</span>
              </div>

              <svg
                viewBox="0 0 420 100"
                aria-hidden="true"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 56 H420"
                  className="signal-baseline"
                />

                <motion.path
                  d="M0 56 H30 L52 56 L66 26
                     L88 85 L113 56 H153
                     L166 40 L178 72 L199 56
                     H250 L266 32 L278 75
                     L296 56 H420"
                  className="signal-wave"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: booting ? 0 : 1,
                  }}
                  transition={{
                    duration: reducedMotion ? 0 : 1.8,
                    delay: reducedMotion ? 0 : 0.65,
                    ease: "easeInOut",
                  }}
                />

              </svg>
            </div>

            <div className="terminal-footer">

              <span>
                <span className="tiny-light" />
                SYSTEM IDLE
              </span>

              <button
                type="button"
                className="log-button"
                aria-expanded={showLog}
                onClick={() => setShowLog(!showLog)}
              >
                {showLog ? "CLOSE LOG −" : "VIEW LOG +"}
              </button>

            </div>

            <AnimatePresence>
              {showLog && (
                <motion.ul
                  className="boot-log"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.25 }}
                >
                  {bootMessages.map((message) => (
                    <li key={message}>{message}</li>
                  ))}
                </motion.ul>
              )}
            </AnimatePresence>

          </div>
        </motion.aside>

      </main>

      {/* FOOTER */}
      <footer className="site-footer">
        <span>DESIGNED & BUILT WITH INTENTION</span>
        <span>HARSHAA'S - ORIGINAL'S / 001</span>
      </footer>

    </div>
  );
}
