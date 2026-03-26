"use client";

import { useState } from "react";

type Payment = {
  _id: string;
  email: string;
  scseId: string;
  paymentProof: string;
  transactionId1: string;
  transactionId2?: string;
  transactionId3?: string;
  status?: string;
  createdAt: string;
};

type Tab = "pending" | "approved" | "rejected";
type Panel = "payments" | "search" | "announce";

export default function AdminClient({ payments }: { payments: Payment[] }) {
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [panel, setPanel] = useState<Panel>("payments");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);

  // Announce state
  const [announceTitle, setAnnounceTitle] = useState("");
  const [announceMsg, setAnnounceMsg] = useState("");
  const [announceTarget, setAnnounceTarget] = useState("");
  const [announcing, setAnnouncing] = useState(false);
  const [announceResult, setAnnounceResult] = useState("");

  // User search state
  const [searchId, setSearchId] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError, setSearchError] = useState("");
  const [searching, setSearching] = useState(false);

  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) {
        const d = await res.json();
        alert(d.error || "Failed to update");
        return;
      }
      setLocalPayments(prev =>
        prev.map(p => (p._id === id ? { ...p, status } : p))
      );
    } catch {
      alert("Network error");
    } finally {
      setLoadingId(null);
    }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setSearching(true);
    setSearchResult(null);
    setSearchError("");
    try {
      const res = await fetch("/api/search-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: searchId.trim() }),
      });
      const d = await res.json();
      if (!res.ok) { setSearchError(d.message || "Not found"); return; }
      setSearchResult(d);
    } catch {
      setSearchError("Network error");
    } finally {
      setSearching(false);
    }
  };

  const pending  = localPayments.filter(p => !p.status || p.status === "pending");
  const approved = localPayments.filter(p => p.status === "verified");
  const rejected = localPayments.filter(p => p.status === "rejected");

  const tabConfig = [
    { key: "pending"  as Tab, label: "PENDING",  count: pending.length,  color: "#f59e0b", glow: "rgba(245,158,11,0.4)"  },
    { key: "approved" as Tab, label: "APPROVED", count: approved.length, color: "#00ffb3", glow: "rgba(0,255,179,0.4)"   },
    { key: "rejected" as Tab, label: "REJECTED", count: rejected.length, color: "#ff2d6b", glow: "rgba(255,45,107,0.4)"  },
  ];

  const current = { pending, approved, rejected }[activeTab];

  return (
    <div className="admin-root">
      <div className="scanlines" />

      {/* HUD bar */}
      <header className="hud-bar">
        <div className="hud-left">
          <span className="hud-badge">SYS//ADMIN</span>
          <span className="hud-title">XAVENIR CONTROL CENTER</span>
        </div>
        <div className="hud-right">
          <span className="hud-stat">TOTAL <strong>{localPayments.length}</strong></span>
          <div className="pulse-dot" />
          <span className="hud-live">LIVE</span>
        </div>
      </header>

      {/* Panel switcher */}
      <div className="panel-switcher">
        <button className={`panel-btn${panel === "payments" ? " panel-active" : ""}`} onClick={() => setPanel("payments")}>
          ◆ PAYMENTS
        </button>
        <button className={`panel-btn${panel === "search" ? " panel-active" : ""}`} onClick={() => setPanel("search")}>
          ◎ USER SEARCH
        </button>
        <button className={`panel-btn${panel === "announce" ? " panel-active" : ""}`} onClick={() => setPanel("announce")}>
          📢 ANNOUNCE
        </button>
      </div>

      {/* ── PAYMENTS PANEL ── */}
      {panel === "payments" && (
        <>
          {/* Stats */}
          <div className="stats-row">
            {tabConfig.map(t => (
              <div key={t.key} className="stat-card" style={{ "--accent": t.color, "--glow": t.glow } as any} onClick={() => setActiveTab(t.key)}>
                <div className="stat-number">{t.count}</div>
                <div className="stat-label">{t.label}</div>
                <div className="stat-bar">
                  <div className="stat-bar-fill" style={{ width: `${localPayments.length ? (t.count / localPayments.length) * 100 : 0}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <nav className="tabs">
            {tabConfig.map(t => (
              <button key={t.key} className={`tab-btn${activeTab === t.key ? " tab-active" : ""}`} style={{ "--accent": t.color, "--glow": t.glow } as any} onClick={() => setActiveTab(t.key)}>
                <span className="tab-indicator" />
                {t.label}
                <span className="tab-count">{t.count}</span>
              </button>
            ))}
          </nav>

          <div className="section-divider">
            <span className="divider-label">{`// ${activeTab.toUpperCase()} — ${current.length} RECORDS`}</span>
            <div className="divider-line" />
          </div>

          <main className="cards-grid">
            {current.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">◈</div>
                <p>NO RECORDS FOUND</p>
                <span>This queue is clear.</span>
              </div>
            ) : (
              current.map((p, i) => (
                <div key={p._id} className={`card${expandedId === p._id ? " card-expanded" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="card-accent" />
                  <div className="card-header">
                    <div className="card-meta">
                      <div className="card-record-id">REC #{p._id.slice(-8).toUpperCase()}</div>
                      <h2 className="card-email">{p.email}</h2>
                      <div className="card-scse-id">
                        <span className="field-label">SCSE ID</span>
                        <span className="field-val">{p.scseId}</span>
                      </div>
                      <div className="card-txn-block">
                        <div className="txn-row">
                          <span className="field-label">TXN 1</span>
                          <span className="field-val txn-val">{p.transactionId1}</span>
                        </div>
                        {p.transactionId2 && (
                          <div className="txn-row">
                            <span className="field-label">TXN 2</span>
                            <span className="field-val txn-val">{p.transactionId2}</span>
                          </div>
                        )}
                        {p.transactionId3 && (
                          <div className="txn-row">
                            <span className="field-label">TXN 3</span>
                            <span className="field-val txn-val">{p.transactionId3}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`status-chip status-${p.status || "pending"}`}>
                      {(p.status || "pending").toUpperCase()}
                    </div>
                  </div>

                  <div className="members-row">
                    <span className="member-tag">{p.email}</span>
                    <span className="member-tag">ID: {p.scseId}</span>
                  </div>

                  <div className="proof-container" onClick={() => setLightboxUrl(p.paymentProof)}>
                    <img src={p.paymentProof} alt="Payment proof" className="proof-img" />
                    <div className="proof-overlay"><span>🔍 CLICK TO VIEW FULL IMAGE</span></div>
                    <div className="proof-corner tl" /><div className="proof-corner tr" />
                    <div className="proof-corner bl" /><div className="proof-corner br" />
                  </div>

                  {activeTab === "pending" && (
                    <div className="card-actions">
                      <button className="btn-approve" disabled={loadingId === p._id} onClick={() => updateStatus(p._id, "verified")}>
                        {loadingId === p._id ? <span className="btn-loading" /> : "▶ APPROVE"}
                      </button>
                      <button className="btn-reject" disabled={loadingId === p._id} onClick={() => updateStatus(p._id, "rejected")}>
                        {loadingId === p._id ? <span className="btn-loading" /> : "✕ REJECT"}
                      </button>
                    </div>
                  )}

                  {activeTab !== "pending" && (
                    <div className={`final-badge ${activeTab === "approved" ? "badge-approved" : "badge-rejected"}`}>
                      {activeTab === "approved" ? "✔ PAYMENT VERIFIED" : "✕ PAYMENT REJECTED"}
                    </div>
                  )}
                </div>
              ))
            )}
          </main>
        </>
      )}

      {/* ── USER SEARCH PANEL ── */}
      {panel === "search" && (
        <div className="search-panel">
          <div className="section-divider" style={{ padding: "24px 32px 0" }}>
            <span className="divider-label">// USER LOOKUP</span>
            <div className="divider-line" />
          </div>

          <div className="search-box">
            <input
              className="search-input"
              placeholder="Enter User ID (e.g. SCSE-XXXXXXX)"
              value={searchId}
              onChange={e => setSearchId(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
            />
            <button className="search-btn" onClick={handleSearch} disabled={searching}>
              {searching ? <span className="btn-loading" /> : "SEARCH ▶"}
            </button>
          </div>

          {searchError && (
            <div className="search-error">⚠ {searchError}</div>
          )}

          {searchResult && (
            <div className="search-result-card">
              <div className="card-accent" />
              <div className="sr-row"><span className="sr-label">NAME</span><span className="sr-val">{searchResult.name}</span></div>
              <div className="sr-row"><span className="sr-label">EMAIL</span><span className="sr-val">{searchResult.email}</span></div>
              <div className="sr-row"><span className="sr-label">USER ID</span><span className="sr-val">{searchResult.id}</span></div>
              <div className="sr-row">
                <span className="sr-label">PRIME</span>
                <span className={`sr-val ${searchResult.isPrime ? "sr-green" : "sr-red"}`}>
                  {searchResult.isPrime ? "✔ YES" : "✕ NO"}
                </span>
              </div>
              <div className="sr-row">
                <span className="sr-label">GOODIES</span>
                <span className={`sr-val ${searchResult.goodiesCollected ? "sr-green" : "sr-red"}`}>
                  {searchResult.goodiesCollected ? "✔ COLLECTED" : "✕ NOT COLLECTED"}
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── ANNOUNCE PANEL ── */}
      {panel === "announce" && (
        <div className="search-panel">
          <div className="section-divider" style={{ padding: "24px 32px 0" }}>
            <span className="divider-label">// BROADCAST ANNOUNCEMENT</span>
            <div className="divider-line" />
          </div>
          <div style={{ padding: "24px 40px", maxWidth: 600, display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, color: "rgba(0,180,255,0.5)", textTransform: "uppercase" }}>Title *</label>
              <input className="search-input" style={{ borderRight: "1px solid rgba(0,180,255,0.2)" }} placeholder="Announcement title" value={announceTitle} onChange={e => setAnnounceTitle(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, color: "rgba(0,180,255,0.5)", textTransform: "uppercase" }}>Message *</label>
              <textarea className="search-input" style={{ borderRight: "1px solid rgba(0,180,255,0.2)", minHeight: 100, resize: "vertical" }} placeholder="Announcement message..." value={announceMsg} onChange={e => setAnnounceMsg(e.target.value)} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <label style={{ fontFamily: "'Space Mono',monospace", fontSize: 11, letterSpacing: 2, color: "rgba(0,180,255,0.5)", textTransform: "uppercase" }}>Target User ID (leave blank to broadcast to all)</label>
              <input className="search-input" style={{ borderRight: "1px solid rgba(0,180,255,0.2)" }} placeholder="SCSE-XXXXXXX (optional)" value={announceTarget} onChange={e => setAnnounceTarget(e.target.value)} />
            </div>
            <button className="search-btn" disabled={announcing || !announceTitle || !announceMsg} onClick={async () => {
              setAnnouncing(true); setAnnounceResult("");
              try {
                const res = await fetch("/api/admin/announce", {
                  method: "POST", headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ title: announceTitle, message: announceMsg, targetUserID: announceTarget || undefined }),
                });
                const d = await res.json();
                setAnnounceResult(d.message || "Sent");
                if (res.ok) { setAnnounceTitle(""); setAnnounceMsg(""); setAnnounceTarget(""); }
              } catch { setAnnounceResult("Network error"); }
              setAnnouncing(false);
            }}>
              {announcing ? <span className="btn-loading" /> : "📢 SEND ANNOUNCEMENT"}
            </button>
            {announceResult && <p style={{ fontFamily: "'Inter',sans-serif", fontSize: 13, color: "#00ffb3" }}>{announceResult}</p>}
          </div>
        </div>
      )}

      {/* LIGHTBOX */}
      {lightboxUrl && (
        <div className="lightbox-backdrop" onClick={() => setLightboxUrl(null)}>
          <div className="lightbox-box" onClick={e => e.stopPropagation()}>
            <button className="lightbox-close" onClick={() => setLightboxUrl(null)}>✕</button>
            <img src={lightboxUrl} alt="Payment proof" className="lightbox-img" />
            <a href={lightboxUrl} target="_blank" rel="noopener noreferrer" className="lightbox-open-btn">
              ↗ OPEN IN NEW TAB
            </a>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .admin-root { min-height:100vh; background:#03060f; background-image: radial-gradient(ellipse 80% 50% at 50% -10%,rgba(0,120,255,0.12) 0%,transparent 70%), radial-gradient(ellipse 60% 40% at 80% 80%,rgba(255,20,100,0.06) 0%,transparent 60%); font-family:'Inter',sans-serif; color:#c8dff5; position:relative; overflow-x:hidden; padding-bottom:80px; }
        .scanlines { position:fixed; inset:0; pointer-events:none; z-index:100; background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px); }
        .hud-bar { display:flex; align-items:center; justify-content:space-between; padding:16px 40px; border-bottom:1px solid rgba(0,180,255,0.15); background:rgba(0,10,30,0.95); backdrop-filter:blur(12px); position:sticky; top:0; z-index:50; }
        .hud-left { display:flex; align-items:center; gap:18px; }
        .hud-badge { font-family:'Orbitron',sans-serif; font-size:11px; font-weight:700; padding:4px 12px; border:1px solid rgba(0,180,255,0.5); color:#00b4ff; letter-spacing:2px; text-shadow:0 0 8px rgba(0,180,255,0.8); }
        .hud-title { font-family:'Orbitron',sans-serif; font-size:15px; font-weight:900; letter-spacing:3px; color:#e8f4ff; text-shadow:0 0 20px rgba(0,180,255,0.4); }
        .hud-right { display:flex; align-items:center; gap:14px; }
        .hud-stat { font-size:13px; font-weight:500; color:#5a8ab0; }
        .hud-stat strong { color:#00b4ff; font-size:15px; }
        .pulse-dot { width:9px; height:9px; border-radius:50%; background:#00ffb3; box-shadow:0 0 10px #00ffb3; animation:pulse 1.5s ease-in-out infinite; }
        .hud-live { font-size:12px; font-weight:700; letter-spacing:2px; color:#00ffb3; }
        @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(0.8)} }
        .panel-switcher { display:flex; padding:0 40px; border-bottom:1px solid rgba(0,180,255,0.1); }
        .panel-btn { background:transparent; border:none; border-bottom:2px solid transparent; color:rgba(180,210,240,0.45); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; letter-spacing:2px; padding:14px 28px; cursor:pointer; transition:all 0.2s; text-transform:uppercase; }
        .panel-btn:hover { color:#00b4ff; }
        .panel-active { color:#00b4ff !important; border-bottom-color:#00b4ff !important; }
        .stats-row { display:grid; grid-template-columns:repeat(3,1fr); gap:1px; margin:28px 40px; border:1px solid rgba(0,180,255,0.1); }
        .stat-card { background:rgba(5,15,35,0.85); padding:24px 28px; cursor:pointer; position:relative; overflow:hidden; transition:background 0.2s; border-right:1px solid rgba(0,180,255,0.08); }
        .stat-card:last-child { border-right:none; }
        .stat-card:hover { background:rgba(10,25,55,0.95); }
        .stat-card::before { content:''; position:absolute; top:0; left:0; right:0; height:3px; background:var(--accent); box-shadow:0 0 14px var(--glow); }
        .stat-number { font-family:'Orbitron',sans-serif; font-size:42px; font-weight:900; color:var(--accent); text-shadow:0 0 24px var(--glow); line-height:1; }
        .stat-label { font-size:12px; font-weight:700; letter-spacing:3px; color:rgba(180,210,240,0.5); margin-top:6px; margin-bottom:14px; text-transform:uppercase; }
        .stat-bar { height:3px; background:rgba(255,255,255,0.06); border-radius:2px; }
        .stat-bar-fill { height:100%; background:var(--accent); box-shadow:0 0 8px var(--glow); border-radius:2px; transition:width 0.8s ease; }
        .tabs { display:flex; padding:0 40px; border-bottom:1px solid rgba(0,180,255,0.1); }
        .tab-btn { background:transparent; border:none; border-bottom:2px solid transparent; color:rgba(180,210,240,0.4); font-family:'Inter',sans-serif; font-size:13px; font-weight:600; letter-spacing:2px; padding:16px 32px; cursor:pointer; display:flex; align-items:center; gap:12px; transition:all 0.2s; text-transform:uppercase; }
        .tab-btn:hover { color:var(--accent); }
        .tab-active { color:var(--accent)!important; border-bottom-color:var(--accent); text-shadow:0 0 10px var(--glow); }
        .tab-indicator { width:7px; height:7px; border-radius:50%; background:var(--accent); box-shadow:0 0 8px var(--glow); opacity:0; transition:opacity 0.2s; }
        .tab-active .tab-indicator { opacity:1; }
        .tab-count { background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.12); padding:2px 10px; border-radius:3px; font-size:12px; font-weight:700; }
        .tab-active .tab-count { background:var(--accent); color:#000; border-color:var(--accent); }
        .section-divider { display:flex; align-items:center; gap:16px; padding:24px 40px 0; }
        .divider-label { font-size:12px; font-weight:600; letter-spacing:2px; color:rgba(0,180,255,0.5); white-space:nowrap; text-transform:uppercase; }
        .divider-line { flex:1; height:1px; background:linear-gradient(90deg,rgba(0,180,255,0.25),transparent); }
        .cards-grid { display:flex; flex-direction:column; gap:16px; padding:20px 40px; }
        .empty-state { text-align:center; padding:80px 20px; color:rgba(180,210,240,0.2); }
        .empty-icon { font-size:52px; margin-bottom:18px; }
        .empty-state p { font-size:16px; font-weight:700; letter-spacing:4px; margin-bottom:8px; }
        .empty-state span { font-size:13px; }
        .card { background:rgba(4,12,28,0.97); border:1px solid rgba(0,180,255,0.12); position:relative; overflow:hidden; animation:cardIn 0.35s ease both; transition:border-color 0.2s,box-shadow 0.2s; }
        .card:hover { border-color:rgba(0,180,255,0.3); box-shadow:0 0 40px rgba(0,180,255,0.06); }
        @keyframes cardIn { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        .card-accent { position:absolute; top:0; left:0; right:0; height:1px; background:linear-gradient(90deg,transparent,rgba(0,180,255,0.7),transparent); }
        .card-header { display:flex; justify-content:space-between; align-items:flex-start; padding:22px 24px 16px; gap:20px; }
        .card-meta { display:flex; flex-direction:column; gap:10px; flex:1; min-width:0; }
        .card-record-id { font-family:'Space Mono',monospace; font-size:11px; font-weight:700; letter-spacing:3px; color:rgba(0,180,255,0.45); text-transform:uppercase; }
        .card-email { font-family:'Inter',sans-serif; font-size:18px; font-weight:700; color:#e8f4ff; word-break:break-all; }
        .card-scse-id { display:flex; align-items:center; gap:12px; padding:8px 12px; background:rgba(0,180,255,0.05); border-left:3px solid rgba(0,180,255,0.4); }
        .card-txn-block { display:flex; flex-direction:column; gap:6px; }
        .txn-row { display:flex; align-items:center; gap:12px; }
        .field-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:2px; color:rgba(0,180,255,0.5); text-transform:uppercase; flex-shrink:0; width:48px; }
        .field-val { font-family:'Inter',sans-serif; font-size:14px; font-weight:600; color:#c8dff5; }
        .txn-val { font-family:'Space Mono',monospace; font-size:13px; font-weight:700; color:#00b4ff; letter-spacing:1px; }
        .status-chip { font-family:'Inter',sans-serif; font-size:11px; font-weight:800; letter-spacing:2px; padding:6px 14px; border-radius:3px; flex-shrink:0; text-transform:uppercase; white-space:nowrap; }
        .status-pending  { background:rgba(245,158,11,0.12); border:1px solid rgba(245,158,11,0.5); color:#f59e0b; }
        .status-verified { background:rgba(0,255,179,0.1); border:1px solid rgba(0,255,179,0.5); color:#00ffb3; }
        .status-rejected { background:rgba(255,45,107,0.1); border:1px solid rgba(255,45,107,0.5); color:#ff2d6b; }
        .members-row { display:none; }
        .proof-container { position:relative; margin:0 24px 16px; cursor:pointer; overflow:hidden; border:1px solid rgba(0,180,255,0.1); }
        .proof-img { width:100%; height:180px; object-fit:cover; display:block; filter:brightness(0.88) saturate(0.9); transition:height 0.35s ease,filter 0.2s; }
        .card-expanded .proof-img { height:320px; }
        .proof-container:hover .proof-img { filter:brightness(1) saturate(1.1); }
        .proof-overlay { position:absolute; inset:0; background:linear-gradient(transparent 55%,rgba(0,0,0,0.75)); display:flex; align-items:flex-end; justify-content:center; padding-bottom:10px; font-family:'Inter',sans-serif; font-size:11px; font-weight:700; letter-spacing:2px; color:rgba(0,180,255,0.8); opacity:0; transition:opacity 0.2s; text-transform:uppercase; }
        .proof-container:hover .proof-overlay { opacity:1; }
        .proof-corner { position:absolute; width:12px; height:12px; }
        .tl { top:5px; left:5px; border-top:2px solid rgba(0,180,255,0.6); border-left:2px solid rgba(0,180,255,0.6); }
        .tr { top:5px; right:5px; border-top:2px solid rgba(0,180,255,0.6); border-right:2px solid rgba(0,180,255,0.6); }
        .bl { bottom:5px; left:5px; border-bottom:2px solid rgba(0,180,255,0.6); border-left:2px solid rgba(0,180,255,0.6); }
        .br { bottom:5px; right:5px; border-bottom:2px solid rgba(0,180,255,0.6); border-right:2px solid rgba(0,180,255,0.6); }
        .card-actions { display:grid; grid-template-columns:1fr 1fr; gap:8px; margin:0 24px 22px; }
        .btn-approve,.btn-reject { border:none; padding:14px; cursor:pointer; font-family:'Inter',sans-serif; font-size:13px; font-weight:700; letter-spacing:2px; display:flex; align-items:center; justify-content:center; gap:8px; transition:all 0.2s; text-transform:uppercase; }
        .btn-approve { background:rgba(0,255,179,0.1); color:#00ffb3; border:1px solid rgba(0,255,179,0.3); }
        .btn-approve:hover:not(:disabled) { background:rgba(0,255,179,0.2); box-shadow:0 0 24px rgba(0,255,179,0.25); border-color:rgba(0,255,179,0.6); }
        .btn-reject { background:rgba(255,45,107,0.1); color:#ff2d6b; border:1px solid rgba(255,45,107,0.3); }
        .btn-reject:hover:not(:disabled) { background:rgba(255,45,107,0.2); box-shadow:0 0 24px rgba(255,45,107,0.25); border-color:rgba(255,45,107,0.6); }
        .btn-approve:disabled,.btn-reject:disabled { opacity:0.35; cursor:not-allowed; }
        .btn-loading { display:inline-block; width:16px; height:16px; border:2px solid rgba(255,255,255,0.2); border-top-color:currentColor; border-radius:50%; animation:spin 0.6s linear infinite; }
        @keyframes spin { to{transform:rotate(360deg)} }
        .final-badge { margin:0 24px 22px; padding:14px; text-align:center; font-size:13px; font-weight:700; letter-spacing:3px; text-transform:uppercase; }
        .badge-approved { background:rgba(0,255,179,0.07); border:1px solid rgba(0,255,179,0.25); color:#00ffb3; }
        .badge-rejected { background:rgba(255,45,107,0.07); border:1px solid rgba(255,45,107,0.25); color:#ff2d6b; }
        .search-panel { padding:0 40px 60px; }
        .search-box { display:flex; margin:24px 0; }
        .search-input { flex:1; background:rgba(0,10,30,0.9); border:1px solid rgba(0,180,255,0.2); border-right:none; color:#e8f4ff; font-family:'Inter',sans-serif; font-size:15px; font-weight:500; padding:14px 18px; outline:none; transition:border-color 0.2s; }
        .search-input:focus { border-color:rgba(0,180,255,0.55); }
        .search-input::placeholder { color:rgba(180,210,240,0.25); }
        .search-btn { background:rgba(0,180,255,0.12); border:1px solid rgba(0,180,255,0.35); color:#00b4ff; font-family:'Inter',sans-serif; font-size:13px; font-weight:700; letter-spacing:2px; padding:14px 28px; cursor:pointer; transition:all 0.2s; display:flex; align-items:center; gap:8px; text-transform:uppercase; }
        .search-btn:hover:not(:disabled) { background:rgba(0,180,255,0.22); box-shadow:0 0 22px rgba(0,180,255,0.2); }
        .search-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .search-error { color:#ff2d6b; font-size:14px; font-weight:600; padding:12px 0; }
        .search-result-card { background:rgba(4,12,28,0.97); border:1px solid rgba(0,180,255,0.18); padding:24px; position:relative; max-width:560px; animation:cardIn 0.3s ease both; }
        .sr-row { display:flex; align-items:center; gap:20px; padding:13px 0; border-bottom:1px solid rgba(0,180,255,0.07); }
        .sr-row:last-child { border-bottom:none; }
        .sr-label { font-family:'Space Mono',monospace; font-size:10px; font-weight:700; letter-spacing:3px; color:rgba(0,180,255,0.45); width:100px; flex-shrink:0; text-transform:uppercase; }
        .sr-val { font-family:'Inter',sans-serif; font-size:15px; font-weight:600; color:#e8f4ff; }
        .sr-green { color:#00ffb3; }
        .sr-red { color:#ff2d6b; }
        /* LIGHTBOX */
        .lightbox-backdrop { position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.92); display:flex; align-items:center; justify-content:center; padding:20px; }
        .lightbox-box { position:relative; max-width:90vw; max-height:90vh; display:flex; flex-direction:column; align-items:center; gap:12px; }
        .lightbox-close { position:absolute; top:-14px; right:-14px; width:36px; height:36px; border-radius:50%; background:rgba(255,45,107,0.15); border:1px solid rgba(255,45,107,0.5); color:#ff2d6b; font-size:16px; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:all 0.2s; z-index:1; }
        .lightbox-close:hover { background:rgba(255,45,107,0.35); box-shadow:0 0 16px rgba(255,45,107,0.4); }
        .lightbox-img { max-width:90vw; max-height:80vh; object-fit:contain; border:1px solid rgba(0,180,255,0.2); box-shadow:0 0 60px rgba(0,0,0,0.8); }
        .lightbox-open-btn { font-family:'Inter',sans-serif; font-size:12px; font-weight:700; letter-spacing:2px; color:#00b4ff; text-decoration:none; padding:8px 20px; border:1px solid rgba(0,180,255,0.3); background:rgba(0,180,255,0.08); transition:all 0.2s; text-transform:uppercase; }
        .lightbox-open-btn:hover { background:rgba(0,180,255,0.18); box-shadow:0 0 16px rgba(0,180,255,0.2); }
        @media (max-width:768px) {
          .hud-bar { padding:12px 18px; } .hud-title { display:none; }
          .stats-row { margin:16px 18px; } .tabs,.panel-switcher { padding:0 18px; }
          .section-divider { padding:18px 18px 0; } .cards-grid { padding:16px 18px; }
          .search-panel { padding:0 18px 40px; } .card-header { flex-direction:column; }
          .card-actions { grid-template-columns:1fr; }
        }
      `}</style>
    </div>
  );
}
