
import Link from "next/link";

const sections = [
  {
    id: "01",
    title: "Refund Eligibility",
    content: "Refunds are only authorized if the event is cancelled or terminated by the organizers (SCSE, NIT Jamshedpur). In such cases, the full registration amount will be returned to the original payment method within 7–10 business days.",
    color: "var(--cyan)",
  },
  {
    id: "02",
    title: "Cancellation by Participant",
    content: "Participants may cancel their registration up to 7 days before the event for a 50% refund. Cancellations made within 7 days of the event are not eligible for any refund.",
    color: "var(--pink)",
  },
  {
    id: "03",
    title: "No-Show Policy",
    content: "No refunds will be issued for participants who register but do not attend the event. Registration fees are forfeited in case of a no-show.",
    color: "var(--yellow)",
  },
  {
    id: "04",
    title: "Force Majeure",
    content: "In the event of natural disasters, government restrictions, or other circumstances beyond our control, refunds are not automatically triggered. Alternative arrangements or tokens may be issued at the organizers' discretion.",
    color: "var(--purple)",
  },
  {
    id: "05",
    title: "Refund Process",
    content: "To initiate a refund, contact us at nitjsr.scse@gmail.com with your registration details and reason for cancellation. Approved refunds will be processed within 7–10 business days to the original payment source.",
    color: "var(--cyan)",
  },
  {
    id: "06",
    title: "Payment Disputes",
    content: "If you believe a charge was made in error, please contact us within 48 hours of the transaction. We will investigate and resolve the issue promptly in coordination with our payment partner (Razorpay).",
    color: "var(--pink)",
  },
];

export default function RefundPage() {
  return (
    <div className="rf-root">
      <div className="rf-grid-bg" />
      <div className="rf-scanlines" />

      <div className="rf-wrap">
        <div className="rf-hero">
          <span className="rf-label">// legal.refund()</span>
          <h1 className="rf-title">Refund &amp; <span>Cancellation</span></h1>
          <p className="rf-sub">Our policy on refunds, cancellations, and payment disputes for Xavenir registrations.</p>
          <div className="rf-divider" />
        </div>

        <div className="rf-grid">
          {sections.map((s) => (
            <div key={s.id} className="rf-card">
              <div className="rf-card-bar" style={{ background: s.color, boxShadow: `0 0 10px ${s.color}` }} />
              <div className="rf-card-num" style={{ color: s.color }}>{s.id}</div>
              <h2 className="rf-card-title" style={{ color: s.color }}>{s.title}</h2>
              <p className="rf-card-body">{s.content}</p>
            </div>
          ))}
        </div>

        <div className="rf-contact">
          <div className="rf-contact-label">// support.contact()</div>
          <div className="rf-contact-grid">
            <a href="mailto:nitjsr.scse@gmail.com" className="rf-contact-item">
              <span className="rf-contact-tag">MAIL</span>
              nitjsr.scse@gmail.com
            </a>
            <a href="tel:+919118841006" className="rf-contact-item">
              <span className="rf-contact-tag">PHONE</span>
              +91 91188 41006
            </a>
          </div>
        </div>

        <div className="rf-footer">
          <p>Last updated: 2025 &nbsp;|&nbsp; Questions? <a href="mailto:nitjsr.scse@gmail.com">nitjsr.scse@gmail.com</a></p>
          <Link href="/privacy" className="rf-link">View Privacy Policy →</Link>
        </div>
      </div>

      <style>{`
        .rf-root {
          min-height: 100vh;
          background: var(--dark);
          padding-top: var(--nav-h);
          position: relative;
          overflow-x: hidden;
        }
        .rf-grid-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(0,245,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.04) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        .rf-scanlines {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.05) 2px,rgba(0,0,0,0.05) 4px);
        }
        .rf-wrap {
          max-width: 1100px; margin: 0 auto;
          padding: 4rem 3rem 6rem;
          position: relative; z-index: 1;
        }
        .rf-hero { margin-bottom: 3rem; }
        .rf-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.75rem; letter-spacing: 4px;
          color: var(--pink); display: block; margin-bottom: 1rem;
          text-transform: uppercase;
        }
        .rf-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2rem, 5vw, 3.5rem);
          font-weight: 900; color: #fff;
          letter-spacing: 0.1em; margin-bottom: 1rem; line-height: 1.1;
        }
        .rf-title span { color: var(--cyan); text-shadow: 0 0 24px rgba(0,245,255,0.5); }
        .rf-sub {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1.05rem; color: rgba(180,200,255,0.6);
          max-width: 600px; line-height: 1.7; margin-bottom: 2rem;
        }
        .rf-divider {
          height: 1px; width: 100%;
          background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
          opacity: 0.3;
        }
        .rf-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1.5rem;
          margin-bottom: 3rem;
        }
        .rf-card {
          background: rgba(0,5,30,0.8);
          border: 1px solid rgba(0,245,255,0.1);
          padding: 1.8rem;
          position: relative;
          clip-path: polygon(0 0,calc(100% - 14px) 0,100% 14px,100% 100%,14px 100%,0 calc(100% - 14px));
          transition: border-color 0.2s;
        }
        .rf-card:hover { border-color: rgba(0,245,255,0.28); }
        .rf-card-bar {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
        }
        .rf-card-num {
          font-family: 'Orbitron', monospace;
          font-size: 0.65rem; font-weight: 700; letter-spacing: 3px;
          opacity: 0.5; margin-bottom: 0.6rem;
        }
        .rf-card-title {
          font-family: 'Orbitron', monospace;
          font-size: 0.82rem; font-weight: 700;
          letter-spacing: 1px; margin-bottom: 0.9rem;
          text-transform: uppercase;
        }
        .rf-card-body {
          font-family: 'Rajdhani', sans-serif;
          font-size: 1rem; color: rgba(200,215,255,0.75);
          line-height: 1.75;
        }
        .rf-contact {
          background: rgba(0,5,30,0.8);
          border: 1px solid rgba(0,245,255,0.12);
          border-left: 3px solid var(--pink);
          padding: 2rem 2rem;
          margin-bottom: 3rem;
        }
        .rf-contact-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem; letter-spacing: 4px;
          color: var(--pink); margin-bottom: 1.4rem;
          text-transform: uppercase;
        }
        .rf-contact-grid {
          display: grid; grid-template-columns: 1fr 1fr; gap: 1.2rem;
        }
        .rf-contact-item {
          display: flex; align-items: center; gap: 12px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.88rem; color: rgba(200,220,255,0.8);
          text-decoration: none; transition: color 0.2s;
        }
        .rf-contact-item:hover { color: var(--cyan); }
        .rf-contact-tag {
          font-family: 'Orbitron', monospace;
          font-size: 0.58rem; font-weight: 700; letter-spacing: 2px;
          padding: 3px 8px; background: rgba(255,0,128,0.15);
          border: 1px solid rgba(255,0,128,0.4); color: var(--pink);
          flex-shrink: 0;
        }
        .rf-footer {
          display: flex; align-items: center; justify-content: space-between;
          flex-wrap: wrap; gap: 1rem;
          padding-top: 2rem;
          border-top: 1px solid rgba(0,245,255,0.08);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.8rem; color: rgba(180,200,255,0.45);
        }
        .rf-footer a { color: var(--cyan); text-decoration: none; }
        .rf-footer a:hover { text-decoration: underline; }
        .rf-link {
          font-family: 'Orbitron', monospace; font-size: 0.7rem;
          letter-spacing: 2px; color: var(--pink) !important;
          border: 1px solid rgba(255,0,128,0.3);
          padding: 8px 18px; transition: all 0.2s;
          text-decoration: none !important;
        }
        .rf-link:hover { background: rgba(255,0,128,0.1); border-color: var(--pink); }
        @media (max-width: 768px) {
          .rf-wrap { padding: 3rem 1.5rem 4rem; }
          .rf-grid { grid-template-columns: 1fr; }
          .rf-contact-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .rf-wrap { padding: 2rem 1rem 3rem; }
          .rf-card { padding: 1.3rem; }
          .rf-contact { padding: 1.4rem; }
        }
      `}</style>
    </div>
  );
}
