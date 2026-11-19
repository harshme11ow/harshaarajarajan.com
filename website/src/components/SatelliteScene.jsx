import { useRef, useState } from "react";

const systems = {
  bus: {
    name: "CORE / BUS", index: "01", heading: "The structure behind the system",
    copy: "The central bus houses the electronics and supports the rest of the spacecraft. Select another subsystem to explore the illustration.",
  },
  power: {
    name: "SOLAR ARRAY", index: "02", heading: "Collecting the energy",
    copy: "Solar panels make power available to a spacecraft. Their geometry, deployment, and interfaces matter long before launch.",
  },
  comms: {
    name: "COMMS / RF", index: "03", heading: "Staying in touch",
    copy: "Radio hardware links the spacecraft with the ground. Antennas and electronics must work as part of a tightly integrated system.",
  },
};

export default function SatelliteScene() {
  const [selected, setSelected] = useState("bus");
  const [rotation, setRotation] = useState(-7);
  const [tilt, setTilt] = useState(5);
  const [paused, setPaused] = useState(false);
  const drag = useRef(null);
  const active = systems[selected];

  const beginDrag = (event) => {
    if (event.button !== 0) return;
    drag.current = { x: event.clientX, y: event.clientY, rotation, tilt };
    event.currentTarget.setPointerCapture(event.pointerId);
  };
  const moveDrag = (event) => {
    if (!drag.current) return;
    setRotation(Math.max(-42, Math.min(42, drag.current.rotation + (event.clientX - drag.current.x) * 0.16)));
    setTilt(Math.max(-22, Math.min(22, drag.current.tilt - (event.clientY - drag.current.y) * 0.12)));
  };
  const stopDrag = () => { drag.current = null; };

  return (
    <div className="satellite-widget" aria-label="Interactive satellite model explorer">
      <div className="satellite-topline">
        <span>INTERACTIVE SPECIMEN / SAT_001</span>
        <span><span className="online-dot"/> LIVE MODEL</span>
      </div>
      <div className="satellite-viewport">
        <div className="space-grid" aria-hidden="true" />
        <div className="orbit-rings" aria-hidden="true"><i/><i/><i/></div>
        <div
          className={`satellite-drag-area ${paused ? "is-paused" : ""}`}
          onPointerDown={beginDrag}
          onPointerMove={moveDrag}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          style={{ touchAction: "none" }}
          title="Drag the satellite to change its viewing angle"
        >
          <div className="satellite-tilt" style={{ transform: `perspective(850px) rotateY(${rotation}deg) rotateX(${tilt}deg)` }}>
            <svg viewBox="0 0 700 440" role="img" aria-label="Stylized isometric satellite with two solar panels, equipment bus, and antenna">
              <defs>
                <linearGradient id="bus-a" x1="0" x2="1" y1="0" y2="1"><stop stopColor="#d8eaf0"/><stop offset="1" stopColor="#638ba5"/></linearGradient>
                <linearGradient id="bus-b" x1="0" x2="1"><stop stopColor="#183d58"/><stop offset="1" stopColor="#3e7895"/></linearGradient>
                <linearGradient id="solar" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#245c85"/><stop offset="0.6" stopColor="#0b2e4e"/><stop offset="1" stopColor="#164764"/></linearGradient>
                <pattern id="cells" width="23" height="27" patternUnits="userSpaceOnUse"><rect width="23" height="27" fill="transparent"/><path d="M1 0 V27 M0 1 H23" stroke="#8ac3d6" strokeOpacity=".55" strokeWidth="1"/><rect x="4" y="4" width="15" height="20" fill="#7cb5ce" opacity=".10"/></pattern>
                <filter id="shine"><feGaussianBlur stdDeviation="4"/></filter>
              </defs>
              {/* slim solar arm */}
              <path d="M301 214 L94 174 M398 218 L608 162" stroke="#bbd9e6" strokeWidth="10" strokeLinecap="round"/>
              {/* left solar array */}
              <g transform="translate(34 104)"><polygon points="0,18 252,65 252,232 0,182" fill="#071923" stroke="#a7d3e5" strokeWidth="5"/><polygon points="6,23 246,68 246,226 6,178" fill="url(#solar)"/><polygon points="6,23 246,68 246,226 6,178" fill="url(#cells)"/><path d="M86 38 V194 M167 53 V211" stroke="#b9d6df" opacity=".65" strokeWidth="3"/></g>
              {/* right solar array */}
              <g transform="translate(444 93)"><polygon points="0,63 224,5 224,169 0,231" fill="#071923" stroke="#a7d3e5" strokeWidth="5"/><polygon points="6,68 218,13 218,164 6,224" fill="url(#solar)"/><polygon points="6,68 218,13 218,164 6,224" fill="url(#cells)"/><path d="M78 49 V203 M153 31 V184" stroke="#b9d6df" opacity=".65" strokeWidth="3"/></g>
              {/* body shadow */}
              <path d="M300 157 L389 136 L438 180 L351 205 Z" fill="#9ac9db" opacity=".15" filter="url(#shine)"/>
              {/* central electronics bus */}
              <polygon points="305,151 387,131 433,171 347,194" fill="url(#bus-a)" stroke="#d7ebef" strokeWidth="4"/>
              <polygon points="305,151 347,194 347,301 305,257" fill="#3f7793" stroke="#b9d4e1" strokeWidth="4"/>
              <polygon points="347,194 433,171 433,270 347,301" fill="url(#bus-b)" stroke="#b9d4e1" strokeWidth="4"/>
              <polygon points="358,205 421,189 421,260 358,281" fill="#10314a" stroke="#86aec2" strokeWidth="2"/>
              <path d="M366 215 L412 203 M366 233 L412 222 M366 251 L412 241" stroke="#71a5ba" strokeWidth="2" opacity=".9"/>
              <circle cx="397" cy="261" r="5" fill="#b3e9e5"/>
              <path d="M314 174 L339 198 L339 277 L314 250 Z" fill="#27506b" stroke="#85b5ca" strokeWidth="2"/>
              <path d="M319 190 L333 203 M319 207 L333 220 M319 224 L333 237" stroke="#badde7" opacity=".6"/>
              {/* antenna */}
              <path d="M376 140 L373 95" stroke="#d5e9ee" strokeWidth="5"/><path d="M351 82 Q374 107 397 78 Q377 65 351 82" stroke="#94c9d9" fill="#1e536f" strokeWidth="3"/><path d="M372 78 L393 51" stroke="#e4eff0" strokeWidth="3"/><circle cx="395" cy="49" r="5" fill="#d9eff1"/>
              {/* indicator LEDs */}
              <circle cx="320" cy="173" r="3" fill="#a6ecdf"/><circle cx="325" cy="176" r="2" fill="#c5dfef"/>
            </svg>
          </div>
        </div>
        <span className="space-coordinate top-left">OBJ_001 / LEO</span>
        <span className="space-coordinate bottom-right">DRAG TO INSPECT ↗</span>
      </div>
      <div className="satellite-controls">
        <div className="sat-part-picker" role="group" aria-label="Satellite subsystem selection">
          {Object.entries(systems).map(([key, item]) => (
            <button key={key} type="button" className={selected === key ? "active" : ""}
              onClick={() => setSelected(key)} aria-pressed={selected === key}>
              <span>{item.index}</span> {item.name}
            </button>
          ))}
        </div>
        <div className="sat-view-buttons">
          <button type="button" onClick={() => setRotation((v) => Math.max(-42, v - 12))} aria-label="Rotate satellite left">←</button>
          <button type="button" onClick={() => setRotation((v) => Math.min(42, v + 12))} aria-label="Rotate satellite right">→</button>
          <button type="button" onClick={() => setPaused((v) => !v)} aria-label={paused ? "Resume floating animation" : "Pause floating animation"}>{paused ? "▶" : "Ⅱ"}</button>
        </div>
      </div>
      <div className="satellite-readout" aria-live="polite">
        <div><span className="eyebrow">SELECTED / {active.index}</span><h3>{active.heading}</h3></div>
        <p>{active.copy}</p>
      </div>
      <p className="satellite-disclaimer">Concept illustration — not a model of any specific UGA spacecraft.</p>
    </div>
  );
}
