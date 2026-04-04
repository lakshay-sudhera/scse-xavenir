"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Event {
  _id: string;
  name: string;
  description: string;
  logo: string;
  prizepool: number;
  regFees: number;
  more: string;
  rules: string;
  minPart: number;
  maxPart: number;
}

const toPath = (name: string) => encodeURIComponent(name);
const fakeHex = () =>
  "0x" + Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase().padStart(8, "0");

/* ── Event Card ── */
function EventCard({ event, index }: { event: Event; index: number }) {
  const router = useRouter();
  const [hovered, setHovered] = useState(false);
  const [hexAddr] = useState(fakeHex);
  const [decryptLabel, setDecryptLabel] = useState("DECRYPT");

  const handleHover = () => {
    setHovered(true);
    const target = "DECRYPTED";
    const chars = "ABCDEF0123456789#@$%";
    let i = 0;
    const iv = setInterval(() => {
      setDecryptLabel(target.split("").map((c, idx) =>
        idx < i ? c : chars[Math.floor(Math.random() * chars.length)]
      ).join(""));
      if (++i > target.length) { clearInterval(iv); setDecryptLabel("DECRYPTED"); }
    }, 38);
  };
  const handleLeave = () => { setHovered(false); setDecryptLabel("DECRYPT"); };
  const handleClick = () => router.push(`/eventDetails/${toPath(event.name)}`);

  return (
    <div
      className={`ev-card${hovered ? " hov" : ""}`}
      style={{ animationDelay: `${index * 0.09}s` }}
      onMouseEnter={handleHover} onMouseLeave={handleLeave}
      onClick={handleClick} role="button" tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && handleClick()}
    >
      <div className="c-top">
        <span className="c-buf">BUF.STREAM</span>
        <span className="c-bars"><b/><b/><b/></span>
        <span className="c-hex">{hexAddr}</span>
      </div>
      <div className="c-img-wrap">
        {event.logo
          ? <img src={event.logo} alt={event.name} className="c-img" />
          : <div className="c-img-ph"><span>⬡</span></div>
        }
        <div className="c-scanlines" />
        <div className={`c-decrypt-ov${hovered ? " show" : ""}`}>
          <span className="c-eye">◉</span>
          <span className="c-nd">NODE OPEN</span>
        </div>
        <span className="hud tl"/><span className="hud tr"/>
        <span className="hud bl"/><span className="hud br"/>
        <div className="c-date-badge">APR 26</div>
      </div>
      <div className="c-status">
        <span className="c-decrypt-lbl">{decryptLabel}</span>
        <div className="c-prog"><div className={`c-prog-fill${hovered ? " full" : ""}`}/></div>
        <span className="c-clr">CLR // OK</span>
      </div>
      <div className="c-info">
        <h3 className="c-name">{event.name}</h3>
        <span className="c-apr">APR, 2026</span>
      </div>

      <style>{`
        .ev-card{display:flex;flex-direction:column;cursor:pointer;animation:cIn .55s ease both;transition:transform .25s}
        .ev-card:hover{transform:translateY(-5px)}
        @keyframes cIn{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}
        .c-top{display:flex;align-items:center;gap:8px;padding:5px 10px;background:rgba(0,8,26,.9);border:1px solid rgba(0,255,240,.2);border-bottom:none;font-family:'Share Tech Mono',monospace;font-size:.6rem}
        .c-buf{color:#00fff0;letter-spacing:.1em}
        .c-bars{display:flex;gap:3px;flex:1}
        .c-bars b{display:block;width:9px;height:8px;background:rgba(0,255,240,.4);clip-path:polygon(0 0,100% 0,100% 55%,0 55%)}
        .c-hex{color:#ff2d78;font-size:.58rem}
        .c-img-wrap{position:relative;overflow:hidden;aspect-ratio:16/10;border:1px solid rgba(0,255,240,.2);border-top:none;border-bottom:none;background:#050012}
        .c-img{width:100%;height:100%;object-fit:cover;display:block;filter:brightness(.85) saturate(1.1);transition:transform .45s,filter .3s}
        .ev-card:hover .c-img{transform:scale(1.07);filter:brightness(1) saturate(1.3)}
        .c-img-ph{width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:3.5rem;color:rgba(0,255,240,.15)}
        .c-scanlines{position:absolute;inset:0;background:repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,255,240,.018) 2px,rgba(0,255,240,.018) 4px);pointer-events:none}
        .c-decrypt-ov{position:absolute;inset:0;background:rgba(0,5,22,.55);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;opacity:0;transition:opacity .3s;pointer-events:none}
        .c-decrypt-ov.show{opacity:1}
        .c-eye{font-size:2rem;color:#00fff0;animation:eyePulse 1s ease infinite}
        @keyframes eyePulse{0%,100%{text-shadow:0 0 10px #00fff0}50%{text-shadow:none}}
        .c-nd{font-family:'Orbitron',sans-serif;font-size:.65rem;letter-spacing:.25em;color:#fff}
        .hud{position:absolute;width:11px;height:11px;border-color:#00fff0;border-style:solid}
        .hud.tl{top:6px;left:6px;border-width:2px 0 0 2px}
        .hud.tr{top:6px;right:6px;border-width:2px 2px 0 0}
        .hud.bl{bottom:22px;left:6px;border-width:0 0 2px 2px}
        .hud.br{bottom:22px;right:6px;border-width:0 2px 2px 0}
        .c-date-badge{position:absolute;top:10px;right:10px;font-family:'Share Tech Mono',monospace;font-size:.58rem;letter-spacing:.12em;color:#fff;background:linear-gradient(135deg,#7b2ff7,#ff2d78);padding:3px 9px;border-radius:1px;z-index:2}
        .c-status{display:flex;align-items:center;gap:8px;padding:5px 10px;background:rgba(0,8,26,.9);border:1px solid rgba(0,255,240,.2);border-top:none;border-bottom:none;font-family:'Share Tech Mono',monospace;font-size:.6rem}
        .c-decrypt-lbl{color:#00fff0;min-width:72px;letter-spacing:.08em}
        .c-prog{flex:1;height:3px;background:rgba(0,255,240,.1);border-radius:2px;overflow:hidden}
        .c-prog-fill{height:100%;width:0;background:linear-gradient(90deg,#00fff0,#ff2d78);transition:width .55s ease}
        .c-prog-fill.full{width:100%}
        .c-clr{color:#ff2d78;font-size:.57rem}
        .c-info{padding:12px 14px 14px;border:1px solid rgba(0,255,240,.15);border-top:none;background:rgba(4,6,20,.96);display:flex;flex-direction:column;gap:5px}
        .c-name{font-family:'Orbitron',sans-serif;font-size:1.05rem;font-weight:700;color:#fff;letter-spacing:.02em;line-height:1.2}
        .c-apr{font-family:'Share Tech Mono',monospace;font-size:.72rem;color:#ff2d78;letter-spacing:.12em}
      `}</style>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div style={{display:"flex",flexDirection:"column",opacity:.4,animation:"skP 1.5s ease infinite"}}>
      <div style={{height:28,background:"rgba(0,255,240,.07)",border:"1px solid rgba(0,255,240,.12)",borderBottom:"none"}}/>
      <div style={{aspectRatio:"16/10",background:"rgba(0,255,240,.04)",border:"1px solid rgba(0,255,240,.1)",borderTop:"none",borderBottom:"none"}}/>
      <div style={{height:24,background:"rgba(0,255,240,.07)",border:"1px solid rgba(0,255,240,.12)",borderTop:"none",borderBottom:"none"}}/>
      <div style={{height:70,background:"rgba(2,0,14,.9)",border:"1px solid rgba(0,255,240,.12)",borderTop:"none"}}/>
      <style>{`@keyframes skP{0%,100%{opacity:.25}50%{opacity:.5}}`}</style>
    </div>
  );
}

/* ── Ticker items ── */
const TICKER_ITEMS = [
  "XAVENIR 2026", "NIT JAMSHEDPUR", "SCSE OPS ACTIVE",
  "16 EVENTS LIVE", "APR 26", "CYBER WORLD", "CODE // CREATE // CONQUER",
  "REGISTER NOW", "PRIZE POOL ₹50K+", "500+ PARTICIPANTS",
];

/* ── Page ── */
export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/events")
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d => { setEvents(Array.isArray(d) ? d : d.events ?? []); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  // Ticker pulse
  useEffect(() => {
    const iv = setInterval(() => setTick(t => t + 1), 60);
    return () => clearInterval(iv);
  }, []);

  const count = events.length;
  const filtered = search.trim()
    ? events.filter(e => e.name.toLowerCase().includes(search.toLowerCase()))
    : events;

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&display=swap" rel="stylesheet"/>

      <div className="root">
        {/* ── Backgrounds ── */}
        <div className="bg-city"/>
        <div className="bg-overlay"/>
        <div className="bg-grid"/>
        <div className="bg-glow c"/>
        <div className="bg-glow m"/>

        {/* ══════════════════════════════════════
            HERO — completely redesigned
        ══════════════════════════════════════ */}
        <section className="hero">

          {/* ── Top strip: eyebrow + live indicator ── */}
          <div className="hero-topstrip">
            <div className="hts-left">
              <span className="hts-dash">—</span>
              <span className="hts-org">NIT JAMSHEDPUR</span>
              <span className="hts-sep">//</span>
              <span className="hts-dept">CSE</span>
              <span className="hts-sep">//</span>
              <span className="hts-dept">XAVENIR</span>
            </div>
            <div className="hts-right">
              <span className="live-dot"/>
              <span className="live-txt">SYSTEM ONLINE</span>
              <span className="hts-sep">//</span>
              <span className="hts-dept">APR 26, 2026</span>
            </div>
          </div>

          {/* ── Main title block ── */}
          <div className="hero-title-block">
            <div className="htb-left">
              <div className="htb-corner-tl"/>
              <h1 className="h-title">
                <span className="ht-c">EVENTS</span>
                <br/>
                {/* <span className="ht-m">ARCHIVE</span> */}
              </h1>
              <p className="h-tagline">// events.archive()</p>
            </div>

            {/* ── Right: OPS console + badge ── */}
            <div className="htb-right">
              {/* OPS Console */}
              <div className="ops-panel">
                <div className="ops-panel-bar">
                  <span className="ops-buf">OPS.CONSOLE</span>
                  <span className="ops-bars"><b/><b/><b/></span>
                </div>
                <div className="ops-body">
                  <p className="ops-l"><span className="ok">HOVER</span> // DECRYPT</p>
                  <p className="ops-l"><span className="ok">CLICK</span> // OPEN NODE</p>
                  <p className="ops-l"><span className="ok">ESC</span> // CLOSE</p>
                  <div className="ops-div"/>
                  <div className="ops-stats">
                    <div className="ops-stat">
                      <span className="sn c">{count || "—"}</span>
                      <span className="sl">ACTIVE NODES</span>
                    </div>
                    <div className="ops-stat">
                      <span className="sn m">{count || "—"}</span>
                      <span className="sl">EVENT FRAMES</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* SCSE badge */}
              <div className="scse-b">
                <div className="scse-b-topbar">
                  <span className="sb-buf">SCSE.NODE</span>
                  <span className="sb-status">EVENTS // READY</span>
                </div>
                <div className="sb-main-row">
                  <span className="sb-s">SCSE</span>
                  <span className="sb-a">ARCHIVE</span>
                </div>
                <div className="sb-sub-row">
                  <span className="sb-sub">CYBER WORLD</span>
                  <span className="sb-divider">|</span>
                  <span className="sb-sub">SELECTION</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Description + data bars row ── */}
          <div className="hero-info-row">
            <div className="hir-left">
              <p className="h-sub">
                Encrypted event frames from <span className="h-sub-hl">XAVENIR</span> &amp; <span className="h-sub-hl">SCSE</span> ops.
                Hover to decrypt details. Click to open a node.
              </p>
            </div>
            <div className="hir-right">
              <div className="data-bar">
                <span className="db-key">PARTICIPANTS</span>
                <div className="db-track"><div className="db-fill" style={{width:"82%"}}/></div>
                <span className="db-val">500+</span>
              </div>
              <div className="data-bar">
                <span className="db-key">PRIZE POOL</span>
                <div className="db-track"><div className="db-fill magenta" style={{width:"68%"}}/></div>
                <span className="db-val db-val-m">₹50K+</span>
              </div>
              <div className="data-bar">
                <span className="db-key">EVENTS</span>
                <div className="db-track"><div className="db-fill" style={{width:`${Math.min((count/16)*100,100)}%`}}/></div>
                <span className="db-val">{count || 16}</span>
              </div>
            </div>
          </div>

          {/* ── Scrolling ticker ── */}
          <div className="hero-ticker">
            <span className="ticker-prefix">// SYS.FEED</span>
            <div className="ticker-track">
              <div className="ticker-inner">
                {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                  <span key={i} className="ticker-item">
                    <span className="ticker-dot">◆</span> {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

        </section>

        {/* ── Grid section ── */}
        <section className="gsec">
          <div className="gh">
            <div className="gh-corner"/>
            <span className="ghl"/>
            <span className="gh-lbl">// ACTIVE.EVENT.NODES</span>
            <span className="ghl r"/>
            <div className="gh-corner r"/>
          </div>

          {/* Search bar */}
          <div className="ev-search-wrap">
            <span className="ev-search-icon">⌕</span>
            <input
              className="ev-search-input"
              type="text"
              placeholder="SEARCH EVENTS..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button className="ev-search-clear" onClick={() => setSearch("")}>✕</button>
            )}
          </div>

          <div className="egrid">
            {loading
              ? Array.from({length:6}).map((_,i)=><SkeletonCard key={i}/>)
              : error
              ? <div className="serr">⚠ SYSTEM ERROR: {error}</div>
              : filtered.length === 0
              ? <div className="serr">// NO MATCHES FOUND</div>
              : filtered.map((ev,i)=><EventCard key={ev._id} event={ev} index={i}/>)
            }
          </div>
        </section>
      </div>

      <style>{`
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}

        .root{
          position:relative;min-height:100vh;
          background:#060818;
          font-family:'Share Tech Mono',monospace;
          overflow-x:hidden;
        }

        /* ── Backgrounds ── */
        .bg-city{
          position:fixed;inset:0;
          background:url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=60') center/cover;
          opacity:.08;pointer-events:none;z-index:0;
        }
        .bg-overlay{
          position:fixed;inset:0;
          background:linear-gradient(180deg,rgba(6,8,24,.8) 0%,rgba(6,8,24,.5) 40%,rgba(6,8,24,.92) 100%);
          pointer-events:none;z-index:0;
        }
        .bg-grid{
          position:fixed;inset:0;
          background-image:
            linear-gradient(rgba(0,255,240,.038) 1px,transparent 1px),
            linear-gradient(90deg,rgba(0,255,240,.038) 1px,transparent 1px);
          background-size:55px 55px;
          pointer-events:none;z-index:0;
        }
        .bg-glow{position:fixed;border-radius:50%;pointer-events:none;z-index:0;filter:blur(140px)}
        .bg-glow.c{width:700px;height:700px;top:-150px;left:-250px;background:#00fff0;opacity:.07}
        .bg-glow.m{width:800px;height:800px;bottom:-250px;right:-250px;background:#ff2d78;opacity:.07}

        /* ════════════════════════════════
           HERO
        ════════════════════════════════ */
        /* ════════════════════════════════
           HERO — proper spacing, no navbar overlap
           Navbar assumed ~64px height, we clear it with padding-top
        ════════════════════════════════ */
        .hero{
          position:relative;z-index:1;
          padding: 28px 5vw 0;          /* 28px breathing room below navbar */
          display:flex;flex-direction:column;gap:0;
        }

        /* ── Top strip ── */
        .hero-topstrip{
          display:flex;align-items:center;justify-content:space-between;
          padding:7px 20px;
          background:rgba(0,255,240,.035);
          border:1px solid rgba(0,255,240,.12);
          border-bottom:none;
        }
        .hts-left,.hts-right{display:flex;align-items:center;gap:10px;font-size:.72rem;letter-spacing:.14em}
        .hts-dash{color:#ff2d78;font-size:1rem;margin-right:2px}
        .hts-org{color:rgba(255,255,255,.85);font-weight:600}
        .hts-dept{color:rgba(0,255,240,.7)}
        .hts-sep{color:rgba(0,255,240,.28)}
        .live-dot{
          width:7px;height:7px;border-radius:50%;flex-shrink:0;
          background:#00ff80;box-shadow:0 0 8px #00ff80;
          animation:livePulse 1.5s ease infinite;
        }
        @keyframes livePulse{0%,100%{opacity:1;box-shadow:0 0 8px #00ff80}50%{opacity:.35;box-shadow:none}}
        .live-txt{color:#00ff80;font-size:.68rem;letter-spacing:.1em}

        /* ── Title block: title left, panels right, vertically centered ── */
        .hero-title-block{
          display:flex;
          align-items:center;           /* panels sit at vertical center of title */
          justify-content:space-between;
          gap:32px;
          border:1px solid rgba(0,255,240,.12);
          border-bottom:none;
          padding:32px 28px 32px 28px;
          position:relative;
          background:rgba(0,4,18,.25);
          min-height:0;                 /* don't stretch unnecessarily */
        }
        .hero-title-block::before{
          content:'';position:absolute;left:0;top:0;bottom:0;width:3px;
          background:linear-gradient(180deg,#00fff0 0%,#ff2d78 60%,transparent 100%);
        }

        .htb-left{
          position:relative;
          flex:1;
          min-width:0;                  /* allow shrink */
        }
        .htb-corner-tl{
          position:absolute;top:-4px;left:-4px;
          width:14px;height:14px;
          border-top:2px solid #00fff0;border-left:2px solid #00fff0;
        }
        .h-title{
          font-family:'Orbitron',sans-serif;
          font-size:clamp(3rem,6.5vw,6.5rem);   /* slightly smaller so it fits comfortably */
          font-weight:900;line-height:.92;
          margin-bottom:14px;
        }
        .ht-c{color:#00fff0;text-shadow:0 0 28px rgba(0,255,240,.5),0 0 70px rgba(0,255,240,.15)}
        .ht-m{color:#ff2d78;text-shadow:0 0 28px rgba(255,45,120,.5),0 0 70px rgba(255,45,120,.15)}
        .h-tagline{color:rgba(0,255,240,.32);font-size:.8rem;letter-spacing:.15em}

        /* ── Right panels: side-by-side, not stacked ── */
        .htb-right{
          display:flex;
          flex-direction:row;           /* OPS + SCSE side by side */
          gap:16px;
          flex-shrink:0;
          align-items:stretch;
        }

        /* OPS panel */
        .ops-panel{
          border:1px solid rgba(0,255,240,.2);
          background:rgba(0,8,26,.88);
          overflow:hidden;
          width:220px;
          flex-shrink:0;
        }
        .ops-panel-bar{
          display:flex;align-items:center;gap:8px;
          padding:5px 12px;
          background:rgba(0,255,240,.06);
          border-bottom:1px solid rgba(0,255,240,.12);
          font-size:.6rem;
        }
        .ops-buf{color:#00fff0;letter-spacing:.1em;flex:1}
        .ops-bars{display:flex;gap:3px}
        .ops-bars b{display:block;width:8px;height:7px;background:rgba(0,255,240,.4);clip-path:polygon(0 0,100% 0,100% 55%,0 55%)}
        .ops-body{padding:12px 14px}
        .ops-l{font-size:.78rem;color:rgba(200,220,255,.6);margin-bottom:5px;letter-spacing:.04em}
        .ok{color:#00fff0;font-weight:600}
        .ops-div{height:1px;background:rgba(0,255,240,.12);margin:10px 0}
        .ops-stats{display:flex;gap:18px}
        .ops-stat{display:flex;flex-direction:column;gap:2px}
        .sn{font-family:'Orbitron',sans-serif;font-size:1.9rem;font-weight:700;display:block;line-height:1}
        .sn.c{color:#00fff0;text-shadow:0 0 12px rgba(0,255,240,.5)}
        .sn.m{color:#ff2d78;text-shadow:0 0 12px rgba(255,45,120,.5)}
        .sl{font-size:.56rem;letter-spacing:.13em;color:rgba(200,220,255,.32);display:block;margin-top:3px}

        /* SCSE badge */
        .scse-b{
          border:2px solid #00fff0;
          box-shadow:0 0 20px rgba(0,255,240,.12),inset 0 0 20px rgba(0,255,240,.03);
          overflow:hidden;
          width:210px;
          flex-shrink:0;
          display:flex;flex-direction:column;
        }
        .scse-b-topbar{
          display:flex;align-items:center;justify-content:space-between;
          padding:5px 12px;
          background:rgba(0,255,240,.06);
          border-bottom:1px solid rgba(0,255,240,.14);
          font-size:.56rem;
        }
        .sb-buf{color:#00fff0;letter-spacing:.1em}
        .sb-status{color:rgba(200,220,255,.38);letter-spacing:.08em}
        .sb-main-row{
          display:flex;justify-content:space-between;align-items:baseline;
          padding:10px 14px 4px;flex:1;
        }
        .sb-s{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:#00fff0;text-shadow:0 0 18px rgba(0,255,240,.55)}
        .sb-a{font-family:'Orbitron',sans-serif;font-size:1.8rem;font-weight:900;color:#ff2d78;text-shadow:0 0 18px rgba(255,45,120,.55)}
        .sb-sub-row{
          display:flex;align-items:center;gap:8px;
          padding:2px 14px 10px;
        }
        .sb-sub{font-size:.58rem;letter-spacing:.12em;color:rgba(200,220,255,.32)}
        .sb-divider{color:rgba(0,255,240,.22);font-size:.65rem}

        /* ── Info row ── */
        .hero-info-row{
          display:flex;align-items:center;justify-content:space-between;gap:40px;
          border:1px solid rgba(0,255,240,.12);
          border-bottom:none;
          padding:18px 28px;
          background:rgba(0,2,12,.35);
        }
        .hir-left{flex:1;max-width:500px}
        .h-sub{font-size:.86rem;color:rgba(200,220,255,.5);line-height:1.75}
        .h-sub-hl{color:#00fff0;font-weight:600}
        .hir-right{display:flex;flex-direction:column;gap:9px;flex-shrink:0;min-width:270px}
        .data-bar{display:flex;align-items:center;gap:10px;font-size:.64rem;letter-spacing:.1em}
        .db-key{color:rgba(0,255,240,.42);min-width:96px}
        .db-track{flex:1;height:3px;background:rgba(0,255,240,.08);border-radius:2px;overflow:hidden}
        .db-fill{height:100%;background:linear-gradient(90deg,#00fff0,rgba(0,255,240,.35));border-radius:2px}
        .db-fill.magenta{background:linear-gradient(90deg,#ff2d78,rgba(255,45,120,.35))}
        .db-val{color:#00fff0;font-family:'Orbitron',sans-serif;font-size:.72rem;font-weight:700;min-width:44px;text-align:right}
        .db-val-m{color:#ff2d78}

        /* ── Ticker ── */
        .hero-ticker{
          display:flex;align-items:center;
          border:1px solid rgba(0,255,240,.12);
          overflow:hidden;
          background:rgba(0,4,16,.55);
        }
        .ticker-prefix{
          flex-shrink:0;padding:8px 16px;
          background:rgba(0,255,240,.08);
          border-right:1px solid rgba(0,255,240,.14);
          color:#00fff0;font-size:.63rem;letter-spacing:.14em;white-space:nowrap;
        }
        .ticker-track{flex:1;overflow:hidden;padding:0 8px}
        .ticker-inner{
          display:flex;animation:tickerScroll 32s linear infinite;white-space:nowrap;
        }
        @keyframes tickerScroll{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        .ticker-item{
          display:inline-flex;align-items:center;gap:8px;
          padding:8px 22px;font-size:.63rem;letter-spacing:.11em;
          color:rgba(200,220,255,.48);white-space:nowrap;
        }
        .ticker-dot{font-size:.42rem}
        .ticker-item:nth-child(odd) .ticker-dot{color:#00fff0}
        .ticker-item:nth-child(even) .ticker-dot{color:#ff2d78}

        /* ── Grid section ── */
        .gsec{position:relative;z-index:1;padding:40px 5vw 80px}
        .gh{display:flex;align-items:center;gap:10px;margin-bottom:28px}
        .gh-corner{width:10px;height:10px;border-top:2px solid #00fff0;border-left:2px solid #00fff0;flex-shrink:0}
        .gh-corner.r{border-top:2px solid #00fff0;border-right:2px solid #00fff0;border-left:none}
        .ghl{flex:1;height:1px;background:linear-gradient(90deg,transparent,rgba(0,255,240,.28))}
        .ghl.r{background:linear-gradient(90deg,rgba(0,255,240,.28),transparent)}
        .gh-lbl{font-family:'Orbitron',sans-serif;font-size:.7rem;letter-spacing:.2em;color:rgba(0,255,240,.5);white-space:nowrap;padding:0 4px}

        /* Strict 3-column */
        .egrid{display:grid;grid-template-columns:repeat(3,1fr);gap:26px}
        @media(max-width:1100px){.egrid{grid-template-columns:repeat(2,1fr)}}
        @media(max-width:580px){.egrid{grid-template-columns:1fr}}

        /* Search bar */
        .ev-search-wrap{display:flex;align-items:center;gap:10px;margin-bottom:24px;background:rgba(0,8,26,.85);border:1px solid rgba(0,255,240,.2);padding:8px 14px;position:relative}
        .ev-search-wrap:focus-within{border-color:rgba(0,255,240,.55);box-shadow:0 0 14px rgba(0,255,240,.1)}
        .ev-search-icon{color:rgba(0,255,240,.5);font-size:1.1rem;flex-shrink:0}
        .ev-search-input{flex:1;background:transparent;border:none;outline:none;font-family:'Share Tech Mono',monospace;font-size:.78rem;letter-spacing:.1em;color:#e0e8ff;caret-color:#00fff0}
        .ev-search-input::placeholder{color:rgba(0,255,240,.25);letter-spacing:.15em}
        .ev-search-clear{background:transparent;border:none;color:rgba(255,45,120,.6);cursor:pointer;font-size:.8rem;padding:2px 6px;transition:color .2s}
        .ev-search-clear:hover{color:#ff2d78}
        @media(max-width:960px){
          .hero-title-block{flex-direction:column;align-items:flex-start;padding:24px 20px}
          .htb-right{flex-direction:column;width:100%}
          .ops-panel,.scse-b{width:100%}
          .hero-info-row{flex-direction:column;align-items:flex-start;padding:16px 20px}
          .hts-right{display:none}
        }

        .serr{grid-column:1/-1;font-family:'Orbitron',sans-serif;font-size:.82rem;letter-spacing:.12em;color:#ff2d78;text-align:center;padding:60px 0}
      `}</style>
    </>
  );
}