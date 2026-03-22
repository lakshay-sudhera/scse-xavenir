"use client";

import React, { useEffect, useState } from "react";

const BOOT_LINES = [
  "Initializing secure channel...",
  "Encrypting data stream...",
  "Establishing connection...",
  "Verifying identity matrix...",
];

function Loading() {
  const [bootStep, setBootStep] = useState(0);
  const [dots, setDots] = useState("");

  // Cycle through boot lines
  useEffect(() => {
    const iv = setInterval(() => {
      setBootStep((p) => (p + 1) % BOOT_LINES.length);
    }, 900);
    return () => clearInterval(iv);
  }, []);

  // Animated dots
  useEffect(() => {
    const iv = setInterval(() => {
      setDots((p) => (p.length >= 3 ? "" : p + "."));
    }, 400);
    return () => clearInterval(iv);
  }, []);

  return (
    <div style={s.root}>
      {/* Grid */}
      <div style={s.grid} />
      {/* Scan line */}
      <div style={s.scan} />
      {/* Vignette */}
      <div style={s.vignette} />
      {/* Glow blobs */}
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

      {/* Main content */}
      <div style={s.center}>
        {/* Spinning hex rings */}
        <div style={s.orbWrap}>
          {/* Outer ring */}
          <div style={s.ring1} />
          {/* Middle ring */}
          <div style={s.ring2} />
          {/* Inner hex */}
          <div style={s.hexCore}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <polygon
                points="26,3 47,15 47,37 26,49 5,37 5,15"
                fill="none"
                stroke="#00f5ff"
                strokeWidth="1.2"
                style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }}
              />
              <polygon
                points="26,10 41,18.5 41,33.5 26,42 11,33.5 11,18.5"
                fill="none"
                stroke="rgba(0,245,255,0.3)"
                strokeWidth="0.7"
              />
            </svg>
          </div>
          {/* Orbiting dot */}
          <div style={s.orbitTrack}>
            <div style={s.orbitDot} />
          </div>
          {/* Orbiting dot 2 (offset) */}
          <div style={s.orbitTrack2}>
            <div style={s.orbitDot2} />
          </div>
        </div>

        {/* Title */}
        <h2 style={s.title}>
          <span style={s.titleCyan}>LOADING</span>
          <span style={s.titleDots}>{dots}</span>
        </h2>

        {/* Boot line */}
        <p style={s.bootLine}>
          <span style={s.prefix}>&gt;&nbsp;</span>
          {BOOT_LINES[bootStep]}
        </p>

        {/* Progress bar */}
        <div style={s.barOuter}>
          <div style={s.barInner} />
          {/* Glow sweep */}
          <div style={s.barGlow} />
        </div>

        {/* Status row */}
        <div style={s.statusRow}>
          <span style={s.statusDot} />
          <span style={s.statusText}>SCSE_SYS // SECURE_CHANNEL_ACTIVE</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&display=swap');

        @keyframes gridMove {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes scanDrop {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes blobFloat1 {
          0%,100% { transform: scale(1) translate(0,0); }
          50%     { transform: scale(1.1) translate(20px,-15px); }
        }
        @keyframes blobFloat2 {
          0%,100% { transform: scale(1) translate(0,0); }
          50%     { transform: scale(1.08) translate(-15px,18px); }
        }
        @keyframes spin1 {
          to { transform: rotate(360deg); }
        }
        @keyframes spin2 {
          to { transform: rotate(-360deg); }
        }
        @keyframes hexPulse {
          0%,100% { opacity: 0.8; filter: drop-shadow(0 0 6px #00f5ff); }
          50%     { opacity: 1;   filter: drop-shadow(0 0 14px #00f5ff); }
        }
        @keyframes orbit1 {
          to { transform: rotate(360deg); }
        }
        @keyframes orbit2 {
          to { transform: rotate(-360deg); }
        }
        @keyframes barSlide {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 14px #00f5ff, 0 0 28px rgba(0,245,255,0.3); }
          50%     { text-shadow: 0 0 26px #00f5ff, 0 0 52px rgba(0,245,255,0.55); }
        }
        @keyframes bootFade {
          from { opacity: 0; transform: translateX(-6px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes dotBlink {
          0%,100% { opacity: 1; box-shadow: 0 0 6px #00ff88; }
          50%     { opacity: 0.3; box-shadow: none; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

export default Loading;

/* ── STYLES ── */
const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#020010",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Share Tech Mono', monospace",
    position: "relative", overflow: "hidden",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 8s linear infinite",
  },
  scan: {
    position: "fixed", left: 0, right: 0, height: 1,
    background: "rgba(0,245,255,0.22)",
    boxShadow: "0 0 8px rgba(0,245,255,0.35)",
    animation: "scanDrop 5s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  vignette: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 40%, rgba(2,0,16,0.92) 100%)",
  },
  blob: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(90px)", zIndex: 0, pointerEvents: "none",
  },
  blob1: {
    width: 400, height: 400,
    background: "rgba(0,245,255,0.065)",
    top: "-15%", right: "-12%",
    animation: "blobFloat1 9s ease-in-out infinite",
  },
  blob2: {
    width: 300, height: 300,
    background: "rgba(191,0,255,0.065)",
    bottom: "-12%", left: "-10%",
    animation: "blobFloat2 11s ease-in-out infinite",
  },

  /* Center content */
  center: {
    position: "relative", zIndex: 10,
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "1.4rem",
    animation: "fadeUp 0.6s ease forwards",
  },

  /* Orb */
  orbWrap: {
    position: "relative",
    width: 140, height: 140,
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  ring1: {
    position: "absolute",
    width: 140, height: 140,
    borderRadius: "50%",
    borderWidth: 1, borderStyle: "solid",
    borderColor: "rgba(0,245,255,0.35)",
    boxShadow: "0 0 16px rgba(0,245,255,0.15), inset 0 0 16px rgba(0,245,255,0.05)",
    animation: "spin1 4s linear infinite",
    // dashed via background trick
    background:
      "conic-gradient(rgba(0,245,255,0.5) 0deg, transparent 30deg, rgba(0,245,255,0.5) 60deg, transparent 90deg, rgba(0,245,255,0.5) 120deg, transparent 150deg, rgba(0,245,255,0.5) 180deg, transparent 210deg, rgba(0,245,255,0.5) 240deg, transparent 270deg, rgba(0,245,255,0.5) 300deg, transparent 330deg)",
    WebkitMask: "radial-gradient(transparent 64px, #000 65px)",
  },
  ring2: {
    position: "absolute",
    width: 106, height: 106,
    borderRadius: "50%",
    borderWidth: 1, borderStyle: "solid",
    borderColor: "rgba(255,0,128,0.3)",
    animation: "spin2 3s linear infinite",
    background:
      "conic-gradient(rgba(255,0,128,0.4) 0deg, transparent 45deg, rgba(255,0,128,0.4) 90deg, transparent 135deg, rgba(255,0,128,0.4) 180deg, transparent 225deg, rgba(255,0,128,0.4) 270deg, transparent 315deg)",
    WebkitMask: "radial-gradient(transparent 47px, #000 48px)",
  },
  hexCore: {
    position: "absolute",
    animation: "hexPulse 2s ease-in-out infinite",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  orbitTrack: {
    position: "absolute",
    width: 140, height: 140,
    borderRadius: "50%",
    animation: "orbit1 2.2s linear infinite",
  },
  orbitDot: {
    position: "absolute",
    width: 8, height: 8, borderRadius: "50%",
    background: "#00f5ff",
    boxShadow: "0 0 10px #00f5ff, 0 0 20px rgba(0,245,255,0.5)",
    top: -4, left: "50%",
    transform: "translateX(-50%)",
  },
  orbitTrack2: {
    position: "absolute",
    width: 106, height: 106,
    borderRadius: "50%",
    animation: "orbit2 1.6s linear infinite",
  },
  orbitDot2: {
    position: "absolute",
    width: 6, height: 6, borderRadius: "50%",
    background: "#ff0080",
    boxShadow: "0 0 8px #ff0080, 0 0 16px rgba(255,0,128,0.5)",
    bottom: -3, left: "50%",
    transform: "translateX(-50%)",
  },

  /* Title */
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "1.8rem", fontWeight: 900,
    letterSpacing: 6,
    display: "flex", alignItems: "baseline", gap: "2px",
  },
  titleCyan: {
    color: "#00f5ff",
    animation: "glowPulse 2s ease-in-out infinite",
  },
  titleDots: {
    color: "#00f5ff",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "1.6rem",
    minWidth: "2rem",
    display: "inline-block",
    textShadow: "0 0 12px #00f5ff",
  },

  /* Boot line */
  bootLine: {
    fontSize: "0.75rem", letterSpacing: 2,
    color: "rgba(180,200,255,0.6)",
    display: "flex", alignItems: "center",
    animation: "bootFade 0.3s ease forwards",
    minHeight: "1.4rem",
  },
  prefix: { color: "rgba(0,245,255,0.4)" },

  /* Progress bar */
  barOuter: {
    width: 280, height: 2,
    background: "rgba(0,245,255,0.08)",
    position: "relative", overflow: "hidden",
  },
  barInner: {
    position: "absolute", inset: 0,
    background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.15), transparent)",
  },
  barGlow: {
    position: "absolute",
    top: 0, bottom: 0, width: "40%",
    background: "linear-gradient(90deg, transparent, #00f5ff, rgba(191,0,255,0.8), transparent)",
    boxShadow: "0 0 12px #00f5ff",
    animation: "barSlide 1.6s ease-in-out infinite",
  },

  /* Status row */
  statusRow: {
    display: "flex", alignItems: "center", gap: "8px",
    marginTop: "0.2rem",
  },
  statusDot: {
    width: 6, height: 6, borderRadius: "50%",
    background: "#00ff88",
    animation: "dotBlink 1.2s ease-in-out infinite",
    display: "inline-block",
  },
  statusText: {
    fontSize: "0.58rem", letterSpacing: 3,
    color: "rgba(0,255,136,0.5)",
    textTransform: "uppercase" as const,
  },
};