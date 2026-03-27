// "use client";

// import { useEffect, useState, useRef, useContext } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";
// import { UserContext } from "@/context/UserContext";
// import "./dashboard.css";
// import Loading from "@/components/Loading";

// type User = {
//   fullName: string;
//   email: string;
//   userID: string;
//   role: string;
//   isNitian: boolean;
//   isFromCse: boolean;
//   isPrime: boolean;
//   collegeName: string;
//   phone?: string;
//   gender?: string;
//   profilePic?: string;
// };

// type Tab = "overview" | "events" | "profile" | "receipt" | "certificates" | "notifications" | "community";

// export default function Dashboard() {
//   const router = useRouter();
//   const { userData, setUserData } = useContext(UserContext);
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [ready, setReady] = useState(false);
//   const mountTime = useRef(Date.now());
//   const [tab, setTab] = useState<Tab>("overview");
//   const [events, setEvents] = useState<any[]>([]);
//   const [glitch, setGlitch] = useState(false);

//   // profile edit
//   const [editMode, setEditMode] = useState(false);
//   const [phone, setPhone] = useState("");
//   const [gender, setGender] = useState("");
//   const [saving, setSaving] = useState(false);
//   const [saveMsg, setSaveMsg] = useState("");

//   // profile pic
//   const [uploading, setUploading] = useState(false);
//   const [picPreview, setPicPreview] = useState<string>("");
//   const fileRef = useRef<HTMLInputElement>(null);

//   useEffect(() => {
//     mountTime.current = Date.now();

//     // Fetch user data
//     fetch("/api/users/getCurrent")
//       .then(r => r.ok ? r.json() : Promise.reject())
//       .then(d => {
//         setUser(d.data);
//         setPhone(d.data.phone || "");
//         setGender(d.data.gender || "");
//         setPicPreview(d.data.profilePic || "");
//         setLoading(false);

//         // How long did the fetch take?
//         const elapsed = Date.now() - mountTime.current;
//         const remaining = Math.max(0, 2000 - elapsed);

//         // Wait out the remaining time before showing dashboard
//         setTimeout(() => setReady(true), remaining);
//       })
//       .catch(() => router.push("/login"));
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

//   useEffect(() => {
//     const id = setInterval(() => {
//       setGlitch(true);
//       setTimeout(() => setGlitch(false), 400);
//     }, 7000);
//     return () => clearInterval(id);
//   }, []);

//   useEffect(() => {
//     if (!user) return;
//     fetch("/api/users/eventRegistrations", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ userID: user.userID }),
//     })
//       .then(r => r.json())
//       .then(d => setEvents(d.data || []))
//       .catch(() => {});
//   }, [user]);

//   const handleSave = async () => {
//     setSaving(true); setSaveMsg("");
//     try {
//       const res = await fetch("/api/users/update", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ phone, gender }),
//       });
//       const d = await res.json();
//       if (res.ok) {
//         setUser(prev => ({ ...prev!, ...d.data }));
//         setUserData({ ...userData!, ...d.data });
//         setSaveMsg("// CHANGES_SAVED");
//         setEditMode(false);
//       } else { setSaveMsg("// ERROR: " + d.message); }
//     } catch { setSaveMsg("// NETWORK_ERROR"); }
//     setSaving(false);
//   };

//   const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     // show local preview immediately
//     const localUrl = URL.createObjectURL(file);
//     setPicPreview(localUrl);
//     setUploading(true);
//     try {
//       const form = new FormData();
//       form.append("file", file);
//       const res = await fetch("/api/cloudinary/upload", { method: "POST", body: form });
//       const d = await res.json();
//       const url = d.uploads?.file?.secure_url;
//       if (!url) throw new Error("no url");
//       const res2 = await fetch("/api/users/update", {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ profilePic: url }),
//       });
//       if (res2.ok) {
//         setPicPreview(url);
//         setUser(prev => ({ ...prev!, profilePic: url }));
//         setUserData({ ...userData!, profilePic: url } as any);
//       }
//     } catch { setPicPreview(user?.profilePic || ""); }
//     setUploading(false);
//   };

//   const _handleLogout = async () => {
//     await fetch("/api/auth/logout", { method: "POST" });
//     setUserData(null);
//     router.push("/");
//   };

//   if (!ready) return <Loading />;

//   const tabs: { key: Tab; label: string; icon: string }[] = [
//     { key: "overview",      label: "OVERVIEW",      icon: "◈" },
//     { key: "profile",       label: "PROFILE",       icon: "✦" },
//     { key: "events",        label: "EVENTS",        icon: "◆" },
//     { key: "receipt",       label: "RECEIPT",       icon: "◉" },
//     { key: "certificates",  label: "CERTIFICATES",  icon: "★" },
//     { key: "notifications", label: "NOTIFICATIONS", icon: "◎" },
//     { key: "community",     label: "COMMUNITY",     icon: "⬡" },
//   ];

//   const firstName = user?.fullName?.split(" ")[0]?.toUpperCase() ?? "AGENT";

//   return (
//     <div className="db-root">
//       {/* backgrounds matching home page */}
//       <div className="db-grid-bg" />
//       <div className="db-scanlines" />
//       <div className="db-corner-glow" />

//       <div className="db-wrap">

//         {/* ── HERO HEADER ── */}
//         <section className="db-hero">
//           <div className="db-hero-tag">
//             <span className="db-hero-tag-line" />
//             <span>SYSTEM ACCESS GRANTED</span>
//             <span className="db-pulse-dot" />
//           </div>
//           <h1 className={`db-hero-title${glitch ? " db-glitch" : ""}`} data-text={`WELCOME BACK, ${firstName}`}>
//             WELCOME BACK,{" "}
//             <span className="db-hero-accent">{firstName}</span>
//           </h1>
//           <p className="db-hero-sub">
//             <span>USER_ID:</span> {user?.userID} &nbsp;|&nbsp;
//             <span>ROLE:</span> {user?.role?.toUpperCase()} &nbsp;|&nbsp;
//             <span>STATUS:</span> <span style={{ color: "#ff0080" }}>ACTIVE</span>
//           </p>
//           <div className="db-badge-row">
//             {user?.isNitian  && <span className="db-badge db-badge-cyan">◈ NIT JAMSHEDPUR</span>}
//             {user?.isFromCse && <span className="db-badge db-badge-pink">◆ SCSE MEMBER</span>}
//             {user?.isPrime   && <span className="db-badge db-badge-yellow">★ PRIME ACCESS</span>}
//           </div>
//         </section>

//         {/* ── TERMINAL TAB BAR (desktop) ── */}
//         <div className="db-terminal">
//           <div className="db-term-bar">
//             <div className="db-term-dots"><span /><span /><span /></div>
//             <span className="db-term-title">xavenir@nitjsr:~/dashboard$</span>
//             <span className="db-term-status">SESSION ACTIVE</span>
//           </div>
//           <div className="db-tabs">
//             {tabs.map(t => (
//               <button
//                 key={t.key}
//                 className={`db-tab${tab === t.key ? " db-tab-active" : ""}`}
//                 onClick={() => setTab(t.key)}
//               >
//                 <span className="db-tab-icon">{t.icon}</span>
//                 {t.label}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* ── MOBILE BOTTOM TAB BAR ── */}
//         <div className="db-mobile-tabs">
//           {tabs.map(t => (
//             <button
//               key={t.key}
//               className={`db-mobile-tab${tab === t.key ? " db-mobile-tab-active" : ""}`}
//               onClick={() => setTab(t.key)}
//             >
//               <span className="db-mobile-tab-icon">{t.icon}</span>
//               <span className="db-mobile-tab-label">{t.label}</span>
//             </button>
//           ))}
//         </div>

//         {/* ── CONTENT ── */}
//         <div className="db-content">

//           {/* OVERVIEW */}
//           {tab === "overview" && (
//             <div className="db-section">
//               <div className="db-section-label">// user.status()</div>

//               {/* Two-col layout: profile card + payment status */}
//               <div className="db-overview-grid">

//                 {/* Profile card */}
//                 <div className="db-card">
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" />

//                   {/* Avatar */}
//                   <div className="db-avatar-wrap" onClick={() => fileRef.current?.click()} title="Change photo">
//                     {picPreview
//                       ? <img src={picPreview} alt="avatar" className="db-avatar-img" />
//                       : <span className="db-avatar-letter">{user?.fullName?.charAt(0).toUpperCase()}</span>
//                     }
//                     <div className="db-avatar-overlay">
//                       {uploading ? <span className="db-spin">◌</span> : "✎"}
//                     </div>
//                     <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicUpload} />
//                   </div>

//                   <h2 className="db-profile-name">{user?.fullName?.toUpperCase()}</h2>
//                   <p className="db-profile-role">{user?.role?.toUpperCase()}</p>

//                   <div className="db-profile-divider" />

//                   <div className="db-profile-fields">
//                     {[
//                       { label: "EMAIL",   val: user?.email },
//                       { label: "COLLEGE", val: user?.collegeName },
//                       { label: "PHONE",   val: user?.phone || "—" },
//                       { label: "GENDER",  val: user?.gender || "—" },
//                     ].map(f => (
//                       <div key={f.label} className="db-pf-row">
//                         <span className="db-pf-label">{f.label}</span>
//                         <span className="db-pf-val">{f.val}</span>
//                       </div>
//                     ))}
//                   </div>

//                   <button className="db-edit-profile-btn" onClick={() => { setTab("profile"); setEditMode(true); }}>
//                     ✎ &nbsp;EDIT PROFILE
//                   </button>
//                 </div>

//                 {/* Payment / status card */}
//                 <div className="db-card">
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />

//                   <div className="db-section-label" style={{ marginBottom: 16 }}>// payment.status()</div>

//                   {user?.isPrime ? (
//                     <div className="db-status-ok">
//                       <span className="db-pulse-dot" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
//                       <span style={{ color: "#00ff88", fontFamily: "'Inter',sans-serif", fontWeight: 700, letterSpacing: 1, fontSize: "1rem" }}>
//                         &nbsp;REGISTRATION COMPLETE
//                       </span>
//                       <p style={{ color: "rgba(180,200,255,0.5)", fontSize: "0.82rem", marginTop: 12, fontFamily: "'Rajdhani',sans-serif" }}>
//                         Full access granted to all events and features.
//                       </p>
//                     </div>
//                   ) : (
//                     <div>
//                       <p style={{ color: "rgba(180,200,255,0.7)", fontFamily: "'Rajdhani',sans-serif", marginBottom: 8 }}>
//                         Registration payment is pending.
//                       </p>
//                       <p style={{ color: "#00ff88", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>
//                         // email_verified ✓
//                       </p>
//                       <p style={{ color: "rgba(180,200,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: "0.85rem", marginBottom: 24 }}>
//                         Complete payment to unlock all features.
//                       </p>
//                       <Link href="/payreg" className="db-btn-primary">
//                         <span>// PAY NOW</span>
//                       </Link>
//                     </div>
//                   )}

//                   <div className="db-profile-divider" style={{ margin: "24px 0 16px" }} />
//                   <div className="db-section-label" style={{ marginBottom: 12 }}>// quick_nav()</div>
//                   <div className="db-quick-nav">
//                     {tabs.filter(t => t.key !== "overview").map(t => (
//                       <button key={t.key} className="db-quick-btn" onClick={() => setTab(t.key)}>
//                         {t.icon} {t.label} ›
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* EVENTS */}
//           {tab === "events" && (
//             <div className="db-section">
//               <div className="db-section-label">// events.registered()</div>
//               {events.length === 0 ? (
//                 <div className="db-empty">
//                   <div className="db-card" style={{ alignItems: "center", textAlign: "center", padding: "3rem 2rem" }}>
//                     <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                     <div style={{ fontSize: "2.5rem", opacity: 0.4, marginBottom: 16 }}>📅</div>
//                     <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.85rem", letterSpacing: 3, color: "var(--cyan)", marginBottom: 10 }}>
//                       NO REGISTERED EVENTS
//                     </h3>
//                     <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.5)", maxWidth: 380, marginBottom: 24 }}>
//                       You haven't registered for any events yet. Explore our events and join the action!
//                     </p>
//                     <Link href="/events" className="db-btn-outline">
//                       ◆ EXPLORE OTHER EVENTS ⚡
//                     </Link>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="db-events-list">
//                   {events.map((ev, i) => (
//                     <div key={i} className="db-event-row">
//                       <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                       <span className="db-event-id">[{String(i + 1).padStart(2, "0")}]</span>
//                       <span className="db-event-name">{ev.eventName || ev.name || "Event"}</span>
//                       <span className="db-event-status">◉ REGISTERED</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}

//           {/* PROFILE */}
//           {tab === "profile" && (
//             <div className="db-section">
//               <div className="db-section-label">// profile.edit()</div>
//               <div className="db-profile-grid">

//                 {/* Pic upload card */}
//                 <div className="db-card" style={{ alignItems: "center" }}>
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" />
//                   <div className="db-section-label" style={{ marginBottom: 16, alignSelf: "flex-start" }}>// avatar.upload()</div>
//                   <div className="db-avatar-wrap db-avatar-lg" onClick={() => fileRef.current?.click()}>
//                     {picPreview
//                       ? <img src={picPreview} alt="avatar" className="db-avatar-img" />
//                       : <span className="db-avatar-letter" style={{ fontSize: "3rem" }}>{user?.fullName?.charAt(0).toUpperCase()}</span>
//                     }
//                     <div className="db-avatar-overlay">
//                       {uploading ? <span className="db-spin">◌</span> : "⬆ UPLOAD"}
//                     </div>
//                     <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicUpload} />
//                   </div>
//                   <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "rgba(0,245,255,0.45)", marginTop: 12, textAlign: "center" }}>
//                     {uploading ? "// UPLOADING..." : "// CLICK TO CHANGE PHOTO"}
//                   </p>
//                 </div>

//                 {/* Edit fields card */}
//                 <div className="db-card">
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />
//                   <div className="db-section-label" style={{ marginBottom: 16 }}>// fields.update()</div>

//                   <div className="db-edit-fields">
//                     {[
//                       { label: "FULL NAME", val: user?.fullName, editable: false },
//                       { label: "EMAIL",     val: user?.email,    editable: false },
//                       { label: "COLLEGE",   val: user?.collegeName, editable: false },
//                     ].map(f => (
//                       <div key={f.label} className="db-edit-row">
//                         <span className="db-edit-label">{f.label}</span>
//                         <span className="db-edit-static">{f.val}</span>
//                       </div>
//                     ))}

//                     <div className="db-edit-row">
//                       <span className="db-edit-label">PHONE</span>
//                       {editMode
//                         ? <input className="db-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" />
//                         : <span className="db-edit-static">{user?.phone || <span style={{ opacity: 0.35 }}>not set</span>}</span>
//                       }
//                     </div>

//                     <div className="db-edit-row">
//                       <span className="db-edit-label">GENDER</span>
//                       {editMode
//                         ? (
//                           <select className="db-input" value={gender} onChange={e => setGender(e.target.value)}>
//                             <option value="">Prefer not to say</option>
//                             <option value="male">Male</option>
//                             <option value="female">Female</option>
//                             <option value="non-binary">Non-binary</option>
//                             <option value="genderqueer">Genderqueer</option>
//                             <option value="genderfluid">Genderfluid</option>
//                             <option value="agender">Agender</option>
//                             <option value="other">Other</option>
//                           </select>
//                         )
//                         : <span className="db-edit-static">{user?.gender || <span style={{ opacity: 0.35 }}>not set</span>}</span>
//                       }
//                     </div>
//                   </div>

//                   <div className="db-edit-actions">
//                     {editMode ? (
//                       <>
//                         <button className="db-btn-primary" onClick={handleSave} disabled={saving}>
//                           <span>{saving ? "// SAVING..." : "// SAVE_CHANGES"}</span>
//                         </button>
//                         <button className="db-btn-outline" onClick={() => { setEditMode(false); setSaveMsg(""); }}>
//                           CANCEL
//                         </button>
//                       </>
//                     ) : (
//                       <button className="db-btn-primary" onClick={() => setEditMode(true)}>
//                         <span>✎ &nbsp;EDIT PROFILE</span>
//                       </button>
//                     )}
//                     {saveMsg && <span className="db-save-msg">{saveMsg}</span>}
//                   </div>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* RECEIPT */}
//           {tab === "receipt" && (
//             <div className="db-section">
//               <div className="db-section-label">// receipt.payment()</div>
//               <div className="db-card">
//                 <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                 <div className="db-card-top-bar" />
//                 <div className="db-card-heading">PAYMENT STATUS</div>
//                 {user?.isPrime ? (
//                   <>
//                     <div className="db-card-sub">Your registration is complete and payment has been received.</div>
//                     <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)" }}>
//                       <span className="db-pulse-dot" style={{ background: "#00ff88", boxShadow: "0 0 10px #00ff88" }} />
//                       <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#00ff88" }}>
//                         Registration Complete — Full Access Granted
//                       </span>
//                     </div>
//                   </>
//                 ) : (
//                   <>
//                     <div className="db-card-sub">Complete your registration payment to unlock all features and event access.</div>
//                     <div style={{ padding: "16px", background: "rgba(255,0,128,0.05)", border: "1px solid rgba(255,0,128,0.18)", marginBottom: 20 }}>
//                       <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", color: "rgba(220,230,255,0.8)", marginBottom: 6 }}>
//                         Registration payment is <span style={{ color: "var(--pink)", fontWeight: 600 }}>pending</span>.
//                       </p>
//                       <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#00ff88" }}>
//                         // email_verified ✓
//                       </p>
//                     </div>
//                     <Link href="/payreg" className="db-btn-primary" style={{ alignSelf: "flex-start" }}>
//                       <span>PAY NOW →</span>
//                     </Link>
//                   </>
//                 )}
//               </div>
//             </div>
//           )}

//           {/* CERTIFICATES */}
//           {tab === "certificates" && (
//             <div className="db-section">
//               <div className="db-section-label">// certificates.fetch()</div>
//               <div className="db-card">
//                 <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                 <div className="db-card-top-bar" style={{ background: "var(--yellow)" }} />
//                 <div className="db-empty-state">
//                   <div className="db-empty-icon">🏆</div>
//                   <div className="db-empty-title">NO CERTIFICATES YET</div>
//                   <p className="db-empty-desc">
//                     Certificates will be issued after the event concludes. Participate in events to earn yours.
//                   </p>
//                   <Link href="/events" className="db-btn-outline" style={{ marginTop: 8 }}>
//                     EXPLORE EVENTS →
//                   </Link>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* NOTIFICATIONS */}
//           {tab === "notifications" && (
//             <div className="db-section">
//               <div className="db-section-label">// notifications.load()</div>
//               <div className="db-card">
//                 <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                 <div className="db-card-top-bar" style={{ background: "var(--purple)" }} />
//                 <div className="db-empty-state">
//                   <div className="db-empty-icon">🔔</div>
//                   <div className="db-empty-title">ALL CAUGHT UP</div>
//                   <p className="db-empty-desc">
//                     No new notifications. Updates about your registrations and events will appear here.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           )}

//           {/* COMMUNITY */}
//           {tab === "community" && (
//             <div className="db-section">
//               <div className="db-section-label">// community.connect()</div>
//               <div className="db-community-grid">

//                 <div className="db-card">
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" />
//                   <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
//                     <span className="db-pulse-dot" />
//                     <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.9rem", letterSpacing: 3, color: "var(--cyan)" }}>
//                       JOIN XAVENIR COMMUNITY
//                     </h3>
//                   </div>
//                   <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.55)", marginBottom: 20, fontSize: "0.95rem" }}>
//                     Connect with participants, get event updates, and receive instant support.
//                   </p>
//                   <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="db-btn-primary">
//                     <span>💬 &nbsp;JOIN WHATSAPP COMMUNITY</span>
//                   </a>
//                 </div>

//                 <div className="db-card">
//                   <div className="db-card-corner tl" /><div className="db-card-corner br" />
//                   <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />
//                   <div className="db-section-label" style={{ marginBottom: 16 }}>// support.contacts()</div>
//                   <div className="db-contact-list">
//                     {[
//                       { type: "GENERAL ENQUIRY", name: "Organizer Team", phone: "+91 XXXXXXXXXX", desc: "Event information and general inquiries" },
//                       { type: "PORTAL SUPPORT",  name: "Tech Team",      phone: "+91 XXXXXXXXXX", desc: "Technical support and portal-related queries" },
//                     ].map((c, i) => (
//                       <div key={i} className="db-contact-item">
//                         <span className="db-contact-type">{c.type}</span>
//                         <span className="db-contact-name">{c.name}</span>
//                         <span className="db-contact-phone">📞 {c.phone}</span>
//                         <span className="db-contact-desc">{c.desc}</span>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           )}

//         </div>
//       </div>
//     </div>
//   );
// }

// // ── All Styles ─────────────────────────────────────────
// function DashStyles() {
//   return (
//     <style>{`
//       @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

//       :root {
//         --cyan:   #00f5ff;
//         --pink:   #ff0080;
//         --purple: #bf00ff;
//         --yellow: #ffff00;
//         --dark:   #020010;
//         --panel:  rgba(0,5,30,0.8);
//         --nav-h:  66px;
//       }
//       *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//       .dash-root {
//         min-height: 100vh;
//         background: var(--dark);
//         background-image:
//           radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,0,80,0.8) 0%, transparent 70%),
//           radial-gradient(ellipse 60% 80% at 100% 100%, rgba(180,0,255,0.12) 0%, transparent 60%),
//           radial-gradient(ellipse 50% 60% at 0% 80%, rgba(0,245,255,0.08) 0%, transparent 60%);
//         color: #e0e0ff;
//         font-family: 'Rajdhani', sans-serif;
//         overflow-x: hidden;
//         position: relative;
//       }

//       /* ════════════ NAV ════════════ */
//       .dash-nav {
//         position: sticky; top: 0; z-index: 200;
//         height: var(--nav-h); padding: 0 2rem;
//         display: flex; align-items: center; gap: 0;
//         background: rgba(2,0,16,0.97);
//         border-bottom: 1px solid rgba(0,245,255,0.15);
//         backdrop-filter: blur(20px);
//       }
//       .dash-nav::after {
//         content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
//         background: linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent);
//         animation: navGlow 4s linear infinite;
//       }
//       @keyframes navGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }

//       .logo-text {
//         font-family: 'Orbitron', monospace; font-size: 1.3rem; font-weight: 900;
//         color: var(--cyan); text-shadow: 0 0 20px var(--cyan), 0 0 40px rgba(0,245,255,0.4);
//         letter-spacing: 3px; text-decoration: none; white-space: nowrap; flex-shrink: 0;
//       }

//       /* ── Desktop center nav ── */
//       .desktop-nav-center {
//         flex: 1;
//         display: flex; align-items: center;
//         justify-content: center;
//         gap: 0; overflow: hidden;
//       }

//       .nav-divider {
//         display: inline-block; width: 1px; height: 20px;
//         background: rgba(0,245,255,0.2); margin: 0 10px; flex-shrink: 0;
//       }

//       /* Site links */
//       .nav-site-link {
//         font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.5); text-decoration: none;
//         padding: 8px 10px; white-space: nowrap;
//         position: relative; transition: color 0.2s;
//       }
//       .nav-site-link::after {
//         content: ''; position: absolute; bottom: 0; left: 0;
//         width: 0; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink);
//         transition: width 0.3s;
//       }
//       .nav-site-link:hover { color: var(--pink); }
//       .nav-site-link:hover::after { width: 100%; }

//       /* Dashboard tabs */
//       .nav-tab {
//         background: transparent; border: none;
//         font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.5); padding: 8px 10px; cursor: pointer;
//         display: flex; align-items: center; gap: 5px; white-space: nowrap;
//         position: relative; transition: color 0.2s; text-transform: uppercase;
//       }
//       .nav-tab::after {
//         content: ''; position: absolute; bottom: 0; left: 0;
//         width: 0; height: 1px; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
//         transition: width 0.3s;
//       }
//       .nav-tab:hover { color: var(--cyan); }
//       .nav-tab:hover::after { width: 100%; }
//       .nav-tab-active { color: var(--cyan) !important; }
//       .nav-tab-active::after { width: 100% !important; }
//       .nav-icon { font-size: 9px; opacity: 0.6; }

//       /* Right side */
//       .nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: 10px; }
//       .nav-user { display: flex; align-items: center; gap: 8px; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(0,245,255,0.7); letter-spacing: 2px; white-space: nowrap; }
//       .nav-user-name { color: var(--cyan); }
//       .nav-logout-btn {
//         font-family: 'Orbitron', monospace; font-size: 0.6rem; letter-spacing: 2px;
//         padding: 6px 14px; border: 1px solid var(--pink); color: var(--pink);
//         background: transparent; cursor: pointer; text-transform: uppercase; transition: all 0.25s; white-space: nowrap;
//       }
//       .nav-logout-btn:hover { background: var(--pink); color: #000; box-shadow: 0 0 18px var(--pink); }

//       /* desktop-only: visible on desktop, hidden on mobile */
//       .desktop-only { display: flex; }

//       /* ════════════ HAMBURGER ════════════ */
//       .hamburger {
//         display: none; /* shown on mobile via media query */
//         flex-direction: column; justify-content: center; align-items: center;
//         gap: 5px; width: 36px; height: 36px;
//         background: transparent; border: 1px solid rgba(0,245,255,0.2);
//         cursor: pointer; padding: 6px; transition: border-color 0.2s; flex-shrink: 0;
//       }
//       .hamburger:hover { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.2); }
//       .hamburger span {
//         display: block; width: 18px; height: 1.5px;
//         background: var(--cyan); border-radius: 2px;
//         transition: all 0.3s;
//         transform-origin: center;
//       }
//       /* X state */
//       .hamburger-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
//       .hamburger-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
//       .hamburger-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

//       /* ════════════ MOBILE MENU ════════════ */
//       .mobile-menu {
//         position: fixed;
//         top: var(--nav-h); left: 0; right: 0;
//         z-index: 190;
//         max-height: 0; overflow: hidden;
//         transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
//         background: rgba(2,0,18,0.99);
//         border-bottom: 1px solid rgba(0,245,255,0.15);
//         backdrop-filter: blur(24px);
//       }
//       .mobile-menu-open { max-height: 90vh; overflow-y: auto; }

//       .mobile-menu-inner { padding: 20px 24px 28px; }

//       .mobile-user-row {
//         display: flex; align-items: center; gap: 10px;
//         font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 2px;
//         color: var(--cyan); margin-bottom: 20px;
//         padding-bottom: 14px;
//         border-bottom: 1px solid rgba(0,245,255,0.08);
//       }
//       .mobile-user-name { color: var(--cyan); }

//       .mobile-section-label {
//         font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 4px;
//         color: rgba(255,0,128,0.45); margin-bottom: 8px; padding: 4px 0;
//         border-bottom: 1px solid rgba(255,0,128,0.08);
//       }

//       /* Mobile nav link (site links) */
//       .mobile-link {
//         display: flex; align-items: center; gap: 14px;
//         font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.6); text-decoration: none;
//         padding: 13px 8px;
//         border-bottom: 1px solid rgba(0,245,255,0.04);
//         transition: all 0.18s;
//         animation: mobileItemIn 0.3s ease both;
//         opacity: 0;
//       }
//       .mobile-menu-open .mobile-link { opacity: 1; }
//       .mobile-link:hover { color: var(--pink); padding-left: 16px; }
//       .mobile-link:hover .mobile-link-arrow { opacity: 1; transform: translateX(0); }

//       /* Mobile tab button (dashboard tabs) */
//       .mobile-tab {
//         display: flex; align-items: center; gap: 14px; width: 100%;
//         background: transparent; border: none; border-bottom: 1px solid rgba(0,245,255,0.04);
//         font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.6); padding: 13px 8px; cursor: pointer;
//         text-align: left; text-transform: uppercase;
//         transition: all 0.18s;
//         animation: mobileItemIn 0.3s ease both;
//         opacity: 0;
//       }
//       .mobile-menu-open .mobile-tab { opacity: 1; }
//       .mobile-tab:hover { color: var(--cyan); padding-left: 16px; }
//       .mobile-tab-active { color: var(--cyan) !important; }
//       .mobile-tab-active .mobile-link-icon { color: var(--cyan); }

//       .mobile-link-icon { font-size: 12px; color: rgba(0,245,255,0.35); width: 16px; text-align: center; flex-shrink: 0; }
//       .mobile-link-arrow { margin-left: auto; font-size: 14px; color: var(--pink); opacity: 0; transform: translateX(-4px); transition: all 0.18s; }
//       .mobile-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); margin-left: auto; }

//       .mobile-logout {
//         display: flex; align-items: center; justify-content: center;
//         width: 100%; margin-top: 20px;
//         font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px;
//         padding: 13px; border: 1px solid var(--pink); color: var(--pink);
//         background: transparent; cursor: pointer; text-transform: uppercase;
//         transition: all 0.25s;
//         animation: mobileItemIn 0.3s ease both;
//         opacity: 0;
//       }
//       .mobile-menu-open .mobile-logout { opacity: 1; }
//       .mobile-logout:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }

//       @keyframes mobileItemIn { from{transform:translateX(-12px);opacity:0} to{transform:none;opacity:1} }

//       /* backdrop */
//       .mobile-backdrop {
//         position: fixed; inset: 0; z-index: 180;
//         background: rgba(0,0,0,0.5);
//       }

//       /* ════════════ TICKER ════════════ */
//       .ticker-wrap { overflow: hidden; background: rgba(0,0,20,0.6); border-bottom: 1px solid rgba(0,245,255,0.08); padding: 8px 0; position: relative; z-index: 2; }
//       .ticker-track { display: flex; white-space: nowrap; animation: ticker 28s linear infinite; }
//       .ticker-item { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 3px; color: rgba(0,245,255,0.45); padding: 0 3rem; }
//       .ticker-item:nth-child(odd) { color: rgba(255,0,128,0.4); }
//       @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

//       /* ════════════ MAIN ════════════ */
//       .dash-main { padding: 0 2.5rem 3rem; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }

//       .hero-section { padding: 3rem 0 2rem; }
//       .hero-tag-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; }
//       .hero-tag-line { display: inline-block; width: 28px; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink); }
//       .hero-tag-text { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); text-transform: uppercase; }
//       .hero-h1 { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,4vw,3rem); font-weight: 900; color: #fff; text-shadow: 0 0 30px rgba(0,245,255,0.2); margin-bottom: 0.8rem; }
//       .hero-name { color: var(--cyan); text-shadow: 0 0 20px var(--cyan), 0 0 50px rgba(0,245,255,0.4); }
//       .glitch-active { animation: glitchAnim 0.4s steps(2) forwards; }
//       @keyframes glitchAnim { 0%{transform:none} 20%{transform:skewX(-2deg) translateX(-3px)} 40%{transform:skewX(2deg) translateX(3px)} 60%{transform:skewX(-1deg)} 80%,100%{transform:none} }
//       .hero-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; letter-spacing: 2px; color: rgba(180,200,255,0.6); margin-bottom: 1.2rem; line-height: 1.8; }
//       .badge-row { display: flex; gap: 10px; flex-wrap: wrap; }
//       .badge { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; padding: 4px 14px; border-radius: 0; text-transform: uppercase; }
//       .badge-cyan   { border: 1px solid var(--cyan);   color: var(--cyan);   background: rgba(0,245,255,0.06); }
//       .badge-pink   { border: 1px solid var(--pink);   color: var(--pink);   background: rgba(255,0,128,0.06); }
//       .badge-yellow { border: 1px solid var(--yellow); color: var(--yellow); background: rgba(255,255,0,0.06); }

//       .stats-section { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 3rem; }
//       .stat-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.1); padding: 1.8rem 1.5rem; position: relative; overflow: hidden; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); transition: border-color 0.2s; }
//       .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--accent); box-shadow: 0 0 12px var(--accent); }
//       .stat-card:hover { border-color: rgba(0,245,255,0.3); box-shadow: 0 0 25px rgba(0,245,255,0.06); }
//       .stat-num { font-family: 'Orbitron', monospace; font-size: 2.2rem; font-weight: 900; color: var(--accent); text-shadow: 0 0 20px var(--accent); display: block; line-height: 1; }
//       .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(180,200,255,0.45); text-transform: uppercase; margin-top: 6px; }
//       .stat-corner { position: absolute; width: 12px; height: 12px; }
//       .stat-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
//       .stat-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); }

//       .section-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.8rem; }
//       .section-label-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); white-space: nowrap; }
//       .section-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,0,128,0.3), transparent); }

//       .events-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 18px; }
//       .event-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.08); padding: 1.8rem; position: relative; overflow: hidden; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); transition: all 0.3s; animation: cardIn 0.5s ease both; }
//       .event-card-top { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),transparent); box-shadow: 0 0 10px var(--cyan); }
//       .event-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(90deg,var(--cyan),var(--pink)); transition: width 0.4s; box-shadow: 0 0 10px var(--cyan); }
//       .event-card:hover::after { width: 100%; }
//       .event-card:hover { border-color: rgba(0,245,255,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,245,255,0.08); }
//       @keyframes cardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
//       .event-icon { font-size: 2.2rem; margin-bottom: 0.8rem; filter: drop-shadow(0 0 10px var(--cyan)); }
//       .event-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 3px; color: var(--pink); margin-bottom: 0.6rem; }
//       .event-title { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 0.6rem; }
//       .event-desc { font-size: 0.88rem; color: rgba(180,200,255,0.6); line-height: 1.6; margin-bottom: 1.2rem; }
//       .event-footer { display: flex; align-items: center; justify-content: space-between; }
//       .event-prize { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--yellow); text-shadow: 0 0 10px rgba(255,255,0,0.5); }
//       .event-btn { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; padding: 7px 16px; border: 1px solid var(--cyan); color: var(--cyan); background: transparent; cursor: pointer; transition: all 0.25s; text-transform: uppercase; }
//       .event-btn:hover { background: var(--cyan); color: #000; box-shadow: 0 0 18px var(--cyan); }
//       .event-corner { position: absolute; width: 12px; height: 12px; }
//       .event-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
//       .event-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }

//       .profile-section { padding-bottom: 2rem; }
//       .profile-grid { display: flex; justify-content: center; }
//       .profile-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.12); padding: 2.5rem; width: 100%; max-width: 520px; position: relative; clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px)); }
//       .profile-card-top { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),var(--purple),transparent); box-shadow: 0 0 12px var(--cyan); }
//       .profile-avatar { width: 72px; height: 72px; background: linear-gradient(135deg,var(--cyan),var(--purple)); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; color: #000; margin: 0 auto 1.2rem; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
//       .profile-name { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; text-align: center; margin-bottom: 4px; letter-spacing: 2px; }
//       .profile-role { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 3px; color: var(--pink); text-align: center; margin-bottom: 1.5rem; }
//       .profile-divider { height: 1px; background: rgba(0,245,255,0.1); margin-bottom: 1.5rem; }
//       .profile-fields { display: flex; flex-direction: column; gap: 12px; }
//       .profile-field { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(0,245,255,0.03); border: 1px solid rgba(0,245,255,0.07); }
//       .profile-field-label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }
//       .profile-field-val { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 1px; color: rgba(220,230,255,0.85); }

//       .empty-panel { background: var(--panel); border: 1px solid rgba(0,245,255,0.08); padding: 4rem; text-align: center; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); }
//       .empty-icon { font-size: 3rem; color: rgba(0,245,255,0.2); margin-bottom: 1rem; }
//       .empty-title { font-family: 'Orbitron', monospace; font-size: 1rem; color: rgba(0,245,255,0.4); letter-spacing: 3px; margin-bottom: 8px; }
//       .empty-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.35); letter-spacing: 1px; }

//       .dash-footer { border-top: 1px solid rgba(0,245,255,0.1); background: rgba(0,0,10,0.9); position: relative; z-index: 1; }
//       .footer-inner { max-width: 1400px; margin: 0 auto; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
//       .footer-logo { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 900; color: var(--cyan); letter-spacing: 3px; text-shadow: 0 0 14px var(--cyan); }
//       .footer-text { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(180,200,255,0.25); }
//       .footer-right { display: flex; align-items: center; gap: 8px; }
//       .footer-live { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }

//       .loader-ring { width: 50px; height: 50px; border: 2px solid rgba(0,245,255,0.15); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; box-shadow: 0 0 20px var(--cyan); }
//       @keyframes spin { to{transform:rotate(360deg)} }
//       @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }

//       /* ════════════ RESPONSIVE ════════════ */

//       /* Hide desktop nav center and show hamburger under 1024px */
//       @media (max-width: 1024px) {
//         .desktop-nav-center { display: none; }
//         .hamburger { display: flex; }
//         .desktop-only { display: none !important; }
//         .dash-nav { justify-content: space-between; }
//       }

//       @media (max-width: 900px) {
//         .stats-section { grid-template-columns: repeat(2,1fr); }
//         .dash-main { padding: 0 1.2rem 2rem; }
//       }
//       @media (max-width: 600px) {
//         .stats-section { grid-template-columns: 1fr 1fr; gap: 10px; }
//         .events-grid { grid-template-columns: 1fr; }
//         .logo-text { font-size: 1.1rem; }
//         .dash-main { padding: 0 1rem 2rem; }
//         .footer-text { display: none; }
//       }
//     `}</style>
//   );
// }


"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import "./dashboard.css";
import Loading from "@/components/Loading";
import RegistrationFeesButton from "@/components/RegistrationFeesButton";

type User = {
  fullName: string;
  email: string;
  userID: string;
  role: string;
  isNitian: boolean;
  isFromCse: boolean;
  isPrime: boolean;
  collegeName: string;
  phone?: string;
  gender?: string;
  profilePic?: string;
  // phoneVerified?: boolean;
};

type Tab = "overview" | "events" | "profile" | "receipt" | "certificates" | "notifications" | "community";

export default function Dashboard() {
  const router = useRouter();
  const { userData, setUserData } = useContext(UserContext);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [ready, setReady] = useState(false);
  const mountTime = useRef(Date.now());
  const [tab, setTab] = useState<Tab>("overview");
  const [events, setEvents] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [expandedTeam, setExpandedTeam] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<Record<string, any[]>>({});
  const [invites, setInvites] = useState<any[]>([]);
  const [sentInvites, setSentInvites] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [respondingInvite, setRespondingInvite] = useState<string | null>(null);
  const [glitch, setGlitch] = useState(false);

  // profile edit
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

  // // phone OTP verification
  // const [otpPhone, setOtpPhone] = useState("");
  // const [otpSent, setOtpSent] = useState(false);
  // const [otpValue, setOtpValue] = useState("");
  // const [otpLoading, setOtpLoading] = useState(false);
  // const [otpMsg, setOtpMsg] = useState("");

  // profile pic
  const [uploading, setUploading] = useState(false);
  const [picPreview, setPicPreview] = useState<string>("");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    mountTime.current = Date.now();

    // Fetch user data
    fetch("/api/users/getCurrent")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => {
        setUser(d.data);
        setPhone(d.data.phone || "");
        setGender(d.data.gender || "");
        setPicPreview(d.data.profilePic || "");
        setLoading(false);

        // How long did the fetch take?
        const elapsed = Date.now() - mountTime.current;
        const remaining = Math.max(0, 2000 - elapsed);

        // Wait out the remaining time before showing dashboard
        setTimeout(() => setReady(true), remaining);
      })
      .catch(() => router.push("/login"));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 400);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!user) return;
    fetch("/api/users/eventRegistrations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userID: user.userID }),
    })
      .then(r => r.json())
      .then(d => {
        const data = d.data || [];
        setEvents(data);
        // teams are registrations where the user is a member and teamName exists
        setTeams(data.filter((ev: any) => ev.teamName && ev.members?.length > 1));
      })
      .catch(() => {});
  }, [user]);

  useEffect(() => {
    if (!user) return;
    fetch("/api/team-invites")
      .then(r => r.json())
      .then(d => { setInvites(d.data || []); setSentInvites(d.sent || []); })
      .catch(() => {});
    fetch("/api/notifications")
      .then(r => r.json())
      .then(d => setNotifications(d.data || []))
      .catch(() => {});
  }, [user]);

  const handleSave = async () => {
    setSaving(true); setSaveMsg("");
    try {
      const res = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, gender }),
      });
      const d = await res.json();
      if (res.ok) {
        setUser(prev => ({ ...prev!, ...d.data }));
        setUserData({ ...userData!, ...d.data });
        setSaveMsg("// CHANGES_SAVED");
        setEditMode(false);
      } else { setSaveMsg("// ERROR: " + d.message); }
    } catch { setSaveMsg("// NETWORK_ERROR"); }
    setSaving(false);
  };

  // const handleSendOtp = async () => {
  //   if (!otpPhone.trim()) { setOtpMsg("Enter a phone number first."); return; }
  //   setOtpLoading(true); setOtpMsg("");
  //   try {
  //     const res = await fetch("/api/users/phone-otp/send", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ phone: otpPhone }),
  //     });
  //     const d = await res.json();
  //     if (res.ok) { setOtpSent(true); setOtpMsg("OTP sent to your registered email."); }
  //     else { setOtpMsg(d.error || "Failed to send OTP."); }
  //   } catch { setOtpMsg("Network error."); }
  //   setOtpLoading(false);
  // };

  // const handleVerifyOtp = async () => {
  //   if (!otpValue.trim()) { setOtpMsg("Enter the OTP."); return; }
  //   setOtpLoading(true); setOtpMsg("");
  //   try {
  //     const res = await fetch("/api/users/phone-otp/verify", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ otp: otpValue }),
  //     });
  //     const d = await res.json();
  //     if (res.ok) {
  //       setUser(prev => ({ ...prev!, phone: otpPhone, phoneVerified: true }));
  //       setUserData({ ...userData!, phone: otpPhone } as any);
  //       setPhone(otpPhone);
  //       setOtpSent(false); setOtpValue(""); setOtpPhone("");
  //       setOtpMsg("✓ Phone verified and saved!");
  //     } else { setOtpMsg(d.error || "Verification failed."); }
  //   } catch { setOtpMsg("Network error."); }
  //   setOtpLoading(false);
  // };

  const handlePicUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // show local preview immediately
    const localUrl = URL.createObjectURL(file);
    setPicPreview(localUrl);
    setUploading(true);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/cloudinary/upload", { method: "POST", body: form });
      const d = await res.json();
      const url = d.uploads?.file?.secure_url;
      if (!url) throw new Error("no url");
      const res2 = await fetch("/api/users/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profilePic: url }),
      });
      if (res2.ok) {
        setPicPreview(url);
        setUser(prev => ({ ...prev!, profilePic: url }));
        setUserData({ ...userData!, profilePic: url } as any);
      }
    } catch { setPicPreview(user?.profilePic || ""); }
    setUploading(false);
  };

  const _handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserData(null);
    router.push("/");
  };

  const handleTeamClick = async (team: any) => {
    const key = team._id || team.teamName;
    if (expandedTeam === key) { setExpandedTeam(null); return; }
    setExpandedTeam(key);
    if (teamMembers[key]) return;
    try {
      const res = await fetch("/api/users/byUserIDs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userIDs: team.members }),
      });
      const d = await res.json();
      setTeamMembers(prev => ({ ...prev, [key]: d.data || [] }));
    } catch { setTeamMembers(prev => ({ ...prev, [key]: [] })); }
  };

  const handleInviteRespond = async (inviteId: string, action: "accept" | "reject") => {
    setRespondingInvite(inviteId);
    try {
      const res = await fetch("/api/team-invites/respond", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inviteId, action }),
      });
      const d = await res.json();
      // Refresh invites list
      setInvites(prev => prev.map(inv => inv._id === inviteId ? { ...inv, status: action === "accept" ? "accepted" : "rejected" } : inv));
      if (action === "accept" && d.message?.includes("registered")) {
        // Refresh events/teams and sent invites too
        fetch("/api/team-invites").then(r => r.json()).then(d2 => { setInvites(d2.data || []); setSentInvites(d2.sent || []); }).catch(() => {});
        fetch("/api/users/eventRegistrations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: user?.userID }),
        }).then(r => r.json()).then(d2 => {
          const data = d2.data || [];
          setEvents(data);
          setTeams(data.filter((ev: any) => ev.teamName && ev.members?.length > 1));
        }).catch(() => {});
      }
    } catch { /* ignore */ }
    setRespondingInvite(null);
  };

  if (!ready) return <Loading />;

  const tabs: { key: Tab; label: string; icon: string }[] = [
    { key: "overview",      label: "OVERVIEW",      icon: "◈" },
    { key: "profile",       label: "PROFILE",       icon: "✦" },
    { key: "events",        label: "EVENTS",        icon: "◆" },
    { key: "receipt",       label: "RECEIPT",       icon: "◉" },
    { key: "certificates",  label: "CERTIFICATES",  icon: "★" },
    { key: "notifications", label: "NOTIFICATIONS", icon: "◎" },
    { key: "community",     label: "COMMUNITY",     icon: "⬡" },
  ];

  const firstName = user?.fullName?.split(" ")[0]?.toUpperCase() ?? "AGENT";

  return (
    <div className="db-root">
      {/* backgrounds matching home page */}
      <div className="db-grid-bg" />
      <div className="db-scanlines" />
      <div className="db-corner-glow" />

      <div className="db-wrap">

        {/* ── HERO HEADER ── */}
        <section className="db-hero">
          <div className="db-hero-tag">
            <span className="db-hero-tag-line" />
            <span>SYSTEM ACCESS GRANTED</span>
            <span className="db-pulse-dot" />
          </div>
          <h1 className={`db-hero-title${glitch ? " db-glitch" : ""}`} data-text={`WELCOME BACK, ${firstName}`}>
            WELCOME BACK,{" "}
            <span className="db-hero-accent">{firstName}</span>
          </h1>
          <p className="db-hero-sub">
            <span>USER_ID:</span> {user?.userID} &nbsp;|&nbsp;
            <span>ROLE:</span> {user?.role?.toUpperCase()} &nbsp;|&nbsp;
            <span>STATUS:</span> <span style={{ color: "#ff0080" }}>ACTIVE</span>
          </p>
          <p className="db-hero-sub" style={{ marginTop: "0.3rem" }}>
            <span>NITJSR:</span> <span style={{ color: user?.isNitian ? "#00ff88" : "#ff0080" }}>{user?.isNitian ? "YES ✓" : "NO"}</span> &nbsp;|&nbsp;
            <span>CSE:</span> <span style={{ color: user?.isFromCse ? "#00ff88" : "#ff0080" }}>{user?.isFromCse ? "YES ✓" : "NO"}</span>
          </p>
          <div className="db-badge-row">
            {user?.isNitian  && <span className="db-badge db-badge-cyan">◈ NIT JAMSHEDPUR</span>}
            {user?.isFromCse && <span className="db-badge db-badge-pink">◆ SCSE MEMBER</span>}
            {user?.isPrime   && <span className="db-badge db-badge-yellow">★ PRIME ACCESS</span>}
          </div>
        </section>

        {/* ── TERMINAL TAB BAR (desktop) ── */}
        <div className="db-terminal">
          <div className="db-term-bar">
            <div className="db-term-dots"><span /><span /><span /></div>
            <span className="db-term-title">xavenir@nitjsr:~/dashboard$</span>
            <span className="db-term-status">SESSION ACTIVE</span>
          </div>
          <div className="db-tabs">
            {tabs.map(t => (
              <button
                key={t.key}
                className={`db-tab${tab === t.key ? " db-tab-active" : ""}`}
                onClick={() => setTab(t.key)}
              >
                <span className="db-tab-icon">{t.icon}</span>
                {t.label}
                {t.key === "notifications" && (() => {
                  const count = invites.filter(inv => inv.status === "pending").length + notifications.filter(n => !n.read).length;
                  return count > 0 ? (
                    <span style={{ marginLeft: 6, background: "var(--pink)", color: "#fff", borderRadius: "50%", fontSize: "0.6rem", fontWeight: 700, padding: "1px 5px", fontFamily: "'Inter',sans-serif" }}>
                      {count}
                    </span>
                  ) : null;
                })()}              </button>
            ))}
          </div>
        </div>

        {/* ── MOBILE BOTTOM TAB BAR ── */}
        <div className="db-mobile-tabs">
          {tabs.map(t => (
            <button
              key={t.key}
              className={`db-mobile-tab${tab === t.key ? " db-mobile-tab-active" : ""}`}
              onClick={() => setTab(t.key)}
            >
              <span className="db-mobile-tab-icon">{t.icon}</span>
              <span className="db-mobile-tab-label">{t.label}</span>
            </button>
          ))}
        </div>

        {/* ── CONTENT ── */}
        <div className="db-content">

          {/* OVERVIEW */}
          {tab === "overview" && (
            <div className="db-section">
              <div className="db-section-label">// user.status()</div>

              {/* Two-col layout: profile card + payment status */}
              <div className="db-overview-grid">

                {/* Profile card */}
                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" />

                  {/* Avatar */}
                  <div className="db-avatar-wrap" onClick={() => fileRef.current?.click()} title="Change photo">
                    {picPreview
                      ? <img src={picPreview} alt="avatar" className="db-avatar-img" />
                      : <span className="db-avatar-letter">{user?.fullName?.charAt(0).toUpperCase()}</span>
                    }
                    <div className="db-avatar-overlay">
                      {uploading ? <span className="db-spin">◌</span> : "✎"}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicUpload} />
                  </div>

                  <h2 className="db-profile-name">{user?.fullName?.toUpperCase()}</h2>
                  <p className="db-profile-role">{user?.role?.toUpperCase()}</p>

                  <div className="db-profile-divider" />

                  <div className="db-profile-fields">
                    {[
                      { label: "EMAIL",   val: user?.email },
                      { label: "COLLEGE", val: user?.collegeName },
                       { label: "PHONE",   val: user?.phone || "—" }, 
                      { label: "GENDER",  val: user?.gender || "—" },
                    ].map(f => (
                      <div key={f.label} className="db-pf-row">
                        <span className="db-pf-label">{f.label}</span>
                        <span className="db-pf-val">{f.val}</span>
                      </div>
                    ))}
                  </div>

                  <button className="db-edit-profile-btn" onClick={() => { setTab("profile"); setEditMode(true); }}>
                    ✎ &nbsp;EDIT PROFILE
                  </button>
                </div>

                {/* Payment / status card */}
                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />

                  <div className="db-section-label" style={{ marginBottom: 16 }}>// payment.status()</div>

                  {user?.isPrime ? (
                    <div className="db-status-ok">
                      <span className="db-pulse-dot" style={{ background: "#00ff88", boxShadow: "0 0 8px #00ff88" }} />
                      <span style={{ color: "#00ff88", fontFamily: "'Inter',sans-serif", fontWeight: 700, letterSpacing: 1, fontSize: "1rem" }}>
                        &nbsp;REGISTRATION COMPLETE
                      </span>
                      <p style={{ color: "rgba(180,200,255,0.5)", fontSize: "0.82rem", marginTop: 12, fontFamily: "'Rajdhani',sans-serif" }}>
                        Full access granted to all events and features.
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: "rgba(180,200,255,0.7)", fontFamily: "'Rajdhani',sans-serif", marginBottom: 8 }}>
                        Registration payment is pending.
                      </p>
                      <p style={{ color: "#00ff88", fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.9rem", marginBottom: 4 }}>
                        // email_verified ✓
                      </p>
                      <p style={{ color: "rgba(180,200,255,0.4)", fontFamily: "'Rajdhani',sans-serif", fontSize: "0.85rem", marginBottom: 24 }}>
                        Complete payment to unlock all features.
                      </p>
                      {/* Non-Nitian: Razorpay inline payment */}
                      {!user?.isNitian && (
                        <RegistrationFeesButton email={user?.email ?? ""} />
                      )}
                      {/* NIT CSE: redirect to /payreg */}
                      {user?.isNitian && (
                        <Link href="/payreg" className="db-btn-primary">
                          <span>// PAY NOW</span>
                        </Link>
                      )}
                      {/* NIT non-CSE: no payment button shown */}
                    </div>
                  )}

                  <div className="db-profile-divider" style={{ margin: "24px 0 16px" }} />
                  <div className="db-section-label" style={{ marginBottom: 12 }}>// quick_nav()</div>
                  <div className="db-quick-nav">
                    {tabs.filter(t => t.key !== "overview").map(t => (
                      <button key={t.key} className="db-quick-btn" onClick={() => setTab(t.key)}>
                        {t.icon} {t.label} ›
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* EVENTS */}
          {tab === "events" && (
            <div className="db-section">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }} className="db-events-teams-grid">

                {/* Events column */}
                <div>
                  <div className="db-section-label" style={{ marginBottom: 16 }}>// events.registered()</div>
                  {events.length === 0 && sentInvites.length === 0 ? (
                    <div className="db-card" style={{ alignItems: "center", textAlign: "center", padding: "3rem 2rem" }}>
                      <div className="db-card-corner tl" /><div className="db-card-corner br" />
                      <div style={{ fontSize: "2.5rem", opacity: 0.4, marginBottom: 16 }}>📅</div>
                      <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.85rem", letterSpacing: 3, color: "var(--cyan)", marginBottom: 10 }}>
                        NO REGISTERED EVENTS
                      </h3>
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.5)", maxWidth: 380, marginBottom: 24 }}>
                        You haven't registered for any events yet.
                      </p>
                      <Link href="/events" className="db-btn-outline">
                        ◆ EXPLORE EVENTS ⚡
                      </Link>
                    </div>
                  ) : (
                    <div className="db-events-list">
                      {events.map((ev, i) => {
                        const evKey = `ev-${ev._id || i}`;
                        const isOpen = expandedTeam === evKey;
                        const members = teamMembers[evKey];
                        const hasTeam = ev.teamName && ev.members?.length > 1;
                        return (
                          <div key={i} className="db-event-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6 }}>
                            <div className="db-card-corner tl" /><div className="db-card-corner br" />
                            <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                              <span className="db-event-id">[{String(i + 1).padStart(2, "0")}]</span>
                              <Link
                                href={`/eventDetails/${encodeURIComponent(ev.eventName || ev.name || "")}`}
                                style={{ textDecoration: "none" }}
                                onClick={e => e.stopPropagation()}
                              >
                                <span className="db-event-name" style={{ cursor: "pointer" }}>{ev.eventName || ev.name || "Event"}</span>
                              </Link>
                              {hasTeam && (
                                <span
                                  style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "var(--purple)", cursor: "pointer", marginLeft: 6, textDecoration: "underline dotted" }}
                                  onClick={() => handleTeamClick({ ...ev, _id: evKey, members: ev.members })}
                                >
                                  ⬡ {ev.teamName}
                                </span>
                              )}
                              <span className="db-event-status" style={{ marginLeft: "auto" }}>◉ REGISTERED</span>
                            </div>
                            {isOpen && (
                              <div style={{ paddingLeft: "2.5rem", width: "100%", marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                                {!members ? (
                                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.78rem", color: "rgba(0,245,255,0.4)" }}>// loading...</span>
                                ) : members.length === 0 ? (
                                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.78rem", color: "rgba(180,200,255,0.3)" }}>// no member data</span>
                                ) : (
                                  members.map((m: any, mi: number) => (
                                    <div key={mi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "5px 10px", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}>
                                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "var(--cyan)", opacity: 0.5 }}>{String(mi + 1).padStart(2, "0")}</span>
                                      <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "rgba(220,230,255,0.85)" }}>{m.fullName}</span>
                                      <span style={{ marginLeft: "auto", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "rgba(180,200,255,0.35)" }}>{m.userID}</span>
                                    </div>
                                  ))
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                      {/* Pending teams created by this user (awaiting member approvals) */}
                      {(() => {
                        // Group sent invites by teamName+eventName
                        const grouped: Record<string, any[]> = {};
                        sentInvites.forEach(inv => {
                          const key = `${inv.teamName}||${inv.eventName}`;
                          if (!grouped[key]) grouped[key] = [];
                          grouped[key].push(inv);
                        });
                        // Filter out teams that are already fully registered (all accepted = EventRegistration exists)
                        const pendingGroups = Object.entries(grouped).filter(([, invs]) => {
                          const allAccepted = invs.every(inv => inv.status === "accepted");
                          // If all accepted, the EventRegistration was created — it'll appear in events list above
                          return !allAccepted;
                        });
                        return pendingGroups.map(([key, invs], gi) => {
                          const anyRejected = invs.some(inv => inv.status === "rejected");
                          const overallStatus = anyRejected ? "REJECTED" : "PENDING";
                          const statusColor = anyRejected ? "var(--pink)" : "var(--yellow)";
                          const isOpen = expandedTeam === `sent-${key}`;
                          return (
                            <div
                              key={`sent-${gi}`}
                              className="db-event-row"
                              style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, cursor: "pointer" }}
                              onClick={() => setExpandedTeam(isOpen ? null : `sent-${key}`)}
                            >
                              <div className="db-card-corner tl" /><div className="db-card-corner br" />
                              <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                                <span className="db-event-id">[{String(events.length + gi + 1).padStart(2, "0")}]</span>
                                <span className="db-event-name">{invs[0].teamName} <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.75rem", color: "rgba(180,200,255,0.4)", fontWeight: 400 }}>({invs[0].eventName})</span></span>
                                <span style={{ marginLeft: "auto", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: statusColor }}>
                                  ◉ {overallStatus}
                                </span>
                                <span style={{ color: "rgba(180,200,255,0.4)", fontSize: "0.8rem", marginLeft: 4 }}>{isOpen ? "▲" : "▼"}</span>
                              </div>
                              {isOpen && (
                                <div style={{ paddingLeft: "2.5rem", width: "100%", marginTop: 4, display: "flex", flexDirection: "column", gap: 4 }}>
                                  {invs.map((inv, ii) => (
                                    <div key={ii} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 10px", background: "rgba(0,245,255,0.03)", border: "1px solid rgba(0,245,255,0.08)" }}>
                                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "var(--cyan)", opacity: 0.5 }}>{String(ii + 1).padStart(2, "0")}</span>
                                      <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.75rem", color: "rgba(220,230,255,0.7)" }}>{inv.invitedUser}</span>
                                      <span style={{ marginLeft: "auto", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem",
                                        color: inv.status === "accepted" ? "#00ff88" : inv.status === "rejected" ? "var(--pink)" : "var(--yellow)" }}>
                                        {inv.status === "accepted" ? "✓ ACCEPTED" : inv.status === "rejected" ? "✕ REJECTED" : "◌ PENDING"}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          );
                        });
                      })()}
                    </div>
                  )}
                </div>

                {/* Teams column */}
                <div>
                  <div className="db-section-label" style={{ marginBottom: 16 }}>// teams.formed()</div>
                  {/* Pending invites shown at top of teams column */}
                  {invites.filter(inv => inv.status === "pending").map((inv, i) => (
                    <div key={i} className="db-event-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 8, marginBottom: 10, borderColor: "rgba(191,0,255,0.3)" }}>
                      <div className="db-card-corner tl" /><div className="db-card-corner br" />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, width: "100%", flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", color: "var(--yellow)" }}>⚡ INVITE</span>
                        <span className="db-event-name" style={{ color: "var(--purple)" }}>{inv.teamName}</span>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.7rem", color: "var(--cyan)", marginLeft: "auto" }}>◈ {inv.eventName}</span>
                      </div>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          className="db-btn-primary"
                          style={{ padding: "4px 14px", fontSize: "0.75rem" }}
                          disabled={respondingInvite === inv._id}
                          onClick={() => handleInviteRespond(inv._id, "accept")}
                        >
                          <span>{respondingInvite === inv._id ? "◌" : "✓ ACCEPT"}</span>
                        </button>
                        <button
                          className="db-btn-outline"
                          style={{ padding: "4px 14px", fontSize: "0.75rem" }}
                          disabled={respondingInvite === inv._id}
                          onClick={() => handleInviteRespond(inv._id, "reject")}
                        >
                          ✕ REJECT
                        </button>
                      </div>
                    </div>
                  ))}
                  {teams.length === 0 ? (
                    <div className="db-card" style={{ alignItems: "center", textAlign: "center", padding: "3rem 2rem" }}>
                      <div className="db-card-corner tl" /><div className="db-card-corner br" />
                      <div style={{ fontSize: "2.5rem", opacity: 0.4, marginBottom: 16 }}>👥</div>
                      <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.85rem", letterSpacing: 3, color: "var(--purple)", marginBottom: 10 }}>
                        NO TEAMS YET
                      </h3>
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.5)", maxWidth: 380, marginBottom: 24 }}>
                        Register for a team event to see your teams here.
                      </p>
                      <Link href="/events" className="db-btn-outline">
                        ⬡ EXPLORE EVENTS ⚡
                      </Link>
                    </div>
                  ) : (
                    <div className="db-events-list">
                      {teams.map((team, i) => {
                        const key = team._id || team.teamName;
                        const isOpen = expandedTeam === key;
                        const members = teamMembers[key];
                        return (
                          <div key={i} className="db-event-row db-team-row" style={{ flexDirection: "column", alignItems: "flex-start", gap: 6, cursor: "pointer" }} onClick={() => handleTeamClick(team)}>
                            <div className="db-card-corner tl" /><div className="db-card-corner br" />
                            <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%" }}>
                              <span className="db-event-id">[{String(i + 1).padStart(2, "0")}]</span>
                              <span className="db-event-name" style={{ color: "var(--purple)" }}>{team.teamName}</span>
                              <span className="db-event-status" style={{ marginLeft: "auto", color: "var(--cyan)", fontSize: "0.72rem" }}>
                                ◈ {team.eventName}
                              </span>
                              <span style={{ color: "rgba(180,200,255,0.4)", fontSize: "0.8rem", marginLeft: 6 }}>{isOpen ? "▲" : "▼"}</span>
                            </div>
                            <div style={{ paddingLeft: "2.5rem", fontFamily: "'Rajdhani',sans-serif", fontSize: "0.8rem", color: "rgba(180,200,255,0.45)" }}>
                              {team.members?.length} member{team.members?.length !== 1 ? "s" : ""}
                            </div>
                            {isOpen && (
                              <div style={{ paddingLeft: "2.5rem", width: "100%", marginTop: 4 }}>
                                {!members ? (
                                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.78rem", color: "rgba(0,245,255,0.4)" }}>// loading...</span>
                                ) : members.length === 0 ? (
                                  <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.78rem", color: "rgba(180,200,255,0.3)" }}>// no member data</span>
                                ) : (
                                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                    {members.map((m, mi) => (
                                      <div key={mi} style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 10px", background: "rgba(0,245,255,0.04)", border: "1px solid rgba(0,245,255,0.1)" }}>
                                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "var(--cyan)", opacity: 0.5 }}>{String(mi + 1).padStart(2, "0")}</span>
                                        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontWeight: 600, fontSize: "0.88rem", color: "rgba(220,230,255,0.85)" }}>{m.fullName}</span>
                                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.72rem", color: "rgba(180,200,255,0.35)", marginLeft: "auto" }}>{m.userID}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* PROFILE */}
          {tab === "profile" && (
            <div className="db-section">
              <div className="db-section-label">// profile.edit()</div>
              <div className="db-profile-grid">

                {/* Pic upload card */}
                <div className="db-card" style={{ alignItems: "center" }}>
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" />
                  <div className="db-section-label" style={{ marginBottom: 16, alignSelf: "flex-start" }}>// avatar.upload()</div>
                  <div className="db-avatar-wrap db-avatar-lg" onClick={() => fileRef.current?.click()}>
                    {picPreview
                      ? <img src={picPreview} alt="avatar" className="db-avatar-img" />
                      : <span className="db-avatar-letter" style={{ fontSize: "3rem" }}>{user?.fullName?.charAt(0).toUpperCase()}</span>
                    }
                    <div className="db-avatar-overlay">
                      {uploading ? <span className="db-spin">◌</span> : "⬆ UPLOAD"}
                    </div>
                    <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePicUpload} />
                  </div>
                  <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", fontWeight: 500, color: "rgba(0,245,255,0.45)", marginTop: 12, textAlign: "center" }}>
                    {uploading ? "// UPLOADING..." : "// CLICK TO CHANGE PHOTO"}
                  </p>
                </div>

                {/* Edit fields card */}
                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />
                  <div className="db-section-label" style={{ marginBottom: 16 }}>// fields.update()</div>

                  <div className="db-edit-fields">
                    {[
                      { label: "FULL NAME", val: user?.fullName, editable: false },
                      { label: "EMAIL",     val: user?.email,    editable: false },
                      { label: "COLLEGE",   val: user?.collegeName, editable: false },
                    ].map(f => (
                      <div key={f.label} className="db-edit-row">
                        <span className="db-edit-label">{f.label}</span>
                        <span className="db-edit-static">{f.val}</span>
                      </div>
                    ))}

                    <div className="db-edit-row">
                      <span className="db-edit-label">PHONE</span>
                      {editMode
                        ? <input className="db-input" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+91 XXXXXXXXXX" />
                        : <span className="db-edit-static">{user?.phone || <span style={{ opacity: 0.35 }}>not set</span>}</span>
                      }
                    </div>

                    {/* ── PHONE OTP VERIFICATION ──
{editMode && (
  <div style={{
    marginTop: 8,
    padding: "14px 16px",
    background: "rgba(0,245,255,0.04)",
    border: "1px solid rgba(0,245,255,0.15)",
  }}>
    <div className="db-section-label" style={{ marginBottom: 10, fontSize: "0.72rem" }}>
      // phone.verify()
    </div>

    {user?.phoneVerified ? (
      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.85rem", color: "#00ff88", fontWeight: 600 }}>
        ✓ PHONE VERIFIED
      </p>
    ) : (
      <>
        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.85rem", color: "rgba(180,200,255,0.5)", marginBottom: 10 }}>
          Enter a number and verify via OTP sent to your email.
        </p>

        <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
          <input
            className="db-input"
            style={{ flex: 1, minWidth: 160 }}
            value={otpPhone}
            onChange={e => setOtpPhone(e.target.value)}
            placeholder="+91 XXXXXXXXXX"
            disabled={otpSent}
          />
          <button
            className="db-btn-outline"
            style={{ padding: "6px 14px", fontSize: "0.78rem", whiteSpace: "nowrap" }}
            onClick={handleSendOtp}
            disabled={otpLoading || otpSent}
          >
            {otpLoading ? "◌ SENDING..." : otpSent ? "✓ OTP SENT" : "SEND OTP"}
          </button>
        </div>

        {otpSent && (
          <div style={{ display: "flex", gap: 8, marginBottom: 8, flexWrap: "wrap" }}>
            <input
              className="db-input"
              style={{ flex: 1, minWidth: 120, letterSpacing: 6, fontWeight: 700 }}
              value={otpValue}
              onChange={e => setOtpValue(e.target.value)}
              placeholder="_ _ _ _ _ _"
              maxLength={6}
            />
            <button
              className="db-btn-primary"
              style={{ padding: "6px 14px", fontSize: "0.78rem", whiteSpace: "nowrap" }}
              onClick={handleVerifyOtp}
              disabled={otpLoading}
            >
              <span>{otpLoading ? "◌ VERIFYING..." : "VERIFY"}</span>
            </button>
            <button
              className="db-btn-outline"
              style={{ padding: "6px 10px", fontSize: "0.78rem" }}
              onClick={() => { setOtpSent(false); setOtpValue(""); setOtpMsg(""); }}
            >
              ↩
            </button>
          </div>
        )}

        {otpMsg && (
          <p style={{
            fontFamily: "'Inter',sans-serif",
            fontSize: "0.8rem",
            color: otpMsg.startsWith("✓") ? "#00ff88" : "var(--pink)",
            marginTop: 4,
          }}>
            {otpMsg}
          </p>
        )}
      </>
    )}
  </div>
)} */}





                    <div className="db-edit-row">
                      <span className="db-edit-label">GENDER</span>
                      {editMode
                        ? (
                          <select className="db-input" value={gender} onChange={e => setGender(e.target.value)}>
                            <option value="">Prefer not to say</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non-binary">Non-binary</option>
                            <option value="genderqueer">Genderqueer</option>
                            <option value="genderfluid">Genderfluid</option>
                            <option value="agender">Agender</option>
                            <option value="other">Other</option>
                          </select>
                        )
                        : <span className="db-edit-static">{user?.gender || <span style={{ opacity: 0.35 }}>not set</span>}</span>
                      }
                    </div>
                  </div>

                  <div className="db-edit-actions">
                    {editMode ? (
                      <>
                        <button className="db-btn-primary" onClick={handleSave} disabled={saving}>
                          <span>{saving ? "// SAVING..." : "// SAVE_CHANGES"}</span>
                        </button>
                        <button className="db-btn-outline" onClick={() => { setEditMode(false); setSaveMsg(""); }}>
                          CANCEL
                        </button>
                      </>
                    ) : (
                      <button className="db-btn-primary" onClick={() => setEditMode(true)}>
                        <span>✎ &nbsp;EDIT PROFILE</span>
                      </button>
                    )}
                    {saveMsg && <span className="db-save-msg">{saveMsg}</span>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* RECEIPT */}
          {tab === "receipt" && (
            <div className="db-section">
              <div className="db-section-label">// receipt.payment()</div>
              <div className="db-card">
                <div className="db-card-corner tl" /><div className="db-card-corner br" />
                <div className="db-card-top-bar" />
                <div className="db-card-heading">PAYMENT STATUS</div>
                {user?.isPrime ? (
                  <>
                    <div className="db-card-sub">Your registration is complete and payment has been received.</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 16px", background: "rgba(0,255,136,0.06)", border: "1px solid rgba(0,255,136,0.2)" }}>
                      <span className="db-pulse-dot" style={{ background: "#00ff88", boxShadow: "0 0 10px #00ff88" }} />
                      <span style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", fontWeight: 600, color: "#00ff88" }}>
                        Registration Complete — Full Access Granted
                      </span>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="db-card-sub">Complete your registration payment to unlock all features and event access.</div>
                    <div style={{ padding: "16px", background: "rgba(255,0,128,0.05)", border: "1px solid rgba(255,0,128,0.18)", marginBottom: 20 }}>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontSize: "0.95rem", color: "rgba(220,230,255,0.8)", marginBottom: 6 }}>
                        Registration payment is <span style={{ color: "var(--pink)", fontWeight: 600 }}>pending</span>.
                      </p>
                      <p style={{ fontFamily: "'Inter',sans-serif", fontWeight: 600, fontSize: "0.9rem", color: "#00ff88" }}>
                        // email_verified ✓
                      </p>
                    </div>
                    {/* Non-Nitian: Razorpay inline payment */}
                    {!user?.isNitian && (
                      <RegistrationFeesButton email={user?.email ?? ""} />
                    )}
                    {/* NIT CSE: redirect to /payreg */}
                    {user?.isNitian && user?.isFromCse && (
                      <Link href="/payreg" className="db-btn-primary" style={{ alignSelf: "flex-start" }}>
                        <span>PAY NOW →</span>
                      </Link>
                    )}
                    {/* NIT non-CSE: no payment button shown */}
                  </>
                )}
              </div>
            </div>
          )}

          {/* CERTIFICATES */}
          {tab === "certificates" && (
            <div className="db-section">
              <div className="db-section-label">// certificates.fetch()</div>
              <div className="db-card">
                <div className="db-card-corner tl" /><div className="db-card-corner br" />
                <div className="db-card-top-bar" style={{ background: "var(--yellow)" }} />
                <div className="db-empty-state">
                  <div className="db-empty-icon">🏆</div>
                  <div className="db-empty-title">NO CERTIFICATES YET</div>
                  <p className="db-empty-desc">
                    Certificates will be issued after the event concludes. Participate in events to earn yours.
                  </p>
                  <Link href="/events" className="db-btn-outline" style={{ marginTop: 8 }}>
                    EXPLORE EVENTS →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {tab === "notifications" && (
            <div className="db-section">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div className="db-section-label">// notifications.load()</div>
                {(notifications.some(n => !n.read) || invites.some(inv => inv.status === "pending")) && (
                  <button
                    className="db-btn-outline"
                    style={{ padding: "4px 14px", fontSize: "0.72rem" }}
                    onClick={() => {
                      fetch("/api/notifications", { method: "PATCH" }).catch(() => {});
                      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
                    }}
                  >
                    ✓ MARK ALL READ
                  </button>
                )}
              </div>
              {invites.length === 0 && notifications.length === 0 ? (
                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" style={{ background: "var(--purple)" }} />
                  <div className="db-empty-state">
                    <div className="db-empty-icon">🔔</div>
                    <div className="db-empty-title">ALL CAUGHT UP</div>
                    <p className="db-empty-desc">No notifications yet.</p>
                  </div>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {/* Team invites (actionable) */}
                  {invites.map((inv, i) => (
                    <div key={`inv-${i}`} className="db-card" style={{ gap: 10, borderColor: inv.status === "pending" ? "rgba(191,0,255,0.35)" : undefined }}>
                      <div className="db-card-corner tl" /><div className="db-card-corner br" />
                      <div className="db-card-top-bar" style={{ background: inv.status === "pending" ? "var(--purple)" : inv.status === "accepted" ? "#00ff88" : "var(--pink)" }} />
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem", color: "var(--purple)" }}>⬡ TEAM INVITE</span>
                        <span style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.78rem", color: "var(--cyan)" }}>{inv.teamName}</span>
                        <span style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.78rem", color: "rgba(180,200,255,0.4)" }}>· {inv.eventName}</span>
                        <span style={{ marginLeft: "auto", fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem",
                          color: inv.status === "pending" ? "var(--yellow)" : inv.status === "accepted" ? "#00ff88" : "var(--pink)" }}>
                          ◉ {inv.status.toUpperCase()}
                        </span>
                      </div>
                      <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.85rem", color: "rgba(180,200,255,0.55)" }}>
                        You have been invited to join team <span style={{ color: "var(--cyan)" }}>{inv.teamName}</span> for <span style={{ color: "var(--cyan)" }}>{inv.eventName}</span>.
                      </p>
                      {inv.status === "pending" && (
                        <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                          <button className="db-btn-primary" style={{ padding: "6px 18px", fontSize: "0.8rem" }}
                            disabled={respondingInvite === inv._id} onClick={() => handleInviteRespond(inv._id, "accept")}>
                            <span>{respondingInvite === inv._id ? "◌..." : "✓ ACCEPT"}</span>
                          </button>
                          <button className="db-btn-outline" style={{ padding: "6px 18px", fontSize: "0.8rem" }}
                            disabled={respondingInvite === inv._id} onClick={() => handleInviteRespond(inv._id, "reject")}>
                            ✕ REJECT
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                  {/* System notifications */}
                  {notifications.map((n, i) => {
                    const iconMap: Record<string, string> = {
                      team_invite_response: "👥",
                      team_confirmed: "✅",
                      payment_verified: "💳",
                      prime_granted: "★",
                      announcement: "📢",
                    };
                    const colorMap: Record<string, string> = {
                      team_invite_response: "var(--cyan)",
                      team_confirmed: "#00ff88",
                      payment_verified: "#00ff88",
                      prime_granted: "var(--yellow)",
                      announcement: "var(--pink)",
                    };
                    return (
                      <div key={`notif-${i}`} className="db-card" style={{ gap: 8, opacity: n.read ? 0.6 : 1, borderColor: n.read ? undefined : colorMap[n.type] + "44" }}>
                        <div className="db-card-corner tl" /><div className="db-card-corner br" />
                        <div className="db-card-top-bar" style={{ background: colorMap[n.type] }} />
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <span style={{ fontSize: "1.1rem" }}>{iconMap[n.type] || "🔔"}</span>
                          <span style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.78rem", color: colorMap[n.type], letterSpacing: 1 }}>{n.title}</span>
                          {!n.read && <span style={{ marginLeft: "auto", width: 7, height: 7, borderRadius: "50%", background: "var(--pink)", boxShadow: "0 0 6px var(--pink)", display: "inline-block" }} />}
                          <span style={{ fontFamily: "'Share Tech Mono',monospace", fontSize: "0.65rem", color: "rgba(180,200,255,0.3)", marginLeft: n.read ? "auto" : 0 }}>
                            {new Date(n.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p style={{ fontFamily: "'Rajdhani',sans-serif", fontSize: "0.88rem", color: "rgba(180,200,255,0.65)", paddingLeft: "2rem" }}>
                          {n.message}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* COMMUNITY */}
          {tab === "community" && (
            <div className="db-section">
              <div className="db-section-label">// community.connect()</div>
              <div className="db-community-grid">

                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" />
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <span className="db-pulse-dot" />
                    <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.9rem", letterSpacing: 3, color: "var(--cyan)" }}>
                      JOIN XAVENIR COMMUNITY
                    </h3>
                  </div>
                  <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.55)", marginBottom: 20, fontSize: "0.95rem" }}>
                    Connect with participants, get event updates, and receive instant support.
                  </p>
                  <a href="https://chat.whatsapp.com/" target="_blank" rel="noopener noreferrer" className="db-btn-primary">
                    <span>💬 &nbsp;JOIN WHATSAPP COMMUNITY</span>
                  </a>
                </div>

                <div className="db-card">
                  <div className="db-card-corner tl" /><div className="db-card-corner br" />
                  <div className="db-card-top-bar" style={{ background: "var(--pink)" }} />
                  <div className="db-section-label" style={{ marginBottom: 16 }}>// support.contacts()</div>
                  <div className="db-contact-list">
                    {[
                      { type: "GENERAL ENQUIRY", name: "Organizer Team", phone: "+91 XXXXXXXXXX", desc: "Event information and general inquiries" },
                      { type: "PORTAL SUPPORT",  name: "Tech Team",      phone: "+91 XXXXXXXXXX", desc: "Technical support and portal-related queries" },
                    ].map((c, i) => (
                      <div key={i} className="db-contact-item">
                        <span className="db-contact-type">{c.type}</span>
                        <span className="db-contact-name">{c.name}</span>
                        <span className="db-contact-phone">📞 {c.phone}</span>
                        <span className="db-contact-desc">{c.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── All Styles ─────────────────────────────────────────
function DashStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

      :root {
        --cyan:   #00f5ff;
        --pink:   #ff0080;
        --purple: #bf00ff;
        --yellow: #ffff00;
        --dark:   #020010;
        --panel:  rgba(0,5,30,0.8);
        --nav-h:  66px;
      }
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .dash-root {
        min-height: 100vh;
        background: var(--dark);
        background-image:
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,0,80,0.8) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 100% 100%, rgba(180,0,255,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 0% 80%, rgba(0,245,255,0.08) 0%, transparent 60%);
        color: #e0e0ff;
        font-family: 'Rajdhani', sans-serif;
        overflow-x: hidden;
        position: relative;
      }

      /* ════════════ NAV ════════════ */
      .dash-nav {
        position: sticky; top: 0; z-index: 200;
        height: var(--nav-h); padding: 0 2rem;
        display: flex; align-items: center; gap: 0;
        background: rgba(2,0,16,0.97);
        border-bottom: 1px solid rgba(0,245,255,0.15);
        backdrop-filter: blur(20px);
      }
      .dash-nav::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent);
        animation: navGlow 4s linear infinite;
      }
      @keyframes navGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }

      .logo-text {
        font-family: 'Orbitron', monospace; font-size: 1.3rem; font-weight: 900;
        color: var(--cyan); text-shadow: 0 0 20px var(--cyan), 0 0 40px rgba(0,245,255,0.4);
        letter-spacing: 3px; text-decoration: none; white-space: nowrap; flex-shrink: 0;
      }

      /* ── Desktop center nav ── */
      .desktop-nav-center {
        flex: 1;
        display: flex; align-items: center;
        justify-content: center;
        gap: 0; overflow: hidden;
      }

      .nav-divider {
        display: inline-block; width: 1px; height: 20px;
        background: rgba(0,245,255,0.2); margin: 0 10px; flex-shrink: 0;
      }

      /* Site links */
      .nav-site-link {
        font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.5); text-decoration: none;
        padding: 8px 10px; white-space: nowrap;
        position: relative; transition: color 0.2s;
      }
      .nav-site-link::after {
        content: ''; position: absolute; bottom: 0; left: 0;
        width: 0; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink);
        transition: width 0.3s;
      }
      .nav-site-link:hover { color: var(--pink); }
      .nav-site-link:hover::after { width: 100%; }

      /* Dashboard tabs */
      .nav-tab {
        background: transparent; border: none;
        font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.5); padding: 8px 10px; cursor: pointer;
        display: flex; align-items: center; gap: 5px; white-space: nowrap;
        position: relative; transition: color 0.2s; text-transform: uppercase;
      }
      .nav-tab::after {
        content: ''; position: absolute; bottom: 0; left: 0;
        width: 0; height: 1px; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
        transition: width 0.3s;
      }
      .nav-tab:hover { color: var(--cyan); }
      .nav-tab:hover::after { width: 100%; }
      .nav-tab-active { color: var(--cyan) !important; }
      .nav-tab-active::after { width: 100% !important; }
      .nav-icon { font-size: 9px; opacity: 0.6; }

      /* Right side */
      .nav-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; margin-left: 10px; }
      .nav-user { display: flex; align-items: center; gap: 8px; font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; color: rgba(0,245,255,0.7); letter-spacing: 2px; white-space: nowrap; }
      .nav-user-name { color: var(--cyan); }
      .nav-logout-btn {
        font-family: 'Orbitron', monospace; font-size: 0.6rem; letter-spacing: 2px;
        padding: 6px 14px; border: 1px solid var(--pink); color: var(--pink);
        background: transparent; cursor: pointer; text-transform: uppercase; transition: all 0.25s; white-space: nowrap;
      }
      .nav-logout-btn:hover { background: var(--pink); color: #000; box-shadow: 0 0 18px var(--pink); }

      /* desktop-only: visible on desktop, hidden on mobile */
      .desktop-only { display: flex; }

      /* ════════════ HAMBURGER ════════════ */
      .hamburger {
        display: none; /* shown on mobile via media query */
        flex-direction: column; justify-content: center; align-items: center;
        gap: 5px; width: 36px; height: 36px;
        background: transparent; border: 1px solid rgba(0,245,255,0.2);
        cursor: pointer; padding: 6px; transition: border-color 0.2s; flex-shrink: 0;
      }
      .hamburger:hover { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.2); }
      .hamburger span {
        display: block; width: 18px; height: 1.5px;
        background: var(--cyan); border-radius: 2px;
        transition: all 0.3s;
        transform-origin: center;
      }
      /* X state */
      .hamburger-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
      .hamburger-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .hamburger-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

      /* ════════════ MOBILE MENU ════════════ */
      .mobile-menu {
        position: fixed;
        top: var(--nav-h); left: 0; right: 0;
        z-index: 190;
        max-height: 0; overflow: hidden;
        transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
        background: rgba(2,0,18,0.99);
        border-bottom: 1px solid rgba(0,245,255,0.15);
        backdrop-filter: blur(24px);
      }
      .mobile-menu-open { max-height: 90vh; overflow-y: auto; }

      .mobile-menu-inner { padding: 20px 24px 28px; }

      .mobile-user-row {
        display: flex; align-items: center; gap: 10px;
        font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 2px;
        color: var(--cyan); margin-bottom: 20px;
        padding-bottom: 14px;
        border-bottom: 1px solid rgba(0,245,255,0.08);
      }
      .mobile-user-name { color: var(--cyan); }

      .mobile-section-label {
        font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 4px;
        color: rgba(255,0,128,0.45); margin-bottom: 8px; padding: 4px 0;
        border-bottom: 1px solid rgba(255,0,128,0.08);
      }

      /* Mobile nav link (site links) */
      .mobile-link {
        display: flex; align-items: center; gap: 14px;
        font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.6); text-decoration: none;
        padding: 13px 8px;
        border-bottom: 1px solid rgba(0,245,255,0.04);
        transition: all 0.18s;
        animation: mobileItemIn 0.3s ease both;
        opacity: 0;
      }
      .mobile-menu-open .mobile-link { opacity: 1; }
      .mobile-link:hover { color: var(--pink); padding-left: 16px; }
      .mobile-link:hover .mobile-link-arrow { opacity: 1; transform: translateX(0); }

      /* Mobile tab button (dashboard tabs) */
      .mobile-tab {
        display: flex; align-items: center; gap: 14px; width: 100%;
        background: transparent; border: none; border-bottom: 1px solid rgba(0,245,255,0.04);
        font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.6); padding: 13px 8px; cursor: pointer;
        text-align: left; text-transform: uppercase;
        transition: all 0.18s;
        animation: mobileItemIn 0.3s ease both;
        opacity: 0;
      }
      .mobile-menu-open .mobile-tab { opacity: 1; }
      .mobile-tab:hover { color: var(--cyan); padding-left: 16px; }
      .mobile-tab-active { color: var(--cyan) !important; }
      .mobile-tab-active .mobile-link-icon { color: var(--cyan); }

      .mobile-link-icon { font-size: 12px; color: rgba(0,245,255,0.35); width: 16px; text-align: center; flex-shrink: 0; }
      .mobile-link-arrow { margin-left: auto; font-size: 14px; color: var(--pink); opacity: 0; transform: translateX(-4px); transition: all 0.18s; }
      .mobile-active-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); margin-left: auto; }

      .mobile-logout {
        display: flex; align-items: center; justify-content: center;
        width: 100%; margin-top: 20px;
        font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px;
        padding: 13px; border: 1px solid var(--pink); color: var(--pink);
        background: transparent; cursor: pointer; text-transform: uppercase;
        transition: all 0.25s;
        animation: mobileItemIn 0.3s ease both;
        opacity: 0;
      }
      .mobile-menu-open .mobile-logout { opacity: 1; }
      .mobile-logout:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }

      @keyframes mobileItemIn { from{transform:translateX(-12px);opacity:0} to{transform:none;opacity:1} }

      /* backdrop */
      .mobile-backdrop {
        position: fixed; inset: 0; z-index: 180;
        background: rgba(0,0,0,0.5);
      }

      /* ════════════ TICKER ════════════ */
      .ticker-wrap { overflow: hidden; background: rgba(0,0,20,0.6); border-bottom: 1px solid rgba(0,245,255,0.08); padding: 8px 0; position: relative; z-index: 2; }
      .ticker-track { display: flex; white-space: nowrap; animation: ticker 28s linear infinite; }
      .ticker-item { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 3px; color: rgba(0,245,255,0.45); padding: 0 3rem; }
      .ticker-item:nth-child(odd) { color: rgba(255,0,128,0.4); }
      @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

      /* ════════════ MAIN ════════════ */
      .dash-main { padding: 0 2.5rem 3rem; max-width: 1400px; margin: 0 auto; position: relative; z-index: 1; }

      .hero-section { padding: 3rem 0 2rem; }
      .hero-tag-row { display: flex; align-items: center; gap: 12px; margin-bottom: 1.2rem; }
      .hero-tag-line { display: inline-block; width: 28px; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink); }
      .hero-tag-text { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); text-transform: uppercase; }
      .hero-h1 { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,4vw,3rem); font-weight: 900; color: #fff; text-shadow: 0 0 30px rgba(0,245,255,0.2); margin-bottom: 0.8rem; }
      .hero-name { color: var(--cyan); text-shadow: 0 0 20px var(--cyan), 0 0 50px rgba(0,245,255,0.4); }
      .glitch-active { animation: glitchAnim 0.4s steps(2) forwards; }
      @keyframes glitchAnim { 0%{transform:none} 20%{transform:skewX(-2deg) translateX(-3px)} 40%{transform:skewX(2deg) translateX(3px)} 60%{transform:skewX(-1deg)} 80%,100%{transform:none} }
      .hero-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; letter-spacing: 2px; color: rgba(180,200,255,0.6); margin-bottom: 1.2rem; line-height: 1.8; }
      .badge-row { display: flex; gap: 10px; flex-wrap: wrap; }
      .badge { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; padding: 4px 14px; border-radius: 0; text-transform: uppercase; }
      .badge-cyan   { border: 1px solid var(--cyan);   color: var(--cyan);   background: rgba(0,245,255,0.06); }
      .badge-pink   { border: 1px solid var(--pink);   color: var(--pink);   background: rgba(255,0,128,0.06); }
      .badge-yellow { border: 1px solid var(--yellow); color: var(--yellow); background: rgba(255,255,0,0.06); }

      .stats-section { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 3rem; }
      .stat-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.1); padding: 1.8rem 1.5rem; position: relative; overflow: hidden; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); transition: border-color 0.2s; }
      .stat-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: var(--accent); box-shadow: 0 0 12px var(--accent); }
      .stat-card:hover { border-color: rgba(0,245,255,0.3); box-shadow: 0 0 25px rgba(0,245,255,0.06); }
      .stat-num { font-family: 'Orbitron', monospace; font-size: 2.2rem; font-weight: 900; color: var(--accent); text-shadow: 0 0 20px var(--accent); display: block; line-height: 1; }
      .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(180,200,255,0.45); text-transform: uppercase; margin-top: 6px; }
      .stat-corner { position: absolute; width: 12px; height: 12px; }
      .stat-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
      .stat-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); }

      .section-header { display: flex; align-items: center; gap: 1.5rem; margin-bottom: 1.8rem; }
      .section-label-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); white-space: nowrap; }
      .section-divider-line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(255,0,128,0.3), transparent); }

      .events-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap: 18px; }
      .event-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.08); padding: 1.8rem; position: relative; overflow: hidden; clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px)); transition: all 0.3s; animation: cardIn 0.5s ease both; }
      .event-card-top { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),transparent); box-shadow: 0 0 10px var(--cyan); }
      .event-card::after { content: ''; position: absolute; bottom: 0; left: 0; width: 0; height: 2px; background: linear-gradient(90deg,var(--cyan),var(--pink)); transition: width 0.4s; box-shadow: 0 0 10px var(--cyan); }
      .event-card:hover::after { width: 100%; }
      .event-card:hover { border-color: rgba(0,245,255,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,245,255,0.08); }
      @keyframes cardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }
      .event-icon { font-size: 2.2rem; margin-bottom: 0.8rem; filter: drop-shadow(0 0 10px var(--cyan)); }
      .event-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 3px; color: var(--pink); margin-bottom: 0.6rem; }
      .event-title { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--cyan); margin-bottom: 0.6rem; }
      .event-desc { font-size: 0.88rem; color: rgba(180,200,255,0.6); line-height: 1.6; margin-bottom: 1.2rem; }
      .event-footer { display: flex; align-items: center; justify-content: space-between; }
      .event-prize { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 700; color: var(--yellow); text-shadow: 0 0 10px rgba(255,255,0,0.5); }
      .event-btn { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; padding: 7px 16px; border: 1px solid var(--cyan); color: var(--cyan); background: transparent; cursor: pointer; transition: all 0.25s; text-transform: uppercase; }
      .event-btn:hover { background: var(--cyan); color: #000; box-shadow: 0 0 18px var(--cyan); }
      .event-corner { position: absolute; width: 12px; height: 12px; }
      .event-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
      .event-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }

      .profile-section { padding-bottom: 2rem; }
      .profile-grid { display: flex; justify-content: center; }
      .profile-card { background: var(--panel); border: 1px solid rgba(0,245,255,0.12); padding: 2.5rem; width: 100%; max-width: 520px; position: relative; clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px)); }
      .profile-card-top { position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),var(--purple),transparent); box-shadow: 0 0 12px var(--cyan); }
      .profile-avatar { width: 72px; height: 72px; background: linear-gradient(135deg,var(--cyan),var(--purple)); display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; color: #000; margin: 0 auto 1.2rem; clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px)); }
      .profile-name { font-family: 'Orbitron', monospace; font-size: 1.1rem; font-weight: 700; color: #fff; text-align: center; margin-bottom: 4px; letter-spacing: 2px; }
      .profile-role { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 3px; color: var(--pink); text-align: center; margin-bottom: 1.5rem; }
      .profile-divider { height: 1px; background: rgba(0,245,255,0.1); margin-bottom: 1.5rem; }
      .profile-fields { display: flex; flex-direction: column; gap: 12px; }
      .profile-field { display: flex; justify-content: space-between; align-items: center; padding: 10px 14px; background: rgba(0,245,255,0.03); border: 1px solid rgba(0,245,255,0.07); }
      .profile-field-label { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }
      .profile-field-val { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; letter-spacing: 1px; color: rgba(220,230,255,0.85); }

      .empty-panel { background: var(--panel); border: 1px solid rgba(0,245,255,0.08); padding: 4rem; text-align: center; clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px)); }
      .empty-icon { font-size: 3rem; color: rgba(0,245,255,0.2); margin-bottom: 1rem; }
      .empty-title { font-family: 'Orbitron', monospace; font-size: 1rem; color: rgba(0,245,255,0.4); letter-spacing: 3px; margin-bottom: 8px; }
      .empty-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.35); letter-spacing: 1px; }

      .dash-footer { border-top: 1px solid rgba(0,245,255,0.1); background: rgba(0,0,10,0.9); position: relative; z-index: 1; }
      .footer-inner { max-width: 1400px; margin: 0 auto; padding: 1.2rem 2.5rem; display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
      .footer-logo { font-family: 'Orbitron', monospace; font-size: 1rem; font-weight: 900; color: var(--cyan); letter-spacing: 3px; text-shadow: 0 0 14px var(--cyan); }
      .footer-text { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(180,200,255,0.25); }
      .footer-right { display: flex; align-items: center; gap: 8px; }
      .footer-live { font-family: 'Share Tech Mono', monospace; font-size: 0.65rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }

      .loader-ring { width: 50px; height: 50px; border: 2px solid rgba(0,245,255,0.15); border-top-color: var(--cyan); border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto; box-shadow: 0 0 20px var(--cyan); }
      @keyframes spin { to{transform:rotate(360deg)} }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }

      /* ════════════ RESPONSIVE ════════════ */

      /* Hide desktop nav center and show hamburger under 1024px */
      @media (max-width: 1024px) {
        .desktop-nav-center { display: none; }
        .hamburger { display: flex; }
        .desktop-only { display: none !important; }
        .dash-nav { justify-content: space-between; }
      }

      @media (max-width: 900px) {
        .stats-section { grid-template-columns: repeat(2,1fr); }
        .dash-main { padding: 0 1.2rem 2rem; }
      }
      @media (max-width: 600px) {
        .stats-section { grid-template-columns: 1fr 1fr; gap: 10px; }
        .events-grid { grid-template-columns: 1fr; }
        .logo-text { font-size: 1.1rem; }
        .dash-main { padding: 0 1rem 2rem; }
        .footer-text { display: none; }
      }
    `}</style>
  );
}