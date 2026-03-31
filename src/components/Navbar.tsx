"use client";

import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { UserContext } from "@/context/UserContext";

const NAV_LINKS: [string, string][] = [
  ["/",         "Home"],
  ["/about",    "About"],
  ["/events",   "Events"],
  ["/contact",  "Contact"],
  ["/gallery",  "Gallery"],
  ["/sponsors", "Sponsors"],
  ["https://www.whatsapp.com", "Whatsapp"],
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { userData, setUserData, authLoading } = useContext(UserContext);
  const loggedIn = !!userData;
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUserData(null);
    setMobileOpen(false);
    router.push("/");
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = () => { if (window.innerWidth > 900) setMobileOpen(false); };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  useEffect(() => {
    const cursor = document.getElementById("cy-cursor");
    const trail  = document.getElementById("cy-cursor-trail");
    if (!cursor || !trail) return;
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      cursor.style.left = mx + "px"; cursor.style.top = my + "px";
    };
    document.addEventListener("mousemove", onMove);
    const id = setInterval(() => {
      tx += (mx - tx) * 0.15; ty += (my - ty) * 0.15;
      trail.style.left = tx + "px"; trail.style.top = ty + "px";
    }, 16);
    return () => { document.removeEventListener("mousemove", onMove); clearInterval(id); };
  }, []);

  return (
    <>
      <div id="cy-cursor" />
      <div id="cy-cursor-trail" />
      <div className="nav-underglow" />

      <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
        <Link href="/" className="logo">&lt;/SCSE&gt;</Link>

        <ul className="nav-links">
          {NAV_LINKS.map(([href, label]) => (
            <li key={href}>
              <a
                href={href}
                className={isActive(href) ? "nav-link-active" : ""}
                {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
              >
                {label}
              </a>
            </li>
          ))}
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

      <div className={`mobile-nav ${mobileOpen ? "mobile-nav-open" : ""}`}>
        {NAV_LINKS.map(([href, label], i) => (
          <a
            key={label}
            href={href}
            className={`mob-link${isActive(href) ? " mob-link-active" : ""}`}
            style={{ animationDelay: mobileOpen ? `${i * 55}ms` : "0ms" }}
            onClick={() => setMobileOpen(false)}
            onTouchStart={e => {
              const el = e.currentTarget;
              el.classList.add("mob-ripple");
              setTimeout(() => el.classList.remove("mob-ripple"), 450);
            }}
            {...(href.startsWith("http") ? { target: "_blank", rel: "noreferrer" } : {})}
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

      {mobileOpen && <div className="mob-backdrop" onClick={() => setMobileOpen(false)} />}
    </>
  );
}