import { useEffect, useMemo, useState } from "react";

// An animated, real-text ASCII storyboard. No canvas, images, WebGL, or external packages.
// Four small scenes cycle continuously and dissolve character-by-character into one another.
const W = 60;
const H = 22;
const SCENE_MS = 5400;
const TRANSITION_START = 0.83;
const STEP_MS = 90;

const scenes = [
  { id: "01", title: "ORBITAL HARDWARE", detail: "LAUNCH > DEPLOY", code: "SAT / 001" },
  { id: "02", title: "VEHICLE SYSTEMS", detail: "DRIFT > TELEMETRY", code: "CAN / 500K" },
  { id: "03", title: "CIRCUITS & IDEAS", detail: "INPUT > LIGHT", code: "VCC / ON" },
  { id: "04", title: "SPEAKING & LEADERSHIP", detail: "IDEAS > IMPACT", code: "MUN / TALK" },
];

function blank() {
  return Array.from({ length: H }, () => Array(W).fill(" "));
}
function glyph(g, x, y, char) {
  if (x >= 0 && y >= 0 && x < W && y < H) g[y][x] = char;
}
function text(g, x, y, str) {
  for (let i = 0; i < str.length; i++) glyph(g, x + i, y, str[i]);
}
function stamp(g, x, y, lines) {
  lines.forEach((line, i) => text(g, x, y + i, line));
}
function line(g, x1, y1, x2, y2, char) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let n = 0; n <= steps; n++) {
    glyph(g, Math.round(x1 + (x2 - x1) * n / steps), Math.round(y1 + (y2 - y1) * n / steps), char);
  }
}
function stars(g, count = 20, shift = 0) {
  // Stable pseudo-random points: stars don't shimmer randomly from frame to frame.
  for (let i = 0; i < count; i++) {
    let x = (i * 37 + 13 + shift) % W;
    let y = (i * 11 + (i * i * 7) + 2) % H;
    glyph(g, x, y, i % 6 === 0 ? "+" : ".");
  }
}
function raster(g) {
  return g.map((row) => row.join("")).join("\n");
}
function dissolve(from, to, amount) {
  if (amount <= 0) return from;
  if (amount >= 1) return to;
  const a = from.split("\n");
  const b = to.split("\n");
  return a.map((row, y) => {
    let result = "";
    for (let x = 0; x < W; x++) {
      // A staggered diagonal wipe with deterministic dithering at its edge.
      const noise = ((x * 17 + y * 13 + x * y * 3) % 23) / 23;
      const threshold = 0.07 + 0.79 * (x / (W - 1)) + 0.14 * noise;
      result += amount >= threshold ? b[y][x] : row[x];
    }
    return result;
  }).join("\n");
}

function rocketFrame(p) {
  const g = blank();
  stars(g, 25);
  // Orbital trace in the upper right, revealed as the rocket climbs.
  for (let x = 34; x < 58; x++) {
    const y = Math.round(7 - 3 * Math.sin((x - 34) / 24 * Math.PI));
    if (x % 2 === 0) glyph(g, x, y, ".");
  }
  const rocketY = Math.round(12 - p * 17);
  stamp(g, 17, rocketY, [
    "     /\\     ",
    "    /==\\    ",
    "   | /\\ |   ",
    "   | :: |   ",
    "   | :: |   ",
    "   |[##]|   ",
    "  /|____|\\  ",
    " /__|__|__\\ ",
    "     ||     ",
  ]);
  const fireLen = 2 + (Math.round(p * 8) % 3);
  for (let i = 0; i < fireLen; i++) {
    text(g, 21 + (i % 2), rocketY + 9 + i, i % 2 ? "/::\\" : " \\||/");
  }
  if (p < 0.31) {
    text(g, 7, 20, "________ LAUNCH PAD / 001 ________");
  }
  if (p > 0.49) {
    const satX = 32 + Math.round((p - 0.49) * 17);
    const satY = 10 - Math.round((p - 0.49) * 9);
    stamp(g, satX, satY, [
      "   .----.   ",
      "===|[##]|===",
      "   '----'   ",
    ]);
    if (p > 0.68) text(g, 36, 17, "SATELLITE DEPLOYED");
  }
  return raster(g);
}

function carDriving(p) {
  const g = blank();
  const x = Math.round(2 + p * 13);
  const y = 9 + Math.round(Math.sin(p * Math.PI * 3) * 1);
  line(g, 0, 18, 59, 18, "_");
  line(g, 0, 19, 59, 19, ".");
  stamp(g, x, y, [
    "         _____________       ",
    "    ____/  __   __   \\___   ",
    " __/   /__/  \\_/  \\__  \\_ ",
    "/___  _________________  ___\\",
    "   (O)               (O)     ",
  ]);
  for (let k = 0; k < 18; k++) {
    const sx = x - (k * 3 % 28);
    const sy = y + 3 + (k % 4);
    glyph(g, sx, sy, k % 3 === 0 ? "o" : ".");
  }
  if (p > 0.15) {
    for (let k = 0; k < 14; k++) {
      const sx = x - (k * 4 % 28);
      const sy = y + 5 + (k % 3);
      glyph(g, sx, sy, k % 4 === 0 ? "~" : ".");
    }
  }
  text(g, 39, 6, "DRIFT ANGLE / 32 DEG");
  text(g, 39, 8, "TRACTION  ... OFF");
  return raster(g);
}

function vehicleTelemetry(p) {
  const g = blank();
  const rpm = Math.round(4700 + 850 * Math.sin(p * 8));
  const speed = Math.round(58 + 14 * Math.sin(p * 5));
  text(g, 4, 3, "+-- VEHICLE TELEMETRY / SIMULATED FEED ----------------+");
  text(g, 4, 5, `|  RPM       ${String(rpm).padStart(4, " ")}      CAN BUS   /  ONLINE`.padEnd(52) + "|");
  text(g, 4, 7, "|  BOOST     13.2 PSI     THROTTLE  /  67%".padEnd(52) + "|");
  text(g, 4, 9, `|  SPEED     ${String(speed).padStart(2, " ")} MPH       GEAR      /  3`.padEnd(52) + "|");
  const load = "#".repeat(Math.max(2, Math.round(11 + Math.sin(p * 8) * 4))).padEnd(22, ".");
  text(g, 4, 11, (`|  LOAD  [${load}]`).padEnd(52) + "|");
  text(g, 4, 14, "|    SIGNAL TRACE / THROTTLE RESPONSE".padEnd(52) + "|");
  for (let x = 11; x < 53; x++) {
    const v = Math.sin((x / 3.2) - p * 12) * 1.5 + Math.sin(x / 6) * 1.6;
    glyph(g, x, Math.round(17 - v), v > 0 ? "/" : "\\");
  }
  text(g, 4, 20, "+--------------------------------------------------+");
  return raster(g);
}
function carFrame(p) {
  const drive = carDriving(Math.min(1, p * 1.4));
  const telemetry = vehicleTelemetry(p);
  return dissolve(drive, telemetry, Math.max(0, Math.min(1, (p - 0.48) / 0.28)));
}

function bulbFrame(p) {
  const g = blank();
  // A schematic trace reaches the switch and closes the loop.
  text(g, 2, 16, "+-- VCC ------[ R ]---o");
  text(g, 25, 16, p > 0.27 ? "o---------+" : "/  o-------+");
  line(g, 36, 16, 36, 12, "|");
  line(g, 36, 12, 31, 12, "-");
  const on = p > 0.32;
  stamp(g, 23, 4, [
    "    .--------.    ",
    "  .'          '.  ",
    " /              \\",
    `|    ${on ? "########" : "........"}    |`,
    `|    ${on ? "##    ##" : "..    .."}    |`,
    " \\              /",
    "  '.__      __.'  ",
    "      |    |      ",
    "      |____|      ",
    "      [____]      ",
  ]);
  if (on) {
    const rays = [
      [30, 1, "|"], [36, 2, "/"], [42, 4, "/"], [43, 9, "-"],
      [19, 4, "\\"], [17, 9, "-"], [24, 2, "\\"], [30, 0, "+"],
    ];
    const count = Math.min(rays.length, Math.floor((p - .32) * 20));
    for (const [x, y, c] of rays.slice(0, count)) glyph(g, x, y, c);
    if (p > .59) text(g, 39, 17, "CIRCUIT CLOSED");
  } else {
    text(g, 39, 17, "SWITCH / OPEN");
  }
  text(g, 5, 20, on ? "+3.3V  >>>  IDEA TO PROTOTYPE" : "+3.3V  >>>  STANDBY");
  return raster(g);
}

function speakingFrame(p) {
  const g = blank();
  stars(g, 13, 10);
  // A person speaking into a microphone from behind a simple podium.
  stamp(g, 9, 4, [
    "     .---.           ",
    "     (o o)          ",
    "      \\_/           ",
    "     _/|\\_          ",
    "    /  |  \\         ",
    "   +---------+       ",
    "   |  SPEAK  |       ",
    "   | / MUN   |       ",
    "   +---------+       ",
    "       ||            ",
    "      _||_           ",
  ]);
  text(g, 25, 8, "o-- MICROPHONE");
  const waveCount = Math.floor(p * 4) + 1;
  for (let i = 0; i < waveCount; i++) {
    const x = 30 + i * 5;
    glyph(g, x, 11 - i % 2, ")");
    glyph(g, x, 12 + i % 2, ")");
  }
  if (p > 0.38) {
    text(g, 29, 16, "DISCUSS  /  DEBATE");
    text(g, 29, 18, "LEAD     /  CONNECT");
  }
  if (p > 0.66) text(g, 29, 20, "IDEAS  --->  IMPACT");
  text(g, 3, 20, "MUN / TALKS");
  return raster(g);
}

const renderers = [rocketFrame, carFrame, bulbFrame, speakingFrame];

function frameAt(ms) {
  const cycleIndex = Math.floor(ms / SCENE_MS) % scenes.length;
  const phase = (ms % SCENE_MS) / SCENE_MS;
  const localPhase = Math.min(1, phase / TRANSITION_START);
  const outgoing = renderers[cycleIndex](localPhase);
  const transition = Math.max(0, Math.min(1, (phase - TRANSITION_START) / (1 - TRANSITION_START)));
  if (transition <= 0) return { ascii: outgoing, active: cycleIndex, transition: 0 };
  const incomingIndex = (cycleIndex + 1) % scenes.length;
  const incoming = renderers[incomingIndex](0.12);
  return {
    ascii: dissolve(outgoing, incoming, transition),
    active: transition > 0.53 ? incomingIndex : cycleIndex,
    transition,
  };
}

export default function ProjectArchiveReel() {
  const [elapsed, setElapsed] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      setReducedMotion(query.matches);
      if (query.matches) {
        setPlaying(false);
      }
    };
    update();
    query.addEventListener?.("change", update);
    return () => query.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      if (!document.hidden) setElapsed((ms) => (ms + STEP_MS) % (SCENE_MS * scenes.length));
    }, STEP_MS);
    return () => clearInterval(interval);
  }, [playing]);

  const { ascii, active, transition } = useMemo(() => {
    if (reducedMotion && !playing) {
      // Show a composed static scene by default for reduced-motion visitors.
      const index = Math.floor(elapsed / SCENE_MS) % scenes.length;
      return { ascii: renderers[index](0.7), active: index, transition: 0 };
    }
    return frameAt(elapsed);
  }, [elapsed, reducedMotion, playing]);

  const nextScene = () => {
    setElapsed((ms) => ((Math.floor(ms / SCENE_MS) + 1) % scenes.length) * SCENE_MS +
      (reducedMotion ? SCENE_MS * 0.7 : 0));
  };

  return (
    <div className="archive-reel" role="region" aria-label="Animated ASCII illustration of Harshaa's engineering and leadership projects">
      <div className="archive-reel-top">
        <span><span className="archive-reel-indicator" aria-hidden="true" /> ASCII / PORTFOLIO.EXE</span>
        <span>SCENE {scenes[active].id} / 04</span>
      </div>
      <div className="archive-reel-screen">
        <div className="archive-reel-grid" aria-hidden="true" />
        <pre className="archive-reel-ascii" aria-hidden="true">{ascii}</pre>
        <div
          className="archive-reel-sweep"
          aria-hidden="true"
          style={{ opacity: transition > 0 ? 1 : 0, left: `${transition * 100}%` }}
        />
        <span className="archive-reel-corner" aria-hidden="true">+ SIGNAL / LIVE</span>
      </div>
      <div className="archive-reel-bottom">
        <div className="archive-reel-description" aria-live="off">
          <strong>{scenes[active].title}</strong>
          <span>{scenes[active].detail}</span>
        </div>
        <div className="archive-reel-actions">
          <button type="button" onClick={() => setPlaying((value) => !value)}
            aria-label={playing ? "Pause ASCII animation" : "Play ASCII animation"}
            aria-pressed={!playing}>
            {playing ? "PAUSE" : "PLAY"}
          </button>
          <button type="button" onClick={nextScene} aria-label="Next ASCII scene">NEXT ↗</button>
        </div>
      </div>
      <div className="archive-reel-progress" aria-hidden="true">
        {scenes.map((scene, i) => <span key={scene.id} className={i === active ? "is-active" : ""} />)}
      </div>
    </div>
  );
}
