"use client";

import { useEffect, useRef, useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";

// ── Types ──────────────────────────────────────────────
interface Professor { name: string; role: string; img: string; }
interface Member { name: string; role: string; img: string; phone: string; email: string; linkedin: string; }
interface Edition { year: string; theme: string; highlights: string[]; participants: string; events: string; prizePool: string; status: "ARCHIVED" | "ACTIVE"; }
interface WebMember { name: string; role: string; img: string; github?: string; linkedin: string; stack?: string[]; }

// ── Data ───────────────────────────────────────────────
const PROFESSORS: Professor[] = [
  { name: "Dr. Danish Ali Khan",  role: "Head of Department", img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774629413/h_gtptll.jpg" },
  { name: "Dr. Jitesh Pradhan",   role: "Prof. In-Charge",    img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774629413/j_cnec4m.jpg" },
  { name: "Dr. Deepak Rai", role: "Prof. In-Charge", img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774896826/Screenshot_2026-03-31_002317_x6lmqr.png" },
];

const CORE_TEAM: Member[] = [
    {
    name: "Abhishek kumar",
    role: "President",
    img: "/images/abhishek_sir.png",
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
    name: "Sujal Kumar",
    role: "Treasurer",
    img: "/images/IMG-20250720-WA0008~2 - Sujal Kumar.jpg",
    phone: "9693780078",
    email: "sujalpas62@gmail.com",
    linkedin: "https://www.linkedin.com/in/sujal-kumar-552a39237",
  },
  {
    name: "Roshni Kumari",
    role: "General Secretary",
    img: "/images/IMG_20260220_013432.jpg (1) - Roshni Kumari.jpeg",
    phone: "8709758581",
    email: "roshnikumari212004@gmail.com",
    linkedin: "https://www.linkedin.com/in/roshni-kumari-2aa61928a",
  },
  {
    name: "Aman Singh",
    role: "Joint Secretary",
    img: "/images/IMG_5241 - Aman Singh.jpg",
    phone: "+91 7348762674",
    email: "aman734876@gmail.com",
    linkedin: "https://www.linkedin.com/in/aman-singh-webdev",
  },
];

const MEMBERS: Member[] = [ 
   {
    name: "Tanishq Gupta",
    role: "Tech Head",
    img: "/images/WhatsApp Image 2026-03-24 at 18.42.47 - Tanishq Gupta.jpeg",
    phone: "6299354348",
    email: "2023ugcs074@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/tanishq-gupta-77237a282",
  },
  {
    name: "Harsh Raj",
    role: "Tech Head",
    img: "/images/IMG_20260108_004533 - Harsh Raj.jpg",
    phone: "9234661377",
    email: "rajharsh0204@gmail.com",
    linkedin: "https://www.linkedin.com/in/harsh-raj-9447812ba",
  },
  {
    name: "Aprajita",
    role: "Tech Head",
    img: "/images/IMG-20250615-WA0015 - Aprajita Thakur.jpg",
    phone: "9142765159",
    email: "aprajitathakur964@gmail.com",
    linkedin: "https://www.linkedin.com/in/aprajita-thakur-1317a1223",
  },

    {
    name: "Anurag Sharma ",
    role: "Tech Head",
    img: "/our-member-photo/Anurag sharma.jpeg",
    phone: "7263047411",
    email: "ojhavinay7602@gmail.com",
    
    linkedin: "https://www.linkedin.com/in/anurag-sharma-63xxx?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
  },
   {
    name: "Vinay Ojha",
    role: "Tech Head",
    img: "/images/1740010495918 - Vinay Ojha.jpeg",
    phone: "7263047411",
    email: "ojhavinay7602@gmail.com",
    linkedin: "https://www.linkedin.com/in/vinay-ojha-9910a831a",
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
    name: "Keshav Trivedi",
    role: "Web Head",
    img: "/our-member-photo/Keshav Trivedi.jpeg",
    phone: "9845920244",
    email: "2023ugcs120@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/keshav-trivedi-49283b275?utm_source=share_via&utm_content=profile&utm_medium=member_android",
  },
    
    {
    name: "Krrish Kumar",
    role: "Web Head",
    img: "/images/20230101_104901_Original - KRRISH KUMAR.jpeg",
    phone: "9110123553",
    email: "2024ugcs050@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/krrish-kumar-bb2aaa328",
  },
  {
    name: "Naveen Kushawaha",
    role: "Web Head",
    img: "/images/WhatsApp Image 2026-02-20 at 11.32.50 AM - Naveen Kushawaha.jpeg",
    phone: "9198511333",
    email: "naveenkushawaha2003@gmail.com",
    linkedin: "https://www.linkedin.com/in/naveen-kushawaha-310921212",
  },
 {
    name: "Vignesh Chaurasia",
    role: "App Head",
    img: "/our-member-photo/Vignesh Chaurasia.jpeg",
    phone: "9152657366",
    email: "vigneshchaurasia@gmail.com",
    linkedin: "http://www.linkedin.com/in/vignesh-chaurasia-nitjsr",
  },
  {
    name: "Ayush Verma",
    role: "App Head",
    img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774474434/WhatsApp_Image_2026-03-26_at_3.03.23_AM_yi25nd.jpg",
    phone: "8936081707",
    email: "ayush7610jsr@gmail.com",
    linkedin: "https://www.linkedin.com/in/ayush-verma-jsr25",
  },

    {
    name: "Nandini Rathod",
    role: "Creative Head",
    img: "/images/WhatsApp Image 2026-02-20 at 14.42.06 - Nandini Rathod.jpeg",
    phone: "8500721504",
    email: "2023ugcs079@gmail.com",
    linkedin: "https://www.linkedin.com/in/nandini-rathod-67080928a",
  },
  {
    name: "Shreehari Kalundia",
    role: "Creative Head",
    img: "/images/IMG_1376.JPG - Shreehari Kalundia.jpeg",
    phone: "7033558339",
    email: "kalundia7@gmail.com",
    linkedin: "https://www.linkedin.com/in/shreehari-kalundia-31a58a22a",
  },
  {
    name: "Akash Jaiswal",
    role: "CA Head",
    img: "/our-member-photo/Akash Jaiswal.jpeg",
    phone: "9572991083",
    email: "jaisakash9341@gmail.com",
    linkedin: "https://www.linkedin.com/in/akash-jaiswal-042305291",
  },

    {
    name: "Harsh Agarwal",
    role: "CA Head",
    img: "/images/WhatsApp Image 2026-03-24 at 5.09.42 PM - Harsh Agarwal.jpeg",
    phone: "7061960920",
    email: "2023ugcs097@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/harsh-agarwal-2a9922283",
  },
   {
    name: "Ankit Yadav",
    role: "CA Head",
    img: "/our-member-photo/Ankit Yadav.jpeg",
    phone: "7061960920",
    email: "2023ugcs097@nitjsr.ac.in",
    linkedin: "https://www.linkedin.com/in/ankit-yadav-691306259?utm_source=share_via&utm_content=profile&utm_medium=member_android",
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
    linkedin: "https://www.linkedin.com/in/srijan-swapnil-a2910827b",
  },
   {
    name: "Riya",
    role: "PR Head",
    img: "/images/IMG_20240922_225030_779 - Riya Rajput.jpg",
    phone: "6232681526",
    email: "rajputriya887@gmail.com",
    linkedin: "https://www.linkedin.com/in/riya-kachere-730b68151",
  },
   {
    name: "Siya",
    role: "PR Head",
    img: "/our-member-photo/siya.jpeg",
    phone: "6232681526",
    email: "rajputriya887@gmail.com",
    linkedin: "https://www.linkedin.com/in/siyaa?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app",
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
    name: "Aditya Prakash",
    role: "EM Head",
    img: "/images/IMG-20260217-WA0019_1 - ADITYA PRAKASH.jpg",
    phone: "9205120803",
    email: "adityaprakash91111@gmail.com",
    linkedin: "https://in.linkedin.com/in/aditya-prakash-985739327",
  },
  
  {
    name: "Anuj Kumar",
    role: "EM Head",
    img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774585360/sample_tl78ud.jpg",
    phone: "7858927896",
    email: "anujkumar@gmail.com",
    linkedin: "https://www.linkedin.com/in/anuj-kumar-14878b28a",
  },
  {
    name: "Sachin Kumar",
    role: "EM Head",
    img: "/images/DSC_0129 (1) - Sachin Kumar.JPG",
    phone: "8229860167",
    email: "sachinljk376@gmail.com",
    linkedin: "https://www.linkedin.com/in/sachin-kumar-206086265",
  },
 
  {
    name: "Udit pandey",
    role: "EM Head",
    img: "/our-member-photo/Udit Pandey.jpeg",
    phone: "8800699180",
    email: "uditpandey8800@gmail.com",
    linkedin: "https://www.linkedin.com/in/udit-pandey-351417328",
  },
];


// ── Replace these with real web team members ──────────
const WEB_TEAM: WebMember[] = [
  { name: "Ayush Verma",             role: "Web Lead",  img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774474434/WhatsApp_Image_2026-03-26_at_3.03.23_AM_yi25nd.jpg", github: "https://github.com/ayushv-nitj", linkedin: "https://www.linkedin.com/in/ayush-verma-jsr25" },
  { name: "Priyanshu Raj",           role: "Web Lead",  img: "/web-team-photo/IMG_20260326_022402 - Priyanshu Raj.jpg", github: "https://github.com/priyanshuraj-dev", linkedin: "https://www.linkedin.com/in/priyanshuraj-nitjsr/" },
  { name: "Yashita ",           role: "Web Team",  img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774812629/yashita_xnmoou.jpg", github: "https://github.com/yashita7002-hub", linkedin: "https://www.linkedin.com/in/yashita-07981b394" },
  { name: "Vivek Mishra",            role: "Web Team",  img: "/web-team-photo/WhatsApp Image 2026-03-26 -Vivek Mishra.jpeg", github: "https://github.com/vivekrtx-lang", linkedin: "https://www.linkedin.com/in/vivek-mishra-9735a3386" },
  { name: "Deeptanshu Singh Negi",   role: "Web Team",  img: "/web-team-photo/IMG-20260215-WA0048 - Deeptanshu Singh Negi.jpg", github: "https://github.com/deeptanshu-glitch", linkedin: "https://www.linkedin.com/in/deeptanshu-singh-negi" },
  { name: "Lakshay Sudhera",         role: "Web Team",  img: "/web-team-photo/profile - Lakshay Sudhera.jpeg", github: "https://github.com/lakshay-sudhera", linkedin: "https://www.linkedin.com/in/lakshay-kumar-sudhera-133b35389/" },
  { name: "Aditya Agrawal",          role: "Web Team",  img: "/web-team-photo/aditya photo - ADITYA AGARWAL.jpg", github: "https://github.com/AdityaAgarwal18122006", linkedin: "https://www.linkedin.com/in/aditya-agarwal-844493386" },
  { name: "Ayush Sarkar",            role: "Web Team",  img: "/web-team-photo/IMG_20260102_194028 - Ayush Sarkar.jpg", github: "https://github.com/ayushsarkar314", linkedin: "https://www.linkedin.com/in/ayush-sarkar-441b9a39b" },
  { name: "Darshita Maheshwari",     role: "Web Team",  img: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774629414/d_foqjqk.jpg", github: "https://github.com/darshita44", linkedin: "https://www.linkedin.com/in/darshita-maheshwari-836980383" },
    {name:  "Sumit Kapoor",            role: "Web Team",  img: "/web-team-photo/IMG_20260301_105017 - Sumit.jpg" , github:"https://github.com/Sumitkapoor129",    linkedin:"https://www.linkedin.com/in/sumitkapoor001"},
  {name:  "Harshit Sharma",          role: "Web Team",  img: "/web-team-photo/ Harshit Sharma.jpg" , github:"https://github.com/HarshitSharma-h8",    linkedin:"https://www.linkedin.com/in/harshit-sharma-fullstack-dev/"},
  {name:  "Ganesh Gundawar",         role: "Web Team",  img: "/web-team-photo/IMG_20250727_174200 - Ganesh Gundawar.jpg" , github:"https://github.com/ganeshgundawar",    linkedin:"https://www.linkedin.com/in/ganesh-gundawar-2b681926a?utm_source=share_via&utm_content=profile&utm_medium=member_android"},
];



const EDITIONS: Edition[] = [
  { year: "2023", theme: "Rise of the Machines",  highlights: ["First ever SCSE Tech Fest", "500+ participants", "6 flagship events", "Industry experts from TCS & Infosys"],          participants: "500+",  events: "6", prizePool: "₹25,000",  status: "ARCHIVED" },
  { year: "2024", theme: "Code to the Future",    highlights: ["Expanded to 8 competitions", "1200+ participants across India", "AI Hackathon introduced", "Live CTF Challenge"],      participants: "1200+", events: "8", prizePool: "₹40,000",  status: "ARCHIVED" },
  { year: "2025", theme: "Code to the Future",    highlights: ["Biggest edition yet", "National level participation", "₹50K+ prize pool", "Gaming tournament added"],                participants: "2000+", events: "8", prizePool: "₹50,000+", status: "ACTIVE"   },
];

// ── Hooks ──────────────────────────────────────────────
function useTypingEffect(text: string, speed = 40, startDelay = 0) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) clearInterval(interval);
      }, speed);
      return () => clearInterval(interval);
    }, startDelay);
    return () => clearTimeout(timeout);
    
  }, [text, speed, startDelay]);
  return displayed;
}

function useInView(threshold = 0.12) {
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

// ── Sub-components ─────────────────────────────────────
function SectionHeader({ label, title }: { label: string; title: string }) {
  return (
    <div className="sec-header">
      <span className="sec-label">// {label}</span>
      <h2 className="sec-title">{title}</h2>
      <div className="sec-line" />
    </div>
  );
}

function ProfCard({ prof }: { prof: Professor }) {
  return (
    <div className="prof-card">
      <div className="prof-img-wrap">
        <div className="prof-img-border" />
        {prof.img
          ? <img src={prof.img} alt={prof.name} className="prof-img" />
          : <div className="prof-img placeholder">{prof.name[0]}</div>}
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
          <a href={`tel:${member.phone}`} className="mem-detail-item">☎ {member.phone}</a>
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="mem-detail-linkedin">▶ LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

function EditionCard({ ed, idx }: { ed: Edition; idx: number }) {
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
              { label: "EVENTS",       val: ed.events },
              { label: "PRIZE POOL",   val: ed.prizePool },
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

function WebCard({ member, idx }: { member: WebMember; idx: number }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`web-card ${hovered ? "web-card-hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="web-card-accent" />
      <div className="web-card-id">[{String(idx + 1).padStart(2, "0")}]</div>
      <div className="web-card-img-wrap">
        <img src={member.img} alt={member.name} className="web-card-img" />
        <div className="web-card-overlay" />
        <div className="web-card-corner web-card-corner-tl" />
        <div className="web-card-corner web-card-corner-br" />
      </div>
      <div className="web-card-body">
        <p className="web-card-tag">// WEB.TEAM</p>
        <h3 className="web-card-name">{member.name}</h3>
        <p className="web-card-role">{member.role}</p>
        {member.stack && (
          <div className="web-card-stack">
            {member.stack.map((s) => <span key={s} className="web-card-chip">{s}</span>)}
          </div>
        )}
        <div className={`web-card-links ${hovered ? "web-card-links-visible" : ""}`}>
          {member.github && (
            <a href={member.github} target="_blank" rel="noopener noreferrer" className="web-card-link">⎔ GitHub</a>
          )}
          <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="web-card-link web-card-link-cyan">▶ LinkedIn</a>
        </div>
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────
export default function AboutPage() {
  const { userData } = useContext(UserContext);
  const bootLine = useTypingEffect("Initializing SCSE.archive() → Loading member database... OK", 30, 300);
  const { ref: aboutRef, inView: aboutIn } = useInView();
  const { ref: profRef,  inView: profIn  } = useInView();
  const { ref: coreRef,  inView: coreIn  } = useInView();
  const { ref: memRef,   inView: memIn   } = useInView();
  const { ref: edRef,    inView: edIn    } = useInView();
  const { ref: webRef,   inView: webIn   } = useInView();

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Exo+2:ital,wght@0,300;0,400;0,500;0,600;1,300&family=Share+Tech+Mono&display=swap');

        :root {
          --cyan:    #00f5ff;
          --pink:    #ff0080;
          --purple:  #bf00ff;
          --yellow:  #ffe600;
          --green:   #00ff88;
          --bg:      #000314;
          --card-bg: rgba(0,3,20,0.88);
          --f-head:  'Orbitron', sans-serif;
          --f-body:  'Exo 2', sans-serif;
          --f-mono:  'Share Tech Mono', monospace;
        }

        /* ── BASE ── */
        .about-page {
          background:
            linear-gradient(rgba(0,3,20,0.75), rgba(0,3,20,0.65)),
            url('/contact/cyberpunk-bg.jpeg') center/cover no-repeat fixed;
          min-height: 100vh;
          color: #e0e8ff;
          position: relative;
          overflow-x: hidden;
          font-family: var(--f-body);
          -webkit-font-smoothing: antialiased;
        }
        .about-page::before {
          content: '';
          position: fixed; inset: 0;
          background-image:
            linear-gradient(rgba(0,245,255,0.022) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,245,255,0.022) 1px, transparent 1px);
          background-size: 44px 44px;
          pointer-events: none;
          z-index: 0;
        }
        .about-page::after {
          content: '';
          position: fixed; inset: 0;
          background: repeating-linear-gradient(
            0deg, transparent, transparent 2px,
            rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px
          );
          pointer-events: none;
          z-index: 0;
        }

        /* ── HERO ── */
        .about-hero {
          position: relative; z-index: 1;
          padding: 140px 5rem 90px;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: linear-gradient(180deg, rgba(0,3,20,0.92) 0%, transparent 100%);
        }
        .about-boot-bar {
          font-family: var(--f-mono);
          font-size: 0.8rem;
          letter-spacing: 0.18em;
          color: rgba(0,245,255,0.45);
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
        }
        .about-boot-dot {
          width: 7px; height: 7px; border-radius: 50%;
          background: var(--cyan); box-shadow: 0 0 10px var(--cyan);
          animation: ab-pulse 1.5s ease infinite; flex-shrink: 0;
        }
        @keyframes ab-pulse { 0%,100%{opacity:1;} 50%{opacity:0.3;} }

        .about-boot-text {
          font-family: var(--f-mono);
          font-size: 0.82rem;
          color: rgba(0,245,255,0.55);
          min-height: 1.2em;
          letter-spacing: 0.06em;
          margin-bottom: 2rem;
        }
        .about-boot-cursor {
          display: inline-block; width: 9px; height: 16px;
          background: var(--cyan); margin-left: 3px;
          animation: ab-blink 1s step-start infinite;
          vertical-align: middle;
        }
        @keyframes ab-blink { 0%,100%{opacity:1;} 50%{opacity:0;} }

        .about-hero-title {
          font-family: var(--f-head);
          font-size: clamp(2.8rem, 6vw, 5rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          line-height: 1.08;
          margin-bottom: 1.2rem;
        }
        .about-hero-title span {
          color: var(--cyan);
          text-shadow: 0 0 35px rgba(0,245,255,0.55);
        }
        .about-hero-sub {
          font-family: var(--f-mono);
          font-size: 0.95rem;
          color: rgba(180,200,255,0.5);
          letter-spacing: 0.2em;
          margin-bottom: 2.5rem;
        }
        .about-hero-tags { display: flex; gap: 1rem; flex-wrap: wrap; }
        .about-tag {
          font-family: var(--f-mono);
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          padding: 6px 16px;
          border: 1px solid rgba(0,245,255,0.28);
          color: var(--cyan);
          background: rgba(0,245,255,0.05);
        }
        .about-tag-pink   { border-color: rgba(255,0,128,0.3);  color: var(--pink);   background: rgba(255,0,128,0.05); }
        .about-tag-purple { border-color: rgba(191,0,255,0.3);  color: var(--purple); background: rgba(191,0,255,0.05); }

        /* ── SECTIONS ── */
        .about-section {
          position: relative; z-index: 1;
          padding: 90px 5rem;
          border-bottom: 1px solid rgba(0,245,255,0.06);
        }
        .about-section-alt { background: rgba(0,245,255,0.018); }

        /* ── SECTION HEADER ── */
        .sec-header { margin-bottom: 3.5rem; }
        .sec-label {
          font-family: var(--f-mono);
          font-size: 0.82rem;
          letter-spacing: 0.28em;
          color: var(--pink);
          display: block;
          margin-bottom: 0.7rem;
        }
        .sec-title {
          font-family: var(--f-head);
          font-size: clamp(1.8rem, 3.5vw, 2.6rem);
          font-weight: 900;
          color: #fff;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          margin-bottom: 1rem;
          line-height: 1.1;
        }
        .sec-line {
          height: 2px; width: 90px;
          background: linear-gradient(90deg, var(--cyan), transparent);
          box-shadow: 0 0 10px var(--cyan);
          border-radius: 2px;
        }

        /* ── ABOUT GRID ── */
        .about-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: start;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .about-grid.in-view { opacity: 1; transform: translateY(0); }

        /* Terminal */
        .about-terminal {
          border: 1px solid rgba(0,245,255,0.22);
          background: var(--card-bg);
          position: relative; overflow: hidden;
          border-radius: 4px;
        }
        .about-terminal::before {
          content: '';
          position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--cyan), var(--pink), transparent);
        }
        .about-term-bar {
          display: flex; align-items: center; gap: 0.8rem;
          padding: 0.85rem 1.4rem;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,245,255,0.03);
        }
        .term-dots { display: flex; gap: 6px; }
        .term-dots span { width: 10px; height: 10px; border-radius: 50%; }
        .term-dots span:nth-child(1) { background:#ff5f57; box-shadow:0 0 5px #ff5f57; }
        .term-dots span:nth-child(2) { background:#febc2e; box-shadow:0 0 5px #febc2e; }
        .term-dots span:nth-child(3) { background:#28c840; box-shadow:0 0 5px #28c840; }
        .term-title {
          font-family: var(--f-mono); font-size: 0.75rem;
          color: rgba(0,245,255,0.4); letter-spacing: 0.05em; flex: 1;
        }
        .about-term-body {
          padding: 2rem 1.8rem;
          font-family: var(--f-mono);
          font-size: 0.9rem;
          color: rgba(180,200,255,0.75);
          line-height: 1.95;
        }
        .about-term-line { margin-bottom: 0.35rem; }
        .about-term-line .kw  { color: var(--cyan); }
        .about-term-line .str { color: var(--yellow); }
        .about-term-line .cm  { color: rgba(0,245,255,0.35); }

        /* Xavenir block */
        .about-xavenir-block { display: flex; flex-direction: column; gap: 1.6rem; }
        .xav-title {
          font-family: var(--f-head);
          font-size: 1.3rem; font-weight: 900;
          color: var(--cyan); letter-spacing: 0.12em;
          text-shadow: 0 0 22px rgba(0,245,255,0.4);
        }
        .xav-text {
          font-family: var(--f-body);
          font-size: 1.05rem; font-weight: 300;
          color: rgba(200,215,255,0.8);
          line-height: 1.9; letter-spacing: 0.02em;
        }
        .xav-text strong { color: #e8eeff; font-weight: 500; }
        .xav-btn {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-head); font-size: 0.72rem;
          letter-spacing: 0.15em; text-transform: uppercase;
          text-decoration: none; padding: 12px 26px;
          border: 1px solid var(--cyan); color: #000; background: var(--cyan);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          transition: all 0.25s; align-self: flex-start; margin-top: 0.5rem;
          font-weight: 700;
        }
        .xav-btn:hover { background: var(--pink); border-color: var(--pink); box-shadow: 0 0 24px var(--pink); }

        /* ── PROFESSORS ── */
        .prof-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .prof-grid.in-view { opacity: 1; transform: translateY(0); }
        .prof-card {
          border: 1px solid rgba(0,245,255,0.16);
          background: var(--card-bg);
          padding: 2.2rem 1.8rem;
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 1.4rem; position: relative;
          border-radius: 4px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .prof-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          opacity: 0; transition: opacity 0.3s;
        }
        .prof-card:hover { border-color: rgba(0,245,255,0.45); box-shadow: 0 0 35px rgba(0,245,255,0.09); }
        .prof-card:hover::before { opacity: 1; }
        .prof-img-wrap { position: relative; width: 120px; height: 120px; }
        .prof-img-border {
          position: absolute; inset: -4px;
          border: 1px solid rgba(0,245,255,0.45);
          clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
        }
        .prof-img {
          width: 120px; height: 120px; object-fit: cover; object-position: top;
          clip-path: polygon(16px 0, 100% 0, 100% calc(100% - 16px), calc(100% - 16px) 100%, 0 100%, 0 16px);
          filter: grayscale(20%) brightness(0.88);
          transition: filter 0.3s;
        }
        .prof-card:hover .prof-img { filter: grayscale(0%) brightness(1.05); }
        .prof-img.placeholder {
          background: rgba(0,245,255,0.08);
          display: flex; align-items: center; justify-content: center;
          font-family: var(--f-head); font-size: 2.2rem; color: var(--cyan);
        }
        .prof-scan {
          position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, transparent, var(--cyan), transparent);
          animation: scan 3s linear infinite; opacity: 0.55;
        }
        @keyframes scan { 0%{top:0;} 100%{top:100%;} }
        .prof-tag {
          font-family: var(--f-mono); font-size: 0.68rem;
          letter-spacing: 0.18em; color: var(--pink);
        }
        .prof-name {
          font-family: var(--f-head); font-size: 1rem;
          font-weight: 700; color: #e4eeff; letter-spacing: 0.06em;
          line-height: 1.3;
        }
        .prof-role {
          font-family: var(--f-body); font-size: 0.88rem; font-weight: 400;
          color: var(--cyan); letter-spacing: 0.08em;
        }

        /* ── CORE TEAM ── */
        .core-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 2.5rem;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .core-grid.in-view { opacity: 1; transform: translateY(0); }
        .core-card {
          border: 1px solid rgba(0,245,255,0.2);
          background: var(--card-bg); overflow: hidden; position: relative;
          border-radius: 4px;
          transition: border-color 0.3s, box-shadow 0.3s;
        }
        .core-card::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--pink), var(--purple));
        }
        .core-card:hover { border-color: rgba(0,245,255,0.5); box-shadow: 0 0 45px rgba(0,245,255,0.11); }
        .core-img-wrap { position: relative; height: 280px; overflow: hidden; }
        .core-img {
          width: 100%; height: 100%; object-fit: cover; object-position: top;
          filter: grayscale(15%) brightness(0.85);
          transition: filter 0.4s, transform 0.4s;
        }
        .core-card:hover .core-img { filter: grayscale(0%) brightness(1); transform: scale(1.04); }
        .core-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 60%;
          background: linear-gradient(transparent, var(--card-bg));
        }
        .core-corner { position: absolute; width: 16px; height: 16px; z-index: 2; }
        .core-corner.tl { top: 8px; left: 8px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
        .core-corner.br { bottom: 8px; right: 8px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }
        .core-info { padding: 1.8rem; display: flex; flex-direction: column; gap: 0.5rem; }
        .core-id { font-family: var(--f-mono); font-size: 0.7rem; letter-spacing: 0.18em; color: var(--pink); }
        .core-name {
          font-family: var(--f-head); font-size: 1.1rem;
          font-weight: 700; color: #e4eeff; letter-spacing: 0.05em;
        }
        .core-role {
          font-family: var(--f-body); font-size: 0.88rem; font-weight: 500;
          color: var(--cyan); letter-spacing: 0.15em; text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .core-contacts { display: flex; flex-direction: column; gap: 0.55rem; }
        .core-contact-link {
          font-family: var(--f-body); font-size: 0.82rem; font-weight: 300;
          color: rgba(180,200,255,0.58); text-decoration: none;
          display: flex; align-items: center; gap: 0.55rem;
          transition: color 0.2s;
        }
        .core-contact-link:hover { color: var(--cyan); }
        .core-contact-icon { color: var(--cyan); font-size: 0.75rem; }
        .core-linkedin {
          font-family: var(--f-head); font-size: 0.68rem; letter-spacing: 0.12em;
          color: var(--cyan); text-decoration: none; margin-top: 0.4rem;
          transition: color 0.2s, text-shadow 0.2s;
        }
        .core-linkedin:hover { color: var(--pink); text-shadow: 0 0 12px var(--pink); }

        /* ── MEMBERS ── */
        .mem-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .mem-grid.in-view { opacity: 1; transform: translateY(0); }
        .mem-card {
          border: 1px solid rgba(0,245,255,0.1);
          background: var(--card-bg); overflow: hidden; position: relative;
          cursor: pointer; border-radius: 4px;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .mem-card:hover, .mem-card-hovered {
          border-color: rgba(0,245,255,0.38);
          box-shadow: 0 0 28px rgba(0,245,255,0.09);
          transform: translateY(-5px);
        }
        .mem-id-tag {
          position: absolute; top: 8px; left: 8px;
          font-family: var(--f-mono); font-size: 0.65rem;
          color: var(--cyan); background: rgba(0,3,20,0.82);
          padding: 2px 7px; z-index: 2; letter-spacing: 0.08em;
        }
        .mem-img-wrap { position: relative; height: 190px; overflow: hidden; }
        .mem-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center 15%;
          filter: grayscale(20%) brightness(0.85);
          transition: filter 0.3s, transform 0.3s;
        }
        .mem-card:hover .mem-img { filter: grayscale(0%) brightness(1.02); transform: scale(1.05); }
        .mem-img-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 50%;
          background: linear-gradient(transparent, var(--card-bg));
        }
        .mem-info { padding: 1rem 1.1rem 1.2rem; }
        .mem-name {
          font-family: var(--f-head); font-size: 0.82rem;
          font-weight: 700; color: #e4eeff; letter-spacing: 0.05em;
          margin-bottom: 0.35rem; line-height: 1.3;
        }
        .mem-role {
          font-family: var(--f-body); font-size: 0.75rem; font-weight: 400;
          color: var(--cyan); letter-spacing: 0.12em; text-transform: uppercase;
          margin-bottom: 0.6rem;
        }
        .mem-details {
          display: flex; flex-direction: column; gap: 0.4rem;
          max-height: 0; overflow: hidden;
          transition: max-height 0.35s ease;
        }
        .mem-details-visible { max-height: 90px; }
        .mem-detail-item {
          font-family: var(--f-body); font-size: 0.72rem; font-weight: 300;
          color: rgba(180,200,255,0.52); text-decoration: none;
          transition: color 0.2s;
        }
        .mem-detail-item:hover { color: var(--cyan); }
        .mem-detail-linkedin {
          font-family: var(--f-head); font-size: 0.6rem; letter-spacing: 0.12em;
          color: var(--cyan); text-decoration: none; transition: color 0.2s;
        }
        .mem-detail-linkedin:hover { color: var(--pink); }

        /* ── EDITIONS ── */
        .edition-list {
          display: flex; flex-direction: column; gap: 1px;
          border: 1px solid rgba(0,245,255,0.15);
          background: rgba(0,245,255,0.025);
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
          border-radius: 4px; overflow: hidden;
        }
        .edition-list.in-view { opacity: 1; transform: translateY(0); }
        .edition-card {
          border-bottom: 1px solid rgba(0,245,255,0.08);
          position: relative; overflow: hidden; transition: background 0.2s;
        }
        .edition-card:last-child { border-bottom: none; }
        .edition-card::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 3px;
          background: linear-gradient(180deg, var(--cyan), var(--pink));
          opacity: 0; transition: opacity 0.3s;
        }
        .edition-card:hover::before, .edition-active::before { opacity: 1; }
        .edition-active { background: rgba(0,245,255,0.025); }
        .edition-header {
          display: flex; align-items: center; gap: 2rem;
          padding: 1.6rem 2rem; cursor: pointer;
          transition: background 0.2s;
        }
        .edition-header:hover { background: rgba(0,245,255,0.03); }
        .edition-year-wrap { display: flex; flex-direction: column; gap: 0.25rem; min-width: 160px; }
        .edition-node {
          font-family: var(--f-mono); font-size: 0.68rem;
          color: rgba(0,245,255,0.3); letter-spacing: 0.18em;
        }
        .edition-year {
          font-family: var(--f-head); font-size: 1.4rem;
          font-weight: 900; color: #e4eeff; letter-spacing: 0.15em;
        }
        .edition-active .edition-year { color: var(--cyan); text-shadow: 0 0 18px rgba(0,245,255,0.5); }
        .edition-meta { display: flex; flex-direction: column; gap: 0.35rem; flex: 1; }
        .edition-theme {
          font-family: var(--f-body); font-size: 1rem; font-weight: 400;
          color: rgba(200,215,255,0.68); letter-spacing: 0.04em;
        }
        .edition-status {
          font-family: var(--f-mono); font-size: 0.72rem;
          letter-spacing: 0.2em; color: rgba(180,200,255,0.3); text-transform: uppercase;
        }
        .edition-status-active { color: var(--green); animation: ab-pulse 1.5s ease infinite; }
        .edition-chevron { font-size: 0.75rem; color: rgba(0,245,255,0.35); min-width: 16px; }
        .edition-body {
          padding: 1.8rem 2rem 2.4rem;
          border-top: 1px solid rgba(0,245,255,0.07);
          display: flex; flex-direction: column; gap: 1.8rem;
          animation: slide-down 0.35s ease;
        }
        @keyframes slide-down { from{opacity:0;transform:translateY(-8px);} to{opacity:1;transform:translateY(0);} }
        .edition-stats-row { display: flex; gap: 4rem; padding-bottom: 1.4rem; border-bottom: 1px solid rgba(0,245,255,0.07); }
        .edition-stat { display: flex; flex-direction: column; gap: 0.35rem; }
        .edition-stat-val {
          font-family: var(--f-head); font-size: 1.6rem;
          font-weight: 900; color: var(--yellow);
          text-shadow: 0 0 14px rgba(255,230,0,0.4);
        }
        .edition-stat-label {
          font-family: var(--f-mono); font-size: 0.68rem;
          letter-spacing: 0.22em; color: rgba(180,200,255,0.38); text-transform: uppercase;
        }
        .edition-hl-label {
          font-family: var(--f-mono); font-size: 0.72rem;
          letter-spacing: 0.2em; color: var(--pink);
          display: block; margin-bottom: 1rem;
        }
        .edition-hl-list { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 0.65rem; }
        .edition-hl-item {
          font-family: var(--f-body); font-size: 0.95rem; font-weight: 300;
          color: rgba(200,215,255,0.72);
          display: flex; align-items: center; gap: 0.7rem;
        }
        .edition-hl-dot { color: var(--cyan); font-size: 0.75rem; flex-shrink: 0; }

        /* ── WEB TEAM ── */
        .web-terminal {
          border: 1px solid rgba(0,245,255,0.18);
          background: var(--card-bg); position: relative; overflow: hidden;
          margin-top: 2.5rem; border-radius: 4px;
        }
        .web-terminal::before {
          content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, var(--cyan), var(--purple), var(--pink), transparent);
        }
        .archive-term-bar {
          display: flex; align-items: center; gap: 1rem;
          padding: 0.9rem 1.6rem;
          border-bottom: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,245,255,0.03);
        }
        .archive-term-count {
          font-family: var(--f-mono); font-size: 0.72rem;
          letter-spacing: 0.14em; color: rgba(0,245,255,0.38); margin-left: auto;
        }
        .archive-prompt {
          display: flex; align-items: center; gap: 0.8rem;
          padding: 0.9rem 1.6rem;
          border-top: 1px solid rgba(0,245,255,0.08);
          background: rgba(0,245,255,0.02);
        }
        .archive-prompt-sym {
          color: var(--cyan); font-family: var(--f-mono); font-size: 0.95rem;
          animation: ab-blink 1.2s step-start infinite;
        }
        .archive-prompt-text {
          font-family: var(--f-mono); font-size: 0.75rem;
          letter-spacing: 0.1em; color: rgba(0,245,255,0.28);
        }

        .web-grid {
          display: grid; grid-template-columns: repeat(5, 1fr); gap: 1.5rem;
          opacity: 0; transform: translateY(30px);
          transition: opacity 0.7s ease, transform 0.7s ease;
        }
        .web-grid.in-view { opacity: 1; transform: translateY(0); }
        .web-card {
          border: 1px solid rgba(0,245,255,0.1);
          background: rgba(0,2,15,0.92); overflow: hidden; position: relative;
          cursor: pointer; border-radius: 4px;
          transition: border-color 0.3s, box-shadow 0.3s, transform 0.3s;
        }
        .web-card:hover, .web-card-hovered {
          border-color: rgba(0,245,255,0.48);
          box-shadow: 0 0 30px rgba(0,245,255,0.1), 0 0 60px rgba(191,0,255,0.07);
          transform: translateY(-7px);
        }
        .web-card-accent {
          height: 2px;
          background: linear-gradient(90deg, var(--cyan), var(--purple));
          width: 0; transition: width 0.4s ease;
        }
        .web-card:hover .web-card-accent { width: 100%; }
        .web-card-id {
          position: absolute; top: 12px; right: 10px;
          font-family: var(--f-mono); font-size: 0.62rem;
          color: rgba(0,245,255,0.35); letter-spacing: 0.08em; z-index: 3;
        }
        .web-card-img-wrap { position: relative; height: 190px; overflow: hidden; }
        .web-card-img {
          width: 100%; height: 100%; object-fit: cover; object-position: center 15%;
          filter: grayscale(30%) brightness(0.8);
          transition: filter 0.4s, transform 0.4s;
        }
        .web-card:hover .web-card-img { filter: grayscale(0%) brightness(1.06); transform: scale(1.06); }
        .web-card-overlay {
          position: absolute; bottom: 0; left: 0; right: 0; height: 55%;
          background: linear-gradient(transparent, rgba(0,2,15,0.96));
        }
        .web-card-corner { position: absolute; width: 13px; height: 13px; z-index: 2; opacity: 0; transition: opacity 0.3s; }
        .web-card:hover .web-card-corner { opacity: 1; }
        .web-card-corner-tl { top: 8px; left: 8px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -1px -1px 7px var(--cyan); }
        .web-card-corner-br { bottom: 8px; right: 8px; border-bottom: 2px solid var(--purple); border-right: 2px solid var(--purple); box-shadow: 1px 1px 7px var(--purple); }
        .web-card-body { padding: 1rem 1.1rem 1.2rem; display: flex; flex-direction: column; gap: 0.32rem; }
        .web-card-tag { font-family: var(--f-mono); font-size: 0.65rem; letter-spacing: 0.15em; color: var(--purple); }
        .web-card-name { font-family: var(--f-head); font-size: 0.82rem; font-weight: 700; color: #e4eeff; letter-spacing: 0.05em; line-height: 1.3; }
        .web-card-role { font-family: var(--f-body); font-size: 0.75rem; font-weight: 400; color: var(--cyan); letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 0.4rem; }
        .web-card-stack { display: flex; flex-wrap: wrap; gap: 0.35rem; margin-bottom: 0.5rem; }
        .web-card-chip { font-family: var(--f-mono); font-size: 0.58rem; letter-spacing: 0.08em; padding: 2px 8px; border: 1px solid rgba(191,0,255,0.32); color: var(--purple); background: rgba(191,0,255,0.06); }
        .web-card-links { display: flex; gap: 0.8rem; flex-wrap: wrap; max-height: 0; overflow: hidden; transition: max-height 0.35s ease; }
        .web-card-links-visible { max-height: 60px; }
        .web-card-link { font-family: var(--f-head); font-size: 0.6rem; letter-spacing: 0.1em; color: rgba(180,200,255,0.5); text-decoration: none; transition: color 0.2s; }
        .web-card-link:hover { color: #e0e8ff; }
        .web-card-link-cyan { color: var(--cyan); }
        .web-card-link-cyan:hover { color: var(--pink); text-shadow: 0 0 8px var(--pink); }

        /* ── SECTION DESC ── */
        .sec-desc {
          font-family: var(--f-body); font-size: 0.95rem; font-weight: 300;
          color: rgba(180,200,255,0.48); letter-spacing: 0.04em;
          margin-bottom: 2.8rem; line-height: 1.85;
        }

        /* ── CTA ── */
        .cta-section {
          position: relative; z-index: 1;
          padding: 90px 5rem;
          background: rgba(0,0,30,0.65);
          border-top: 1px solid rgba(0,245,255,0.08);
          border-bottom: 1px solid rgba(0,245,255,0.08);
          display: flex; flex-direction: column; align-items: center;
          text-align: center; gap: 1.6rem;
        }
        .cta-eyebrow { font-family: var(--f-mono); font-size: 0.82rem; letter-spacing: 0.3em; color: var(--pink); }
        .cta-title { font-family: var(--f-head); font-size: clamp(2rem, 4vw, 3rem); font-weight: 900; color: #fff; letter-spacing: 0.1em; }
        .cta-sub { font-family: var(--f-body); font-size: 1rem; font-weight: 300; color: rgba(180,200,255,0.55); letter-spacing: 0.04em; max-width: 500px; line-height: 1.9; }
        .cta-btns { display: flex; gap: 1.2rem; flex-wrap: wrap; justify-content: center; margin-top: 0.5rem; }
        .cta-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-head); font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; padding: 14px 32px;
          border: 1px solid var(--cyan); color: #000; background: var(--cyan);
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          font-weight: 700; transition: all 0.25s;
        }
        .cta-btn-primary:hover { background: var(--pink); border-color: var(--pink); box-shadow: 0 0 24px var(--pink); }
        .cta-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          font-family: var(--f-head); font-size: 0.72rem; letter-spacing: 0.15em;
          text-transform: uppercase; text-decoration: none; padding: 14px 32px;
          border: 1px solid rgba(0,245,255,0.32); color: var(--cyan); background: transparent;
          clip-path: polygon(0 0, calc(100% - 10px) 0, 100% 10px, 100% 100%, 10px 100%, 0 calc(100% - 10px));
          font-weight: 600; transition: all 0.25s;
        }
        .cta-btn-secondary:hover { border-color: var(--cyan); box-shadow: 0 0 20px rgba(0,245,255,0.25); }

        /* ── RESPONSIVE ── */
        @media (max-width: 1100px) {
          .mem-grid, .web-grid { grid-template-columns: repeat(4, 1fr); }
        }
        @media (max-width: 900px) {
          .about-hero { padding: 100px 1.8rem 50px; }
          .about-section { padding: 55px 1.8rem; }
          .cta-section { padding: 55px 1.8rem; }
          .about-grid { grid-template-columns: 1fr; gap: 2rem; }
          .about-hero-title { font-size: clamp(2rem, 6vw, 3.5rem); }
          .about-hero-sub { font-size: 0.8rem; letter-spacing: 0.12em; }
          .prof-grid { grid-template-columns: repeat(3, 1fr); gap: 1.2rem; }
          .core-grid { grid-template-columns: 1fr 1fr; gap: 1.5rem; }
          .mem-grid, .web-grid { grid-template-columns: repeat(3, 1fr); }
          .edition-stats-row { gap: 2rem; }
          .sec-title { font-size: clamp(1.4rem, 4vw, 2rem); }
          .about-term-body { padding: 1.4rem 1.2rem; font-size: 0.82rem; }
        }
        @media (max-width: 600px) {
          .about-hero { padding: 90px 1.2rem 40px; }
          .about-section { padding: 44px 1.2rem; }
          .cta-section { padding: 44px 1.2rem; }
          .about-hero-title { font-size: clamp(1.7rem, 8vw, 2.8rem); }
          .about-hero-sub { font-size: 0.72rem; letter-spacing: 0.08em; }
          .about-hero-tags { gap: 0.6rem; }
          .about-tag, .about-tag-pink, .about-tag-purple { font-size: 0.65rem; padding: 4px 10px; }
          .prof-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .core-grid { grid-template-columns: 1fr; }
          .mem-grid, .web-grid { grid-template-columns: repeat(2, 1fr); gap: 0.8rem; }
          .edition-header { flex-wrap: wrap; gap: 1rem; padding: 1.2rem; }
          .edition-stats-row { flex-wrap: wrap; gap: 1.5rem; }
          .sec-title { font-size: clamp(1.2rem, 6vw, 1.8rem); }
          .sec-label { font-size: 0.68rem; letter-spacing: 0.18em; }
          .about-term-body { padding: 1rem; font-size: 0.78rem; line-height: 1.75; }
          .core-card { flex-direction: column; }
          .core-img-wrap { width: 100%; height: 240px; }
          .core-img { width: 100%; height: 100%; object-fit: cover; object-position: center top; }
          .mem-img-wrap { height: 160px; }
          .mem-img { object-position: center top; }
          .web-card-img-wrap { height: 160px; }
          .web-card-img { object-position: center top; }
          .xav-title { font-size: 1.1rem; }
          .xav-text { font-size: 0.95rem; }
        }
        @media (max-width: 480px) {
          .about-hero { padding: 85px 1rem 36px; }
          .about-section { padding: 36px 1rem; }
          .about-hero-title { font-size: clamp(1.4rem, 9vw, 2.2rem); line-height: 1.1; }
          .prof-grid { grid-template-columns: 1fr 1fr; gap: 1rem; }
          .mem-grid, .web-grid { grid-template-columns: 1fr 1fr; gap: 0.6rem; }
          .mem-img-wrap { height: 140px; }
          .web-card-img-wrap { height: 140px; }
          .mem-name, .web-card-name { font-size: 0.82rem; }
          .mem-role, .web-card-role { font-size: 0.7rem; }
          .edition-year { font-size: 1rem; }
          .edition-theme { font-size: 0.72rem; }
          .edition-stat-val { font-size: 1.2rem; }
          .prof-name { font-size: 0.9rem; }
          .prof-role { font-size: 0.72rem; }
          .prof-img-wrap { width: 100px; height: 100px; }
          .prof-img { width: 100px; height: 100px; }
        }
      `}</style>

      <div className="about-page">

        {/* ── HERO ── */}
        <section className="about-hero">
          <div className="about-boot-bar">
            <div className="about-boot-dot" />
            <span>SCSE.SYS // ARCHIVE MODULE // NIT JAMSHEDPUR</span>
          </div>
          <div className="about-boot-text">
            {bootLine}<span className="about-boot-cursor" />
          </div>
          <h1 className="about-hero-title">About <span>Us</span></h1>
          <p className="about-hero-sub">// WHO_WE_ARE · OUR_TEAM · XAVENIR_HISTORY</p>
          <div className="about-hero-tags">
            <span className="about-tag">// NIT JAMSHEDPUR</span>
            <span className="about-tag-pink">// CSE DEPARTMENT</span>
            <span className="about-tag-purple">// EST. 2023</span>
          </div>
        </section>

        {/* ── ABOUT SCSE / XAVENIR ── */}
        <section className="about-section">
          <SectionHeader label="sys.info()" title="Who Are We?" />
          <div ref={aboutRef} className={`about-grid ${aboutIn ? "in-view" : ""}`}>
            <div className="about-terminal">
              <div className="about-term-bar">
                <div className="term-dots"><span /><span /><span /></div>
                <span className="term-title">scse@nitjsr:~/about$ cat README.md</span>
              </div>
              <div className="about-term-body">
                <p className="about-term-line"><span className="cm">// SCSE — Society of Computer Science & Engineering</span></p>
                <p className="about-term-line" style={{ marginTop: "1.2rem" }}>
                  <span className="kw">const</span> <span className="str">mission</span> = {`{`}
                </p>
                <p className="about-term-line" style={{ paddingLeft: "1.8rem" }}><span className="str">innovation</span>: <span className="kw">true</span>,</p>
                <p className="about-term-line" style={{ paddingLeft: "1.8rem" }}><span className="str">excellence</span>: <span className="kw">true</span>,</p>
                <p className="about-term-line" style={{ paddingLeft: "1.8rem" }}><span className="str">collaboration</span>: <span className="kw">true</span>,</p>
                <p className="about-term-line">{`}`};</p>
                <p className="about-term-line" style={{ marginTop: "1.2rem", color: "rgba(200,215,255,0.78)", fontSize: "0.92rem", lineHeight: "1.95" }}>
                  A vibrant community of tech enthusiasts, innovators, and learners at NIT Jamshedpur.
                  We operate at the intersection of code and creativity.
                </p>
                <p className="about-term-line" style={{ marginTop: "0.8rem", color: "rgba(200,215,255,0.78)", fontSize: "0.92rem", lineHeight: "1.95" }}>
                  We foster <span className="kw">knowledge-sharing</span>,{" "}
                  <span className="kw">problem-solving</span>, and{" "}
                  <span className="kw">relentless innovation</span> —
                  shaping the architects of tomorrow's technology landscape.
                </p>
                <p className="about-term-line" style={{ marginTop: "1.2rem" }}>
                  <span className="cm">// events: hackathons | coding contests | workshops | tech talks</span>
                </p>
              </div>
            </div>

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
              <a href="/sponsorship_brochure.pdf" target="_blank" rel="noopener noreferrer" className="xav-btn">
                ▶ View Brochure
              </a>
            </div>
          </div>
        </section>

        {/* ── PROFESSORS ── */}
        <section className="about-section about-section-alt">
          <SectionHeader label="faculty.load()" title="Deemed Professors" />
          <div ref={profRef} className={`prof-grid ${profIn ? "in-view" : ""}`}>
            {PROFESSORS.map((p, i) => <ProfCard key={i} prof={p} />)}
          </div>
        </section>

        {/* ── CORE TEAM ── */}
        <section className="about-section">
          <SectionHeader label="core.team()" title="Core Team" />
          <p className="sec-desc">// The backbone of SCSE — leaders driving innovation and excellence.</p>
          <div ref={coreRef} className={`core-grid ${coreIn ? "in-view" : ""}`}>
            {CORE_TEAM.map((m) => <CoreCard key={m.name} member={m} />)}
          </div>
        </section>

        {/* ── MEMBERS ── */}
        <section className="about-section about-section-alt">
          <SectionHeader label="members.list()" title="Our Members" />
          <p className="sec-desc">// The vibrant force behind SCSE. {MEMBERS.length} PROCESSES LOADED.</p>
          <div ref={memRef} className={`mem-grid ${memIn ? "in-view" : ""}`}>
            {MEMBERS.map((m, i) => <MemberCard key={m.name} member={m} idx={i} />)}
          </div>
        </section>

        {/* ── WEB TEAM ── */}
        <section className="about-section about-section-alt">
          <SectionHeader label="web.team()" title="Web Team" />
          <p className="sec-desc">
            // The engineers behind scse-xavenir.vercel.app — built with Next.js, TypeScript &amp; passion.
            &nbsp;{WEB_TEAM.length} DEVS ONLINE.
          </p>
          <div className="web-terminal">
            <div className="archive-term-bar">
              <div className="term-dots"><span /><span /><span /></div>
              <span style={{ fontFamily: "var(--f-mono)", fontSize: "0.78rem", color: "rgba(0,245,255,0.42)", flex: 1, letterSpacing: "0.08em" }}>
                web@scse:~/xavenir$ git log --oneline --authors
              </span>
              <span className="archive-term-count">{WEB_TEAM.length} CONTRIBUTORS</span>
            </div>
            <div style={{ padding: "2rem" }}>
              <div ref={webRef} className={`web-grid ${webIn ? "in-view" : ""}`}>
                {WEB_TEAM.map((m, i) => <WebCard key={m.name + i} member={m} idx={i} />)}
              </div>
            </div>
            <div className="archive-prompt">
              <span className="archive-prompt-sym">❯</span>
              <span className="archive-prompt-text">npm run dev // xavenir '26 is live_</span>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="cta-section">
          <span className="cta-eyebrow">// ready.to.compete()</span>
          <h2 className="cta-title">Code to the Future</h2>
          <p className="cta-sub">
            Register now and be part of the biggest tech fest at NIT Jamshedpur.
          </p>
          <div className="cta-btns">
            {userData ? (
              <>
                <Link href="/dashboard" className="cta-btn-primary">▶ Dashboard</Link>
                <button
                  className="cta-btn-secondary"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                >
                  ◆ Logout
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="cta-btn-primary">▶ Register Now</Link>
                <Link href="/#events" className="cta-btn-secondary">◆ View Events</Link>
              </>
            )}
          </div>
        </section>

      </div>
    </>
  );
}