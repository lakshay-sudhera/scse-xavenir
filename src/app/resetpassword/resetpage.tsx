"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/Toast";

interface ResetPasswordProps {
  token?: string;
  email?: string;
}

export default function ResetPassword({ token = "", email = "" }: ResetPasswordProps) {
  const router = useRouter();
  const { showToast } = useToast();

  const [newPassword, setNewPassword]   = useState("");
  const [confirm, setConfirm]           = useState("");
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState("");
  const [success, setSuccess]           = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [hovered, setHovered]           = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const res = await fetch("/api/auth/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword }),
    });
    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      showToast("Password reset successfully!", "success");
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.error || "Something went wrong.");
      showToast(data.error || "Password reset failed.", "error");
    }
  };

  /* ── INVALID LINK STATE ── */
  if (!token || !email) {
    return (
      <div style={s.root}>
        <div style={s.grid} />
        <div style={s.scanH} />
        <div style={s.scanV} />
        <div style={s.vignette} />
        <div style={{ ...s.blob, ...s.blob1 }} />
        <div style={{ ...s.blob, ...s.blob2 }} />

        <div style={s.card}>
          <span style={{ ...s.corner, top: -1, left: -1, borderTop: "2px solid #ff0080", borderLeft: "2px solid #ff0080", boxShadow: "-2px -2px 12px #ff0080" }} />
          <span style={{ ...s.corner, top: -1, right: -1, borderTop: "2px solid #ff0080", borderRight: "2px solid #ff0080", boxShadow: "2px -2px 12px #ff0080" }} />
          <span style={{ ...s.corner, bottom: -1, left: -1, borderBottom: "2px solid #ff0080", borderLeft: "2px solid #ff0080", boxShadow: "-2px 2px 12px #ff0080" }} />
          <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: "2px solid #ff0080", borderRight: "2px solid #ff0080", boxShadow: "2px 2px 12px #ff0080" }} />

          <div style={s.topBar}>
            <span style={{ ...s.dot, background: "#ff0080", boxShadow: "0 0 5px #ff0080" }} />
            <span style={{ ...s.dot, background: "#ff0080", boxShadow: "0 0 5px #ff0080" }} />
            <span style={{ ...s.dot, background: "#ff0080", boxShadow: "0 0 5px #ff0080" }} />
            <span style={{ ...s.topBarLabel, color: "rgba(255,0,128,0.5)" }}>SCSE_AUTH.INVALID_LINK</span>
          </div>

          <div style={{ ...s.body, gap: "1.2rem" }}>
            <div style={s.errorOrb}>
              <div style={s.errorOrbInner} />
              <svg width="32" height="32" viewBox="0 0 32 32" style={{ position: "absolute" }}>
                <line x1="8" y1="8" x2="24" y2="24" stroke="#ff0080" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #ff0080)" }} />
                <line x1="24" y1="8" x2="8" y2="24" stroke="#ff0080" strokeWidth="2.5" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 6px #ff0080)" }} />
              </svg>
            </div>
            <h1 style={s.title}>
              <span style={s.titlePink}>INVALID</span>
              <span style={s.titleWhite}>RESET LINK</span>
            </h1>
            <p style={{ ...s.subtitle, color: "rgba(255,120,120,0.7)" }}>
              This link is missing required parameters or has expired.
            </p>
            <Link href="/forgotpassword" style={s.backLink}>
              &gt;&gt; REQUEST_NEW_LINK
            </Link>
          </div>
        </div>
        <Styles />
      </div>
    );
  }

  return (
    <div style={s.root}>
      <div style={s.grid} />
      <div style={s.scanH} />
      <div style={s.scanV} />
      <div style={s.vignette} />
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

      <div style={s.card}>
        <span style={{ ...s.corner, top: -1, left: -1, borderTop: "2px solid #00f5ff", borderLeft: "2px solid #00f5ff", boxShadow: "-2px -2px 12px #00f5ff" }} />
        <span style={{ ...s.corner, top: -1, right: -1, borderTop: "2px solid #ff0080", borderRight: "2px solid #ff0080", boxShadow: "2px -2px 12px #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, left: -1, borderBottom: "2px solid #ff0080", borderLeft: "2px solid #ff0080", boxShadow: "-2px 2px 12px #ff0080" }} />
        <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff", boxShadow: "2px 2px 12px #00f5ff" }} />

        <div style={s.topBar}>
          <span style={s.dot} />
          <span style={{ ...s.dot, background: "#ff0080", boxShadow: "0 0 5px #ff0080" }} />
          <span style={{ ...s.dot, background: "#bf00ff", boxShadow: "0 0 5px #bf00ff" }} />
          <span style={s.topBarLabel}>SCSE_AUTH.PWD_RESET</span>
        </div>

        <div style={s.body}>
          {success ? (
            /* ── SUCCESS STATE ── */
            <>
              <div style={s.successOrb}>
                <div style={s.successOrbInner} />
                <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute" }}>
                  <polyline points="6,18 14,26 30,10" fill="none"
                    stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"
                    style={{ filter: "drop-shadow(0 0 6px #00ff88)" }} />
                </svg>
              </div>

              <p style={s.tag}>// RESET_COMPLETE</p>

              <h1 style={s.title}>
                <span style={s.titleGreen}>PASSWORD</span>
                <span style={s.titleWhite}>UPDATED</span>
              </h1>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>STATUS_OK</span>
                <div style={s.divLine} />
              </div>

              <p style={s.successMsg}>
                Password reset successfully.{" "}
                <span style={{ color: "#00f5ff" }}>Redirecting to login</span> in 3 seconds...
              </p>

              {/* Countdown bar */}
              <div style={s.countdownWrap}>
                <div style={s.countdownBar} />
              </div>

              <Link href="/login" style={s.backLink}>&gt;&gt; GO_TO_LOGIN</Link>
            </>
          ) : (
            /* ── FORM STATE ── */
            <>
              <div style={s.iconWrap}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <polygon points="26,3 47,15 47,37 26,49 5,37 5,15"
                    fill="none" stroke="#00f5ff" strokeWidth="1.2"
                    style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
                  <polygon points="26,10 41,18.5 41,35.5 26,44 11,35.5 11,18.5"
                    fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.7" />
                  <text x="26" y="32" textAnchor="middle"
                    fontFamily="'Orbitron',monospace" fontSize="9" fontWeight="900"
                    fill="#00f5ff" style={{ filter: "drop-shadow(0 0 5px #00f5ff)" }}>
                    RESET
                  </text>
                </svg>
              </div>

              <p style={s.tag}>// PWD_RESET</p>

              <h1 style={s.title}>
                <span style={s.titleCyan}>RESET</span>
                <span style={s.titleWhite}>PASSWORD</span>
              </h1>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>NEW_CREDENTIALS</span>
                <div style={s.divLine} />
              </div>

              <p style={s.subtitle}>
                Setting new password for{" "}
                <span style={{ color: "#00f5ff", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.85rem" }}>
                  {email}
                </span>
              </p>

              {/* Error alert */}
              {error && (
                <div style={s.alert}>
                  <span style={{ marginRight: 6 }}>⚠</span>{error}
                </div>
              )}

              <form onSubmit={handleSubmit} style={s.form}>
                {/* New Password */}
                <div style={s.fieldWrap}>
                  <label style={{
                    ...s.label,
                    color: focusedField === "new" ? "#00f5ff" : "rgba(0,245,255,0.55)",
                    textShadow: focusedField === "new" ? "0 0 8px #00f5ff" : "none",
                  }}>
                    NEW_PASSWORD
                  </label>
                  <div style={{
                    ...s.inputWrap,
                    position: "relative",
                    borderColor: focusedField === "new" ? "#00f5ff" : "rgba(0,245,255,0.18)",
                    boxShadow: focusedField === "new" ? "0 0 16px rgba(0,245,255,0.18)" : "none",
                  }}>
                    <span style={{ ...s.inputPrefix, color: focusedField === "new" ? "#00f5ff" : "rgba(0,245,255,0.35)" }}>◆</span>
                    <input
                      type={showNew ? "text" : "password"}
                      placeholder="Enter new password"
                      required
                      value={newPassword}
                      onChange={(e) => { setNewPassword(e.target.value); if (error) setError(""); }}
                      onFocus={() => setFocusedField("new")}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...s.input, paddingRight: "2.8rem" }}
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} style={s.eyeBtn}>
                      <span style={{ color: "rgba(0,245,255,0.5)", fontSize: "0.72rem" }}>{showNew ? "HIDE" : "SHOW"}</span>
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div style={s.fieldWrap}>
                  <label style={{
                    ...s.label,
                    color: focusedField === "confirm" ? "#00f5ff" : "rgba(0,245,255,0.55)",
                    textShadow: focusedField === "confirm" ? "0 0 8px #00f5ff" : "none",
                  }}>
                    CONFIRM_PASSWORD
                  </label>
                  <div style={{
                    ...s.inputWrap,
                    position: "relative",
                    borderColor: focusedField === "confirm" ? "#00f5ff" : "rgba(0,245,255,0.18)",
                    boxShadow: focusedField === "confirm" ? "0 0 16px rgba(0,245,255,0.18)" : "none",
                  }}>
                    <span style={{ ...s.inputPrefix, color: focusedField === "confirm" ? "#00f5ff" : "rgba(0,245,255,0.35)" }}>◆</span>
                    <input
                      type={showConfirm ? "text" : "password"}
                      placeholder="Re-enter password"
                      required
                      value={confirm}
                      onChange={(e) => { setConfirm(e.target.value); if (error) setError(""); }}
                      onFocus={() => setFocusedField("confirm")}
                      onBlur={() => setFocusedField(null)}
                      style={{ ...s.input, paddingRight: "2.8rem" }}
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={s.eyeBtn}>
                      <span style={{ color: "rgba(0,245,255,0.5)", fontSize: "0.72rem" }}>{showConfirm ? "HIDE" : "SHOW"}</span>
                    </button>
                  </div>
                </div>

                {/* Submit */}
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
                      RESETTING...
                    </span>
                  ) : hovered ? "// UPDATING CREDENTIALS..." : "RESET PASSWORD"}
                </button>
              </form>

              <div style={s.divider}>
                <div style={s.divLine} />
                <span style={s.divText}>OR</span>
                <div style={s.divLine} />
              </div>

              <Link href="/login" style={s.backLink}>&lt;&lt; RETURN_TO_LOGIN</Link>
            </>
          )}
        </div>
      </div>
      <Styles />
    </div>
  );
}

/* Extracted so both return paths share the same <style> tag */
function Styles() {
  return (
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
      @keyframes pinkPulse   { 0%,100%{text-shadow:0 0 16px #ff0080,0 0 30px rgba(255,0,128,0.3)} 50%{text-shadow:0 0 28px #ff0080,0 0 55px rgba(255,0,128,0.55)} }
      @keyframes hexSpin     { to{transform:rotate(360deg)} }
      @keyframes borderPulse { 0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.07)} 50%{box-shadow:0 0 40px rgba(0,245,255,0.16)} }
      @keyframes alertSlide  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
      @keyframes spin        { to{transform:rotate(360deg)} }
      @keyframes successPop  { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
      @keyframes countdown   { from{width:100%} to{width:0%} }
      input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
        -webkit-box-shadow:0 0 0px 1000px #00050f inset !important;
        -webkit-text-fill-color:#e0e8ff !important; caret-color:#00f5ff;
      }
      input::placeholder { color:rgba(180,200,255,0.22); }
      input:focus { outline:none; }
      button { border:none; }
      a { text-decoration:none; }
    `}</style>
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

  iconWrap: { animation: "hexSpin 14s linear infinite", display: "flex" },

  successOrb: { width: 80, height: 80, borderRadius: "50%", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.4)", boxShadow: "0 0 30px rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "successPop 0.5s ease forwards" },
  successOrbInner: { position: "absolute", inset: 8, borderRadius: "50%", background: "rgba(0,255,136,0.1)" },
  errorOrb: { width: 80, height: 80, borderRadius: "50%", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,0,128,0.4)", boxShadow: "0 0 30px rgba(255,0,128,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "successPop 0.5s ease forwards" },
  errorOrbInner: { position: "absolute", inset: 8, borderRadius: "50%", background: "rgba(255,0,128,0.1)" },

  tag: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: 4, color: "#ff0080", textShadow: "0 0 8px #ff0080", alignSelf: "flex-start" },
  title: { fontFamily: "'Orbitron', monospace", fontWeight: 900, width: "100%", lineHeight: 1.1 },
  titleCyan:  { display: "block", fontSize: "2rem",  color: "#00f5ff", animation: "glowPulse 3s ease infinite" },
  titleGreen: { display: "block", fontSize: "2rem",  color: "#00ff88", animation: "greenPulse 3s ease infinite" },
  titlePink:  { display: "block", fontSize: "2rem",  color: "#ff0080", animation: "pinkPulse 3s ease infinite" },
  titleWhite: { display: "block", fontSize: "1.3rem", color: "rgba(220,230,255,0.9)", letterSpacing: 6 },
  divider: { display: "flex", alignItems: "center", gap: "0.7rem", width: "100%" },
  divLine: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.28), transparent)" },
  divText: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.52rem", letterSpacing: 3, color: "rgba(0,245,255,0.32)", whiteSpace: "nowrap" as const },
  subtitle: { fontSize: "0.95rem", lineHeight: 1.7, color: "rgba(180,200,255,0.65)", textAlign: "center" as const },
  successMsg: { fontSize: "0.92rem", lineHeight: 1.8, color: "rgba(180,200,255,0.65)", textAlign: "center" as const },

  countdownWrap: { width: "100%", height: 2, background: "rgba(0,255,136,0.1)", overflow: "hidden" },
  countdownBar: { height: "100%", background: "linear-gradient(90deg, #00ff88, #00f5ff)", boxShadow: "0 0 8px #00ff88", animation: "countdown 3s linear forwards" },

  alert: { width: "100%", padding: "10px 14px", background: "rgba(255,0,128,0.08)", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,0,128,0.35)", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem", color: "#ff0080", letterSpacing: 1, animation: "alertSlide 0.3s ease forwards", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },

  form: { width: "100%", display: "flex", flexDirection: "column" as const, gap: "1rem" },
  fieldWrap: { display: "flex", flexDirection: "column" as const, gap: "0.4rem" },
  label: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: 3, textTransform: "uppercase" as const, transition: "color 0.2s, text-shadow 0.2s" },
  inputWrap: { display: "flex", alignItems: "center", background: "rgba(0,5,20,0.7)", borderWidth: "1px", borderStyle: "solid", transition: "border-color 0.2s, box-shadow 0.2s", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },
  inputPrefix: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem", padding: "0 0 0 12px", flexShrink: 0, transition: "color 0.2s" },
  input: { flex: 1, background: "transparent", borderWidth: 0, borderStyle: "solid", borderColor: "transparent", color: "#e0e8ff", fontFamily: "'Share Tech Mono', monospace", fontSize: "0.8rem", letterSpacing: 1, padding: "11px 12px", width: "100%", caretColor: "#00f5ff" },
  eyeBtn: { position: "absolute" as const, right: 10, background: "transparent", cursor: "pointer", display: "flex", alignItems: "center", padding: 0 },

  submitBtn: { width: "100%", padding: "13px 24px", background: "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,0,255,0.12))", borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.38)", color: "#e0e8ff", cursor: "pointer", fontFamily: "'Orbitron', monospace", fontSize: "0.78rem", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))", transition: "all 0.22s ease" },
  submitBtnHover: { background: "linear-gradient(135deg, rgba(0,245,255,0.22), rgba(191,0,255,0.22))", borderColor: "#00f5ff", color: "#00f5ff", boxShadow: "0 0 24px rgba(0,245,255,0.28)", transform: "translateY(-2px)" },
  submitBtnLoading: { opacity: 0.6, cursor: "not-allowed", transform: "none" },
  loadingInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: "0.6rem" },
  spinner: { width: 14, height: 14, borderRadius: "50%", borderWidth: 2, borderStyle: "solid", borderColor: "rgba(0,245,255,0.2)", borderTopColor: "#00f5ff", display: "inline-block", animation: "spin 0.9s linear infinite" },

  backLink: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.7rem", letterSpacing: 2, color: "#00f5ff", textShadow: "0 0 8px #00f5ff", fontWeight: 700, cursor: "pointer" },
};