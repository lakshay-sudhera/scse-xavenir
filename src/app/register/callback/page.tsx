"use client";

import React, { useEffect, useState, useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import axios from "axios";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Handshaking with auth server...");
  const [phase, setPhase] = useState<"loading" | "success" | "error">("loading");
  const { setUserData } = useContext(UserContext);

 useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  if (!code) {
    setStatus("Unable to extract auth code from URL.");
    setPhase("error");
    return;
  }

  const fetchData = async () => {
    try {
      setStatus("Exchanging code with server...");

      const res = await axios.get(`/api/auth/google?code=${code}`);

     if (!res.data?.user) {
      throw new Error("Invalid response from server");
    }
      setUserData(res.data.user);
      setStatus("Authentication successful!");
      setPhase("success");

      setTimeout(() => {
        router.push("/dashboard"); 
      }, 1500);

    } catch (err) {
      setStatus("Authentication failed. Please try again.");
      setPhase("error");
    }
  };

    // const fetchData = async () => {
    //   try {
    //     await fetch(`/api/auth/google?code=${code}`);
    //   } catch {
    //     setStatus("Network error. Connection lost.");
    //     setPhase("error");
    //   }
    // };

    // fetchData();
  }, [router]);

  const accentColor =
    phase === "success" ? "#00ff88" :
    phase === "error"   ? "#ff0080" :
    "#00f5ff";

  return (
    <div style={s.root}>
      {/* Grid */}
      <div style={s.grid} />
      {/* Scan line */}
      <div style={{ ...s.scan, background: `${accentColor}22`, boxShadow: `0 0 8px ${accentColor}44` }} />
      {/* Vignette */}
      <div style={s.vignette} />

      {/* Glow blob */}
      <div style={{
        ...s.blob,
        background: `radial-gradient(circle, ${accentColor}18 0%, transparent 70%)`,
      }} />

      {/* Card */}
      <div style={{ ...s.card, borderColor: `${accentColor}30` }}>
        {/* Corner accents */}
        <span style={{ ...s.corner, top: -1, left: -1, borderTop: `2px solid ${accentColor}`, borderLeft: `2px solid ${accentColor}`, boxShadow: `-2px -2px 10px ${accentColor}` }} />
        <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: `2px solid ${accentColor}`, borderRight: `2px solid ${accentColor}`, boxShadow: `2px 2px 10px ${accentColor}` }} />

        {/* Top bar */}
        <div style={s.topBar}>
          <span style={{ ...s.dot, background: accentColor, boxShadow: `0 0 6px ${accentColor}` }} />
          <span style={{ ...s.topBarLabel, color: `${accentColor}66` }}>GOOGLE_AUTH.CALLBACK</span>
        </div>

        <div style={s.body}>
          {/* Animated orb */}
          <div style={{ ...s.orb, borderColor: `${accentColor}40`, boxShadow: `0 0 30px ${accentColor}20` }}>
            <div style={{ ...s.orbInner, background: `${accentColor}18` }} />
            {phase === "loading" && <div style={{ ...s.orbRing, borderTopColor: accentColor }} />}
            {phase === "success" && (
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute" }}>
                <polyline points="6,18 14,26 30,10" fill="none"
                  stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }} />
              </svg>
            )}
            {phase === "error" && (
              <svg width="32" height="32" viewBox="0 0 32 32" style={{ position: "absolute" }}>
                <line x1="8" y1="8" x2="24" y2="24" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }} />
                <line x1="24" y1="8" x2="8" y2="24" stroke={accentColor} strokeWidth="2.5" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 6px ${accentColor})` }} />
              </svg>
            )}
          </div>

          {/* Title */}
          <h1 style={{ ...s.title, color: accentColor, textShadow: `0 0 20px ${accentColor}66` }}>
            {phase === "loading" ? "AUTHENTICATING" : phase === "success" ? "ACCESS GRANTED" : "AUTH FAILED"}
          </h1>

          {/* Status */}
          <p style={s.status}>{status}</p>

          {/* Progress bar */}
          {phase === "loading" && (
            <div style={s.barWrap}>
              <div style={{ ...s.bar, background: `linear-gradient(90deg, ${accentColor}, #bf00ff)`, boxShadow: `0 0 10px ${accentColor}` }} />
            </div>
          )}

          {/* Done state hint */}
          {phase !== "loading" && (
            <p style={{ ...s.hint, color: `${accentColor}80` }}>
              {phase === "success" ? "// Redirecting to credentials setup..." : "// Please try again or contact support."}
            </p>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');

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
        @keyframes orbSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes barSlide {
          0%   { transform: translateX(-100%); }
          50%  { transform: translateX(0); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes blobPulse {
          0%,100% { transform: scale(1); opacity: 0.7; }
          50%     { transform: scale(1.1); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh",
    background: "#020010",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative", overflow: "hidden",
    padding: "2rem",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(0,245,255,0.035) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.035) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 10s linear infinite",
  },
  scan: {
    position: "fixed", left: 0, right: 0, height: 1,
    animation: "scanDrop 5s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  vignette: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(2,0,16,0.92) 100%)",
  },
  blob: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    animation: "blobPulse 4s ease-in-out infinite",
  },
  card: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 400,
    background: "rgba(0,5,30,0.88)",
    borderWidth: "1px", borderStyle: "solid",
    backdropFilter: "blur(20px)",
    clipPath: "polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))",
    animation: "fadeUp 0.6s ease forwards",
  },
  corner: { position: "absolute", width: 16, height: 16 } as React.CSSProperties,
  topBar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "0.6rem 1.4rem",
    borderBottom: "1px solid rgba(0,245,255,0.08)",
    background: "rgba(0,0,20,0.5)",
  },
  dot: { width: 7, height: 7, borderRadius: "50%", display: "inline-block" },
  topBarLabel: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.58rem", letterSpacing: 3, marginLeft: "auto",
  },
  body: {
    padding: "2.2rem 2rem 2.5rem",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "1.2rem",
  },
  orb: {
    width: 90, height: 90, borderRadius: "50%",
    borderWidth: 1, borderStyle: "solid",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
    transition: "box-shadow 0.4s",
  },
  orbInner: {
    position: "absolute", inset: 8, borderRadius: "50%",
  },
  orbRing: {
    position: "absolute", inset: -4,
    borderRadius: "50%",
    borderWidth: 2, borderStyle: "solid", borderColor: "transparent",
    animation: "orbSpin 1.2s linear infinite",
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontSize: "1.7rem", fontWeight: 900,
    letterSpacing: 3, textAlign: "center" as const,
    transition: "color 0.4s, text-shadow 0.4s",
  },
  status: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.82rem", letterSpacing: 1,
    color: "rgba(180,200,255,0.65)",
    textAlign: "center" as const, lineHeight: 1.6,
  },
  barWrap: {
    width: "100%", height: 2,
    background: "rgba(255,255,255,0.06)",
    overflow: "hidden",
  },
  bar: {
    height: "100%", width: "60%",
    animation: "barSlide 1.8s ease-in-out infinite",
  },
  hint: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.65rem", letterSpacing: 2,
    textAlign: "center" as const,
  },
};