"use client";

import { useState } from "react";

type Payment = {
  _id: string;
  teamName: string;
  eventName: string;
  members: string[];
  paymentProof: string;
  status?: string;
};

type Tab = "pending" | "approved" | "rejected";

export default function AdminClient({ payments }: { payments: Payment[] }) {
  const [localPayments, setLocalPayments] = useState<Payment[]>(payments);
  const [activeTab, setActiveTab] = useState<Tab>("pending");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const updateStatus = async (id: string, status: string) => {
    setLoadingId(id);
    try {
      await fetch("/api/admin/update-status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setLocalPayments((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status } : p))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingId(null);
    }
  };

  const pending = localPayments.filter((p) => !p.status || p.status === "pending");
  const approved = localPayments.filter((p) => p.status === "verified");
  const rejected = localPayments.filter((p) => p.status === "rejected");

  const tabData: Record<Tab, Payment[]> = {
    pending,
    approved,
    rejected,
  };

  const current = tabData[activeTab];

  const tabConfig = [
    {
      key: "pending" as Tab,
      label: "PENDING",
      count: pending.length,
      color: "#f59e0b",
      glow: "rgba(245,158,11,0.4)",
    },
    {
      key: "approved" as Tab,
      label: "APPROVED",
      count: approved.length,
      color: "#00ffb3",
      glow: "rgba(0,255,179,0.4)",
    },
    {
      key: "rejected" as Tab,
      label: "REJECTED",
      count: rejected.length,
      color: "#ff2d6b",
      glow: "rgba(255,45,107,0.4)",
    },
  ];

  return (
    <div className="admin-root">
      {/* Scanline overlay */}
      <div className="scanlines" />

      {/* Top HUD bar */}
      <header className="hud-bar">
        <div className="hud-left">
          <span className="hud-badge">SYS//ADMIN</span>
          <span className="hud-title">PAYMENT CONTROL CENTER</span>
        </div>
        <div className="hud-right">
          <span className="hud-stat">
            TOTAL <strong>{localPayments.length}</strong>
          </span>
          <div className="pulse-dot" />
          <span className="hud-live">LIVE</span>
        </div>
      </header>

      {/* Stats row */}
      <div className="stats-row">
        {tabConfig.map((t) => (
          <div
            key={t.key}
            className="stat-card"
            style={{ "--accent": t.color, "--glow": t.glow } as any}
            onClick={() => setActiveTab(t.key)}
          >
            <div className="stat-number">{t.count}</div>
            <div className="stat-label">{t.label}</div>
            <div className="stat-bar">
              <div
                className="stat-bar-fill"
                style={{
                  width: `${localPayments.length ? (t.count / localPayments.length) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <nav className="tabs">
        {tabConfig.map((t) => (
          <button
            key={t.key}
            className={`tab-btn ${activeTab === t.key ? "tab-active" : ""}`}
            style={{ "--accent": t.color, "--glow": t.glow } as any}
            onClick={() => setActiveTab(t.key)}
          >
            <span className="tab-indicator" />
            {t.label}
            <span className="tab-count">{t.count}</span>
          </button>
        ))}
      </nav>

      {/* Section divider */}
      <div className="section-divider">
        <span className="divider-label">
          {`// ${activeTab.toUpperCase()} REQUESTS — ${current.length} RECORDS`}
        </span>
        <div className="divider-line" />
      </div>

      {/* Payment cards grid */}
      <main className="cards-grid">
        {current.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">◈</div>
            <p>NO RECORDS FOUND</p>
            <span>This queue is clear.</span>
          </div>
        ) : (
          current.map((p, i) => (
            <div
              key={p._id}
              className={`card ${expandedId === p._id ? "card-expanded" : ""}`}
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* Card top accent */}
              <div className="card-accent" />

              {/* Card header */}
              <div className="card-header">
                <div>
                  <div className="card-id">
                    #{p._id.slice(-6).toUpperCase()}
                  </div>
                  <h2 className="card-team">{p.teamName}</h2>
                  <div className="card-event">{p.eventName}</div>
                </div>
                <div
                  className={`status-chip status-${p.status || "pending"}`}
                >
                  {(p.status || "pending").toUpperCase()}
                </div>
              </div>

              {/* Members */}
              <div className="members-row">
                {p.members.map((m, idx) => (
                  <span key={idx} className="member-tag">
                    {m}
                  </span>
                ))}
              </div>

              {/* Proof image */}
              <div
                className="proof-container"
                onClick={() =>
                  setExpandedId(expandedId === p._id ? null : p._id)
                }
              >
                <img
                  src={p.paymentProof}
                  alt="Payment proof"
                  className="proof-img"
                />
                <div className="proof-overlay">
                  <span>{expandedId === p._id ? "COLLAPSE ▲" : "EXPAND ▼"}</span>
                </div>
                <div className="proof-corner tl" />
                <div className="proof-corner tr" />
                <div className="proof-corner bl" />
                <div className="proof-corner br" />
              </div>

              {/* Actions — only show on pending tab */}
              {activeTab === "pending" && (
                <div className="card-actions">
                  <button
                    className="btn-approve"
                    disabled={loadingId === p._id}
                    onClick={() => updateStatus(p._id, "verified")}
                  >
                    {loadingId === p._id ? (
                      <span className="btn-loading" />
                    ) : (
                      "▶ APPROVE"
                    )}
                  </button>
                  <button
                    className="btn-reject"
                    disabled={loadingId === p._id}
                    onClick={() => updateStatus(p._id, "rejected")}
                  >
                    {loadingId === p._id ? (
                      <span className="btn-loading" />
                    ) : (
                      "✕ REJECT"
                    )}
                  </button>
                </div>
              )}

              {/* Approved/Rejected state badge */}
              {activeTab !== "pending" && (
                <div
                  className={`final-badge ${
                    activeTab === "approved" ? "badge-approved" : "badge-rejected"
                  }`}
                >
                  {activeTab === "approved"
                    ? "✔ PAYMENT VERIFIED"
                    : "✕ PAYMENT REJECTED"}
                </div>
              )}
            </div>
          ))
        )}
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&family=Orbitron:wght@400;700;900&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .admin-root {
          min-height: 100vh;
          background: #03060f;
          background-image:
            radial-gradient(ellipse 80% 50% at 50% -10%, rgba(0,120,255,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 60% 40% at 80% 80%, rgba(255,20,100,0.06) 0%, transparent 60%),
            linear-gradient(180deg, #03060f 0%, #060d1a 100%);
          font-family: 'Share Tech Mono', monospace;
          color: #b8d4f0;
          position: relative;
          overflow-x: hidden;
          padding-bottom: 60px;
        }

        .scanlines {
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent,
            transparent 2px,
            rgba(0,0,0,0.08) 2px,
            rgba(0,0,0,0.08) 4px
          );
          pointer-events: none;
          z-index: 100;
        }

        /* HUD BAR */
        .hud-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 32px;
          border-bottom: 1px solid rgba(0,180,255,0.15);
          background: rgba(0,10,30,0.9);
          backdrop-filter: blur(10px);
          position: sticky;
          top: 0;
          z-index: 50;
        }
        .hud-left { display: flex; align-items: center; gap: 16px; }
        .hud-badge {
          font-family: 'Orbitron', sans-serif;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 10px;
          border: 1px solid rgba(0,180,255,0.5);
          color: #00b4ff;
          letter-spacing: 2px;
          text-shadow: 0 0 8px rgba(0,180,255,0.8);
        }
        .hud-title {
          font-family: 'Orbitron', sans-serif;
          font-size: 13px;
          font-weight: 900;
          letter-spacing: 3px;
          color: #e0f0ff;
          text-shadow: 0 0 20px rgba(0,180,255,0.4);
        }
        .hud-right { display: flex; align-items: center; gap: 12px; }
        .hud-stat { font-size: 11px; color: #5a8ab0; letter-spacing: 1px; }
        .hud-stat strong { color: #00b4ff; }
        .pulse-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #00ffb3;
          box-shadow: 0 0 10px #00ffb3;
          animation: pulse 1.5s ease-in-out infinite;
        }
        .hud-live { font-size: 10px; letter-spacing: 2px; color: #00ffb3; }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        /* STATS ROW */
        .stats-row {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          margin: 24px 32px;
          border: 1px solid rgba(0,180,255,0.08);
        }
        .stat-card {
          background: rgba(5,15,35,0.8);
          padding: 20px 24px;
          cursor: pointer;
          position: relative;
          overflow: hidden;
          transition: background 0.2s;
          border-right: 1px solid rgba(0,180,255,0.08);
        }
        .stat-card:last-child { border-right: none; }
        .stat-card:hover { background: rgba(10,25,55,0.9); }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: var(--accent);
          box-shadow: 0 0 12px var(--glow);
        }
        .stat-number {
          font-family: 'Orbitron', sans-serif;
          font-size: 36px;
          font-weight: 900;
          color: var(--accent);
          text-shadow: 0 0 20px var(--glow);
          line-height: 1;
        }
        .stat-label {
          font-size: 10px;
          letter-spacing: 3px;
          color: rgba(180,210,240,0.5);
          margin-top: 4px;
          margin-bottom: 12px;
        }
        .stat-bar {
          height: 2px;
          background: rgba(255,255,255,0.06);
          border-radius: 1px;
        }
        .stat-bar-fill {
          height: 100%;
          background: var(--accent);
          box-shadow: 0 0 6px var(--glow);
          border-radius: 1px;
          transition: width 0.8s ease;
        }

        /* TABS */
        .tabs {
          display: flex;
          gap: 0;
          padding: 0 32px;
          border-bottom: 1px solid rgba(0,180,255,0.1);
        }
        .tab-btn {
          background: transparent;
          border: none;
          border-bottom: 2px solid transparent;
          color: rgba(180,210,240,0.4);
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 3px;
          padding: 14px 28px;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 10px;
          transition: all 0.2s;
          position: relative;
        }
        .tab-btn:hover { color: var(--accent); }
        .tab-active {
          color: var(--accent) !important;
          border-bottom-color: var(--accent);
          text-shadow: 0 0 10px var(--glow);
        }
        .tab-indicator {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--accent);
          box-shadow: 0 0 8px var(--glow);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .tab-active .tab-indicator { opacity: 1; }
        .tab-count {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 1px 7px;
          border-radius: 2px;
          font-size: 10px;
        }
        .tab-active .tab-count {
          background: var(--accent);
          color: #000;
          border-color: var(--accent);
        }

        /* DIVIDER */
        .section-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 20px 32px 0;
        }
        .divider-label {
          font-size: 10px;
          letter-spacing: 2px;
          color: rgba(0,180,255,0.4);
          white-space: nowrap;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, rgba(0,180,255,0.2), transparent);
        }

        /* GRID */
        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
          gap: 20px;
          padding: 20px 32px;
        }

        /* EMPTY */
        .empty-state {
          grid-column: 1 / -1;
          text-align: center;
          padding: 80px 20px;
          color: rgba(180,210,240,0.2);
        }
        .empty-icon {
          font-size: 48px;
          margin-bottom: 16px;
          color: rgba(0,180,255,0.2);
        }
        .empty-state p { font-size: 14px; letter-spacing: 4px; margin-bottom: 8px; }
        .empty-state span { font-size: 11px; }

        /* CARD */
        .card {
          background: rgba(4,12,28,0.95);
          border: 1px solid rgba(0,180,255,0.1);
          position: relative;
          overflow: hidden;
          animation: cardIn 0.4s ease both;
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .card:hover {
          border-color: rgba(0,180,255,0.3);
          box-shadow: 0 0 30px rgba(0,180,255,0.05), inset 0 0 40px rgba(0,180,255,0.02);
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .card-accent {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(0,180,255,0.6), transparent);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 18px 18px 12px;
        }
        .card-id {
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(0,180,255,0.4);
          margin-bottom: 4px;
        }
        .card-team {
          font-family: 'Orbitron', sans-serif;
          font-size: 14px;
          font-weight: 700;
          color: #e0f0ff;
          letter-spacing: 1px;
          margin-bottom: 3px;
        }
        .card-event {
          font-size: 11px;
          color: rgba(180,210,240,0.5);
          letter-spacing: 1px;
        }

        .status-chip {
          font-size: 9px;
          letter-spacing: 2px;
          padding: 4px 10px;
          border-radius: 2px;
          flex-shrink: 0;
        }
        .status-pending {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.4);
          color: #f59e0b;
        }
        .status-verified {
          background: rgba(0,255,179,0.08);
          border: 1px solid rgba(0,255,179,0.4);
          color: #00ffb3;
        }
        .status-rejected {
          background: rgba(255,45,107,0.08);
          border: 1px solid rgba(255,45,107,0.4);
          color: #ff2d6b;
        }

        /* MEMBERS */
        .members-row {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
          padding: 0 18px 14px;
        }
        .member-tag {
          font-size: 10px;
          letter-spacing: 1px;
          padding: 3px 10px;
          background: rgba(0,180,255,0.06);
          border: 1px solid rgba(0,180,255,0.15);
          color: rgba(180,210,240,0.7);
        }

        /* PROOF */
        .proof-container {
          position: relative;
          margin: 0 18px 14px;
          cursor: pointer;
          overflow: hidden;
        }
        .card-expanded .proof-container { margin-bottom: 0; }
        .proof-img {
          width: 100%;
          height: 160px;
          object-fit: cover;
          display: block;
          filter: brightness(0.85) saturate(0.9);
          transition: height 0.3s ease, filter 0.2s;
        }
        .card-expanded .proof-img { height: 260px; }
        .proof-container:hover .proof-img { filter: brightness(1) saturate(1.1); }
        .proof-overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(transparent 50%, rgba(0,0,0,0.7));
          display: flex;
          align-items: flex-end;
          justify-content: center;
          padding-bottom: 8px;
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(0,180,255,0.6);
          opacity: 0;
          transition: opacity 0.2s;
        }
        .proof-container:hover .proof-overlay { opacity: 1; }

        /* Corner decorations */
        .proof-corner {
          position: absolute;
          width: 10px; height: 10px;
        }
        .tl { top: 4px; left: 4px; border-top: 1px solid rgba(0,180,255,0.5); border-left: 1px solid rgba(0,180,255,0.5); }
        .tr { top: 4px; right: 4px; border-top: 1px solid rgba(0,180,255,0.5); border-right: 1px solid rgba(0,180,255,0.5); }
        .bl { bottom: 4px; left: 4px; border-bottom: 1px solid rgba(0,180,255,0.5); border-left: 1px solid rgba(0,180,255,0.5); }
        .br { bottom: 4px; right: 4px; border-bottom: 1px solid rgba(0,180,255,0.5); border-right: 1px solid rgba(0,180,255,0.5); }

        /* ACTIONS */
        .card-actions {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1px;
          margin: 0 18px 18px;
        }
        .btn-approve, .btn-reject {
          border: none;
          padding: 11px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 11px;
          letter-spacing: 2px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s;
          position: relative;
          overflow: hidden;
        }
        .btn-approve {
          background: rgba(0,255,179,0.08);
          color: #00ffb3;
          border: 1px solid rgba(0,255,179,0.25);
        }
        .btn-approve:hover:not(:disabled) {
          background: rgba(0,255,179,0.15);
          box-shadow: 0 0 20px rgba(0,255,179,0.2);
          border-color: rgba(0,255,179,0.5);
        }
        .btn-reject {
          background: rgba(255,45,107,0.08);
          color: #ff2d6b;
          border: 1px solid rgba(255,45,107,0.25);
        }
        .btn-reject:hover:not(:disabled) {
          background: rgba(255,45,107,0.15);
          box-shadow: 0 0 20px rgba(255,45,107,0.2);
          border-color: rgba(255,45,107,0.5);
        }
        .btn-approve:disabled, .btn-reject:disabled { opacity: 0.4; cursor: not-allowed; }

        .btn-loading {
          display: inline-block;
          width: 14px; height: 14px;
          border: 2px solid rgba(255,255,255,0.2);
          border-top-color: currentColor;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* FINAL BADGE */
        .final-badge {
          margin: 0 18px 18px;
          padding: 12px;
          text-align: center;
          font-size: 11px;
          letter-spacing: 3px;
        }
        .badge-approved {
          background: rgba(0,255,179,0.05);
          border: 1px solid rgba(0,255,179,0.2);
          color: #00ffb3;
        }
        .badge-rejected {
          background: rgba(255,45,107,0.05);
          border: 1px solid rgba(255,45,107,0.2);
          color: #ff2d6b;
        }

        @media (max-width: 768px) {
          .hud-bar { padding: 12px 16px; }
          .hud-title { display: none; }
          .stats-row { margin: 16px; }
          .tabs { padding: 0 16px; }
          .section-divider { padding: 16px 16px 0; }
          .cards-grid { padding: 16px; gap: 14px; }
          .tab-btn { padding: 12px 16px; font-size: 10px; }
        }
      `}</style>
    </div>
  );
}