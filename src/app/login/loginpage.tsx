"use client";

import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { UserContext } from "@/context/UserContext";
import Loading from "@/components/Loading";

export default function Login() {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [loader, setLoader] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [glitch, setGlitch] = useState(false);

  useEffect(() => {
    document.body.style.overflowY = "auto";
    const iv = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 150);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoader(true);
    try {
      const response = await axios.post("/api/auth/login", formData);
      if (response.status === 200) {
        const userResponse = await axios.get("/api/users/getCurrent");
        if (userResponse.data.data.status === 200) {
          setUserData(userResponse.data.data);
        }
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoader(false);
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Login failed. Please try again."
      );
    }
  };

  if (loader) return <Loading />;

  return (
    <div style={s.root}>
      {/* Animated grid */}
      <div style={s.grid} />

      {/* Scan lines */}
      <div style={s.scanH} />
      <div style={s.scanV} />

      {/* Vignette */}
      <div style={s.vignette} />

      {/* Glow blobs */}
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
          <span style={s.topBarLabel}>SCSE_AUTH.LOGIN</span>
        </div>

        <div style={s.body}>
          {/* Icon */}
          <div style={s.iconWrap}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <polygon
                points="26,3 47,15 47,37 26,49 5,37 5,15"
                fill="none" stroke="#00f5ff" strokeWidth="1.2"
                style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }}
              />
              <polygon
                points="26,10 41,18.5 41,35.5 26,44 11,35.5 11,18.5"
                fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.7"
              />
              <text x="26" y="32" textAnchor="middle"
                fontFamily="'Orbitron',monospace" fontSize="13" fontWeight="900"
                fill="#00f5ff" style={{ filter: "drop-shadow(0 0 5px #00f5ff)" }}>
                SYS
              </text>
            </svg>
          </div>

          {/* Tag */}
          <p style={s.tag}>// SECURE_LOGIN</p>

          {/* Title */}
          <h1 style={s.title}>
            <span style={{ ...s.titleCyan, ...(glitch ? s.titleGlitch : {}) }}>
              WELCOME
            </span>
            <span style={s.titleWhite}>BACK</span>
          </h1>

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>ENTER_CREDENTIALS</span>
            <div style={s.divLine} />
          </div>

          {/* Error alert */}
          {error && (
            <div style={s.alert}>
              <span style={{ color: "#ff0080", marginRight: 6 }}>⚠</span>
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            {/* Email */}
            <div style={s.fieldWrap}>
              <label style={{
                ...s.label,
                color: focusedField === "email" ? "#00f5ff" : "rgba(0,245,255,0.55)",
                textShadow: focusedField === "email" ? "0 0 8px #00f5ff" : "none",
              }}>
                EMAIL_ADDRESS
              </label>
              <div style={s.inputWrap}>
                <span style={s.inputPrefix}>&gt;</span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("email")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="user@college.edu"
                  style={{
                    ...s.input,
                    borderColor: focusedField === "email"
                      ? "#00f5ff"
                      : error
                      ? "#ff0080"
                      : "rgba(0,245,255,0.18)",
                    boxShadow: focusedField === "email"
                      ? "0 0 16px rgba(0,245,255,0.18), inset 0 0 8px rgba(0,245,255,0.05)"
                      : "none",
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div style={s.fieldWrap}>
              <label style={{
                ...s.label,
                color: focusedField === "password" ? "#00f5ff" : "rgba(0,245,255,0.55)",
                textShadow: focusedField === "password" ? "0 0 8px #00f5ff" : "none",
              }}>
                PASSWORD
              </label>
              <div style={{ ...s.inputWrap, position: "relative" }}>
                <span style={s.inputPrefix}>&gt;</span>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedField("password")}
                  onBlur={() => setFocusedField(null)}
                  placeholder="••••••••"
                  style={{
                    ...s.input,
                    paddingRight: "2.8rem",
                    borderColor: focusedField === "password"
                      ? "#00f5ff"
                      : error
                      ? "#ff0080"
                      : "rgba(0,245,255,0.18)",
                    boxShadow: focusedField === "password"
                      ? "0 0 16px rgba(0,245,255,0.18), inset 0 0 8px rgba(0,245,255,0.05)"
                      : "none",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={s.eyeBtn}
                >
                  {showPassword
                    ? <EyeOff size={15} color="rgba(0,245,255,0.5)" />
                    : <Eye size={15} color="rgba(0,245,255,0.5)" />
                  }
                </button>
              </div>
              <Link href="/forgotpassword" style={s.forgotLink}>
                // forgot_password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{
                ...s.submitBtn,
                ...(submitHovered ? s.submitBtnHover : {}),
              }}
            >
              <span style={{ position: "relative", zIndex: 1 }}>
                {submitHovered ? "// AUTHENTICATING..." : "SIGN IN"}
              </span>
            </button>
          </form>

          {/* Divider */}
          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>OR</span>
            <div style={s.divLine} />
          </div>

          {/* Register link */}
          <p style={s.registerText}>
            No account?{" "}
            <Link href="/register" style={s.registerLink}>
              &gt;&gt; REGISTER_NOW
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');

        * { box-sizing: border-box; }

        @keyframes gridMove {
          from { background-position: 0 0; }
          to   { background-position: 60px 60px; }
        }
        @keyframes scanH {
          0%   { top: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes scanV {
          0%   { left: -2px; opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          100% { left: 100%; opacity: 0; }
        }
        @keyframes blobFloat1 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(25px,-18px) scale(1.07); }
        }
        @keyframes blobFloat2 {
          0%,100% { transform: translate(0,0) scale(1); }
          50%     { transform: translate(-18px,22px) scale(1.05); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes glowPulse {
          0%,100% { text-shadow: 0 0 16px #00f5ff, 0 0 30px rgba(0,245,255,0.3); }
          50%     { text-shadow: 0 0 28px #00f5ff, 0 0 55px rgba(0,245,255,0.55); }
        }
        @keyframes hexSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes borderPulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,245,255,0.07); }
          50%     { box-shadow: 0 0 40px rgba(0,245,255,0.16); }
        }
        @keyframes alertSlide {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }

        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-box-shadow: 0 0 0px 1000px #00050f inset !important;
          -webkit-text-fill-color: #e0e8ff !important;
          caret-color: #00f5ff;
        }
        input::placeholder { color: rgba(180,200,255,0.25); }
        input:focus { outline: none; }
        button { border: none; }
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
      "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px",
    animation: "gridMove 8s linear infinite",
  },
  scanH: {
    position: "fixed", left: 0, right: 0, height: 1,
    background: "rgba(0,245,255,0.2)",
    boxShadow: "0 0 8px rgba(0,245,255,0.35)",
    animation: "scanH 7s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  scanV: {
    position: "fixed", top: 0, bottom: 0, width: 1,
    background: "rgba(255,0,128,0.12)",
    animation: "scanV 11s linear infinite",
    zIndex: 1, pointerEvents: "none",
  },
  vignette: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 78% 78% at 50% 50%, transparent 42%, rgba(2,0,16,0.92) 100%)",
  },
  blob: {
    position: "absolute", borderRadius: "50%",
    filter: "blur(90px)", zIndex: 0, pointerEvents: "none",
  },
  blob1: {
    width: 360, height: 360,
    background: "rgba(0,245,255,0.065)",
    top: "-12%", right: "-10%",
    animation: "blobFloat1 9s ease-in-out infinite",
  },
  blob2: {
    width: 280, height: 280,
    background: "rgba(191,0,255,0.065)",
    bottom: "-10%", left: "-8%",
    animation: "blobFloat2 11s ease-in-out infinite",
  },

  /* Card */
  card: {
    position: "relative", zIndex: 10,
    width: "100%", maxWidth: 440,
    background: "rgba(0,5,30,0.88)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.18)",
    backdropFilter: "blur(22px)",
    clipPath: "polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))",
    animation: "fadeUp 0.55s ease forwards, borderPulse 4s ease infinite",
  },
  corner: { position: "absolute", width: 16, height: 16 } as React.CSSProperties,
  topBar: {
    display: "flex", alignItems: "center", gap: 8,
    padding: "0.65rem 1.4rem",
    borderBottom: "1px solid rgba(0,245,255,0.09)",
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
    color: "rgba(0,245,255,0.38)", marginLeft: "auto",
  },

  body: {
    padding: "1.8rem 2.2rem 2.4rem",
    display: "flex", flexDirection: "column",
    alignItems: "center", gap: "1rem",
  },
  iconWrap: { animation: "hexSpin 14s linear infinite", display: "flex" },
  tag: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.65rem", letterSpacing: 4,
    color: "#ff0080", textShadow: "0 0 8px #ff0080",
    alignSelf: "flex-start",
  },
  title: {
    fontFamily: "'Orbitron', monospace",
    fontWeight: 900, width: "100%", lineHeight: 1.1,
  },
  titleCyan: {
    display: "block", fontSize: "2rem", color: "#00f5ff",
    animation: "glowPulse 3s ease infinite",
    transition: "transform 0.1s, filter 0.1s",
  },
  titleGlitch: {
    transform: "skewX(-3deg)",
    filter: "brightness(1.5)",
  },
  titleWhite: {
    display: "block", fontSize: "1.3rem",
    color: "rgba(220,230,255,0.9)", letterSpacing: 6,
  },
  divider: {
    display: "flex", alignItems: "center", gap: "0.7rem", width: "100%",
  },
  divLine: {
    flex: 1, height: 1,
    background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.28), transparent)",
  },
  divText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.52rem", letterSpacing: 3,
    color: "rgba(0,245,255,0.32)", whiteSpace: "nowrap" as const,
  },

  /* Alert */
  alert: {
    width: "100%", padding: "10px 14px",
    background: "rgba(255,0,128,0.08)",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(255,0,128,0.35)",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.72rem", color: "#ff0080",
    letterSpacing: 1,
    animation: "alertSlide 0.3s ease forwards",
    clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
  },

  /* Form */
  form: {
    width: "100%", display: "flex",
    flexDirection: "column" as const, gap: "1.2rem",
  },
  fieldWrap: {
    display: "flex", flexDirection: "column" as const, gap: "0.4rem",
  },
  label: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.62rem", letterSpacing: 3,
    textTransform: "uppercase" as const,
    transition: "color 0.2s, text-shadow 0.2s",
  },
  inputWrap: {
    display: "flex", alignItems: "center",
    background: "rgba(0,5,20,0.7)",
    borderWidth: "1px", borderStyle: "solid",
    transition: "border-color 0.2s, box-shadow 0.2s",
    clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
  },
  inputPrefix: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.85rem", color: "rgba(0,245,255,0.35)",
    padding: "0 0 0 12px", flexShrink: 0,
  },
  input: {
    flex: 1,
    background: "transparent",
    borderWidth: 0, borderStyle: "solid", borderColor: "transparent",
    color: "#e0e8ff",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.82rem", letterSpacing: 1,
    padding: "11px 12px",
    width: "100%",
    transition: "border-color 0.2s, box-shadow 0.2s",
    caretColor: "#00f5ff",
  },
  eyeBtn: {
    position: "absolute" as const, right: 12,
    background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
    padding: 0,
  },
  forgotLink: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.6rem", letterSpacing: 2,
    color: "rgba(0,245,255,0.4)",
    textDecoration: "none", alignSelf: "flex-end" as const,
    transition: "color 0.2s",
  },

  /* Submit button */
  submitBtn: {
    width: "100%", padding: "13px 24px",
    background: "linear-gradient(135deg, rgba(0,245,255,0.12), rgba(191,0,255,0.12))",
    borderWidth: "1px", borderStyle: "solid", borderColor: "rgba(0,245,255,0.38)",
    color: "#e0e8ff", cursor: "pointer",
    fontFamily: "'Orbitron', monospace",
    fontSize: "0.8rem", fontWeight: 700, letterSpacing: 3,
    textTransform: "uppercase" as const,
    clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))",
    transition: "all 0.22s ease",
    position: "relative" as const,
  },
  submitBtnHover: {
    background: "linear-gradient(135deg, rgba(0,245,255,0.22), rgba(191,0,255,0.22))",
    borderColor: "#00f5ff",
    color: "#00f5ff",
    boxShadow: "0 0 24px rgba(0,245,255,0.28)",
    transform: "translateY(-2px)",
  },

  /* Register link */
  registerText: {
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.68rem", letterSpacing: 1,
    color: "rgba(180,200,255,0.4)",
  },
  registerLink: {
    color: "#00f5ff", textDecoration: "none",
    textShadow: "0 0 8px #00f5ff", letterSpacing: 2, fontWeight: 700,
  },
};