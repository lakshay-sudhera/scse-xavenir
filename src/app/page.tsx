// "use client";

// import { useEffect, useRef, useState, useContext } from "react";
// import Link from "next/link";
// import { UserContext } from "@/context/UserContext";

// // ── Count-up hook ──────────────────────────────────────
// function useCountUp(target: number, active: boolean, duration = 2200) {
//   const [val, setVal] = useState(0);
//   useEffect(() => {
//     if (!active) return;
//     let start: number | null = null;
//     const tick = (ts: number) => {
//       if (!start) start = ts;
//       const p = Math.min(1, (ts - start) / duration);
//       const ease = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;
//       setVal(Math.floor(ease * target));
//       if (p < 1) requestAnimationFrame(tick);
//       else setVal(target);
//     };
//     requestAnimationFrame(tick);
//   }, [active, target, duration]);
//   return val;
// }

// // ── Stat counter component ─────────────────────────────
// function StatNum({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
//   const ref = useRef<HTMLSpanElement>(null);
//   const [active, setActive] = useState(false);
//   const val = useCountUp(target, active);
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, []);
//   return <span ref={ref} className="stat-num">{prefix}{active ? val.toLocaleString() : "0"}{suffix}</span>;
// }


// // ── Three.js 3D Scene ─────────────────────────────────
// function ThreeScene() {
//   const canvasRef = useRef<HTMLCanvasElement>(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const script = document.createElement("script");
//     script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
//     script.async = true;
//     script.onload = () => {
//       const THREE = (window as any).THREE;
//       if (!THREE || !canvas) return;

//       // ── Rose Spiral Geometry ───────────────────────────
//       function buildRoseSpiralGeometry(detail = 120, petals = 8, turns = 4) {
//         const positions: number[] = [];
//         const normals:   number[] = [];
//         const uvs:       number[] = [];
//         const indices:   number[] = [];

//         const rings = detail;
//         const segs  = detail * 2;
//         const PHI   = (1 + Math.sqrt(5)) / 2;

//         for (let i = 0; i <= rings; i++) {
//           const tv    = i / rings;
//           const r     = tv * 2.5;
//           const rise  = Math.sin(tv * Math.PI * turns * 2) * (1 - tv) * 0.85;
//           const petal = Math.cos(tv * Math.PI * petals) * 0.38 * (1 - tv * 0.5);

//           for (let j = 0; j <= segs; j++) {
//             const s     = j / segs;
//             const theta = s * Math.PI * 2;
//             const rr = r + petal * Math.cos(theta * (petals / 2));
//             const x  = rr * Math.cos(theta * turns + tv * Math.PI * PHI);
//             const y  = rise + rr * 0.12 * Math.sin(theta * petals);
//             const z  = rr * Math.sin(theta * turns + tv * Math.PI * PHI);

//             positions.push(x, y, z);
//             normals.push(x, y, z);
//             uvs.push(s, tv);
//           }
//         }

//         for (let i = 0; i < rings; i++) {
//           for (let j = 0; j < segs; j++) {
//             const a = i * (segs + 1) + j;
//             const b = a + (segs + 1);
//             indices.push(a, b, a + 1);
//             indices.push(b, b + 1, a + 1);
//           }
//         }

//         const geo = new THREE.BufferGeometry();
//         geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
//         geo.setAttribute("normal",   new THREE.BufferAttribute(new Float32Array(normals), 3));
//         geo.setAttribute("uv",       new THREE.BufferAttribute(new Float32Array(uvs), 2));
//         geo.setIndex(indices);
//         geo.computeVertexNormals();
//         return geo;
//       }

//       const W = canvas.offsetWidth;
//       const H = canvas.offsetHeight;

//       const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
//       renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
//       renderer.setSize(W, H);

//       const scene = new THREE.Scene();
//       const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
//       camera.position.set(0, 0, 6);

//       // ── Lights ────────────────────────────────────────
//       scene.add(new THREE.AmbientLight(0x001133, 2));
//       const pl1 = new THREE.PointLight(0x00f5ff, 3, 20);
//       pl1.position.set(3, 3, 3); scene.add(pl1);
//       const pl2 = new THREE.PointLight(0xff0080, 2, 20);
//       pl2.position.set(-3, -3, 2); scene.add(pl2);
//       const pl3 = new THREE.PointLight(0xbf00ff, 2, 20);
//       pl3.position.set(0, 4, -2); scene.add(pl3);

//       // Rose dedicated lights — start at 0, fade in during morph
//       const rosePl = new THREE.PointLight(0x00f5ff, 0, 20);
//       rosePl.position.set(0, 2, 3); scene.add(rosePl);
//       const rosePl2 = new THREE.PointLight(0xff0080, 0, 20);
//       rosePl2.position.set(-2, -2, 2); scene.add(rosePl2);

//       // ── Torus Knot ────────────────────────────────────
//       const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.32, 200, 32);
//       const torusMat = new THREE.MeshPhongMaterial({
//         color: 0x000820,
//         emissive: 0x00f5ff,
//         emissiveIntensity: 0.15,
//         shininess: 200,
//         specular: 0x00f5ff,
//         transparent: true,   // ← REQUIRED for opacity to work
//         opacity: 1,
//       });
//       const torusKnot = new THREE.Mesh(torusGeo, torusMat);
//       scene.add(torusKnot);

//       // Wireframe overlay
//       const wireGeo = new THREE.TorusKnotGeometry(1.22, 0.33, 60, 12);
//       const wireMat = new THREE.MeshBasicMaterial({
//         color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.15,
//       });
//       const wireKnot = new THREE.Mesh(wireGeo, wireMat);
//       scene.add(wireKnot);

//       // ── Rose Spiral ───────────────────────────────────
//       const roseMat = new THREE.MeshPhongMaterial({
//         color:             0x000615,
//         emissive:          0x00f5ff,
//         emissiveIntensity: 0.08,
//         shininess:         60,
//         specular:          0x004466,   // toned-down specular — less flashy
//         transparent:       true,
//         opacity:           0,
//         side:              THREE.DoubleSide,
//       });

//       const roseWireMat = new THREE.MeshBasicMaterial({
//         color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0,
//       });

//       const roseGeo      = buildRoseSpiralGeometry(120, 8, 4);
//       const roseMesh     = new THREE.Mesh(roseGeo, roseMat);
//       roseMesh.visible   = false;
//       scene.add(roseMesh);

//       const roseWireGeo  = buildRoseSpiralGeometry(40, 8, 4);
//       const roseWireMesh = new THREE.Mesh(roseWireGeo, roseWireMat); // uses roseWireMat, not inline
//       roseWireMesh.visible = false;
//       scene.add(roseWireMesh);

//       // ── Floating Icosahedrons ─────────────────────────
//       const icoGroup = new THREE.Group();
//       for (let i = 0; i < 12; i++) {
//         const size  = 0.06 + Math.random() * 0.14;
//         const geo   = new THREE.IcosahedronGeometry(size, 0);
//         const color = i % 3 === 0 ? 0x00f5ff : i % 3 === 1 ? 0xff0080 : 0xbf00ff;
//         const mat   = new THREE.MeshPhongMaterial({
//           color, emissive: color, emissiveIntensity: 0.5,
//           wireframe: Math.random() > 0.5,
//         });
//         const mesh = new THREE.Mesh(geo, mat);
//         const theta = Math.random() * Math.PI * 2;
//         const phi   = Math.random() * Math.PI;
//         const r     = 2.5 + Math.random() * 1.5;
//         mesh.position.set(
//           r * Math.sin(phi) * Math.cos(theta),
//           r * Math.sin(phi) * Math.sin(theta),
//           r * Math.cos(phi)
//         );
//         mesh.userData = { theta, phi, r, speed: 0.003 + Math.random() * 0.008 };
//         icoGroup.add(mesh);
//       }
//       scene.add(icoGroup);

//       // ── Particle Field ────────────────────────────────
//       const pCount = 400;
//       const pPos   = new Float32Array(pCount * 3);
//       for (let i = 0; i < pCount; i++) {
//         pPos[i * 3]     = (Math.random() - 0.5) * 20;
//         pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
//         pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
//       }
//       const pGeo = new THREE.BufferGeometry();
//       pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
//       const pMat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.025, transparent: true, opacity: 0.5 });
//       scene.add(new THREE.Points(pGeo, pMat));

//       // ── Rings ─────────────────────────────────────────
//       const ring1 = new THREE.Mesh(
//         new THREE.TorusGeometry(2.6, 0.008, 8, 120),
//         new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.3 })
//       );
//       ring1.rotation.x = Math.PI / 4; scene.add(ring1);

//       const ring2 = new THREE.Mesh(
//         new THREE.TorusGeometry(3.2, 0.005, 8, 120),
//         new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.2 })
//       );
//       ring2.rotation.x = Math.PI / 3; ring2.rotation.y = Math.PI / 6; scene.add(ring2);

//       // ── Mouse ─────────────────────────────────────────
//       let mx = 0, my = 0;
//       const onMouse = (e: MouseEvent) => {
//         mx = (e.clientX / window.innerWidth  - 0.5) * 2;
//         my = -(e.clientY / window.innerHeight - 0.5) * 2;
//       };
//       document.addEventListener("mousemove", onMouse);

//       // ── Resize ────────────────────────────────────────
//       const onResize = () => {
//         const w = canvas.offsetWidth;
//         const h = canvas.offsetHeight;
//         camera.aspect = w / h;
//         camera.updateProjectionMatrix();
//         renderer.setSize(w, h);
//       };
//       window.addEventListener("resize", onResize);

//       // ── Scroll → morph state ──────────────────────────
//       let morphT  = 0;
//       let targetT = 0;

//       const onScroll = () => {
//   const aboutSection  = document.getElementById("about");
//   const eventsSection = document.getElementById("events");
//   if (!aboutSection || !eventsSection) return;

//   const vh = window.innerHeight;

//   // Morph starts: when #about top hits the middle of the screen
//   // Morph ends:   when #events top hits the top of the screen
//   // — the full scroll distance between these two points is your transition window
//   const morphStart = aboutSection.getBoundingClientRect().top - vh * 0.5;
//   const morphEnd   = eventsSection.getBoundingClientRect().top;

//   const range    = morphEnd - morphStart;
//   const progress = Math.max(0, Math.min(1, -morphStart / range));
//   targetT = progress;
// };
//       window.addEventListener("scroll", onScroll, { passive: true });

//       // ── Animate ───────────────────────────────────────
//       let t = 0;
//       let rafId: number;

//       const animate = () => {
//         rafId = requestAnimationFrame(animate);
//         t += 0.008;

//         // Smooth lerp + cubic ease-in-out
//         morphT += (targetT - morphT) * 0.025;
//         const e = morphT < 0.5
//           ? 4 * morphT * morphT * morphT
//           : 1 - Math.pow(-2 * morphT + 2, 3) / 2;

//         // ── Torus fades out ──────────────────────────
//         torusMat.opacity  = 1 - e;
//         torusMat.emissiveIntensity = (0.12 + Math.sin(t * 2) * 0.06) * (1 - e);
//         wireMat.opacity   = (1 - e) * 0.15;
//         torusKnot.visible = e < 0.99;
//         wireKnot.visible  = e < 0.99;
//         torusKnot.scale.setScalar(1 - e * 0.6);

//         const sharedRotX = t * 0.3 + my * 0.3;
//         const sharedRotY = t * 0.5 + mx * 0.3;
//         torusKnot.rotation.x = sharedRotX;
//         torusKnot.rotation.y = sharedRotY;
//         wireKnot.rotation.x  = sharedRotX;
//         wireKnot.rotation.y  = sharedRotY;

//         // ── Rose fades in ────────────────────────────
//         roseMat.opacity      = e;
//         roseWireMat.opacity  = e * 0.12;
//         roseMesh.visible     = e > 0.01;
//         roseWireMesh.visible = e > 0.01;

//         // Darker, gentler emissive pulse
//         roseMat.emissiveIntensity = (0.06 + Math.sin(t * 2.5) * 0.03) * e;

//         // Bloom in from small, settle at natural size
//         const roseScale = 0.05 + e * 1.05;
//         roseMesh.scale.setScalar(roseScale);
//         roseWireMesh.scale.setScalar(roseScale);

//         // Graceful slow rotation
//         roseMesh.rotation.x     = t * 0.15 + my * 0.15;
//         roseMesh.rotation.y     = t * 0.22 + mx * 0.15;
//         roseMesh.rotation.z     = t * 0.06;
//         roseWireMesh.rotation.x = roseMesh.rotation.x;
//         roseWireMesh.rotation.y = roseMesh.rotation.y;
//         roseWireMesh.rotation.z = roseMesh.rotation.z;

//         // Rose lights — soft, not overpowering
//         rosePl.intensity  = e * 2.0;
//         rosePl2.intensity = e * 1.5;
//         rosePl.position.x  = Math.cos(t * 1.1) * 3.5;
//         rosePl.position.y  = Math.sin(t * 0.8) * 2.5;
//         rosePl2.position.x = Math.cos(t * 0.7 + Math.PI) * 3;
//         rosePl2.position.y = Math.sin(t * 1.0 + 1) * 2;

//         // ── Shared scene elements ────────────────────
//         icoGroup.children.forEach((m: any) => {
//           m.userData.theta += m.userData.speed;
//           m.position.x = m.userData.r * Math.sin(m.userData.phi) * Math.cos(m.userData.theta);
//           m.position.y = m.userData.r * Math.sin(m.userData.phi) * Math.sin(m.userData.theta);
//           m.rotation.x += 0.01; m.rotation.y += 0.012;
//         });

//         ring1.rotation.z = t * 0.2;
//         ring2.rotation.z = -t * 0.15;
//         ring1.rotation.y = t * 0.1 + mx * 0.2;
//         pl1.position.x   = Math.cos(t) * 4;
//         pl1.position.y   = Math.sin(t * 0.7) * 3;
//         pl2.position.x   = Math.cos(t + Math.PI) * 3;
//         pl2.position.y   = Math.sin(t * 0.5 + 1) * 2;

//         renderer.render(scene, camera);
//       };
//       animate();

//       // ── Cleanup ───────────────────────────────────────
//       (canvas as any)._threeCleanup = () => {
//         cancelAnimationFrame(rafId);
//         document.removeEventListener("mousemove", onMouse);
//         window.removeEventListener("resize", onResize);
//         window.removeEventListener("scroll", onScroll);
//         renderer.dispose();
//         roseMat.dispose();
//         roseWireMat.dispose();
//       };
//     };
//     document.head.appendChild(script);

//     return () => {
//       const cleanup = (canvas as any)._threeCleanup;
//       if (cleanup) cleanup();
//       if (script.parentNode) script.parentNode.removeChild(script);
//     };
//   }, []);

//   return (
//     <canvas
//       ref={canvasRef}
//       style={{
//         position: "fixed",
//         top: 0, right: 0,
//         width: "clamp(280px, 55%, 55%)",
//         height: "100vh",
//         zIndex: 0,
//         pointerEvents: "none",
//         opacity: 0.82,
//       }}
//       className="three-canvas"
//     />
//   );
// }

// // ── Fade-in wrapper ────────────────────────────────────
// function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [vis, setVis] = useState(false);
//   useEffect(() => {
//     const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
//     if (ref.current) obs.observe(ref.current);
//     return () => obs.disconnect();
//   }, []);
//   return (
//     <div
//       ref={ref}
//       className={className}
//       style={{
//         opacity: vis ? 1 : 0,
//         transform: vis ? "translateY(0)" : "translateY(28px)",
//         transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
//       }}
//     >
//       {children}
//     </div>
//   );
// }

// function CompRow({ index, comp }: { index: number; comp: { icon: string; title: string; desc: string; prize: string } }) {
//   const [open, setOpen] = useState(false);
//   const id = String(index + 1).padStart(2, "0");
 
//   return (
//     <div
//       className={`comp-row ${open ? "comp-row-open" : ""}`}
//       onClick={() => setOpen(v => !v)}
//     >
//       {/* ── collapsed: single line ── */}
//       <div className="comp-row-header">
//         <span className="comp-row-id">[{id}]</span>
//         <span className="comp-row-icon">{comp.icon}</span>
//         <span className="comp-row-name">{comp.title.toUpperCase()}</span>
//         <span className="comp-row-prize">{comp.prize}</span>
//         <span className="comp-row-chevron">{open ? "▼" : "▶"}</span>
//       </div>
 
//       {/* ── expanded: full detail panel ── */}
//       <div className="comp-row-body">
//         <div className="comp-row-body-inner">
 
//           <div className="comp-detail-left">
//             <div className="comp-detail-label">// description</div>
//             <div className="comp-detail-desc">{comp.desc}</div>
//           </div>
 
//           <div className="comp-detail-right">
//             <div className="comp-detail-prize-big">{comp.prize}</div>
//             <div className="comp-detail-label" style={{ marginTop: "1rem" }}>// status</div>
//             <div className="comp-detail-status">
//               <span className="comp-status-dot" />
//               REGISTRATION OPEN
//             </div>
//             <Link
//               href="/register"
//               className="comp-detail-btn"
//               onClick={e => e.stopPropagation()}
//             >
//               <span>INITIALIZE REGISTRATION</span>
//               <span className="comp-detail-btn-arr">▶</span>
//             </Link>
//           </div>
 
//         </div>
//       </div>
//     </div>
//   );
// }

// // ══════════════════════════════════════════════════════
// export default function LandingPage() {
//   const { userData } = useContext(UserContext);
//   const [activeComp, setActiveComp] = useState(0);
//   const [loaded, setLoaded]       = useState(false);
//   const [loaderDone, setLoaderDone] = useState(false);
//   const [scrolled, setScrolled]   = useState(false);

//   //video autoplay
//   const videoRef = useRef<HTMLVideoElement>(null);
// useEffect(() => {
//   const video = videoRef.current;
//   if (!video) return;

//   const observer = new IntersectionObserver(
//     ([entry]) => {
//       if (entry.isIntersecting) {
//         video.muted = false;
//         video.play().catch(() => {
//           // browser blocked unmuted — fall back to muted autoplay
//           video.muted = true;
//           video.play().catch(() => {});
//         });
//       } else {
//         video.pause();
//         video.muted = false;   // reset for next time
//       }
//     },
//     { threshold: 0.5 }
//   );

//   observer.observe(video);
//   return () => observer.disconnect();
// }, []);

//   // Loader
//   useEffect(() => {
//     const t = setTimeout(() => setLoaded(true), 2200);
//     const t2 = setTimeout(() => setLoaderDone(true), 2800);
//     return () => { clearTimeout(t); clearTimeout(t2); };
//   }, []);

//   // Scroll shadow on nav + mobile background blur past hero
//   const [pastHero, setPastHero] = useState(false);
//   useEffect(() => {
//     const handler = () => {
//       setScrolled(window.scrollY > 20);
//       // Only track on mobile (≤900px)
//       if (window.innerWidth <= 900) {
//         setPastHero(window.scrollY > window.innerHeight * 0.85);
//       } else {
//         setPastHero(false);
//       }
//     };
//     window.addEventListener("scroll", handler, { passive: true });
//     return () => window.removeEventListener("scroll", handler);
//   }, []);

//   // Custom cursor
//   useEffect(() => {
//     const cursor = document.getElementById("cy-cursor");
//     const trail  = document.getElementById("cy-cursor-trail");
//     if (!cursor || !trail) return;
//     let mx = 0, my = 0, tx = 0, ty = 0;
//     const onMove = (e: MouseEvent) => {
//       mx = e.clientX; my = e.clientY;
//       cursor.style.left = mx + "px";
//       cursor.style.top  = my + "px";
//     };
//     document.addEventListener("mousemove", onMove);
//     const id = setInterval(() => {
//       tx += (mx - tx) * 0.15;
//       ty += (my - ty) * 0.15;
//       trail.style.left = tx + "px";
//       trail.style.top  = ty + "px";
//     }, 16);
//     return () => {
//       document.removeEventListener("mousemove", onMove);
//       clearInterval(id);
//     };
//   }, []);
//   const competitions = [
//     { icon: "⌨", title: "Computer Fundamentals Quiz", desc: "Test your grasp on CS basics in a challenging quiz. Think fast, answer faster!", prize: "₹8,000 PRIZE" },
//     { icon: "⚡", title: "Typing Speed Challenge",     desc: "Compete to type swiftly and accurately. The fastest fingers claim glory.",          prize: "₹3,000 PRIZE" },
//     { icon: "🧩", title: "Code Debugging",             desc: "Spot the bugs and fix them faster than anyone. Debug to dominate.",                 prize: "₹5,000 PRIZE" },
//     { icon: "🤖", title: "AI Hackathon",               desc: "Build an AI-powered solution in 24 hours. Innovate or perish.",                    prize: "₹15,000 PRIZE" },
//     { icon: "🔒", title: "CTF Challenge",              desc: "Capture the Flag cybersecurity battle. Crack the system.",                         prize: "₹8,000 PRIZE" },
//     { icon: "◉",  title: "Circuit Design",             desc: "Design and simulate embedded circuits under time pressure.",                        prize: "₹6,000 PRIZE" },
//     { icon: "🎬", title: "Tech Reel",                  desc: "Craft a captivating video reel on technology trends. Capture the vibe!",           prize: "₹2,000 PRIZE" },
//     { icon: "🎮", title: "PUBG / Valorant",            desc: "Battle it out in a gaming tournament. Dominate the field!",                        prize: "₹3,000 PRIZE" },
//   ];

//   return (
//     <>
//       {/* ══ LOADER ══════════════════════════════════ */}
//       {!loaderDone && (
//         <div className={`loader ${loaded ? "loader-hide" : ""}`}>
//           <div className="loader-logo">SCSE</div>
//           <div className="loader-text">Initializing System...</div>
//           <div className="loader-bar-wrap"><div className="loader-bar" /></div>
//           <div className="loader-sub">NIT JAMSHEDPUR // CSE DEPARTMENT</div>
//         </div>
//       )}

//       {/* ══ CUSTOM CURSOR ═══════════════════════════ */}
//       <div id="cy-cursor" />
//       <div id="cy-cursor-trail" />

//       {/* ══ BACKGROUNDS ═════════════════════════════ */}
//       <div className={`grid-bg${pastHero ? " mob-blur" : ""}`} />
//       <div className={`scanlines${pastHero ? " mob-blur" : ""}`} />
//       <div className={`noise-overlay${pastHero ? " mob-blur" : ""}`} />
//       {/* Navbar underglow */}
//       <div className="nav-underglow" />
//       <div className="corner-glow" />

//       {/* ══ THREE.JS 3D SCENE ═══════════════════════ */}
//       <ThreeScene />

//       {/* Floating data stream */}
//       <div className="data-stream" aria-hidden>
//         <span className="ds-item">0x4E4954 // JAMSHEDPUR</span>
//         <span className="ds-item">XAVENIR.25 // LIVE</span>
//         <span className="ds-item">CSE // DEPT.NODE</span>
//       </div>

//       {/* ══ HERO ════════════════════════════════════ */}
//       <section id="hero" className="hero">
//         <div className="hero-content">
//           <div className="hero-tag">
//             <span className="hero-tag-line" />
//             NIT Jamshedpur
//           </div>

//           <h1 className="hero-title">
//             <span className="ht-society glitch" data-text="SOCIETY OF">SOCIETY OF</span>
//             <span className="ht-cs glitch" data-text="COMPUTER SCIENCE">COMPUTER SCIENCE</span>
//             <span className="ht-eng glitch" data-text="& ENGINEERING">&amp; ENGINEERING</span>
//           </h1>

//           <p className="hero-sub">
//             <span>CODE</span> | <span>CREATE</span> | <span>CONQUER</span><br />
//             The frontier where algorithms meet ambition.<br />
//             Join the nexus of tomorrow's innovators.
//           </p>

//           <div className="btn-group">
//             <a href="#events" className="btn-primary">
//               <span>// Explore</span>
//             </a>
//             <a href="#about" className="btn-outline">Know More</a>
//           </div>
//         </div>

//         {/* Stats bar */}
//         <div className="stats-bar">
//           <div className="stat">
//             <StatNum target={78772} />
//             <span className="stat-label">Visitors</span>
//           </div>
//           <div className="stat-divider" />
//           <div className="stat">
//             <StatNum target={12} />
//             <span className="stat-label">Events</span>
//           </div>
//           <div className="stat-divider" />
//           <div className="stat">
//             <span className="stat-num">₹50K+</span>
//             <span className="stat-label">Prize Pool</span>
//           </div>
//           <div className="stat-divider" />
//           <div className="stat">
//             <StatNum target={500} />
//             <span className="stat-label">Participants</span>
//           </div>
//         </div>
//       </section>

//       {/* ══ ABOUT ═══════════════════════════════════ */}
//       <section id="about" className="section">
//         <span className="section-label">// sys.info()</span>
//         <FadeIn className="about-grid">
//           <div>
//             <h2 className="section-title">Who <span className="accent">Are</span> We?</h2>
//             <div className="about-text">
//               <p>
//                 The Society of Computer Science and Engineering (SCSE) is a dynamic community of
//                 tech enthusiasts, innovators, and learners at NIT Jamshedpur. We operate at the
//                 intersection of code and creativity.
//               </p>
//               <p>
//                 We foster a culture of knowledge-sharing, problem-solving, and relentless innovation —
//                 shaping the architects of tomorrow's technology landscape.
//               </p>
//               <Link href="/about" className="btn-primary" style={{ display: "inline-flex", marginTop: "0.5rem" }}>
//                 <span>// Archives</span>
//               </Link>
//             </div>
//           </div>

//           <div className="cyber-panel">
//             <div className="cp-corner tl" />
//             <div className="cp-corner br" />
//             <div className="cp-status">SYSTEM.STATUS // ONLINE</div>
//             <div className="cp-grid">
//               <div>
//                 <div className="cp-big cp-cyan">XAVENIR</div>
//                 <div className="cp-small">ANNUAL TECH FEST</div>
//               </div>
//               <div>
//                 <div className="cp-big cp-pink">'26</div>
//                 <div className="cp-small">CURRENT EDITION</div>
//               </div>
//             </div>
//             <div className="cp-details">
//               <div>► THEME: <span className="cp-hl">CODE TO THE FUTURE</span></div>
//               <div>► VENUE: <span className="cp-hl">NIT JAMSHEDPUR</span></div>
//               <div>► STATUS: <span className="cp-active">ACTIVE ●</span></div>
//             </div>
//           </div>
//         </FadeIn>
//       </section>



//       {/* ══ VIDEO SHOWCASE ══════════════════════════ */}
//       <section id="aftermovie" className="section section-dark">
//         <span className="section-label">// media.play()</span>
//         <FadeIn>
//           <h2 className="section-title">
//             <span className="accent">Teaser</span>
//           </h2>
//           <p className="video-subtitle">
//             Relive the energy of Xavenir — the Exuberant fest at NIT Jamshedpur.
//           </p>
//         </FadeIn>

//         <FadeIn delay={120} className="video-grid">

//           {/* ── Main featured video ── */}
//           <div className="video-featured">
//             <div className="video-card-label">// XAVENIR '26 — OFFICIAL TEASER</div>
//             <div className="video-frame-wrap video-frame-large">
//               {/* Replace the src with embed URL */}


//                   <video
//                       ref={videoRef}
//                       src="teaser2.mp4"
//                       className="video-iframe"
//                       loop
//                       playsInline
//                       controls
//                     />

//               {/* <iframe
//                 src="teaser2.mp4"
//                 title="Xavenir Aftermovie"
//                 allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
//                 allowFullScreen
//                 className="video-iframe"
//               /> */}

//                   {/* <div className="video-frame-wrap video-frame-large">
//                   <iframe
//                     src="https://www.instagram.com/reel/DHy0nOXMpMf/embed"
//                     className="video-iframe"
//                     allow="autoplay; encrypted-media"
//                     allowFullScreen
//                   />             
//                   </div> */}
            
//             </div>
//             <div className="video-meta">
//               <span className="video-tag">Teaser</span>
//               <span className="video-duration">◈ XAVENIR 2026</span>
//             </div>
//           </div>

//           {/* ── Side teasers ── */}
          
//         </FadeIn>
//       </section>


//         {/* ══ TIMELINE ════════════════════════════════ */}
//       <section id="events" className="section section-dark">
//         <span className="section-label">// timeline.render()</span>
//         <FadeIn><h2 className="section-title"><span className="accent">Event</span> Timeline</h2></FadeIn>

//         <FadeIn delay={100} className="timeline">
//           <div className="timeline-card timeline-card-active">
//             <div className="tc-date">// NODE_01</div>
//             <div className="tc-title">Pre Xavenir</div>
//             <div className="tc-date" style={{ color: "var(--cyan)", fontSize: "1.05rem", fontFamily: "'Orbitron',monospace", fontWeight: 700 }}>April 4th, 2026</div>
//             <div className="tc-desc">You are here. The future of tech is being written now.</div>
//             <div className="tc-status">System Online</div>
//           </div>
//           <div className="timeline-card">
//             <div className="tc-date">18 April 2025</div>
//             <div className="tc-title">Day 1</div>
//             <div className="tc-desc">Exciting workshops, tech talks, and mini-competitions to prepare you for the main event. The perfect tech warm-up.</div>
//             <div className="tc-tag">FUN EVENTS &amp; COMPETITIONS</div>
//           </div>
//           <div className="timeline-card">
//             <div className="tc-date">19 April 2025</div>
//             <div className="tc-title">Day 2</div>
//             <div className="tc-desc">Exciting workshops, tech talks, and mini-competitions to prepare you for the main event. The perfect tech warm-up.</div>
//             <div className="tc-tag">FUN EVENTS &amp; COMPETITIONS</div>
//           </div>
//           <div className="timeline-card">
//             <div className="tc-date">20 April 2025</div>
//             <div className="tc-title">Day 3</div>
//             <div className="tc-desc">The premier tech fest of the CSE Department. Where legends are made and futures are forged.</div>
//             <div className="tc-tag tc-tag-pink">MAIN EVENT // PREMIER FEST</div>
//           </div>
//         </FadeIn>
//       </section>

// {/* ══ COMPETITIONS ════════════════════════════════════ */}
 
 
// <section id="competitions" className="section comp-section">
//   <span className="section-label">// competitions.load()</span>
//   <FadeIn>
//     <h2 className="section-title">Active <span className="accent">Competitions</span></h2>
//   </FadeIn>
 
//   <FadeIn delay={100} className="comp-terminal">
 
//     {/* Terminal header bar */}
//     <div className="comp-term-bar">
//       <div className="comp-term-dots">
//         <span /><span /><span />
//       </div>
//       <div className="comp-term-title">xavenir@nitjsr:~/competitions$</div>
//       <div className="comp-term-status">8 PROCESSES LOADED</div>
//     </div>
 
//     {/* Competition rows */}
//     <div className="comp-list">
//       {competitions.map((c, i) => (
//         <CompRow key={i} index={i} comp={c} />
//       ))}
//     </div>
 
//     {/* Bottom prompt line */}
//     <div className="comp-prompt">
//       <span className="comp-prompt-symbol">❯</span>
//       <span className="comp-prompt-text">select a competition to initialize registration_</span>
//     </div>
 
//   </FadeIn>
// </section>

//       {/* ══ CTA BAND ════════════════════════════════ */}
//       <section className="cta-band">
//         <FadeIn className="cta-inner">
//           <div className="cta-line" />
//           <div>
//             <div className="cta-label">// ready.to.compete()</div>
//             <h2 className="cta-title">Code to the <span className="accent">Future</span></h2>
//             <p className="cta-sub">Register now and be part of the biggest tech fest at NIT Jamshedpur.</p>
//           </div>
//           <div className="btn-group" style={{ justifyContent: "center" }}>
//             {userData ? (
//               <>
//                 <Link href="/dashboard" className="btn-primary"><span>/ Dashboard /</span></Link>
//                 <button
//                   className="btn-outline"
//                   onClick={async () => {
//                     await fetch("/api/auth/logout", { method: "POST" });
//                     window.location.href = "/";
//                   }}
//                 >
//                   / Logout /
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/register" className="btn-primary"><span>/ Register /</span></Link>
//                 <Link href="/login" className="btn-outline"> / Login / </Link>
//               </>
//             )}
//           </div>
//           <div className="cta-line cta-line-right" />
//         </FadeIn>
//       </section>
//       <PageStyles />
//     </>
//   );
// }

// // ══════════════════════════════════════════════════════
// function PageStyles() {
//   return (
//     <style>{`
//       @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

//       :root {
//         --cyan:   #00f5ff;
//         --pink:   #ff0080;
//         --purple: #bf00ff;
//         --yellow: #ffff00;
//         --dark:   #020010;
//         --panel:  rgba(0,5,30,0.78);
//         --nav-h:  70px;
//       }

//       /* ── CUSTOM CURSOR ── */
//       *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; cursor: none !important; }
//       #cy-cursor {
//         width: 12px; height: 12px;
//         border: 2px solid var(--cyan);
//         border-radius: 50%;
//         position: fixed; pointer-events: none; z-index: 99999;
//         transform: translate(-50%, -50%);
//         transition: transform 0.08s ease, border-color 0.2s;
//         box-shadow: 0 0 10px var(--cyan), 0 0 4px var(--cyan);
//       }
//       #cy-cursor-trail {
//         width: 32px; height: 32px;
//         border: 1px solid rgba(0,245,255,0.35);
//         border-radius: 50%;
//         position: fixed; pointer-events: none; z-index: 99998;
//         transform: translate(-50%, -50%);
//         transition: left 0s, top 0s;
//       }
//       html { scroll-behavior: smooth; }
//       body {
//         font-family: 'Rajdhani', sans-serif;
//         background: var(--dark); color: #e0e0ff;
//         overflow-x: hidden; min-height: 100vh;
//       }

//       /* ── LOADER ── */
//       .loader {
//         position: fixed; inset: 0; z-index: 9999;
//         background: var(--dark);
//         display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem;
//         transition: opacity 0.6s ease;
//       }
//       .loader-hide { opacity: 0; pointer-events: none; }
//       .loader-logo {
//         font-family: 'Orbitron', monospace; font-size: 2.8rem; font-weight: 900;
//         color: var(--cyan); text-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,245,255,0.4);
//       }
//       .loader-text {
//         font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 5px;
//         color: var(--cyan); text-transform: uppercase;
//         animation: blink 1s step-start infinite;
//       }
//       .loader-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(0,245,255,0.4); }
//       .loader-bar-wrap { width: 280px; height: 2px; background: rgba(0,245,255,0.1); overflow: hidden; }
//       .loader-bar { height: 100%; background: linear-gradient(90deg,var(--cyan),var(--pink)); box-shadow: 0 0 10px var(--cyan); animation: load-fill 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }
//       @keyframes load-fill { from{width:0} to{width:100%} }
//       @keyframes blink { 50%{opacity:0} }

//       /* ── BACKGROUNDS ── */
//       .grid-bg {
//         position: fixed; inset: 0; z-index: -2; pointer-events: none;
//         background-image:
//           linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px),
//           linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px);
//         background-size: 60px 60px;
//       }
//       .scanlines {
//         position: fixed; inset: 0; z-index: -1; pointer-events: none;
//         background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px);
//       }
//       .noise-overlay {
//         position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0.3;
//         background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
//       }

//       /* ── DATA STREAM ── */
//       .data-stream {
//         position: fixed; right: 1.8rem; top: 50%; transform: translateY(-50%);
//         z-index: 5; display: flex; flex-direction: column; gap: 2rem; pointer-events: none;
//       }
//       .ds-item {
//         font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 2px;
//         color: rgba(0,245,255,0.28); writing-mode: vertical-lr;
//         animation: data-flow 3s ease-in-out infinite;
//       }
//       .ds-item:nth-child(2){animation-delay:1s} .ds-item:nth-child(3){animation-delay:2s}
//       @keyframes data-flow { 0%,100%{opacity:0.18} 50%{opacity:0.65} }

//       /* ── NAV ── */
//       .nav {
//         position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
//         height: var(--nav-h); padding: 0 3rem;
//         display: flex; align-items: center; justify-content: space-between;
//         background: rgba(2,0,16,0.88);
//         border-bottom: 1px solid rgba(0,245,255,0.18);
//         backdrop-filter: blur(20px);
//         transition: background 0.3s;
//       }
//       .nav-scrolled { background: rgba(2,0,16,0.98); }
//       .nav::after {
//         content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
//         background: linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent);
//         animation: nav-scan 4s linear infinite;
//       }
//       @keyframes nav-scan { 0%,100%{opacity:0.4} 50%{opacity:1} }
//       .logo {
//         font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 900;
//         color: var(--cyan); text-shadow: 0 0 18px var(--cyan), 0 0 36px rgba(0,245,255,0.4);
//         letter-spacing: 4px; text-decoration: none;
//       }
//       .nav-links { display: flex; gap: 1.8rem; list-style: none; }
//       .nav-links a {
//         font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.75); text-decoration: none; text-transform: uppercase;
//         padding: 4px 0; position: relative; transition: color 0.2s;
//       }
//       .nav-links a::after {
//         content: ''; position: absolute; bottom: -2px; left: 0;
//         width: 0; height: 1px; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
//         transition: width 0.3s;
//       }
//       .nav-links a:hover { color: var(--cyan); }
//       .nav-links a:hover::after { width: 100%; }
//       .nav-right { display: flex; align-items: center; gap: 10px; }
//       .nav-cta {
//         font-family: 'Orbitron', monospace; font-size: 0.68rem; letter-spacing: 2px;
//         padding: 8px 20px; border: 1px solid var(--pink); color: var(--pink);
//         text-decoration: none; text-transform: uppercase;
//         transition: all 0.3s; white-space: nowrap;
//       }
//       .nav-cta:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }
//       .nav-cta-register { border-color: var(--cyan); color: var(--cyan); background: rgba(0,245,255,0.06); }
//       .nav-cta-register:hover { background: var(--cyan); color: #000; box-shadow: 0 0 20px var(--cyan); }

//       /* ── NAV UNDERGLOW ── */
//       .nav-underglow {
//         position: fixed; top: 70px; left: 0; right: 0;
//         height: 220px; pointer-events: none; z-index: 1;
//         background: linear-gradient(180deg,rgba(0,245,255,0.07) 0%,rgba(0,180,255,0.06) 25%,rgba(191,0,255,0.025) 55%,transparent 100%);
//         filter: blur(8px);
//       }

//       /* ── CORNER GLOW ── */
//       .corner-glow {
//         position: fixed; bottom: 0; right: 0;
//         width: 70vw; height: 70vh;
//         pointer-events: none; z-index: 0;
//         background: radial-gradient(ellipse at bottom right,rgba(0,245,255,0.13) 0%,rgba(191,0,255,0.08) 40%,transparent 70%);
//         animation: corner-pulse 6s ease-in-out infinite;
//       }
//       @keyframes corner-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }

//       /* ── HAMBURGER ── */
//       .hamburger {
//         display: none; flex-direction: column; justify-content: center; align-items: center;
//         gap: 5px; width: 36px; height: 36px;
//         background: transparent; border: 1px solid rgba(0,245,255,0.2);
//         cursor: pointer; padding: 7px; transition: border-color 0.2s;
//       }
//       .hamburger:hover { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.2); }
//       .hamburger span { display: block; width: 18px; height: 1.5px; background: var(--cyan); transition: all 0.3s; transform-origin: center; }
//       .hamburger-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
//       .hamburger-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
//       .hamburger-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

//       /* ── MOBILE NAV ── */
//       .mobile-nav {
//         position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 900;
//         max-height: 0; overflow: hidden;
//         background: rgba(2,0,18,0.99); border-bottom: 1px solid rgba(0,245,255,0.12);
//         backdrop-filter: blur(24px);
//         transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
//       }
//       .mobile-nav-open { max-height: 90vh; overflow-y: auto; }
//       .mob-link {
//         display: flex; align-items: center; gap: 14px;
//         padding: 14px 24px; text-decoration: none;
//         font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; letter-spacing: 2px;
//         color: rgba(200,220,255,0.6); border-bottom: 1px solid rgba(0,245,255,0.05);
//         transition: all 0.18s; animation: mob-in 0.3s ease both; opacity: 0;
//       }
//       .mobile-nav-open .mob-link { opacity: 1; }
//       .mob-link:hover { color: var(--pink); padding-left: 32px; }
//       .mob-link:hover .mob-link-arr { opacity: 1; transform: none; }
//       .mob-link-icon { font-size: 10px; color: rgba(0,245,255,0.3); width: 14px; text-align: center; }
//       .mob-link-arr { margin-left: auto; color: var(--pink); opacity: 0; transform: translateX(-4px); transition: all 0.18s; }
//       .mob-cta {
//         display: flex; align-items: center; justify-content: center;
//         margin: 16px 24px 24px;
//         font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px;
//         padding: 13px; border: 1px solid var(--pink); color: var(--pink);
//         text-decoration: none; text-transform: uppercase; transition: all 0.25s;
//         animation: mob-in 0.3s ease both; opacity: 0;
//       }
//       .mobile-nav-open .mob-cta { opacity: 1; }
//       .mob-cta:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }
//       .mob-backdrop { position: fixed; inset: 0; z-index: 800; background: rgba(0,0,0,0.5); }
//       @keyframes mob-in { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }

//       /* ── BUTTONS ── */
//       .btn-group { display: flex; gap: 1.5rem; flex-wrap: wrap; }
//       .btn-primary {
//         font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 3px;
//         padding: 14px 36px; font-weight: 700; text-decoration: none; text-transform: uppercase;
//         background: linear-gradient(135deg, var(--cyan), var(--purple));
//         color: #000; border: none;
//         clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
//         transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; display: inline-flex; align-items: center;
//       }
//       .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,var(--pink),var(--purple)); opacity: 0; transition: opacity 0.3s; }
//       .btn-primary:hover::before { opacity: 1; }
//       .btn-primary:hover { box-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,245,255,0.25); transform: translateY(-2px); }
//       .btn-primary span { position: relative; z-index: 1; }
//       .btn-outline {
//         font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 3px;
//         padding: 13px 35px; background: transparent; color: var(--pink);
//         border: 1px solid var(--pink); text-decoration: none; text-transform: uppercase;
//         clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
//         transition: all 0.3s; cursor: pointer; display: inline-flex; align-items: center;
//       }
//       .btn-outline:hover { background: var(--pink); color: #000; box-shadow: 0 0 28px var(--pink); transform: translateY(-2px); }

//       /* ── HERO ── */
//       .hero {
//         min-height: 100vh; padding: 120px 5rem 80px;
//         display: flex; flex-direction: column; justify-content: center;
//         position: relative; z-index: 1;
//       }
//       .hero-content { max-width: 700px; }
//       .hero-tag {
//         font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; letter-spacing: 4px;
//         color: var(--pink); text-transform: uppercase; margin-bottom: 1.5rem;
//         display: flex; align-items: center; gap: 12px;
//       }
//       .hero-tag-line { display: inline-block; width: 20px; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink); flex-shrink: 0; }
//       .hero-title {
//         font-family: 'Orbitron', monospace; font-size: clamp(2.6rem,5.5vw,5.2rem);
//         font-weight: 900; line-height: 1; margin-bottom: 1.5rem;
//       }
//       .ht-society { display: block; color: var(--cyan); font-size: 0.94em; text-shadow: 0 0 18px rgba(0,245,255,0.55), 0 0 6px rgba(0,245,255,0.3); }
//       .ht-cs      { display: block; color: #fff; font-size: 0.66em; text-shadow: 0 0 20px rgba(0,245,255,0.15); }
//       .ht-eng     { display: block; color: var(--pink); font-size: 0.88em; text-shadow: 0 0 8px rgba(255,0,128,0.8), 0 0 25px rgba(255,0,128,0.2); }

//       /* ── GLITCH ── */
//       .glitch { position: relative; animation: glitch-base 8s infinite; }
//       .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; }
//       .glitch::before { color: var(--pink); animation: glitch-1 8s infinite; clip-path: polygon(0 0,100% 0,100% 33%,0 33%); opacity: 0; }
//       .glitch::after  { color: var(--cyan); animation: glitch-2 8s infinite; clip-path: polygon(0 66%,100% 66%,100% 100%,0 100%); opacity: 0; }
//       @keyframes glitch-base { 0%,92%,100%{transform:none} 93%{transform:skewX(-1deg)} 96%{transform:skewX(1deg)} }
//       @keyframes glitch-1 { 0%,91%,100%{opacity:0;transform:none} 92%{opacity:0.7;transform:translate(-3px,0)} 93%{opacity:0} 95%{opacity:0.5;transform:translate(3px,0)} 96%{opacity:0} }
//       @keyframes glitch-2 { 0%,91%,100%{opacity:0;transform:none} 93%{opacity:0.7;transform:translate(3px,0)} 94%{opacity:0} 96%{opacity:0.5;transform:translate(-3px,0)} 97%{opacity:0} }
//       .ht-cs.glitch { animation-delay: 1.5s; }
//       .ht-cs.glitch::before, .ht-cs.glitch::after { animation-delay: 1s; }
//       .ht-eng.glitch { animation-delay: 5s; }
//       .ht-eng.glitch::before, .ht-eng.glitch::after { animation-delay: 5s; }

//       .hero-sub {
//         font-family: 'Share Tech Mono', monospace; font-size: 0.95rem;
//         color: rgba(180,200,255,0.65); margin-bottom: 2.5rem; letter-spacing: 2px; line-height: 2;
//       }
//       .hero-sub span { color: var(--cyan); }

//       /* ── STATS ── */
//       .stats-bar { display: flex; gap: 2.5rem; align-items: center; margin-top: 4rem; flex-wrap: wrap; }
//       .stat { text-align: center; }
//       .stat-num { font-family: 'Orbitron', monospace; font-size: 2rem; font-weight: 900; color: var(--cyan); text-shadow: 0 0 16px var(--cyan); display: block; }
//       .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: rgba(180,200,255,0.5); text-transform: uppercase; }
//       .stat-divider { width: 1px; height: 40px; background: rgba(0,245,255,0.2); }

//       /* ── SECTIONS ── */
//       .section { padding: 100px 5rem; position: relative; z-index: 1; }
//       .section-dark { background: rgba(0,0,20,0.5); }
//       .section-label { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 5px; color: var(--pink); text-transform: uppercase; margin-bottom: 1rem; display: block; }
//       .section-title { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,3.5vw,3.2rem); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 2rem; }
//       .accent { color: var(--cyan); }

//       /* ── ABOUT ── */
//       .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
//       .about-text { font-size: 1.05rem; line-height: 1.85; color: rgba(180,200,255,0.75); }
//       .about-text p { margin-bottom: 1.5rem; }
//       .cyber-panel {
//         background: var(--panel); border: 1px solid rgba(0,245,255,0.15);
//         padding: 2.5rem; position: relative;
//         clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
//       }
//       .cyber-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),transparent); box-shadow: 0 0 10px var(--cyan); }
//       .cp-corner { position: absolute; width: 16px; height: 16px; }
//       .cp-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 10px var(--cyan); }
//       .cp-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 10px var(--pink); }
//       .cp-status { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; color: rgba(0,245,255,0.4); letter-spacing: 2px; margin-bottom: 1.5rem; }
//       .cp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
//       .cp-big { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; }
//       .cp-cyan { color: var(--cyan); text-shadow: 0 0 16px var(--cyan); }
//       .cp-pink { color: var(--pink); text-shadow: 0 0 16px var(--pink); }
//       .cp-small { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: rgba(180,200,255,0.5); margin-top: 0.3rem; }
//       .cp-details { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,245,255,0.1); font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.6); line-height: 2.2; }
//       .cp-hl { color: var(--cyan); }
//       .cp-active { color: #00ff88; text-shadow: 0 0 8px #00ff88; }

//       /* ── TIMELINE ── */
//       .timeline { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 2.5rem; }
//       .timeline-card {
//         background: var(--panel); border: 1px solid rgba(0,245,255,0.1);
//         padding: 2rem; position: relative;
//         clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
//         transition: all 0.3s;
//       }
//       .timeline-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(0,245,255,0.04),rgba(191,0,255,0.04)); opacity: 0; transition: opacity 0.3s; }
//       .timeline-card:hover::before { opacity: 1; }
//       .timeline-card:hover { border-color: rgba(0,245,255,0.4); transform: translateY(-4px); box-shadow: 0 10px 40px rgba(0,245,255,0.08); }
//       .timeline-card-active { border-color: var(--cyan); box-shadow: 0 0 28px rgba(0,245,255,0.18); }
//       .tc-date { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: var(--pink); margin-bottom: 0.5rem; }
//       .tc-title { font-family: 'Orbitron', monospace; font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
//       .tc-desc { font-size: 0.9rem; color: rgba(180,200,255,0.6); line-height: 1.6; }
//       .tc-status { margin-top: 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; display: inline-flex; align-items: center; gap: 8px; color: var(--cyan); text-transform: uppercase; }
//       .tc-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); animation: pulse 1.5s ease infinite; }
//       .tc-tag { margin-top: 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }
//       .tc-tag-pink { color: rgba(255,0,128,0.7); }
//       @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }

//       /* ── VIDEO SHOWCASE ── */
//       .video-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.82rem; letter-spacing: 2px; color: rgba(180,200,255,0.5); margin-top: -1rem; margin-bottom: 2.5rem; line-height: 1.8; }
//       .video-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2rem; align-items: start; }
//       .video-card-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: rgba(0,245,255,0.4); margin-bottom: 0.8rem; }
//       .video-frame-wrap { position: relative; overflow: hidden; border: 1px solid rgba(0,245,255,0.15); background: rgba(0,0,20,0.8); }
//       .video-frame-wrap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 2; background: linear-gradient(90deg, var(--cyan), var(--purple), transparent); box-shadow: 0 0 10px var(--cyan); }
//       .video-scan-line { position: absolute; left: 0; right: 0; height: 2px; z-index: 3; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(0,245,255,0.35), transparent); animation: vid-scan 4s linear infinite; }
//       @keyframes vid-scan { 0%{top:0%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
//       .video-frame-large { aspect-ratio: 16/9; }
//       .video-frame-small { aspect-ratio: 16/9; }
//       .video-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; display: block; }
//       .video-frame-large::after, .video-frame-small::after { content: ''; display: block; padding-top: 56.25%; }
//       .video-corner { position: absolute; width: 14px; height: 14px; z-index: 4; }
//       .video-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
//       .video-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }
//       .video-frame-wrap:hover { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 30px rgba(0,245,255,0.08); transition: border-color 0.3s, box-shadow 0.3s; }
//       .video-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 0.7rem; }
//       .video-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; padding: 3px 10px; border: 1px solid rgba(0,245,255,0.3); color: var(--cyan); background: rgba(0,245,255,0.05); }
//       .video-tag-pink  { border-color: rgba(255,0,128,0.35); color: var(--pink); background: rgba(255,0,128,0.05); }
//       .video-tag-purple{ border-color: rgba(191,0,255,0.35); color: var(--purple); background: rgba(191,0,255,0.05); }
//       .video-duration { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 2px; color: rgba(180,200,255,0.35); }
//       .video-side { display: flex; flex-direction: column; }

//       /* ── COMPETITIONS ── */
//       .comp-section { padding-bottom: 120px; }
//       .comp-terminal { margin-top: 2.5rem; border: 1px solid rgba(0,245,255,0.18); background: rgba(0,3,20,0.85); position: relative; overflow: hidden; }
//       .comp-terminal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--cyan), var(--pink), var(--purple), transparent); }
//       .comp-term-bar { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; border-bottom: 1px solid rgba(0,245,255,0.1); background: rgba(0,245,255,0.03); }
//       .comp-term-dots { display: flex; gap: 6px; }
//       .comp-term-dots span { width: 10px; height: 10px; border-radius: 50%; }
//       .comp-term-dots span:nth-child(1) { background: #ff5f57; box-shadow: 0 0 6px #ff5f57; }
//       .comp-term-dots span:nth-child(2) { background: #febc2e; box-shadow: 0 0 6px #febc2e; }
//       .comp-term-dots span:nth-child(3) { background: #28c840; box-shadow: 0 0 6px #28c840; }
//       .comp-term-title { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: rgba(0,245,255,0.5); letter-spacing: 1px; flex: 1; }
//       .comp-term-status { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(0,245,255,0.3); }
//       .comp-list { display: flex; flex-direction: column; }
//       .comp-row { border-bottom: 1px solid rgba(0,245,255,0.06); cursor: pointer; transition: background 0.2s; position: relative; overflow: hidden; }
//       .comp-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--cyan), var(--pink)); opacity: 0; transition: opacity 0.3s; }
//       .comp-row:hover::before, .comp-row-open::before { opacity: 1; }
//       .comp-row:hover { background: rgba(0,245,255,0.03); }
//       .comp-row-open  { background: rgba(0,245,255,0.05); }
//       .comp-row-header { display: flex; align-items: center; gap: 1.2rem; padding: 1.1rem 1.8rem; transition: padding 0.2s; }
//       .comp-row-open .comp-row-header { padding-bottom: 0.8rem; }
//       .comp-row-id { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(0,245,255,0.3); min-width: 32px; }
//       .comp-row-icon { font-size: 1.3rem; filter: drop-shadow(0 0 5px var(--cyan)); min-width: 28px; text-align: center; }
//       .comp-row-name { font-family: 'Orbitron', monospace; font-size: 0.82rem; font-weight: 700; color: #e0e8ff; flex: 1; letter-spacing: 2px; transition: color 0.2s; }
//       .comp-row:hover .comp-row-name, .comp-row-open .comp-row-name { color: var(--cyan); }
//       .comp-row-prize { font-family: 'Orbitron', monospace; font-size: 0.78rem; font-weight: 700; color: var(--yellow); text-shadow: 0 0 8px rgba(255,255,0,0.4); letter-spacing: 1px; }
//       .comp-row-chevron { font-size: 0.6rem; color: rgba(0,245,255,0.4); transition: color 0.2s; min-width: 12px; }
//       .comp-row-open .comp-row-chevron { color: var(--cyan); }
//       .comp-row-body { max-height: 0; overflow: hidden; transition: max-height 0.45s cubic-bezier(0.4,0,0.2,1); }
//       .comp-row-open .comp-row-body { max-height: 200px; }
//       .comp-row-body-inner { display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: start; padding: 0.5rem 1.8rem 1.8rem 3.8rem; border-top: 1px solid rgba(0,245,255,0.07); }
//       .comp-detail-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: var(--pink); margin-bottom: 0.5rem; }
//       .comp-detail-desc { font-size: 0.9rem; color: rgba(180,200,255,0.65); line-height: 1.7; max-width: 520px; }
//       .comp-detail-right { display: flex; flex-direction: column; align-items: flex-end; min-width: 200px; }
//       .comp-detail-prize-big { font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 900; color: var(--yellow); text-shadow: 0 0 14px rgba(255,255,0,0.5); letter-spacing: 1px; }
//       .comp-detail-status { display: flex; align-items: center; gap: 8px; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; color: #00ff88; }
//       .comp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 8px #00ff88; animation: pulse 1.5s ease infinite; }
//       .comp-detail-btn { margin-top: 1rem; display: inline-flex; align-items: center; gap: 10px; font-family: 'Orbitron', monospace; font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 10px 20px; border: 1px solid var(--cyan); color: #000; background: var(--cyan); clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); transition: all 0.25s; }
//       .comp-detail-btn:hover { background: var(--pink); border-color: var(--pink); box-shadow: 0 0 20px var(--pink); }
//       .comp-detail-btn-arr { font-size: 0.7rem; }
//       .comp-prompt { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.8rem; border-top: 1px solid rgba(0,245,255,0.08); background: rgba(0,245,255,0.02); }
//       .comp-prompt-symbol { color: var(--cyan); font-size: 0.85rem; animation: blink 1.2s step-start infinite; }
//       .comp-prompt-text { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: rgba(0,245,255,0.3); }

//       /* ── CTA BAND ── */
//       .cta-band { padding: 80px 5rem; position: relative; z-index: 1; background: rgba(0,0,30,0.6); border-top: 1px solid rgba(0,245,255,0.08); border-bottom: 1px solid rgba(0,245,255,0.08); }
//       .cta-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.8rem; position: relative; }
//       .cta-line { width: 60px; height: 1px; background: linear-gradient(90deg,transparent,var(--cyan)); box-shadow: 0 0 8px var(--cyan); }
//       .cta-line-right { background: linear-gradient(90deg,var(--cyan),transparent); }
//       .cta-label { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); margin-bottom: 0.5rem; }
//       .cta-title { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,3.5vw,3rem); font-weight: 900; color: #fff; }
//       .cta-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.82rem; letter-spacing: 1px; color: rgba(180,200,255,0.55); max-width: 500px; line-height: 1.8; }

//       /* ── FOOTER ── */
//       .footer { background: rgba(0,0,10,0.95); border-top: 1px solid rgba(0,245,255,0.15); padding: 4rem 5rem 2rem; position: relative; z-index: 1; }
//       .footer-top-line { height: 1px; background: linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent); margin-bottom: 3rem; opacity: 0.4; }
//       .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 3rem; margin-bottom: 3rem; }
//       .footer-brand p { font-size: 0.9rem; color: rgba(180,200,255,0.5); line-height: 1.75; margin-bottom: 1.5rem; }
//       .social-links { display: flex; gap: 1rem; }
//       .social-link { width: 36px; height: 36px; border: 1px solid rgba(0,245,255,0.2); display: flex; align-items: center; justify-content: center; color: rgba(0,245,255,0.65); text-decoration: none; font-size: 0.78rem; transition: all 0.3s; }
//       .social-link:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 14px rgba(0,245,255,0.3); }
//       .footer-col h4 { font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); margin-bottom: 1.5rem; }
//       .footer-col a { display: block; margin-bottom: 0.8rem; font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; color: rgba(180,200,255,0.5); text-decoration: none; transition: color 0.2s; }
//       .footer-col a:hover { color: var(--cyan); }
//       .footer-contact-col p { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.5); line-height: 1.85; margin-bottom: 0.4rem; }
//       .footer-contact-col span { color: var(--cyan); }
//       .footer-bottom { border-top: 1px solid rgba(0,245,255,0.07); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
//       .footer-bottom p { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(180,200,255,0.28); letter-spacing: 1px; }
//       .visitors { font-family: 'Orbitron', monospace; font-size: 0.78rem; color: var(--cyan); letter-spacing: 2px; }

//       /* ── MEDIA QUERIES ── */
//       @media (max-width: 900px) {
//         .nav { padding: 0 1.5rem; }
//         .nav-links { display: none; }
//         .nav-cta { display: none; }
//         .hamburger { display: flex; }
//         .hero { padding: 100px 1.8rem 60px; }
//         .hero-tag { font-size: 1rem; }
//         .hero-sub { font-size: 0.85rem; letter-spacing: 1px; }
//         .section { padding: 60px 1.8rem; }
//         .section-title { font-size: clamp(1.5rem,4vw,2.4rem); }
//         .about-grid { grid-template-columns: 1fr; gap: 2rem; }
//         .timeline { grid-template-columns: 1fr; gap: 1.2rem; }
//         .video-grid { grid-template-columns: 1fr; }
//         .footer { padding: 3rem 1.8rem 1.5rem; }
//         .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
//         .cta-band { padding: 50px 1.8rem; }
//         .cta-title { font-size: clamp(1.5rem,5vw,2.2rem); }
//         .data-stream { display: none; }
//         .nav-underglow { display: none; }
//         .mob-blur { filter: blur(4px) brightness(0.7); transition: filter 0.6s ease; }
//         .grid-bg, .scanlines, .noise-overlay { transition: filter 0.6s ease; }
//         .stats-bar { gap: 1.5rem; padding: 1.2rem 1.5rem; flex-wrap: wrap; }
//         .comp-row-body-inner { gap: 1.5rem; padding: 0.5rem 1.2rem 1.5rem 1.8rem; }
//         .comp-detail-right { min-width: 140px; }
//         .btn-primary { padding: 12px 24px; font-size: 0.7rem; }
//         .btn-outline  { padding: 11px 22px; font-size: 0.7rem; }
//         .three-canvas { width: 100% !important; opacity: 0.35 !important; }
//       }
//       @media (max-width: 600px) {
//         .hero { padding: 90px 1.2rem 50px; }
//         .hero-title { font-size: clamp(1.8rem,8vw,3rem); }
//         .hero-tag { font-size: 0.82rem; letter-spacing: 2px; }
//         .hero-sub { font-size: 0.8rem; line-height: 1.8; }
//         .section { padding: 50px 1.2rem; }
//         .section-title { font-size: clamp(1.3rem,6vw,2rem); }
//         .footer-grid { grid-template-columns: 1fr; }
//         .stats-bar { gap: 1rem; padding: 1rem; }
//         .stat-divider { display: none; }
//         .stat-num { font-size: 1.6rem; }
//         .btn-group { flex-direction: column; align-items: stretch; }
//         .btn-primary, .btn-outline { text-align: center; justify-content: center; width: 100%; }
//         .comp-row-header { padding: 0.9rem 1rem; gap: 0.7rem; }
//         .comp-row-name { font-size: 0.72rem; letter-spacing: 1px; }
//         .comp-row-body-inner { grid-template-columns: 1fr; gap: 1rem; padding: 0.5rem 1rem 1.2rem; }
//         .comp-detail-right { align-items: flex-start; min-width: unset; }
//         .comp-row-prize { display: none; }
//         .cta-band { padding: 40px 1.2rem; }
//         .cta-sub { font-size: 0.78rem; }
//         .footer { padding: 2.5rem 1.2rem 1.2rem; }
//         .footer-col h4 { margin-bottom: 1rem; }
//         .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
//         .timeline-card { padding: 1.2rem; }
//         .tc-date { font-size: 0.65rem; }
//         .tc-title { font-size: 1rem; }
//       }
//       @media (max-width: 480px) {
//         .hero { padding: 85px 1rem 40px; }
//         .hero-title { font-size: clamp(1.5rem,9vw,2.4rem); line-height: 1.05; }
//         .hero-tag { font-size: 0.72rem; }
//         .hero-sub { font-size: 0.75rem; margin-bottom: 1.8rem; }
//         .section { padding: 40px 1rem; }
//         .section-label { font-size: 0.6rem; letter-spacing: 2px; }
//         .section-title { font-size: clamp(1.2rem,7vw,1.8rem); }
//         .stats-bar { flex-direction: column; align-items: flex-start; gap: 0.8rem; padding: 1rem; }
//         .stat-divider { display: none; }
//         .stat-num { font-size: 1.4rem; }
//         .btn-group { gap: 0.8rem; }
//         .btn-primary, .btn-outline { padding: 11px 18px; font-size: 0.65rem; letter-spacing: 1.5px; }
//         .comp-terminal { border-radius: 0; }
//         .comp-term-bar { padding: 0.6rem 1rem; }
//         .comp-term-title { font-size: 0.6rem; }
//         .comp-term-status { display: none; }
//         .comp-row-header { padding: 0.8rem; gap: 0.5rem; }
//         .comp-row-id { display: none; }
//         .comp-row-name { font-size: 0.68rem; }
//         .comp-row-body-inner { padding: 0.5rem 0.8rem 1rem; }
//         .comp-detail-prize-big { font-size: 1.1rem; }
//         .comp-detail-btn { padding: 8px 14px; font-size: 0.58rem; }
//         .cta-band { padding: 36px 1rem; }
//         .cta-title { font-size: clamp(1.2rem,7vw,1.8rem); }
//         .footer { padding: 2rem 1rem 1rem; }
//         .footer-grid { gap: 1.5rem; }
//         .footer-col h4 { font-size: 0.65rem; margin-bottom: 0.8rem; }
//         .footer-col a { font-size: 0.72rem; margin-bottom: 0.6rem; }
//         .loader-bar-wrap { width: min(280px, 80vw); }
//       }
//     `}</style>
//   );
// }








"use client";

import { useEffect, useRef, useState, useContext } from "react";
import Link from "next/link";
import { UserContext } from "@/context/UserContext";

// ── Count-up hook ──────────────────────────────────────
function useCountUp(target: number, active: boolean, duration = 2200) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
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
  }, [active, target, duration]);
  return val;
}

// ── Stat counter component ─────────────────────────────
function StatNum({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [active, setActive] = useState(false);
  const val = useCountUp(target, active);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return <span ref={ref} className="stat-num">{prefix}{active ? val.toLocaleString() : "0"}{suffix}</span>;
}


// ── Three.js 3D Scene ─────────────────────────────────
function ThreeScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
    script.async = true;
    script.onload = () => {
      const THREE = (window as any).THREE;
      if (!THREE || !canvas) return;

      // ── Rose Spiral Geometry ───────────────────────────
      function buildRoseSpiralGeometry(detail = 120, petals = 8, turns = 4) {
        const positions: number[] = [];
        const normals:   number[] = [];
        const uvs:       number[] = [];
        const indices:   number[] = [];

        const rings = detail;
        const segs  = detail * 2;
        const PHI   = (1 + Math.sqrt(5)) / 2;

        for (let i = 0; i <= rings; i++) {
          const tv    = i / rings;
          const r     = tv * 2.5;
          const rise  = Math.sin(tv * Math.PI * turns * 2) * (1 - tv) * 0.85;
          const petal = Math.cos(tv * Math.PI * petals) * 0.38 * (1 - tv * 0.5);

          for (let j = 0; j <= segs; j++) {
            const s     = j / segs;
            const theta = s * Math.PI * 2;
            const rr = r + petal * Math.cos(theta * (petals / 2));
            const x  = rr * Math.cos(theta * turns + tv * Math.PI * PHI);
            const y  = rise + rr * 0.12 * Math.sin(theta * petals);
            const z  = rr * Math.sin(theta * turns + tv * Math.PI * PHI);

            positions.push(x, y, z);
            normals.push(x, y, z);
            uvs.push(s, tv);
          }
        }

        for (let i = 0; i < rings; i++) {
          for (let j = 0; j < segs; j++) {
            const a = i * (segs + 1) + j;
            const b = a + (segs + 1);
            indices.push(a, b, a + 1);
            indices.push(b, b + 1, a + 1);
          }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(new Float32Array(positions), 3));
        geo.setAttribute("normal",   new THREE.BufferAttribute(new Float32Array(normals), 3));
        geo.setAttribute("uv",       new THREE.BufferAttribute(new Float32Array(uvs), 2));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        return geo;
      }

      const W = canvas.offsetWidth;
      const H = canvas.offsetHeight;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(W, H);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000);
      camera.position.set(0, 0, 6);

      // ── Lights ────────────────────────────────────────
      scene.add(new THREE.AmbientLight(0x001133, 2));
      const pl1 = new THREE.PointLight(0x00f5ff, 3, 20);
      pl1.position.set(3, 3, 3); scene.add(pl1);
      const pl2 = new THREE.PointLight(0xff0080, 2, 20);
      pl2.position.set(-3, -3, 2); scene.add(pl2);
      const pl3 = new THREE.PointLight(0xbf00ff, 2, 20);
      pl3.position.set(0, 4, -2); scene.add(pl3);

      // Rose dedicated lights — start at 0, fade in during morph
      const rosePl = new THREE.PointLight(0x00f5ff, 0, 20);
      rosePl.position.set(0, 2, 3); scene.add(rosePl);
      const rosePl2 = new THREE.PointLight(0xff0080, 0, 20);
      rosePl2.position.set(-2, -2, 2); scene.add(rosePl2);

      // ── Torus Knot ────────────────────────────────────
      const torusGeo = new THREE.TorusKnotGeometry(1.2, 0.32, 200, 32);
      const torusMat = new THREE.MeshPhongMaterial({
        color: 0x000820,
        emissive: 0x00f5ff,
        emissiveIntensity: 0.15,
        shininess: 200,
        specular: 0x00f5ff,
        transparent: true,   // ← REQUIRED for opacity to work
        opacity: 1,
      });
      const torusKnot = new THREE.Mesh(torusGeo, torusMat);
      scene.add(torusKnot);

      // Wireframe overlay
      const wireGeo = new THREE.TorusKnotGeometry(1.22, 0.33, 60, 12);
      const wireMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0.15,
      });
      const wireKnot = new THREE.Mesh(wireGeo, wireMat);
      scene.add(wireKnot);

      // ── Rose Spiral ───────────────────────────────────
      const roseMat = new THREE.MeshPhongMaterial({
        color:             0x000615,
        emissive:          0x00f5ff,
        emissiveIntensity: 0.08,
        shininess:         60,
        specular:          0x004466,   // toned-down specular — less flashy
        transparent:       true,
        opacity:           0,
        side:              THREE.DoubleSide,
      });

      const roseWireMat = new THREE.MeshBasicMaterial({
        color: 0x00f5ff, wireframe: true, transparent: true, opacity: 0,
      });

      const roseGeo      = buildRoseSpiralGeometry(120, 8, 4);
      const roseMesh     = new THREE.Mesh(roseGeo, roseMat);
      roseMesh.visible   = false;
      scene.add(roseMesh);

      const roseWireGeo  = buildRoseSpiralGeometry(40, 8, 4);
      const roseWireMesh = new THREE.Mesh(roseWireGeo, roseWireMat); // uses roseWireMat, not inline
      roseWireMesh.visible = false;
      scene.add(roseWireMesh);

      // ── Floating Icosahedrons ─────────────────────────
      const icoGroup = new THREE.Group();
      for (let i = 0; i < 12; i++) {
        const size  = 0.06 + Math.random() * 0.14;
        const geo   = new THREE.IcosahedronGeometry(size, 0);
        const color = i % 3 === 0 ? 0x00f5ff : i % 3 === 1 ? 0xff0080 : 0xbf00ff;
        const mat   = new THREE.MeshPhongMaterial({
          color, emissive: color, emissiveIntensity: 0.5,
          wireframe: Math.random() > 0.5,
        });
        const mesh = new THREE.Mesh(geo, mat);
        const theta = Math.random() * Math.PI * 2;
        const phi   = Math.random() * Math.PI;
        const r     = 2.5 + Math.random() * 1.5;
        mesh.position.set(
          r * Math.sin(phi) * Math.cos(theta),
          r * Math.sin(phi) * Math.sin(theta),
          r * Math.cos(phi)
        );
        mesh.userData = { theta, phi, r, speed: 0.003 + Math.random() * 0.008 };
        icoGroup.add(mesh);
      }
      scene.add(icoGroup);

      // ── Particle Field ────────────────────────────────
      const pCount = 400;
      const pPos   = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount; i++) {
        pPos[i * 3]     = (Math.random() - 0.5) * 20;
        pPos[i * 3 + 1] = (Math.random() - 0.5) * 20;
        pPos[i * 3 + 2] = (Math.random() - 0.5) * 10;
      }
      const pGeo = new THREE.BufferGeometry();
      pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
      const pMat = new THREE.PointsMaterial({ color: 0x00f5ff, size: 0.025, transparent: true, opacity: 0.5 });
      scene.add(new THREE.Points(pGeo, pMat));

      // ── Rings ─────────────────────────────────────────
      const ring1 = new THREE.Mesh(
        new THREE.TorusGeometry(2.6, 0.008, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0x00f5ff, transparent: true, opacity: 0.3 })
      );
      ring1.rotation.x = Math.PI / 4; scene.add(ring1);

      const ring2 = new THREE.Mesh(
        new THREE.TorusGeometry(3.2, 0.005, 8, 120),
        new THREE.MeshBasicMaterial({ color: 0xff0080, transparent: true, opacity: 0.2 })
      );
      ring2.rotation.x = Math.PI / 3; ring2.rotation.y = Math.PI / 6; scene.add(ring2);

      // ── Mouse ─────────────────────────────────────────
      let mx = 0, my = 0;
      const onMouse = (e: MouseEvent) => {
        mx = (e.clientX / window.innerWidth  - 0.5) * 2;
        my = -(e.clientY / window.innerHeight - 0.5) * 2;
      };
      document.addEventListener("mousemove", onMouse);

      // ── Resize ────────────────────────────────────────
      const onResize = () => {
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
      };
      window.addEventListener("resize", onResize);

      // ── Scroll → morph state ──────────────────────────
      let morphT  = 0;
      let targetT = 0;

      const onScroll = () => {
  const aboutSection  = document.getElementById("about");
  const eventsSection = document.getElementById("events");
  if (!aboutSection || !eventsSection) return;

  const vh = window.innerHeight;

  // Morph starts: when #about top hits the middle of the screen
  // Morph ends:   when #events top hits the top of the screen
  // — the full scroll distance between these two points is your transition window
  const morphStart = aboutSection.getBoundingClientRect().top - vh * 0.5;
  const morphEnd   = eventsSection.getBoundingClientRect().top;

  const range    = morphEnd - morphStart;
  const progress = Math.max(0, Math.min(1, -morphStart / range));
  targetT = progress;
};
      window.addEventListener("scroll", onScroll, { passive: true });

      // ── Animate ───────────────────────────────────────
      let t = 0;
      let rafId: number;

      const animate = () => {
        rafId = requestAnimationFrame(animate);
        t += 0.008;

        // Smooth lerp + cubic ease-in-out
        morphT += (targetT - morphT) * 0.025;
        const e = morphT < 0.5
          ? 4 * morphT * morphT * morphT
          : 1 - Math.pow(-2 * morphT + 2, 3) / 2;

        // ── Torus fades out ──────────────────────────
        torusMat.opacity  = 1 - e;
        torusMat.emissiveIntensity = (0.12 + Math.sin(t * 2) * 0.06) * (1 - e);
        wireMat.opacity   = (1 - e) * 0.15;
        torusKnot.visible = e < 0.99;
        wireKnot.visible  = e < 0.99;
        torusKnot.scale.setScalar(1 - e * 0.6);

        const sharedRotX = t * 0.3 + my * 0.3;
        const sharedRotY = t * 0.5 + mx * 0.3;
        torusKnot.rotation.x = sharedRotX;
        torusKnot.rotation.y = sharedRotY;
        wireKnot.rotation.x  = sharedRotX;
        wireKnot.rotation.y  = sharedRotY;

        // ── Rose fades in ────────────────────────────
        roseMat.opacity      = e;
        roseWireMat.opacity  = e * 0.12;
        roseMesh.visible     = e > 0.01;
        roseWireMesh.visible = e > 0.01;

        // Darker, gentler emissive pulse
        roseMat.emissiveIntensity = (0.06 + Math.sin(t * 2.5) * 0.03) * e;

        // Bloom in from small, settle at natural size
        const roseScale = 0.05 + e * 1.05;
        roseMesh.scale.setScalar(roseScale);
        roseWireMesh.scale.setScalar(roseScale);

        // Graceful slow rotation
        roseMesh.rotation.x     = t * 0.15 + my * 0.15;
        roseMesh.rotation.y     = t * 0.22 + mx * 0.15;
        roseMesh.rotation.z     = t * 0.06;
        roseWireMesh.rotation.x = roseMesh.rotation.x;
        roseWireMesh.rotation.y = roseMesh.rotation.y;
        roseWireMesh.rotation.z = roseMesh.rotation.z;

        // Rose lights — soft, not overpowering
        rosePl.intensity  = e * 2.0;
        rosePl2.intensity = e * 1.5;
        rosePl.position.x  = Math.cos(t * 1.1) * 3.5;
        rosePl.position.y  = Math.sin(t * 0.8) * 2.5;
        rosePl2.position.x = Math.cos(t * 0.7 + Math.PI) * 3;
        rosePl2.position.y = Math.sin(t * 1.0 + 1) * 2;

        // ── Shared scene elements ────────────────────
        icoGroup.children.forEach((m: any) => {
          m.userData.theta += m.userData.speed;
          m.position.x = m.userData.r * Math.sin(m.userData.phi) * Math.cos(m.userData.theta);
          m.position.y = m.userData.r * Math.sin(m.userData.phi) * Math.sin(m.userData.theta);
          m.rotation.x += 0.01; m.rotation.y += 0.012;
        });

        ring1.rotation.z = t * 0.2;
        ring2.rotation.z = -t * 0.15;
        ring1.rotation.y = t * 0.1 + mx * 0.2;
        pl1.position.x   = Math.cos(t) * 4;
        pl1.position.y   = Math.sin(t * 0.7) * 3;
        pl2.position.x   = Math.cos(t + Math.PI) * 3;
        pl2.position.y   = Math.sin(t * 0.5 + 1) * 2;

        renderer.render(scene, camera);
      };
      animate();

      // ── Cleanup ───────────────────────────────────────
      (canvas as any)._threeCleanup = () => {
        cancelAnimationFrame(rafId);
        document.removeEventListener("mousemove", onMouse);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        renderer.dispose();
        roseMat.dispose();
        roseWireMat.dispose();
      };
    };
    document.head.appendChild(script);

    return () => {
      const cleanup = (canvas as any)._threeCleanup;
      if (cleanup) cleanup();
      if (script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0, right: 0,
        width: "clamp(280px, 55%, 55%)",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        opacity: 0.82,
      }}
      className="three-canvas"
    />
  );
}

// ── Fade-in wrapper ────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVis(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.8s ease ${delay}ms, transform 0.8s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

function CompRow({ index, comp }: { index: number; comp: { icon: string; title: string; desc: string; prize: string } }) {
  const [open, setOpen] = useState(false);
  const id = String(index + 1).padStart(2, "0");
 
  return (
    <div
      className={`comp-row ${open ? "comp-row-open" : ""}`}
      onClick={() => setOpen(v => !v)}
    >
      {/* ── collapsed: single line ── */}
      <div className="comp-row-header">
        <span className="comp-row-id">[{id}]</span>
        <span className="comp-row-icon">{comp.icon}</span>
        <span className="comp-row-name">{comp.title.toUpperCase()}</span>
        <span className="comp-row-prize">{comp.prize}</span>
        <span className="comp-row-chevron">{open ? "▼" : "▶"}</span>
      </div>
 
      {/* ── expanded: full detail panel ── */}
      <div className="comp-row-body">
        <div className="comp-row-body-inner">
 
          <div className="comp-detail-left">
            <div className="comp-detail-label">// description</div>
            <div className="comp-detail-desc">{comp.desc}</div>
          </div>
 
          <div className="comp-detail-right">
            <div className="comp-detail-prize-big">{comp.prize}</div>
            <div className="comp-detail-label" style={{ marginTop: "1rem" }}>// status</div>
            <div className="comp-detail-status">
              <span className="comp-status-dot" />
              REGISTRATION OPEN
            </div>
            <Link
              href="/register"
              className="comp-detail-btn"
              onClick={e => e.stopPropagation()}
            >
              <span>INITIALIZE REGISTRATION</span>
              <span className="comp-detail-btn-arr">▶</span>
            </Link>
          </div>
 
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════
export default function LandingPage() {
  const { userData } = useContext(UserContext);
  const [activeComp, setActiveComp] = useState(0);
  const [loaded, setLoaded]       = useState(false);
  const [loaderDone, setLoaderDone] = useState(false);
  const [scrolled, setScrolled]   = useState(false);
  const [visitorCount, setVisitorCount] = useState(0);

  // Fetch visitor count from backend on every render (mount)
  useEffect(() => {
    fetch("/api/visitors")
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(d => setVisitorCount(d.count ?? 0))
      .catch(() => {}); // fail silently — stat just stays 0
  }, []);

  //video autoplay
  const videoRef = useRef<HTMLVideoElement>(null);
useEffect(() => {
  const video = videoRef.current;
  if (!video) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        video.muted = false;
        video.play().catch(() => {
          // browser blocked unmuted — fall back to muted autoplay
          video.muted = true;
          video.play().catch(() => {});
        });
      } else {
        video.pause();
        video.muted = false;   // reset for next time
      }
    },
    { threshold: 0.5 }
  );

  observer.observe(video);
  return () => observer.disconnect();
}, []);

  // Loader
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2200);
    const t2 = setTimeout(() => setLoaderDone(true), 2800);
    return () => { clearTimeout(t); clearTimeout(t2); };
  }, []);

  // Scroll shadow on nav + mobile background blur past hero
  const [pastHero, setPastHero] = useState(false);
  useEffect(() => {
    const handler = () => {
      setScrolled(window.scrollY > 20);
      // Only track on mobile (≤900px)
      if (window.innerWidth <= 900) {
        setPastHero(window.scrollY > window.innerHeight * 0.85);
      } else {
        setPastHero(false);
      }
    };
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Custom cursor
  useEffect(() => {
    const cursor = document.getElementById("cy-cursor");
    const trail  = document.getElementById("cy-cursor-trail");
    if (!cursor || !trail) return;
    let mx = 0, my = 0, tx = 0, ty = 0;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
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
 const competitions = [
  { icon: "🕵️", title: "Scavenger Hunt", desc: "Solve tech puzzles, hunt hidden clues, and outsmart rival teams in a fast-paced challenge.", prize: "₹5,000 PRIZE" },

  { icon: "💃", title: "Paper Dance", desc: "Dance with your partner on shrinking paper—balance, coordination, and fun combined.", prize: "₹3,000 PRIZE" },

  { icon: "🤖", title: "AI-ML Challenge", desc: "Build an AI/ML model to solve real-world problems under constraints.", prize: "₹8,000 PRIZE" },

  { icon: "🎮", title: "PUBG, Valorant & Free Fire Tournament", desc: "Compete in high-intensity esports battles and prove your squad’s dominance.", prize: "₹3,000 PRIZE" },

  { icon: "🎨", title: "Frontend Design Contest", desc: "Design and build a stunning frontend UI from scratch—where creativity meets code.", prize: "₹4,000 PRIZE" },

  { icon: "🔐", title: "Ethical Hacking Challenge", desc: "Test your penetration testing and cybersecurity skills in a controlled environment.", prize: "₹5,000 PRIZE" },

  { icon: "🥟", title: "Golgappa Eating Challenge", desc: "A fun-filled eating contest—push your limits in the ultimate golgappa showdown.", prize: "₹1,000 PRIZE" },

  { icon: "🤖", title: "Robotics Competition", desc: "Design, build, and program robots to complete exciting real-world challenges.", prize: "₹3,000 PRIZE" },

  { icon: "🙈", title: "Blind Coding", desc: "Code without seeing your screen—pure logic, memory, and confidence.", prize: "₹3,000 PRIZE" },

  { icon: "💡", title: "Ideathon", desc: "Pitch innovative tech ideas and showcase your creativity and problem-solving vision.", prize: "₹3,000 PRIZE" },

  { icon: "🎬", title: "Movie Mania", desc: "Enjoy a tech-themed movie screening followed by an engaging trivia challenge.", prize: "₹2,000 PRIZE" },

  { icon: "💻", title: "Competitive Programming", desc: "Solve algorithmic problems under time pressure and prove your coding skills.", prize: "₹8,000 PRIZE" },

  { icon: "⚡", title: "Hackathon", desc: "Build innovative solutions in an intense 24-hour coding marathon.", prize: "₹15,000 PRIZE" },

  { icon: "⌨️", title: "Computer Fundamentals Quiz", desc: "Test your knowledge of core computer science concepts in a competitive quiz.", prize: "₹8,000 PRIZE" },

  { icon: "⚡", title: "Typing Speed Challenge", desc: "Compete on speed and accuracy—fastest fingers take the win.", prize: "₹3,000 PRIZE" },

  { icon: "🎥", title: "Tech Reel", desc: "Create a short, engaging video capturing the essence of technology trends.", prize: "₹2,000 PRIZE" }
];

  return (
    <>
      {/* ══ LOADER ══════════════════════════════════ */}
      {!loaderDone && (
        <div className={`loader ${loaded ? "loader-hide" : ""}`}>
          <div className="loader-logo">SCSE</div>
          <div className="loader-text">Initializing System...</div>
          <div className="loader-bar-wrap"><div className="loader-bar" /></div>
          <div className="loader-sub">NIT JAMSHEDPUR // CSE DEPARTMENT</div>
        </div>
      )}

      {/* ══ CUSTOM CURSOR ═══════════════════════════ */}
      <div id="cy-cursor" />
      <div id="cy-cursor-trail" />

      {/* ══ BACKGROUNDS ═════════════════════════════ */}
      <div className={`grid-bg${pastHero ? " mob-blur" : ""}`} />
      <div className={`scanlines${pastHero ? " mob-blur" : ""}`} />
      <div className={`noise-overlay${pastHero ? " mob-blur" : ""}`} />
      {/* Navbar underglow */}
      <div className="nav-underglow" />
      <div className="corner-glow" />

      {/* ══ THREE.JS 3D SCENE ═══════════════════════ */}
      <ThreeScene />

      {/* Floating data stream */}
      <div className="data-stream" aria-hidden>
        <span className="ds-item">0x4E4954 // JAMSHEDPUR</span>
        <span className="ds-item">XAVENIR.25 // LIVE</span>
        <span className="ds-item">CSE // DEPT.NODE</span>
      </div>

      {/* ══ HERO ════════════════════════════════════ */}
      <section id="hero" className="hero">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-line" />
            NIT Jamshedpur
          </div>

          <h1 className="hero-title">
            <span className="ht-society glitch" data-text="SOCIETY OF">SOCIETY OF</span>
            <span className="ht-cs glitch" data-text="COMPUTER SCIENCE">COMPUTER SCIENCE</span>
            <span className="ht-eng glitch" data-text="& ENGINEERING">&amp; ENGINEERING</span>
          </h1>

          <p className="hero-sub">
            <span>CODE</span> | <span>CREATE</span> | <span>CONQUER</span><br />
            The frontier where algorithms meet ambition.<br />
            Join the nexus of tomorrow's innovators.
          </p>

          <div className="btn-group">
            <a href="#events" className="btn-primary">
              <span>// Explore</span>
            </a>
            <a href="#about" className="btn-outline">Know More</a>
          </div>
        </div>

        {/* Stats bar */}
        <div className="stats-bar">
          <div className="stat">
            <StatNum target={visitorCount} />
            <span className="stat-label">Visitors</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <StatNum target={12} />
            <span className="stat-label">Events</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <span className="stat-num">₹50K+</span>
            <span className="stat-label">Prize Pool</span>
          </div>
          <div className="stat-divider" />
          <div className="stat">
            <StatNum target={500} />
            <span className="stat-label">Participants</span>
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═══════════════════════════════════ */}
      <section id="about" className="section">
        <span className="section-label">// sys.info()</span>
        <FadeIn className="about-grid">
          <div>
            <h2 className="section-title">Who <span className="accent">Are</span> We?</h2>
            <div className="about-text">
              <p>
                The Society of Computer Science and Engineering (SCSE) is a dynamic community of
                tech enthusiasts, innovators, and learners at NIT Jamshedpur. We operate at the
                intersection of code and creativity.
              </p>
              <p>
                We foster a culture of knowledge-sharing, problem-solving, and relentless innovation —
                shaping the architects of tomorrow's technology landscape.
              </p>
              <Link href="/about" className="btn-primary" style={{ display: "inline-flex", marginTop: "0.5rem" }}>
                <span>// Archives</span>
              </Link>
            </div>
          </div>

          <div className="cyber-panel">
            <div className="cp-corner tl" />
            <div className="cp-corner br" />
            <div className="cp-status">SYSTEM.STATUS // ONLINE</div>
            <div className="cp-grid">
              <div>
                <div className="cp-big cp-cyan">XAVENIR</div>
                <div className="cp-small">ANNUAL TECH FEST</div>
              </div>
              <div>
                <div className="cp-big cp-pink">'26</div>
                <div className="cp-small">CURRENT EDITION</div>
              </div>
            </div>
            <div className="cp-details">
              <div>► THEME: <span className="cp-hl">CODE TO THE FUTURE</span></div>
              <div>► VENUE: <span className="cp-hl">NIT JAMSHEDPUR</span></div>
              <div>► STATUS: <span className="cp-active">ACTIVE ●</span></div>
            </div>
          </div>
        </FadeIn>
      </section>



      {/* ══ VIDEO SHOWCASE ══════════════════════════ */}
      <section id="aftermovie" className="section section-dark">
        <span className="section-label">// media.play()</span>
        <FadeIn>
          <h2 className="section-title">
            <span className="accent">Teaser</span>
          </h2>
          <p className="video-subtitle">
            Relive the energy of Xavenir — the Exuberant fest at NIT Jamshedpur.
          </p>
        </FadeIn>

        <FadeIn delay={120} className="video-grid">

          {/* ── Main featured video ── */}
          <div className="video-featured">
            <div className="video-card-label">// XAVENIR '26 — OFFICIAL TEASER</div>
            <div className="video-frame-wrap video-frame-large">
              {/* Replace the src with embed URL */}


                  <video
                      ref={videoRef}
                      src="teaser2.mp4"
                      className="video-iframe"
                      loop
                      playsInline
                      controls
                    />

              {/* <iframe
                src="teaser2.mp4"
                title="Xavenir Aftermovie"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="video-iframe"
              /> */}

                  {/* <div className="video-frame-wrap video-frame-large">
                  <iframe
                    src="https://www.instagram.com/reel/DHy0nOXMpMf/embed"
                    className="video-iframe"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />             
                  </div> */}
            
            </div>
            <div className="video-meta">
              <span className="video-tag">Teaser</span>
              <span className="video-duration">◈ XAVENIR 2026</span>
            </div>
          </div>

          {/* ── Side teasers ── */}
          
        </FadeIn>
      </section>


        {/* ══ TIMELINE ════════════════════════════════ */}
      <section id="events" className="section section-dark">
        <span className="section-label">// timeline.render()</span>
        <FadeIn><h2 className="section-title"><span className="accent">Event</span> Timeline</h2></FadeIn>

        <FadeIn delay={100} className="timeline">
          <div className="timeline-card timeline-card-active">
            <div className="tc-date">// NODE_01</div>
            <div className="tc-title">Pre Xavenir</div>
            <div className="tc-date" style={{ color: "var(--cyan)", fontSize: "1.05rem", fontFamily: "'Orbitron',monospace", fontWeight: 700 }}>April 4th, 2026</div>
            <div className="tc-desc">You are here. The future of tech is being written now.</div>
            <div className="tc-status">System Online</div>
          </div>
          <div className="timeline-card">
            <div className="tc-date">18 April 2025</div>
            <div className="tc-title">Day 1</div>
            <div className="tc-desc">Exciting workshops, tech talks, and mini-competitions to prepare you for the main event. The perfect tech warm-up.</div>
            <div className="tc-tag">FUN EVENTS &amp; COMPETITIONS</div>
          </div>
          <div className="timeline-card">
            <div className="tc-date">19 April 2025</div>
            <div className="tc-title">Day 2</div>
            <div className="tc-desc">Exciting workshops, tech talks, and mini-competitions to prepare you for the main event. The perfect tech warm-up.</div>
            <div className="tc-tag">FUN EVENTS &amp; COMPETITIONS</div>
          </div>
          <div className="timeline-card">
            <div className="tc-date">20 April 2025</div>
            <div className="tc-title">Day 3</div>
            <div className="tc-desc">The premier tech fest of the CSE Department. Where legends are made and futures are forged.</div>
            <div className="tc-tag tc-tag-pink">MAIN EVENT // PREMIER FEST</div>
          </div>
        </FadeIn>
      </section>

{/* ══ COMPETITIONS ════════════════════════════════════ */}
 
 
<section id="competitions" className="section comp-section">
  <span className="section-label">// competitions.load()</span>
  <FadeIn>
    <h2 className="section-title">Active <span className="accent">Competitions</span></h2>
  </FadeIn>
 
  <FadeIn delay={100} className="comp-terminal">
 
    {/* Terminal header bar */}
    <div className="comp-term-bar">
      <div className="comp-term-dots">
        <span /><span /><span />
      </div>
      <div className="comp-term-title">xavenir@nitjsr:~/competitions$</div>
      <div className="comp-term-status">8 PROCESSES LOADED</div>
    </div>
 
    {/* Competition rows */}
    <div className="comp-list">
      {competitions.map((c, i) => (
        <CompRow key={i} index={i} comp={c} />
      ))}
    </div>
 
    {/* Bottom prompt line */}
    <div className="comp-prompt">
      <span className="comp-prompt-symbol">❯</span>
      <span className="comp-prompt-text">select a competition to initialize registration_</span>
    </div>
 
  </FadeIn>
</section>

      {/* ══ CTA BAND ════════════════════════════════ */}
      <section className="cta-band">
        <FadeIn className="cta-inner">
          <div className="cta-line" />
          <div>
            <div className="cta-label">// ready.to.compete()</div>
            <h2 className="cta-title">Code to the <span className="accent">Future</span></h2>
            <p className="cta-sub">Register now and be part of the biggest tech fest at NIT Jamshedpur.</p>
          </div>
          <div className="btn-group" style={{ justifyContent: "center" }}>
            {userData ? (
              <>
                <Link href="/dashboard" className="btn-primary"><span>/ Dashboard /</span></Link>
                <button
                  className="btn-outline"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    window.location.href = "/";
                  }}
                >
                  / Logout /
                </button>
              </>
            ) : (
              <>
                <Link href="/register" className="btn-primary"><span>/ Register /</span></Link>
                <Link href="/login" className="btn-outline"> / Login / </Link>
              </>
            )}
          </div>
          <div className="cta-line cta-line-right" />
        </FadeIn>
      </section>
      <PageStyles />
    </>
  );
}

// ══════════════════════════════════════════════════════
function PageStyles() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;600;700;900&family=Share+Tech+Mono&family=Rajdhani:wght@300;400;600;700&display=swap');

      :root {
        --cyan:   #00f5ff;
        --pink:   #ff0080;
        --purple: #bf00ff;
        --yellow: #ffff00;
        --dark:   #020010;
        --panel:  rgba(0,5,30,0.78);
        --nav-h:  70px;
      }

      /* ── CUSTOM CURSOR ── */
      *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; cursor: none !important; }
      #cy-cursor {
        width: 12px; height: 12px;
        border: 2px solid var(--cyan);
        border-radius: 50%;
        position: fixed; pointer-events: none; z-index: 99999;
        transform: translate(-50%, -50%);
        transition: transform 0.08s ease, border-color 0.2s;
        box-shadow: 0 0 10px var(--cyan), 0 0 4px var(--cyan);
      }
      #cy-cursor-trail {
        width: 32px; height: 32px;
        border: 1px solid rgba(0,245,255,0.35);
        border-radius: 50%;
        position: fixed; pointer-events: none; z-index: 99998;
        transform: translate(-50%, -50%);
        transition: left 0s, top 0s;
      }
      html { scroll-behavior: smooth; }
      body {
        font-family: 'Rajdhani', sans-serif;
        background: var(--dark); color: #e0e0ff;
        overflow-x: hidden; min-height: 100vh;
      }

      /* ── LOADER ── */
      .loader {
        position: fixed; inset: 0; z-index: 9999;
        background: var(--dark);
        display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1.5rem;
        transition: opacity 0.6s ease;
      }
      .loader-hide { opacity: 0; pointer-events: none; }
      .loader-logo {
        font-family: 'Orbitron', monospace; font-size: 2.8rem; font-weight: 900;
        color: var(--cyan); text-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,245,255,0.4);
      }
      .loader-text {
        font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 5px;
        color: var(--cyan); text-transform: uppercase;
        animation: blink 1s step-start infinite;
      }
      .loader-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(0,245,255,0.4); }
      .loader-bar-wrap { width: 280px; height: 2px; background: rgba(0,245,255,0.1); overflow: hidden; }
      .loader-bar { height: 100%; background: linear-gradient(90deg,var(--cyan),var(--pink)); box-shadow: 0 0 10px var(--cyan); animation: load-fill 1.8s cubic-bezier(0.4,0,0.2,1) forwards; }
      @keyframes load-fill { from{width:0} to{width:100%} }
      @keyframes blink { 50%{opacity:0} }

      /* ── BACKGROUNDS ── */
      .grid-bg {
        position: fixed; inset: 0; z-index: -2; pointer-events: none;
        background-image:
          linear-gradient(rgba(0,245,255,0.05) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,245,255,0.05) 1px, transparent 1px);
        background-size: 60px 60px;
      }
      .scanlines {
        position: fixed; inset: 0; z-index: -1; pointer-events: none;
        background: repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.06) 2px,rgba(0,0,0,0.06) 4px);
      }
      .noise-overlay {
        position: fixed; inset: 0; z-index: -1; pointer-events: none; opacity: 0.3;
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
      }

      /* ── DATA STREAM ── */
      .data-stream {
        position: fixed; right: 1.8rem; top: 50%; transform: translateY(-50%);
        z-index: 5; display: flex; flex-direction: column; gap: 2rem; pointer-events: none;
      }
      .ds-item {
        font-family: 'Share Tech Mono', monospace; font-size: 0.58rem; letter-spacing: 2px;
        color: rgba(0,245,255,0.28); writing-mode: vertical-lr;
        animation: data-flow 3s ease-in-out infinite;
      }
      .ds-item:nth-child(2){animation-delay:1s} .ds-item:nth-child(3){animation-delay:2s}
      @keyframes data-flow { 0%,100%{opacity:0.18} 50%{opacity:0.65} }

      /* ── NAV ── */
      .nav {
        position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
        height: var(--nav-h); padding: 0 3rem;
        display: flex; align-items: center; justify-content: space-between;
        background: rgba(2,0,16,0.88);
        border-bottom: 1px solid rgba(0,245,255,0.18);
        backdrop-filter: blur(20px);
        transition: background 0.3s;
      }
      .nav-scrolled { background: rgba(2,0,16,0.98); }
      .nav::after {
        content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
        background: linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent);
        animation: nav-scan 4s linear infinite;
      }
      @keyframes nav-scan { 0%,100%{opacity:0.4} 50%{opacity:1} }
      .logo {
        font-family: 'Orbitron', monospace; font-size: 1.6rem; font-weight: 900;
        color: var(--cyan); text-shadow: 0 0 18px var(--cyan), 0 0 36px rgba(0,245,255,0.4);
        letter-spacing: 4px; text-decoration: none;
      }
      .nav-links { display: flex; gap: 1.8rem; list-style: none; }
      .nav-links a {
        font-family: 'Share Tech Mono', monospace; font-size: 0.85rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.75); text-decoration: none; text-transform: uppercase;
        padding: 4px 0; position: relative; transition: color 0.2s;
      }
      .nav-links a::after {
        content: ''; position: absolute; bottom: -2px; left: 0;
        width: 0; height: 1px; background: var(--cyan); box-shadow: 0 0 8px var(--cyan);
        transition: width 0.3s;
      }
      .nav-links a:hover { color: var(--cyan); }
      .nav-links a:hover::after { width: 100%; }
      .nav-right { display: flex; align-items: center; gap: 10px; }
      .nav-cta {
        font-family: 'Orbitron', monospace; font-size: 0.68rem; letter-spacing: 2px;
        padding: 8px 20px; border: 1px solid var(--pink); color: var(--pink);
        text-decoration: none; text-transform: uppercase;
        transition: all 0.3s; white-space: nowrap;
      }
      .nav-cta:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }
      .nav-cta-register { border-color: var(--cyan); color: var(--cyan); background: rgba(0,245,255,0.06); }
      .nav-cta-register:hover { background: var(--cyan); color: #000; box-shadow: 0 0 20px var(--cyan); }

      /* ── NAV UNDERGLOW ── */
      .nav-underglow {
        position: fixed; top: 70px; left: 0; right: 0;
        height: 220px; pointer-events: none; z-index: 1;
        background: linear-gradient(180deg,rgba(0,245,255,0.07) 0%,rgba(0,180,255,0.06) 25%,rgba(191,0,255,0.025) 55%,transparent 100%);
        filter: blur(8px);
      }

      /* ── CORNER GLOW ── */
      .corner-glow {
        position: fixed; bottom: 0; right: 0;
        width: 70vw; height: 70vh;
        pointer-events: none; z-index: 0;
        background: radial-gradient(ellipse at bottom right,rgba(0,245,255,0.13) 0%,rgba(191,0,255,0.08) 40%,transparent 70%);
        animation: corner-pulse 6s ease-in-out infinite;
      }
      @keyframes corner-pulse { 0%,100%{opacity:0.7} 50%{opacity:1} }

      /* ── HAMBURGER ── */
      .hamburger {
        display: none; flex-direction: column; justify-content: center; align-items: center;
        gap: 5px; width: 36px; height: 36px;
        background: transparent; border: 1px solid rgba(0,245,255,0.2);
        cursor: pointer; padding: 7px; transition: border-color 0.2s;
      }
      .hamburger:hover { border-color: var(--cyan); box-shadow: 0 0 12px rgba(0,245,255,0.2); }
      .hamburger span { display: block; width: 18px; height: 1.5px; background: var(--cyan); transition: all 0.3s; transform-origin: center; }
      .hamburger-open span:nth-child(1) { transform: translateY(6.5px) rotate(45deg); }
      .hamburger-open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
      .hamburger-open span:nth-child(3) { transform: translateY(-6.5px) rotate(-45deg); }

      /* ── MOBILE NAV ── */
      .mobile-nav {
        position: fixed; top: var(--nav-h); left: 0; right: 0; z-index: 900;
        max-height: 0; overflow: hidden;
        background: rgba(2,0,18,0.99); border-bottom: 1px solid rgba(0,245,255,0.12);
        backdrop-filter: blur(24px);
        transition: max-height 0.4s cubic-bezier(0.4,0,0.2,1);
      }
      .mobile-nav-open { max-height: 90vh; overflow-y: auto; }
      .mob-link {
        display: flex; align-items: center; gap: 14px;
        padding: 14px 24px; text-decoration: none;
        font-family: 'Share Tech Mono', monospace; font-size: 0.9rem; letter-spacing: 2px;
        color: rgba(200,220,255,0.6); border-bottom: 1px solid rgba(0,245,255,0.05);
        transition: all 0.18s; animation: mob-in 0.3s ease both; opacity: 0;
      }
      .mobile-nav-open .mob-link { opacity: 1; }
      .mob-link:hover { color: var(--pink); padding-left: 32px; }
      .mob-link:hover .mob-link-arr { opacity: 1; transform: none; }
      .mob-link-icon { font-size: 10px; color: rgba(0,245,255,0.3); width: 14px; text-align: center; }
      .mob-link-arr { margin-left: auto; color: var(--pink); opacity: 0; transform: translateX(-4px); transition: all 0.18s; }
      .mob-cta {
        display: flex; align-items: center; justify-content: center;
        margin: 16px 24px 24px;
        font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px;
        padding: 13px; border: 1px solid var(--pink); color: var(--pink);
        text-decoration: none; text-transform: uppercase; transition: all 0.25s;
        animation: mob-in 0.3s ease both; opacity: 0;
      }
      .mobile-nav-open .mob-cta { opacity: 1; }
      .mob-cta:hover { background: var(--pink); color: #000; box-shadow: 0 0 20px var(--pink); }
      .mob-backdrop { position: fixed; inset: 0; z-index: 800; background: rgba(0,0,0,0.5); }
      @keyframes mob-in { from{opacity:0;transform:translateX(-10px)} to{opacity:1;transform:none} }

      /* ── BUTTONS ── */
      .btn-group { display: flex; gap: 1.5rem; flex-wrap: wrap; }
      .btn-primary {
        font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 3px;
        padding: 14px 36px; font-weight: 700; text-decoration: none; text-transform: uppercase;
        background: linear-gradient(135deg, var(--cyan), var(--purple));
        color: #000; border: none;
        clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        transition: all 0.3s; cursor: pointer; position: relative; overflow: hidden; display: inline-flex; align-items: center;
      }
      .btn-primary::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,var(--pink),var(--purple)); opacity: 0; transition: opacity 0.3s; }
      .btn-primary:hover::before { opacity: 1; }
      .btn-primary:hover { box-shadow: 0 0 30px var(--cyan), 0 0 60px rgba(0,245,255,0.25); transform: translateY(-2px); }
      .btn-primary span { position: relative; z-index: 1; }
      .btn-outline {
        font-family: 'Orbitron', monospace; font-size: 0.75rem; letter-spacing: 3px;
        padding: 13px 35px; background: transparent; color: var(--pink);
        border: 1px solid var(--pink); text-decoration: none; text-transform: uppercase;
        clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 12px 100%, 0 calc(100% - 12px));
        transition: all 0.3s; cursor: pointer; display: inline-flex; align-items: center;
      }
      .btn-outline:hover { background: var(--pink); color: #000; box-shadow: 0 0 28px var(--pink); transform: translateY(-2px); }

      /* ── HERO ── */
      .hero {
        min-height: 100vh; padding: 120px 5rem 80px;
        display: flex; flex-direction: column; justify-content: center;
        position: relative; z-index: 1;
      }
      .hero-content { max-width: 700px; }
      .hero-tag {
        font-family: 'Share Tech Mono', monospace; font-size: 1.5rem; letter-spacing: 4px;
        color: var(--pink); text-transform: uppercase; margin-bottom: 1.5rem;
        display: flex; align-items: center; gap: 12px;
      }
      .hero-tag-line { display: inline-block; width: 20px; height: 1px; background: var(--pink); box-shadow: 0 0 8px var(--pink); flex-shrink: 0; }
      .hero-title {
        font-family: 'Orbitron', monospace; font-size: clamp(2.6rem,5.5vw,5.2rem);
        font-weight: 900; line-height: 1; margin-bottom: 1.5rem;
      }
      .ht-society { display: block; color: var(--cyan); font-size: 0.94em; text-shadow: 0 0 18px rgba(0,245,255,0.55), 0 0 6px rgba(0,245,255,0.3); }
      .ht-cs      { display: block; color: #fff; font-size: 0.66em; text-shadow: 0 0 20px rgba(0,245,255,0.15); }
      .ht-eng     { display: block; color: var(--pink); font-size: 0.88em; text-shadow: 0 0 8px rgba(255,0,128,0.8), 0 0 25px rgba(255,0,128,0.2); }

      /* ── GLITCH ── */
      .glitch { position: relative; animation: glitch-base 8s infinite; }
      .glitch::before, .glitch::after { content: attr(data-text); position: absolute; top: 0; left: 0; width: 100%; }
      .glitch::before { color: var(--pink); animation: glitch-1 8s infinite; clip-path: polygon(0 0,100% 0,100% 33%,0 33%); opacity: 0; }
      .glitch::after  { color: var(--cyan); animation: glitch-2 8s infinite; clip-path: polygon(0 66%,100% 66%,100% 100%,0 100%); opacity: 0; }
      @keyframes glitch-base { 0%,92%,100%{transform:none} 93%{transform:skewX(-1deg)} 96%{transform:skewX(1deg)} }
      @keyframes glitch-1 { 0%,91%,100%{opacity:0;transform:none} 92%{opacity:0.7;transform:translate(-3px,0)} 93%{opacity:0} 95%{opacity:0.5;transform:translate(3px,0)} 96%{opacity:0} }
      @keyframes glitch-2 { 0%,91%,100%{opacity:0;transform:none} 93%{opacity:0.7;transform:translate(3px,0)} 94%{opacity:0} 96%{opacity:0.5;transform:translate(-3px,0)} 97%{opacity:0} }
      .ht-cs.glitch { animation-delay: 1.5s; }
      .ht-cs.glitch::before, .ht-cs.glitch::after { animation-delay: 1s; }
      .ht-eng.glitch { animation-delay: 5s; }
      .ht-eng.glitch::before, .ht-eng.glitch::after { animation-delay: 5s; }

      .hero-sub {
        font-family: 'Share Tech Mono', monospace; font-size: 0.95rem;
        color: rgba(180,200,255,0.65); margin-bottom: 2.5rem; letter-spacing: 2px; line-height: 2;
      }
      .hero-sub span { color: var(--cyan); }

      /* ── STATS ── */
      .stats-bar { display: flex; gap: 2.5rem; align-items: center; margin-top: 4rem; flex-wrap: wrap; }
      .stat { text-align: center; }
      .stat-num { font-family: 'Orbitron', monospace; font-size: 2rem; font-weight: 900; color: var(--cyan); text-shadow: 0 0 16px var(--cyan); display: block; }
      .stat-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: rgba(180,200,255,0.5); text-transform: uppercase; }
      .stat-divider { width: 1px; height: 40px; background: rgba(0,245,255,0.2); }

      /* ── SECTIONS ── */
      .section { padding: 100px 5rem; position: relative; z-index: 1; }
      .section-dark { background: rgba(0,0,20,0.5); }
      .section-label { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; letter-spacing: 5px; color: var(--pink); text-transform: uppercase; margin-bottom: 1rem; display: block; }
      .section-title { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,3.5vw,3.2rem); font-weight: 900; color: #fff; line-height: 1.1; margin-bottom: 2rem; }
      .accent { color: var(--cyan); }

      /* ── ABOUT ── */
      .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 5rem; align-items: center; }
      .about-text { font-size: 1.05rem; line-height: 1.85; color: rgba(180,200,255,0.75); }
      .about-text p { margin-bottom: 1.5rem; }
      .cyber-panel {
        background: var(--panel); border: 1px solid rgba(0,245,255,0.15);
        padding: 2.5rem; position: relative;
        clip-path: polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px));
      }
      .cyber-panel::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg,var(--cyan),transparent); box-shadow: 0 0 10px var(--cyan); }
      .cp-corner { position: absolute; width: 16px; height: 16px; }
      .cp-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 10px var(--cyan); }
      .cp-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 10px var(--pink); }
      .cp-status { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; color: rgba(0,245,255,0.4); letter-spacing: 2px; margin-bottom: 1.5rem; }
      .cp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
      .cp-big { font-family: 'Orbitron', monospace; font-size: 1.8rem; font-weight: 900; }
      .cp-cyan { color: var(--cyan); text-shadow: 0 0 16px var(--cyan); }
      .cp-pink { color: var(--pink); text-shadow: 0 0 16px var(--pink); }
      .cp-small { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: rgba(180,200,255,0.5); margin-top: 0.3rem; }
      .cp-details { margin-top: 2rem; padding-top: 1.5rem; border-top: 1px solid rgba(0,245,255,0.1); font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.6); line-height: 2.2; }
      .cp-hl { color: var(--cyan); }
      .cp-active { color: #00ff88; text-shadow: 0 0 8px #00ff88; }

      /* ── TIMELINE ── */
      .timeline { display: grid; grid-template-columns: repeat(3,1fr); gap: 2rem; margin-top: 2.5rem; }
      .timeline-card {
        background: var(--panel); border: 1px solid rgba(0,245,255,0.1);
        padding: 2rem; position: relative;
        clip-path: polygon(0 0, calc(100% - 16px) 0, 100% 16px, 100% 100%, 0 100%);
        transition: all 0.3s;
      }
      .timeline-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg,rgba(0,245,255,0.04),rgba(191,0,255,0.04)); opacity: 0; transition: opacity 0.3s; }
      .timeline-card:hover::before { opacity: 1; }
      .timeline-card:hover { border-color: rgba(0,245,255,0.4); transform: translateY(-4px); box-shadow: 0 10px 40px rgba(0,245,255,0.08); }
      .timeline-card-active { border-color: var(--cyan); box-shadow: 0 0 28px rgba(0,245,255,0.18); }
      .tc-date { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: var(--pink); margin-bottom: 0.5rem; }
      .tc-title { font-family: 'Orbitron', monospace; font-size: 1.25rem; font-weight: 700; color: #fff; margin-bottom: 0.5rem; }
      .tc-desc { font-size: 0.9rem; color: rgba(180,200,255,0.6); line-height: 1.6; }
      .tc-status { margin-top: 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; display: inline-flex; align-items: center; gap: 8px; color: var(--cyan); text-transform: uppercase; }
      .tc-status::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--cyan); box-shadow: 0 0 8px var(--cyan); animation: pulse 1.5s ease infinite; }
      .tc-tag { margin-top: 1.5rem; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; color: rgba(0,245,255,0.5); }
      .tc-tag-pink { color: rgba(255,0,128,0.7); }
      @keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.4;transform:scale(1.4)} }

      /* ── VIDEO SHOWCASE ── */
      .video-subtitle { font-family: 'Share Tech Mono', monospace; font-size: 0.82rem; letter-spacing: 2px; color: rgba(180,200,255,0.5); margin-top: -1rem; margin-bottom: 2.5rem; line-height: 1.8; }
      .video-grid { display: grid; grid-template-columns: 1.6fr 1fr; gap: 2rem; align-items: start; }
      .video-card-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: rgba(0,245,255,0.4); margin-bottom: 0.8rem; }
      .video-frame-wrap { position: relative; overflow: hidden; border: 1px solid rgba(0,245,255,0.15); background: rgba(0,0,20,0.8); }
      .video-frame-wrap::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; z-index: 2; background: linear-gradient(90deg, var(--cyan), var(--purple), transparent); box-shadow: 0 0 10px var(--cyan); }
      .video-scan-line { position: absolute; left: 0; right: 0; height: 2px; z-index: 3; pointer-events: none; background: linear-gradient(90deg, transparent, rgba(0,245,255,0.35), transparent); animation: vid-scan 4s linear infinite; }
      @keyframes vid-scan { 0%{top:0%;opacity:0} 5%{opacity:1} 95%{opacity:1} 100%{top:100%;opacity:0} }
      .video-frame-large { aspect-ratio: 16/9; }
      .video-frame-small { aspect-ratio: 16/9; }
      .video-iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: none; display: block; }
      .video-frame-large::after, .video-frame-small::after { content: ''; display: block; padding-top: 56.25%; }
      .video-corner { position: absolute; width: 14px; height: 14px; z-index: 4; }
      .video-corner.tl { top: -1px; left: -1px; border-top: 2px solid var(--cyan); border-left: 2px solid var(--cyan); box-shadow: -2px -2px 8px var(--cyan); }
      .video-corner.br { bottom: -1px; right: -1px; border-bottom: 2px solid var(--pink); border-right: 2px solid var(--pink); box-shadow: 2px 2px 8px var(--pink); }
      .video-frame-wrap:hover { border-color: rgba(0,245,255,0.4); box-shadow: 0 0 30px rgba(0,245,255,0.08); transition: border-color 0.3s, box-shadow 0.3s; }
      .video-meta { display: flex; align-items: center; justify-content: space-between; margin-top: 0.7rem; }
      .video-tag { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; padding: 3px 10px; border: 1px solid rgba(0,245,255,0.3); color: var(--cyan); background: rgba(0,245,255,0.05); }
      .video-tag-pink  { border-color: rgba(255,0,128,0.35); color: var(--pink); background: rgba(255,0,128,0.05); }
      .video-tag-purple{ border-color: rgba(191,0,255,0.35); color: var(--purple); background: rgba(191,0,255,0.05); }
      .video-duration { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 2px; color: rgba(180,200,255,0.35); }
      .video-side { display: flex; flex-direction: column; }

      /* ── COMPETITIONS ── */
      .comp-section { padding-bottom: 120px; }
      .comp-terminal { margin-top: 2.5rem; border: 1px solid rgba(0,245,255,0.18); background: rgba(0,3,20,0.85); position: relative; overflow: hidden; }
      .comp-terminal::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px; background: linear-gradient(90deg, var(--cyan), var(--pink), var(--purple), transparent); }
      .comp-term-bar { display: flex; align-items: center; gap: 1rem; padding: 0.85rem 1.5rem; border-bottom: 1px solid rgba(0,245,255,0.1); background: rgba(0,245,255,0.03); }
      .comp-term-dots { display: flex; gap: 6px; }
      .comp-term-dots span { width: 10px; height: 10px; border-radius: 50%; }
      .comp-term-dots span:nth-child(1) { background: #ff5f57; box-shadow: 0 0 6px #ff5f57; }
      .comp-term-dots span:nth-child(2) { background: #febc2e; box-shadow: 0 0 6px #febc2e; }
      .comp-term-dots span:nth-child(3) { background: #28c840; box-shadow: 0 0 6px #28c840; }
      .comp-term-title { font-family: 'Share Tech Mono', monospace; font-size: 0.72rem; color: rgba(0,245,255,0.5); letter-spacing: 1px; flex: 1; }
      .comp-term-status { font-family: 'Share Tech Mono', monospace; font-size: 0.6rem; letter-spacing: 3px; color: rgba(0,245,255,0.3); }
      .comp-list { display: flex; flex-direction: column; }
      .comp-row { border-bottom: 1px solid rgba(0,245,255,0.06); cursor: pointer; transition: background 0.2s; position: relative; overflow: hidden; }
      .comp-row::before { content: ''; position: absolute; left: 0; top: 0; bottom: 0; width: 2px; background: linear-gradient(180deg, var(--cyan), var(--pink)); opacity: 0; transition: opacity 0.3s; }
      .comp-row:hover::before, .comp-row-open::before { opacity: 1; }
      .comp-row:hover { background: rgba(0,245,255,0.03); }
      .comp-row-open  { background: rgba(0,245,255,0.05); }
      .comp-row-header { display: flex; align-items: center; gap: 1.2rem; padding: 1.1rem 1.8rem; transition: padding 0.2s; }
      .comp-row-open .comp-row-header { padding-bottom: 0.8rem; }
      .comp-row-id { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(0,245,255,0.3); min-width: 32px; }
      .comp-row-icon { font-size: 1.3rem; filter: drop-shadow(0 0 5px var(--cyan)); min-width: 28px; text-align: center; }
      .comp-row-name { font-family: 'Orbitron', monospace; font-size: 0.82rem; font-weight: 700; color: #e0e8ff; flex: 1; letter-spacing: 2px; transition: color 0.2s; }
      .comp-row:hover .comp-row-name, .comp-row-open .comp-row-name { color: var(--cyan); }
      .comp-row-prize { font-family: 'Orbitron', monospace; font-size: 0.78rem; font-weight: 700; color: var(--yellow); text-shadow: 0 0 8px rgba(255,255,0,0.4); letter-spacing: 1px; }
      .comp-row-chevron { font-size: 0.6rem; color: rgba(0,245,255,0.4); transition: color 0.2s; min-width: 12px; }
      .comp-row-open .comp-row-chevron { color: var(--cyan); }
      .comp-row-body { max-height: 0; overflow: hidden; transition: max-height 0.45s cubic-bezier(0.4,0,0.2,1); }
      .comp-row-open .comp-row-body { max-height: 200px; }
      .comp-row-body-inner { display: grid; grid-template-columns: 1fr auto; gap: 3rem; align-items: start; padding: 0.5rem 1.8rem 1.8rem 3.8rem; border-top: 1px solid rgba(0,245,255,0.07); }
      .comp-detail-label { font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 3px; color: var(--pink); margin-bottom: 0.5rem; }
      .comp-detail-desc { font-size: 0.9rem; color: rgba(180,200,255,0.65); line-height: 1.7; max-width: 520px; }
      .comp-detail-right { display: flex; flex-direction: column; align-items: flex-end; min-width: 200px; }
      .comp-detail-prize-big { font-family: 'Orbitron', monospace; font-size: 1.4rem; font-weight: 900; color: var(--yellow); text-shadow: 0 0 14px rgba(255,255,0,0.5); letter-spacing: 1px; }
      .comp-detail-status { display: flex; align-items: center; gap: 8px; font-family: 'Share Tech Mono', monospace; font-size: 0.62rem; letter-spacing: 2px; color: #00ff88; }
      .comp-status-dot { width: 6px; height: 6px; border-radius: 50%; background: #00ff88; box-shadow: 0 0 8px #00ff88; animation: pulse 1.5s ease infinite; }
      .comp-detail-btn { margin-top: 1rem; display: inline-flex; align-items: center; gap: 10px; font-family: 'Orbitron', monospace; font-size: 0.62rem; letter-spacing: 2px; text-transform: uppercase; text-decoration: none; padding: 10px 20px; border: 1px solid var(--cyan); color: #000; background: var(--cyan); clip-path: polygon(0 0, calc(100% - 8px) 0, 100% 8px, 100% 100%, 8px 100%, 0 calc(100% - 8px)); transition: all 0.25s; }
      .comp-detail-btn:hover { background: var(--pink); border-color: var(--pink); box-shadow: 0 0 20px var(--pink); }
      .comp-detail-btn-arr { font-size: 0.7rem; }
      .comp-prompt { display: flex; align-items: center; gap: 0.8rem; padding: 1rem 1.8rem; border-top: 1px solid rgba(0,245,255,0.08); background: rgba(0,245,255,0.02); }
      .comp-prompt-symbol { color: var(--cyan); font-size: 0.85rem; animation: blink 1.2s step-start infinite; }
      .comp-prompt-text { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 2px; color: rgba(0,245,255,0.3); }

      /* ── CTA BAND ── */
      .cta-band { padding: 80px 5rem; position: relative; z-index: 1; background: rgba(0,0,30,0.6); border-top: 1px solid rgba(0,245,255,0.08); border-bottom: 1px solid rgba(0,245,255,0.08); }
      .cta-inner { display: flex; flex-direction: column; align-items: center; text-align: center; gap: 1.8rem; position: relative; }
      .cta-line { width: 60px; height: 1px; background: linear-gradient(90deg,transparent,var(--cyan)); box-shadow: 0 0 8px var(--cyan); }
      .cta-line-right { background: linear-gradient(90deg,var(--cyan),transparent); }
      .cta-label { font-family: 'Share Tech Mono', monospace; font-size: 0.68rem; letter-spacing: 4px; color: var(--pink); margin-bottom: 0.5rem; }
      .cta-title { font-family: 'Orbitron', monospace; font-size: clamp(1.8rem,3.5vw,3rem); font-weight: 900; color: #fff; }
      .cta-sub { font-family: 'Share Tech Mono', monospace; font-size: 0.82rem; letter-spacing: 1px; color: rgba(180,200,255,0.55); max-width: 500px; line-height: 1.8; }

      /* ── FOOTER ── */
      .footer { background: rgba(0,0,10,0.95); border-top: 1px solid rgba(0,245,255,0.15); padding: 4rem 5rem 2rem; position: relative; z-index: 1; }
      .footer-top-line { height: 1px; background: linear-gradient(90deg,transparent,var(--cyan),var(--pink),transparent); margin-bottom: 3rem; opacity: 0.4; }
      .footer-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1.5fr; gap: 3rem; margin-bottom: 3rem; }
      .footer-brand p { font-size: 0.9rem; color: rgba(180,200,255,0.5); line-height: 1.75; margin-bottom: 1.5rem; }
      .social-links { display: flex; gap: 1rem; }
      .social-link { width: 36px; height: 36px; border: 1px solid rgba(0,245,255,0.2); display: flex; align-items: center; justify-content: center; color: rgba(0,245,255,0.65); text-decoration: none; font-size: 0.78rem; transition: all 0.3s; }
      .social-link:hover { border-color: var(--cyan); color: var(--cyan); box-shadow: 0 0 14px rgba(0,245,255,0.3); }
      .footer-col h4 { font-family: 'Orbitron', monospace; font-size: 0.72rem; letter-spacing: 3px; text-transform: uppercase; color: var(--cyan); margin-bottom: 1.5rem; }
      .footer-col a { display: block; margin-bottom: 0.8rem; font-family: 'Share Tech Mono', monospace; font-size: 0.78rem; color: rgba(180,200,255,0.5); text-decoration: none; transition: color 0.2s; }
      .footer-col a:hover { color: var(--cyan); }
      .footer-contact-col p { font-family: 'Share Tech Mono', monospace; font-size: 0.75rem; color: rgba(180,200,255,0.5); line-height: 1.85; margin-bottom: 0.4rem; }
      .footer-contact-col span { color: var(--cyan); }
      .footer-bottom { border-top: 1px solid rgba(0,245,255,0.07); padding-top: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
      .footer-bottom p { font-family: 'Share Tech Mono', monospace; font-size: 0.7rem; color: rgba(180,200,255,0.28); letter-spacing: 1px; }
      .visitors { font-family: 'Orbitron', monospace; font-size: 0.78rem; color: var(--cyan); letter-spacing: 2px; }

      /* ── MEDIA QUERIES ── */
      @media (max-width: 900px) {
        .nav { padding: 0 1.5rem; }
        .nav-links { display: none; }
        .nav-cta { display: none; }
        .hamburger { display: flex; }
        .hero { padding: 100px 1.8rem 60px; }
        .hero-tag { font-size: 1rem; }
        .hero-sub { font-size: 0.85rem; letter-spacing: 1px; }
        .section { padding: 60px 1.8rem; }
        .section-title { font-size: clamp(1.5rem,4vw,2.4rem); }
        .about-grid { grid-template-columns: 1fr; gap: 2rem; }
        .timeline { grid-template-columns: 1fr; gap: 1.2rem; }
        .video-grid { grid-template-columns: 1fr; }
        .footer { padding: 3rem 1.8rem 1.5rem; }
        .footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
        .cta-band { padding: 50px 1.8rem; }
        .cta-title { font-size: clamp(1.5rem,5vw,2.2rem); }
        .data-stream { display: none; }
        .nav-underglow { display: none; }
        .mob-blur { filter: blur(4px) brightness(0.7); transition: filter 0.6s ease; }
        .grid-bg, .scanlines, .noise-overlay { transition: filter 0.6s ease; }
        .stats-bar { gap: 1.5rem; padding: 1.2rem 1.5rem; flex-wrap: wrap; }
        .comp-row-body-inner { gap: 1.5rem; padding: 0.5rem 1.2rem 1.5rem 1.8rem; }
        .comp-detail-right { min-width: 140px; }
        .btn-primary { padding: 12px 24px; font-size: 0.7rem; }
        .btn-outline  { padding: 11px 22px; font-size: 0.7rem; }
        .three-canvas { width: 100% !important; opacity: 0.35 !important; }
      }
      @media (max-width: 600px) {
        .hero { padding: 90px 1.2rem 50px; }
        .hero-title { font-size: clamp(1.8rem,8vw,3rem); }
        .hero-tag { font-size: 0.82rem; letter-spacing: 2px; }
        .hero-sub { font-size: 0.8rem; line-height: 1.8; }
        .section { padding: 50px 1.2rem; }
        .section-title { font-size: clamp(1.3rem,6vw,2rem); }
        .footer-grid { grid-template-columns: 1fr; }
        .stats-bar { gap: 1rem; padding: 1rem; }
        .stat-divider { display: none; }
        .stat-num { font-size: 1.6rem; }
        .btn-group { flex-direction: column; align-items: stretch; }
        .btn-primary, .btn-outline { text-align: center; justify-content: center; width: 100%; }
        .comp-row-header { padding: 0.9rem 1rem; gap: 0.7rem; }
        .comp-row-name { font-size: 0.72rem; letter-spacing: 1px; }
        .comp-row-body-inner { grid-template-columns: 1fr; gap: 1rem; padding: 0.5rem 1rem 1.2rem; }
        .comp-detail-right { align-items: flex-start; min-width: unset; }
        .comp-row-prize { display: none; }
        .cta-band { padding: 40px 1.2rem; }
        .cta-sub { font-size: 0.78rem; }
        .footer { padding: 2.5rem 1.2rem 1.2rem; }
        .footer-col h4 { margin-bottom: 1rem; }
        .footer-bottom { flex-direction: column; align-items: flex-start; gap: 0.5rem; }
        .timeline-card { padding: 1.2rem; }
        .tc-date { font-size: 0.65rem; }
        .tc-title { font-size: 1rem; }
      }
      @media (max-width: 480px) {
        .hero { padding: 85px 1rem 40px; }
        .hero-title { font-size: clamp(1.5rem,9vw,2.4rem); line-height: 1.05; }
        .hero-tag { font-size: 0.72rem; }
        .hero-sub { font-size: 0.75rem; margin-bottom: 1.8rem; }
        .section { padding: 40px 1rem; }
        .section-label { font-size: 0.6rem; letter-spacing: 2px; }
        .section-title { font-size: clamp(1.2rem,7vw,1.8rem); }
        .stats-bar { flex-direction: column; align-items: flex-start; gap: 0.8rem; padding: 1rem; }
        .stat-divider { display: none; }
        .stat-num { font-size: 1.4rem; }
        .btn-group { gap: 0.8rem; }
        .btn-primary, .btn-outline { padding: 11px 18px; font-size: 0.65rem; letter-spacing: 1.5px; }
        .comp-terminal { border-radius: 0; }
        .comp-term-bar { padding: 0.6rem 1rem; }
        .comp-term-title { font-size: 0.6rem; }
        .comp-term-status { display: none; }
        .comp-row-header { padding: 0.8rem; gap: 0.5rem; }
        .comp-row-id { display: none; }
        .comp-row-name { font-size: 0.68rem; }
        .comp-row-body-inner { padding: 0.5rem 0.8rem 1rem; }
        .comp-detail-prize-big { font-size: 1.1rem; }
        .comp-detail-btn { padding: 8px 14px; font-size: 0.58rem; }
        .cta-band { padding: 36px 1rem; }
        .cta-title { font-size: clamp(1.2rem,7vw,1.8rem); }
        .footer { padding: 2rem 1rem 1rem; }
        .footer-grid { gap: 1.5rem; }
        .footer-col h4 { font-size: 0.65rem; margin-bottom: 0.8rem; }
        .footer-col a { font-size: 0.72rem; margin-bottom: 0.6rem; }
        .loader-bar-wrap { width: min(280px, 80vw); }
      }
    `}</style>
  );
}