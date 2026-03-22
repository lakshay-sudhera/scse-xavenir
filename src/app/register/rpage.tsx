"use client";

import { UserContext } from "@/context/UserContext";
import axios from "axios";
import React, { useContext, useEffect, useState } from "react";

export default function RegisterPage() {
    
  const [hovered, setHovered] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "auto";

    // Occasional glitch trigger
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 180);
    }, 4000);
    return () => clearInterval(iv);
  }, []);

  const handleGoogleSignup = async () => {
    const googleUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI}&response_type=code&scope=email%20profile&access_type=offline&prompt=consent`;
    window.location.href = googleUrl;
  };

  return (
    <div style={s.root}>
      {/* Animated grid background */}
      <div style={s.grid} />

      {/* Corner scan line */}
      <div style={s.scanH} />
      <div style={s.scanV} />

      {/* Vignette */}
      <div style={s.vignette} />

      {/* Floating hex blobs */}
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

      {/* Card */}
      <div style={s.card}>
        {/* Corner accents */}
        <span style={{ ...s.corner, top: -1, left: -1, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff" }} />
        <span style={{ ...s.corner, top: -1, right: -1, borderTop: "2px solid #ff0080", borderRight: "2px solid #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, left: -1, borderBottom: "2px solid #ff0080", borderLeft: "2px solid #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff" }} />

        {/* Top bar */}
        <div style={s.topBar}>
          <span style={s.dot} />
          <span style={{ ...s.dot, background: "#ff0080" }} />
          <span style={{ ...s.dot, background: "#bf00ff" }} />
          <span style={s.topBarLabel}>AUTH.SYS // SCSE</span>
        </div>

        <div style={s.body}>
          {/* Icon */}
          <div style={s.iconWrap}>
            <svg width="48" height="48" viewBox="0 0 48 48">
              <polygon points="24,3 43,13.5 43,34.5 24,45 5,34.5 5,13.5"
                fill="none" stroke="#00f5ff" strokeWidth="1.2"
                style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
              <text x="24" y="29" textAnchor="middle"
                fontFamily="'Orbitron',monospace" fontSize="12" fontWeight="900"
                fill="#00f5ff">ID</text>
            </svg>
          </div>

          {/* Tag */}
          <p style={s.tag}>// ACCESS_PORTAL</p>

          {/* Title */}
          <h1 style={{ ...s.title, ...(glitch ? s.titleGlitch : {}) }}>
            <span style={s.titleCyan}>AUTHENTICATE</span>
            <span style={s.titleWhite}>YOURSELF</span>
          </h1>

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>SECURE_CHANNEL</span>
            <div style={s.divLine} />
          </div>

          {/* Subtitle */}
          <p style={s.subtitle}>
            Use your{" "}
            <span style={{ color: "#00f5ff" }}>college email</span>{" "}
            to avail{" "}
            <span style={{ color: "#ffff00", textShadow: "0 0 8px rgba(255,255,0,0.5)" }}>
              extra discounts
            </span>.
          </p>

          {/* Google Button */}
          <button
            onClick={handleGoogleSignup}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
              ...s.btn,
              ...(hovered ? s.btnHover : {}),
            }}
          >
            <svg width="18" height="18" viewBox="0 0 20 20" style={{ flexShrink: 0 }}>
              <path d="M19.6 10.23c0-.68-.06-1.36-.18-2H10v3.79h5.39a4.6 4.6 0 01-2 3.02v2.5h3.24c1.9-1.75 2.97-4.32 2.97-7.31z" fill="#4285F4" />
              <path d="M10 20c2.7 0 4.96-.9 6.61-2.43l-3.24-2.51c-.9.6-2.04.96-3.37.96-2.6 0-4.8-1.75-5.59-4.1H1.06v2.6A10 10 0 0010 20z" fill="#34A853" />
              <path d="M4.41 11.92A6.02 6.02 0 014.09 10c0-.67.11-1.32.32-1.92V5.48H1.06A10 10 0 000 10c0 1.61.38 3.14 1.06 4.52l3.35-2.6z" fill="#FBBC05" />
              <path d="M10 3.98c1.47 0 2.79.5 3.83 1.5l2.87-2.87C14.95.99 12.69 0 10 0A10 10 0 001.06 5.48l3.35 2.6C5.2 5.73 7.4 3.98 10 3.98z" fill="#EA4335" />
            </svg>
            <span>{hovered ? "// CONNECTING..." : "CONTINUE WITH GOOGLE"}</span>
          </button>

          {/* Note */}
          <p style={s.note}>
            <span style={{ color: "#00f5ff" }}>🔒</span>&nbsp;
            Secured via Google OAuth 2.0
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');

        @keyframes gridMove {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes scanH {
          0%   { top: -2px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scanV {
          0%   { left: -2px; opacity: 0; }
          10%  { opacity: 1; }
          90%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes blobFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(30px,-20px) scale(1.08); }
        }
        @keyframes blobFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-20px,30px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(24px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 16px #00f5ff, 0 0 32px rgba(0,245,255,0.3); }
          50%     { text-shadow: 0 0 32px #00f5ff, 0 0 64px rgba(0,245,255,0.6); }
        }
        @keyframes hexSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes borderPulse {
          0%,100% { box-shadow: 0 0 18px rgba(0,245,255,0.08); }
          50%     { box-shadow: 0 0 36px rgba(0,245,255,0.18); }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#020010",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "2rem",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 8s linear infinite",
  },
  scanH: {
    position: "fixed", left: 0, right: 0,
    height: 1, background: "rgba(0,245,255,0.25)",
    boxShadow: "0 0 8px rgba(0,245,255,0.4)",
    animation: "scanH 6s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  scanV: {
    position: "fixed", top: 0, bottom: 0,
    width: 1, background: "rgba(255,0,128,0.15)",
    animation: "scanV 10s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  vignette: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 75% 75% at 50% 50%, transparent 45%, rgba(2,0,16,0.9) 100%)",
  },
  blob: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(80px)", zIndex: 0, pointerEvents: "none",
  },
  blob1: {
    width: 380, height: 380,
    background: "rgba(0,245,255,0.07)",
    top: "-10%", right: "-8%",
    animation: "blobFloat1 8s ease-in-out infinite",
  },
  blob2: {
    width: 300, height: 300,
    background: "rgba(191,0,255,0.07)",
    bottom: "-8%", left: "-6%",
    animation: "blobFloat2 10s ease-in-out infinite",
  },

  /* Card */
  card: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 420,
    background: "rgba(0,5,30,0.85)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.18)",
    backdropFilter: "blur(20px)",
    clipPath: "polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))",
    animation: "fadeUp 0.6s ease forwards, borderPulse 4s ease infinite",
  },
  corner: {
    position: "absolute", width: 16, height: 16,
  } as React.CSSProperties,
  topBar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "0.65rem 1.4rem",
    borderBottom: "1px solid rgba(0,245,255,0.1)",
    background: "rgba(0,0,20,0.5)",
  },
  dot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#00f5ff", boxShadow: "0 0 5px #00f5ff",
    display: "inline-block",
  },
  topBarLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.6rem", letterSpacing: 3,
    color: "rgba(0,245,255,0.4)", marginLeft: "auto",
  },

  body: {
    padding: "2rem 2.2rem 2.4rem",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "1rem",
  },
  iconWrap: {
    animation: "hexSpin 14s linear infinite",
    display: "flex",
  },
  tag: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.65rem", letterSpacing: 4,
    color: "#ff0080", textShadow: "0 0 8px #ff0080",
    alignSelf: "flex-start",
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontWeight: 900, width: "100%", lineHeight: 1.1,
    transition: "transform 0.1s",
  },
  titleGlitch: {
    transform: "skewX(-3deg)",
    filter: "brightness(1.4)",
  },
  titleCyan: {
    display: "block", fontSize: "2rem",
    color: "#00f5ff",
    animation: "glowPulse 3s ease infinite",
  },
  titleWhite: {
    display: "block", fontSize: "1.3rem",
    color: "rgba(220,230,255,0.9)", letterSpacing: 5,
  },
  divider: {
    display: "flex", alignItems: "center", gap: "0.7rem", width: "100%",
  },
  divLine: {
    flex: 1, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent)",
  },
  divText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.55rem", letterSpacing: 3,
    color: "rgba(0,245,255,0.35)", whiteSpace: "nowrap" as const,
  },
  subtitle: {
    fontSize: "0.98rem", lineHeight: 1.7,
    color: "rgba(180,200,255,0.68)", textAlign: "center" as const,
  },

  /* Button */
  btn: {
    display: "flex", alignItems: "center", justifyContent: "center",
    gap: "0.8rem",
    width: "100%", padding: "13px 24px",
    background: "rgba(0,245,255,0.08)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.35)",
    color: "#e0e8ff", cursor: "pointer",
    fontFamily: "'Orbitron', monospace",
    fontSize: "0.72rem", fontWeight: 700, letterSpacing: 2,
    textTransform: "uppercase" as const,
    clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
    transition: "all 0.22s ease",
  },
  btnHover: {
    background: "rgba(0,245,255,0.16)",
    borderColor: "#00f5ff",
    color: "#00f5ff",
    boxShadow: "0 0 24px rgba(0,245,255,0.25)",
    transform: "translateY(-2px)",
  },
  note: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.6rem", letterSpacing: 1,
    color: "rgba(180,200,255,0.35)", textAlign: "center" as const,
  },
};