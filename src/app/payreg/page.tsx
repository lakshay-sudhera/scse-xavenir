"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import {
  checkIsFromCse,
  checkIsFromNit,
  check3rdYear,
} from "@/utils/paychecker";

interface UserData {
  email: string;
  role: string;
  userID: string;
  fullName: string;
  collegeName: string;
  isPrime: boolean;
  isNitian: boolean;
  isFromCse: boolean;
  isCollectedTshirt: boolean; // this is source of truth for hoodie 
  paidForTshirt:  "unpaid" | "paid" | "approved" | "rejected";
  paidForaccoModation: "unpaid" | "paid" | "approved" | "rejected";
  paidForPrime: "paid" | "unpaid" | "rejected" | "approved";
  phone?: string;
  gender?: string;
  profilePic?: string;
  x: boolean;
}

function Page() {
  const router = useRouter();
  const [userData, setUserData]     = useState<UserData | null>(null);
  const [image, setImage]           = useState<File | null>(null);
  const [imageUrl, setImageUrl]     = useState<string | null>(null);
  const [loading, setLoading]       = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError]           = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [submitHovered, setSubmitHovered] = useState(false);
  const [uploadHovered, setUploadHovered] = useState(false);
  const [formData, setFormData]     = useState({
    transactionId1: "",
    transactionId2: "",
    transactionId3: "",
  });

  useEffect(() => {
    document.body.style.overflowY = "auto";
    const fetchUserData = async () => {
      try {
        const response = await axios.get("/api/users/getCurrent");
        setUserData(response.data.data);
      } catch (err) {
        setError("Error fetching user data.");
      }
    };
    fetchUserData();
  }, []);
  console.log(userData);
  let amount = 900;
  if (userData?.isNitian && userData.isFromCse) {
    amount = 500;
    if (check3rdYear(userData?.email!)) amount = 500;
  } else if (userData?.isNitian && !userData.isFromCse) {
    amount = 900;
  } else {
    amount = 900;
  }

  const handleImageUpload = async () => {
    setError(null);
    if (!image) { setError("Please select an image to upload."); return; }
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    try {
      const response = await axios.post("/api/cloudinary/upload", data);
      setImageUrl(response.data.uploads.file.secure_url);
    } catch {
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    if (!imageUrl) { setError("Please upload payment proof."); setSubmitting(false); return; }
    if (!formData.transactionId1) { setError("Transaction ID 1 is required."); setSubmitting(false); return; }
    const data = { ...formData, paymentProof: imageUrl, email: userData?.email, scseId: userData?.userID };
    try {
      await axios.post("/api/collegepay", data);
      setShowSuccess(true);
    } catch (err: any) {
      setError(err.error || "Payment submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputStyle = (name: string): React.CSSProperties => ({
    ...s.input,
    borderColor: focusedField === name ? "#00f5ff" : "rgba(0,245,255,0.18)",
    boxShadow: focusedField === name ? "0 0 16px rgba(0,245,255,0.18)" : "none",
  });

  return (
    <div style={s.root}>
      {/* Background */}
      <div style={s.grid} />
      <div style={s.scanH} />
      <div style={s.scanV} />
      <div style={s.vignette} />
      <div style={{ ...s.blob, ...s.blob1 }} />
      <div style={{ ...s.blob, ...s.blob2 }} />

      <div style={s.wrap}>
        <form onSubmit={handleSubmit} style={s.card}>
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
            <span style={s.topBarLabel}>SCSE_PAY.REGISTRATION_PORTAL</span>
          </div>

          <div style={s.body}>
            {/* Title */}
            <p style={s.tag}>// PAYMENT_GATEWAY</p>
            <h1 style={s.title}>
              <span style={s.titleCyan}>PAYMENT</span>
              <span style={s.titleWhite}>PORTAL</span>
            </h1>
            <div style={s.divider}>
              <div style={s.divLine} />
              <span style={s.divText}>PRIME_MEMBERSHIP_REGISTRATION</span>
              <div style={s.divLine} />
            </div>

            {/* Error */}
            {error && (
              <div style={s.alert}>
                <span style={{ marginRight: 6 }}>⚠</span>{error}
              </div>
            )}

            {/* Auto-filled fields */}
            <div style={s.autoGrid}>
              <div style={s.fieldWrap}>
                <label style={s.label}>EMAIL_ADDRESS</label>
                <div style={{ ...s.inputWrap, borderColor: "rgba(0,245,255,0.08)", background: "rgba(0,245,255,0.03)" }}>
                  <span style={{ ...s.inputPrefix, color: "rgba(0,245,255,0.2)" }}>✉</span>
                  <input type="email" value={userData?.email || ""} readOnly style={{ ...s.input, color: "rgba(0,245,255,0.45)", cursor: "default" }} />
                  <span style={s.lockIcon}>🔒</span>
                </div>
              </div>
              <div style={s.fieldWrap}>
                <label style={s.label}>SCSE_ID</label>
                <div style={{ ...s.inputWrap, borderColor: "rgba(0,245,255,0.08)", background: "rgba(0,245,255,0.03)" }}>
                  <span style={{ ...s.inputPrefix, color: "rgba(0,245,255,0.2)" }}>◈</span>
                  <input type="text" value={userData?.userID || "SCSE1234"} readOnly style={{ ...s.input, color: "rgba(0,245,255,0.45)", cursor: "default" }} />
                  <span style={s.lockIcon}>🔒</span>
                </div>
              </div>
            </div>

            {/* QR + Amount */}
            <div style={s.qrSection}>
              <div style={s.fieldWrap}>
                <label style={s.label}>SCAN_TO_PAY</label>
                <div style={s.qrWrap}>
                  <img src="https://res.cloudinary.com/dtieuimsz/image/upload/v1774813669/Screenshot_2026-03-30_011644_ymfpe2.png" alt="SCSE QR" style={s.qrImg} />
                </div>
              </div>
              <div style={s.amountWrap}>
                <p style={s.amountLabel}>AMOUNT_DUE</p>
                <p style={s.amount}>₹{amount}</p>
                <div style={s.amountNote}>
                  <span style={{ color: "rgba(0,245,255,0.4)", fontSize: "0.6rem", fontFamily: "'Share Tech Mono',monospace", letterSpacing: 2 }}>
                    SCAN QR → PAY → UPLOAD PROOF
                  </span>
                </div>
              </div>
            </div>

            {/* Payment proof upload */}
            <div style={s.fieldWrap}>
              <label style={s.label}>PAYMENT_PROOF</label>
              {imageUrl ? (
                <div style={s.proofPreview}>
                  <img src={imageUrl} alt="Payment Proof" style={s.proofImg} />
                  <span style={s.proofSuccess}>✓ PROOF_UPLOADED</span>
                </div>
              ) : (
                <div style={s.uploadPlaceholder}>
                  <span style={{ fontSize: "1.5rem" }}>⬆</span>
                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "rgba(0,245,255,0.35)", letterSpacing: 2 }}>
                    NO_IMAGE_SELECTED
                  </span>
                </div>
              )}
              <div style={s.uploadRow}>
                <label style={s.fileLabel}>
                  <span>📎 &nbsp;CHOOSE FILE</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    style={{ display: "none" }}
                  />
                </label>
                {image && (
                  <span style={s.fileName}>{image.name.slice(0, 24)}{image.name.length > 24 ? "..." : ""}</span>
                )}
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={loading || !image}
                  onMouseEnter={() => setUploadHovered(true)}
                  onMouseLeave={() => setUploadHovered(false)}
                  style={{
                    ...s.uploadBtn,
                    ...(uploadHovered && !loading && image ? s.uploadBtnHover : {}),
                    ...(loading || !image ? s.btnDisabled : {}),
                  }}
                >
                  {loading ? (
                    <span style={s.loadingInner}><span style={s.spinner} />UPLOADING...</span>
                  ) : "UPLOAD"}
                </button>
              </div>
            </div>

            {/* Divider */}
            <div style={s.divider}>
              <div style={s.divLine} />
              <span style={s.divText}>TRANSACTION_IDS</span>
              <div style={s.divLine} />
            </div>

            {/* Transaction IDs */}
            {[
              { key: "transactionId1", label: "TRANSACTION_ID_1", required: true,  hint: "" },
              { key: "transactionId2", label: "TRANSACTION_ID_2", required: false, hint: "OPTIONAL" },
              { key: "transactionId3", label: "TRANSACTION_ID_3", required: false, hint: "OPTIONAL" },
            ].map(({ key, label, required, hint }) => (
              <div key={key} style={s.fieldWrap}>
                <label style={{
                  ...s.label,
                  color: focusedField === key ? "#00f5ff" : "rgba(0,245,255,0.55)",
                  textShadow: focusedField === key ? "0 0 8px #00f5ff" : "none",
                }}>
                  {label}
                  {required && <span style={{ color: "#ff0080", marginLeft: 4 }}>*</span>}
                  {hint && <span style={{ color: "rgba(0,245,255,0.3)", marginLeft: 8, fontSize: "0.5rem" }}>{hint}</span>}
                </label>
                <div style={{
                  ...s.inputWrap,
                  borderColor: focusedField === key ? "#00f5ff" : "rgba(0,245,255,0.18)",
                  boxShadow: focusedField === key ? "0 0 16px rgba(0,245,255,0.18)" : "none",
                }}>
                  <span style={{ ...s.inputPrefix, color: focusedField === key ? "#00f5ff" : "rgba(0,245,255,0.35)" }}>#</span>
                  <input
                    required={required}
                    value={formData[key as keyof typeof formData]}
                    onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                    onFocus={() => setFocusedField(key)}
                    onBlur={() => setFocusedField(null)}
                    style={s.input}
                    placeholder={required ? "Enter transaction ID" : "Optional"}
                  />
                </div>
              </div>
            ))}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting || !imageUrl}
              onMouseEnter={() => setSubmitHovered(true)}
              onMouseLeave={() => setSubmitHovered(false)}
              style={{
                ...s.submitBtn,
                ...(submitHovered && !submitting && imageUrl ? s.submitBtnHover : {}),
                ...(submitting || !imageUrl ? s.btnDisabled : {}),
              }}
            >
              {submitting ? (
                <span style={s.loadingInner}><span style={s.spinner} />TRANSMITTING...</span>
              ) : submitHovered ? "// SUBMITTING PAYMENT..." : "SUBMIT PAYMENT"}
            </button>
          </div>
        </form>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div style={s.modalOverlay}>
          <div style={s.modal}>
            <span style={{ ...s.corner, top: -1, left: -1, borderTop: "2px solid #00ff88", borderLeft: "2px solid #00ff88", boxShadow: "-2px -2px 12px #00ff88" }} />
            <span style={{ ...s.corner, bottom: -1, right: -1, borderBottom: "2px solid #00f5ff", borderRight: "2px solid #00f5ff", boxShadow: "2px 2px 12px #00f5ff" }} />

            {/* Success orb */}
            <div style={s.successOrb}>
              <div style={s.successOrbInner} />
              <svg width="36" height="36" viewBox="0 0 36 36" style={{ position: "absolute" }}>
                <polyline points="6,18 14,26 30,10" fill="none"
                  stroke="#00ff88" strokeWidth="2.5" strokeLinecap="round"
                  style={{ filter: "drop-shadow(0 0 6px #00ff88)" }} />
              </svg>
            </div>

            <h3 style={s.successTitle}>SUBMITTED</h3>
            <p style={s.successSub}>// PAYMENT_RECEIVED</p>

            <div style={s.divider}>
              <div style={{ ...s.divLine, background: "linear-gradient(90deg,transparent,rgba(0,255,136,0.3),transparent)" }} />
            </div>

            <p style={s.successMsg}>
              We will verify your payment soon. Till then —{" "}
              <span style={{ color: "#00f5ff" }}>explore all events!</span>
            </p>

            <button
              style={{ ...s.submitBtn, background: "rgba(0,255,136,0.12)", borderColor: "rgba(0,255,136,0.4)", color: "#00ff88", marginTop: "1rem" }}
              onClick={() => router.push("/events")}
            >
              EXPLORE EVENTS
            </button>
          </div>
        </div>
      )}

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
        @keyframes borderPulse { 0%,100%{box-shadow:0 0 20px rgba(0,245,255,0.07)} 50%{box-shadow:0 0 40px rgba(0,245,255,0.16)} }
        @keyframes alertSlide  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin        { to{transform:rotate(360deg)} }
        @keyframes successPop  { 0%{transform:scale(0.5);opacity:0} 70%{transform:scale(1.1)} 100%{transform:scale(1);opacity:1} }
        @keyframes amountPulse { 0%,100%{text-shadow:0 0 20px #ffff00,0 0 40px rgba(255,255,0,0.3)} 50%{text-shadow:0 0 36px #ffff00,0 0 72px rgba(255,255,0,0.6)} }
        input:-webkit-autofill,input:-webkit-autofill:hover,input:-webkit-autofill:focus {
          -webkit-box-shadow:0 0 0px 1000px #00050f inset !important;
          -webkit-text-fill-color:#e0e8ff !important; caret-color:#00f5ff;
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
    fontFamily: "'Rajdhani',sans-serif", color: "#e0e0ff",
    position: "relative", overflowX: "hidden",
    paddingTop: "5rem", paddingBottom: "3rem",
  },
  grid: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", backgroundImage: "linear-gradient(rgba(0,245,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.04) 1px,transparent 1px)", backgroundSize: "60px 60px", animation: "gridMove 8s linear infinite" },
  scanH: { position: "fixed", left: 0, right: 0, height: 1, background: "rgba(0,245,255,0.2)", boxShadow: "0 0 8px rgba(0,245,255,0.35)", animation: "scanH 7s linear infinite", zIndex: 1, pointerEvents: "none" },
  scanV: { position: "fixed", top: 0, bottom: 0, width: 1, background: "rgba(255,0,128,0.12)", animation: "scanV 11s linear infinite", zIndex: 1, pointerEvents: "none" },
  vignette: { position: "fixed", inset: 0, zIndex: 0, pointerEvents: "none", background: "radial-gradient(ellipse 78% 78% at 50% 50%,transparent 42%,rgba(2,0,16,0.92) 100%)" },
  blob: { position: "fixed", borderRadius: "50%", filter: "blur(90px)", zIndex: 0, pointerEvents: "none" },
  blob1: { width: 360, height: 360, background: "rgba(0,245,255,0.065)", top: "-12%", right: "-10%", animation: "blobFloat1 9s ease-in-out infinite" },
  blob2: { width: 280, height: 280, background: "rgba(191,0,255,0.065)", bottom: "-10%", left: "-8%", animation: "blobFloat2 11s ease-in-out infinite" },

  wrap: { position: "relative", zIndex: 10, maxWidth: 680, margin: "0 auto", padding: "0 1.5rem" },

  card: {
    position: "relative",
    background: "rgba(0,5,30,0.88)", backdropFilter: "blur(22px)",
    borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,245,255,0.18)",
    clipPath: "polygon(0 0,calc(100% - 22px) 0,100% 22px,100% 100%,22px 100%,0 calc(100% - 22px))",
    animation: "fadeUp 0.55s ease forwards, borderPulse 4s ease infinite",
  },
  corner: { position: "absolute", width: 16, height: 16 } as React.CSSProperties,
  topBar: { display: "flex", alignItems: "center", gap: 8, padding: "0.65rem 1.4rem", borderBottom: "1px solid rgba(0,245,255,0.09)", background: "rgba(0,0,20,0.5)" },
  dot: { width: 7, height: 7, borderRadius: "50%", background: "#00f5ff", boxShadow: "0 0 5px #00f5ff", display: "inline-block" },
  topBarLabel: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.56rem", letterSpacing: 3, color: "rgba(0,245,255,0.38)", marginLeft: "auto" },

  body: { padding: "1.8rem 2rem 2.4rem", display: "flex", flexDirection: "column" as const, gap: "1.2rem" },

  tag: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", letterSpacing: 4, color: "#ff0080", textShadow: "0 0 8px #ff0080" },
  title: { fontFamily: "'Orbitron',monospace", fontWeight: 900, lineHeight: 1.05 },
  titleCyan: { display: "block", fontSize: "2.2rem", color: "#00f5ff", animation: "glowPulse 3s ease infinite" },
  titleWhite: { display: "block", fontSize: "1.4rem", color: "rgba(220,230,255,0.9)", letterSpacing: 6 },
  divider: { display: "flex", alignItems: "center", gap: "0.7rem" },
  divLine: { flex: 1, height: 1, background: "linear-gradient(90deg,transparent,rgba(0,245,255,0.28),transparent)" },
  divText: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.5rem", letterSpacing: 3, color: "rgba(0,245,255,0.32)", whiteSpace: "nowrap" as const },

  alert: { padding: "10px 14px", background: "rgba(255,0,128,0.08)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(255,0,128,0.35)", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "#ff0080", letterSpacing: 1, animation: "alertSlide 0.3s ease forwards", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },

  autoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" },
  fieldWrap: { display: "flex", flexDirection: "column" as const, gap: "0.4rem" },
  label: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", letterSpacing: 3, textTransform: "uppercase" as const, color: "rgba(0,245,255,0.55)", transition: "color 0.2s,text-shadow 0.2s" },
  inputWrap: { display: "flex", alignItems: "center", background: "rgba(0,5,20,0.7)", borderWidth: 1, borderStyle: "solid", transition: "border-color 0.2s,box-shadow 0.2s", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))", position: "relative" },
  inputPrefix: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.85rem", padding: "0 0 0 12px", flexShrink: 0, transition: "color 0.2s" },
  input: { flex: 1, background: "transparent", borderWidth: 0, borderStyle: "solid", borderColor: "transparent", color: "#e0e8ff", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.8rem", letterSpacing: 1, padding: "10px 12px", width: "100%", caretColor: "#00f5ff" },
  lockIcon: { position: "absolute" as const, right: 10, fontSize: "0.65rem", opacity: 0.35 },

  /* QR section */
  qrSection: { display: "grid", gridTemplateColumns: "auto 1fr", gap: "2rem", alignItems: "center" },
  qrWrap: { padding: "0.8rem", background: "rgba(0,245,255,0.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,245,255,0.15)", clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))" },
  qrImg: { width: 140, height: 140, display: "block", filter: "brightness(0.95) contrast(1.1)" },
  amountWrap: { display: "flex", flexDirection: "column" as const, gap: "0.5rem" },
  amountLabel: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.6rem", letterSpacing: 4, color: "rgba(0,245,255,0.45)" },
  amount: { fontFamily: "'Orbitron',monospace", fontSize: "3rem", fontWeight: 900, color: "#ffff00", animation: "amountPulse 2.5s ease infinite", lineHeight: 1 },
  amountNote: { marginTop: "0.3rem" },

  /* Upload */
  uploadPlaceholder: { display: "flex", flexDirection: "column" as const, alignItems: "center", justifyContent: "center", gap: "0.5rem", padding: "1.5rem", background: "rgba(0,5,20,0.5)", borderWidth: 1, borderStyle: "dashed", borderColor: "rgba(0,245,255,0.15)", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },
  proofPreview: { display: "flex", alignItems: "center", gap: "1rem", padding: "0.8rem", background: "rgba(0,255,136,0.04)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.2)", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },
  proofImg: { width: 60, height: 60, objectFit: "cover" as const, borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.3)" },
  proofSuccess: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "#00ff88", letterSpacing: 2, textShadow: "0 0 8px #00ff88" },
  uploadRow: { display: "flex", gap: "0.8rem", alignItems: "center", flexWrap: "wrap" as const, marginTop: "0.5rem" },
  fileLabel: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", letterSpacing: 2, padding: "9px 16px", cursor: "pointer", background: "rgba(0,5,20,0.7)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,245,255,0.25)", color: "rgba(0,245,255,0.7)", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))" },
  fileName: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.62rem", color: "rgba(180,200,255,0.5)", letterSpacing: 1, flex: 1, overflow: "hidden" as const, textOverflow: "ellipsis" as const, whiteSpace: "nowrap" as const },
  uploadBtn: { fontFamily: "'Orbitron',monospace", fontSize: "0.65rem", letterSpacing: 3, padding: "9px 18px", cursor: "pointer", background: "rgba(0,245,255,0.1)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,245,255,0.35)", color: "#00f5ff", clipPath: "polygon(0 0,calc(100% - 8px) 0,100% 8px,100% 100%,8px 100%,0 calc(100% - 8px))", transition: "all 0.2s", flexShrink: 0 },
  uploadBtnHover: { background: "rgba(0,245,255,0.2)", borderColor: "#00f5ff", boxShadow: "0 0 16px rgba(0,245,255,0.25)" },

  /* Submit */
  submitBtn: { width: "100%", padding: "13px 24px", background: "linear-gradient(135deg,rgba(0,245,255,0.12),rgba(191,0,255,0.12))", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,245,255,0.38)", color: "#e0e8ff", cursor: "pointer", fontFamily: "'Orbitron',monospace", fontSize: "0.78rem", fontWeight: 700, letterSpacing: 3, textTransform: "uppercase" as const, clipPath: "polygon(0 0,calc(100% - 12px) 0,100% 12px,100% 100%,12px 100%,0 calc(100% - 12px))", transition: "all 0.22s ease", display: "flex", alignItems: "center", justifyContent: "center" },
  submitBtnHover: { background: "linear-gradient(135deg,rgba(0,245,255,0.22),rgba(191,0,255,0.22))", borderColor: "#00f5ff", color: "#00f5ff", boxShadow: "0 0 24px rgba(0,245,255,0.28)", transform: "translateY(-2px)" },
  btnDisabled: { opacity: 0.45, cursor: "not-allowed", transform: "none" },
  loadingInner: { display: "flex", alignItems: "center", gap: "0.6rem" },
  spinner: { width: 13, height: 13, borderRadius: "50%", borderWidth: 2, borderStyle: "solid", borderColor: "rgba(0,245,255,0.2)", borderTopColor: "#00f5ff", display: "inline-block", animation: "spin 0.9s linear infinite" },

  /* Modal */
  modalOverlay: { position: "fixed", inset: 0, background: "rgba(2,0,16,0.88)", backdropFilter: "blur(10px)", zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: "1.5rem" },
  modal: { position: "relative", width: "100%", maxWidth: 420, background: "rgba(0,5,30,0.96)", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.25)", backdropFilter: "blur(24px)", clipPath: "polygon(0 0,calc(100% - 20px) 0,100% 20px,100% 100%,20px 100%,0 calc(100% - 20px))", padding: "2rem", display: "flex", flexDirection: "column" as const, alignItems: "center", gap: "1rem" },
  successOrb: { width: 80, height: 80, borderRadius: "50%", borderWidth: 1, borderStyle: "solid", borderColor: "rgba(0,255,136,0.4)", boxShadow: "0 0 30px rgba(0,255,136,0.2)", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", animation: "successPop 0.5s ease forwards" },
  successOrbInner: { position: "absolute", inset: 8, borderRadius: "50%", background: "rgba(0,255,136,0.1)" },
  successTitle: { fontFamily: "'Orbitron',monospace", fontSize: "2rem", fontWeight: 900, color: "#00ff88", textShadow: "0 0 20px #00ff88" },
  successSub: { fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", letterSpacing: 4, color: "rgba(0,255,136,0.5)" },
  successMsg: { fontFamily: "'Rajdhani',sans-serif", fontSize: "1rem", color: "rgba(180,200,255,0.7)", textAlign: "center" as const, lineHeight: 1.7 },
};