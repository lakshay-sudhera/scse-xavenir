"use client";
import { useState } from "react";

type Payment = {
  _id: string; email: string; scseId: string; paymentProof: string;
  transactionId1: string; transactionId2?: string; transactionId3?: string;
  status?: string; createdAt: string;
};
type Tab    = "pending" | "approved" | "rejected";
type Panel  = "payments" | "search" | "goodies" | "announce";

const NAV: { key: Panel; icon: string; label: string }[] = [
  { key: "payments", icon: "◆", label: "Payments"  },
  { key: "search",   icon: "◎", label: "User Search" },
  { key: "goodies",  icon: "★", label: "Goodies"   },
  { key: "announce", icon: "📢", label: "Announce"  },
];

export default function AdminClient({ payments }: { payments: Payment[] }) {
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);
  const [activeTab,  setActiveTab]  = useState<Tab>("pending");
  const [panel,      setPanel]      = useState<Panel>("payments");
  const [loadingId,  setLoadingId]  = useState<string | null>(null);
  const [lightboxUrl,setLightboxUrl]= useState<string | null>(null);
  const [sideOpen,   setSideOpen]   = useState(true);

  // search
  const [searchId,     setSearchId]     = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searchError,  setSearchError]  = useState("");
  const [searching,    setSearching]    = useState(false);

  // goodies
  const [goodiesId,     setGoodiesId]     = useState("");
  const [goodiesResult, setGoodiesResult] = useState<any>(null);
  const [goodiesError,  setGoodiesError]  = useState("");
  const [goodiesLoading,setGoodiesLoading]= useState(false);

  // announce
  const [annTitle,  setAnnTitle]  = useState("");
  const [annMsg,    setAnnMsg]    = useState("");
  const [annTarget, setAnnTarget] = useState("");
  const [announcing,setAnnouncing]= useState(false);
  const [annResult, setAnnResult] = useState("");

  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/update-status", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed"); return; }
      setLocalPayments(prev => prev.map(p => p._id === id ? { ...p, status } : p));
    } catch { alert("Network error"); } finally { setLoadingId(null); }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) return;
    setSearching(true); setSearchResult(null); setSearchError("");
    try {
      const res = await fetch("/api/search-user", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: `SCSE-${searchId.trim()}` }),
      });
      const d = await res.json();
      if (!res.ok) { setSearchError(d.message || "Not found"); return; }
      setSearchResult(d);
    } catch { setSearchError("Network error"); } finally { setSearching(false); }
  };

  const handleGoodies = async () => {
    if (!goodiesId.trim()) return;
    setGoodiesLoading(true); setGoodiesResult(null); setGoodiesError("");
    try {
      const res = await fetch(`/api/admin/collect-goodies?userID=${encodeURIComponent(`SCSE-${goodiesId.trim()}`)}`);
      const d = await res.json();
      if (!res.ok) { setGoodiesError(d.error || "Not found"); return; }
      setGoodiesResult(d.data);
    } catch { setGoodiesError("Network error"); } finally { setGoodiesLoading(false); }
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
    <div className="ar">
      <div className="scanlines" />

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sideOpen ? "" : " sidebar-collapsed"}`}>
        <div className="sb-header">
          <span className="sb-logo">SYS<span className="sb-logo-acc">//</span>ADMIN</span>
          <button className="sb-toggle" onClick={() => setSideOpen(o => !o)} title="Toggle sidebar">
            {sideOpen ? "◀" : "▶"}
          </button>
        </div>
        <div className="sb-stat-row">
        </div>
        <nav className="sb-nav">
          {NAV.map(n => (
            <button key={n.key} className={`sb-item${panel === n.key ? " sb-item-active" : ""}`} onClick={() => setPanel(n.key)}>
              <span className="sb-icon">{n.icon}</span>
              {sideOpen && <span className="sb-label">{n.label}</span>}
              {panel === n.key && <span className="sb-active-bar" />}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="pulse-dot" />{sideOpen && <span className="sb-live">LIVE</span>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">

        {/* PAYMENTS */}
        {panel === "payments" && (<>
          <div className="page-header">
            <h1 className="page-title">◆ Payment Queue</h1>
            <div className="tab-row">
              {tabConfig.map(t => (
                <button key={t.key} className={`ptab${activeTab === t.key ? " ptab-active" : ""}`}
                  style={{"--acc": t.color, "--glow": t.glow} as any} onClick={() => setActiveTab(t.key)}>
                  <span className="ptab-dot" />{t.label}
                  <span className="ptab-count">{t.count}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="cards-grid">
            {current.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">◈</div><p>NO RECORDS</p><span>Queue is clear.</span></div>
            ) : current.map((p, i) => (
              <div key={p._id} className="card" style={{animationDelay:`${i*50}ms`}}>
                <div className="card-accent" />
                <div className="card-header">
                  <div className="card-meta">
                    <div className="card-rid">REC #{p._id.slice(-8).toUpperCase()}</div>
                    <h2 className="card-email">{p.email}</h2>
                    <div className="card-scse"><span className="fl">SCSE ID</span><span className="fv">{p.scseId}</span></div>
                    <div className="card-txns">
                      {[p.transactionId1, p.transactionId2, p.transactionId3].filter(Boolean).map((t, ti) => (
                        <div key={ti} className="txn-row"><span className="fl">TXN {ti+1}</span><span className="fv txnv">{t}</span></div>
                      ))}
                    </div>
                  </div>
                  <div className={`status-chip status-${p.status || "pending"}`}>{(p.status || "pending").toUpperCase()}</div>
                </div>
                <div className="proof-wrap" onClick={() => setLightboxUrl(p.paymentProof)}>
                  <img src={p.paymentProof} alt="proof" className="proof-img" />
                  <div className="proof-ov">🔍 VIEW FULL</div>
                </div>
                {activeTab === "pending" && (
                  <div className="card-actions">
                    <button className="btn-approve" disabled={loadingId === p._id} onClick={() => updateStatus(p._id, "verified")}>
                      {loadingId === p._id ? <span className="spin" /> : "▶ APPROVE"}
                    </button>
                    <button className="btn-reject" disabled={loadingId === p._id} onClick={() => updateStatus(p._id, "rejected")}>
                      {loadingId === p._id ? <span className="spin" /> : "✕ REJECT"}
                    </button>
                  </div>
                )}
                {activeTab !== "pending" && (
                  <div className={`final-badge ${activeTab === "approved" ? "badge-ok" : "badge-no"}`}>
                    {activeTab === "approved" ? "✔ PAYMENT VERIFIED" : "✕ PAYMENT REJECTED"}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>)}

        {/* USER SEARCH */}
        {panel === "search" && (
          <div className="content-panel">
            <div className="page-header"><h1 className="page-title">◎ User Search</h1></div>
            <div className="search-box">
              <span className="s-prefix">SCSE-</span>
              <input className="s-input" placeholder="XXXXXXX"
                value={searchId} onChange={e => setSearchId(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()} />
              <button className="s-btn" onClick={handleSearch} disabled={searching}>
                {searching ? <span className="spin" /> : "SEARCH ▶"}
              </button>
            </div>
            {searchError && <div className="err-msg">⚠ {searchError}</div>}
            {searchResult && (
              <div className="result-card">
                <div className="card-accent" />
                {[["NAME", searchResult.name], ["EMAIL", searchResult.email], ["USER ID", searchResult.id]].map(([l,v]) => (
                  <div key={l} className="sr-row"><span className="sr-l">{l}</span><span className="sr-v">{v}</span></div>
                ))}
                <div className="sr-row"><span className="sr-l">PRIME</span>
                  <span className={`sr-v ${searchResult.isPrime ? "ok" : "no"}`}>{searchResult.isPrime ? "✔ YES" : "✕ NO"}</span></div>
                <div className="sr-row"><span className="sr-l">GOODIES</span>
                  <span className={`sr-v ${searchResult.goodiesCollected ? "ok" : "no"}`}>{searchResult.goodiesCollected ? "✔ COLLECTED" : "✕ NOT COLLECTED"}</span></div>
              </div>
            )}
          </div>
        )}

        {/* GOODIES */}
        {panel === "goodies" && (
          <div className="content-panel">
            <div className="page-header">
              <h1 className="page-title">★ Goodies Collection</h1>
              <p className="page-sub">Search a user by their SCSE ID and mark their goodies as collected.</p>
            </div>
            <div className="search-box">
              <span className="s-prefix">SCSE-</span>
              <input className="s-input" placeholder="XXXXXXX"
                value={goodiesId} onChange={e => { setGoodiesId(e.target.value); setGoodiesResult(null); setGoodiesError(""); }}
                onKeyDown={e => e.key === "Enter" && handleGoodies()} />
              <button className="s-btn" onClick={handleGoodies} disabled={goodiesLoading}>
                {goodiesLoading ? <span className="spin" /> : "SEARCH ▶"}
              </button>
            </div>
            {goodiesError && <div className="err-msg">⚠ {goodiesError}</div>}
            {goodiesResult && (
              <div className="result-card">
                <div className="card-accent" style={{background: goodiesResult.b1 ? "#00ffb3" : "#f59e0b"}} />
                {[["NAME", goodiesResult.fullName], ["EMAIL", goodiesResult.email], ["USER ID", goodiesResult.userID]].map(([l,v]) => (
                  <div key={l} className="sr-row"><span className="sr-l">{l}</span><span className="sr-v">{v}</span></div>
                ))}
                <div className="sr-row">
                  <span className="sr-l">GOODIES</span>
                  <span className={`sr-v ${goodiesResult.b1 ? "ok" : "no"}`}>{goodiesResult.b1 ? "✔ ALREADY COLLECTED" : "✕ NOT YET COLLECTED"}</span>
                </div>
                {!goodiesResult.b1 && (
                  <button className="btn-approve" style={{marginTop:16, width:"100%"}} disabled={goodiesLoading}
                    onClick={async () => {
                      setGoodiesLoading(true);
                      const res = await fetch("/api/admin/collect-goodies", {
                        method: "POST", headers: {"Content-Type":"application/json"},
                        body: JSON.stringify({ userID: goodiesResult.userID }),
                      });
                      const d = await res.json();
                      if (res.ok) setGoodiesResult(d.data);
                      else setGoodiesError(d.error || "Failed");
                      setGoodiesLoading(false);
                    }}>
                    {goodiesLoading ? <span className="spin" /> : "★ MARK AS COLLECTED"}
                  </button>
                )}
                {goodiesResult.b1 && <div className="final-badge badge-ok" style={{marginTop:16}}>✔ GOODIES COLLECTED</div>}
              </div>
            )}
          </div>
        )}

        {/* ANNOUNCE */}
        {panel === "announce" && (
          <div className="content-panel">
            <div className="page-header"><h1 className="page-title">📢 Broadcast Announcement</h1></div>
            <div className="form-stack">
              <div className="form-field">
                <label className="form-label">TITLE *</label>
                <input className="s-input" style={{borderRight:"1px solid rgba(0,180,255,0.2)"}} placeholder="Announcement title" value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">MESSAGE *</label>
                <textarea className="s-input" style={{borderRight:"1px solid rgba(0,180,255,0.2)",minHeight:100,resize:"vertical"}} placeholder="Announcement message..." value={annMsg} onChange={e => setAnnMsg(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">TARGET USER ID <span style={{opacity:0.4}}>(blank = broadcast to all)</span></label>
                <input className="s-input" style={{borderRight:"1px solid rgba(0,180,255,0.2)"}} placeholder="SCSE-XXXXXXX (optional)" value={annTarget} onChange={e => setAnnTarget(e.target.value)} />
              </div>
              <button className="s-btn" style={{alignSelf:"flex-start"}} disabled={announcing || !annTitle || !annMsg}
                onClick={async () => {
                  setAnnouncing(true); setAnnResult("");
                  const res = await fetch("/api/admin/announce", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({ title: annTitle, message: annMsg, targetUserID: annTarget || undefined }),
                  });
                  const d = await res.json();
                  setAnnResult(d.message || "Sent");
                  if (res.ok) { setAnnTitle(""); setAnnMsg(""); setAnnTarget(""); }
                  setAnnouncing(false);
                }}>
                {announcing ? <span className="spin" /> : "📢 SEND"}
              </button>
              {annResult && <p style={{color:"#00ffb3",fontFamily:"'Inter',sans-serif",fontSize:13}}>{annResult}</p>}
            </div>
          </div>
        )}

      </main>

      {/* LIGHTBOX */}
      {lightboxUrl && (
        <div className="lb-back" onClick={() => setLightboxUrl(null)}>
          <div className="lb-box" onClick={e => e.stopPropagation()}>
            <button className="lb-close" onClick={() => setLightboxUrl(null)}>✕</button>
            <img src={lightboxUrl} alt="proof" className="lb-img" />
            <a href={lightboxUrl} target="_blank" rel="noopener noreferrer" className="lb-open">↗ OPEN IN NEW TAB</a>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Orbitron:wght@400;700;900&family=Space+Mono:wght@400;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .ar{display:flex;min-height:100vh;background:#03060f;color:#c8dff5;font-family:'Inter',sans-serif;position:relative;overflow-x:hidden;padding-top:70px;}
        .scanlines{position:fixed;inset:0;pointer-events:none;z-index:100;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.04) 2px,rgba(0,0,0,0.04) 4px);}

        /* SIDEBAR */
        .sidebar{width:220px;min-height:100vh;background:rgba(0,6,20,0.97);border-right:1px solid rgba(0,180,255,0.12);display:flex;flex-direction:column;position:sticky;top:70px;height:calc(100vh - 70px);transition:width 0.25s;flex-shrink:0;}
        .sidebar-collapsed{width:64px;}
        .sb-header{display:flex;align-items:center;justify-content:space-between;padding:20px 16px 16px;border-bottom:1px solid rgba(0,180,255,0.1);}
        .sb-logo{font-family:'Orbitron',sans-serif;font-size:13px;font-weight:900;color:#e8f4ff;letter-spacing:2px;white-space:nowrap;overflow:hidden;}
        .sb-logo-acc{color:#00b4ff;}
        .sidebar-collapsed .sb-logo{display:none;}
        .sb-toggle{background:transparent;border:1px solid rgba(0,180,255,0.2);color:rgba(0,180,255,0.6);width:28px;height:28px;cursor:pointer;font-size:10px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.2s;}
        .sb-toggle:hover{border-color:#00b4ff;color:#00b4ff;}
        .sb-stat-row{display:flex;flex-direction:column;gap:4px;padding:14px 16px;border-bottom:1px solid rgba(0,180,255,0.08);}
        .sidebar-collapsed .sb-stat-row{display:none;}
        .sb-stat{display:flex;align-items:baseline;gap:8px;}
        .sb-stat-n{font-family:'Orbitron',sans-serif;font-size:18px;font-weight:900;color:#00b4ff;}
        .sb-stat-l{font-size:10px;letter-spacing:2px;color:rgba(180,210,240,0.35);text-transform:uppercase;}
        .sb-nav{display:flex;flex-direction:column;gap:2px;padding:12px 8px;flex:1;}
        .sb-item{display:flex;align-items:center;gap:12px;padding:11px 12px;background:transparent;border:none;color:rgba(180,210,240,0.45);cursor:pointer;font-family:'Inter',sans-serif;font-size:13px;font-weight:600;letter-spacing:0.5px;position:relative;transition:all 0.18s;border-radius:4px;text-align:left;}
        .sb-item:hover{background:rgba(0,180,255,0.07);color:#c8dff5;}
        .sb-item-active{background:rgba(0,180,255,0.1);color:#00b4ff;}
        .sb-icon{font-size:14px;flex-shrink:0;width:20px;text-align:center;}
        .sb-label{white-space:nowrap;overflow:hidden;}
        .sidebar-collapsed .sb-label{display:none;}
        .sb-active-bar{position:absolute;left:0;top:20%;bottom:20%;width:3px;background:#00b4ff;box-shadow:0 0 8px #00b4ff;border-radius:0 2px 2px 0;}
        .sb-footer{padding:16px;border-top:1px solid rgba(0,180,255,0.08);display:flex;align-items:center;gap:8px;}
        .pulse-dot{width:8px;height:8px;border-radius:50%;background:#00ffb3;box-shadow:0 0 8px #00ffb3;animation:pulse 1.5s ease-in-out infinite;flex-shrink:0;}
        .sb-live{font-size:11px;font-weight:700;letter-spacing:2px;color:#00ffb3;}
        @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.8)}}

        /* MAIN */
        .main-area{flex:1;min-width:0;display:flex;flex-direction:column;padding-bottom:60px;}
        .page-header{padding:28px 32px 0;border-bottom:1px solid rgba(0,180,255,0.08);padding-bottom:20px;margin-bottom:24px;}
        .page-title{font-family:'Orbitron',sans-serif;font-size:16px;font-weight:900;letter-spacing:3px;color:#e8f4ff;margin-bottom:4px;}
        .page-sub{font-size:13px;color:rgba(180,210,240,0.45);margin-top:6px;}
        .content-panel{padding:0 32px;}

        /* PAYMENT TABS */
        .tab-row{display:flex;gap:4px;margin-top:16px;}
        .ptab{background:transparent;border:1px solid rgba(255,255,255,0.08);color:rgba(180,210,240,0.4);font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;padding:8px 18px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.18s;text-transform:uppercase;}
        .ptab:hover{border-color:var(--acc);color:var(--acc);}
        .ptab-active{background:rgba(0,0,0,0.3);border-color:var(--acc);color:var(--acc);box-shadow:0 0 12px var(--glow);}
        .ptab-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);box-shadow:0 0 6px var(--glow);opacity:0;transition:opacity 0.2s;}
        .ptab-active .ptab-dot{opacity:1;}
        .ptab-count{background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.1);padding:1px 8px;border-radius:2px;font-size:11px;}
        .ptab-active .ptab-count{background:var(--acc);color:#000;border-color:var(--acc);}

        /* CARDS */
        .cards-grid{display:flex;flex-direction:column;gap:14px;padding:0 32px;}
        .empty-state{text-align:center;padding:80px 20px;color:rgba(180,210,240,0.2);}
        .empty-icon{font-size:48px;margin-bottom:16px;}
        .empty-state p{font-size:15px;font-weight:700;letter-spacing:4px;margin-bottom:6px;}
        .card{background:rgba(4,12,28,0.97);border:1px solid rgba(0,180,255,0.12);position:relative;overflow:hidden;animation:cardIn 0.3s ease both;transition:border-color 0.2s;}
        .card:hover{border-color:rgba(0,180,255,0.28);}
        @keyframes cardIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        .card-accent{position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,rgba(0,180,255,0.7),transparent);}
        .card-header{display:flex;justify-content:space-between;align-items:flex-start;padding:20px 22px 14px;gap:16px;}
        .card-meta{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0;}
        .card-rid{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(0,180,255,0.4);}
        .card-email{font-size:17px;font-weight:700;color:#e8f4ff;word-break:break-all;}
        .card-scse{display:flex;align-items:center;gap:10px;padding:7px 10px;background:rgba(0,180,255,0.05);border-left:3px solid rgba(0,180,255,0.35);}
        .card-txns{display:flex;flex-direction:column;gap:4px;}
        .txn-row{display:flex;align-items:center;gap:10px;}
        .fl{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(0,180,255,0.45);width:44px;flex-shrink:0;}
        .fv{font-size:13px;font-weight:600;color:#c8dff5;}
        .txnv{font-family:'Space Mono',monospace;color:#00b4ff;letter-spacing:1px;}
        .status-chip{font-size:10px;font-weight:800;letter-spacing:2px;padding:5px 12px;flex-shrink:0;text-transform:uppercase;}
        .status-pending{background:rgba(245,158,11,0.12);border:1px solid rgba(245,158,11,0.5);color:#f59e0b;}
        .status-verified{background:rgba(0,255,179,0.1);border:1px solid rgba(0,255,179,0.5);color:#00ffb3;}
        .status-rejected{background:rgba(255,45,107,0.1);border:1px solid rgba(255,45,107,0.5);color:#ff2d6b;}
        .proof-wrap{position:relative;margin:0 22px 14px;cursor:pointer;overflow:hidden;border:1px solid rgba(0,180,255,0.1);}
        .proof-img{width:100%;height:160px;object-fit:cover;display:block;filter:brightness(0.85);transition:filter 0.2s;}
        .proof-wrap:hover .proof-img{filter:brightness(1);}
        .proof-ov{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:8px;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(0,180,255,0.8);opacity:0;transition:opacity 0.2s;background:linear-gradient(transparent 50%,rgba(0,0,0,0.7));}
        .proof-wrap:hover .proof-ov{opacity:1;}
        .card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 22px 20px;}
        .btn-approve,.btn-reject{border:none;padding:12px;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.2s;text-transform:uppercase;}
        .btn-approve{background:rgba(0,255,179,0.1);color:#00ffb3;border:1px solid rgba(0,255,179,0.3);}
        .btn-approve:hover:not(:disabled){background:rgba(0,255,179,0.2);box-shadow:0 0 20px rgba(0,255,179,0.2);}
        .btn-reject{background:rgba(255,45,107,0.1);color:#ff2d6b;border:1px solid rgba(255,45,107,0.3);}
        .btn-reject:hover:not(:disabled){background:rgba(255,45,107,0.2);box-shadow:0 0 20px rgba(255,45,107,0.2);}
        .btn-approve:disabled,.btn-reject:disabled{opacity:0.35;cursor:not-allowed;}
        .final-badge{margin:0 22px 20px;padding:12px;text-align:center;font-size:12px;font-weight:700;letter-spacing:3px;text-transform:uppercase;}
        .badge-ok{background:rgba(0,255,179,0.07);border:1px solid rgba(0,255,179,0.25);color:#00ffb3;}
        .badge-no{background:rgba(255,45,107,0.07);border:1px solid rgba(255,45,107,0.25);color:#ff2d6b;}
        .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.2);border-top-color:currentColor;border-radius:50%;animation:sp 0.6s linear infinite;}
        @keyframes sp{to{transform:rotate(360deg)}}

        /* SEARCH / FORMS */
        .search-box{display:flex;margin-bottom:20px;}
        .s-prefix{background:rgba(0,180,255,0.08);border:1px solid rgba(0,180,255,0.2);border-right:none;color:#00b4ff;font-family:'Space Mono',monospace;font-size:13px;font-weight:700;padding:12px 14px;display:flex;align-items:center;white-space:nowrap;letter-spacing:1px;}
        .s-input{flex:1;background:rgba(0,10,30,0.9);border:1px solid rgba(0,180,255,0.2);border-right:none;color:#e8f4ff;font-family:'Inter',sans-serif;font-size:14px;padding:12px 16px;outline:none;transition:border-color 0.2s;}
        .s-input:focus{border-color:rgba(0,180,255,0.5);}
        .s-input::placeholder{color:rgba(180,210,240,0.25);}
        textarea.s-input{border-right:1px solid rgba(0,180,255,0.2);}
        .s-btn{background:rgba(0,180,255,0.12);border:1px solid rgba(0,180,255,0.35);color:#00b4ff;font-family:'Inter',sans-serif;font-size:12px;font-weight:700;letter-spacing:2px;padding:12px 22px;cursor:pointer;transition:all 0.2s;display:flex;align-items:center;gap:6px;text-transform:uppercase;white-space:nowrap;}
        .s-btn:hover:not(:disabled){background:rgba(0,180,255,0.22);box-shadow:0 0 18px rgba(0,180,255,0.18);}
        .s-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .err-msg{color:#ff2d6b;font-size:13px;font-weight:600;margin-bottom:14px;}
        .result-card{background:rgba(4,12,28,0.97);border:1px solid rgba(0,180,255,0.18);padding:20px;position:relative;max-width:520px;animation:cardIn 0.3s ease both;}
        .sr-row{display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid rgba(0,180,255,0.07);}
        .sr-row:last-child{border-bottom:none;}
        .sr-l{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:3px;color:rgba(0,180,255,0.4);width:90px;flex-shrink:0;text-transform:uppercase;}
        .sr-v{font-size:14px;font-weight:600;color:#e8f4ff;}
        .ok{color:#00ffb3;} .no{color:#ff2d6b;}
        .form-stack{display:flex;flex-direction:column;gap:16px;max-width:520px;}
        .form-field{display:flex;flex-direction:column;gap:6px;}
        .form-label{font-family:'Space Mono',monospace;font-size:10px;font-weight:700;letter-spacing:2px;color:rgba(0,180,255,0.45);text-transform:uppercase;}

        /* LIGHTBOX */
        .lb-back{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.92);display:flex;align-items:center;justify-content:center;padding:20px;}
        .lb-box{position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:10px;}
        .lb-close{position:absolute;top:-12px;right:-12px;width:32px;height:32px;border-radius:50%;background:rgba(255,45,107,0.15);border:1px solid rgba(255,45,107,0.5);color:#ff2d6b;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;}
        .lb-img{max-width:90vw;max-height:80vh;object-fit:contain;border:1px solid rgba(0,180,255,0.2);}
        .lb-open{font-size:11px;font-weight:700;letter-spacing:2px;color:#00b4ff;text-decoration:none;padding:7px 18px;border:1px solid rgba(0,180,255,0.3);background:rgba(0,180,255,0.08);}

        @media(max-width:768px){
          .sidebar{position:fixed;z-index:200;top:70px;height:calc(100vh - 70px);}
          .sidebar-collapsed{width:0;overflow:hidden;border:none;}
          .main-area{padding-left:0;}
          .cards-grid,.content-panel{padding:0 16px;}
          .page-header{padding:20px 16px;}
          .card-actions{grid-template-columns:1fr;}
        }
      `}</style>
    </div>
  );
}
