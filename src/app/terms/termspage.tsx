"use client";

import Link from "next/link";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: "By using the Xavenir platform and its services, you confirm that you have read, understood, and agree to be bound by these Terms. We reserve the right to modify these Terms at any time. Continued use of the platform constitutes acceptance of any revised Terms.",
  },
  {
    title: "2. Account Registration",
    content: "To access and use the Services, you agree to provide true, accurate, and complete information during registration. You are responsible for all activity that occurs under your registered account and must keep your credentials secure.",
  },
  {
    title: "3. Accuracy of Information",
    content: "Neither SCSE nor any third parties guarantee the accuracy, timeliness, or completeness of information on this platform. We expressly exclude liability for any inaccuracies or errors to the fullest extent permitted by law.",
  },
  {
    title: "4. Use of Services",
    content: "Your use of our Services is solely at your own risk. You agree not to use the platform for any purpose that is unlawful, illegal, or forbidden by these Terms or applicable Indian laws.",
  },
  {
    title: "5. Intellectual Property",
    content: "All content on this platform is proprietary to SCSE, NIT Jamshedpur. You have no authority to claim any intellectual property rights, title, or interest in its contents without explicit written permission.",
  },
  {
    title: "6. Payments & Refunds",
    content: "You agree to pay the charges associated with event registrations. Refund claims must be raised within the stipulated time period as per our refund policy. Failure to do so makes you ineligible for a refund.",
  },
  {
    title: "7. Third-Party Links",
    content: "The platform may contain links to third-party websites. On accessing these links, you will be governed by the terms, privacy policy, and other policies of those third-party websites. We are not responsible for their content.",
  },
  {
    title: "8. Limitation of Liability",
    content: "Neither party shall be liable for any failure to perform obligations under these Terms if performance is prevented or delayed by a force majeure event beyond reasonable control.",
  },
  {
    title: "9. Governing Law",
    content: "These Terms shall be governed by and construed in accordance with the laws of India. All disputes shall be subject to the exclusive jurisdiction of the courts in Jamshedpur, Jharkhand.",
  },
  {
    title: "10. Contact",
    content: "All concerns or communications relating to these Terms must be directed to us via the contact information provided on this website or at nitjsr.scse@gmail.com.",
  },
];

export default function TermsPage() {
  return (
    <div className="tc-root">
      <div className="tc-grid-bg" />
      <div className="tc-scanlines" />

      <div className="tc-wrap">
        <div className="tc-hero">
          <span className="tc-label">// legal.terms()</span>
          <h1 className="tc-title">Terms &amp; <span>Conditions</span></h1>
          <p className="tc-sub">Please read these terms carefully before using the Xavenir platform and its services.</p>
          <div className="tc-divider" />
        </div>

        <div className="tc-list">
          {sections.map((s, i) => (
            <div key={i} className="tc-item">
              <div className="tc-item-num">{String(i + 1).padStart(2, "0")}</div>
              <div className="tc-item-content">
                <h2 className="tc-item-title">{s.title}</h2>
                <p className="tc-item-body">{s.content}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="tc-footer">
          <p>Last updated: 2026 &nbsp;|&nbsp; Questions? <a href="mailto:nitjsr.scse@gmail.com">nitjsr.scse@gmail.com</a></p>
          <Link href="/privacy" className="tc-link">View Privacy Policy →</Link>
        </div>
      </div>

      <style>{`
        .tc-root {
          min-height: 100vh;
          background: var(--dark);
          padding-top: var(--nav-h);
          position: relative;
          overflow-x: hidden;
        }
        .tc-grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .tc-scanlines {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px);
        }
        .tc-wrap {
          max-width: 900px; margin: 0 auto;
          padding: 4rem 3rem 6rem;
          position: relative; z-index: 1;
        }
        .tc-hero { margin-bottom: 3rem; }
        .tc-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem; letter-spacing: 4px;
          color: var(--pink); display: block; margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .tc-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900; color: #fff;
          letter-spacing: 0.1em; margin-bottom: 1rem; line-height: 1.1;
        }
        .tc-title span { color: var(--cyan); text-shadow: 0 0 24px rgba(0,245,255,0.5); }
        .tc-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.05rem; color: rgba(180,200,255,0.6);
          max-width: 600px; line-height: 1.7; margin-bottom: 2rem;
        }
        .tc-divider {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
          opacity: 0.3;
        }
        .tc-list { display: flex; flex-direction: column; gap: 0; }
        .tc-item {
          display: flex; gap: 2rem; align-items: flex-start;
          padding: 1.8rem 0;
          border-bottom: 1px solid rgba(0,245,255,0.07);
          transition: background 0.2s;
        }
        .tc-item:last-child { border-bottom: none; }
        .tc-item:hover { background: rgba(0,245,255,0.02); }
        .tc-item-num {
          font-family: 'Orbitron', monospace;
          font-size: 1.6rem; font-weight: 900;
          color: rgba(0,245,255,0.15);
          flex-shrink: 0; width: 48px;
          line-height: 1;
          padding-top: 4px;
        }
        .tc-item-content { flex: 1; }
        .tc-item-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.82rem; font-weight: 700;
          color: var(--cyan); letter-spacing: 1.5px;
          margin-bottom: 0.8rem; text-transform: uppercase;
        }
        .tc-item-body {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem; color: rgba(200,215,255,0.72);
          line-height: 1.8;
        }
        .tc-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding-top: 2.5rem;
          margin-top: 1rem;
          border-top: 1px solid rgba(0,245,255,0.08);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem; color: rgba(180,200,255,0.45);
        }
        .tc-footer a { color: var(--cyan); text-decoration: none; }
        .tc-footer a:hover { text-decoration: underline; }
        .tc-link {
          font-family: 'Orbitron', monospace; font-size: 0.7rem;
          letter-spacing: 2px; color: var(--pink) !important;
          border: 1px solid rgba(255,0,128,0.3);
          padding: 8px 18px; transition: all 0.2s;
          text-decoration: none !important;
        }
        .tc-link:hover { background: rgba(255,0,128,0.1); border-color: var(--pink); }
        @media (max-width: 768px) {
          .tc-wrap { padding: 3rem 1.5rem 4rem; }
          .tc-item { gap: 1.2rem; }
          .tc-item-num { font-size: 1.2rem; width: 36px; }
        }
        @media (max-width: 480px) {
          .tc-wrap { padding: 2rem 1rem 3rem; }
          .tc-item { gap: 0.8rem; padding: 1.4rem 0; }
          .tc-item-num { display: none; }
        }
      `}</style>
    </div>
  );
}
