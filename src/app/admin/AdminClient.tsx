"use client";
import { useState, useEffect } from "react";

type Payment = {
  _id: string; email: string; scseId: string; paymentProof: string;
  transactionId1: string; transactionId2?: string; transactionId3?: string;
  status?: string; createdAt: string;
};
type Tab    = "pending" | "approved" | "rejected";
type Panel  = "stats" | "payments" | "eventregs" | "search" | "goodies" | "announce" | "contacts" | "certificates";

const NAV: { key: Panel; icon: string; label: string }[] = [
  { key: "stats",     icon: "◈", label: "Stats"       },
  { key: "payments",  icon: "◆", label: "Payments"    },
  { key: "eventregs", icon: "◉", label: "Event Regs"  },
  { key: "contacts",  icon: "✉", label: "Messages"    },
  { key: "search",    icon: "◎", label: "User Search" },
  { key: "goodies",   icon: "★", label: "Goodies"     },
  { key: "announce",  icon: "📢", label: "Announce"   },
  { key: "certificates", icon: "🏆", label: "Certificates" },
];

type EventReg = {
  _id: string; eventName: string; teamName: string; members: string[];
  paymentProof: string; transactionId1: string; transactionId2?: string;
  transactionId3?: string; status?: string; createdAt: string;
};

type Stats = {
  totalUsers: number; primeUsers: number; visitorCount: number;
  pendingPayments: number; confirmedEventRegs: number; pendingEventRegs: number;
  contactCount: number;
  eventRegsByName: { _id: string; count: number; participants: number }[];
};

type ContactMsg = {
  _id: string; name: string; email: string; number: string; content: string; createdAt: string;
};

export default function AdminClient({ payments, eventRegs, contacts, stats }: {
  payments: Payment[]; eventRegs: EventReg[]; contacts: ContactMsg[]; stats: Stats;
}) {
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);
  const [localEventRegs, setLocalEventRegs] = useState<EventReg[]>(eventRegs);
  const [activeTab,  setActiveTab]  = useState<Tab>("pending");
  const [panel, setPanel] = useState<Panel>("stats");
  const [loadingId,  setLoadingId]  = useState<string | null>(null);
  const [lightboxUrl,setLightboxUrl]= useState<string | null>(null);
  const [sideOpen, setSideOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      setSideOpen(!mobile);
    };
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
  const [annEvent,  setAnnEvent]  = useState("");
  const [announcing,setAnnouncing]= useState(false);
  const [annResult, setAnnResult] = useState("");

  // certificates
  const [certEvent,    setCertEvent]    = useState("");
  const [certWinners,  setCertWinners]  = useState<{userID:string;type:"winner"|"runner_up";position:number}[]>([]);
  const [certWinnerInput, setCertWinnerInput] = useState({ userID: "", type: "winner" as "winner"|"runner_up", position: 1 });
  const [certLoading,  setCertLoading]  = useState(false);
  const [certResult,   setCertResult]   = useState<{success:number;skipped:number;failed:number;errors:string[]} | null>(null);
  const [certError,    setCertError]    = useState("");

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

  const updateEventStatus = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      const res = await fetch("/api/admin/update-event-status", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      if (!res.ok) { const d = await res.json(); alert(d.error || "Failed"); return; }
      setLocalEventRegs(prev => prev.map(r => r._id === id ? { ...r, status } : r));
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

      {/* ── SIDEBAR ── */}
      <aside className={`sidebar${sideOpen ? "" : " sidebar-collapsed"}`}>
        <div className="sb-header">
          <span className="sb-logo">Xavenir <span>Admin</span></span>
          <button className="sb-toggle" onClick={() => setSideOpen(o => !o)} title="Toggle sidebar">
            {sideOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="sb-nav">
          {NAV.map(n => (
            <button key={n.key} className={`sb-item${panel === n.key ? " sb-item-active" : ""}`} onClick={() => { setPanel(n.key); if (isMobile) setSideOpen(false); }}>
              <span className="sb-icon">{n.icon}</span>
              {sideOpen && <span className="sb-label">{n.label}</span>}
              {panel === n.key && <span className="sb-active-bar" />}
            </button>
          ))}
        </nav>
        <div className="sb-footer">
          <div className="pulse-dot" />{sideOpen && <span className="sb-live">Live</span>}
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="main-area">
        {/* Mobile top bar */}
        {isMobile && (
          <div className="mob-topbar">
            <button className="mob-menu-btn" onClick={() => setSideOpen(o => !o)}>
              <span /><span /><span />
            </button>
            <span className="mob-title">Xavenir Admin</span>
          </div>
        )}

        {/* Backdrop for mobile sidebar */}
        {isMobile && sideOpen && (
          <div className="sb-backdrop" onClick={() => setSideOpen(false)} />
        )}

        {/* STATS */}
        {panel === "stats" && (
          <div className="content-panel">
            <div className="page-header">
              <h1 className="page-title">◈ Stats Overview</h1>
              <p className="page-sub">Live snapshot of platform activity.</p>
            </div>

            {/* Top stat cards */}
            <div className="stat-grid">
              {[
                { label: "Total Users",         value: stats.totalUsers,                       color: "#6366f1", icon: "👤" },
                { label: "Prime Members",        value: stats.primeUsers,                       color: "#22c55e", icon: "★"  },
                { label: "Non-Prime",            value: stats.totalUsers - stats.primeUsers,    color: "#f59e0b", icon: "◎"  },
                { label: "Visitor Count",        value: stats.visitorCount-40000,                     color: "#8b5cf6", icon: "👁" },
                { label: "Confirmed Event Regs", value: stats.confirmedEventRegs,               color: "#06b6d4", icon: "◉"  },
                { label: "Pending Payments",     value: stats.pendingPayments,                  color: "#f59e0b", icon: "◆"  },
                { label: "Pending Event Regs",   value: stats.pendingEventRegs,                 color: "#ef4444", icon: "⚡" },
                { label: "Contact Messages",     value: stats.contactCount,                     color: "#6366f1", icon: "✉"  },
              ].map(s => (
                <div key={s.label} className="scard" style={{"--sc": s.color} as any}>
                  <div className="scard-icon">{s.icon}</div>
                  <div className="scard-val">{s.value.toLocaleString()}</div>
                  <div className="scard-label">{s.label}</div>
                  <div className="scard-bar" />
                </div>
              ))}
            </div>

            {/* Per-event breakdown */}
            {stats.eventRegsByName.length > 0 && (
              <div style={{marginTop: 32}}>
                <div className="divider-row">
                  <span className="divider-lbl">// EVENT REGISTRATIONS BREAKDOWN</span>
                  <div className="divider-line" />
                </div>
                <div className="evt-table">
                  <div className="evt-thead">
                    <span>EVENT</span><span>TEAMS</span><span>PARTICIPANTS</span>
                  </div>
                  {stats.eventRegsByName.map((e, i) => (
                    <div key={i} className="evt-row">
                      <span className="evt-name">{e._id}</span>
                      <span className="evt-num">{e.count}</span>
                      <span className="evt-num" style={{color:"#00ffb3"}}>{e.participants}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

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

        {/* EVENT REGISTRATIONS */}
        {panel === "eventregs" && (() => {
          const evPending  = localEventRegs.filter(r => !r.status || r.status === "pending");
          const evApproved = localEventRegs.filter(r => r.status === "verified");
          const evRejected = localEventRegs.filter(r => r.status === "rejected");
          const evTabCfg = [
            { key: "pending"  as Tab, label: "PENDING",  list: evPending,  color: "#f59e0b", glow: "rgba(245,158,11,0.4)" },
            { key: "approved" as Tab, label: "APPROVED", list: evApproved, color: "#00ffb3", glow: "rgba(0,255,179,0.4)"  },
            { key: "rejected" as Tab, label: "REJECTED", list: evRejected, color: "#ff2d6b", glow: "rgba(255,45,107,0.4)" },
          ];
          const evCurrent = evTabCfg.find(t => t.key === activeTab)?.list ?? evPending;
          return (<>
            <div className="page-header">
              <h1 className="page-title">◉ Event Registrations</h1>
              <p className="page-sub">Manual payment submissions pending verification.</p>
              <div className="tab-row">
                {evTabCfg.map(t => (
                  <button key={t.key} className={`ptab${activeTab === t.key ? " ptab-active" : ""}`}
                    style={{"--acc": t.color, "--glow": t.glow} as any} onClick={() => setActiveTab(t.key)}>
                    <span className="ptab-dot" />{t.label}
                    <span className="ptab-count">{t.list.length}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="cards-grid">
              {evCurrent.length === 0 ? (
                <div className="empty-state"><div className="empty-icon">◈</div><p>NO RECORDS</p><span>Queue is clear.</span></div>
              ) : evCurrent.map((r, i) => (
                <div key={r._id} className="card" style={{animationDelay:`${i*50}ms`}}>
                  <div className="card-accent" />
                  <div className="card-header">
                    <div className="card-meta">
                      <div className="card-rid">REC #{r._id.slice(-8).toUpperCase()}</div>
                      <h2 className="card-email" style={{fontSize:15}}>{r.teamName} <span style={{color:"rgba(0,180,255,0.5)",fontSize:12,fontWeight:400}}>· {r.eventName}</span></h2>
                      <div className="card-scse" style={{flexDirection:"column", alignItems:"flex-start", gap:6}}>
                        <span className="fl" style={{marginBottom:2}}>MEMBERS</span>
                        <div style={{display:"flex", flexWrap:"wrap", gap:6}}>
                          {r.members.map((m, mi) => (
                            <span key={mi} style={{fontFamily:"'Space Mono',monospace", fontSize:11, color:"#00b4ff", background:"rgba(0,180,255,0.08)", border:"1px solid rgba(0,180,255,0.25)", padding:"3px 10px", letterSpacing:1}}>
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="card-txns">
                        {[r.transactionId1, r.transactionId2, r.transactionId3].filter(Boolean).map((t, ti) => (
                          <div key={ti} className="txn-row"><span className="fl">TXN {ti+1}</span><span className="fv txnv">{t}</span></div>
                        ))}
                      </div>
                    </div>
                    <div className={`status-chip status-${r.status || "pending"}`}>{(r.status || "pending").toUpperCase()}</div>
                  </div>
                  <div className="proof-wrap" onClick={() => setLightboxUrl(r.paymentProof)}>
                    <img src={r.paymentProof} alt="proof" className="proof-img" />
                    <div className="proof-ov">🔍 VIEW FULL</div>
                  </div>
                  {(!r.status || r.status === "pending") && (
                    <div className="card-actions">
                      <button className="btn-approve" disabled={loadingId === r._id} onClick={() => updateEventStatus(r._id, "verified")}>
                        {loadingId === r._id ? <span className="spin" /> : "▶ APPROVE"}
                      </button>
                      <button className="btn-reject" disabled={loadingId === r._id} onClick={() => updateEventStatus(r._id, "rejected")}>
                        {loadingId === r._id ? <span className="spin" /> : "✕ REJECT"}
                      </button>
                    </div>
                  )}
                  {r.status && r.status !== "pending" && (
                    <div className={`final-badge ${r.status === "verified" ? "badge-ok" : "badge-no"}`}>
                      {r.status === "verified" ? "✔ REGISTRATION APPROVED" : "✕ REGISTRATION REJECTED"}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>);
        })()}

        {/* CONTACT MESSAGES */}
        {panel === "contacts" && (
          <div className="content-panel">
            <div className="page-header">
              <h1 className="page-title">✉ Contact Messages</h1>
              <p className="page-sub">{contacts.length} submission{contacts.length !== 1 ? "s" : ""} received.</p>
            </div>
            {contacts.length === 0 ? (
              <div className="empty-state"><div className="empty-icon">✉</div><p>NO MESSAGES</p><span>Inbox is empty.</span></div>
            ) : (
              <div className="cards-grid" style={{padding:0}}>
                {contacts.map((c, i) => (
                  <div key={c._id} className="card" style={{animationDelay:`${i*40}ms`}}>
                    <div className="card-accent" />
                    <div className="card-header" style={{paddingBottom:10}}>
                      <div className="card-meta">
                        <div className="card-rid">{new Date(c.createdAt).toLocaleString()}</div>
                        <h2 className="card-email">{c.name}</h2>
                        <div className="card-txns">
                          <div className="txn-row"><span className="fl">EMAIL</span><span className="fv">{c.email}</span></div>
                          <div className="txn-row"><span className="fl">PHONE</span><span className="fv">{c.number}</span></div>
                        </div>
                      </div>
                    </div>
                    <div style={{padding:"0 22px 20px"}}>
                      <div style={{fontFamily:"'Space Mono',monospace",fontSize:10,letterSpacing:2,color:"rgba(0,180,255,0.4)",textTransform:"uppercase",marginBottom:8}}>MESSAGE</div>
                      <p style={{fontFamily:"'Inter',sans-serif",fontSize:14,color:"rgba(200,220,255,0.8)",lineHeight:1.7,background:"rgba(0,180,255,0.04)",border:"1px solid rgba(0,180,255,0.1)",padding:"12px 14px"}}>
                        {c.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            <div className="page-header">
              <h1 className="page-title">📢 Broadcast Announcement</h1>
              <p className="page-sub">Send to all users, a specific event's participants, or a single user.</p>
            </div>
            <div className="form-stack">
              <div className="form-field">
                <label className="form-label">TITLE *</label>
                <input className="s-input" style={{borderRight:"1px solid #1e2535"}} placeholder="Announcement title" value={annTitle} onChange={e => setAnnTitle(e.target.value)} />
              </div>
              <div className="form-field">
                <label className="form-label">MESSAGE *</label>
                <textarea className="s-input" style={{minHeight:100,resize:"vertical"}} placeholder="Announcement message..." value={annMsg} onChange={e => setAnnMsg(e.target.value)} />
              </div>

              {/* Target selector */}
              <div className="form-field">
                <label className="form-label">TARGET</label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                  {(["all","event","user"] as const).map(t => {
                    const active = (t === "all" && !annEvent && !annTarget) || (t === "event" && !!annEvent) || (t === "user" && !!annTarget);
                    return (
                      <button key={t} type="button"
                        style={{padding:"6px 16px",borderRadius:6,border:"1px solid",fontSize:12,fontWeight:600,cursor:"pointer",flex:"1 1 auto",minWidth:0,
                          background: active ? "rgba(99,102,241,0.15)" : "transparent",
                          borderColor: active ? "#6366f1" : "#2a3347",
                          color: active ? "#818cf8" : "#64748b",
                        }}
                        onClick={() => { setAnnEvent(""); setAnnTarget(""); }}>
                        {t === "all" ? "All Users" : t === "event" ? "Event" : "Single User"}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Event picker */}
              <div className="form-field">
                <label className="form-label">EVENT <span style={{opacity:0.4}}>(select to target event participants)</span></label>
                <select className="s-input" style={{borderRight:"1px solid #1e2535", height:42, paddingTop:0, paddingBottom:0}}
                  value={annEvent} onChange={e => { setAnnEvent(e.target.value); setAnnTarget(""); }}>
                  <option value="">— All users (no event filter) —</option>
                  {stats.eventRegsByName.map(e => (
                    <option key={e._id} value={e._id}>{e._id} ({e.participants} participants)</option>
                  ))}
                </select>
              </div>

              {/* Single user override */}
              <div className="form-field">
                <label className="form-label">SINGLE USER ID <span style={{opacity:0.4}}>(overrides event filter)</span></label>
                <input className="s-input" style={{borderRight:"1px solid #1e2535", height:42}} placeholder="SCSE-XXXXXXX (optional)"
                  value={annTarget} onChange={e => { setAnnTarget(e.target.value); if (e.target.value) setAnnEvent(""); }} />
              </div>

              {/* Preview */}
              <div style={{padding:"10px 14px",background:"rgba(99,102,241,0.06)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:6,fontSize:12,color:"#94a3b8"}}>
                {annTarget ? `→ Sending to user: ${annTarget}` : annEvent ? `→ Sending to all participants of: ${annEvent}` : `→ Broadcasting to all ${stats.totalUsers} users`}
              </div>

              <button className="s-btn" style={{alignSelf:"flex-start"}} disabled={announcing || !annTitle || !annMsg}
                onClick={async () => {
                  setAnnouncing(true); setAnnResult("");
                  const res = await fetch("/api/admin/announce", {
                    method:"POST", headers:{"Content-Type":"application/json"},
                    body: JSON.stringify({
                      title: annTitle, message: annMsg,
                      targetUserID: annTarget || undefined,
                      eventName: annEvent || undefined,
                    }),
                  });
                  const d = await res.json();
                  setAnnResult(res.ok ? d.message : (d.error || "Failed"));
                  if (res.ok) { setAnnTitle(""); setAnnMsg(""); setAnnTarget(""); setAnnEvent(""); }
                  setAnnouncing(false);
                }}>
                {announcing ? <span className="spin" /> : "📢 SEND"}
              </button>
              {annResult && <p style={{color: annResult.includes("Sent") || annResult.includes("sent") ? "#22c55e" : "#ef4444", fontFamily:"'Inter',sans-serif",fontSize:13}}>{annResult}</p>}
            </div>
          </div>
        )}

        {/* CERTIFICATES */}
        {panel === "certificates" && (
          <div className="content-panel">
            <div className="page-header">
              <h1 className="page-title">🏆 Generate Certificates</h1>
              <p className="page-sub">Generate participation + winner certificates for an event. All registered members get participation certs. Add winners manually below.</p>
            </div>
            <div className="form-stack">

              {/* Event selector */}
              <div className="form-field">
                <label className="form-label">SELECT EVENT *</label>
                <select className="s-input" style={{borderRight:"1px solid #1e2535",height:42,paddingTop:0,paddingBottom:0}}
                  value={certEvent} onChange={e => { setCertEvent(e.target.value); setCertResult(null); setCertError(""); }}>
                  <option value="">— Choose an event —</option>
                  {stats.eventRegsByName.map(e => (
                    <option key={e._id} value={e._id}>{e._id} ({e.participants} participants)</option>
                  ))}
                </select>
              </div>

              {/* Winners section */}
              <div className="form-field">
                <label className="form-label">WINNERS / RUNNER-UPS <span style={{opacity:0.4}}>(optional — leave empty for participation only)</span></label>
                <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:8}}>
                  <input className="s-input" style={{flex:"2 1 160px",borderRight:"1px solid #1e2535"}}
                    placeholder="SCSE-XXXXXXX"
                    value={certWinnerInput.userID}
                    onChange={e => setCertWinnerInput(p => ({...p, userID: e.target.value}))} />
                  <select className="s-input" style={{flex:"1 1 120px",borderRight:"1px solid #1e2535",height:42,paddingTop:0,paddingBottom:0}}
                    value={certWinnerInput.type}
                    onChange={e => setCertWinnerInput(p => ({...p, type: e.target.value as any}))}>
                    <option value="winner">Winner</option>
                    <option value="runner_up">Runner Up</option>
                  </select>
                  <input className="s-input" style={{flex:"1 1 80px",borderRight:"1px solid #1e2535"}}
                    type="number" min={1} max={3} placeholder="Position"
                    value={certWinnerInput.position}
                    onChange={e => setCertWinnerInput(p => ({...p, position: Number(e.target.value)}))} />
                  <button className="s-btn" style={{flex:"0 0 auto"}}
                    onClick={() => {
                      if (!certWinnerInput.userID.trim()) return;
                      const uid = certWinnerInput.userID.trim().startsWith("SCSE-")
                        ? certWinnerInput.userID.trim()
                        : `SCSE-${certWinnerInput.userID.trim()}`;
                      setCertWinners(prev => [...prev.filter(w => w.userID !== uid),
                        { userID: uid, type: certWinnerInput.type, position: certWinnerInput.position }]);
                      setCertWinnerInput({ userID: "", type: "winner", position: 1 });
                    }}>+ ADD</button>
                </div>

                {/* Winners list */}
                {certWinners.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:6,marginTop:4}}>
                    {certWinners.map((w, i) => (
                      <div key={i} style={{display:"flex",alignItems:"center",justifyContent:"space-between",
                        padding:"8px 12px",background:"rgba(99,102,241,0.08)",border:"1px solid rgba(99,102,241,0.2)",borderRadius:6}}>
                        <span style={{fontFamily:"'Space Mono',monospace",fontSize:12,color:"#818cf8"}}>{w.userID}</span>
                        <span style={{fontSize:12,color:"#94a3b8"}}>{w.type === "winner" ? "🥇" : "🥈"} {w.type} · Position {w.position}</span>
                        <button style={{background:"none",border:"none",color:"#ef4444",cursor:"pointer",fontSize:14}}
                          onClick={() => setCertWinners(prev => prev.filter((_, j) => j !== i))}>✕</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Info box */}
              {certEvent && (
                <div style={{padding:"10px 14px",background:"rgba(0,245,255,0.04)",border:"1px solid rgba(0,245,255,0.15)",borderRadius:6,fontSize:12,color:"#94a3b8"}}>
                  → All registered participants of <span style={{color:"#00f5ff"}}>{certEvent}</span> will receive participation certificates.
                  {certWinners.length > 0 && <><br/>→ {certWinners.length} winner/runner-up certificate(s) will also be generated.</>}
                  <br/>→ Already-generated certificates will be skipped.
                </div>
              )}

              {certError && <div className="err-msg">⚠ {certError}</div>}

              {/* Result */}
              {certResult && (
                <div style={{padding:"12px 16px",background:"rgba(34,197,94,0.06)",border:"1px solid rgba(34,197,94,0.2)",borderRadius:6,fontSize:13,lineHeight:1.8}}>
                  <span style={{color:"#22c55e"}}>✔ Generated: {certResult.success}</span><br/>
                  <span style={{color:"#94a3b8"}}>⊘ Skipped (already exist): {certResult.skipped}</span><br/>
                  {certResult.failed > 0 && <><span style={{color:"#ef4444"}}>✕ Failed: {certResult.failed}</span><br/></>}
                  {certResult.errors.length > 0 && (
                    <details style={{marginTop:8}}>
                      <summary style={{cursor:"pointer",color:"#f59e0b",fontSize:12}}>View errors ({certResult.errors.length})</summary>
                      <ul style={{marginTop:6,paddingLeft:16,color:"#ef4444",fontSize:11}}>
                        {certResult.errors.map((e,i) => <li key={i}>{e}</li>)}
                      </ul>
                    </details>
                  )}
                </div>
              )}

              <button className="s-btn" style={{alignSelf:"flex-start"}}
                disabled={certLoading || !certEvent}
                onClick={async () => {
                  setCertLoading(true); setCertResult(null); setCertError("");
                  try {
                    const res = await fetch("/api/admin/generate-certificates", {
                      method: "POST", headers: {"Content-Type":"application/json"},
                      body: JSON.stringify({ eventName: certEvent, winners: certWinners }),
                    });
                    const d = await res.json();
                    if (!res.ok) { setCertError(d.error || "Failed"); return; }
                    setCertResult(d.result);
                  } catch { setCertError("Network error"); }
                  finally { setCertLoading(false); }
                }}>
                {certLoading ? <><span className="spin" /> GENERATING...</> : "🏆 GENERATE CERTIFICATES"}
              </button>

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
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=DM+Sans:wght@400;500;600;700&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}

        /* ROOT */
        .ar{display:flex;min-height:100vh;background:#0f1117;color:#e2e8f0;font-family:'Inter',sans-serif;padding-top:70px;}

        /* SIDEBAR */
        .sidebar{width:260px;min-height:calc(100vh - 70px);background:#161b27;border-right:1px solid #1e2535;display:flex;flex-direction:column;position:sticky;top:70px;height:calc(100vh - 70px);transition:width 0.22s cubic-bezier(.4,0,.2,1);flex-shrink:0;overflow:hidden;}
        .sidebar-collapsed{width:68px;}
        .sb-header{display:flex;align-items:center;justify-content:space-between;padding:24px 20px 20px;border-bottom:1px solid #1e2535;}
        .sb-logo{font-family:'Inter',sans-serif;font-size:15px;font-weight:800;color:#f1f5f9;letter-spacing:-0.3px;white-space:nowrap;}
        .sb-logo span{color:#6366f1;}
        .sidebar-collapsed .sb-logo{display:none;}
        .sb-toggle{background:transparent;border:1px solid #2a3347;color:#64748b;width:30px;height:30px;border-radius:6px;cursor:pointer;font-size:11px;display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:all 0.15s;}
        .sb-toggle:hover{border-color:#6366f1;color:#6366f1;background:rgba(99,102,241,0.08);}

        /* SIDEBAR STATS */
        .sb-stats{padding:16px 20px;border-bottom:1px solid #1e2535;display:flex;flex-direction:column;gap:10px;}
        .sidebar-collapsed .sb-stats{display:none;}
        .sb-stat-item{display:flex;align-items:center;justify-content:space-between;}
        .sb-stat-label{font-size:12px;color:#64748b;font-weight:500;}
        .sb-stat-val{font-size:13px;font-weight:700;color:#f1f5f9;}
        .sb-stat-badge{background:#1e2535;border-radius:4px;padding:2px 8px;font-size:12px;font-weight:700;}

        /* SIDEBAR NAV */
        .sb-nav{display:flex;flex-direction:column;gap:2px;padding:12px 10px;flex:1;}
        .sb-item{display:flex;align-items:center;gap:12px;padding:10px 12px;background:transparent;border:none;color:#64748b;cursor:pointer;font-family:'Inter',sans-serif;font-size:13.5px;font-weight:500;position:relative;transition:all 0.15s;border-radius:8px;text-align:left;width:100%;}
        .sb-item:hover{background:#1e2535;color:#cbd5e1;}
        .sb-item-active{background:rgba(99,102,241,0.12);color:#818cf8 !important;}
        .sb-item-active .sb-icon{color:#6366f1;}
        .sb-icon{font-size:15px;flex-shrink:0;width:20px;text-align:center;transition:color 0.15s;}
        .sb-label{white-space:nowrap;overflow:hidden;}
        .sidebar-collapsed .sb-label{display:none;}
        .sb-active-bar{position:absolute;left:0;top:25%;bottom:25%;width:3px;background:#6366f1;border-radius:0 3px 3px 0;}
        .sb-footer{padding:16px 20px;border-top:1px solid #1e2535;display:flex;align-items:center;gap:10px;}
        .pulse-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;box-shadow:0 0 6px #22c55e;animation:pulse 2s ease-in-out infinite;flex-shrink:0;}
        .sb-live{font-size:12px;font-weight:600;color:#22c55e;letter-spacing:0.5px;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}

        /* MAIN */
        .main-area{flex:1;min-width:0;display:flex;flex-direction:column;background:#0f1117;}
        .page-header{padding:28px 32px 24px;border-bottom:1px solid #1e2535;}
        .page-title{font-size:20px;font-weight:700;color:#f1f5f9;letter-spacing:-0.3px;margin-bottom:4px;}
        .page-sub{font-size:13px;color:#64748b;font-weight:400;}
        .content-panel{padding:24px 32px;}

        /* PAYMENT TABS */
        .tab-row{display:flex;gap:6px;margin-top:18px;}
        .ptab{background:transparent;border:1px solid #1e2535;color:#64748b;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.3px;padding:7px 16px;cursor:pointer;display:flex;align-items:center;gap:8px;transition:all 0.15s;border-radius:6px;}
        .ptab:hover{border-color:#334155;color:#94a3b8;}
        .ptab-active{background:rgba(99,102,241,0.1);border-color:#6366f1;color:#818cf8;}
        .ptab-dot{width:6px;height:6px;border-radius:50%;background:var(--acc);opacity:0;transition:opacity 0.15s;}
        .ptab-active .ptab-dot{opacity:1;}
        .ptab-count{background:#1e2535;border-radius:4px;padding:1px 7px;font-size:11px;font-weight:700;color:#94a3b8;}
        .ptab-active .ptab-count{background:#6366f1;color:#fff;}

        /* CARDS */
        .cards-grid{display:flex;flex-direction:column;gap:12px;padding:24px 32px;}
        .empty-state{text-align:center;padding:80px 20px;color:#334155;}
        .empty-icon{font-size:40px;margin-bottom:14px;opacity:0.4;}
        .empty-state p{font-size:14px;font-weight:700;letter-spacing:2px;margin-bottom:6px;color:#475569;}
        .empty-state span{font-size:12px;color:#334155;}
        .card{background:#161b27;border:1px solid #1e2535;border-radius:10px;position:relative;overflow:hidden;animation:cardIn 0.25s ease both;transition:border-color 0.15s,box-shadow 0.15s;}
        .card:hover{border-color:#2a3347;box-shadow:0 4px 24px rgba(0,0,0,0.3);}
        @keyframes cardIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
        .card-accent{position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#6366f1,#8b5cf6);}
        .card-header{display:flex;justify-content:space-between;align-items:flex-start;padding:18px 20px 14px;gap:16px;}
        .card-meta{display:flex;flex-direction:column;gap:8px;flex:1;min-width:0;}
        .card-rid{font-size:10px;font-weight:600;letter-spacing:1.5px;color:#475569;text-transform:uppercase;}
        .card-email{font-size:16px;font-weight:700;color:#f1f5f9;word-break:break-all;}
        .card-scse{display:flex;align-items:flex-start;gap:10px;padding:8px 10px;background:#0f1117;border-radius:6px;border:1px solid #1e2535;}
        .card-txns{display:flex;flex-direction:column;gap:5px;}
        .txn-row{display:flex;align-items:center;gap:10px;}
        .fl{font-size:10px;font-weight:600;letter-spacing:1.5px;color:#475569;width:44px;flex-shrink:0;text-transform:uppercase;}
        .fv{font-size:13px;font-weight:500;color:#cbd5e1;}
        .txnv{font-family:'DM Sans',sans-serif;color:#818cf8;font-weight:600;}
        .status-chip{font-size:11px;font-weight:700;letter-spacing:0.5px;padding:4px 12px;flex-shrink:0;border-radius:20px;text-transform:uppercase;}
        .status-pending{background:rgba(245,158,11,0.12);color:#f59e0b;border:1px solid rgba(245,158,11,0.25);}
        .status-verified{background:rgba(34,197,94,0.12);color:#22c55e;border:1px solid rgba(34,197,94,0.25);}
        .status-rejected{background:rgba(239,68,68,0.12);color:#ef4444;border:1px solid rgba(239,68,68,0.25);}
        .proof-wrap{position:relative;margin:0 20px 14px;cursor:pointer;overflow:hidden;border-radius:6px;border:1px solid #1e2535;}
        .proof-img{width:100%;height:160px;object-fit:cover;display:block;filter:brightness(0.85);transition:filter 0.2s;}
        .proof-wrap:hover .proof-img{filter:brightness(1);}
        .proof-ov{position:absolute;inset:0;display:flex;align-items:flex-end;justify-content:center;padding-bottom:10px;font-size:11px;font-weight:600;letter-spacing:1px;color:rgba(255,255,255,0.8);opacity:0;transition:opacity 0.2s;background:linear-gradient(transparent 50%,rgba(0,0,0,0.65));}
        .proof-wrap:hover .proof-ov{opacity:1;}
        .card-actions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0 20px 18px;}
        .btn-approve,.btn-reject{border:none;padding:10px;cursor:pointer;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.3px;display:flex;align-items:center;justify-content:center;gap:6px;transition:all 0.15s;border-radius:6px;}
        .btn-approve{background:rgba(34,197,94,0.1);color:#22c55e;border:1px solid rgba(34,197,94,0.25);}
        .btn-approve:hover:not(:disabled){background:rgba(34,197,94,0.18);box-shadow:0 0 16px rgba(34,197,94,0.15);}
        .btn-reject{background:rgba(239,68,68,0.1);color:#ef4444;border:1px solid rgba(239,68,68,0.25);}
        .btn-reject:hover:not(:disabled){background:rgba(239,68,68,0.18);box-shadow:0 0 16px rgba(239,68,68,0.15);}
        .btn-approve:disabled,.btn-reject:disabled{opacity:0.35;cursor:not-allowed;}
        .final-badge{margin:0 20px 18px;padding:10px;text-align:center;font-size:12px;font-weight:600;letter-spacing:0.5px;border-radius:6px;}
        .badge-ok{background:rgba(34,197,94,0.08);border:1px solid rgba(34,197,94,0.2);color:#22c55e;}
        .badge-no{background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);color:#ef4444;}
        .spin{display:inline-block;width:14px;height:14px;border:2px solid rgba(255,255,255,0.15);border-top-color:currentColor;border-radius:50%;animation:sp 0.6s linear infinite;}
        @keyframes sp{to{transform:rotate(360deg)}}

        /* SEARCH / FORMS */
        .search-box{display:flex;flex-wrap:wrap;margin-bottom:20px;border-radius:8px;overflow:hidden;border:1px solid #1e2535;}
        .s-prefix{background:#1e2535;color:#818cf8;font-family:'Inter',sans-serif;font-size:13px;font-weight:700;padding:11px 14px;display:flex;align-items:center;white-space:nowrap;border-right:1px solid #2a3347;}
        .s-input{flex:1;background:#161b27;border:none;color:#f1f5f9;font-family:'Inter',sans-serif;font-size:14px;padding:11px 14px;outline:none;height:42px;}
        .s-input::placeholder{color:#334155;}
        textarea.s-input{height:auto;resize:vertical;min-height:100px;}
        select.s-input{appearance:none;cursor:pointer;}
        .s-btn{background:#6366f1;border:none;color:#fff;font-family:'Inter',sans-serif;font-size:12px;font-weight:600;letter-spacing:0.3px;padding:11px 20px;cursor:pointer;transition:background 0.15s;white-space:nowrap;display:flex;align-items:center;gap:6px;}
        .s-btn:hover:not(:disabled){background:#4f46e5;}
        .s-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .err-msg{color:#ef4444;font-size:13px;font-weight:500;margin-bottom:14px;padding:10px 14px;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);border-radius:6px;}
        .result-card{background:#161b27;border:1px solid #1e2535;border-radius:10px;padding:20px;position:relative;max-width:520px;animation:cardIn 0.25s ease both;}
        .sr-row{display:flex;align-items:center;gap:16px;padding:11px 0;border-bottom:1px solid #1e2535;}
        .sr-row:last-child{border-bottom:none;}
        .sr-l{font-size:10px;font-weight:600;letter-spacing:1.5px;color:#475569;width:90px;flex-shrink:0;text-transform:uppercase;}
        .sr-v{font-size:14px;font-weight:500;color:#e2e8f0;}
        .ok{color:#22c55e;font-weight:600;} .no{color:#ef4444;font-weight:600;}
        .form-stack{display:flex;flex-direction:column;gap:16px;max-width:100%;}
        .form-field{display:flex;flex-direction:column;gap:6px;}
        .form-label{font-size:11px;font-weight:600;letter-spacing:1px;color:#64748b;text-transform:uppercase;}

        /* STATS */
        .stat-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:14px;padding:0 0 8px;}
        .scard{background:#161b27;border:1px solid #1e2535;border-radius:10px;padding:20px;position:relative;overflow:hidden;transition:border-color 0.15s,transform 0.15s;}
        .scard:hover{border-color:#2a3347;transform:translateY(-1px);}
        .scard::before{content:'';position:absolute;top:0;left:0;right:0;height:3px;background:var(--sc);opacity:0.8;}
        .scard-icon{font-size:18px;margin-bottom:12px;opacity:0.6;}
        .scard-val{font-size:32px;font-weight:800;color:#f1f5f9;line-height:1;margin-bottom:6px;letter-spacing:-1px;}
        .scard-label{font-size:11px;font-weight:600;letter-spacing:0.5px;color:#64748b;text-transform:uppercase;}
        .scard-bar{position:absolute;bottom:0;left:0;width:40%;height:1px;background:var(--sc);opacity:0.3;}
        .divider-row{display:flex;align-items:center;gap:14px;margin-bottom:16px;}
        .divider-lbl{font-size:11px;font-weight:600;letter-spacing:1px;color:#475569;white-space:nowrap;text-transform:uppercase;}
        .divider-line{flex:1;height:1px;background:#1e2535;}
        .evt-table{display:flex;flex-direction:column;border:1px solid #1e2535;border-radius:8px;overflow:hidden;}
        .evt-thead{display:grid;grid-template-columns:1fr 100px 120px;padding:10px 16px;background:#1e2535;font-size:10px;font-weight:700;letter-spacing:1.5px;color:#64748b;text-transform:uppercase;}
        .evt-row{display:grid;grid-template-columns:1fr 100px 120px;padding:12px 16px;border-top:1px solid #1e2535;transition:background 0.12s;}
        .evt-row:hover{background:#1a2030;}
        .evt-name{font-size:13px;font-weight:500;color:#e2e8f0;}
        .evt-num{font-size:13px;font-weight:700;color:#818cf8;}

        /* LIGHTBOX */
        .lb-back{position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,0.85);display:flex;align-items:center;justify-content:center;padding:20px;backdrop-filter:blur(4px);}
        .lb-box{position:relative;max-width:90vw;max-height:90vh;display:flex;flex-direction:column;align-items:center;gap:10px;}
        .lb-close{position:absolute;top:-14px;right:-14px;width:32px;height:32px;border-radius:50%;background:#1e2535;border:1px solid #334155;color:#94a3b8;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all 0.15s;}
        .lb-close:hover{background:#ef4444;border-color:#ef4444;color:#fff;}
        .lb-img{max-width:90vw;max-height:80vh;object-fit:contain;border-radius:6px;border:1px solid #1e2535;}
        .lb-open{font-size:12px;font-weight:600;color:#818cf8;text-decoration:none;padding:7px 18px;border:1px solid #334155;background:#161b27;border-radius:6px;transition:all 0.15s;}
        .lb-open:hover{background:#1e2535;border-color:#6366f1;}

        @media(max-width:768px){
          .sidebar{position:fixed;z-index:200;top:70px;height:calc(100vh - 70px);}
          .sidebar-collapsed{width:0;overflow:hidden;border:none;}
          .cards-grid,.content-panel{padding:12px;}
          .page-header{padding:16px 12px;}
          .card-actions{grid-template-columns:1fr;}
          .stat-grid{grid-template-columns:1fr 1fr;}
          .card-header{flex-direction:column;gap:10px;}
          .search-box{flex-wrap:wrap;}
          .s-prefix{border-right:1px solid #2a3347;border-bottom:none;}
          .s-input{min-width:0;flex:1 1 120px;}
          .s-btn{width:100%;justify-content:center;}
          .proof-img{height:120px;}
          .result-card{max-width:100%;}
          .form-stack{max-width:100%;}
          .tab-row{flex-wrap:wrap;}
          .ptab{flex:1 1 auto;justify-content:center;}
          .evt-thead,.evt-row{grid-template-columns:1fr 60px 80px;font-size:11px;}
          .mob-topbar{display:flex;align-items:center;gap:14px;padding:12px 16px;border-bottom:1px solid #1e2535;background:#161b27;position:sticky;top:0;z-index:10;}
          .mob-menu-btn{background:transparent;border:1px solid #2a3347;border-radius:6px;width:36px;height:36px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;flex-shrink:0;}
          .mob-menu-btn span{display:block;width:16px;height:2px;background:#94a3b8;border-radius:2px;}
          .mob-title{font-size:15px;font-weight:700;color:#f1f5f9;}
          .sb-backdrop{position:fixed;inset:0;top:70px;z-index:199;background:rgba(0,0,0,0.5);}
        }
        @media(min-width:769px){
          .mob-topbar{display:none;}
          .sb-backdrop{display:none;}
        }
      `}</style>
    </div>
  );
}
