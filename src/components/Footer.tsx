"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function Footer() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [year] = useState(new Date().getFullYear());

  useEffect(() => {
    fetch("/api/visitors")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setVisitorCount(d.count ?? 0))
      .catch(() => {});
  }, []);

  return (
    <footer id="contact" className="ft">
      {/* ── top glow bar ── */}
      <div className="ft-glow-bar" />
      <div className="ft-top-line" />

      {/* ── big brand strip ── */}
      <div className="ft-brand-strip">
        <div className="ft-brand-inner">
          <div className="ft-brand-left">
            <span className="ft-logo">&lt;SCSE&gt;</span>
            <span className="ft-tagline">Society of Computer Science &amp; Engineering</span>
            <p className="ft-desc">
              Innovate. Create. Dominate.<br />
              The premier tech community at NIT Jamshedpur.<br />
              Code to the Future — Xavenir &apos;26.
            </p>
            <div className="ft-socials">
              <a href="https://www.instagram.com/scse.nitjsr" target="_blank" rel="noreferrer" className="ft-social" aria-label="Instagram">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.youtube.com/channel/UChVrvyEjDkUEhqoBezJLxpw" target="_blank" rel="noreferrer" className="ft-social" aria-label="YouTube">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z"/>
                  <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              <a href="https://www.linkedin.com/company/scse-nitjsr" target="_blank" rel="noreferrer" className="ft-social" aria-label="LinkedIn">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
                  <rect x="2" y="9" width="4" height="12"/>
                  <circle cx="4" cy="4" r="2"/>
                </svg>
              </a>
            </div>
          </div>
          <div className="ft-links-grid">
            <div className="ft-col">
              <h4 className="ft-col-head"><span className="ft-col-slash"></span> Navigate</h4>
              <nav className="ft-nav">
                <a href="/#hero" className="ft-link">Home</a>
                <a href="/about" className="ft-link">About</a>
                <a href="/events" className="ft-link">Events</a>
                <Link href="/gallery" className="ft-link">Gallery</Link>
                <Link href="/sponsors" className="ft-link">Sponsors</Link>
              </nav>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-head"><span className="ft-col-slash"></span> Legal</h4>
              <nav className="ft-nav">
                <Link href="/terms" className="ft-link">Terms &amp; Conditions</Link>
                <Link href="/privacy" className="ft-link">Privacy Policy</Link>
                <Link href="/refund" className="ft-link">Refund &amp; Cancellation</Link>
                <Link href="/shipping" className="ft-link">Shipping &amp; Delivery</Link>
                <Link href="/contact" className="ft-link">Contact</Link>
              </nav>
            </div>
            <div className="ft-col">
              <h4 className="ft-col-head"><span className="ft-col-slash"></span> Contact</h4>
              <div className="ft-contact">
                <div className="ft-contact-item">
                  <span className="ft-contact-icon">◈</span>
                  <span>NIT Jamshedpur, Adityapur<br />Jharkhand — 831014</span>
                </div>
                <div className="ft-contact-item">
                  <span className="ft-contact-icon">◈</span>
                  <a href="tel:+919798687024" className="ft-contact-link">+91 97986 87024</a>
                </div>
                <div className="ft-contact-item">
                  <span className="ft-contact-icon">◈</span>
                  <a href="tel:+919693780078" className="ft-contact-link">+91 96937 80078</a>
                </div>
                <div className="ft-contact-item">
                  <span className="ft-contact-icon">◈</span>
                  <a href="mailto:nitjsr.scse@gmail.com" className="ft-contact-link">nitjsr.scse@gmail.com</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── divider ── */}
      <div className="ft-divider" />

      {/* ── bottom bar ── */}
      <div className="ft-bottom">
        <span className="ft-copy">© {year} Xavenir · SCSE NIT Jamshedpur · All rights reserved</span>
        <div className="ft-visitor">
          <span className="ft-visitor-dot" />
          <span className="ft-visitor-label">VISITORS</span>
          <span className="ft-visitor-count">
            {visitorCount !== null ? visitorCount.toLocaleString() : "—"}
          </span>
        </div>
        <span className="ft-credit">Built by SCSE Web Team</span>
      </div>

      <style>{`
        .ft {
          position: relative; z-index: 1;
          background: linear-gradient(180deg, rgba(0,0,12,0.97) 0%, #000008 100%);
          border-top: 1px solid rgba(0,245,255,0.12);
          overflow: hidden;
          font-family: 'Share Tech Mono', monospace;
        }
        .ft::before {
          content: '';
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(0,245,255,0.018) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.018) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }
        .ft-glow-bar {
          height: 2px;
          background: linear-gradient(90deg, transparent 0%, var(--cyan) 25%, var(--pink) 50%, var(--purple, #bf00ff) 75%, transparent 100%);
          box-shadow: 0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(255,0,128,0.2);
          animation: ft-bar-shift 6s linear infinite;
          background-size: 200% 100%;
        }
        @keyframes ft-bar-shift {
          0% { background-position: 0% 0%; }
          100% { background-position: 200% 0%; }
        }
        .ft-top-line {
          height: 1px;
          margin: 1.2rem 5rem 0;
          background: linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent);
          opacity: 0.35;
        }
        .ft-brand-strip {
          padding: 4rem 5rem 3rem;
          position: relative;
        }
        .ft-brand-inner {
          display: grid;
          grid-template-columns: 1.1fr 2fr;
          gap: 5rem;
          align-items: start;
          max-width: 1400px;
          margin: 0 auto;
        }
        .ft-brand-left { display: flex; flex-direction: column; gap: 1rem; }
        .ft-logo {
          font-family: 'Orbitron', monospace;
          font-size: 2rem; font-weight: 900;
          letter-spacing: 0.08em;
          color: var(--cyan);
          text-shadow:
            0 0 6px rgba(0,245,255,0.5),
            0 0 18px rgba(0,245,255,0.2);
          line-height: 1;
        }
        .ft-tagline {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem; letter-spacing: 0.22em;
          color: rgba(0,245,255,0.4); text-transform: uppercase;
        }
        .ft-desc {
          font-family: 'Exo 2', 'Share Tech Mono', monospace;
          font-size: 0.88rem; font-weight: 300;
          color: rgba(180,200,255,0.45);
          line-height: 1.85; margin: 0.4rem 0 0.8rem;
        }
        .ft-socials { display: flex; gap: 0.75rem; margin-top: 0.4rem; }
        .ft-social {
          width: 40px; height: 40px;
          display: flex; align-items: center; justify-content: center;
          border: 1px solid rgba(0,245,255,0.18);
          color: rgba(0,245,255,0.5);
          text-decoration: none;
          position: relative; overflow: hidden;
          transition: color 0.25s, border-color 0.25s, box-shadow 0.25s;
          clip-path: polygon(8px 0%, 100% 0%, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0% 100%, 0% 8px);
        }
        .ft-social::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(135deg, rgba(0,245,255,0.08), rgba(255,0,128,0.08));
          opacity: 0; transition: opacity 0.25s;
        }
        .ft-social:hover { color: var(--cyan); border-color: rgba(0,245,255,0.55); box-shadow: 0 0 18px rgba(0,245,255,0.25); }
        .ft-social:hover::before { opacity: 1; }
        .ft-links-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem;
        }
        .ft-col { display: flex; flex-direction: column; gap: 0.2rem; }
        .ft-col-head {
          font-family: 'Orbitron', monospace;
          font-size: 0.68rem; font-weight: 700;
          letter-spacing: 0.22em; text-transform: uppercase;
          color: #e0e8ff; margin-bottom: 1.2rem;
          display: flex; align-items: center; gap: 0.5rem;
        }
        .ft-col-slash { color: var(--cyan); font-family: 'Share Tech Mono', monospace; }
        .ft-nav { display: flex; flex-direction: column; gap: 0.1rem; }
        .ft-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem; letter-spacing: 0.06em;
          color: rgba(180,200,255,0.42);
          text-decoration: none; padding: 0.38rem 0;
          border-left: 2px solid transparent;
          padding-left: 0.7rem;
          transition: color 0.2s, border-color 0.2s, padding-left 0.2s;
          display: block;
        }
        .ft-link:hover { color: var(--cyan); border-left-color: var(--cyan); padding-left: 1rem; }
        .ft-contact { display: flex; flex-direction: column; gap: 0.75rem; }
        .ft-contact-item {
          display: flex; align-items: flex-start; gap: 0.6rem;
          font-size: 0.78rem; color: rgba(180,200,255,0.42); line-height: 1.6;
        }
        .ft-contact-icon { color: var(--cyan); flex-shrink: 0; margin-top: 1px; font-size: 0.7rem; }
        .ft-contact-link {
          color: rgba(180,200,255,0.42); text-decoration: none;
          transition: color 0.2s;
        }
        .ft-contact-link:hover { color: var(--cyan); }
        .ft-divider {
          height: 1px; margin: 0 5rem;
          background: linear-gradient(90deg, transparent, rgba(0,245,255,0.15), rgba(255,0,128,0.1), transparent);
        }
        .ft-bottom {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding: 1.4rem 5rem 2rem;
          max-width: 1400px; margin: 0 auto;
        }
        .ft-copy {
          font-size: 0.68rem; letter-spacing: 0.08em;
          color: rgba(180,200,255,0.22);
        }
        .ft-visitor {
          display: flex; align-items: center; gap: 0.6rem;
          background: rgba(0,245,255,0.04);
          border: 1px solid rgba(0,245,255,0.14);
          padding: 6px 14px;
          clip-path: polygon(6px 0%, 100% 0%, 100% calc(100% - 6px), calc(100% - 6px) 100%, 0% 100%, 0% 6px);
        }
        .ft-visitor-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
          animation: ft-pulse 1.5s ease infinite;
          flex-shrink: 0;
        }
        @keyframes ft-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .ft-visitor-label {
          font-size: 0.6rem; letter-spacing: 0.25em;
          color: rgba(0,245,255,0.4); text-transform: uppercase;
        }
        .ft-visitor-count {
          font-family: 'Orbitron', monospace;
          font-size: 0.82rem; font-weight: 700;
          color: var(--cyan); letter-spacing: 0.1em;
        }
        .ft-credit {
          font-size: 0.65rem; letter-spacing: 0.1em;
          color: rgba(180,200,255,0.18);
        }

        /* ── responsive ── */
        @media (max-width: 1100px) {
          .ft-brand-inner { grid-template-columns: 1fr; gap: 3rem; }
          .ft-brand-strip { padding: 3rem 2rem 2.5rem; }
          .ft-top-line { margin: 1rem 2rem 0; }
          .ft-divider { margin: 0 2rem; }
          .ft-bottom { padding: 1.2rem 2rem 1.8rem; }
        }
        @media (max-width: 700px) {
          .ft-links-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
          .ft-brand-strip { padding: 2.5rem 1.2rem 2rem; }
          .ft-top-line { margin: 0.8rem 1.2rem 0; }
          .ft-divider { margin: 0 1.2rem; }
          .ft-bottom { padding: 1rem 1.2rem 1.5rem; flex-direction: column; align-items: flex-start; gap: 0.8rem; }
          .ft-logo { font-size: 1.6rem; }
        }
        @media (max-width: 480px) {
          .ft-links-grid { grid-template-columns: 1fr; gap: 1.8rem; }
          .ft-brand-strip { padding: 2rem 1rem 1.8rem; }
          .ft-top-line { margin: 0.7rem 1rem 0; }
          .ft-divider { margin: 0 1rem; }
          .ft-bottom { padding: 1rem 1rem 1.4rem; }
        }
      `}</style>
    </footer>
  );
}
