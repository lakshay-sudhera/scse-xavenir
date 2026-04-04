"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import RegisterForEvent from "@/components/RegisterForEvent";

interface EventType {
  _id: string;
  name: string;
  description: string;
  logo: string;
  prizepool: number;
  regFees: number;
  rules: string;
  more: string;
  maxPart: number;
  minPart: number;
}


/* ── tiny reusable section block ── */
function InfoBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="ib-wrap">
      <div className="ib-header">
        <span className="ib-bracket">[</span>
        <span className="ib-title">{title}</span>
        <span className="ib-bracket">]</span>
        <div className="ib-line" />
      </div>
      <div className="ib-body">{children}</div>
      <style>{`
        .ib-wrap { margin-bottom: 24px; }
        .ib-header { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
        .ib-bracket { color:#00fff0; font-family:'Share Tech Mono',monospace; font-size:1rem; }
        .ib-title { font-family:'Orbitron',sans-serif; font-size:.85rem; font-weight:700;
          letter-spacing:.2em; color:#00fff0; }
        .ib-line { flex:1; height:1px;
          background:linear-gradient(90deg,rgba(0,255,240,.28),transparent); }
        .ib-body { padding-left:14px; border-left:2px solid rgba(0,255,240,.12); }
      `}</style>
    </div>
  );
}

export default function RegisterEventPage() {
  const router = useRouter();
  const { eventName } = useParams();
  const [eventData, setEventData] = useState<EventType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>("");

  useEffect(() => {
    if (!eventName) { router.push("/events"); return; }
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event/${eventName}`);
        const data = await res.json();
        if (!data.success) {
          setErrorMsg(data.message || "Event not found");
        } else {
          setEventData(data.event);
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        setErrorMsg("Server error");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventName, router]);

  /* ── Loading ── */
  if (loading) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
      <div className="state-screen">
        <div className="bg-grid"/><div className="bg-glow c"/><div className="bg-glow m"/>
        <div className="state-inner">
          <span className="blink">▋</span>
          <span className="state-txt">DECRYPTING NODE DATA...</span>
        </div>
        <StateStyles/>
      </div>
    </>
  );

  /* ── Error ── */
  if (errorMsg) return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>
      <div className="state-screen">
        <div className="bg-grid"/><div className="bg-glow c"/><div className="bg-glow m"/>
        <div className="state-inner err">
          <span className="err-icon">⚠</span>
          <span className="state-txt">{errorMsg.toUpperCase()}</span>
        </div>
        <StateStyles/>
      </div>
    </>
  );

  if (!eventData) return null;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>

      <div className="cp-root">
        {/* Backgrounds */}
        <div className="bg-grid"/>
        <div className="bg-glow c"/>
        <div className="bg-glow m"/>

        {/* ── Top bar ── */}
        <div className="page-topbar">
          <button className="back-btn" onClick={() => router.back()}>← BACK TO NODES</button>
          <span className="page-eyebrow">// EVENT.NODE.DETAIL</span>
        </div>

        <main className="cp-main">
          {/* ══ HEADER ══ */}
          <header className="cp-header">
            <div className="header-left">
              <p className="header-sub-eye">NIT JAMSHEDPUR // SCSE // XAVENIR</p>
              <h1 className="header-title">
                {eventData.name.toUpperCase()}
              </h1>
              <div className="header-title-bar"/>
              <p className="header-desc">{eventData.description}</p>
            </div>
            <div className="header-badge">
              <span className="hb-rdy">EVENT // READY</span>
              <div className="hb-row">
                <span className="hb-scse">SCSE</span>
                <span className="hb-date">APR 26</span>
              </div>
              <div className="hb-sub-row">
                <span className="hb-sub">XAVENIR 2026</span>
                <span className="hb-sub">REGISTER NOW</span>
              </div>
            </div>
          </header>

          {/* ══ BODY ══ */}
          <div className="cp-body">

            {/* ── LEFT: Image + Stats + Register ── */}
            <div className="left-col">

              {/* Image frame */}
              <div className="img-frame">
                <div className="img-topbar">
                  <span className="itb-buf">BUF.STREAM</span>
                  <span className="itb-bars"><b/><b/><b/></span>
                  <span className="itb-hex">0x{Math.floor(Math.random()*0xFFFFFF).toString(16).toUpperCase().padStart(6,"0")}</span>
                </div>
                <div className="img-wrap">
                  <img
                  src={eventData.logo}
                  alt={eventData.name}
                  className="img-obj absolute inset-0 w-full h-full"
                  />
                  <div className="img-scanlines"/>
                  <div className="img-overlay"/>
                  <span className="hud tl"/><span className="hud tr"/>
                  <span className="hud bl"/><span className="hud br"/>
                  <div className="img-date-badge">APR 26</div>
                </div>
                <div className="img-statusbar">
                  <span className="isb-dec">DECRYPTED</span>
                  <div className="isb-prog"><div className="isb-fill"/></div>
                  <span className="isb-clr">CLR // OK</span>
                </div>
              </div>

              {/* Stats grid */}
              <div className="stats-grid">
                <StatCard accent="cyan" label="PRIZE POOL" value={`₹${eventData.prizepool.toLocaleString("en-IN")}`}/>
                <StatCard accent="magenta" label="REG FEES" value={eventData.regFees === 0 ? "FREE" : `₹${eventData.regFees}`}/>
                <StatCard accent="purple" label="MIN TEAM" value={`${eventData.minPart}P`}/>
                <StatCard accent="purple" label="MAX TEAM" value={`${eventData.maxPart}P`}/>
              </div>

              {/* Team dot visualizer */}
              <div className="team-vis">
                <span className="tv-label">TEAM SIZE</span>
                <div className="tv-dots">
                  {Array.from({length: eventData.maxPart}).map((_,i) => (
                    <span key={i} className={`tv-dot${i < eventData.minPart ? " active" : ""}`}/>
                  ))}
                </div>
                <span className="tv-range">
                  {eventData.minPart === eventData.maxPart
                    ? `${eventData.minPart} participant${eventData.minPart > 1 ? "s" : ""}`
                    : `${eventData.minPart}–${eventData.maxPart} participants`}
                </span>
              </div>

              {/* Register button (component) */}
              <div className="reg-wrap">
                <RegisterForEvent
                  eventName={eventData.name}
                  maxPart={eventData.maxPart}
                  minPart={eventData.minPart}
                  regFees={eventData.regFees}
                />
              </div>

              {/* WhatsApp */}
              <a
                href="https://chat.whatsapp.com/JSwbC8kQxEKJQGY2S2S3ob"
                target="_blank"
                className="wa-btn"
              >
                <img src="/whatsapp.svg" alt="WhatsApp" className="wa-icon"/>
                JOIN WHATSAPP GROUP
              </a>
            </div>

            {/* ── RIGHT: Info ── */}
            <div className="right-col">

              {/* Payment info */}
              <InfoBlock title="DIRECT REGISTRATION">
                <div className="pay-card green">
                  <div className="pay-icon">⚡</div>
                  <div>
                    <p className="pay-title">Direct Registration</p>
                    <p className="pay-desc">
                      For <strong>non-CSE NIT students</strong>: Team fee{" "}
                      <span className="pay-highlight">₹{eventData.regFees}</span>
                    </p>
                    <div className="pay-checks">
                      <span className="pay-check">✓ Single team payment</span>
                      <span className="pay-check">✓ Get QR after filling team details</span>
                    </div>
                  </div>
                </div>
              </InfoBlock>

              <InfoBlock title="PRIME MEMBERSHIP">
                <div className="pay-card red">
                  <div className="pay-icon">⚠</div>
                  <div>
                    <p className="pay-title">Prime Membership Required</p>
                    <ul className="pay-list">
                      <li>All Computer Science students</li>
                      <li>Participants from non-NIT institutes</li>
                      <li>Mixed NIT/non-NIT teams</li>
                    </ul>
                  </div>
                </div>
              </InfoBlock>

              <InfoBlock title="COMPETITION RULES">
                <p className="rules-text">{eventData.rules}</p>
              </InfoBlock>

              {eventData.more && (
                <InfoBlock title="ADDITIONAL INTEL">
                  <div
                    className="more-html"
                    dangerouslySetInnerHTML={{ __html: eventData.more }}
                  />
                </InfoBlock>
              )}
            </div>
          </div>
        </main>
      </div>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .cp-root {
          position: relative;
          min-height: 100vh;
          background: #060818;
          font-family: 'Share Tech Mono', monospace;
          overflow-x: hidden;
          padding-bottom: 80px;
        }

        /* Backgrounds */
        .bg-grid {
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,255,240,.038) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,240,.038) 1px, transparent 1px);
          background-size: 55px 55px;
          pointer-events: none; z-index: 0;
        }
        .bg-glow {
          position: fixed; border-radius: 50%;
          pointer-events: none; z-index: 0; filter: blur(140px);
        }
        .bg-glow.c { width:600px; height:600px; top:-120px; left:-200px; background:#00fff0; opacity:.065; }
        .bg-glow.m { width:700px; height:700px; bottom:-200px; right:-200px; background:#ff2d78; opacity:.065; }

        /* Top bar */
        .page-topbar {
          position: relative; z-index: 2;
          display: flex; align-items: center; justify-content: space-between;
          padding: 22px 6vw 0;
        }
        .back-btn {
          background: transparent;
          border: 1px solid rgba(0,255,240,.22);
          color: rgba(0,255,240,.65);
          font-family: 'Share Tech Mono', monospace;
          font-size: .72rem; letter-spacing: .14em;
          padding: 7px 16px; border-radius: 2px; cursor: pointer;
          transition: all .2s;
        }
        .back-btn:hover {
          border-color: #00fff0; color: #00fff0;
          background: rgba(0,255,240,.06);
          box-shadow: 0 0 12px rgba(0,255,240,.2);
        }
        .page-eyebrow {
          font-size: .78rem; letter-spacing: .22em;
          color: rgba(0,255,240,.35);
        }

        /* Main */
        .cp-main {
          position: relative; z-index: 1;
          max-width: 1280px; margin: 0 auto;
          padding: 32px 6vw 0;
        }

        /* Header */
        .cp-header {
          display: flex; justify-content: space-between; align-items: flex-start;
          gap: 28px; margin-bottom: 36px; flex-wrap: wrap;
        }
        .header-left { flex: 1; min-width: 280px; }
        .header-sub-eye {
          font-size: .78rem; letter-spacing: .22em;
          color: rgba(0,255,240,.4); margin-bottom: 10px;
        }
        .header-title {
          font-family: 'Orbitron', sans-serif;
          font-size: clamp(2rem, 4.5vw, 3.5rem);
          font-weight: 900; color: #fff;
          line-height: 1.05; margin-bottom: 12px;
          text-shadow: 0 0 24px rgba(0,255,240,.18);
        }
        .header-title-bar {
          height: 2px; width: 100%;
          background: linear-gradient(90deg, #ff2d78, #00fff0, transparent);
          margin-bottom: 14px;
        }
        .header-desc {
          font-size: .95rem; color: rgba(200,220,255,.55);
          line-height: 1.65; max-width: 520px;
        }

        /* Badge */
        .header-badge {
          border: 2px solid #00fff0;
          padding: 13px 18px; min-width: 220px; flex-shrink: 0;
          box-shadow: 0 0 18px rgba(0,255,240,.12), inset 0 0 18px rgba(0,255,240,.03);
        }
        .hb-rdy { font-size:.7rem; letter-spacing:.18em; color:rgba(0,255,240,.45); display:block; margin-bottom:7px; }
        .hb-row { display:flex; justify-content:space-between; align-items:baseline; }
        .hb-scse { font-family:'Orbitron',sans-serif; font-size:1.9rem; font-weight:900; color:#00fff0; text-shadow:0 0 16px rgba(0,255,240,.55); }
        .hb-date { font-family:'Orbitron',sans-serif; font-size:1.9rem; font-weight:900; color:#ff2d78; text-shadow:0 0 16px rgba(255,45,120,.55); }
        .hb-sub-row { display:flex; justify-content:space-between; margin-top:4px; }
        .hb-sub { font-size:.7rem; letter-spacing:.13em; color:rgba(200,220,255,.35); }

        /* Body layout */
        .cp-body {
          display: grid;
          grid-template-columns: 1fr 1.3fr;
          gap: 40px;
        }
        @media(max-width: 900px) { .cp-body { grid-template-columns: 1fr; } }

        /* Left col */
        .left-col { display: flex; flex-direction: column; gap: 18px; }

        /* Image frame */
        .img-topbar {
          display:flex; align-items:center; gap:8px; padding:5px 10px;
          background:rgba(0,8,26,.92); border:1px solid rgba(0,255,240,.2); border-bottom:none;
          font-family:'Share Tech Mono',monospace; font-size:.72rem;
        }
        .itb-buf { color:#00fff0; letter-spacing:.1em; }
        .itb-bars { display:flex; gap:3px; flex:1; }
        .itb-bars b { display:block; width:9px; height:8px; background:rgba(0,255,240,.4); clip-path:polygon(0 0,100% 0,100% 55%,0 55%); }
        .itb-hex { color:#ff2d78; font-size:.57rem; }
        .img-wrap {
          position:relative; width:100%; aspect-ratio:16/10;
          border:1px solid rgba(0,255,240,.2); border-top:none; border-bottom:none;
          overflow:hidden; background:#050012;
        }
        .img-obj { object-fit:cover; object-position:center; }
        .img-scanlines {
          position:absolute; inset:0; pointer-events:none;
          background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,240,.017) 2px,rgba(0,255,240,.017) 4px);
        }
        .img-overlay {
          position:absolute; inset:0;
          background:linear-gradient(to top, rgba(6,8,24,.6) 0%, transparent 50%);
        }
        .hud { position:absolute; width:11px; height:11px; border-color:#00fff0; border-style:solid; }
        .hud.tl { top:6px; left:6px; border-width:2px 0 0 2px; }
        .hud.tr { top:6px; right:6px; border-width:2px 2px 0 0; }
        .hud.bl { bottom:22px; left:6px; border-width:0 0 2px 2px; }
        .hud.br { bottom:22px; right:6px; border-width:0 2px 2px 0; }
        .img-date-badge {
          position:absolute; top:10px; right:10px; z-index:2;
          font-family:'Share Tech Mono',monospace; font-size:.58rem; letter-spacing:.12em; color:#fff;
          background:linear-gradient(135deg,#7b2ff7,#ff2d78); padding:3px 9px; border-radius:1px;
        }
        .img-statusbar {
          display:flex; align-items:center; gap:8px; padding:5px 10px;
          background:rgba(0,8,26,.92); border:1px solid rgba(0,255,240,.2); border-top:none;
          font-family:'Share Tech Mono',monospace; font-size:.72rem;
        }
        .isb-dec { color:#00fff0; min-width:80px; font-size:.72rem; }
        .isb-prog { flex:1; height:3px; background:rgba(0,255,240,.1); border-radius:2px; overflow:hidden; }
        .isb-fill { height:100%; width:100%; background:linear-gradient(90deg,#00fff0,#ff2d78); }
        .isb-clr { color:#ff2d78; font-size:.7rem; }

        /* Stats */
        .stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }

        /* Team vis */
        .team-vis {
          display:flex; flex-direction:column; gap:8px;
          padding:12px 14px;
          border:1px solid rgba(0,255,240,.12);
          background:rgba(0,8,26,.7);
        }
        .tv-label { font-size:.75rem; letter-spacing:.2em; color:rgba(0,255,240,.4); }
        .tv-dots { display:flex; gap:7px; flex-wrap:wrap; }
        .tv-dot { width:13px; height:13px; border-radius:50%; background:rgba(0,255,240,.12); }
        .tv-dot.active { background:#00fff0; box-shadow:0 0 8px rgba(0,255,240,.55); }
        .tv-range { font-size:.88rem; color:rgba(200,220,255,.5); }

        /* Register wrap */
        .reg-wrap { }

        /* WhatsApp */
        .wa-btn {
          display:inline-flex; align-items:center; gap:10px;
          background:rgba(37,211,102,.12);
          border:1px solid rgba(37,211,102,.35);
          color:rgba(37,211,102,.9);
          font-family:'Orbitron',sans-serif; font-size:.85rem; font-weight:700; letter-spacing:.12em;
          padding:10px 18px; border-radius:2px; cursor:pointer; text-decoration:none;
          transition:all .2s;
        }
        .wa-btn:hover {
          background:rgba(37,211,102,.22);
          border-color:rgba(37,211,102,.7);
          box-shadow:0 0 16px rgba(37,211,102,.25);
        }
        .wa-icon { width:18px; height:18px; }

        /* Right col */
        .right-col { }

        /* Pay cards */
        .pay-card {
          display:flex; gap:14px; align-items:flex-start;
          padding:14px 16px; border-radius:2px;
        }
        .pay-card.green {
          background:rgba(0,255,128,.05);
          border:1px solid rgba(0,255,128,.2);
        }
        .pay-card.red {
          background:rgba(255,45,120,.05);
          border:1px solid rgba(255,45,120,.2);
        }
        .pay-icon { font-size:1.3rem; flex-shrink:0; margin-top:2px; }
        .pay-card.green .pay-icon { color:#00ff80; }
        .pay-card.red .pay-icon { color:#ff2d78; }
        .pay-title {
          font-family:'Orbitron',sans-serif; font-size:.92rem; font-weight:700;
          margin-bottom:6px;
        }
        .pay-card.green .pay-title { color:#00ff80; }
        .pay-card.red .pay-title { color:#ff2d78; }
        .pay-desc { font-size:.9rem; color:rgba(200,220,255,.65); line-height:1.55; }
        .pay-highlight { color:#00fff0; font-weight:700; }
        .pay-checks { display:flex; flex-direction:column; gap:4px; margin-top:8px; }
        .pay-check { font-size:.85rem; color:rgba(0,255,128,.75); }
        .pay-list {
          list-style:none; display:flex; flex-direction:column; gap:4px;
          margin-top:6px;
        }
        .pay-list li { font-size:.88rem; color:rgba(255,150,150,.75); }
        .pay-list li::before { content:'→ '; color:#ff2d78; }

        /* Rules */
        .rules-text {
          font-size:.95rem; line-height:1.75;
          color:rgba(180,200,230,.65);
          white-space:pre-wrap;
        }

        /* More HTML */
        .more-html {
          font-size:.95rem; line-height:1.75;
          color:rgba(180,200,230,.65);
        }
        .more-html a { color:#00fff0; }
        .more-html strong { color:#fff; }
        .more-html ul, .more-html ol { padding-left:18px; }
      `}</style>
    </>
  );
}

/* ── Stat Card ── */
function StatCard({ label, value, accent }: { label:string; value:string; accent:"cyan"|"magenta"|"purple" }) {
  const c = {
    cyan:    { border:"rgba(0,255,240,.25)",  bg:"rgba(0,255,240,.05)",    val:"#00fff0",  tick:"#00fff0" },
    magenta: { border:"rgba(255,45,120,.25)", bg:"rgba(255,45,120,.05)",   val:"#ff2d78",  tick:"#ff2d78" },
    purple:  { border:"rgba(123,47,247,.3)",  bg:"rgba(123,47,247,.07)",   val:"#a070ff",  tick:"#a070ff" },
  }[accent];
  return (
    <div style={{
      position:"relative", padding:"14px 16px", borderRadius:2,
      border:`1px solid ${c.border}`, background:c.bg, overflow:"hidden",
    }}>
      <span style={{position:"absolute",top:4,left:4,width:8,height:8,
        borderTop:`1.5px solid ${c.tick}`,borderLeft:`1.5px solid ${c.tick}`}}/>
      <span style={{position:"absolute",bottom:4,right:4,width:8,height:8,
        borderBottom:`1.5px solid ${c.tick}`,borderRight:`1.5px solid ${c.tick}`}}/>
      <p style={{fontFamily:"'Share Tech Mono',monospace",fontSize:".68rem",letterSpacing:".15em",
        color:"rgba(200,220,255,.38)",marginBottom:5}}>{label}</p>
      <p style={{fontFamily:"'Orbitron',sans-serif",fontSize:"1.5rem",fontWeight:700,color:c.val,lineHeight:1}}>{value}</p>
    </div>
  );
}

/* ── State screen styles ── */
function StateStyles() {
  return <style>{`
    .state-screen{position:relative;min-height:100vh;background:#060818;display:flex;align-items:center;justify-content:center}
    .bg-grid{position:fixed;inset:0;background-image:linear-gradient(rgba(0,255,240,.038) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,240,.038) 1px,transparent 1px);background-size:55px 55px;pointer-events:none;z-index:0}
    .bg-glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(140px)}
    .bg-glow.c{width:600px;height:600px;top:-120px;left:-200px;background:#00fff0;opacity:.065}
    .bg-glow.m{width:700px;height:700px;bottom:-200px;right:-200px;background:#ff2d78;opacity:.065}
    .state-inner{position:relative;z-index:1;display:flex;align-items:center;gap:12px;font-family:'Orbitron',sans-serif;font-size:.9rem;letter-spacing:.15em;color:rgba(0,255,240,.75)}
    .state-inner.err{color:#ff2d78}
    .err-icon{font-size:1.4rem}
    .state-txt{}
    .blink{animation:bl 1s step-end infinite}
    @keyframes bl{0%,100%{opacity:1}50%{opacity:0}}
  `}</style>;
}