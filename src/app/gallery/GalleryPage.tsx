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
    id: "EV-SQUID-GAME-2025",
    src: "https://picsum.photos/seed/scse-squid-game/900/700",
    title: "Squid Game",
    date: "9 FEB, 2025",
    desc: "Intense 2-round challenge where both tech & non-tech questions will push your limits!",
  },
  {
    id: "EV-SCSE-PL2-2025",
    src: "https://picsum.photos/seed/scse-premier-league-2/900/700",
    title: "SCSE Premier League - Season 2",
    date: "FEB, 2025",
    desc: "Ultimate cricket showdown as teams compete for glory in the second season of the SCSE Premier League!",
  },
  {
    id: "EV-SCAVENGER-HUNT-2024",
    src: "https://picsum.photos/seed/scse-scavenger-hunt/900/700",
    title: "Scavenger Hunt",
    date: "2024",
    desc: "A thrilling adventure where participants solve clues, explore the campus, and race against time to win exciting rewards.",
  },
  {
    id: "EV-DODGEBALL-2024",
    src: "https://picsum.photos/seed/scse-dodgeball/900/700",
    title: "Dodgeball",
    date: "2024",
    desc: "Fast-paced and action-packed dodgeball tournament where agility and teamwork lead to victory.",
  },
  {
    id: "EV-SCSE-PL1-2024",
    src: "https://picsum.photos/seed/scse-premier-league-1/900/700",
    title: "SCSE Premier League - Season 1",
    date: "2024",
    desc: "The inaugural season of our highly anticipated cricket tournament, bringing intense competition and unforgettable moments.",
  },
  {
    id: "EV-KODI-YATAVA-2024",
    src: "https://picsum.photos/seed/scse-kodi-yatava/900/700",
    title: "Kodi Yatava",
    date: "2024",
    desc: "Beyond coding.",
  },
];

/** Deterministic “telemetry” per frame id (checksum, signal bars, load bar). */
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

  const openAt = useCallback((idx: number) => {
    setLightbox(idx);
  }, []);

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
    let mx = 0,
      my = 0,
      tx = 0,
      ty = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
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
    <div className="gal-root min-h-screen text-white overflow-x-hidden">
      <div id="gal-cursor" className="gal-cursor" aria-hidden />
      <div id="gal-cursor-trail" className="gal-cursor-trail" aria-hidden />

      <div className="gal-grid-bg" />
      <div className="gal-scanlines" />
      <div className="gal-noise" />
      <div className="gal-corner-glow" />

      <div className="gal-data-stream" aria-hidden>
        <span className="gal-ds-item">GALLERY.VISUAL_DB // READ_ONLY</span>
        <span className="gal-ds-item">XAVENIR.26 // ARCHIVE</span>
        <span className="gal-ds-item">NIT JAMSHEDPUR // SCSE</span>
      </div>

      <header className="gal-hero">
        <div className="gal-hero-left">
          <p className="gal-hero-tag">
            <span className="gal-hero-tag-line" />
            NIT Jamshedpur // CSE
          </p>
          <h1 className="gal-hero-title">
            <span className="gal-glitch" data-text="EVENTS">
              EVENTS
            </span>
            <span className="gal-glitch gal-glitch-pink" data-text="ARCHIVE">
              ARCHIVE
            </span>
          </h1>
          <p className="gal-hero-sub">
            Encrypted event frames from XAVENIR &amp; SCSE ops. Hover to decrypt details. Click to open a node.
          </p>
        </div>

        <aside className="gal-hero-right" aria-label="Gallery instructions">
          <div className="gal-ops-panel">
            <div className="gal-ops-title">OPS.CONSOLE</div>
            <div className="gal-ops-line">
              <span className="gal-ops-k">HOVER</span>
              <span className="gal-ops-slash">//</span>
              <span>DECRYPT</span>
            </div>
            <div className="gal-ops-line">
              <span className="gal-ops-k">CLICK</span>
              <span className="gal-ops-slash">//</span>
              <span>OPEN NODE</span>
            </div>
            <div className="gal-ops-line">
              <span className="gal-ops-k">ESC</span>
              <span className="gal-ops-slash">//</span>
              <span>CLOSE</span>
            </div>
            <div className="gal-ops-divider" />
            <div className="gal-ops-kv">
              <div>
                <div className="gal-ops-num">{String(items.length).padStart(2, "0")}</div>
                <div className="gal-ops-lbl">ACTIVE NODES</div>
              </div>
              <div>
                <div className="gal-ops-num gal-ops-num-pink">{String(items.length)}</div>
                <div className="gal-ops-lbl">EVENT FRAMES</div>
              </div>
            </div>
          </div>
        </aside>
      </header>

      <section className="gal-section cyberpunk-events" aria-label="Events grid">
        <div className="gal-section-head">
          <span className="gal-section-label glitch">// events.archive()</span>
          <div className="gal-cyber-panel neon-border">
            <div className="gal-cp-corner gal-tl pulse" />
            <div className="gal-cp-corner gal-br pulse" />
            <div className="gal-cp-status hologram">EVENTS // READY</div>
            <div className="gal-cp-row matrix-rain">
              <div className="data-node">
                <div className="gal-cp-big gal-cyan flicker">SCSE</div>
                <div className="gal-cp-small">CYBER WORLD</div>
              </div>
              <div className="data-node">
                <div className="gal-cp-big gal-pink scanline">ARCHIVE</div>
                <div className="gal-cp-small">SELECTION</div>
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
                      <span className="gal-tel-lbl">BUF.STREAM</span>
                      <div className="gal-tel-sig">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span key={i} className={`gal-tel-dot${i < tel.bars ? " gal-tel-dot-on" : ""}`} />
                        ))}
                      </div>
                      <span className="gal-tel-chk">0x{tel.checksum}</span>
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
                          <span className="gal-card-id">{item.id}</span>
                          <span className="gal-card-year">{item.date}</span>
                        </div>
                        <div className="gal-card-hover">
                          <FaExpand className="gal-card-icon" aria-hidden />
                          <span className="gal-card-hover-label">VIEW DETAILS</span>
                          <span className="gal-card-desc">{item.desc}</span>
                        </div>
                      </div>
                    </div>

                    <div className="gal-card-tel-foot" aria-hidden>
                      <span className="gal-tf-lbl">DECRYPT</span>
                      <div className="gal-tf-track">
                        <span className="gal-tf-fill" style={{ width: `${tel.loadPct}%` }} />
                      </div>
                      <span className="gal-tf-st">CLR // OK</span>
                    </div>
                  </div>
                  <div className="gal-card-cap">
                    <span className="gal-cap-ticks" aria-hidden>
                      <span /><span /><span />
                    </span>
                    <span className="gal-card-title">{item.title}</span>
                    <span className="gal-card-cat">{item.date}</span>
                  </div>
                </button>
              </motion.div>
            );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      <footer className="gal-footer">
        <div className="gal-footer-inner">
          <span>SCSE © {new Date().getFullYear()} // NIT Jamshedpur</span>
          <span className="gal-footer-sep">│</span>
          <span>GALLERY_STREAM // END_OF_FILE</span>
        </div>
      </footer>

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
              <FaTimes />
            </button>
            <button type="button" className="gal-lb-nav gal-lb-prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label="Previous">
              <FaChevronLeft />
            </button>
            <button type="button" className="gal-lb-nav gal-lb-next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label="Next">
              <FaChevronRight />
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
                  <span className="gal-tel-lbl">FULL_RES // NODE</span>
                  <div className="gal-tel-sig">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <span key={i} className={`gal-tel-dot${i < lbTel!.bars ? " gal-tel-dot-on" : ""}`} />
                    ))}
                  </div>
                  <span className="gal-tel-chk">0x{lbTel!.checksum}</span>
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
                  <span className="gal-tf-lbl">BUFFER</span>
                  <div className="gal-tf-track">
                    <span className="gal-tf-fill" style={{ width: `${lbTel!.loadPct}%` }} />
                  </div>
                  <span className="gal-tf-st">LIVE</span>
                </div>
              </div>

              <div className="gal-lb-info">
                <div className="gal-lb-id">{lbItem.id}</div>
                <h2 className="gal-lb-title">{lbItem.title}</h2>
                <div className="gal-lb-tags">
                  <span>EVENT</span>
                  <span>{lbItem.date}</span>
                </div>
                <p className="gal-lb-desc">{lbItem.desc}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
