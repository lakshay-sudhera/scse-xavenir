"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { UserContext } from "@/context/UserContext";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userData, setUserData, authLoading } = useContext(UserContext);
  const loggedIn = !!userData;
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserData(null);
    setMobileOpen(false);
    router.push("/");
  };

  // ── Scroll shadow ──────────────────────────────────
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // ── Close mobile menu on resize ────────────────────
  useEffect(() => {
    const handler = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // ── Custom cursor (global — runs on every page) ────
  useEffect(() => {
    const cursor = document.getElementById("cy-cursor");
    const trail  = document.getElementById("cy-cursor-trail");
    if (!cursor || !trail) return;

    let mx = 0, my = 0, tx = 0, ty = 0;

    const onMove = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      cursor.style.left = mx + "px";
      cursor.style.top  = my + "px";
    };

    document.addEventListener("mousemove", onMove);

    const id = setInterval(() => {
      tx += (mx - tx) * 0.15;
      ty += (my - ty) * 0.15;
      trail.style.left = tx + "px";
      trail.style.top  = ty + "px";
    }, 16);

    return () => {
      document.removeEventListener("mousemove", onMove);
      clearInterval(id);
    };
  }, []);

  return (
    <>
      {/* ── Custom cursor elements (rendered once globally) ── */}
      <div id="cy-cursor" />
      <div id="cy-cursor-trail" />

      {/* ── Navbar underglow ── */}
      <div className="nav-underglow" />

      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <Link href="/" className="logo">&lt;/SCSE&gt;</Link>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><Link href="/">Home</Link></li>
          <li><a href="/about">About</a></li>
          <li><a href="/events">Events</a></li>
          <li><a href="/contact">Contact</a></li>
          <li><a href="/gallery">Gallery</a></li>
          <li><a href="/sponsors">Sponsors</a></li>
          <li><a href="/sponsors">Whatsapp</a></li>
        </ul>

        <div className="nav-right">
          {authLoading ? (
            <div className="nav-skeleton" aria-hidden="true">
              <span className="nav-skel-btn" />
              <span className="nav-skel-btn nav-skel-btn-sm" />
            </div>
          ) : loggedIn ? (
            <>
              {userData?.role === "admin" && (
                <Link href="/admin" className="nav-cta" style={{ borderColor: "var(--yellow)", color: "var(--yellow)" }}>Admin</Link>
              )}
              <Link href="/dashboard" className="nav-cta nav-cta-register">Dashboard</Link>
              <button className="nav-cta" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/register" className="nav-cta nav-cta-register">Register</Link>
              <Link href="/login" className="nav-cta">Login</Link>
            </>
          )}
          <button
            className={`hamburger ${mobileOpen ? "hamburger-open" : ""}`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span /><span /><span />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-nav ${mobileOpen ? "mobile-nav-open" : ""}`}>
        {[
          ["/",              "Home"],
          ["/about",         "About"],
          ["/events",        "Events"],
          ["/contact",       "Contact"],
          ["/gallery",       "Gallery"],
          ["/sponsors",      "Sponsors"],
          ["/sponsors",      "Whatsapp"],
        ].map(([href, label], i) => (
          <a
            key={label}
            href={href}
            className="mob-link"
            style={{ animationDelay: mobileOpen ? `${i * 55}ms` : "0ms" }}
            onClick={() => setMobileOpen(false)}
          >
            <span className="mob-link-icon">◆</span>{label}
            <span className="mob-link-arr">›</span>
          </a>
        ))}
        {loggedIn ? (
          <>
            {userData?.role === "admin" && (
              <Link href="/admin" className="mob-cta" style={{ borderColor: "var(--yellow)", color: "var(--yellow)" }} onClick={() => setMobileOpen(false)}>▶ &nbsp;Admin</Link>
            )}
            <Link href="/dashboard" className="mob-cta" onClick={() => setMobileOpen(false)}>▶ &nbsp;Dashboard</Link>
            <button className="mob-cta" onClick={handleLogout}>▶ &nbsp;Logout</button>
          </>
        ) : (
          <>
            <Link href="/register" className="mob-cta" onClick={() => setMobileOpen(false)}>▶ &nbsp;Register</Link>
            <Link href="/login" className="mob-cta" onClick={() => setMobileOpen(false)}>▶ &nbsp;Login</Link>
          </>
        )}
      </div>

      {mobileOpen && (
        <div className="mob-backdrop" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
}