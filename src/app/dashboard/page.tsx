"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

// ── Types ──────────────────────────────────────────────
type User = {
  fullName: string;
  email: string;
  userID: string;
  role: string;
  isNitian: boolean;
  isFromCse: boolean;
  isPrime: boolean;
  collegeName: string;
};

// ── Helpers ────────────────────────────────────────────
function useCountUp(target: number, duration = 1800) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min(1, (ts - start) / duration);
      const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
      setVal(Math.floor(ease * target));
      if (p < 1) requestAnimationFrame(tick);
      else setVal(target);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);
  return val;
}

// ── Sub-components ─────────────────────────────────────
function ScanLines() {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-0"
      style={{
        background: `repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.07) 2px,rgba(0,0,0,0.07) 4px)`,
      }}
    />
  );
}

function GridBg() {
  return (
    <div
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: -1,
        backgroundImage: `linear-gradient(rgba(0,245,255,0.06) 1px,transparent 1px),linear-gradient(90deg,rgba(0,245,255,0.06) 1px,transparent 1px)`,
        backgroundSize: "60px 60px",
      }}
    />
  );
}

function StatCard({ label, value, accent }: { label: string; value: number; accent: string }) {
  const count = useCountUp(value);
  return (
    <div className="stat-card" style={{ "--accent": accent } as any}>
      <div className="stat-card-inner">
        <div className="stat-num">{count.toLocaleString()}</div>
        <div className="stat-label">{label}</div>
      </div>
      <div className="stat-corner tl" />
      <div className="stat-corner br" />
    </div>
  );
}

function PulsingDot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 8px ${color}`,
        animation: "pulse 1.5s ease infinite",
        flexShrink: 0,
      }}
    />
  );
}

// ── Main Page ──────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeNav, setActiveNav] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);
  const [glitch, setGlitch] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Fetch user from your existing /api/auth/me or logtok endpoint
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) { router.push("/login"); return; }
        const data = await res.json();
        setUser(data.user);
      } catch {
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // Glitch trigger
  useEffect(() => {
    const id = setInterval(() => {
      setGlitch(true);
      setTimeout(() => setGlitch(false), 400);
    }, 8000);
    return () => clearInterval(id);
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = [
    { key: "overview", label: "OVERVIEW", icon: "◈" },
    { key: "events", label: "EVENTS", icon: "◆" },
    { key: "registrations", label: "REGISTRATIONS", icon: "◉" },
    { key: "profile", label: "PROFILE", icon: "◎" },
  ];

  const events = [
    { icon: "⌨", title: "Code Wars", desc: "Competitive programming challenge. Push your algorithmic limits.", prize: "₹10,000", tag: "CODING" },
    { icon: "🔒", title: "CTF Challenge", desc: "Capture the Flag cybersecurity battle. Crack the system.", prize: "₹8,000", tag: "SECURITY" },
    { icon: "🤖", title: "AI Hackathon", desc: "Build an AI-powered solution in 24 hours. Innovate or perish.", prize: "₹15,000", tag: "AI/ML" },
    { icon: "◉", title: "Circuit Design", desc: "Design and simulate embedded circuits under time pressure.", prize: "₹6,000", tag: "HARDWARE" },
    { icon: "🎬", title: "Tech Reel", desc: "Craft a captivating video reel centered on technology trends.", prize: "₹2,000", tag: "CREATIVE" },
    { icon: "🎮", title: "Gaming Arena", desc: "PUBG & Valorant tournament. Dominate the battlefield.", prize: "₹3,000", tag: "GAMING" },
  ];

  if (loading) {
    return (
      <div className="dash-root flex items-center justify-center">
        <GridBg />
        <ScanLines />
        <div style={{ textAlign: "center" }}>
          <div className="loader-ring" />
          <p style={{ fontFamily: "'Share Tech Mono',monospace", color: "var(--cyan)", letterSpacing: 4, fontSize: 12, marginTop: 20 }}>
            INITIALIZING SYSTEM...
          </p>
        </div>
        <DashStyles />
      </div>
    );
  }

  return (
    <div className="dash-root">
      <GridBg />
      <ScanLines />

      {/* ── NAVBAR ── */}
      <nav className="dash-nav">
        <a href="#" className="logo-text">
          &lt;/SCSE&gt;
        </a>

        {/* Desktop nav */}
        <ul className="nav-items">
          {navItems.map((n) => (
            <li key={n.key}>
              <button
                className={`nav-link ${activeNav === n.key ? "nav-link-active" : ""}`}
                onClick={() => setActiveNav(n.key)}
              >
                <span className="nav-icon">{n.icon}</span>
                {n.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="nav-right">
          {user && (
            <div className="nav-user">
              <PulsingDot color="var(--cyan)" />
              <span className="nav-user-name">{user.fullName.split(" ")[0].toUpperCase()}</span>
            </div>
          )}
          <button className="nav-logout-btn" onClick={handleLogout}>
            LOGOUT
          </button>
        </div>
      </nav>

      {/* ── TICKER ── */}
      <div className="ticker-wrap">
        <div className="ticker-track">
          {[
            "XAVENIR 2025 — REGISTRATIONS OPEN",
            "CODE WARS ◆ CTF ◆ AI HACKATHON ◆ CIRCUIT DESIGN",
            "NIT JAMSHEDPUR ◆ SCSE",
            "INNOVATE. CREATE. DOMINATE.",
            "XAVENIR 2025 — REGISTRATIONS OPEN",
            "CODE WARS ◆ CTF ◆ AI HACKATHON ◆ CIRCUIT DESIGN",
          ].map((t, i) => (
            <span key={i} className="ticker-item">
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <main className="dash-main">

        {/* ── HERO GREETING ── */}
        <section className="hero-section">
          <div className="hero-tag-row">
            <span className="hero-tag-line" />
            <span className="hero-tag-text">SYSTEM ACCESS GRANTED</span>
            <PulsingDot color="var(--pink)" />
          </div>

          <h1 className={`hero-h1 ${glitch ? "glitch-active" : ""}`}>
            WELCOME BACK,{" "}
            <span className="hero-name">
              {user?.fullName?.split(" ")[0]?.toUpperCase() ?? "AGENT"}
            </span>
          </h1>

          <p className="hero-sub">
            <span style={{ color: "var(--cyan)" }}>USER_ID:</span>{" "}
            {user?.userID} &nbsp;|&nbsp;
            <span style={{ color: "var(--cyan)" }}>ROLE:</span>{" "}
            {user?.role?.toUpperCase()} &nbsp;|&nbsp;
            <span style={{ color: "var(--cyan)" }}>STATUS:</span>{" "}
            <span style={{ color: "var(--pink)" }}>ACTIVE</span>
          </p>

          {/* Badges */}
          <div className="badge-row">
            {user?.isNitian && (
              <span className="badge badge-cyan">◈ NIT JAMSHEDPUR</span>
            )}
            {user?.isFromCse && (
              <span className="badge badge-pink">◆ SCSE MEMBER</span>
            )}
            {user?.isPrime && (
              <span className="badge badge-yellow">★ PRIME ACCESS</span>
            )}
          </div>
        </section>

        {/* ── STAT CARDS ── */}
        <section className="stats-section">
          <StatCard label="EVENTS AVAILABLE" value={6} accent="var(--cyan)" />
          <StatCard label="TOTAL PRIZE POOL" value={44000} accent="var(--yellow)" />
          <StatCard label="PARTICIPANTS" value={1200} accent="var(--pink)" />
          <StatCard label="DAYS REMAINING" value={12} accent="var(--purple)" />
        </section>

        {/* ── EVENTS GRID ── */}
        {activeNav === "overview" || activeNav === "events" ? (
          <section className="events-section">
            <div className="section-header">
              <span className="section-label-tag">// ACTIVE COMPETITIONS</span>
              <div className="section-divider-line" />
            </div>

            <div className="events-grid">
              {events.map((ev, i) => (
                <div
                  key={i}
                  className="event-card"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="event-card-top" />
                  <div className="event-icon">{ev.icon}</div>
                  <div className="event-tag">{ev.tag}</div>
                  <h3 className="event-title">{ev.title}</h3>
                  <p className="event-desc">{ev.desc}</p>
                  <div className="event-footer">
                    <span className="event-prize">{ev.prize}</span>
                    <button className="event-btn">REGISTER ▶</button>
                  </div>
                  <div className="event-corner tl" />
                  <div className="event-corner br" />
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── PROFILE PANEL ── */}
        {activeNav === "profile" && user && (
          <section className="profile-section">
            <div className="section-header">
              <span className="section-label-tag">// AGENT PROFILE</span>
              <div className="section-divider-line" />
            </div>

            <div className="profile-grid">
              <div className="profile-card">
                <div className="profile-card-top" />
                <div className="profile-avatar">
                  {user.fullName.charAt(0).toUpperCase()}
                </div>
                <h2 className="profile-name">{user.fullName.toUpperCase()}</h2>
                <p className="profile-role">{user.role.toUpperCase()}</p>

                <div className="profile-divider" />

                <div className="profile-fields">
                  {[
                    { label: "USER_ID", val: user.userID },
                    { label: "EMAIL", val: user.email },
                    { label: "COLLEGE", val: user.collegeName },
                    { label: "NIT_STATUS", val: user.isNitian ? "VERIFIED ✓" : "EXTERNAL" },
                    { label: "CSE_ACCESS", val: user.isFromCse ? "GRANTED ✓" : "DENIED" },
                    { label: "PRIME", val: user.isPrime ? "ACTIVE ✓" : "INACTIVE" },
                  ].map((f) => (
                    <div key={f.label} className="profile-field">
                      <span className="profile-field-label">{f.label}</span>
                      <span className="profile-field-val">{f.val}</span>
                    </div>
                  ))}
                </div>

                <div className="event-corner tl" />
                <div className="event-corner br" />
              </div>
            </div>
          </section>
        )}

        {/* ── REGISTRATIONS PLACEHOLDER ── */}
        {activeNav === "registrations" && (
          <section className="profile-section">
            <div className="section-header">
              <span className="section-label-tag">// MY REGISTRATIONS</span>
              <div className="section-divider-line" />
            </div>
            <div className="empty-panel">
              <div className="empty-icon">◈</div>
              <p className="empty-title">NO REGISTRATIONS YET</p>
              <p className="empty-sub">Register for events to see them here.</p>
              <button
                className="event-btn"
                style={{ marginTop: 20 }}
                onClick={() => setActiveNav("events")}
              >
                BROWSE EVENTS ▶
              </button>
            </div>
          </section>
        )}

      </main>

      {/* ── FOOTER ── */}
      <footer className="dash-footer">
        <div className="footer-inner">
          <span className="footer-logo">&lt;/SCSE&gt;</span>
          <span className="footer-text">
            © 2025 XAVENIR — NIT JAMSHEDPUR &nbsp;|&nbsp; SCSE WEB TEAM
          </span>
          <div className="footer-right">
            <PulsingDot color="var(--cyan)" />
            <span className="footer-live">SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>

      <DashStyles />
    </div>
  );
}

// ── All styles ─────────────────────────────────────────
function DashStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

      :root {
        --cyan:   #00f5ff;
        --pink:   #ff0080;
        --purple: #bf00ff;
        --yellow: #ffff00;
        --dark:   #020010;
        --panel:  rgba(0,5,30,0.8);
      }

      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

      .dash-root {
        min-height: 100vh;
        background: var(--dark);
        background-image:
          radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,0,80,0.8) 0%, transparent 70%),
          radial-gradient(ellipse 60% 80% at 100% 100%, rgba(180,0,255,0.12) 0%, transparent 60%),
          radial-gradient(ellipse 50% 60% at 0% 80%, rgba(0,245,255,0.08) 0%, transparent 60%);
        color: #e0e0ff;
        font-family: 'Rajdhani', sans-serif;
        overflow-x: hidden;
        position: relative;
      }

      /* NAV */
      .dash-nav {
        position: sticky; top: 0; z-index: 100;
        height: 66px;
        padding: 0 2.5rem;
        display: flex; align-items: center; justify-content: space-between; gap: 2rem;
        background: rgba(2,0,16,0.92);
        border-bottom: 1px solid rgba(0,245,255,0.15);
        backdrop-filter: blur(20px);
      }
      .dash-nav::after {
        content: '';
        position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, transparent, var(--cyan), var(--pink), transparent);
        animation: navGlow 4s linear infinite;
      }
      @keyframes navGlow { 0%,100%{opacity:0.4} 50%{opacity:1} }

      .logo-text {
        font-family: 'Orbitron', monospace;
        font-size: 1.4rem; font-weight: 900;
        color: var(--cyan);
        text-shadow: 0 0 20px var(--cyan), 0 0 40px rgba(0,245,255,0.4);
        letter-spacing: 4px;
        text-decoration: none;
        white-space: nowrap;
      }

      .nav-items {
        display: flex; gap: 0.5rem; list-style: none; flex: 1; justify-content: center;
      }
      .nav-link {
        background: transparent; border: none;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.72rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.6);
        padding: 8px 14px; cursor: pointer;
        display: flex; align-items: center; gap: 6px;
        position: relative; transition: color 0.2s;
        text-transform: uppercase;
      }
      .nav-link::after {
        content: '';
        position: absolute; bottom: -1px; left: 0;
        width: 0; height: 1px;
        background: var(--cyan);
        box-shadow: 0 0 8px var(--cyan);
        transition: width 0.3s;
      }
      .nav-link:hover { color: var(--cyan); }
      .nav-link:hover::after { width: 100%; }
      .nav-link-active { color: var(--cyan) !important; }
      .nav-link-active::after { width: 100% !important; }
      .nav-icon { font-size: 10px; opacity: 0.7; }

      .nav-right { display: flex; align-items: center; gap: 14px; white-space: nowrap; }
      .nav-user {
        display: flex; align-items: center; gap: 8px;
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.72rem; color: rgba(0,245,255,0.7);
        letter-spacing: 2px;
      }
      .nav-user-name { color: var(--cyan); }
      .nav-logout-btn {
        font-family: 'Orbitron', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        padding: 7px 18px;
        border: 1px solid var(--pink);
        color: var(--pink); background: transparent;
        cursor: pointer; text-transform: uppercase;
        transition: all 0.25s;
      }
      .nav-logout-btn:hover { background: var(--pink); color: #000; box-shadow: 0 0 18px var(--pink); }

      /* TICKER */
      .ticker-wrap {
        overflow: hidden;
        background: rgba(0,0,20,0.6);
        border-bottom: 1px solid rgba(0,245,255,0.08);
        padding: 8px 0;
        position: relative; z-index: 2;
      }
      .ticker-track {
        display: flex; gap: 0;
        white-space: nowrap;
        animation: ticker 28s linear infinite;
      }
      .ticker-item {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 3px;
        color: rgba(0,245,255,0.45);
        padding: 0 3rem;
      }
      .ticker-item:nth-child(odd) { color: rgba(255,0,128,0.4); }
      @keyframes ticker { from{transform:translateX(0)} to{transform:translateX(-50%)} }

      /* MAIN */
      .dash-main {
        padding: 0 2.5rem 3rem;
        max-width: 1400px;
        margin: 0 auto;
        position: relative; z-index: 1;
      }

      /* HERO */
      .hero-section { padding: 3rem 0 2rem; }
      .hero-tag-row {
        display: flex; align-items: center; gap: 12px;
        margin-bottom: 1.2rem;
      }
      .hero-tag-line {
        display: inline-block; width: 28px; height: 1px;
        background: var(--pink); box-shadow: 0 0 8px var(--pink);
      }
      .hero-tag-text {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.68rem; letter-spacing: 4px;
        color: var(--pink); text-transform: uppercase;
      }

      .hero-h1 {
        font-family: 'Orbitron', monospace;
        font-size: clamp(1.8rem, 4vw, 3rem);
        font-weight: 900; color: #fff;
        text-shadow: 0 0 30px rgba(0,245,255,0.2);
        margin-bottom: 0.8rem;
        position: relative;
      }
      .hero-name {
        color: var(--cyan);
        text-shadow: 0 0 20px var(--cyan), 0 0 50px rgba(0,245,255,0.4);
      }
      .glitch-active {
        animation: glitchAnim 0.4s steps(2) forwards;
      }
      @keyframes glitchAnim {
        0%  { transform: none; }
        20% { transform: skewX(-2deg) translateX(-3px); }
        40% { transform: skewX(2deg) translateX(3px); }
        60% { transform: skewX(-1deg); }
        80% { transform: none; }
        100%{ transform: none; }
      }

      .hero-sub {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.8rem; letter-spacing: 2px;
        color: rgba(180,200,255,0.6); margin-bottom: 1.2rem;
      }

      .badge-row { display: flex; gap: 10px; flex-wrap: wrap; }
      .badge {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        padding: 4px 14px;
        border-radius: 0;
        text-transform: uppercase;
      }
      .badge-cyan { border: 1px solid var(--cyan); color: var(--cyan); background: rgba(0,245,255,0.06); }
      .badge-pink { border: 1px solid var(--pink); color: var(--pink); background: rgba(255,0,128,0.06); }
      .badge-yellow { border: 1px solid var(--yellow); color: var(--yellow); background: rgba(255,255,0,0.06); }

      /* STATS */
      .stats-section {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 16px; margin-bottom: 3rem;
      }
      .stat-card {
        background: var(--panel);
        border: 1px solid rgba(0,245,255,0.1);
        padding: 1.8rem 1.5rem;
        position: relative; overflow: hidden;
        clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        transition: border-color 0.2s, box-shadow 0.2s;
      }
      .stat-card::before {
        content: '';
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: var(--accent);
        box-shadow: 0 0 12px var(--accent);
      }
      .stat-card:hover { border-color: rgba(0,245,255,0.3); box-shadow: 0 0 25px rgba(0,245,255,0.06); }
      .stat-num {
        font-family: 'Orbitron', monospace;
        font-size: 2.2rem; font-weight: 900;
        color: var(--accent);
        text-shadow: 0 0 20px var(--accent);
        display: block; line-height: 1;
      }
      .stat-label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.6rem; letter-spacing: 3px;
        color: rgba(180,200,255,0.45);
        text-transform: uppercase; margin-top: 6px;
      }
      .stat-corner {
        position: absolute; width: 12px; height: 12px;
      }
      .stat-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); }
      .stat-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); }

      /* EVENTS */
      .section-header {
        display: flex; align-items: center; gap: 1.5rem;
        margin-bottom: 1.8rem;
      }
      .section-label-tag {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.68rem; letter-spacing: 4px;
        color: var(--pink); white-space: nowrap;
      }
      .section-divider-line {
        flex: 1; height: 1px;
        background: linear-gradient(90deg, rgba(255,0,128,0.3), transparent);
      }

      .events-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 18px;
      }
      .event-card {
        background: var(--panel);
        border: 1px solid rgba(0,245,255,0.08);
        padding: 1.8rem;
        position: relative; overflow: hidden;
        clip-path: polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px));
        transition: all 0.3s;
        animation: cardIn 0.5s ease both;
      }
      .event-card-top {
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, var(--cyan), transparent);
        box-shadow: 0 0 10px var(--cyan);
      }
      .event-card::after {
        content: '';
        position: absolute; bottom: 0; left: 0;
        width: 0; height: 2px;
        background: linear-gradient(90deg, var(--cyan), var(--pink));
        transition: width 0.4s ease;
        box-shadow: 0 0 10px var(--cyan);
      }
      .event-card:hover::after { width: 100%; }
      .event-card:hover { border-color: rgba(0,245,255,0.3); transform: translateY(-4px); box-shadow: 0 12px 40px rgba(0,245,255,0.08); }
      @keyframes cardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:none} }

      .event-icon { font-size: 2.2rem; margin-bottom: 0.8rem; filter: drop-shadow(0 0 10px var(--cyan)); }
      .event-tag {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.58rem; letter-spacing: 3px;
        color: var(--pink); margin-bottom: 0.6rem;
      }
      .event-title {
        font-family: 'Orbitron', monospace;
        font-size: 1rem; font-weight: 700;
        color: var(--cyan); margin-bottom: 0.6rem;
      }
      .event-desc { font-size: 0.88rem; color: rgba(180,200,255,0.6); line-height: 1.6; margin-bottom: 1.2rem; }
      .event-footer { display: flex; align-items: center; justify-content: space-between; }
      .event-prize {
        font-family: 'Orbitron', monospace;
        font-size: 1rem; font-weight: 700;
        color: var(--yellow); text-shadow: 0 0 10px rgba(255,255,0,0.5);
      }
      .event-btn {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        padding: 7px 16px;
        border: 1px solid var(--cyan); color: var(--cyan);
        background: transparent; cursor: pointer;
        transition: all 0.25s;
        text-transform: uppercase;
      }
      .event-btn:hover { background: var(--cyan); color: #000; box-shadow: 0 0 18px var(--cyan); }

      .event-corner {
        position: absolute; width: 12px; height: 12px;
      }
      .event-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
      .event-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }

      /* PROFILE */
      .profile-section { padding-bottom: 2rem; }
      .profile-grid { display: flex; justify-content: center; }
      .profile-card {
        background: var(--panel);
        border: 1px solid rgba(0,245,255,0.12);
        padding: 2.5rem;
        width: 100%; max-width: 520px;
        position: relative;
        clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
      }
      .profile-card-top {
        position: absolute; top: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg, var(--cyan), var(--purple), transparent);
        box-shadow: 0 0 12px var(--cyan);
      }
      .profile-avatar {
        width: 72px; height: 72px;
        background: linear-gradient(135deg, var(--cyan), var(--purple));
        display: flex; align-items: center; justify-content: center;
        font-family: 'Orbitron', monospace;
        font-size: 1.8rem; font-weight: 900; color: #000;
        margin: 0 auto 1.2rem;
        clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
      }
      .profile-name {
        font-family: 'Orbitron', monospace;
        font-size: 1.1rem; font-weight: 700;
        color: #fff; text-align: center; margin-bottom: 4px;
        letter-spacing: 2px;
      }
      .profile-role {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.7rem; letter-spacing: 3px;
        color: var(--pink); text-align: center; margin-bottom: 1.5rem;
      }
      .profile-divider { height: 1px; background: rgba(0,245,255,0.1); margin-bottom: 1.5rem; }
      .profile-fields { display: flex; flex-direction: column; gap: 12px; }
      .profile-field {
        display: flex; justify-content: space-between; align-items: center;
        padding: 10px 14px;
        background: rgba(0,245,255,0.03);
        border: 1px solid rgba(0,245,255,0.07);
      }
      .profile-field-label {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        color: rgba(0,245,255,0.5);
      }
      .profile-field-val {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.75rem; letter-spacing: 1px;
        color: rgba(220,230,255,0.85);
      }

      /* EMPTY */
      .empty-panel {
        background: var(--panel);
        border: 1px solid rgba(0,245,255,0.08);
        padding: 4rem;
        text-align: center;
        clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 16px 100%, 0 calc(100% - 16px));
      }
      .empty-icon { font-size: 3rem; color: rgba(0,245,255,0.2); margin-bottom: 1rem; }
      .empty-title {
        font-family: 'Orbitron', monospace;
        font-size: 1rem; color: rgba(0,245,255,0.4);
        letter-spacing: 3px; margin-bottom: 8px;
      }
      .empty-sub {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.75rem; color: rgba(180,200,255,0.35); letter-spacing: 1px;
      }

      /* FOOTER */
      .dash-footer {
        border-top: 1px solid rgba(0,245,255,0.1);
        background: rgba(0,0,10,0.9);
        position: relative; z-index: 1;
      }
      .footer-inner {
        max-width: 1400px; margin: 0 auto;
        padding: 1.2rem 2.5rem;
        display: flex; align-items: center; justify-content: space-between; gap: 1rem;
      }
      .footer-logo {
        font-family: 'Orbitron', monospace;
        font-size: 1rem; font-weight: 900;
        color: var(--cyan); letter-spacing: 3px;
        text-shadow: 0 0 14px var(--cyan);
      }
      .footer-text {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        color: rgba(180,200,255,0.25);
      }
      .footer-right { display: flex; align-items: center; gap: 8px; }
      .footer-live {
        font-family: 'Share Tech Mono', monospace;
        font-size: 0.65rem; letter-spacing: 2px;
        color: rgba(0,245,255,0.5);
      }

      /* LOADER */
      .loader-ring {
        width: 50px; height: 50px;
        border: 2px solid rgba(0,245,255,0.15);
        border-top-color: var(--cyan);
        border-radius: 50%;
        animation: spin 0.8s linear infinite;
        margin: 0 auto;
        box-shadow: 0 0 20px var(--cyan);
      }
      @keyframes spin { to{transform:rotate(360deg)} }

      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }

      /* RESPONSIVE */
      @media (max-width: 900px) {
        .stats-section { grid-template-columns: repeat(2,1fr); }
        .nav-items { display: none; }
        .dash-nav { padding: 0 1.2rem; }
        .dash-main { padding: 0 1.2rem 2rem; }
      }
      @media (max-width: 600px) {
        .stats-section { grid-template-columns: 1fr 1fr; gap: 10px; }
        .events-grid { grid-template-columns: 1fr; }
        .logo-text { font-size: 1rem; }
      }
    `}</style>
  );
}