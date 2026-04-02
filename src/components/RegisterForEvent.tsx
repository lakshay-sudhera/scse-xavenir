// "use client";
// import React, { useState } from "react";
// import axios, { AxiosResponse } from "axios";
// import { useRouter } from "next/navigation";
// import Modal from "@/components/Modal";

// interface RegisterForEventProps {
//   eventName: string;
//   maxPart: number;
//   minPart: number;
//   regFees: number;
// }

// interface ApiResponse {
//   error?: string;
//   message?: string;
// }

// const loadRazorpayScript = () =>
//   new Promise<void>((resolve, reject) => {
//     const script = document.createElement("script");
//     script.src = "https://checkout.razorpay.com/v1/checkout.js";
//     script.onload = () => resolve();
//     script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
//     document.body.appendChild(script);
//   });

// export default function RegisterForEvent({
//   eventName,
//   regFees,
//   maxPart,
//   minPart,
// }: RegisterForEventProps) {
//   const router = useRouter();

//   const [payer, setPayer] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [isOverlayOpen, setIsOverlayOpen] = useState(false);
//   const [participants, setParticipants] = useState<string[]>(Array(minPart).fill(""));
//   const [teamName, setTeamName] = useState("");

//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalTitle, setModalTitle] = useState("");
//   const [modalMessage, setModalMessage] = useState("");
//   const [modalType, setModalType] = useState<"success" | "error">("success");

//   const [image, setImage] = useState<File | null>(null);
//   const [imageUrl, setImageUrl] = useState("");
//   const [transactionId1, setTransactionId1] = useState("");
//   const [transactionId2, setTransactionId2] = useState("");
//   const [transactionId3, setTransactionId3] = useState("");

//   const showModal = (title: string, message: string, type: "success" | "error" = "success") => {
//     setModalTitle(title); setModalMessage(message); setModalType(type); setModalOpen(true);
//   };
//   const handleCloseModal = () => setModalOpen(false);
//   const handleOpenOverlay = () => setIsOverlayOpen(true);
//   const handleCloseOverlay = () => setIsOverlayOpen(false);

//   const handleAddParticipant = () => {
//     if (participants.length < maxPart) setParticipants(p => [...p, ""]);
//   };
//   const handleRemoveParticipant = (index: number) => {
//     if (participants.length > minPart) {
//       setParticipants(p => { const u = [...p]; u.splice(index, 1); return u; });
//     }
//   };
//   const handleParticipantChange = (index: number, value: string) => {
//     const u = [...participants]; u[index] = value.trim(); setParticipants(u);
//   };

//   const handlePayment = async () => {
//     setLoading(true);
//     try {
//       await loadRazorpayScript();
//       const response = await axios.post("/api/razorpay/eventFeesOrder", { eventName });
//       const data = response.data;
//       if (!data.success) { setLoading(false); alert("Failed to create order: " + data.message); setError("Please try later"); return; }
//       const { order } = data;
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
//         amount: order.amount, currency: order.currency,
//         name: "SCSE", description: "Test Transaction", order_id: order.id,
//         handler: async function (response: any) {
//           alert("Payment successful! See your registration in dashboard");
//           router.push("/dashboard");
//           await axios.post("/api/razorpay/verifyEventPayment", { ...response, teamName, members: participants, eventName });
//         },
//         theme: { color: "#00fff0" },
//         modal: { escape: false, ondismiss: () => { setLoading(false); } },
//       };
//       const rzp1 = new (window as any).Razorpay(options);
//       rzp1.on("payment.failed", () => setLoading(false));
//       rzp1.open();
//     } catch (error) {
//       setLoading(false);
//       console.error("Payment Error:", error);
//       alert("Something went wrong. Try later");
//     }
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     setLoading(true);
//     e.preventDefault();
//     if (!teamName.trim()) { setLoading(false); alert("Please enter a team name."); return; }
//     const formData = { teamName, members: participants, eventName };
//     try {
//       const response: AxiosResponse<ApiResponse> = await axios.post("/api/registerForEvent", formData);
//       if (response.status === 200) {
//         showModal("Registration Successful", "SUCCESS.", "success");
//         setTeamName(""); setParticipants([""]); setIsOverlayOpen(false);
//         router.push("/dashboard");
//       }
//     } catch (err: any) {
//       setLoading(false);
//       if (err.response) {
//         const status = err.response.status;
//         if (status === 420) {
//           const data: ApiResponse = err.response.data;
//           setError(data.error || data.message || "Paisa dena hoga bhai.");
//           if (typeof window !== "undefined") {
//             document.body.style.overflowY = "auto";
//             document.querySelectorAll(".kalaman").forEach(el => { (el as HTMLElement).style.maxHeight = "180vh"; });
//           }
//           setPayer(true);
//         } else {
//           const data: ApiResponse = err.response.data;
//           setError(data.error || data.message || "Unknown error occurred.");
//         }
//       } else {
//         setLoading(false);
//         setError(err.message || "Network error occurred.");
//       }
//     }
//   };

//   const handleImageUpload = async () => {
//     setError("");
//     if (!image) { setError("Please select an image to upload."); return; }
//     setLoading(true);
//     const data = new FormData();
//     data.append("file", image);
//     try {
//       const response = await axios.post(`/api/cloudinary/upload`, data);
//       setImageUrl(response.data.uploads.file.secure_url);
//     } catch (err) {
//       console.error("Image upload failed:", err);
//       setError("Image upload failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleNonPrimeNitianSubmit = async () => {
//     const requestData = { eventName, teamName, members: participants, paymentProof: imageUrl, transactionId1, transactionId2, transactionId3 };
//     try {
//       const res = await axios.post("/api/payAndRegisterForEvent", requestData);
//       console.log(res.data.data);
//       alert("As we verify, you will see it in dashboard");
//       router.push("/events");
//     } catch (error) {
//       setError("Fill the details properly or try again later");
//       console.log("Registration failed:", error);
//     }
//   };

//   return (
//     <>
//       {/* ── Trigger Button ── */}
//       <button
//         onClick={() => { handleOpenOverlay(); window.scrollTo(0, 0); document.body.style.overflowY = "hidden"; }}
//         className="rfe-trigger"
//       >
//         <span className="rfe-trigger-icon">⚡</span>
//         REGISTER FOR {eventName.toUpperCase()}
//       </button>

//       {/* ── Overlay ── */}
//       {isOverlayOpen && (
//         <div className="rfe-backdrop kalaman">
//           <div className="rfe-panel">
//             {/* Panel top bar */}
//             <div className="rfe-panel-topbar">
//               <span className="rfe-buf">REG.NODE</span>
//               <span className="rfe-bars"><b/><b/><b/></span>
//               <button
//                 onClick={() => { handleCloseOverlay(); document.body.style.overflowY = "auto"; }}
//                 className="rfe-close"
//               >ESC // CLOSE ✕</button>
//             </div>

//             {/* Panel header */}
//             <div className="rfe-panel-header">
//               <h2 className="rfe-panel-title">REGISTER FOR {eventName.toUpperCase()}</h2>
//               <div className="rfe-panel-title-bar"/>
//             </div>

//             {/* Error */}
//             {error && (
//               <div className="rfe-error">
//                 <span>⚠</span> {error}
//               </div>
//             )}

//             {/* Form */}
//             <form onSubmit={handleSubmit} className="rfe-form">
//               {/* Team name */}
//               <div className="rfe-field">
//                 <label className="rfe-label">TEAM NAME <span className="rfe-req">*</span></label>
//                 <input
//                   type="text"
//                   className="rfe-input"
//                   placeholder="Enter your team name"
//                   value={teamName}
//                   onChange={e => setTeamName(e.target.value)}
//                   required
//                 />
//               </div>

//               {/* Participants */}
//               {participants.map((value, i) => (
//                 <div key={i} className="rfe-field">
//                   <label className="rfe-label">PARTICIPANT {i + 1} <span className="rfe-hint">(SCSE-xxxxxxx)</span></label>
//                   <div className="rfe-field-row">
//                     <input
//                       type="text"
//                       placeholder="SCSE-1234567"
//                       className="rfe-input"
//                       value={value}
//                       onChange={e => handleParticipantChange(i, e.target.value)}
//                       required
//                     />
//                     {participants.length > minPart && (
//                       <button type="button" onClick={() => handleRemoveParticipant(i)} className="rfe-remove-btn">
//                         ✕
//                       </button>
//                     )}
//                   </div>
//                 </div>
//               ))}

//               {/* Add participant */}
//               {participants.length < maxPart && (
//                 <button type="button" onClick={handleAddParticipant} className="rfe-add-btn">
//                   + ADD PARTICIPANT
//                 </button>
//               )}

//               {/* Submit */}
//               <button type="submit" className="rfe-submit-btn" disabled={loading}>
//                 {loading ? <span className="rfe-loading">PROCESSING<span className="rfe-dots">...</span></span> : "REGISTER NODE"}
//               </button>
//             </form>

//             {/* ── Payer section ── */}
//             {payer && (
//               <div className="rfe-payer">
//                 <div className="rfe-payer-divider">
//                   <span className="rfe-div-line"/><span className="rfe-div-label">PAYMENT REQUIRED</span><span className="rfe-div-line"/>
//                 </div>

//                 <div className="rfe-qr-wrap">
//                   <img src="/scseqr.png" alt="SCSE QR" className="rfe-qr"/>
//                   <p className="rfe-pay-amount">PAY ₹{regFees}</p>
//                 </div>

//                 {error && <div className="rfe-error"><span>⚠</span> {error}</div>}

//                 {/* Upload */}
//                 <div className="rfe-field">
//                   <label className="rfe-label">UPLOAD PAYMENT PROOF</label>
//                   <input
//                     type="file"
//                     className="rfe-file-input"
//                     onChange={e => { if (e.target.files && e.target.files.length > 0) setImage(e.target.files[0]); }}
//                   />
//                   <button onClick={handleImageUpload} className="rfe-upload-btn" disabled={loading}>
//                     {loading ? "UPLOADING..." : imageUrl ? <span className="rfe-uploaded">✓ UPLOADED</span> : "UPLOAD"}
//                   </button>
//                 </div>

//                 {/* Transaction IDs */}
//                 <div className="rfe-field">
//                   <label className="rfe-label">TRANSACTION ID 1 <span className="rfe-req">*</span></label>
//                   <input type="text" placeholder="Transaction ID 1 (Required)" className="rfe-input"
//                     value={transactionId1} onChange={e => setTransactionId1(e.target.value)} required/>
//                 </div>
//                 <div className="rfe-field">
//                   <label className="rfe-label">TRANSACTION ID 2 <span className="rfe-hint">(Optional)</span></label>
//                   <input type="text" placeholder="Transaction ID 2" className="rfe-input"
//                     value={transactionId2} onChange={e => setTransactionId2(e.target.value)}/>
//                 </div>
//                 <div className="rfe-field">
//                   <label className="rfe-label">TRANSACTION ID 3 <span className="rfe-hint">(Optional)</span></label>
//                   <input type="text" placeholder="Transaction ID 3" className="rfe-input"
//                     value={transactionId3} onChange={e => setTransactionId3(e.target.value)}/>
//                 </div>

//                 <button onClick={handleNonPrimeNitianSubmit} className="rfe-final-btn">
//                   FINAL SUBMIT
//                 </button>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalTitle} message={modalMessage} type={modalType}/>

//       <style>{`
//         /* Trigger */
//         .rfe-trigger {
//           display: inline-flex; align-items: center; gap: 10px;
//           width: 100%; padding: 14px 20px; justify-content: center;
//           background: linear-gradient(90deg, #4a0fd4, #7b2ff7);
//           border: none; border-radius: 2px;
//           color: #fff; font-family: 'Orbitron', sans-serif;
//           font-size: .88rem; font-weight: 700; letter-spacing: .14em;
//           cursor: pointer;
//           clip-path: polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%);
//           transition: background .2s, box-shadow .2s, transform .15s;
//         }
//         .rfe-trigger:hover {
//           background: linear-gradient(90deg, #00b8b0, #00fff0);
//           color: #000;
//           box-shadow: 0 0 28px rgba(0,255,240,.45);
//           transform: scale(1.02);
//         }
//         .rfe-trigger-icon { font-size: 1.1rem; }

//         /* Backdrop */
//         .rfe-backdrop {
//           position: fixed; inset: 0; z-index: 50;
//           display: flex; align-items: center; justify-content: center;
//           background: rgba(0, 2, 14, 0.92);
//           backdrop-filter: blur(4px);
//           padding: 20px;
//           overflow-y: auto;
//         }

//         /* Panel */
//         .rfe-panel {
//           position: relative;
//           background: #060818;
//           border: 1px solid rgba(0,255,240,.25);
//           box-shadow: 0 0 40px rgba(0,255,240,.08), inset 0 0 40px rgba(0,255,240,.02);
//           width: 100%; max-width: 520px;
//           max-height: 90vh; overflow-y: auto;
//           border-radius: 2px;
//         }

//         /* Panel scrollbar */
//         .rfe-panel::-webkit-scrollbar { width: 4px; }
//         .rfe-panel::-webkit-scrollbar-track { background: rgba(0,255,240,.04); }
//         .rfe-panel::-webkit-scrollbar-thumb { background: rgba(0,255,240,.25); border-radius: 2px; }

//         /* Top bar */
//         .rfe-panel-topbar {
//           display: flex; align-items: center; gap: 8px;
//           padding: 6px 14px;
//           background: rgba(0,8,26,.95);
//           border-bottom: 1px solid rgba(0,255,240,.15);
//           font-family: 'Share Tech Mono', monospace; font-size: .6rem;
//           position: sticky; top: 0; z-index: 2;
//         }
//         .rfe-buf { color: #00fff0; letter-spacing: .1em; }
//         .rfe-bars { display: flex; gap: 3px; flex: 1; }
//         .rfe-bars b { display: block; width: 9px; height: 8px; background: rgba(0,255,240,.4); clip-path: polygon(0 0,100% 0,100% 55%,0 55%); }
//         .rfe-close {
//           background: transparent; border: none; color: rgba(255,45,120,.7);
//           font-family: 'Share Tech Mono', monospace; font-size: .6rem;
//           letter-spacing: .08em; cursor: pointer; transition: color .2s;
//         }
//         .rfe-close:hover { color: #ff2d78; }

//         /* Panel header */
//         .rfe-panel-header { padding: 20px 20px 0; }
//         .rfe-panel-title {
//           font-family: 'Orbitron', sans-serif; font-size: 1rem;
//           font-weight: 700; color: #fff; letter-spacing: .05em;
//           margin-bottom: 10px;
//         }
//         .rfe-panel-title-bar {
//           height: 2px;
//           background: linear-gradient(90deg, #ff2d78, #00fff0, transparent);
//           margin-bottom: 20px;
//         }

//         /* Error */
//         .rfe-error {
//           margin: 0 20px 16px;
//           display: flex; align-items: center; gap: 8px;
//           padding: 10px 14px;
//           background: rgba(255,45,120,.08);
//           border: 1px solid rgba(255,45,120,.3);
//           color: #ff2d78;
//           font-family: 'Share Tech Mono', monospace; font-size: .78rem;
//           border-radius: 2px;
//         }

//         /* Form */
//         .rfe-form { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 0; }

//         .rfe-field { margin-bottom: 16px; }
//         .rfe-label {
//           display: block; margin-bottom: 6px;
//           font-family: 'Share Tech Mono', monospace;
//           font-size: .65rem; letter-spacing: .15em;
//           color: rgba(0,255,240,.6);
//         }
//         .rfe-req { color: #ff2d78; }
//         .rfe-hint { color: rgba(200,220,255,.35); font-size: .6rem; }
//         .rfe-field-row { display: flex; gap: 8px; }

//         .rfe-input {
//           width: 100%; padding: 9px 12px;
//           background: rgba(0,8,26,.8);
//           border: 1px solid rgba(0,255,240,.2);
//           border-radius: 2px;
//           color: #fff;
//           font-family: 'Share Tech Mono', monospace; font-size: .82rem;
//           outline: none; transition: border-color .2s, box-shadow .2s;
//         }
//         .rfe-input:focus {
//           border-color: rgba(0,255,240,.55);
//           box-shadow: 0 0 10px rgba(0,255,240,.1);
//         }
//         .rfe-input::placeholder { color: rgba(200,220,255,.25); }

//         .rfe-remove-btn {
//           flex-shrink: 0; padding: 9px 12px;
//           background: rgba(255,45,120,.1);
//           border: 1px solid rgba(255,45,120,.3);
//           color: #ff2d78;
//           font-size: .8rem; cursor: pointer; border-radius: 2px;
//           transition: all .2s;
//         }
//         .rfe-remove-btn:hover { background: rgba(255,45,120,.2); border-color: #ff2d78; }

//         .rfe-add-btn {
//           margin-bottom: 16px; padding: 8px 16px;
//           background: rgba(0,255,128,.08);
//           border: 1px solid rgba(0,255,128,.25);
//           color: rgba(0,255,128,.8);
//           font-family: 'Orbitron', sans-serif; font-size: .7rem;
//           font-weight: 700; letter-spacing: .1em;
//           cursor: pointer; border-radius: 2px; transition: all .2s;
//         }
//         .rfe-add-btn:hover { background: rgba(0,255,128,.15); border-color: rgba(0,255,128,.5); }

//         .rfe-submit-btn {
//           width: 100%; padding: 12px;
//           background: linear-gradient(90deg, #4a0fd4, #7b2ff7);
//           border: none; border-radius: 2px;
//           color: #fff; font-family: 'Orbitron', sans-serif;
//           font-size: .82rem; font-weight: 700; letter-spacing: .12em;
//           cursor: pointer;
//           clip-path: polygon(8px 0%, 100% 0%, calc(100% - 8px) 100%, 0% 100%);
//           transition: background .2s, box-shadow .2s;
//         }
//         .rfe-submit-btn:hover:not(:disabled) {
//           background: linear-gradient(90deg, #00b8b0, #00fff0);
//           color: #000;
//           box-shadow: 0 0 20px rgba(0,255,240,.4);
//         }
//         .rfe-submit-btn:disabled { opacity: .6; cursor: not-allowed; }
//         .rfe-loading { display: flex; align-items: center; justify-content: center; gap: 2px; }
//         .rfe-dots { animation: dotPulse 1.2s ease infinite; letter-spacing: .05em; }
//         @keyframes dotPulse { 0%,100%{opacity:1} 50%{opacity:.3} }

//         /* Payer section */
//         .rfe-payer { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 14px; }
//         .rfe-payer-divider { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
//         .rfe-div-line { flex:1; height:1px; background:rgba(255,45,120,.25); }
//         .rfe-div-label { font-family:'Orbitron',sans-serif; font-size:.6rem; letter-spacing:.15em; color:#ff2d78; white-space:nowrap; }

//         .rfe-qr-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
//         .rfe-qr {
//           width:200px; height:200px; object-fit:cover;
//           border: 2px solid rgba(0,255,240,.3);
//           box-shadow: 0 0 20px rgba(0,255,240,.15);
//         }
//         .rfe-pay-amount {
//           font-family:'Orbitron',sans-serif; font-size:1.2rem; font-weight:700;
//           color:#00fff0; letter-spacing:.1em;
//         }

//         .rfe-file-input {
//           width: 100%; font-family:'Share Tech Mono',monospace; font-size:.75rem;
//           color: rgba(200,220,255,.7);
//         }
//         .rfe-file-input::file-selector-button {
//           padding: 6px 14px; margin-right: 12px;
//           background: rgba(0,255,240,.08);
//           border: 1px solid rgba(0,255,240,.25);
//           color: #00fff0;
//           font-family: 'Share Tech Mono', monospace; font-size: .7rem;
//           letter-spacing: .08em; cursor: pointer; border-radius: 2px;
//           transition: all .2s;
//         }
//         .rfe-file-input::file-selector-button:hover {
//           background: rgba(0,255,240,.18); border-color: rgba(0,255,240,.5);
//         }

//         .rfe-upload-btn {
//           width:100%; padding:9px;
//           background:rgba(0,255,240,.08);
//           border:1px solid rgba(0,255,240,.25);
//           color:#00fff0;
//           font-family:'Orbitron',sans-serif; font-size:.75rem; font-weight:700; letter-spacing:.1em;
//           cursor:pointer; border-radius:2px; transition:all .2s;
//         }
//         .rfe-upload-btn:hover:not(:disabled) { background:rgba(0,255,240,.18); border-color:rgba(0,255,240,.5); }
//         .rfe-upload-btn:disabled { opacity:.6; cursor:not-allowed; }
//         .rfe-uploaded { color:#00ff80; }

//         .rfe-final-btn {
//           width:100%; padding:12px;
//           background:linear-gradient(90deg,#ff2d78,#a020b0);
//           border:none; border-radius:2px;
//           color:#fff; font-family:'Orbitron',sans-serif;
//           font-size:.82rem; font-weight:700; letter-spacing:.12em;
//           cursor:pointer;
//           clip-path:polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%);
//           transition:all .2s;
//         }
//         .rfe-final-btn:hover { box-shadow:0 0 20px rgba(255,45,120,.45); transform:scale(1.01); }
//       `}</style>
//     </>
//   );
// }



"use client";
import React, { useState, useContext } from "react";
import axios, { AxiosResponse } from "axios";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";
import { UserContext } from "@/context/UserContext"; // adjust path if needed

interface RegisterForEventProps {
  eventName: string;
  maxPart: number;
  minPart: number;
  regFees: number;
}

interface ApiResponse {
  error?: string;
  message?: string;
}

const loadRazorpayScript = () =>
  new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });

export default function RegisterForEvent({
  eventName,
  regFees,
  maxPart,
  minPart,
}: RegisterForEventProps) {
  const router = useRouter();

  // ── Auth check ──
  const { userData } = useContext(UserContext);
  const isLoggedIn = !!userData;

  const [payer, setPayer] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isOverlayOpen, setIsOverlayOpen] = useState(false);
  const [participants, setParticipants] = useState<string[]>(Array(minPart).fill(""));
  const [teamName, setTeamName] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState<"success" | "error">("success");

  // Login-prompt toast state
  const [showLoginToast, setShowLoginToast] = useState(false);

  const [image, setImage] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState("");
  const [transactionId1, setTransactionId1] = useState("");
  const [transactionId2, setTransactionId2] = useState("");
  const [transactionId3, setTransactionId3] = useState("");

  const showModal = (title: string, message: string, type: "success" | "error" = "success") => {
    setModalTitle(title); setModalMessage(message); setModalType(type); setModalOpen(true);
  };
  const handleCloseModal = () => setModalOpen(false);

  // ── Auth-gated open ──
  const handleOpenOverlay = () => {
    if (!isLoggedIn) {
      setShowLoginToast(true);
      setTimeout(() => setShowLoginToast(false), 3500);
      return;
    }
    setIsOverlayOpen(true);
    window.scrollTo(0, 0);
    document.body.style.overflowY = "hidden";
  };

  const handleCloseOverlay = () => {
    setIsOverlayOpen(false);
    document.body.style.overflowY = "auto";
  };

  const handleAddParticipant = () => {
    if (participants.length < maxPart) setParticipants(p => [...p, ""]);
  };
  const handleRemoveParticipant = (index: number) => {
    if (participants.length > minPart)
      setParticipants(p => { const u = [...p]; u.splice(index, 1); return u; });
  };
  const handleParticipantChange = (index: number, value: string) => {
    const u = [...participants]; u[index] = value.trim(); setParticipants(u);
  };


  const handleSubmit = async (e: React.FormEvent) => {
    setLoading(true);
    e.preventDefault();
    if (!teamName.trim()) { setLoading(false); alert("Please enter a team name."); return; }
    const formData = { teamName, members: participants, eventName };
    try {
      const response: AxiosResponse<ApiResponse> = await axios.post("/api/registerForEvent", formData);
      if (response.status === 200) {
        showModal("Registration Successful", "SUCCESS.", "success");
        setTeamName(""); setParticipants([""]); setIsOverlayOpen(false);
        router.push("/dashboard");
      }
    } catch (err: any) {
      setLoading(false);
      if (err.response) {
        const status = err.response.status;
        if (status === 420) {
          const data: ApiResponse = err.response.data;
          setError(data.error || data.message || "Paisa dena hoga bhai.");
          if (typeof window !== "undefined") {
            document.body.style.overflowY = "auto";
            document.querySelectorAll(".kalaman").forEach(el => {
              (el as HTMLElement).style.maxHeight = "180vh";
            });
          }
          setPayer(true);
        } else {
          const data: ApiResponse = err.response.data;
          setError(data.error || data.message || "Unknown error occurred.");
        }
      } else {
        setLoading(false);
        setError(err.message || "Network error occurred.");
      }
    }
  };

  const handleImageUpload = async () => {
    setError("");
    if (!image) { setError("Please select an image to upload."); return; }
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    try {
      const response = await axios.post(`/api/cloudinary/upload`, data);
      setImageUrl(response.data.uploads.file.secure_url);
    } catch (err) {
      console.error("Image upload failed:", err);
      setError("Image upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNonPrimeNitianSubmit = async () => {
    const requestData = {
      eventName, teamName, members: participants,
      paymentProof: imageUrl, transactionId1, transactionId2, transactionId3,
    };
    try {
      await axios.post("/api/payAndRegisterForEvent", requestData);
      alert("As we verify, you will see it in dashboard");
      router.push("/events");
    } catch (error) {
      setError("Fill the details properly or try again later");
      console.log("Registration failed:", error);
    }
  };

  return (
    <>
      {/* ── Login toast ── */}
      {showLoginToast && (
        <div className="rfe-login-toast">
          <span className="rfe-toast-icon">⚠</span>
          <div>
            <p className="rfe-toast-title">ACCESS DENIED</p>
            <p className="rfe-toast-msg">Please login first to register for this event.</p>
          </div>
          <button className="rfe-toast-login" onClick={() => router.push("/login")}>
            LOGIN →
          </button>
        </div>
      )}

      {/* ── Trigger Button ── */}
      <button
        onClick={handleOpenOverlay}
        className={`rfe-trigger${!isLoggedIn ? " rfe-trigger-locked" : ""}`}
        title={!isLoggedIn ? "Please login first" : undefined}
      >
        <span className="rfe-trigger-icon">{isLoggedIn ? "⚡" : "🔒"}</span>
        REGISTER FOR {eventName.toUpperCase()}
      </button>

      {/* ── Overlay ── */}
      {isOverlayOpen && (
        <div className="rfe-backdrop kalaman">
          <div className="rfe-panel">
            {/* Panel top bar */}
            <div className="rfe-panel-topbar">
              <span className="rfe-buf">REG.NODE</span>
              <span className="rfe-bars"><b/><b/><b/></span>
              <button onClick={handleCloseOverlay} className="rfe-close">
                ESC // CLOSE ✕
              </button>
            </div>

            {/* Panel header */}
            <div className="rfe-panel-header">
              <h2 className="rfe-panel-title">REGISTER FOR {eventName.toUpperCase()}</h2>
              <div className="rfe-panel-title-bar"/>
            </div>

            {/* Error */}
            {error && (
              <div className="rfe-error">
                <span>⚠</span> {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="rfe-form">
              <div className="rfe-field">
                <label className="rfe-label">TEAM NAME <span className="rfe-req">*</span></label>
                <input
                  type="text" className="rfe-input"
                  placeholder="Enter your team name"
                  value={teamName} onChange={e => setTeamName(e.target.value)} required
                />
              </div>

              {participants.map((value, i) => (
                <div key={i} className="rfe-field">
                  <label className="rfe-label">
                    PARTICIPANT {i + 1} <span className="rfe-hint">(SCSE-xxxxxxx)</span>
                  </label>
                  <div className="rfe-field-row">
                    <input
                      type="text" placeholder="SCSE-1234567" className="rfe-input"
                      value={value} onChange={e => handleParticipantChange(i, e.target.value)} required
                    />
                    {participants.length > minPart && (
                      <button type="button" onClick={() => handleRemoveParticipant(i)} className="rfe-remove-btn">✕</button>
                    )}
                  </div>
                </div>
              ))}

              {participants.length < maxPart && (
                <button type="button" onClick={handleAddParticipant} className="rfe-add-btn">
                  + ADD PARTICIPANT
                </button>
              )}

              <button type="submit" className="rfe-submit-btn" disabled={loading}>
                {loading
                  ? <span className="rfe-loading">PROCESSING<span className="rfe-dots">...</span></span>
                  : "REGISTER NODE"
                }
              </button>
            </form>

            {/* ── Payer section ── */}
            {payer && (
              <div className="rfe-payer">
                <div className="rfe-payer-divider">
                  <span className="rfe-div-line"/>
                  <span className="rfe-div-label">PAYMENT REQUIRED</span>
                  <span className="rfe-div-line"/>
                </div>

                <div className="rfe-qr-wrap">
                  <img src="https://res.cloudinary.com/dtieuimsz/image/upload/v1774813669/Screenshot_2026-03-30_011644_ymfpe2.png" alt="SCSE QR" className="rfe-qr"/>
                  <p className="rfe-pay-amount">PAY ₹{regFees}</p>
                </div>

                {error && <div className="rfe-error"><span>⚠</span> {error}</div>}

                <div className="rfe-field">
                  <label className="rfe-label">UPLOAD PAYMENT PROOF</label>
                  <input
                    type="file" className="rfe-file-input"
                    onChange={e => { if (e.target.files?.[0]) setImage(e.target.files[0]); }}
                  />
                  <button onClick={handleImageUpload} className="rfe-upload-btn" disabled={loading}>
                    {loading ? "UPLOADING..." : imageUrl
                      ? <span className="rfe-uploaded">✓ UPLOADED</span>
                      : "UPLOAD"
                    }
                  </button>
                </div>

                <div className="rfe-field">
                  <label className="rfe-label">TRANSACTION ID 1 <span className="rfe-req">*</span></label>
                  <input type="text" placeholder="Transaction ID 1 (Required)" className="rfe-input"
                    value={transactionId1} onChange={e => setTransactionId1(e.target.value)} required/>
                </div>
                <div className="rfe-field">
                  <label className="rfe-label">TRANSACTION ID 2 <span className="rfe-hint">(Optional)</span></label>
                  <input type="text" placeholder="Transaction ID 2" className="rfe-input"
                    value={transactionId2} onChange={e => setTransactionId2(e.target.value)}/>
                </div>
                <div className="rfe-field">
                  <label className="rfe-label">TRANSACTION ID 3 <span className="rfe-hint">(Optional)</span></label>
                  <input type="text" placeholder="Transaction ID 3" className="rfe-input"
                    value={transactionId3} onChange={e => setTransactionId3(e.target.value)}/>
                </div>

                <button onClick={handleNonPrimeNitianSubmit} className="rfe-final-btn">
                  FINAL SUBMIT
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={modalTitle} message={modalMessage} type={modalType}/>

      <style>{`
        /* ── Login Toast ── */
        .rfe-login-toast {
          position: fixed; bottom: 32px; left: 50%; transform: translateX(-50%);
          z-index: 100;
          display: flex; align-items: center; gap: 14px;
          padding: 16px 22px;
          background: rgba(6, 8, 24, 0.97);
          border: 1px solid rgba(255,45,120,.5);
          box-shadow: 0 0 30px rgba(255,45,120,.2), 0 0 60px rgba(255,45,120,.08);
          border-radius: 2px;
          min-width: 340px; max-width: 90vw;
          animation: toastIn .3s ease;
        }
        @keyframes toastIn {
          from { opacity:0; transform: translateX(-50%) translateY(16px); }
          to   { opacity:1; transform: translateX(-50%) translateY(0); }
        }
        .rfe-toast-icon { font-size: 1.4rem; color: #ff2d78; flex-shrink: 0; }
        .rfe-toast-title {
          font-family: 'Orbitron', sans-serif; font-size: .82rem;
          font-weight: 700; color: #ff2d78; letter-spacing: .1em;
          margin-bottom: 3px;
        }
        .rfe-toast-msg {
          font-family: 'Share Tech Mono', monospace; font-size: .8rem;
          color: rgba(200,220,255,.65);
        }
        .rfe-toast-login {
          margin-left: auto; flex-shrink: 0;
          padding: 8px 16px;
          background: rgba(255,45,120,.12);
          border: 1px solid rgba(255,45,120,.4);
          color: #ff2d78;
          font-family: 'Orbitron', sans-serif; font-size: .72rem;
          font-weight: 700; letter-spacing: .1em;
          cursor: pointer; border-radius: 2px; transition: all .2s;
        }
        .rfe-toast-login:hover {
          background: rgba(255,45,120,.25);
          border-color: #ff2d78;
          box-shadow: 0 0 12px rgba(255,45,120,.3);
        }

        /* ── Trigger ── */
        .rfe-trigger {
          display: inline-flex; align-items: center; gap: 10px;
          width: 100%; padding: 15px 20px; justify-content: center;
          background: #ff2d78;
          border: none; border-radius: 4px;
          color: #fff; font-family: 'Orbitron', sans-serif;
          font-size: 1rem; font-weight: 700; letter-spacing: .14em;
          cursor: pointer;
          clip-path: none;
          box-shadow: 0 0 18px rgba(255,45,120,.35);
          transition: background .2s, box-shadow .2s, transform .15s, opacity .2s;
        }
        .rfe-trigger:hover:not(.rfe-trigger-locked) {
          background: #ff5599;
          box-shadow: 0 0 32px rgba(255,45,120,.6);
          transform: scale(1.02);
        }
        /* Locked state */
        .rfe-trigger-locked {
          background: rgba(255,45,120,.4);
          border: 1px solid rgba(255,45,120,.4);
          cursor: pointer;
          opacity: 0.75;
          box-shadow: none;
        }
        .rfe-trigger-locked:hover {
          background: rgba(255,45,120,.55);
          border-color: #ff2d78;
          box-shadow: 0 0 16px rgba(255,45,120,.3);
          opacity: 1;
        }
        .rfe-trigger-icon { font-size: 1.15rem; }

        /* ── Backdrop ── */
        .rfe-backdrop {
          position: fixed; inset: 0; z-index: 50;
          display: flex; align-items: center; justify-content: center;
          background: rgba(0, 2, 14, 0.92);
          backdrop-filter: blur(4px);
          padding: 20px; overflow-y: auto;
        }

        /* ── Panel ── */
        .rfe-panel {
          position: relative;
          background: #060818;
          border: 1px solid rgba(0,255,240,.25);
          box-shadow: 0 0 40px rgba(0,255,240,.08), inset 0 0 40px rgba(0,255,240,.02);
          width: 100%; max-width: 540px;
          max-height: 90vh; overflow-y: auto;
          border-radius: 2px;
        }
        .rfe-panel::-webkit-scrollbar { width: 4px; }
        .rfe-panel::-webkit-scrollbar-track { background: rgba(0,255,240,.04); }
        .rfe-panel::-webkit-scrollbar-thumb { background: rgba(0,255,240,.25); border-radius: 2px; }

        /* Top bar */
        .rfe-panel-topbar {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 16px;
          background: rgba(0,8,26,.95);
          border-bottom: 1px solid rgba(0,255,240,.15);
          font-family: 'Share Tech Mono', monospace; font-size: .72rem;
          position: sticky; top: 0; z-index: 2;
        }
        .rfe-buf { color: #00fff0; letter-spacing: .1em; }
        .rfe-bars { display: flex; gap: 3px; flex: 1; }
        .rfe-bars b { display: block; width: 9px; height: 8px; background: rgba(0,255,240,.4); clip-path: polygon(0 0,100% 0,100% 55%,0 55%); }
        .rfe-close {
          background: transparent; border: none; color: rgba(255,45,120,.7);
          font-family: 'Share Tech Mono', monospace; font-size: .72rem;
          letter-spacing: .08em; cursor: pointer; transition: color .2s;
        }
        .rfe-close:hover { color: #ff2d78; }

        /* Panel header */
        .rfe-panel-header { padding: 22px 22px 0; }
        .rfe-panel-title {
          font-family: 'Orbitron', sans-serif; font-size: 1.1rem;
          font-weight: 700; color: #fff; letter-spacing: .05em; margin-bottom: 10px;
        }
        .rfe-panel-title-bar {
          height: 2px;
          background: linear-gradient(90deg, #ff2d78, #00fff0, transparent);
          margin-bottom: 22px;
        }

        /* Error */
        .rfe-error {
          margin: 0 22px 16px;
          display: flex; align-items: center; gap: 8px;
          padding: 11px 14px;
          background: rgba(255,45,120,.08);
          border: 1px solid rgba(255,45,120,.3);
          color: #ff2d78;
          font-family: 'Share Tech Mono', monospace; font-size: .85rem;
          border-radius: 2px;
        }

        /* Form */
        .rfe-form { padding: 0 22px 22px; display: flex; flex-direction: column; }

        .rfe-field { margin-bottom: 18px; }
        .rfe-label {
          display: block; margin-bottom: 7px;
          font-family: 'Share Tech Mono', monospace;
          font-size: .75rem; letter-spacing: .15em;
          color: rgba(0,255,240,.65);
        }
        .rfe-req { color: #ff2d78; }
        .rfe-hint { color: rgba(200,220,255,.35); font-size: .68rem; }
        .rfe-field-row { display: flex; gap: 8px; }

        .rfe-input {
          width: 100%; padding: 10px 14px;
          background: rgba(0,8,26,.8);
          border: 1px solid rgba(0,255,240,.2);
          border-radius: 2px; color: #fff;
          font-family: 'Share Tech Mono', monospace; font-size: .9rem;
          outline: none; transition: border-color .2s, box-shadow .2s;
        }
        .rfe-input:focus {
          border-color: rgba(0,255,240,.55);
          box-shadow: 0 0 10px rgba(0,255,240,.1);
        }
        .rfe-input::placeholder { color: rgba(200,220,255,.25); }

        .rfe-remove-btn {
          flex-shrink: 0; padding: 10px 13px;
          background: rgba(255,45,120,.1);
          border: 1px solid rgba(255,45,120,.3);
          color: #ff2d78; font-size: .85rem;
          cursor: pointer; border-radius: 2px; transition: all .2s;
        }
        .rfe-remove-btn:hover { background: rgba(255,45,120,.2); border-color: #ff2d78; }

        .rfe-add-btn {
          margin-bottom: 18px; padding: 10px 18px;
          background: rgba(0,255,128,.08);
          border: 1px solid rgba(0,255,128,.25);
          color: rgba(0,255,128,.85);
          font-family: 'Orbitron', sans-serif; font-size: .8rem;
          font-weight: 700; letter-spacing: .1em;
          cursor: pointer; border-radius: 2px; transition: all .2s; width: 100%;
        }
        .rfe-add-btn:hover { background: rgba(0,255,128,.15); border-color: rgba(0,255,128,.5); }

        .rfe-submit-btn {
          width: 100%; padding: 14px;
          background: linear-gradient(90deg, #4a0fd4, #7b2ff7);
          border: none; border-radius: 4px;
          color: #fff; font-family: 'Orbitron', sans-serif;
          font-size: .92rem; font-weight: 700; letter-spacing: .12em;
          cursor: pointer;
          clip-path: none;
          transition: background .2s, box-shadow .2s;
        }
        .rfe-submit-btn:hover:not(:disabled) {
          background: linear-gradient(90deg, #00b8b0, #00fff0);
          color: #000; box-shadow: 0 0 20px rgba(0,255,240,.4);
        }
        .rfe-submit-btn:disabled { opacity: .6; cursor: not-allowed; }
        .rfe-loading { display: flex; align-items: center; justify-content: center; gap: 2px; }
        .rfe-dots { animation: dotPulse 1.2s ease infinite; letter-spacing: .05em; }
        @keyframes dotPulse { 0%,100%{opacity:1} 50%{opacity:.3} }

        /* Payer */
        .rfe-payer { padding: 0 22px 22px; display: flex; flex-direction: column; gap: 14px; }
        .rfe-payer-divider { display:flex; align-items:center; gap:10px; margin-bottom:4px; }
        .rfe-div-line { flex:1; height:1px; background:rgba(255,45,120,.25); }
        .rfe-div-label { font-family:'Orbitron',sans-serif; font-size:.7rem; letter-spacing:.15em; color:#ff2d78; white-space:nowrap; }

        .rfe-qr-wrap { display:flex; flex-direction:column; align-items:center; gap:10px; }
        .rfe-qr { width:200px; height:200px; object-fit:cover; border: 2px solid rgba(0,255,240,.3); box-shadow: 0 0 20px rgba(0,255,240,.15); }
        .rfe-pay-amount { font-family:'Orbitron',sans-serif; font-size:1.3rem; font-weight:700; color:#00fff0; letter-spacing:.1em; }

        .rfe-file-input { width:100%; font-family:'Share Tech Mono',monospace; font-size:.82rem; color:rgba(200,220,255,.7); }
        .rfe-file-input::file-selector-button {
          padding: 7px 14px; margin-right: 12px;
          background: rgba(0,255,240,.08); border: 1px solid rgba(0,255,240,.25);
          color: #00fff0; font-family:'Share Tech Mono',monospace; font-size:.75rem;
          letter-spacing:.08em; cursor:pointer; border-radius:2px; transition:all .2s;
        }
        .rfe-file-input::file-selector-button:hover { background:rgba(0,255,240,.18); border-color:rgba(0,255,240,.5); }

        .rfe-upload-btn {
          width:100%; padding:10px;
          background:rgba(0,255,240,.08); border:1px solid rgba(0,255,240,.25);
          color:#00fff0; font-family:'Orbitron',sans-serif; font-size:.82rem;
          font-weight:700; letter-spacing:.1em; cursor:pointer; border-radius:2px; transition:all .2s;
        }
        .rfe-upload-btn:hover:not(:disabled) { background:rgba(0,255,240,.18); border-color:rgba(0,255,240,.5); }
        .rfe-upload-btn:disabled { opacity:.6; cursor:not-allowed; }
        .rfe-uploaded { color:#00ff80; }

        .rfe-final-btn {
          width:100%; padding:14px;
          background:linear-gradient(90deg,#ff2d78,#a020b0);
          border:none; border-radius:4px; color:#fff;
          font-family:'Orbitron',sans-serif; font-size:.92rem; font-weight:700; letter-spacing:.12em;
          cursor:pointer;
          clip-path:none;
          transition:all .2s;
        }
        .rfe-final-btn:hover { box-shadow:0 0 20px rgba(255,45,120,.45); transform:scale(1.01); }
      `}</style>
    </>
  );
}