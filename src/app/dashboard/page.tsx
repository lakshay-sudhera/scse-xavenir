"use client";

import { useEffect, useState, useRef, useContext } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";
import "./dashboard.css";
import Loading from "@/components/Loading";

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
  const [glitch, setGlitch] = useState(false);

  // profile edit
  const [editMode, setEditMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");

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
      .then(d => setEvents(d.data || []))
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
              </button>
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
                      <Link href="/payreg" className="db-btn-primary">
                        <span>// PAY NOW</span>
                      </Link>
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
              <div className="db-section-label">// events.registered()</div>
              {events.length === 0 ? (
                <div className="db-empty">
                  <div className="db-card" style={{ alignItems: "center", textAlign: "center", padding: "3rem 2rem" }}>
                    <div className="db-card-corner tl" /><div className="db-card-corner br" />
                    <div style={{ fontSize: "2.5rem", opacity: 0.4, marginBottom: 16 }}>📅</div>
                    <h3 style={{ fontFamily: "'Orbitron',monospace", fontSize: "0.85rem", letterSpacing: 3, color: "var(--cyan)", marginBottom: 10 }}>
                      NO REGISTERED EVENTS
                    </h3>
                    <p style={{ fontFamily: "'Rajdhani',sans-serif", color: "rgba(180,200,255,0.5)", maxWidth: 380, marginBottom: 24 }}>
                      You haven't registered for any events yet. Explore our events and join the action!
                    </p>
                    <Link href="/events" className="db-btn-outline">
                      ◆ EXPLORE OTHER EVENTS ⚡
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="db-events-list">
                  {events.map((ev, i) => (
                    <div key={i} className="db-event-row">
                      <div className="db-card-corner tl" /><div className="db-card-corner br" />
                      <span className="db-event-id">[{String(i + 1).padStart(2, "0")}]</span>
                      <span className="db-event-name">{ev.eventName || ev.name || "Event"}</span>
                      <span className="db-event-status">◉ REGISTERED</span>
                    </div>
                  ))}
                </div>
              )}
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
                    <Link href="/payreg" className="db-btn-primary" style={{ alignSelf: "flex-start" }}>
                      <span>PAY NOW →</span>
                    </Link>
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
              <div className="db-section-label">// notifications.load()</div>
              <div className="db-card">
                <div className="db-card-corner tl" /><div className="db-card-corner br" />
                <div className="db-card-top-bar" style={{ background: "var(--purple)" }} />
                <div className="db-empty-state">
                  <div className="db-empty-icon">🔔</div>
                  <div className="db-empty-title">ALL CAUGHT UP</div>
                  <p className="db-empty-desc">
                    No new notifications. Updates about your registrations and events will appear here.
                  </p>
                </div>
              </div>
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

