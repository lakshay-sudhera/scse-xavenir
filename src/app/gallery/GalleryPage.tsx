"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight, FaExpand, FaTimes } from "react-icons/fa";
import "./gallery.css";

type EventItem = {
  id: string;
  src: string;
  title: string;
  date: string;
  desc: string;
};

const EVENTS: EventItem[] = [
  {
    id: "EV-INAUGURATION-2025",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361397/WhatsApp_Image_2026-03-24_at_7.18.09_PM_2_m8hmaq.jpg",
    title: "Xavenir 2025 Inauguration",
    date: "FEB, 2025",
    desc: "The grand inauguration of Xavenir marks the the beginning of innovation, energy and cutting-edge brilliance!",
  },
  {
    id: "EV-SCSE-PL2-2025",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361258/cricket2024_xckxnt.webp",
    title: "SCSE Premier League - Season 2",
    date: "FEB, 2025",
    desc: "Ultimate cricket showdown as teams compete for glory in the second season of the SCSE Premier League!",
  },
  {
    id: "EV-LSA-2024",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361434/WhatsApp_Image_2026-03-24_at_7.18.10_PM_1_avh04v.jpg",
    title: "Lights, Stage, Action",
    date: "2024",
    desc: "An electrifying eveining where talent took the spotlight.",
  },
  {
    id: "EV-DODGEBALL-2024",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361271/Dodgeball_y5jbvu.jpg",
    title: "Dodgeball",
    date: "2024",
    desc: "Fast-paced and action-packed dodgeball tournament where agility and teamwork lead to victory.",
  },
  {
    id: "EV-SCSE-PL1-2024",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361178/Cricket2023.jpg_lrjj8s.jpg",
    title: "SCSE Premier League - Season 1",
    date: "2024",
    desc: "The inaugural season of our highly anticipated cricket tournament, bringing intense competition and unforgettable moments.",
  },
  {
    id: "EV-KODI-YATAVA-2024",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361293/kodi_yatava.jpg_senx53.jpg",
    title: "Kodi Yatava",
    date: "2024",
    desc: "Beyond coding.",
  },
  {
    id: "EV-XAVENIR-2025-01",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361484/WhatsApp_Image_2026-03-24_at_7.18.11_PM_2_rhwkgd.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-02",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361419/WhatsApp_Image_2026-03-24_at_7.18.09_PM_e28coy.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-03",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361448/WhatsApp_Image_2026-03-24_at_7.18.10_PM_2_i3644x.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-04",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361500/WhatsApp_Image_2026-03-24_at_7.18.11_PM_xvjd1g.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-05",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361459/WhatsApp_Image_2026-03-24_at_7.18.10_PM_vpqebr.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-06",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361324/WhatsApp_Image_2026-03-24_at_7.18.08_PM_o3zlcu.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-07",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361335/WhatsApp_Image_2026-03-24_at_7.18.09_PM_1_y1iuxb.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-08",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361473/WhatsApp_Image_2026-03-24_at_7.18.11_PM_1_jt0xsg.jpg",
    title: "",
    date: "",
    desc: "",
  },
  {
    id: "EV-XAVENIR-2025-09",
    src: "https://res.cloudinary.com/dzewgmuty/image/upload/v1774361307/WhatsApp_Image_2026-03-24_at_7.18.07_PM_i2htrr.jpg",
    title: "",
    date: "",
    desc: "",
  },
];

type Telemetry = {
  checksum: string;
  bars: number;
  loadPct: number;
};

function telemetryForId(id: string): Telemetry {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  const checksum = h.toString(16).toUpperCase().padStart(8, "0").slice(0, 8);
  const bars = 3 + (h % 3);
  const loadPct = 48 + (h % 42);
  return { checksum, bars, loadPct };
}

export default function GalleryPage() {
  const [lightbox, setLightbox] = useState<number | null>(null);
  const items: EventItem[] = EVENTS;

  const openAt = useCallback((idx: number) => setLightbox(idx), []);
  const closeLb = useCallback(() => setLightbox(null), []);
  const goPrev = useCallback(() => {
    setLightbox((i) => (i === null ? null : i <= 0 ? items.length - 1 : i - 1));
  }, [items.length]);
  const goNext = useCallback(() => {
    setLightbox((i) => (i === null ? null : i >= items.length - 1 ? 0 : i + 1));
  }, [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lightbox === null) return;
      if (e.key === "Escape") closeLb();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLb, goPrev, goNext]);

  useEffect(() => {
    const cursor = document.getElementById("gal-cursor");
    const trail = document.getElementById("gal-cursor-trail");
    if (!cursor || !trail) return;
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = `${mx}px`;
      cursor.style.top = `${my}px`;
    };
    document.addEventListener("mousemove", onMove);
    const id = setInterval(() => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      trail.style.left = `${tx}px`;
      trail.style.top = `${ty}px`;
    }, 16);
    return () => {
      document.removeEventListener("mousemove", onMove);
      clearInterval(id);
    };
  }, []);

  const lbItem = lightbox !== null ? items[lightbox] : null;
  const lbTel = lbItem ? telemetryForId(lbItem.id) : null;

  return (
    <div
      className="gal-root min-h-screen text-white overflow-x-hidden"
      style={{
        /* ── BACKGROUND IMAGE ───────────────────────────────────────
           Replace the URL below with your own image path, e.g.:
           backgroundImage: "url('/gallery-bg.jpg')"
           The dark overlays (scanlines, noise, corner glow) sit on
           top, so any detailed photo works well here.
        ──────────────────────────────────────────────────────────── */
        backgroundImage: `
          linear-gradient(rgba(0,4,12,0.72) 0%, rgba(0,8,20,0.68) 100%),
          url('/contact/cyberpunk-bg.jpeg')
        `,
        backgroundSize: "cover",
        backgroundPosition: "center top",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div id="gal-cursor" className="gal-cursor" aria-hidden />
      <div id="gal-cursor-trail" className="gal-cursor-trail" aria-hidden />

      <div className="gal-grid-bg" />
      <div className="gal-scanlines" />
      <div className="gal-noise" />
      <div className="gal-corner-glow" />

      {/* ── HERO ── */}
      <header className="gal-hero">
        <div className="gal-hero-left">
          <p className="gal-hero-tag" style={{ fontSize: '1rem', letterSpacing: '0.2em' }}>
            <span className="gal-hero-tag-line" />
            NIT Jamshedpur // CSE
          </p>
          <h1 className="gal-hero-title" style={{ lineHeight: 1.05 }}>
            <span className="gal-glitch" data-text="EVENTS" style={{ fontSize: 'clamp(4rem, 9vw, 8rem)', display: 'block' }}>
              EVENTS
            </span>
            <span className="gal-glitch gal-glitch-pink" data-text="ARCHIVE" style={{ fontSize: 'clamp(4rem, 9vw, 8rem)', display: 'block' }}>
              ARCHIVE
            </span>
          </h1>
          <p className="gal-hero-sub" style={{ fontSize: '1.1rem', lineHeight: 1.8, maxWidth: '480px', opacity: 0.85 }}>
            Encrypted event frames from XAVENIR &amp; SCSE ops. Hover to decrypt details. Click to open a node.
          </p>
        </div>

        <aside className="gal-hero-right" aria-label="Gallery instructions">
          <div className="gal-ops-panel">
            <div className="gal-ops-title" style={{ fontSize: '0.8rem', letterSpacing: '0.3em' }}>OPS.CONSOLE</div>
            <div className="gal-ops-line" style={{ fontSize: '1rem' }}>
              <span className="gal-ops-k">HOVER</span>
              <span className="gal-ops-slash">//</span>
              <span>DECRYPT</span>
            </div>
            <div className="gal-ops-line" style={{ fontSize: '1rem' }}>
              <span className="gal-ops-k">CLICK</span>
              <span className="gal-ops-slash">//</span>
              <span>OPEN NODE</span>
            </div>
            <div className="gal-ops-line" style={{ fontSize: '1rem' }}>
              <span className="gal-ops-k">ESC</span>
              <span className="gal-ops-slash">//</span>
              <span>CLOSE</span>
            </div>
            <div className="gal-ops-divider" />
            <div className="gal-ops-kv">
              <div>
                <div className="gal-ops-num" style={{ fontSize: '2rem' }}>{String(items.length).padStart(2, "0")}</div>
                <div className="gal-ops-lbl" style={{ fontSize: '0.75rem', letterSpacing: '0.18em' }}>ACTIVE NODES</div>
              </div>
              <div>
                <div className="gal-ops-num gal-ops-num-pink" style={{ fontSize: '2rem' }}>{String(items.length)}</div>
                <div className="gal-ops-lbl" style={{ fontSize: '0.75rem', letterSpacing: '0.18em' }}>EVENT FRAMES</div>
              </div>
            </div>
          </div>
        </aside>
      </header>

      {/* ── EVENTS GRID ── */}
      <section className="gal-section cyberpunk-events" aria-label="Events grid">
        <div className="gal-section-head">
          <span className="gal-section-label glitch" style={{ fontSize: '1.1rem', letterSpacing: '0.15em' }}>
            // events.archive()
          </span>
          <div className="gal-cyber-panel neon-border">
            <div className="gal-cp-corner gal-tl pulse" />
            <div className="gal-cp-corner gal-br pulse" />
            <div className="gal-cp-status hologram" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>
              EVENTS // READY
            </div>
            <div className="gal-cp-row matrix-rain">
              <div className="data-node">
                <div className="gal-cp-big gal-cyan flicker" style={{ fontSize: '2.2rem' }}>SCSE</div>
                <div className="gal-cp-small" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>CYBER WORLD</div>
              </div>
              <div className="data-node">
                <div className="gal-cp-big gal-pink scanline" style={{ fontSize: '2.2rem' }}>ARCHIVE</div>
                <div className="gal-cp-small" style={{ fontSize: '0.8rem', letterSpacing: '0.2em' }}>SELECTION</div>
              </div>
            </div>
            <div className="cyber-grid-overlay" />
          </div>
        </div>

        <motion.div className="gal-grid" layout>
          <AnimatePresence mode="popLayout">
            {items.map((item, idx) => {
              const tel = telemetryForId(item.id);
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="gal-card-wrap"
                >
                  <button type="button" className="gal-card" onClick={() => openAt(idx)}>
                    <div className="gal-card-hud">
                      <span className="gal-hud-corner gal-hud-tl" aria-hidden />
                      <span className="gal-hud-corner gal-hud-tr" aria-hidden />
                      <span className="gal-hud-corner gal-hud-bl" aria-hidden />
                      <span className="gal-hud-corner gal-hud-br" aria-hidden />

                      <div className="gal-card-tel" aria-hidden>
                        <span className="gal-tel-lbl" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>BUF.STREAM</span>
                        <div className="gal-tel-sig">
                          {[0,1,2,3,4].map((i) => (
                            <span key={i} className={`gal-tel-dot${i < tel.bars ? " gal-tel-dot-on" : ""}`} />
                          ))}
                        </div>
                        <span className="gal-tel-chk" style={{ fontSize: '0.72rem' }}>0x{tel.checksum}</span>
                      </div>

                      <div className="gal-card-screen">
                        <div className="gal-card-bezel">
                          <div className="gal-card-img-shell">
                            <img src={item.src} alt="" loading="lazy" />
                          </div>
                          <div className="gal-card-vignette" aria-hidden />
                          <div className="gal-card-microgrid" aria-hidden />
                          <div className="gal-card-scan" aria-hidden />
                          <div className="gal-card-shimmer" aria-hidden />
                          <div className="gal-card-meta">
                            <span className="gal-card-id" style={{ fontSize: '0.72rem' }}>{item.id}</span>
                            <span className="gal-card-year" style={{ fontSize: '0.72rem' }}>{item.date}</span>
                          </div>
                          <div className="gal-card-hover">
                            <FaExpand className="gal-card-icon" style={{ fontSize: '1.5rem' }} aria-hidden />
                            <span className="gal-card-hover-label" style={{ fontSize: '0.95rem', letterSpacing: '0.25em' }}>VIEW DETAILS</span>
                            <span className="gal-card-desc" style={{ fontSize: '0.92rem', lineHeight: 1.6 }}>{item.desc}</span>
                          </div>
                        </div>
                      </div>

                      <div className="gal-card-tel-foot" aria-hidden>
                        <span className="gal-tf-lbl" style={{ fontSize: '0.72rem', letterSpacing: '0.12em' }}>DECRYPT</span>
                        <div className="gal-tf-track">
                          <span className="gal-tf-fill" style={{ width: `${tel.loadPct}%` }} />
                        </div>
                        <span className="gal-tf-st" style={{ fontSize: '0.72rem' }}>CLR // OK</span>
                      </div>
                    </div>

                    {/* Card caption */}
                    <div className="gal-card-cap">
                      <span className="gal-cap-ticks" aria-hidden>
                        <span /><span /><span />
                      </span>
                      <span className="gal-card-title" style={{ fontSize: '1.05rem', letterSpacing: '0.08em' }}>{item.title}</span>
                      <span className="gal-card-cat" style={{ fontSize: '0.82rem', letterSpacing: '0.18em' }}>{item.date}</span>
                    </div>
                  </button>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ── LIGHTBOX ── */}
      <AnimatePresence>
        {lbItem && (
          <motion.div
            className="gal-lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-label="Image preview"
            onClick={closeLb}
          >
            <button type="button" className="gal-lb-close" onClick={closeLb} aria-label="Close">
              <FaTimes style={{ fontSize: '1.2rem' }} />
            </button>
            <button type="button" className="gal-lb-nav gal-lb-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
              <FaChevronLeft style={{ fontSize: '1.4rem' }} />
            </button>
            <button type="button" className="gal-lb-nav gal-lb-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
              <FaChevronRight style={{ fontSize: '1.4rem' }} />
            </button>

            <motion.div
              className="gal-lb-panel"
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="gal-lb-hud">
                <span className="gal-hud-corner gal-hud-tl" aria-hidden />
                <span className="gal-hud-corner gal-hud-tr" aria-hidden />
                <span className="gal-hud-corner gal-hud-bl" aria-hidden />
                <span className="gal-hud-corner gal-hud-br" aria-hidden />

                <div className="gal-card-tel gal-lb-tel" aria-hidden>
                  <span className="gal-tel-lbl" style={{ fontSize: '0.82rem', letterSpacing: '0.14em' }}>FULL_RES // NODE</span>
                  <div className="gal-tel-sig">
                    {[0,1,2,3,4].map((i) => (
                      <span key={i} className={`gal-tel-dot${i < lbTel!.bars ? " gal-tel-dot-on" : ""}`} />
                    ))}
                  </div>
                  <span className="gal-tel-chk" style={{ fontSize: '0.82rem' }}>0x{lbTel!.checksum}</span>
                </div>

                <div className="gal-lb-frame">
                  <div className="gal-card-bezel gal-lb-bezel">
                    <div className="gal-card-img-shell gal-lb-img-shell">
                      <img src={lbItem.src} alt={lbItem.title} />
                    </div>
                    <div className="gal-card-vignette" aria-hidden />
                    <div className="gal-card-microgrid" aria-hidden />
                    <div className="gal-lb-scan" aria-hidden />
                    <div className="gal-card-shimmer gal-lb-shimmer" aria-hidden />
                  </div>
                </div>

                <div className="gal-card-tel-foot gal-lb-tel-foot" aria-hidden>
                  <span className="gal-tf-lbl" style={{ fontSize: '0.82rem', letterSpacing: '0.14em' }}>BUFFER</span>
                  <div className="gal-tf-track">
                    <span className="gal-tf-fill" style={{ width: `${lbTel!.loadPct}%` }} />
                  </div>
                  <span className="gal-tf-st" style={{ fontSize: '0.82rem' }}>LIVE</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}