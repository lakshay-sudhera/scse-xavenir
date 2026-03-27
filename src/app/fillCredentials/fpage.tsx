"use client";

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";
import Loading from "@/components/Loading";

function Page() {
  const router = useRouter();
  const { setUserData } = useContext(UserContext);

  const [loader, setLoader] = useState(false);
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState<"error" | "success">("error");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    collegeName: "",
  });

  useEffect(() => {
  const fetchEmail = async () => {
    try {
      const userResponse = await axios.get("/api/auth/getTempUser");
      const storedEmail = userResponse.data.email;
      console.log("stored email", storedEmail);

      if (storedEmail) {
        setFormData((prev) => ({ ...prev, email: storedEmail }));
      }
    } catch (err) {
      console.log("Failed to fetch email");
    }
  };

  fetchEmail();

  document.body.style.overflowY = "auto";

  const iv = setInterval(() => {
    setGlitch(true);
    setTimeout(() => setGlitch(false), 150);
  }, 5500);

  return () => clearInterval(iv);
}, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (status) setStatus("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    try {
      const response = await axios.post("/api/auth/fillCredentials", formData);
      const data = response.data
      if (data.status === 200) {
        const userResponse = await axios.get("/api/users/getCurrent");
        if (userResponse.data.data) {
          setUserData(userResponse.data.data);
        }
        setLoader(false);
        setStatus(data.error || data.message || "Successfully registered");
        router.push("/dashboard");
        router.refresh()
      }
    } catch (error: any) {
      setLoader(false);
      const data = error.response?.data;
      setStatusType("error");
      if (data?.status === 401) {
      setStatus(data.error || data.message || "Invalid or Expired Token.");
      setTimeout(() => router.push("/register"), 2000);
      } 
      else {
        setStatus(data.error || data.message || "User already exists. Please login.");
      setTimeout(() => router.push("/login"), 2000);
      }
    }
  };

  if (loader) return <Loading />;

  const fields = [
    { name: "email",       label: "EMAIL_ADDRESS",  type: "email",    placeholder: "auto-filled from Google",  readOnly: true,  icon: "✉" },
    { name: "fullName",    label: "FULL_NAME",       type: "text",     placeholder: "Enter your full name",     readOnly: false, icon: "◈" },
    { name: "password",    label: "PASSWORD",        type: showPassword ? "text" : "password", placeholder: "Create a strong password", readOnly: false, icon: "◆" },
    { name: "collegeName", label: "COLLEGE_NAME",    type: "text",     placeholder: "Enter your college name",  readOnly: false, icon: "⬡" },
  ];

  return (
    <div style={s.root}>
      <div style={s.grid} />
      <div style={s.scanH} />
      <div style={s.scanV} />
      <div style={s.vignette} />
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

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
          <span style={s.topBarLabel}>SCSE_AUTH.FILL_CREDENTIALS</span>
        </div>

        <div style={s.body}>
          {/* Icon */}
          <div style={s.iconWrap}>
            <svg width="52" height="52" viewBox="0 0 52 52">
              <polygon points="26,3 47,15 47,37 26,49 5,37 5,15"
                fill="none" stroke="#00f5ff" strokeWidth="1.2"
                style={{ filter: "drop-shadow(0 0 6px #00f5ff)" }} />
              <polygon points="26,10 41,18.5 41,35.5 26,44 11,35.5 11,18.5"
                fill="none" stroke="rgba(0,245,255,0.25)" strokeWidth="0.7" />
              <text x="26" y="32" textAnchor="middle"
                fontFamily="'Orbitron',monospace" fontSize="11" fontWeight="900"
                fill="#00f5ff" style={{ filter: "drop-shadow(0 0 5px #00f5ff)" }}>
                USR
              </text>
            </svg>
          </div>

          <p style={s.tag}>// PROFILE_SETUP</p>

          <h1 style={s.title}>
            <span style={{ ...s.titleCyan, ...(glitch ? s.titleGlitch : {}) }}>CREATE</span>
            <span style={s.titleWhite}>ACCOUNT</span>
          </h1>

          <div style={s.divider}>
            <div style={s.divLine} />
            <span style={s.divText}>COMPLETE_YOUR_PROFILE</span>
            <div style={s.divLine} />
          </div>

          {/* Status message */}
          {status && (
            <div style={{
              ...s.alert,
              background: statusType === "success" ? "rgba(0,255,136,0.08)" : "rgba(255,0,128,0.08)",
              borderColor: statusType === "success" ? "rgba(0,255,136,0.35)" : "rgba(255,0,128,0.35)",
              color: statusType === "success" ? "#00ff88" : "#ff0080",
            }}>
              <span style={{ marginRight: 6 }}>{statusType === "success" ? "✓" : "⚠"}</span>
              {status}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={s.form}>
            {fields.map(({ name, label, type, placeholder, readOnly, icon }) => (
              <div key={name} style={s.fieldWrap}>
                <label style={{
                  ...s.label,
                  color: focusedField === name ? "#00f5ff" : "rgba(0,245,255,0.55)",
                  textShadow: focusedField === name ? "0 0 8px #00f5ff" : "none",
                }}>
                  {label}
                </label>
                <div style={{
                  ...s.inputWrap,
                  borderColor: readOnly
                    ? "rgba(0,245,255,0.08)"
                    : focusedField === name ? "#00f5ff" : "rgba(0,245,255,0.18)",
                  boxShadow: focusedField === name && !readOnly
                    ? "0 0 16px rgba(0,245,255,0.18)"
                    : "none",
                  background: readOnly ? "rgba(0,245,255,0.03)" : "rgba(0,5,20,0.7)",
                  position: "relative",
                }}>
                  <span style={{
                    ...s.inputPrefix,
                    color: readOnly ? "rgba(0,245,255,0.2)" : "rgba(0,245,255,0.35)",
                  }}>
                    {icon}
                  </span>
                  <input
                    type={type}
                    name={name}
                    value={formData[name as keyof typeof formData]}
                    onChange={handleChange}
                    onFocus={() => !readOnly && setFocusedField(name)}
                    onBlur={() => setFocusedField(null)}
                    readOnly={readOnly}
                    required={!readOnly}
                    placeholder={placeholder}
                    style={{
                      ...s.input,
                      color: readOnly ? "rgba(0,245,255,0.4)" : "#e0e8ff",
                      cursor: readOnly ? "default" : "text",
                      paddingRight: name === "password" ? "2.8rem" : "12px",
                    }}
                  />
                  {/* Password toggle */}
                  {name === "password" && (
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={s.eyeBtn}
                    >
                      <span style={{ color: "rgba(0,245,255,0.5)", fontSize: "0.75rem" }}>
                        {showPassword ? "HIDE" : "SHOW"}
                      </span>
                    </button>
                  )}
                  {/* Readonly lock icon */}
                  {readOnly && (
                    <span style={s.lockIcon}>🔒</span>
                  )}
                </div>
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{ ...s.submitBtn, ...(submitHovered ? s.submitBtnHover : {}) }}
            >
              {submitHovered ? "// REGISTERING..." : "COMPLETE REGISTRATION"}
            </button>
          </form>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@700;900&family=Share+Tech+Mono&family=Rajdhani:wght@400;600&display=swap');
        * { box-sizing: border-box; }
        @keyframes gridMove { from{background-position:0 0} to{background-position:60px 60px} }
        @keyframes scanH { 0%{top:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
        @keyframes scanV { 0%{left:-2px;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{left:100%;opacity:0} }
        @keyframes blobFloat1 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(25px,-18px) scale(1.07)} }
        @keyframes blobFloat2 { 0%,100%{transform:translate(0,0) scale(1)} 50%{transform:translate(-18px,22px) scale(1.05)} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(22px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glowPulse { 0%,100%{text-shadow:0 0 16px #00f5ff,0 0 30px rgba(0,245,255,0.3)} 50%{text-shadow:0 0 28px #00f5ff,0 0 55px rgba(0,245,255,0.55)} }
        @keyframes hexSpin { to{transform:rotate(360deg)} }
        @keyframes borderPulse { 0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.07)} 50%{box-shadow:0 0 40px rgba(0,245,255,0.16)} }
        @keyframes alertSlide { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0px 1000px #00050f inset !important;
          -webkit-text-fill-color:#e0e8ff !important;
          caret-color:#00f5ff;
        }
        input::placeholder { color:rgba(180,200,255,0.22); }
        input:focus { outline:none; }
        button { border:none; }
      `}</style>
    </div>
  );
}

export default Page;

const s: Record<string, React.CSSProperties> = {
  root: {
    minHeight: "100vh", background: "#020010",
    display: "flex", alignItems: "center", justifyContent: "center",
    fontFamily: "'Rajdhani', sans-serif",
    position: "relative", overflow: "hidden",
    padding: "5rem 2rem 2rem",
  },
  grid: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    backgroundImage:
      "linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px)," +
      "linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px)",
    backgroundSize: "60px 60px", animation: "gridMove 8s linear infinite",
  },
  scanH: {
    position: "fixed", left: 0, right: 0, height: 1,
    background: "rgba(0,245,255,0.2)", boxShadow: "0 0 8px rgba(0,245,255,0.35)",
    animation: "scanH 7s linear infinite", zIndex: 1, pointerEvents: "none",
  },
  scanV: {
    position: "fixed", top: 0, bottom: 0, width: 1,
    background: "rgba(255,0,128,0.12)",
    animation: "scanV 11s linear infinite", zIndex: 1, pointerEvents: "none",
  },
  vignette: {
    position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none",
    background: "radial-gradient(ellipse 78% 78% at 50% 50%, transparent 42%, rgba(2,0,16,0.92) 100%)",
  },
  blob: { position: "absolute", borderRadius: "50%", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" },
  blob1: { width: 360, height: 360, background: "rgba(0,245,255,0.065)", top: "-12%", right: "-10%", animation: "blobFloat1 9s ease-in-out infinite" },
  blob2: { width: 280, height: 280, background: "rgba(191,0,255,0.065)", bottom: "-10%", left: "-8%", animation: "blobFloat2 11s ease-in-out infinite" },

  card: {
    position: "relative", zIndex: 10, width: "100%", maxWidth: 460,
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
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 5px #00f5ff", display: "inline-block" },
  topBarLabel: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.58rem", letterSpacing: 3, color: "rgba(0,245,255,0.38)", marginLeft: "auto" },
  body: { padding: "1.8rem 2.2rem 2.4rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" },
  iconWrap: { animation: "hexSpin 14s linear infinite", display: "flex" },
  tag: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", letterSpacing: 4, color: "#ff0080", textShadow: "0 0 8px #ff0080", alignSelf: "flex-start" },
  title: { fontFamily: "'Orbitron', monospace", fontWeight: 900, width: "100%", lineHeight: 1.1 },
  titleCyan: { display: "block", fontSize: "2rem", color: "#00f5ff", animation: "glowPulse 3s ease infinite", transition: "transform 0.1s, filter 0.1s" },
  titleGlitch: { transform: "skewX(-3deg)", filter: "brightness(1.5)" },
  titleWhite: { display: "block", fontSize: "1.3rem", color: "rgba(220,230,255,0.9)", letterSpacing: 6 },
  divider: { display: "flex", alignItems: "center", gap: "0.7rem", width: "100%" },
  divLine: { flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(0,245,255,0.28), transparent)" },
  divText: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.5rem", letterSpacing: 3, color: "rgba(0,245,255,0.32)", whiteSpace: "nowrap" as const },
  alert: {
    width: "100%", padding: "10px 14px",
    borderWidth: "1px", borderStyle: "solid",
    fontFamily: "'Share Tech Mono', monospace", fontSize: "0.72rem",
    letterSpacing: 1, animation: "alertSlide 0.3s ease forwards",
    clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
  },
  form: { width: "100%", display: "flex", flexDirection: "column" as const, gap: "1rem" },
  fieldWrap: { display: "flex", flexDirection: "column" as const, gap: "0.4rem" },
  label: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.6rem", letterSpacing: 3, textTransform: "uppercase" as const, transition: "color 0.2s, text-shadow 0.2s" },
  inputWrap: {
    display: "flex", alignItems: "center",
    borderWidth: "1px", borderStyle: "solid",
    transition: "border-color 0.2s, box-shadow 0.2s",
    clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))",
  },
  inputPrefix: { fontFamily: "'Share Tech Mono', monospace", fontSize: "0.9rem", padding: "0 0 0 12px", flexShrink: 0 },
  input: {
    flex: 1, background: "transparent",
    borderWidth: 0, borderStyle: "solid", borderColor: "transparent",
    fontFamily: "'Share Tech Mono', monospace",
    fontSize: "0.8rem", letterSpacing: 1, padding: "10px 12px",
    width: "100%", caretColor: "#00f5ff",
  },
  eyeBtn: {
    position: "absolute" as const, right: 10,
    background: "transparent", cursor: "pointer",
    display: "flex", alignItems: "center", padding: 0,
  },
  lockIcon: {
    position: "absolute" as const, right: 10,
    fontSize: "0.7rem", opacity: 0.4,
  },
  submitBtn: {
    width: "100%", padding: "13px 24px", marginTop: "0.4rem",
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
};
