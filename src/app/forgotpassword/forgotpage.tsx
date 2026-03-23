"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div style={s.root}>
      {/* Background */}
      <div style={s.grid} />
      <div style={s.scanH} />
      <div style={s.scanV} />
      <div style={s.vignette} />
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

      {/* Card */}
      <div style={s.card}>
        {/* Corner accents */}
        <span style={{ ...s.corner, top: -1, left: -1, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff", boxShadow: "-2px -2px 12px #00f5ff" }} />
        <span style={{ ...s.corner, top: -1, right: -1, borderTop: "2px solid #ff0080", borderRight: "2px solid #ff0080", boxShadow: "2px -2px 12px #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, left: -1, borderBottom: "2px solid #ff0080", borderLeft: "2px solid #ff0080", boxShadow: "-2px 2px 12px #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff", boxShadow: "2px 2px 12px #00f5ff" }} />

        {/* Top bar */}
        <div style={s.topBar}>
          <span style={s.dot} />
          <span style={{ ...s.dot, background: "#ff0080", boxShadow: "0 0 5px #ff0080" }} />
          <span style={{ ...s.dot, background: "#bf00ff", boxShadow: "0 0 5px #bf00ff" }} />
          <span style={s.topBarLabel}>SCSE_AUTH.PWD_RECOVERY</span>
        </div>

        <div style={s.body}>

          {/* Success state */}
          {submitted ? (
            <>
              {/* Success icon */}
              <div style={s.successOrb}>
                <div style={s.successOrbInner} />
                <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute" }}>
                  <polyline points="6,18 14,26 30,10" fill="none"
                    stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px #00ff88)" }} />
                </svg>
              </div>

              <p style={s.tag}>// TRANSMISSION_SENT</p>

              <h1 style={s.title}>
                <span style={s.titleGreen}>LINK SENT</span>
                <span style={s.titleWhite}>CHECK INBOX</span>
              </h1>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>STATUS_OK</span>
                <div style={s.divLine} />
              </div>

              <p style={s.successMsg}>
                If an account with that email exists, a reset link has been dispatched.
                Check your inbox{" "}
                <span style={{ color: "#00f5ff" }}>(and spam folder)</span>.
              </p>

              <Link href="/login" style={s.backLink}>
                &lt;&lt; RETURN_TO_LOGIN
              </Link>
            </>
          ) : (
            <>
              {/* Icon */}
              <div style={s.iconWrap}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <polygon points="26,3 47,15 47,37 26,49 5,37 5,15"
                    fill="none" stroke="#00f5ff" strokeWidth="1.2"
                    style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
                  <polygon points="26,10 41,18.5 41,35.5 26,44 11,35.5 11,18.5"
                    fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.7" />
                  <text x="26" y="29" textAnchor="middle"
                    fontFamily="'Orbitron',monospace" fontSize="10" fontWeight="900"
                    fill="#00f5ff" style={{ filter: "drop-shadow(0 0 5px #00f5ff)" }}>
                    PWD
                  </text>
                </svg>
              </div>

              <p style={s.tag}>// PWD_RECOVERY</p>

              <h1 style={s.title}>
                <span style={s.titleCyan}>FORGOT</span>
                <span style={s.titleWhite}>PASSWORD</span>
              </h1>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>IDENTITY_RECOVERY</span>
                <div style={s.divLine} />
              </div>

              <p style={s.subtitle}>
                Enter your registered email and we&apos;ll dispatch a{" "}
                <span style={{ color: "#00f5ff" }}>password reset link</span>.
              </p>

              {/* Form */}
              <form onSubmit={handleSubmit} style={s.form}>
                <div style={s.fieldWrap}>
                  <label style={{
                    ...s.label,
                    color: focused ? "#00f5ff" : "rgba(0,245,255,0.55)",
                    textShadow: focused ? "0 0 8px #00f5ff" : "none",
                  }}>
                    EMAIL_ADDRESS
                  </label>
                  <div style={{
                    ...s.inputWrap,
                    borderColor: focused ? "#00f5ff" : "rgba(0,245,255,0.18)",
                    boxShadow: focused ? "0 0 16px rgba(0,245,255,0.18)" : "none",
                  }}>
                    <span style={{ ...s.inputPrefix, color: focused ? "#00f5ff" : "rgba(0,245,255,0.35)" }}>
                      ✉
                    </span>
                    <input
                      type="email"
                      placeholder="user@college.edu"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onFocus={() => setFocused(true)}
                      onBlur={() => setFocused(false)}
                      style={s.input}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  onMouseEnter={() => setHovered(true)}
                  onMouseLeave={() => setHovered(false)}
                  style={{
                    ...s.submitBtn,
                    ...(hovered && !loading ? s.submitBtnHover : {}),
                    ...(loading ? s.submitBtnLoading : {}),
                  }}
                >
                  {loading ? (
                    <span style={s.loadingInner}>
                      <span style={s.spinner} />
                      TRANSMITTING...
                    </span>
                  ) : (
                    hovered ? "// DISPATCHING LINK..." : "SEND RESET LINK"
                  )}
                </button>
              </form>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>OR</span>
                <div style={s.divLine} />
              </div>

              <Link href="/login" style={s.backLink}>
                &lt;&lt; RETURN_TO_LOGIN
              </Link>
            </>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes gridMove    { from{background-position:0 0} to{background-position:60px 60px} }
        @keyframes scanH       { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes scanV       { 0%{left:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{left:100%;opacity:0} }
        @keyframes blobFloat1  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.07)} }
        @keyframes blobFloat2  { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.05)} }
        @keyframes fadeUp      { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse   { 0%,100%{text-shadow:0 0 16px #00f5ff,0 0 30px rgba(0,245,255,0.3)} 50%{text-shadow:0 0 28px #00f5ff,0 0 55px rgba(0,245,255,0.55)} }
        @keyframes greenPulse  { 0%,100%{text-shadow:0 0 16px #00ff88,0 0 30px rgba(0,255,136,0.3)} 50%{text-shadow:0 0 28px #00ff88,0 0 55px rgba(0,255,136,0.55)} }
        @keyframes hexSpin     { to{transform:rotate(360deg)} }
        @keyframes borderPulse { 0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.07)} 50%{box-shadow:0 0 40px rgba(0,245,255,0.16)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes successPop  { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0px 1000px #00050f inset !important;
          -webkit-text-fill-color:#e0e8ff !important; caret-color:#00f5ff;
        }
        input::placeholder { color:rgba(180,200,255,0.22); }
        input:focus { outline:none; }
        button { border:none; }
        a { text-decoration:none; }
      `}</style>
    </div>
  );
}

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh", background: "#020010",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative", overflow: "hidden", padding: "2rem",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px", animation: "gridMove 8s linear infinite",
  },
  scanH: { position: "fixed", left: 0, right: 0, height: 1, background: "rgba(0,245,255,0.2)", boxShadow: "0 0 8px rgba(0,245,255,0.35)", animation: "scanH 7s linear infinite", zIndex: 1, pointerEvents: "none" },
  scanV: { position: "fixed", top: 0, bottom: 0, width: 1, background: "rgba(255,0,128,0.12)", animation: "scanV 11s linear infinite", zIndex: 1, pointerEvents: "none" },
  vignette: { position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 78% 78% at 50% 50%, transparent 42%, rgba(2,0,16,0.92) 100%)" },
  blob: { position: "absolute", borderRadius: "50%", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" },
  blob1: { width: 360, height: 360, background: "rgba(0,245,255,0.065)", top: "-12%", right: "-10%", animation: "blobFloat1 9s ease-in-out infinite" },
  blob2: { width: 280, height: 280, background: "rgba(191,0,255,0.065)", bottom: "-10%", left: "-8%", animation: "blobFloat2 11s ease-in-out infinite" },

  card: {
    position: "relative", zIndex: 10, width: "100%", maxWidth: 420,
    background: "rgba(0,5,30,0.88)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.18)",
    backdropFilter: "blur(22px)",
    clipPath: "polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))",
    animation: "fadeUp 0.55s ease forwards, borderPulse 4s ease infinite",
  },
  corner: { position: "absolute", width: 16, height: 16 } as React.CSSProperties,
  topBar: { display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.4rem", borderBottom: "1px solid rgba(0,245,255,0.09)", background: "rgba(0,0,20,0.5)" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 5px #00f5ff", display: "inline-block" },
  topBarLabel: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: 3, color: "rgba(0,245,255,0.38)", marginLeft: "auto" },
  body: { padding: "1.8rem 2.2rem 2.4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },

  /* Icon */
  iconWrap: { animation: "hexSpin 14s linear infinite", display: "flex" },

  /* Success orb */
  successOrb: {
    width: 80, height: 80, borderRadius: "50%",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.4)",
    boxShadow: "0 0 30px rgba(0,255,136,0.2)",
    display: "flex", alignItems: "center", justifyContent: "center",
    position: "relative",
    animation: "successPop 0.5s ease forwards",
  },
  successOrbInner: { position: "absolute", inset: 8, borderRadius: "50%", background: "rgba(0,255,136,0.1)" },

  tag: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: 4, color: "#ff0080", textShadow: "0 0 8px #ff0080", alignSelf: "flex-start" },
  title: { fontFamily: "'Orbitron', monospace", fontWeight: 900, width: "100%", lineHeight: 1.1 },
  titleCyan:  { display: "block", fontSize: "2rem",  color: "#00f5ff", animation: "glowPulse 3s ease infinite" },
  titleGreen: { display: "block", fontSize: "2rem",  color: "#00ff88", animation: "greenPulse 3s ease infinite" },
  titleWhite: { display: "block", fontSize: "1.3rem", color: "rgba(220,230,255,0.9)", letterSpacing: 6 },
  divider: { display: "flex", alignItems: "center", gap: "0.7rem", width: "100%" },
  divLine: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.28), transparent)" },
  divText: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: 3, color: "rgba(0,245,255,0.32)", whiteSpace: "nowrap" as const },
  subtitle: { fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(180,200,255,0.65)", textAlign: "center" as const },
  successMsg: { fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(180,200,255,0.65)", textAlign: "center" as const },

  /* Form */
  form: { width: "100%", display: "flex", flexDirection: "column" as const, gap: "1rem" },
  fieldWrap: { display: "flex", flexDirection: "column" as const, gap: "0.4rem" },
  label: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: 3, textTransform: "uppercase" as const, transition: "color 0.2s, text-shadow 0.2s" },
  inputWrap: {
    display: "flex", alignItems: "center",
    background: "rgba(0,5,20,0.7)",
    borderWidth: "1px", borderStyle: "solid",
    transition: "border-color 0.2s, box-shadow 0.2s",
    clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
  },
  inputPrefix: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem", padding: "0 0 0 12px", flexShrink: 0, transition: "color 0.2s" },
  input: {
    flex: 1, background: "transparent",
    borderWidth: 0, borderStyle: "solid", borderColor: "transparent",
    color: "#e0e8ff", fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.8rem", letterSpacing: 1, padding: "11px 12px",
    width: "100%", caretColor: "#00f5ff",
  },

  /* Submit */
  submitBtn: {
    width: "100%", padding: "13px 24px",
    background: "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,0,255,0.12))",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.38)",
    color: "#e0e8ff", cursor: "pointer",
    fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", fontWeight: 700, letterSpacing: 3,
    textTransform: "uppercase" as const,
    clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
    transition: "all 0.22s ease",
  },
  submitBtnHover: {
    background: "linear-gradient(135deg, rgba(0,245,255,0.22), rgba(191,0,255,0.22))",
    borderColor: "#00f5ff", color: "#00f5ff",
    boxShadow: "0 0 24px rgba(0,245,255,0.28)", transform: "translateY(-2px)",
  },
  submitBtnLoading: {
    opacity: 0.6, cursor: "not-allowed", transform: "none",
  },
  loadingInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" },
  spinner: {
    width: 14, height: 14, borderRadius: "50%",
    borderWidth: 2, borderStyle: "solid",
    borderColor: "rgba(0,245,255,0.2)",
    borderTopColor: "#00f5ff",
    display: "inline-block",
    animation: "spin 0.9s linear infinite",
  },

  /* Back link */
  backLink: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.7rem", letterSpacing: 2,
    color: "#00f5ff", textShadow: "0 0 8px #00f5ff",
    fontWeight: 700, cursor: "pointer",
  },
};