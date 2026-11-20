import { useEffect, useMemo, useState } from "react";

// Three-scene ASCII engineering reel: CubeSat comms, vehicle + telemetry,
// and ESP32 wireless lighting control. All visuals are plain text.
const W = 60;
const H = 22;
const SCENE_MS = 5900;
const TRANSITION_START = 0.84;
const STEP_MS = 90;

const scenes = [
  { id: "01", title: "ORBITAL HARDWARE", detail: "CUBESAT / RF LINK", code: "SAT / RF" },
  { id: "02", title: "VEHICLE SYSTEMS", detail: "FAST RUN / TELEMETRY", code: "CAN / LIVE" },
  { id: "03", title: "EMBEDDED ELECTRONICS", detail: "ESP32 / WIRELESS LIGHT", code: "MCU / RF" },
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
  lines.forEach((row, i) => text(g, x, y + i, row));
}
function line(g, x1, y1, x2, y2, char) {
  const steps = Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1), 1);
  for (let n = 0; n <= steps; n++) {
    glyph(g, Math.round(x1 + (x2 - x1) * n / steps), Math.round(y1 + (y2 - y1) * n / steps), char);
  }
}
function stars(g, count = 20) {
  for (let i = 0; i < count; i++) {
    const x = (i * 37 + 13) % W;
    const y = (i * 11 + i * i * 7 + 2) % H;
    glyph(g, x, y, i % 7 === 0 ? "+" : ".");
  }
}
function raster(g) {
  return g.map((row) => row.join("")).join("\n");
}
function clamp(x, a = 0, b = 1) {
  return Math.min(b, Math.max(a, x));
}
function dissolve(from, to, amount) {
  if (amount <= 0) return from;
  if (amount >= 1) return to;
  const a = from.split("\n");
  const b = to.split("\n");
  return a.map((row, y) => {
    let result = "";
    for (let x = 0; x < W; x++) {
      const noise = ((x * 17 + y * 13 + x * y * 3) % 23) / 23;
      const threshold = 0.07 + 0.79 * (x / (W - 1)) + 0.14 * noise;
      result += amount >= threshold ? b[y][x] : row[x];
    }
    return result;
  }).join("\n");
}

// Scene 1: CubeSat in orbit passing packets to and from the ground.
function satelliteFrame(p) {
  const g = blank();
  stars(g, 22);
  text(g, 3, 1, "CUBESAT LINK / HR-CUBE-1        UHF / BIDIRECTIONAL");

  const sx = 10 + Math.round(2 * Math.sin(p * Math.PI * 2));
  const sy = 5 + Math.round(Math.sin(p * Math.PI * 2));
  const radio = { x: sx + 11, y: sy + 4 };
  const ground = { x: 48, y: 17 };

  line(g, radio.x, radio.y, ground.x, ground.y, ".");
  const downlink = p < 0.5;
  const t = downlink ? p * 2 : (p - 0.5) * 2;
  const f = downlink ? t : 1 - t;
  const packetX = Math.round(radio.x + (ground.x - radio.x) * f);
  const packetY = Math.round(radio.y + (ground.y - radio.y) * f);

  if (downlink) {
    text(g, 2, 17, "TX > BUS VOLT / TEMP / HEALTH");
    text(g, 2, 19, "PACKET 104 / DOWNLINK");
  } else {
    text(g, 2, 17, "RX < ACK / COMMAND WINDOW");
    text(g, 2, 19, "PACKET 104 / UPLINK");
  }

  // CubeSat with small deployable panels and an antenna boom.
  stamp(g, sx, sy, [
    "  [::::]===+---+=== [::::]  ",
    "          /|###|\\         ",
    "         +-|###|-+---->    ",
    "          \\|###|/         ",
    "            +---+          ",
  ]);

  for (let x = 0; x < W; x += 2) {
    const y = 20 + Math.round((x - 30) ** 2 / 650);
    glyph(g, x, y, x % 4 === 0 ? "_" : ".");
  }
  stamp(g, 43, 15, [
    "    /\\",
    "   /||\\",
    "  /_||_\\",
    "    ||",
  ]);
  text(g, 38, 21, "GROUND / EARTH");
  glyph(g, packetX, packetY, downlink ? ">" : "<");
  return raster(g);
}

// Scene 2A: short fast car.
function carDriving(p) {
  const g = blank();
  const tick = Math.floor(p * 42);
  const y = 9 + (tick % 9 === 0 ? 1 : 0);
  const wheel = tick % 2 === 0 ? "O" : "@";
  text(g, 3, 2, "ROAD TEST / HIGH-SPEED RUN      SIMULATED VISUAL");
  text(g, 39, 4, `SPEED ${Math.round(86 + p * 28)} MPH`);

  for (let k = 0; k < 17; k++) {
    const x = (k * 13 - tick * 4 + 6000) % W;
    if (x < 23) text(g, x, 7 + (k % 3) * 2, k % 3 === 0 ? "====" : "--");
  }
  for (let k = 0; k < 13; k++) {
    const x = (k * 11 - tick * 5 + 6000) % W;
    text(g, x, 18, "______");
    text(g, (x + 6) % W, 20, "----");
  }
  line(g, 0, 16, 59, 16, ".");

  stamp(g, 16, y, [
    "      _____________",
    "  ___/ __     __  \\___",
    " /___ /_/\\___/_/\\____\\",
    "|_______________________|",
    `    (${wheel})           (${wheel})`,
  ]);
  text(g, 3, 21, "MOTION VECTOR >> >> >>   ROAD / SENSOR FEED");
  return raster(g);
}

function vehicleTelemetry(p) {
  const g = blank();
  const rpm = Math.round(4700 + 850 * Math.sin(p * 8));
  const speed = Math.round(96 + 14 * Math.sin(p * 5));
  text(g, 4, 3, "+-- VEHICLE TELEMETRY / SIMULATED FEED ----------------+");
  text(g, 4, 5, `|  RPM       ${String(rpm).padStart(4)}      CAN BUS   /  ONLINE`.padEnd(52) + "|");
  text(g, 4, 7, "|  BOOST     13.2 PSI     THROTTLE  /  67%".padEnd(52) + "|");
  text(g, 4, 9, `|  SPEED     ${String(speed).padStart(3)} MPH      GEAR      /  3`.padEnd(52) + "|");
  const load = "#".repeat(Math.max(2, Math.round(11 + Math.sin(p * 8) * 4))).padEnd(22, ".");
  text(g, 4, 11, (`|  LOAD  [${load}]`).padEnd(52) + "|");
  text(g, 4, 14, "|    SIGNAL TRACE / THROTTLE RESPONSE".padEnd(52) + "|");
  for (let x = 11; x < 53; x++) {
    const v = Math.sin(x / 3.2 - p * 12) * 1.5 + Math.sin(x / 6) * 1.6;
    glyph(g, x, Math.round(17 - v), v > 0 ? "/" : "\\");
  }
  text(g, 4, 20, "+--------------------------------------------------+");
  return raster(g);
}
function carFrame(p) {
  const drive = carDriving(clamp(p / 0.50));
  const telemetry = vehicleTelemetry(p);
  // Split the scene evenly between road-test imagery and telemetry.
  return dissolve(drive, telemetry, clamp((p - 0.40) / 0.20));
}

// Scene 3: ESP32 sends wireless control signal to a remote lamp receiver.
function bulbFrame(p) {
  const g = blank();
  const on = p >= 0.28;
  const glow = clamp((p - 0.28) / 0.55);
  text(g, 2, 1, "EMBEDDED CONTROL / ESP32         2.4GHz LINK / REMOTE LAMP");

  stamp(g, 2, 6, [
    "+--------------------+",
    "|  ESP32-WROOM       |",
    "|  [ Wi-Fi / MCU ]   |",
    `|  GPIO23 : ${on ? "HIGH " : "LOW  "}   |`,
    "|  TX    RX    GND   |",
    "+--------------------+",
  ]);
  text(g, 8, 14, on ? "TX: LAMP_ON" : "TX: IDLE");

  // Wireless link represented as expanding arcs and a travelling packet.
  const waveStage = Math.max(0, Math.ceil(glow * 3));
  if (on) {
    if (waveStage >= 1) {
      text(g, 24, 8, "))");
      text(g, 24, 10, "))");
    }
    if (waveStage >= 2) {
      text(g, 28, 7, "))) ");
      text(g, 28, 11, "))) ");
    }
    if (waveStage >= 3) {
      text(g, 33, 6, "))))");
      text(g, 33, 12, "))))");
    }
  } else {
    text(g, 24, 9, ". .");
    text(g, 29, 9, ". .");
    text(g, 34, 9, ". .");
  }
  const packetX = on ? 21 + Math.round(glow * 18) : 21;
  glyph(g, packetX, 9, on ? ">" : ".");

  // Receiver board and lamp: receiver is wired to the bulb; ESP32 is not.
  stamp(g, 40, 7, [
    "+----------+   +---+ ",
    "| RX NODE  |---|   | ",
    "| ANT  MCU |   |   | ",
    "+----------+   |   | ",
    "       |        +---+ ",
    "      GND         |   ",
  ]);
  // Better bulb shape centered above the receiver output.
  stamp(g, 49, 6, [
    "  .---.  ",
    ` /${on ? "#####" : "....."}\\ `,
    `| ${on ? "###" : "..."} | `,
    ` \\${on ? "###" : "..."}/ `,
    "  '---'  ",
    "   |_|   ",
  ]);

  if (on) {
    const rings = [
      [
        [53, 5, "|"], [53, 12, "|"], [47, 9, "-"], [59, 9, "-"],
        [49, 6, "\\"], [57, 6, "/"], [49, 12, "/"], [57, 12, "\\"],
      ],
      [
        [53, 4, "|"], [53, 13, "|"], [45, 9, "-"],
        [48, 5, "\\"], [58, 5, "/"], [48, 13, "/"], [58, 13, "\\"],
      ],
      [
        [53, 3, "|"], [53, 14, "|"], [43, 9, "-"],
        [47, 4, "\\"], [59, 4, "/"], [47, 14, "/"], [59, 14, "\\"],
      ],
    ];
    const visibleRings = Math.min(rings.length, Math.max(1, Math.ceil(glow * rings.length)));
    rings.slice(0, visibleRings).forEach((ring) => ring.forEach(([x, y, c]) => glyph(g, x, y, c)));
  }

  text(g, 40, 18, on ? "REMOTE LIGHT / LINK ACTIVE" : "REMOTE LIGHT / STANDBY");
  text(g, 2, 20, on ? "GPIO23 : 1  /  RF TX ACTIVE  /  RECEIVER ON" : "GPIO23 : 0  /  RF TX IDLE   /  RECEIVER WAIT");
  return raster(g);
}

const renderers = [satelliteFrame, carFrame, bulbFrame];

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
    <div className="archive-reel" role="region" aria-label="Animated ASCII illustrations of a CubeSat communications link, a vehicle test and telemetry display, and an ESP32 wireless lamp controller">
      <div className="archive-reel-top">
        <span><span className="archive-reel-indicator" aria-hidden="true" /> ASCII / PORTFOLIO.EXE</span>
        <span>SCENE {scenes[active].id} / 03</span>
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
      <div className="archive-reel-progress" style={{ gridTemplateColumns: `repeat(${scenes.length}, minmax(0, 1fr))` }} aria-hidden="true">
        {scenes.map((scene, i) => <span key={scene.id} className={i === active ? "is-active" : ""} />)}
      </div>
    </div>
  );
}
