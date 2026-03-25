"use client";

import React, { useEffect, useRef } from "react";

const policies = [
  {
    title: "1. Introduction",
    content:
      "We value your privacy and are committed to protecting your personal information.",
  },
  {
    title: "2. Information We Collect",
    content:
      "We may collect personal details such as name, email, and usage data.",
  },
  {
    title: "3. How We Use Information",
    content:
      "We use data to improve services and enhance user experience.",
  },
  {
    title: "4. Data Protection",
    content:
      "We implement strong security measures to safeguard your data.",
  },
  {
    title: "5. Data Sharing",
    content:
      "We do not sell your data. It may be shared only when required.",
  },
  {
    title: "6. Your Rights",
    content:
      "You can access, update, or delete your personal data anytime.",
  },
  {
    title: "7. Cookies & Tracking",
    content:
      "We use cookies to enhance browsing experience.",
  },
];

export default function PrivacyPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ✨ Particle Animation
  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];

    for (let i = 0; i < 120; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2,
        dx: (Math.random() - 0.5) * 0.7,
        dy: (Math.random() - 0.5) * 0.7,
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,255,255,0.6)";
        ctx.fill();
      });

      requestAnimationFrame(animate);
    }

    animate();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
      ></canvas>

      {/* 🔵 3D Rings */}
      <div className="absolute inset-0 flex items-center justify-center perspective-[1200px] z-0">
        <div className="ring ring1"></div>
        <div className="ring ring2"></div>
        <div className="ring ring3"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 pt-32 pb-16">
        
        {/* 🔥 Stylish Title */}
        <h1 className="text-6xl font-extrabold text-center mb-16 tracking-[0.3em] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 drop-shadow-[0_0_35px_rgba(0,255,255,0.9)] animate-pulse">
          PRIVACY POLICY
        </h1>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {policies.map((policy, index) => (
            <div
              key={index}
              className="group relative p-[1px] rounded-2xl bg-gradient-to-r from-cyan-500 to-purple-500 hover:scale-105 transition"
            >
              <div className="bg-black/60 backdrop-blur-xl rounded-2xl p-6 border border-white/10 group-hover:border-cyan-400/40">
                
                <h2 className="text-xl font-semibold text-cyan-300 mb-3">
                  {policy.title}
                </h2>

                <p className="text-gray-300 text-sm leading-relaxed">
                  {policy.content}
                </p>

              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}