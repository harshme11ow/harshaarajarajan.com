import { useCallback, useEffect, useRef, useState } from "react";

// ASCII model built from actual points in 3D space. No images, canvas rendering,
// WebGL or additional libraries; the displayed spacecraft consists of text.
const systems = {
  bus: {
    name: "CORE / BUS", index: "01", heading: "Structure, electronics, and control",
    copy: "The spacecraft bus holds the electronics and supports the rest of the system. Rotate the text model to inspect its different faces.",
  },
  power: {
    name: "SOLAR ARRAY", index: "02", heading: "Power, in plain text",
    copy: "The solar panels are drawn as ASCII grids and rendered from rotating 3D coordinates. Select a subsystem to highlight it.",
  },
  comms: {
    name: "COMMS / RF", index: "03", heading: "Maintaining the link",
    copy: "The antenna is a separate part of the model, just like the bus and panels. This is a concept illustration, not a specific flight design.",
  },
};

const points = [];
const put = (x, y, z, char, part, priority = 0) => {
  points.push({ x, y, z, char, part, priority });
};
function line(a, b, char, part, step = 0.07, priority = 0.1) {
  const length = Math.hypot(b[0] - a[0], b[1] - a[1], b[2] - a[2]);
  const count = Math.max(1, Math.ceil(length / step));
  for (let i = 0; i <= count; i++) {
    const t = i / count;
    put(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t,
      a[2] + (b[2] - a[2]) * t, char, part, priority);
  }
}

// Solar arrays: two shallow, gridded planes on either side of the bus.
for (const side of [-1, 1]) {
  const near = side * 1.45;
  const far = side * 4.75;
  for (let i = 0; i <= 30; i++) {
    for (let j = 0; j <= 18; j++) {
      const x = near + (far - near) * (i / 30);
      const y = -1.05 + 2.1 * (j / 18);
      const z = side * 0.08 + Math.abs(x) * 0.025;
      const border = i === 0 || i === 30 || j === 0 || j === 18;
      const seam = i % 6 === 0 || j % 6 === 0;
      put(x, y, z, border ? "#" : seam ? "+" : ":", "power", border ? 0.18 : 0);
    }
  }
  line([side * 0.84, 0, 0], [near, 0, 0], "=", "bus", 0.05, 0.3);
}

// Cube-shaped central bus, with visible shaded faces and reinforced edges.
for (let i = 0; i <= 20; i++) {
  for (let j = 0; j <= 22; j++) {
    const x = -0.85 + (i / 20) * 1.7;
    const y = -0.98 + (j / 22) * 1.96;
    const char = i % 5 === 0 || j % 5 === 0 ? "+" : "@";
    put(x, y, 0.85, char, "bus");
    put(x, y, -0.85, ":", "bus");
  }
}
for (const side of [-1, 1]) {
  for (let j = 0; j <= 22; j++) {
    for (let k = 0; k <= 14; k++) {
      const y = -0.98 + j * 1.96 / 22;
      const z = -0.85 + k * 1.7 / 14;
      put(side * 0.85, y, z, k % 4 === 0 ? "|" : "+", "bus");
    }
  }
  for (let i = 0; i <= 20; i++) {
    for (let k = 0; k <= 14; k++) {
      const x = -0.85 + i * 1.7 / 20;
      const z = -0.85 + k * 1.7 / 14;
      put(x, side * 0.98, z, i % 4 === 0 ? "=" : ".", "bus");
    }
  }
}
for (const x of [-0.85, 0.85]) {
  for (const y of [-0.98, 0.98]) {
    line([x, y, -0.85], [x, y, 0.85], "#", "bus", 0.055, 0.33);
  }
  for (const z of [-0.85, 0.85]) {
    line([x, -0.98, z], [x, 0.98, z], "#", "bus", 0.055, 0.33);
  }
}
for (const y of [-0.98, 0.98]) {
  for (const z of [-0.85, 0.85]) {
    line([-0.85, y, z], [0.85, y, z], "#", "bus", 0.055, 0.33);
  }
}

// Antenna stem, small rim, and receiver at the top of the bus.
line([0, 0.98, 0], [0, 2.10, 0], "|", "comms", 0.04, 0.45);
for (let i = 0; i < 80; i++) {
  const t = i / 80 * Math.PI * 2;
  put(Math.cos(t) * 0.43, 2.05 + Math.sin(t) * 0.13,
    Math.sin(t) * 0.25, "*", "comms", 0.5);
}
line([0, 2.09, 0], [0.27, 2.45, 0.08], "/", "comms", 0.045, 0.55);
put(0.27, 2.45, 0.08, "@", "comms", 0.6);

function renderAscii(cols, rows, yaw, pitch, selected) {
  const grid = Array.from({ length: rows }, () => Array(cols).fill(" "));
  const parts = Array.from({ length: rows }, () => Array(cols).fill("empty"));
  const depth = Array.from({ length: rows }, () => Array(cols).fill(-Infinity));
  const cy = Math.cos(yaw), sy = Math.sin(yaw);
  const cp = Math.cos(pitch), sp = Math.sin(pitch);
  const scaleX = cols / 11.4;
  const scaleY = rows / 6.7;

  // Sparse stars give the scene an archival computer-display feel.
  for (let n = 0; n < 16; n++) {
    const x = (n * 31 + 11) % cols;
    const y = (n * 13 + 3) % rows;
    grid[y][x] = n % 4 === 0 ? "+" : ".";
    parts[y][x] = "star";
  }

  for (const p of points) {
    const x1 = p.x * cy + p.z * sy;
    const z1 = -p.x * sy + p.z * cy;
    const y1 = p.y * cp - z1 * sp;
    const z2 = p.y * sp + z1 * cp;
    const x = Math.round(cols / 2 + x1 * scaleX);
    const y = Math.round(rows / 2 - y1 * scaleY);
    if (x < 0 || x >= cols || y < 0 || y >= rows) continue;
    const d = z2 + p.priority;
    if (d > depth[y][x]) {
      depth[y][x] = d;
      grid[y][x] = p.char;
      parts[y][x] = p.part === selected ? "selected" : "normal";
    }
  }

  // Adjacent characters of the same color are grouped into spans. This keeps
  // the DOM relatively small even as the ASCII model rotates.
  return grid.map((line, row) => {
    const segments = [];
    let currentPart = parts[row][0];
    let text = "";
    for (let col = 0; col < cols; col++) {
      if (parts[row][col] !== currentPart) {
        segments.push({ kind: currentPart, text });
        currentPart = parts[row][col];
        text = "";
      }
      text += line[col];
    }
    segments.push({ kind: currentPart, text });
    return segments;
  });
}

export default function SatelliteScene() {
  const [selected, setSelected] = useState("bus");
  const [paused, setPaused] = useState(false);
  const [screen, setScreen] = useState([]);
  const [angles, setAngles] = useState({ yaw: -0.78, pitch: 0.42 });
  const viewport = useRef(null);
  const ascii = useRef(null);
  const size = useRef({ cols: 70, rows: 27 });
  const drag = useRef(null);
  const angleRef = useRef({ yaw: -0.78, pitch: 0.42 });
  const selectedRef = useRef(selected);
  const pausedRef = useRef(paused);
  const reducedRef = useRef(false);

  selectedRef.current = selected;
  pausedRef.current = paused;

  const draw = useCallback(() => {
    setScreen(renderAscii(size.current.cols, size.current.rows,
      angleRef.current.yaw, angleRef.current.pitch, selectedRef.current));
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => { reducedRef.current = media.matches; };
    sync();
    media.addEventListener?.("change", sync);
    return () => media.removeEventListener?.("change", sync);
  }, []);

  useEffect(() => {
    const measure = () => {
      if (!viewport.current || !ascii.current) return;
      const style = getComputedStyle(ascii.current);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (ctx) ctx.font = style.font;
      const glyphWidth = ctx?.measureText("M").width || 7;
      const lineHeight = parseFloat(style.lineHeight) || 12;
      size.current = {
        cols: Math.max(32, Math.min(92, Math.floor((viewport.current.clientWidth - 20) / glyphWidth))),
        rows: Math.max(16, Math.min(34, Math.floor((viewport.current.clientHeight - 10) / lineHeight))),
      };
      draw();
    };
    measure();
    const observer = new ResizeObserver(measure);
    if (viewport.current) observer.observe(viewport.current);
    document.fonts?.ready?.then(measure).catch(() => {});
    return () => observer.disconnect();
  }, [draw]);

  useEffect(() => {
    draw();
  }, [selected, draw]);

  useEffect(() => {
    let raf;
    let last = 0;
    const tick = (now) => {
      if (now - last >= 75) {
        last = now;
        if (!pausedRef.current && !reducedRef.current && !drag.current && !document.hidden) {
          angleRef.current.yaw += 0.005;
          draw();
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [draw]);

  const rotate = (delta) => {
    angleRef.current.yaw += delta;
    setAngles({ ...angleRef.current });
    draw();
  };

  const begin = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY, ...angleRef.current };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (!drag.current) return;
    angleRef.current.yaw = drag.current.yaw + (e.clientX - drag.current.x) * 0.009;
    angleRef.current.pitch = Math.max(-0.72, Math.min(0.72,
      drag.current.pitch - (e.clientY - drag.current.y) * 0.008));
    draw();
  };
  const end = () => {
    if (drag.current) setAngles({ ...angleRef.current });
    drag.current = null;
  };
  const active = systems[selected];

  return (
    <div className="satellite-widget ascii-widget" aria-label="Interactive ASCII satellite explorer">
      <div className="satellite-topline">
        <span>TEXT MODEL / SAT_001</span>
        <span><span className="online-dot" /> 3D ASCII RENDER</span>
      </div>
      <div className="satellite-viewport ascii-viewport" ref={viewport}>
        <div className="space-grid" aria-hidden="true" />
        <div className="ascii-drag-area" role="group" tabIndex={0}
          aria-label="Rotate the ASCII satellite with drag or left and right arrow keys"
          onPointerDown={begin} onPointerMove={move} onPointerUp={end}
          onPointerCancel={end} onLostPointerCapture={end}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
              e.preventDefault();
              rotate(e.key === "ArrowLeft" ? -0.2 : 0.2);
            }
          }}
        >
          <pre className="ascii-scene" ref={ascii} aria-hidden="true">{screen.map((row, i) => (
            <span className="ascii-row" key={i}>{row.map((segment, j) => (
              <span key={j} className={`ascii-${segment.kind}`}>{segment.text}</span>
            ))}{"\n"}</span>
          ))}</pre>
        </div>
        <span className="space-coordinate top-left">OBJ_001 / LEO</span>
        <span className="space-coordinate bottom-right">DRAG / ARROW KEYS TO ROTATE</span>
      </div>
      <div className="satellite-controls">
        <div className="sat-part-picker" role="group" aria-label="Select a satellite subsystem">
          {Object.entries(systems).map(([key, item]) => (
            <button key={key} type="button" className={selected === key ? "active" : ""}
              onClick={() => setSelected(key)} aria-pressed={selected === key}>
              <span>{item.index}</span> {item.name}
            </button>
          ))}
        </div>
        <div className="sat-view-buttons">
          <button type="button" onClick={() => rotate(-0.25)} aria-label="Rotate satellite left">←</button>
          <button type="button" onClick={() => rotate(0.25)} aria-label="Rotate satellite right">→</button>
          <button type="button" onClick={() => setPaused((v) => !v)}
            aria-label={paused ? "Resume automatic rotation" : "Pause automatic rotation"}>
            {paused ? "▶" : "Ⅱ"}
          </button>
        </div>
      </div>
      <div className="satellite-readout" aria-live="polite">
        <div>
          <span className="eyebrow">SELECTED / {active.index}</span>
          <h3>{active.heading}</h3>
        </div>
        <p>{active.copy}</p>
      </div>
      <p className="satellite-disclaimer">ASCII projection from 3D points, not a model of any specific spacecraft. Yaw: {Math.round(angles.yaw * 180 / Math.PI)}°.</p>
    </div>
  );
}
