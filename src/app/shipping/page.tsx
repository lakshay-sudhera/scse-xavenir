"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";

// ── Data ───────────────────────────────────────────────
const SECTIONS = [
  {
    id: "01",
    icon: "🎫",
    title: "Ticket Distribution",
    color: "cyan",
    items: [
      {
        sub: "A",
        label: "Collection at Venue",
        desc: "Tickets may be collected directly at the event venue upon presentation of valid ID and registration confirmation.",
      },
      {
        sub: "B",
        label: "Electronic Tickets",
        desc: "Tickets will be sent electronically to the email address provided during registration within 24 hours of payment confirmation.",
      },
      {
        sub: "C",
        label: "Delivery Options",
        desc: "Choice of delivery method may be offered based on event requirements and organizer discretion.",
      },
    ],
  },
  {
    id: "02",
    icon: "💳",
    title: "Payment for Venue Tickets",
    color: "pink",
    items: [
      {
        sub: "A",
        label: "Advance Payment",
        desc: "Payments can be made in advance via the SCSE Xavenir platform to secure your ticket and avoid last-minute unavailability.",
      },
      {
        sub: "B",
        label: "On-Site Payment",
        desc: "Payment may also be accepted at the venue, subject to availability and organizer policies.",
      },
    ],
  },
  {
    id: "03",
    icon: "🏪",
    title: "Offline Ticketing",
    color: "purple",
    items: [
      {
        sub: "A",
        label: "Retail Partners",
        desc: "Tickets may be available through offline retail partners such as cafés and other designated outlets on the NIT Jamshedpur campus.",
      },
      {
        sub: "B",
        label: "Availability",
        desc: "Offline ticketing options will be offered alongside online ticket availability for your convenience.",
      },
    ],
  },
  {
    id: "04",
    icon: "🎟️",
    title: "Ticket Formats",
    color: "yellow",
    items: [
      {
        sub: "A",
        label: "Electronic Tickets",
        desc: "Organizers will provide electronic tickets via QR code to attendees for seamless entry at all event checkpoints.",
      },
      {
        sub: "B",
        label: "Paper Tickets",
        desc: "Paper tickets may also be offered depending on attendee preference and specific event requirements.",
      },
      {
        sub: "C",
        label: "Dual Format Availability",
        desc: "Both formats may be made available to cater to diverse participant needs and accessibility requirements.",
      },
    ],
  },
  {
    id: "05",
    icon: "✅",
    title: "Agreement to Policy",
    color: "green",
    items: [
      {
        sub: "A",
        label: "Acceptance",
        desc: "By purchasing a ticket, you acknowledge and agree to abide by these shipping and delivery policies as set forth by the SCSE Xavenir organizers.",
      },
    ],
  },
  {
    id: "06",
    icon: "📬",
    title: "Contact Us",
    color: "cyan",
    items: [
      {
        sub: "A",
        label: "Email Support",
        desc: "For questions or concerns regarding this Shipping and Delivery Policy, reach us at scse@nitjsr.ac.in",
      },
    ],
  },
];

const COLOR_MAP: Record<string, { border: string; glow: string; text: string; bg: string; chip: string }> = {
  cyan:   { border: "rgba(0,245,255,0.3)",   glow: "rgba(0,245,255,0.15)",   text: "#00f5ff", bg: "rgba(0,245,255,0.05)",   chip: "rgba(0,245,255,0.1)"   },
  pink:   { border: "rgba(255,0,128,0.3)",   glow: "rgba(255,0,128,0.12)",   text: "#ff0080", bg: "rgba(255,0,128,0.05)",   chip: "rgba(255,0,128,0.1)"   },
  purple: { border: "rgba(191,0,255,0.3)",   glow: "rgba(191,0,255,0.12)",   text: "#bf00ff", bg: "rgba(191,0,255,0.05)",   chip: "rgba(191,0,255,0.1)"   },
  yellow: { border: "rgba(255,230,0,0.3)",   glow: "rgba(255,230,0,0.12)",   text: "#ffe600", bg: "rgba(255,230,0,0.05)",   chip: "rgba(255,230,0,0.1)"   },
  green:  { border: "rgba(0,255,136,0.3)",   glow: "rgba(0,255,136,0.12)",   text: "#00ff88", bg: "rgba(0,255,136,0.05)",   chip: "rgba(0,255,136,0.1)"   },
};

// ── Typing hook ────────────────────────────────────────
function useTyping(text: string, speed = 35, delay = 0) {
  const [out, setOut] = useState("");
  useEffect(() => {
    setOut("");
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setOut(text.slice(0, i));
        if (i >= text.length) clearInterval(iv);
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay]);
  return out;
}

// ── InView hook ────────────────────────────────────────
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVis(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, vis };
}

// ── Policy Section Card ────────────────────────────────
function PolicyCard({
  section,
  idx,
}: {
  section: (typeof SECTIONS)[0];
  idx: number;
}) {
  const [open, setOpen] = useState(true);
  const { ref, vis } = useInView();
  const c = COLOR_MAP[section.color];

  return (
    <div
      ref={ref}
      style={{
        border:       `1px solid ${open ? c.border : "rgba(0,245,255,0.08)"}`,
        background:   "rgba(0,3,20,0.85)",
        position:     "relative",
        overflow:     "hidden",
        opacity:      vis ? 1 : 0,
        transform:    vis ? "translateY(0)" : "translateY(28px)",
        transition:   `opacity 0.6s ease ${idx * 0.08}s, transform 0.6s ease ${idx * 0.08}s, border-color 0.3s`,
        boxShadow:    open ? `0 0 30px ${c.glow}` : "none",
      }}
    >
      {/* top gradient line */}
      <div style={{
        position:   "absolute",
        top: 0, left: 0, right: 0,
        height:     "1px",
        background: `linear-gradient(90deg, ${c.text}, transparent)`,
        opacity:    open ? 1 : 0.3,
        transition: "opacity 0.3s",
      }} />

      {/* ── Header ── */}
      <div
        onClick={() => setOpen(!open)}
        style={{
          display:        "flex",
          alignItems:     "center",
          gap:            "1.2rem",
          padding:        "1.2rem 1.8rem",
          cursor:         "pointer",
          background:     open ? c.bg : "transparent",
          transition:     "background 0.3s",
          borderBottom:   open ? `1px solid rgba(0,245,255,0.06)` : "none",
        }}
      >
        {/* id */}
        <span style={{
          fontFamily:    "'Share Tech Mono', monospace",
          fontSize:      "0.65rem",
          color:         "rgba(0,245,255,0.3)",
          letterSpacing: "2px",
          minWidth:      "28px",
        }}>
          [{section.id}]
        </span>

        {/* icon */}
        <span style={{ fontSize: "1.2rem", filter: `drop-shadow(0 0 6px ${c.text})` }}>
          {section.icon}
        </span>

        {/* title */}
        <h2 style={{
          fontFamily:    "'Orbitron', monospace",
          fontSize:      "0.88rem",
          fontWeight:    700,
          color:         open ? c.text : "#e0e8ff",
          letterSpacing: "2px",
          textTransform: "uppercase",
          flex:          1,
          margin:        0,
          transition:    "color 0.3s",
          textShadow:    open ? `0 0 14px ${c.glow}` : "none",
        }}>
          {section.title}
        </h2>

        {/* item count chip */}
        <span style={{
          fontFamily:    "'Share Tech Mono', monospace",
          fontSize:      "0.58rem",
          letterSpacing: "2px",
          padding:       "3px 10px",
          border:        `1px solid ${c.border}`,
          color:         c.text,
          background:    c.chip,
        }}>
          {section.items.length} CLAUSE{section.items.length > 1 ? "S" : ""}
        </span>

        {/* chevron */}
        <span style={{
          fontFamily:    "'Share Tech Mono', monospace",
          fontSize:      "0.6rem",
          color:         open ? c.text : "rgba(0,245,255,0.25)",
          transition:    "transform 0.3s, color 0.3s",
          transform:     open ? "rotate(180deg)" : "rotate(0deg)",
          display:       "inline-block",
        }}>▼</span>
      </div>

      {/* ── Body ── */}
      <div style={{
        maxHeight:  open ? "1000px" : "0",
        overflow:   "hidden",
        transition: "max-height 0.45s cubic-bezier(0.4,0,0.2,1)",
      }}>
        <div style={{ padding: "1.5rem 1.8rem 2rem" }}>
          {section.items.map((item, i) => (
            <div
              key={i}
              style={{
                display:      "grid",
                gridTemplateColumns: "auto 1fr",
                gap:          "1.2rem",
                padding:      "1.1rem 0",
                borderBottom: i < section.items.length - 1
                  ? "1px solid rgba(0,245,255,0.05)"
                  : "none",
              }}
            >
              {/* sub-label */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.4rem", paddingTop: "2px" }}>
                <span style={{
                  fontFamily:    "'Share Tech Mono', monospace",
                  fontSize:      "0.62rem",
                  color:         c.text,
                  letterSpacing: "1px",
                  minWidth:      "22px",
                  textAlign:     "center",
                }}>
                  {item.sub}
                </span>
                {i < section.items.length - 1 && (
                  <div style={{ width: "1px", flex: 1, background: `linear-gradient(${c.text}, transparent)`, opacity: 0.2 }} />
                )}
              </div>

              {/* content */}
              <div>
                <p style={{
                  fontFamily:    "'Orbitron', monospace",
                  fontSize:      "0.75rem",
                  fontWeight:    700,
                  color:         "#e0e8ff",
                  letterSpacing: "1px",
                  margin:        "0 0 0.5rem",
                }}>
                  {item.label}
                </p>
                <p style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize:   "0.8rem",
                  color:      "rgba(180,200,255,0.65)",
                  lineHeight: "1.85",
                  margin:     0,
                }}>
                  {/* Special handling for contact section */}
                  {section.id === "06" && item.sub === "A" ? (
                    <>
                      For questions or concerns regarding this Shipping and Delivery Policy, reach us at{" "}
                      <a
                        href="mailto:scse@nitjsr.ac.in"
                        style={{ color: "#00f5ff", textDecoration: "none" }}
                      >
                        scse@nitjsr.ac.in
                      </a>
                      {" "}or visit the{" "}
                      <Link href="/contact" style={{ color: "#00f5ff", textDecoration: "none" }}>
                        Contact page ▶
                      </Link>
                    </>
                  ) : (
                    item.desc
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────
export default function ShippingPage() {
  const bootText = useTyping(
    "Initializing policy.module() → Loading shipping_delivery.md... OK",
    28, 300
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        :root {
          --cyan:   #00f5ff;
          --pink:   #ff0080;
          --purple: #bf00ff;
          --yellow: #ffe600;
          --green:  #00ff88;
        }

        .ship-page {
          background:    #000314;
          min-height:    100vh;
          color:         #e0e8ff;
          overflow-x:    hidden;
          position:      relative;
        }
        /* grid bg */
        .ship-page::before {
          content:          '';
          position:         fixed;
          inset:            0;
          background-image: linear-gradient(rgba(0,245,255,0.022) 1px,transparent 1px),
                            linear-gradient(90deg,rgba(0,245,255,0.022) 1px,transparent 1px);
          background-size:  40px 40px;
          pointer-events:   none;
          z-index:          0;
        }
        /* scanlines */
        .ship-page::after {
          content:    '';
          position:   fixed;
          inset:      0;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px);
          pointer-events: none;
          z-index:    0;
        }

        .ship-inner {
          position:   relative;
          z-index:    1;
          max-width:  900px;
          margin:     0 auto;
          padding:    140px 2rem 100px;
        }

        /* boot bar */
        .ship-boot {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.68rem;
          color:          rgba(0,245,255,0.4);
          letter-spacing: 2px;
          display:        flex;
          align-items:    center;
          gap:            0.8rem;
          margin-bottom:  1.5rem;
        }
        .ship-boot-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background:    var(--cyan);
          box-shadow:    0 0 8px var(--cyan);
          animation:     sd-pulse 1.5s ease infinite;
        }
        @keyframes sd-pulse { 0%,100%{opacity:1;} 50%{opacity:0.25;} }

        .ship-boot-line {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.65rem;
          color:          rgba(0,245,255,0.45);
          min-height:     1.1em;
          margin-bottom:  2rem;
        }
        .ship-cursor {
          display:        inline-block;
          width:          7px; height:13px;
          background:     var(--cyan);
          margin-left:    2px;
          animation:      sd-blink 1s step-start infinite;
          vertical-align: middle;
        }
        @keyframes sd-blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

        /* hero */
        .ship-hero-label {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.68rem;
          letter-spacing: 4px;
          color:          var(--pink);
          display:        block;
          margin-bottom:  0.7rem;
        }
        .ship-hero-title {
          font-family:    'Orbitron', monospace;
          font-size:      clamp(1.8rem,4vw,3rem);
          font-weight:    900;
          color:          #fff;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin:         0 0 0.8rem;
          line-height:    1.1;
        }
        .ship-hero-title span { color: var(--cyan); text-shadow: 0 0 24px rgba(0,245,255,0.5); }
        .ship-hero-sub {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.78rem;
          color:          rgba(180,200,255,0.45);
          letter-spacing: 2px;
          margin-bottom:  2rem;
        }
        .ship-tags { display:flex; gap:0.8rem; flex-wrap:wrap; margin-bottom:3rem; }
        .ship-tag {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.58rem;
          letter-spacing: 3px;
          padding:        4px 12px;
          border:         1px solid rgba(0,245,255,0.2);
          color:          var(--cyan);
          background:     rgba(0,245,255,0.04);
        }
        .ship-tag-pink   { border-color:rgba(255,0,128,0.25);  color:var(--pink);   background:rgba(255,0,128,0.04);  }
        .ship-tag-purple { border-color:rgba(191,0,255,0.25);  color:var(--purple); background:rgba(191,0,255,0.04);  }

        /* divider */
        .ship-divider {
          height:         1px;
          background:     linear-gradient(90deg, var(--cyan), var(--pink), transparent);
          margin:         0 0 3rem;
          opacity:        0.25;
        }

        /* policy stack */
        .ship-stack { display:flex; flex-direction:column; gap:1px; }

        /* last updated bar */
        .ship-footer-bar {
          margin-top:     3rem;
          border:         1px solid rgba(0,245,255,0.1);
          background:     rgba(0,3,20,0.8);
          padding:        1.2rem 1.8rem;
          display:        flex;
          align-items:    center;
          justify-content:space-between;
          flex-wrap:      wrap;
          gap:            1rem;
          position:       relative;
          overflow:       hidden;
        }
        .ship-footer-bar::before {
          content:    '';
          position:   absolute;
          top:0; left:0; right:0;
          height:     1px;
          background: linear-gradient(90deg,var(--cyan),var(--pink),transparent);
        }
        .ship-footer-text {
          font-family:    'Share Tech Mono', monospace;
          font-size:      0.65rem;
          color:          rgba(180,200,255,0.4);
          letter-spacing: 1px;
        }
        .ship-footer-text span { color:var(--cyan); }

        .ship-back-btn {
          display:        inline-flex;
          align-items:    center;
          gap:            8px;
          font-family:    'Orbitron', monospace;
          font-size:      0.6rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration:none;
          padding:        9px 20px;
          border:         1px solid var(--cyan);
          color:          #000;
          background:     var(--cyan);
          clip-path:      polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px));
          transition:     all 0.25s;
        }
        .ship-back-btn:hover {
          background:  var(--pink);
          border-color:var(--pink);
          box-shadow:  0 0 18px var(--pink);
        }

        /* quick-nav sidebar */
        .ship-quicknav {
          position:   fixed;
          right:      2rem;
          top:        50%;
          transform:  translateY(-50%);
          z-index:    10;
          display:    flex;
          flex-direction:column;
          gap:        0.6rem;
        }
        .ship-qn-dot {
          width:        8px; height:8px;
          border-radius:50%;
          background:   rgba(0,245,255,0.2);
          border:       1px solid rgba(0,245,255,0.25);
          cursor:       pointer;
          transition:   all 0.2s;
          position:     relative;
        }
        .ship-qn-dot:hover {
          background:  var(--cyan);
          box-shadow:  0 0 8px var(--cyan);
        }
        .ship-qn-dot[data-active="true"] {
          background:  var(--cyan);
          box-shadow:  0 0 10px var(--cyan);
        }
        .ship-qn-tooltip {
          position:     absolute;
          right:        18px;
          top:          50%;
          transform:    translateY(-50%);
          white-space:  nowrap;
          font-family:  'Share Tech Mono', monospace;
          font-size:    0.58rem;
          letter-spacing:2px;
          color:        var(--cyan);
          background:   rgba(0,3,20,0.9);
          border:       1px solid rgba(0,245,255,0.2);
          padding:      3px 10px;
          opacity:      0;
          pointer-events:none;
          transition:   opacity 0.2s;
        }
        .ship-qn-dot:hover .ship-qn-tooltip { opacity:1; }

        @media(max-width:900px) {
          .ship-inner { padding:120px 1.5rem 80px; }
          .ship-quicknav { display:none; }
        }
        @media(max-width:600px) {
          .ship-inner { padding:110px 1rem 60px; }
        }
      `}</style>

      <div className="ship-page">

        {/* ── Quick-nav dots ── */}
        <nav className="ship-quicknav" aria-label="Section navigation">
          {SECTIONS.map((s, i) => (
            <div
              key={s.id}
              className="ship-qn-dot"
              onClick={() =>
                document
                  .getElementById(`section-${s.id}`)
                  ?.scrollIntoView({ behavior: "smooth", block: "center" })
              }
              title={s.title}
            >
              <span className="ship-qn-tooltip">{s.title}</span>
            </div>
          ))}
        </nav>

        <div className="ship-inner">

          {/* ── Boot bar ── */}
          <div className="ship-boot">
            <div className="ship-boot-dot" />
            <span>SCSE.SYS // POLICY MODULE // NIT JAMSHEDPUR</span>
          </div>
          <div className="ship-boot-line">
            {bootText}
            <span className="ship-cursor" />
          </div>

          {/* ── Hero ── */}
          <span className="ship-hero-label">// policy.shipping_delivery()</span>
          <h1 className="ship-hero-title">
            Shipping &amp; <span>Delivery</span> Policy
          </h1>
          <p className="ship-hero-sub">
            // XAVENIR '26 · NIT JAMSHEDPUR · CSE DEPARTMENT
          </p>
          <div className="ship-tags">
            <span className="ship-tag">// TICKET POLICY</span>
            <span className="ship-tag-pink">// PAYMENT TERMS</span>
            <span className="ship-tag-purple">// EFFECTIVE 2025</span>
          </div>

          <div className="ship-divider" />

          {/* ── Policy sections ── */}
          <div className="ship-stack">
            {SECTIONS.map((s, i) => (
              <div id={`section-${s.id}`} key={s.id}>
                <PolicyCard section={s} idx={i} />
              </div>
            ))}
          </div>

          {/* ── Footer bar ── */}
          <div className="ship-footer-bar">
            <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
              <span className="ship-footer-text">
                <span>// LAST UPDATED</span> · March 2025
              </span>
              <span className="ship-footer-text">
                <span>// ISSUED BY</span> · SCSE Web Team · NIT Jamshedpur
              </span>
              <span className="ship-footer-text">
                <span>// CONTACT</span> · scse@nitjsr.ac.in
              </span>
            </div>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <Link href="/refund" className="ship-back-btn">
                ◆ Refund Policy
              </Link>
              <Link href="/" className="ship-back-btn" style={{ background: "transparent", color: "var(--cyan)", clipPath: "polygon(0 0,calc(100% - 7px) 0,100% 7px,100% 100%,7px 100%,0 calc(100% - 7px))" }}>
                ← Back to Home
              </Link>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}