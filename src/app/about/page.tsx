"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

// ── Types ──────────────────────────────────────────────
interface Professor {
  name: string;
  role: string;
  img: string;
}

interface Member {
  name: string;
  role: string;
  img: string;
  phone: string;
  email: string;
  linkedin: string;
}

interface Edition {
  year: string;
  theme: string;
  highlights: string[];
  participants: string;
  events: string;
  prizePool: string;
  status: "ARCHIVED" | "ACTIVE";
}

interface WebMember {
  name: string;
  role: string;
  img: string;
  github?: string;
  linkedin: string;
  stack?: string[];
}

// ── Data ───────────────────────────────────────────────
const PROFESSORS: Professor[] = [
  {
    name: "Dr. Danish Ali Khan",
    role: "Head of Department",
    img: "/images/danishalisir.png",
  },
  {
    name: "Dr. Jitesh Pradhan",
    role: "Prof. In-Charge",
    img: "",
  },
  {
    name: "Dr. Dilip Kumar Shaw",
    role: "Associate Professor",
    img: "",
  },
];

const CORE_TEAM: Member[] = [
    {
    name: "Abhishek kumar",
    role: "President",
    img: "/images/Screenshot_20260220_093211 - Abhishek Kumar.jpg",
    phone: "+91 9798687024",
    email: "2023ugcs048@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/abhishek-kaushik47",
  },
  {
    name: "Shahnwaz Khan",
    role: "Vice President",
    img: "/images/IMG-20240926-WA0020 - Shahnwaz Khan.jpg",
    phone: "+91 9142277970",
    email: "shahnwazkhan2007@gmail.com",
    linkedin: "https://www.linkedin.com/in/khanshahnwaz",
  },
  {
    name: "Aman Singh",
    role: "Joint Secretary",
    img: "/images/IMG_5241 - Aman Singh.jpg",
    phone: "+91 7348762674",
    email: "aman734876@gmail.com",
    linkedin: "https://www.linkedin.com/in/aman-singh-webdev/",
  },
  {
    name: "Roshni Kumari",
    role: "General Secretary",
    img: "/images/IMG_20260220_013432.jpg (1) - Roshni Kumari.jpeg",
    phone: "8709758581",
    email: "roshnikumari212004@gmail.com",
    linkedin: "https://www.linkedin.com/in/roshni-kumari-2aa61928a/",
  },
  {
    name: "Sujal Kumar",
    role: "Treasurer",
    img: "/images/IMG-20250720-WA0008~2 - Sujal Kumar.jpg",
    phone: "9693780078",
    email: "sujalpas62@gmail.com",
    linkedin: "https://www.linkedin.com/in/sujal-kumar-552a39237",
  },
];

const MEMBERS: Member[] = [
    {
    name: "Krrish Kumar",
    role: "Web Head",
    img: "/images/20230101_104901_Original - KRRISH KUMAR.jpeg",
    phone: "9110123553",
    email: "2024ugcs050@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/krrish-kumar-bb2aaa328",
  },
  {
    name: "Shivapreetham H S",
    role: "Web Head",
    img: "/images/linkedin - Shiva Preetham.jpg",
    phone: "9845920244",
    email: "2023ugcs120@nitjsr.ac.in",
    linkedin: "https://linkedin.com/in/shivapreetham",
  },
  {
    name: "Naveen Kushawaha",
    role: "Web Head",
    img: "/images/WhatsApp Image 2026-02-20 at 11.32.50 AM - Naveen Kushawaha.jpeg",
    phone: "9198511333",
    email: "naveenkushawaha2003@gmail.com",
    linkedin: "https://www.linkedin.com/in/naveen-kushawaha-310921212/",
  },
  {
    name: "Vinay Ojha",
    role: "Tech Head",
    img: "/images/1740010495918 - Vinay Ojha.jpeg",
    phone: "7263047411",
    email: "ojhavinay7602@gmail.com",
    linkedin: "https://www.linkedin.com/in/vinay-ojha-9910a831a?trk=people-search-result",
  },
  {
    name: "Tanishq Gupta",
    role: "Tech Head",
    img: "/images/WhatsApp Image 2026-03-24 at 18.42.47 - Tanishq Gupta.jpeg",
    phone: "6299354348",
    email: "2023ugcs074@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/tanishq-gupta-77237a282/",
  },
  {
    name: "Harsh Raj",
    role: "Tech Head",
    img: "/images/IMG_20260108_004533 - Harsh Raj.jpg",
    phone: "9234661377",
    email: "rajharsh0204@gmail.com",
    linkedin: "https://www.linkedin.com/in/harsh-raj-9447812ba?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Aprajita",
    role: "Tech Head",
    img: "/images/IMG-20250615-WA0015 - Aprajita Thakur.jpg",
    phone: "9142765159",
    email: "aprajitathakur964@gmail.com",
    linkedin: "https://www.linkedin.com/in/aprajita-thakur-1317a1223?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Ayush Verma",
    role: "App Head",
    img: "/images/IMG-20251202-WA0009 - Ayush Verma.jpg",
    phone: "8936081707",
    email: "ayush7610jsr@gmail.com",
    linkedin: "https://www.linkedin.com/ayush-verma-jsr25",
  },
  {
    name: "Vignesh Chaurasia",
    role: "App Head",
    img: "/images/IMG_9059 - Vignesh Chaurasia.HEIC",
    phone: "9152657366",
    email: "vigneshchaurasia@gmail.com",
    linkedin: "http://www.linkedin.com/in/vignesh-chaurasia-nitjsr",
  },
  {
    name: "Nandini Rathod",
    role: "Creative Head",
    img: "/images/WhatsApp Image 2026-02-20 at 14.42.06 - Nandini Rathod.jpeg",
    phone: "8500721504",
    email: "2023ugcs079@gmail.com",
    linkedin: "https://www.linkedin.com/in/nandini-rathod-67080928a/",
  },
  {
    name: "Shreehari Kalundia",
    role: "Creative Head",
    img: "/images/IMG_1376.JPG - Shreehari Kalundia.jpeg",
    phone: "7033558339",
    email: "kalundia7@gmail.com",
    linkedin: "https://www.linkedin.com/in/shreehari-kalundia-31a58a22a/",
  },
  {
    name: "Harsh Agarwal",
    role: "CA Head",
    img: "/images/WhatsApp Image 2026-03-24 at 5.09.42 PM - Harsh Agarwal.jpeg",
    phone: "7061960920",
    email: "2023ugcs097@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/harsh-agarwal-2a9922283/",
  },
  {
    name: "Akash Jaiswal",
    role: "CA Head",
    img: "",
    phone: "9572991083",
    email: "jaisakash9341@gmail.com",
    linkedin: "https://www.linkedin.com/in/akash-jaiswal-042305291?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
  {
    name: "Raj Singh",
    role: "PR Head",
    img: "/images/image - Raj Singh.webp",
    phone: "9305360368",
    email: "rajs73635@gmail.com",
    linkedin: "https://www.linkedin.com/in/raj-singh-b10226294",
  },
  {
    name: "RIYA",
    role: "PR Head",
    img: "/images/IMG_20240922_225030_779 - Riya Rajput.jpg",
    phone: "6232681526",
    email: "rajputriya887@gmail.com",
    linkedin: "https://www.linkedin.com/in/riya-kachere-730b68151/",
  },
  {
    name: "Sankarsharn Rastogi ",
    role: "PR Head",
    img: "/images/IMG_20260325_104836 - Sankarsharn Rastogi.png",
    phone: "8081252928",
    email: "sankarsharnrastogi@gmail.com",
    linkedin: "https://www.linkedin.com/in/sankarsharn-rastogi-117544217",
  },
  {
    name: "Srijan Swapnil",
    role: "PR Head",
    img: "/images/IMG_6119~2 - Srijan Swapnil.jpg",
    phone: "9162780885",
    email: "srijanswapnil246@gmail.com",
    linkedin: "https://www.linkedin.com/in/srijan-swapnil-a2910827b?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
  {
    name: "Aditya Prakash",
    role: "EM Head",
    img: "/images/IMG-20260217-WA0019_1 - ADITYA PRAKASH.jpg",
    phone: "9205120803",
    email: "adityaprakash91111@gmail.com",
    linkedin: "https://in.linkedin.com/in/aditya-prakash-985739327",
  },
  {
    name: "Sachin Kumar",
    role: "EM Head",
    img: "/images/DSC_0129 (1) - Sachin Kumar.JPG",
    phone: "8229860167",
    email: "sachinljk376@gmail.com",
    linkedin: "https://www.linkedin.com/in/sachin-kumar-206086265/",
  },
  {
    name: "Aameya Devansh",
    role: "EM Head",
    img: "/images/IMG_0015 (2) - Aameya Devansh.JPG",
    phone: "9234102388",
    email: "adevansh123@gmail.com",
    linkedin: "https://www.linkedin.com/in/aameya-devansh",
  },
  {
    name: "Anuj Kumar",
    role: "EM Head",
    img: "/images/IMG-20250515-WA0025 - ᗩᑎᑌᒍ Kᑌᗰᗩᖇ.jpg",
    phone: "7858927896",
    email: "kumar10305ak@gmail.com",
    linkedin: "https://www.linkedin.com/in/anuj-kumar-2b376a281/",
  },
  {
    name: "Udit pandey",
    role: "EM Head",
    img: "",
    phone: "8800699180",
    email: "uditpandey8800@gmail.com",
    linkedin: "https://www.linkedin.com/in/udit-pandey-351417328?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
];

// ── Replace these with real web team members ──────────
const WEB_TEAM: WebMember[] = [
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  {
    name: "Abhijeet Kumar Trivedi",
    role: "Web Lead",
    img: "/images/20240616_222405_resized - Abhijeet kumar Trivedi.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/abhijeet-kumar-trivedi-329b90258",
    
  },
  {
    name: "Sulochan Khadka",
    role: "Web Team Lead",
    img: "/images/Screenshot_2025-03-31 - sulochan khadka.jpg",
    github: "https://github.com/",
    linkedin: "https://www.linkedin.com/in/sulochan-khadka",
    
  },
  
  // ───────────────────────────────────────────────────────────
];

const EDITIONS: Edition[] = [
  {
    year: "2023",
    theme: "Rise of the Machines",
    highlights: [
      "First ever SCSE Tech Fest",
      "500+ participants",
      "6 flagship events",
      "Industry experts from TCS & Infosys",
    ],
    participants: "500+",
    events: "6",
    prizePool: "₹25,000",
    status: "ARCHIVED",
  },
  {
    year: "2024",
    theme: "Code to the Future",
    highlights: [
      "Expanded to 8 competitions",
      "1200+ participants across India",
      "AI Hackathon introduced",
      "Live CTF Challenge",
    ],
    participants: "1200+",
    events: "8",
    prizePool: "₹40,000",
    status: "ARCHIVED",
  },
  {
    year: "2025",
    theme: "Code to the Future",
    highlights: [
      "Biggest edition yet",
      "National level participation",
      "₹50K+ prize pool",
      "Gaming tournament added",
    ],
    participants: "2000+",
    events: "8",
    prizePool: "₹50,000+",
    status: "ACTIVE",
  },
];

// ── Typing animation hook ──────────────────────────────
function useTypingEffect(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisplayed("");
    setDone(false);
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(interval);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
  }, [text, speed, startDelay]);
  return { displayed, done };
}

// ── Intersection observer hook ────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

// ── Section Header component ──────────────────────────
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="sec-header">
      <span className="sec-label">// {label}</span>
      <h2 className="sec-title">{title}</h2>
      <div className="sec-line" />
    </div>
  );
}

// ── Professor Card ────────────────────────────────────
function ProfCard({ prof }: { prof: Professor }) {
  return (
    <div className="prof-card">
      <div className="prof-img-wrap">
        <div className="prof-img-border" />
        <img src={prof.img} alt={prof.name} className="prof-img" />
        <div className="prof-scan" />
      </div>
      <div className="prof-info">
        <span className="prof-tag">// FACULTY.NODE</span>
        <h3 className="prof-name">{prof.name}</h3>
        <p className="prof-role">{prof.role}</p>
      </div>
    </div>
  );
}

// ── Core Team Card ────────────────────────────────────
function CoreCard({ member }: { member: Member }) {
  return (
    <div className="core-card">
      <div className="core-img-wrap">
        <img src={member.img} alt={member.name} className="core-img" />
        <div className="core-overlay" />
        <div className="core-corner tl" />
        <div className="core-corner br" />
      </div>
      <div className="core-info">
        <span className="core-id">// CORE.TEAM</span>
        <h3 className="core-name">{member.name}</h3>
        <p className="core-role">{member.role}</p>
        <div className="core-contacts">
          <a href={`tel:${member.phone}`} className="core-contact-link">
            <span className="core-contact-icon">☎</span> {member.phone}
          </a>
          <a href={`mailto:${member.email}`} className="core-contact-link">
            <span className="core-contact-icon">✉</span> {member.email}
          </a>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="core-linkedin">
            ▶ LinkedIn Profile
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Member Card ───────────────────────────────────────
function MemberCard({ member, idx }: { member: Member; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`mem-card ${hovered ? "mem-card-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="mem-id-tag">[{String(idx + 1).padStart(2, "0")}]</div>
      <div className="mem-img-wrap">
        <img src={member.img} alt={member.name} className="mem-img" />
        <div className="mem-img-overlay" />
      </div>
      <div className="mem-info">
        <h3 className="mem-name">{member.name}</h3>
        <p className="mem-role">{member.role}</p>
        <div className={`mem-details ${hovered ? "mem-details-visible" : ""}`}>
          <a href={`tel:${member.phone}`} className="mem-detail-item">
            ☎ {member.phone}
          </a>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mem-detail-linkedin">
            ▶ LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Edition Card ──────────────────────────────────────
function EditionCard({ ed, idx }: { edition?: Edition; ed: Edition; idx: number }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={`edition-card ${ed.status === "ACTIVE" ? "edition-active" : ""}`}>
      <div className="edition-header" onClick={() => setOpen(!open)}>
        <div className="edition-year-wrap">
          <span className="edition-node">NODE_{String(idx + 1).padStart(2, "0")}</span>
          <span className="edition-year">XAVENIR '{ed.year.slice(2)}</span>
        </div>
        <div className="edition-meta">
          <span className="edition-theme">"{ed.theme}"</span>
          <span className={`edition-status ${ed.status === "ACTIVE" ? "edition-status-active" : ""}`}>
            {ed.status === "ACTIVE" ? "● ACTIVE" : "◆ ARCHIVED"}
          </span>
        </div>
        <span className="edition-chevron">{open ? "▲" : "▼"}</span>
      </div>

      {open && (
        <div className="edition-body">
          <div className="edition-stats-row">
            {[
              { label: "PARTICIPANTS", val: ed.participants },
              { label: "EVENTS", val: ed.events },
              { label: "PRIZE POOL", val: ed.prizePool },
            ].map((s) => (
              <div key={s.label} className="edition-stat">
                <span className="edition-stat-val">{s.val}</span>
                <span className="edition-stat-label">{s.label}</span>
              </div>
            ))}
          </div>
          <div className="edition-highlights">
            <span className="edition-hl-label">// highlights.log()</span>
            <ul className="edition-hl-list">
              {ed.highlights.map((h, i) => (
                <li key={i} className="edition-hl-item">
                  <span className="edition-hl-dot">▸</span> {h}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Web Team Card ─────────────────────────────────────
function WebCard({ member, idx }: { member: WebMember; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`web-card ${hovered ? "web-card-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* top accent line */}
      <div className="web-card-accent" />

      {/* id */}
      <div className="web-card-id">[{String(idx + 1).padStart(2, "0")}]</div>

      {/* photo */}
      <div className="web-card-img-wrap">
        <img src={member.img} alt={member.name} className="web-card-img" />
        <div className="web-card-overlay" />
        {/* corner brackets */}
        <div className="web-card-corner web-card-corner-tl" />
        <div className="web-card-corner web-card-corner-br" />
      </div>

      {/* info */}
      <div className="web-card-body">
        <p className="web-card-tag">// WEB.TEAM</p>
        <h3 className="web-card-name">{member.name}</h3>
        <p className="web-card-role">{member.role}</p>

        {/* stack chips */}
        {member.stack && (
          <div className="web-card-stack">
            {member.stack.map((s) => (
              <span key={s} className="web-card-chip">{s}</span>
            ))}
          </div>
        )}

        {/* links */}
        <div className={`web-card-links ${hovered ? "web-card-links-visible" : ""}`}>
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="web-card-link">
              ⎔ GitHub
            </a>
          )}
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="web-card-link web-card-link-cyan">
            ▶ LinkedIn
          </a>
        </div>
      </div>
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────
export default function AboutPage() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    const onResize = () => {
      if (window.innerWidth > 900) setMobileOpen(false);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  const { displayed: bootLine } = useTypingEffect(
    "Initializing SCSE.archive() → Loading member database... OK",
    30,
    300
  );
  const { ref: aboutRef, inView: aboutIn } = useInView();
  const { ref: profRef,  inView: profIn  } = useInView();
  const { ref: coreRef,  inView: coreIn  } = useInView();
  const { ref: memRef,   inView: memIn   } = useInView();
  const { ref: edRef,    inView: edIn    } = useInView();
  const { ref: webRef,   inView: webIn   } = useInView();

  return (
    <>
      {/* ── Global styles (matching main page aesthetic) ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Share+Tech+Mono&display=swap');

        :root {
          --cyan:   #00f5ff;
          --pink:   #ff0080;
          --purple: #bf00ff;
          --yellow: #ffe600;
          --bg:     #000314;
          --card-bg: rgba(0,3,20,0.85);
        }

        .about-page {
          background:
            linear-gradient(rgba(0, 3, 20, 0.72), rgba(0, 3, 20, 0.62)),
            url('/aboutus.jpg') center/cover no-repeat fixed;
          min-height: 100vh;
          color: #e0e8ff;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Navbar (same style as home) ── */
        .nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 100;
          height: 74px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          background: rgba(0, 2, 18, 0.38);
          backdrop-filter: blur(8px);
          border-bottom: 1px solid rgba(0,245,255,0.08);
          transition: all 0.25s ease;
        }
        .nav.nav-scrolled {
          background: rgba(0, 2, 18, 0.75);
          border-bottom-color: rgba(0,245,255,0.16);
        }
        .logo {
          text-decoration: none;
          color: #fff;
          font-family: 'Orbitron', monospace;
          font-size: 1.05rem;
          letter-spacing: 1px;
          font-weight: 700;
        }
        .logo:hover { color: #00f5ff; }
        .nav-links {
          list-style: none;
          display: flex;
          gap: 1.15rem;
          margin: 0;
          padding: 0;
        }
        .nav-links a {
          color: rgba(220,230,255,0.9);
          text-decoration: none;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          letter-spacing: 1.6px;
          transition: color 0.2s ease;
        }
        .nav-links a:hover { color: #00f5ff; }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 0.65rem;
        }
        .nav-cta {
          text-decoration: none;
          font-family: 'Orbitron', monospace;
          font-size: 0.58rem;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          padding: 8px 13px;
          border: 1px solid rgba(0,245,255,0.3);
          color: #00f5ff;
          transition: all 0.2s ease;
        }
        .nav-cta:hover {
          border-color: #00f5ff;
          color: #fff;
          box-shadow: 0 0 12px rgba(0,245,255,0.2);
        }
        .nav-cta-register {
          background: #00f5ff;
          color: #000;
          border-color: #00f5ff;
        }
        .nav-cta-register:hover {
          color: #000;
          background: #66fbff;
          box-shadow: 0 0 16px rgba(0,245,255,0.4);
        }
        .hamburger {
          display: none;
          width: 38px;
          height: 34px;
          background: transparent;
          border: 1px solid rgba(0,245,255,0.22);
          cursor: pointer;
          align-items: center;
          justify-content: center;
          flex-direction: column;
          gap: 5px;
        }
        .hamburger span {
          width: 18px;
          height: 1.5px;
          background: #00f5ff;
          transition: transform 0.2s ease, opacity 0.2s ease;
        }
        .hamburger-open span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
        .hamburger-open span:nth-child(2) { opacity: 0; }
        .hamburger-open span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
        .mobile-nav {
          position: fixed;
          top: 74px;
          right: 0;
          width: min(88vw, 340px);
          height: calc(100vh - 74px);
          z-index: 110;
          background: rgba(0, 3, 20, 0.96);
          border-left: 1px solid rgba(0,245,255,0.15);
          transform: translateX(100%);
          transition: transform 0.24s ease;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          overflow-y: auto;
        }
        .mobile-nav-open { transform: translateX(0); }
        .mob-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.6rem;
          text-decoration: none;
          color: rgba(220,230,255,0.9);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          letter-spacing: 1px;
          padding: 0.78rem 0.8rem;
          border: 1px solid rgba(0,245,255,0.12);
          background: rgba(0,245,255,0.02);
        }
        .mob-link:hover { color: #00f5ff; border-color: rgba(0,245,255,0.35); }
        .mob-link-icon { color: #00f5ff; margin-right: auto; }
        .mob-link-arr { color: rgba(180,200,255,0.5); }
        .mob-cta {
          margin-top: 0.6rem;
          text-decoration: none;
          font-family: 'Orbitron', monospace;
          font-size: 0.66rem;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #000;
          background: #00f5ff;
          border: 1px solid #00f5ff;
          padding: 0.85rem 0.9rem;
          text-align: center;
        }
        .mob-backdrop {
          position: fixed;
          inset: 74px 0 0 0;
          z-index: 105;
          background: rgba(0,0,0,0.45);
        }

        /* ── scanlines + grid bg ── */
        .about-page::before {
          content: '';
          position: fixed;
          inset: 0;
          background-image:
            linear-gradient(rgba(0,245,255,0.025) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.025) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
          z-index: 0;
        }
        .about-page::after {
          content: '';
          position: fixed;
          inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── BOOT HEADER ── */
        .about-hero {
          position: relative;
          z-index: 1;
          padding: 140px 5rem 80px;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: linear-gradient(180deg, rgba(0,3,20,0.9) 0%, transparent 100%);
        }
        .about-boot-bar {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          letter-spacing: 2px;
          color: rgba(0,245,255,0.4);
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .about-boot-dot {
          width: 6px; height: 6px;
          border-radius: 50%;
          background: var(--cyan);
          box-shadow: 0 0 8px var(--cyan);
          animation: ab-pulse 1.5s ease infinite;
        }
        @keyframes ab-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }
        .about-boot-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          color: rgba(0,245,255,0.5);
          min-height: 1.2em;
        }
        .about-boot-cursor {
          display: inline-block;
          width: 8px; height: 14px;
          background: var(--cyan);
          margin-left: 2px;
          animation: ab-blink 1s step-start infinite;
          vertical-align: middle;
        }
        @keyframes ab-blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

        .about-hero-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(2.2rem, 5vw, 4rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: 4px;
          text-transform: uppercase;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .about-hero-title span {
          color: var(--cyan);
          text-shadow: 0 0 30px rgba(0,245,255,0.6);
        }
        .about-hero-sub {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: rgba(180,200,255,0.5);
          letter-spacing: 3px;
          margin-bottom: 2.5rem;
        }
        .about-hero-tags {
          display: flex;
          gap: 1rem;
          flex-wrap: wrap;
        }
        .about-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 3px;
          padding: 5px 14px;
          border: 1px solid rgba(0,245,255,0.25);
          color: var(--cyan);
          background: rgba(0,245,255,0.04);
        }
        .about-tag-pink {
          border-color: rgba(255,0,128,0.3);
          color: var(--pink);
          background: rgba(255,0,128,0.04);
        }
        .about-tag-purple {
          border-color: rgba(191,0,255,0.3);
          color: var(--purple);
          background: rgba(191,0,255,0.04);
        }

        /* ── SECTIONS ── */
        .about-section {
          position: relative;
          z-index: 1;
          padding: 90px 5rem;
          border-bottom: 1px solid rgba(0,245,255,0.06);
        }
        .about-section-alt {
          background: rgba(0,245,255,0.015);
        }

        /* ── SECTION HEADER ── */
        .sec-header { margin-bottom: 3.5rem; }
        .sec-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.7rem;
          letter-spacing: 4px;
          color: var(--pink);
          display: block;
          margin-bottom: 0.6rem;
        }
        .sec-title {
          font-family: 'Orbitron', monospace;
          font-size: clamp(1.4rem, 3vw, 2rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .sec-line {
          height: 1px;
          width: 80px;
          background: linear-gradient(90deg, var(--cyan), transparent);
          box-shadow: 0 0 8px var(--cyan);
        }

        /* ── ABOUT SCSE BLOCK ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .about-grid.in-view {
          opacity: 1;
          transform: translateY(0);
        }
        .about-terminal {
          border: 1px solid rgba(0,245,255,0.2);
          background: var(--card-bg);
          position: relative;
          overflow: hidden;
        }
        .about-terminal::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
        }
        .about-term-bar {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.75rem 1.2rem;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,245,255,0.03);
        }
        .term-dots { display: flex; gap: 5px; }
        .term-dots span { width: 9px; height: 9px; border-radius: 50%; }
        .term-dots span:nth-child(1) { background:#ff5f57; box-shadow:0 0 5px #ff5f57; }
        .term-dots span:nth-child(2) { background:#febc2e; box-shadow:0 0 5px #febc2e; }
        .term-dots span:nth-child(3) { background:#28c840; box-shadow:0 0 5px #28c840; }
        .term-title {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          color: rgba(0,245,255,0.4);
          letter-spacing: 1px;
          flex: 1;
        }
        .about-term-body {
          padding: 1.8rem;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          color: rgba(180,200,255,0.7);
          line-height: 1.9;
        }
        .about-term-line { margin-bottom: 0.4rem; }
        .about-term-line .kw { color: var(--cyan); }
        .about-term-line .str { color: var(--yellow); }
        .about-term-line .cm { color: rgba(0,245,255,0.35); }

        .about-xavenir-block { display: flex; flex-direction: column; gap: 1.5rem; }
        .xav-title {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: 900;
          color: var(--cyan);
          letter-spacing: 3px;
          text-shadow: 0 0 20px rgba(0,245,255,0.4);
        }
        .xav-text {
          font-size: 0.92rem;
          color: rgba(180,200,255,0.7);
          line-height: 1.85;
        }
        .xav-text strong { color: #e0e8ff; font-weight: 600; }
        .xav-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-family: 'Orbitron', monospace;
          font-size: 0.65rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          text-decoration: none;
          padding: 10px 22px;
          border: 1px solid var(--cyan);
          color: #000;
          background: var(--cyan);
          clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px));
          transition: all 0.25s;
          align-self: flex-start;
          margin-top: 0.5rem;
        }
        .xav-btn:hover {
          background: var(--pink);
          border-color: var(--pink);
          box-shadow: 0 0 20px var(--pink);
        }

        /* ── PROFESSORS ── */
        .prof-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .prof-grid.in-view { opacity: 1; transform: translateY(0); }

        .prof-card {
          border: 1px solid rgba(0,245,255,0.15);
          background: var(--card-bg);
          padding: 2rem 1.5rem;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 1.2rem;
          position: relative;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .prof-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          opacity: 0;
          transition: opacity 0.3s;
        }
        .prof-card:hover { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 30px rgba(0,245,255,0.08); }
        .prof-card:hover::before { opacity: 1; }

        .prof-img-wrap {
          position: relative;
          width: 110px; height: 110px;
        }
        .prof-img-border {
          position: absolute;
          inset: -3px;
          border: 1px solid rgba(0,245,255,0.4);
          clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
        }
        .prof-img {
          width: 110px; height: 110px;
          object-fit: cover;
          object-position: top;
          clip-path: polygon(15px 0, 100% 0, 100% calc(100% - 15px), calc(100% - 15px) 100%, 0 100%, 0 15px);
          filter: grayscale(20%) brightness(0.9);
          transition: filter 0.3s;
        }
        .prof-card:hover .prof-img { filter: grayscale(0%) brightness(1.05); }
        .prof-scan {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          animation: scan 3s linear infinite;
          opacity: 0.6;
        }
        @keyframes scan { 0%{top:0;} 100%{top:100%;} }

        .prof-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 2px;
          color: var(--pink);
        }
        .prof-name {
          font-family: 'Orbitron', monospace;
          font-size: 0.85rem;
          font-weight: 700;
          color: #e0e8ff;
          letter-spacing: 1px;
        }
        .prof-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          color: var(--cyan);
          letter-spacing: 2px;
        }

        /* ── CORE TEAM ── */
        .core-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2.5rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .core-grid.in-view { opacity: 1; transform: translateY(0); }

        .core-card {
          border: 1px solid rgba(0,245,255,0.2);
          background: var(--card-bg);
          overflow: hidden;
          position: relative;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .core-card::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--pink), var(--purple));
        }
        .core-card:hover {
          border-color: rgba(0,245,255,0.45);
          box-shadow: 0 0 40px rgba(0,245,255,0.1);
        }

        .core-img-wrap {
          position: relative;
          height: 240px;
          overflow: hidden;
        }
        .core-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top;
          filter: grayscale(15%) brightness(0.85);
          transition: filter 0.4s, transform 0.4s;
        }
        .core-card:hover .core-img { filter: grayscale(0%) brightness(1); transform: scale(1.04); }
        .core-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 60%;
          background: linear-gradient(transparent, var(--card-bg));
        }
        .core-corner {
          position: absolute;
          width: 14px; height: 14px;
          z-index: 2;
        }
        .core-corner.tl {
          top: 8px; left: 8px;
          border-top: 2px solid var(--cyan);
          border-left: 2px solid var(--cyan);
          box-shadow: -2px -2px 8px var(--cyan);
        }
        .core-corner.br {
          bottom: 8px; right: 8px;
          border-bottom: 2px solid var(--pink);
          border-right: 2px solid var(--pink);
          box-shadow: 2px 2px 8px var(--pink);
        }

        .core-info {
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }
        .core-id {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: var(--pink);
        }
        .core-name {
          font-family: 'Orbitron', monospace;
          font-size: 0.95rem;
          font-weight: 700;
          color: #e0e8ff;
          letter-spacing: 1px;
        }
        .core-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.72rem;
          color: var(--cyan);
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 0.8rem;
        }
        .core-contacts { display: flex; flex-direction: column; gap: 0.45rem; }
        .core-contact-link {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.68rem;
          color: rgba(180,200,255,0.55);
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: color 0.2s;
        }
        .core-contact-link:hover { color: var(--cyan); }
        .core-contact-icon { color: var(--cyan); font-size: 0.65rem; }
        .core-linkedin {
          font-family: 'Orbitron', monospace;
          font-size: 0.6rem;
          letter-spacing: 2px;
          color: var(--cyan);
          text-decoration: none;
          margin-top: 0.5rem;
          transition: color 0.2s, text-shadow 0.2s;
        }
        .core-linkedin:hover { color: var(--pink); text-shadow: 0 0 10px var(--pink); }

        /* ── MEMBERS ── */
        .mem-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .mem-grid.in-view { opacity: 1; transform: translateY(0); }

        .mem-card {
          border: 1px solid rgba(0,245,255,0.1);
          background: var(--card-bg);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .mem-card:hover, .mem-card-hovered {
          border-color: rgba(0,245,255,0.35);
          box-shadow: 0 0 24px rgba(0,245,255,0.08);
          transform: translateY(-4px);
        }
        .mem-id-tag {
          position: absolute;
          top: 8px; left: 8px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          color: var(--cyan);
          background: rgba(0,3,20,0.8);
          padding: 2px 6px;
          z-index: 2;
          letter-spacing: 1px;
        }
        .mem-img-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .mem-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top;
          filter: grayscale(20%) brightness(0.85);
          transition: filter 0.3s, transform 0.3s;
        }
        .mem-card:hover .mem-img { filter: grayscale(0%) brightness(1); transform: scale(1.05); }
        .mem-img-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 50%;
          background: linear-gradient(transparent, var(--card-bg));
        }
        .mem-info {
          padding: 0.9rem 1rem;
        }
        .mem-name {
          font-family: 'Orbitron', monospace;
          font-size: 0.72rem;
          font-weight: 700;
          color: #e0e8ff;
          letter-spacing: 1px;
          margin-bottom: 0.3rem;
        }
        .mem-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: var(--cyan);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin-bottom: 0.5rem;
        }
        .mem-details {
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .mem-details-visible { max-height: 80px; }
        .mem-detail-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(180,200,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .mem-detail-item:hover { color: var(--cyan); }
        .mem-detail-linkedin {
          font-family: 'Orbitron', monospace;
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: var(--cyan);
          text-decoration: none;
          transition: color 0.2s;
        }
        .mem-detail-linkedin:hover { color: var(--pink); }

        /* ── EDITIONS / ARCHIVE ── */
        .edition-list {
          display: flex;
          flex-direction: column;
          gap: 1px;
          border: 1px solid rgba(0,245,255,0.15);
          background: rgba(0,245,255,0.03);
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .edition-list.in-view { opacity: 1; transform: translateY(0); }

        .edition-card {
          border-bottom: 1px solid rgba(0,245,255,0.08);
          position: relative;
          overflow: hidden;
          transition: background 0.2s;
        }
        .edition-card:last-child { border-bottom: none; }
        .edition-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 2px;
          background: linear-gradient(180deg, var(--cyan), var(--pink));
          opacity: 0;
          transition: opacity 0.3s;
        }
        .edition-card:hover::before,
        .edition-active::before { opacity: 1; }
        .edition-active { background: rgba(0,245,255,0.03); }

        .edition-header {
          display: flex;
          align-items: center;
          gap: 2rem;
          padding: 1.4rem 1.8rem;
          cursor: pointer;
          transition: background 0.2s;
        }
        .edition-header:hover { background: rgba(0,245,255,0.03); }

        .edition-year-wrap { display: flex; flex-direction: column; gap: 0.2rem; min-width: 140px; }
        .edition-node {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: rgba(0,245,255,0.3);
          letter-spacing: 2px;
        }
        .edition-year {
          font-family: 'Orbitron', monospace;
          font-size: 1.1rem;
          font-weight: 900;
          color: #e0e8ff;
          letter-spacing: 3px;
        }
        .edition-active .edition-year { color: var(--cyan); text-shadow: 0 0 14px rgba(0,245,255,0.5); }

        .edition-meta { display: flex; flex-direction: column; gap: 0.3rem; flex: 1; }
        .edition-theme {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          color: rgba(180,200,255,0.6);
          letter-spacing: 1px;
        }
        .edition-status {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          letter-spacing: 3px;
          color: rgba(180,200,255,0.3);
          text-transform: uppercase;
        }
        .edition-status-active {
          color: #00ff88;
          animation: ab-pulse 1.5s ease infinite;
        }

        .edition-chevron {
          font-size: 0.65rem;
          color: rgba(0,245,255,0.35);
          min-width: 14px;
        }

        .edition-body {
          padding: 1.5rem 1.8rem 2rem 1.8rem;
          border-top: 1px solid rgba(0,245,255,0.07);
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          animation: slide-down 0.35s ease;
        }
        @keyframes slide-down { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }

        .edition-stats-row {
          display: flex;
          gap: 3rem;
          padding-bottom: 1.2rem;
          border-bottom: 1px solid rgba(0,245,255,0.07);
        }
        .edition-stat { display: flex; flex-direction: column; gap: 0.3rem; }
        .edition-stat-val {
          font-family: 'Orbitron', monospace;
          font-size: 1.3rem;
          font-weight: 900;
          color: var(--yellow);
          text-shadow: 0 0 12px rgba(255,230,0,0.4);
        }
        .edition-stat-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.58rem;
          letter-spacing: 3px;
          color: rgba(180,200,255,0.35);
          text-transform: uppercase;
        }

        .edition-hl-label {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 3px;
          color: var(--pink);
          display: block;
          margin-bottom: 0.8rem;
        }
        .edition-hl-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.5rem; }
        .edition-hl-item {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.78rem;
          color: rgba(180,200,255,0.65);
          display: flex;
          align-items: center;
          gap: 0.6rem;
        }
        .edition-hl-dot { color: var(--cyan); font-size: 0.65rem; }

        /* ── ARCHIVE TERMINAL WRAPPER ── */
        .archive-terminal {
          border: 1px solid rgba(0,245,255,0.18);
          background: var(--card-bg);
          position: relative;
          overflow: hidden;
          margin-top: 2.5rem;
        }
        .archive-terminal::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--cyan), var(--pink), var(--purple), transparent);
        }
        .archive-term-bar {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.85rem 1.5rem;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,245,255,0.03);
        }
        .archive-term-count {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.62rem;
          letter-spacing: 2px;
          color: rgba(0,245,255,0.35);
          margin-left: auto;
        }
        .archive-prompt {
          display: flex;
          align-items: center;
          gap: 0.8rem;
          padding: 0.9rem 1.5rem;
          border-top: 1px solid rgba(0,245,255,0.08);
          background: rgba(0,245,255,0.02);
        }
        .archive-prompt-sym {
          color: var(--cyan);
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.85rem;
          animation: ab-blink 1.2s step-start infinite;
        }
        .archive-prompt-text {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: rgba(0,245,255,0.25);
        }

        /* ── WEB TEAM ── */
        .web-terminal {
          border: 1px solid rgba(0,245,255,0.18);
          background: var(--card-bg);
          position: relative;
          overflow: hidden;
          margin-top: 2.5rem;
        }
        .web-terminal::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, var(--cyan), var(--purple), var(--pink), transparent);
        }

        .web-grid {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 1.5rem;
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .web-grid.in-view { opacity: 1; transform: translateY(0); }

        .web-card {
          border: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,2,15,0.9);
          overflow: hidden;
          position: relative;
          cursor: pointer;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .web-card:hover, .web-card-hovered {
          border-color: rgba(0,245,255,0.45);
          box-shadow: 0 0 28px rgba(0,245,255,0.1), 0 0 60px rgba(191,0,255,0.06);
          transform: translateY(-6px);
        }
        .web-card-accent {
          height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--purple));
          width: 0;
          transition: width 0.4s ease;
        }
        .web-card:hover .web-card-accent { width: 100%; }

        .web-card-id {
          position: absolute;
          top: 12px; right: 10px;
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          color: rgba(0,245,255,0.35);
          letter-spacing: 1px;
          z-index: 3;
        }

        .web-card-img-wrap {
          position: relative;
          height: 160px;
          overflow: hidden;
        }
        .web-card-img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: top;
          filter: grayscale(30%) brightness(0.8);
          transition: filter 0.4s, transform 0.4s;
        }
        .web-card:hover .web-card-img {
          filter: grayscale(0%) brightness(1.05);
          transform: scale(1.06);
        }
        .web-card-overlay {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 55%;
          background: linear-gradient(transparent, rgba(0,2,15,0.95));
        }
        .web-card-corner {
          position: absolute;
          width: 12px; height: 12px;
          z-index: 2;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .web-card:hover .web-card-corner { opacity: 1; }
        .web-card-corner-tl {
          top: 8px; left: 8px;
          border-top: 1.5px solid var(--cyan);
          border-left: 1.5px solid var(--cyan);
          box-shadow: -1px -1px 6px var(--cyan);
        }
        .web-card-corner-br {
          bottom: 8px; right: 8px;
          border-bottom: 1.5px solid var(--purple);
          border-right: 1.5px solid var(--purple);
          box-shadow: 1px 1px 6px var(--purple);
        }

        .web-card-body {
          padding: 0.9rem 1rem 1.1rem;
          display: flex;
          flex-direction: column;
          gap: 0.3rem;
        }
        .web-card-tag {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.55rem;
          letter-spacing: 2px;
          color: var(--purple);
          margin: 0;
        }
        .web-card-name {
          font-family: 'Orbitron', monospace;
          font-size: 0.7rem;
          font-weight: 700;
          color: #e0e8ff;
          letter-spacing: 1px;
          margin: 0;
        }
        .web-card-role {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.6rem;
          color: var(--cyan);
          letter-spacing: 2px;
          text-transform: uppercase;
          margin: 0 0 0.4rem;
        }

        .web-card-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.35rem;
          margin-bottom: 0.5rem;
        }
        .web-card-chip {
          font-family: 'Share Tech Mono', monospace;
          font-size: 0.52rem;
          letter-spacing: 1px;
          padding: 2px 7px;
          border: 1px solid rgba(191,0,255,0.3);
          color: var(--purple);
          background: rgba(191,0,255,0.05);
        }

        .web-card-links {
          display: flex;
          gap: 0.7rem;
          flex-wrap: wrap;
          max-height: 0;
          overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .web-card-links-visible { max-height: 60px; }

        .web-card-link {
          font-family: 'Orbitron', monospace;
          font-size: 0.55rem;
          letter-spacing: 1px;
          color: rgba(180,200,255,0.5);
          text-decoration: none;
          transition: color 0.2s;
        }
        .web-card-link:hover { color: #e0e8ff; }
        .web-card-link-cyan { color: var(--cyan); }
        .web-card-link-cyan:hover { color: var(--pink); text-shadow: 0 0 8px var(--pink); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .mem-grid { grid-template-columns: repeat(4, 1fr); }
          .web-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 900px) {
          .nav { padding: 0 1rem; }
          .nav-links { display: none; }
          .nav-cta { display: none; }
          .hamburger { display: inline-flex; }
          .about-hero { padding: 120px 2rem 60px; }
          .about-section { padding: 60px 2rem; }
          .about-grid { grid-template-columns: 1fr; gap: 2rem; }
          .prof-grid { grid-template-columns: 1fr 1fr 1fr; gap: 1.2rem; }
          .core-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .mem-grid { grid-template-columns: repeat(3, 1fr); }
          .web-grid { grid-template-columns: repeat(3, 1fr); }
          .edition-stats-row { gap: 1.5rem; }
        }
        @media (max-width: 600px) {
          .prof-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .core-grid { grid-template-columns: 1fr; }
          .mem-grid { grid-template-columns: repeat(2, 1fr); }
          .web-grid { grid-template-columns: repeat(2, 1fr); }
          .edition-header { flex-wrap: wrap; gap: 1rem; padding: 1rem; }
          .edition-stats-row { flex-wrap: wrap; gap: 1.2rem; }
        }
      `}</style>

      <div className="about-page">
        <nav className={`nav ${scrolled ? "nav-scrolled" : ""}`}>
          <Link href="/" className="logo">&lt;/SCSE&gt;</Link>
          <ul className="nav-links">
            <li><a href="/#hero">Home</a></li>
            <li><a href="/#about">About</a></li>
            <li><a href="/#events">Events</a></li>
            <li><a href="/#contact">Contact</a></li>
            <li><a href="/gallery">Gallery</a></li>
            <li><a href="/sponsors">Sponsors</a></li>
          </ul>
          <div className="nav-right">
            <Link href="/register" className="nav-cta nav-cta-register">Register</Link>
            <Link href="/login" className="nav-cta">Login</Link>
            <button
              className={`hamburger ${mobileOpen ? "hamburger-open" : ""}`}
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
            >
              <span /><span /><span />
            </button>
          </div>
        </nav>

        <div className={`mobile-nav ${mobileOpen ? "mobile-nav-open" : ""}`}>
          {[
            ["/#hero", "Home"],
            ["/#about", "About"],
            ["/#events", "Events"],
            ["/#contact", "Contact"],
            ["/gallery", "Gallery"],
            ["/sponsors", "Sponsors"],
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
          <Link href="/dashboard" className="mob-cta" onClick={() => setMobileOpen(false)}>
            ▶ &nbsp;DASHBOARD
          </Link>
        </div>
        {mobileOpen && <div className="mob-backdrop" onClick={() => setMobileOpen(false)} />}

        {/* ── HERO ── */}
        <section className="about-hero">
          <div className="about-boot-bar">
            <div className="about-boot-dot" />
            <span>SCSE.SYS // ARCHIVE MODULE // NIT JAMSHEDPUR</span>
          </div>
          <div className="about-boot-text">
            {bootLine}
            <span className="about-boot-cursor" />
          </div>
          <div style={{ marginTop: "2rem" }}>
            <h1 className="about-hero-title">
              SCSE <span>Archives</span>
            </h1>
            <p className="about-hero-sub">
              // WHO_WE_ARE · OUR_TEAM · XAVENIR_HISTORY
            </p>
            <div className="about-hero-tags">
              <span className="about-tag">// NIT JAMSHEDPUR</span>
              <span className="about-tag-pink">// CSE DEPARTMENT</span>
              <span className="about-tag-purple">// EST. 2023</span>
            </div>
          </div>
        </section>

        {/* ── ABOUT SCSE + XAVENIR ── */}
        <section className="about-section">
          <SectionHeader label="sys.info()" title="Who Are We?" />
          <div
            ref={aboutRef}
            className={`about-grid ${aboutIn ? "in-view" : ""}`}
          >
            {/* Terminal block */}
            <div className="about-terminal">
              <div className="about-term-bar">
                <div className="term-dots">
                  <span /><span /><span />
                </div>
                <span className="term-title">scse@nitjsr:~/about$ cat README.md</span>
              </div>
              <div className="about-term-body">
                <p className="about-term-line"><span className="cm">// SCSE — Society of Computer Science & Engineering</span></p>
                <p className="about-term-line" style={{ marginTop: "1rem" }}>
                  <span className="kw">const</span> <span className="str">mission</span> = {`{`}
                </p>
                <p className="about-term-line" style={{ paddingLeft: "1.5rem" }}>
                  <span className="str">innovation</span>: <span className="kw">true</span>,
                </p>
                <p className="about-term-line" style={{ paddingLeft: "1.5rem" }}>
                  <span className="str">excellence</span>: <span className="kw">true</span>,
                </p>
                <p className="about-term-line" style={{ paddingLeft: "1.5rem" }}>
                  <span className="str">collaboration</span>: <span className="kw">true</span>,
                </p>
                <p className="about-term-line">{`}`};</p>
                <p className="about-term-line" style={{ marginTop: "1rem", color: "rgba(180,200,255,0.7)", fontFamily: "inherit", fontSize: "0.82rem", lineHeight: "1.85" }}>
                  A vibrant community of tech enthusiasts, innovators,
                  and learners at NIT Jamshedpur. We operate at the
                  intersection of code and creativity.
                </p>
                <p className="about-term-line" style={{ marginTop: "1rem", color: "rgba(180,200,255,0.7)", fontFamily: "inherit", fontSize: "0.82rem", lineHeight: "1.85" }}>
                  We foster <span className="kw">knowledge-sharing</span>,{" "}
                  <span className="kw">problem-solving</span>, and{" "}
                  <span className="kw">relentless innovation</span> —
                  shaping the architects of tomorrow's technology landscape.
                </p>
                <p className="about-term-line" style={{ marginTop: "1rem" }}>
                  <span className="cm">// events: hackathons | coding contests | workshops | tech talks</span>
                </p>
              </div>
            </div>

            {/* Xavenir block */}
            <div className="about-xavenir-block">
              <span className="sec-label">// fest.info()</span>
              <h3 className="xav-title">▶ About Xavenir</h3>
              <p className="xav-text">
                Xavenir is the <strong>premier tech fest</strong> of the CSE Department at NIT Jamshedpur,
                designed to bring together the brightest tech minds from across the country.
              </p>
              <p className="xav-text">
                It is a fusion of <strong>coding, innovation, AI, cybersecurity, and gaming</strong>.
                Xavenir is the perfect platform to showcase your skills, learn from industry experts,
                and compete for exciting prizes.
              </p>
              <p className="xav-text">
                Whether you are a <strong>coder, designer, entrepreneur, or tech geek</strong>,
                this fest is for YOU! Connect with like-minded enthusiasts and recruiters,
                and attend workshops and guest talks from top industry professionals.
              </p>
              <a
                href="/SCSE_brochure.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="xav-btn"
              >
                ▶ View Brochure
              </a>
            </div>
          </div>
        </section>

        {/* ── PROFESSORS ── */}
        <section className="about-section about-section-alt">
          <SectionHeader label="faculty.load()" title="Deemed Professors" />
          <div
            ref={profRef}
            className={`prof-grid ${profIn ? "in-view" : ""}`}
          >
            {PROFESSORS.map((p) => (
              <ProfCard key={p.name} prof={p} />
            ))}
          </div>
        </section>

        {/* ── CORE TEAM ── */}
        <section className="about-section">
          <SectionHeader label="core.team()" title="Core Team" />
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.78rem",
            color: "rgba(180,200,255,0.45)",
            letterSpacing: "1px",
            marginBottom: "2.5rem",
            lineHeight: "1.8",
          }}>
            // The backbone of SCSE — leaders driving innovation and excellence. From steering creative
            ideas to managing tech innovations, PR strategies, and corporate outreach.
          </p>
          <div
            ref={coreRef}
            className={`core-grid ${coreIn ? "in-view" : ""}`}
          >
            {CORE_TEAM.map((m) => (
              <CoreCard key={m.name} member={m} />
            ))}
          </div>
        </section>

        {/* ── MEMBERS ── */}
        <section className="about-section about-section-alt">
          <SectionHeader label="members.list()" title="Our Members" />
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.78rem",
            color: "rgba(180,200,255,0.45)",
            letterSpacing: "1px",
            marginBottom: "2.5rem",
            lineHeight: "1.8",
          }}>
            // The vibrant force behind SCSE — passionate team members from budding developers to
            creative minds and strategic thinkers. {MEMBERS.length} PROCESSES LOADED.
          </p>
          <div
            ref={memRef}
            className={`mem-grid ${memIn ? "in-view" : ""}`}
          >
            {MEMBERS.map((m, i) => (
              <MemberCard key={m.name} member={m} idx={i} />
            ))}
          </div>
        </section>

        {/* ── XAVENIR ARCHIVES / EDITIONS ── */}
        <section className="about-section">
          <SectionHeader label="archive.render()" title="Xavenir Archives" />
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.78rem",
            color: "rgba(180,200,255,0.45)",
            letterSpacing: "1px",
            marginBottom: "0",
            lineHeight: "1.8",
          }}>
            // A history of every Xavenir edition — click any node to expand.
          </p>

          <div className="archive-terminal">
            <div className="archive-term-bar">
              <div className="term-dots"><span /><span /><span /></div>
              <span className="term-title" style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: "0.65rem", color: "rgba(0,245,255,0.4)", flex: 1 }}>
                xavenir@nitjsr:~/archives$ ls -la
              </span>
              <span className="archive-term-count">
                {EDITIONS.length} EDITIONS FOUND
              </span>
            </div>

            <div
              ref={edRef}
              className={`edition-list ${edIn ? "in-view" : ""}`}
              style={{ border: "none", margin: 0 }}
            >
              {EDITIONS.map((ed, i) => (
                <EditionCard key={ed.year} ed={ed} idx={i} />
              ))}
            </div>

            <div className="archive-prompt">
              <span className="archive-prompt-sym">❯</span>
              <span className="archive-prompt-text">
                select an edition to expand archive log_
              </span>
            </div>
          </div>
        </section>

        {/* ── WEB TEAM ── */}
        <section className="about-section">
          <SectionHeader label="web.team()" title="Web Team" />
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.78rem",
            color: "rgba(180,200,255,0.45)",
            letterSpacing: "1px",
            marginBottom: "2.5rem",
            lineHeight: "1.8",
          }}>
            // The engineers behind scse-xavenir.vercel.app — built with Next.js, TypeScript &amp; passion.
            &nbsp;{WEB_TEAM.length} DEVS ONLINE.
          </p>

          {/* Terminal wrapper */}
          <div className="web-terminal">
            <div className="archive-term-bar">
              <div className="term-dots"><span /><span /><span /></div>
              <span style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: "0.65rem",
                color: "rgba(0,245,255,0.4)",
                flex: 1,
                letterSpacing: "1px",
              }}>
                web@scse:~/xavenir$ git log --oneline --authors
              </span>
              <span className="archive-term-count">
                {WEB_TEAM.length} CONTRIBUTORS
              </span>
            </div>

            <div style={{ padding: "2rem" }}>
              <div
                ref={webRef}
                className={`web-grid ${webIn ? "in-view" : ""}`}
              >
                {WEB_TEAM.map((m, i) => (
                  <WebCard key={m.name} member={m} idx={i} />
                ))}
              </div>
            </div>

            <div className="archive-prompt">
              <span className="archive-prompt-sym">❯</span>
              <span className="archive-prompt-text">
                npm run dev // xavenir '26 is live_
              </span>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{
          position: "relative",
          zIndex: 1,
          padding: "80px 5rem",
          background: "rgba(0,0,30,0.6)",
          borderTop: "1px solid rgba(0,245,255,0.08)",
          borderBottom: "1px solid rgba(0,245,255,0.08)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "1.5rem",
        }}>
          <span style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.68rem",
            letterSpacing: "4px",
            color: "var(--pink)",
          }}>
            // ready.to.compete()
          </span>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "clamp(1.6rem, 3vw, 2.5rem)",
            fontWeight: 900,
            color: "#fff",
            letterSpacing: "3px",
          }}>
            Code to the Future
          </h2>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.82rem",
            color: "rgba(180,200,255,0.5)",
            letterSpacing: "1px",
            maxWidth: "480px",
            lineHeight: "1.8",
          }}>
            Register now and be part of the biggest tech fest at NIT Jamshedpur.
          </p>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center" }}>
            <Link
              href="/register"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.65rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "12px 28px",
                border: "1px solid var(--cyan)",
                color: "#000",
                background: "var(--cyan)",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              ▶ Register Now
            </Link>
            <Link
              href="/#events"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                fontFamily: "'Orbitron', monospace",
                fontSize: "0.65rem",
                letterSpacing: "2px",
                textTransform: "uppercase",
                textDecoration: "none",
                padding: "12px 28px",
                border: "1px solid rgba(0,245,255,0.3)",
                color: "var(--cyan)",
                background: "transparent",
                clipPath: "polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px))",
              }}
            >
              ◆ View Events
            </Link>
          </div>
        </section>

      </div>
    </>
  );
}