"use client";

import Link from "next/link";

const sections = [
  {
    title: "1. Introduction",
    content: "We value your privacy and are committed to protecting your personal information. This policy explains how SCSE, NIT Jamshedpur collects, uses, and safeguards your data when you use the Xavenir platform.",
  },
  {
    title: "2. Information We Collect",
    content: "We collect personal details you provide during registration — including your full name, email address, college name, and phone number. We also collect usage data such as pages visited and actions taken on the platform.",
  },
  {
    title: "3. How We Use Your Information",
    content: "Your data is used to manage your account, process event registrations and payments, send important updates about Xavenir, and improve the platform experience. We do not use your data for unrelated marketing.",
  },
  {
    title: "4. Data Protection",
    content: "We implement industry-standard security measures including JWT-based authentication, bcrypt password hashing, and HTTPS encryption to protect your data from unauthorized access.",
  },
  {
    title: "5. Data Sharing",
    content: "We do not sell your personal data. It may be shared with payment processors (Razorpay) solely to complete transactions, or disclosed if required by law. Third-party services are bound by their own privacy policies.",
  },
  {
    title: "6. Your Rights",
    content: "You have the right to access, update, or request deletion of your personal data at any time through your dashboard or by contacting us at nitjsr.scse@gmail.com.",
  },
  {
    title: "7. Cookies & Tracking",
    content: "We use HTTP-only cookies for session authentication. We do not use third-party tracking cookies or advertising networks.",
  },
  {
    title: "8. Changes to This Policy",
    content: "We may update this policy periodically. Continued use of the platform after changes constitutes acceptance of the revised policy. Last updated: 2025.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="pp-root">
      <div className="pp-grid-bg" />
      <div className="pp-scanlines" />

      <div className="pp-wrap">
        <div className="pp-hero">
          <span className="pp-label">// legal.privacy()</span>
          <h1 className="pp-title">Privacy <span>Policy</span></h1>
          <p className="pp-sub">How we collect, use, and protect your data on the Xavenir platform.</p>
          <div className="pp-divider" />
        </div>

        <div className="pp-grid">
          {sections.map((s, i) => (
            <div key={i} className="pp-card">
              <div className="pp-card-bar" />
              <h2 className="pp-card-title">{s.title}</h2>
              <p className="pp-card-body">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="pp-footer">
          <p>Questions? Contact us at <a href="mailto:nitjsr.scse@gmail.com">nitjsr.scse@gmail.com</a></p>
          <Link href="/terms" className="pp-link">View Terms &amp; Conditions →</Link>
        </div>
      </div>

      <style>{`
        .pp-root {
          min-height: 100vh;
          background: var(--dark);
          padding-top: var(--nav-h);
          position: relative;
          overflow-x: hidden;
        }
        .pp-grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .pp-scanlines {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px);
        }
        .pp-wrap {
          max-width: 1100px; margin: 0 auto;
          padding: 4rem 3rem 6rem;
          position: relative; z-index: 1;
        }
        .pp-hero { margin-bottom: 3rem; }
        .pp-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem; letter-spacing: 4px;
          color: var(--pink); display: block; margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .pp-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900; color: #fff;
          letter-spacing: 0.1em; margin-bottom: 1rem; line-height: 1.1;
        }
        .pp-title span { color: var(--cyan); text-shadow: 0 0 24px rgba(0,245,255,0.5); }
        .pp-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.05rem; color: rgba(180,200,255,0.6);
          max-width: 600px; line-height: 1.7; margin-bottom: 2rem;
        }
        .pp-divider {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
          opacity: 0.3;
        }
        .pp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .pp-card {
          background: rgba(0,5,30,0.8);
          border: 1px solid rgba(0,245,255,0.1);
          padding: 1.8rem;
          position: relative;
          clip-path: polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
          transition: border-color 0.2s;
        }
        .pp-card:hover { border-color: rgba(0,245,255,0.28); }
        .pp-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: var(--cyan); box-shadow: 0 0 10px var(--cyan);
        }
        .pp-card:nth-child(even) .pp-card-bar { background: var(--pink); box-shadow: 0 0 10px var(--pink); }
        .pp-card-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem; font-weight: 700;
          color: var(--cyan); letter-spacing: 1px;
          margin-bottom: 0.9rem; text-transform: uppercase;
        }
        .pp-card:nth-child(even) .pp-card-title { color: var(--pink); }
        .pp-card-body {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem; color: rgba(200,215,255,0.75);
          line-height: 1.75;
        }
        .pp-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(0,245,255,0.08);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem; color: rgba(180,200,255,0.45);
        }
        .pp-footer a { color: var(--cyan); text-decoration: none; }
        .pp-footer a:hover { text-decoration: underline; }
        .pp-link {
          font-family: 'Orbitron', monospace; font-size: 0.7rem;
          letter-spacing: 2px; color: var(--pink) !important;
          border: 1px solid rgba(255,0,128,0.3);
          padding: 8px 18px; transition: all 0.2s;
          text-decoration: none !important;
        }
        .pp-link:hover { background: rgba(255,0,128,0.1); border-color: var(--pink); }
        @media (max-width: 768px) {
          .pp-wrap { padding: 3rem 1.5rem 4rem; }
          .pp-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .pp-wrap { padding: 2rem 1rem 3rem; }
          .pp-card { padding: 1.3rem; }
        }
      `}</style>
    </div>
  );
}
