// app/refund/page.tsx
import React, { CSSProperties } from 'react';

export const RefundHeader: React.FC = () => {
  return (
    <div className="absolute top-8 left-8 z-50 group select-none">
      {/* MASSIVE SCSE BRANDING */}
      <div className="relative font-black italic text-6xl sm:text-8xl tracking-tighter leading-none">
        
        {/* Main Text - White with a slight glow */}
        <span className="relative z-10 text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover:tracking-widest">
          SCSE
        </span>
        
        {/* Animated Glitch Layer 1 (Cyan) */}
        <span className="absolute top-0 left-0 -z-10 text-[#00f3ff] opacity-70 translate-x-[-4px] translate-y-[2px] blur-[1px] group-hover:animate-ping">
          SCSE
        </span>
        
        {/* Animated Glitch Layer 2 (Magenta) */}
        <span className="absolute top-0 left-0 -z-10 text-[#ff003c] opacity-70 translate-x-[4px] translate-y-[-2px] blur-[1px] group-hover:animate-pulse">
          SCSE
        </span>

        {/* Decorative "Scanning" line that moves over the text */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#00f3ff]/20 to-transparent h-1 animate-scanline pointer-events-none"></div>
      </div>
      
      {/* Sub-label with increased spacing */}
      <div className="mt-2 flex items-center gap-4">
        <div className="h-[2px] w-20 bg-[#ff003c] shadow-[0_0_10px_#ff003c]"></div>
        <p className="text-xs text-[#00ff9f] tracking-[0.6em] font-bold uppercase">
          Society of Computer Science & Engineering
        </p>
      </div>
    </div>
  );
};

const CyberpunkRefund = () => {
  const mainContainerStyle: CSSProperties = {
    minHeight: '100vh',
    width: '100%',
   backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.85), rgba(0, 0, 0, 0.6)), url('public/contact/cyberpunk-bg.jpeg')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundAttachment: 'fixed',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#000',
  };

  const policies = [
    { id: "01", title: "REFUND PROTOCOL", content: "System credit returns are only authorized if the 'Global Event' is terminated by the Megacorp (Organizers).", color: "#00f3ff" },
    { id: "02", title: "TERMINATION OF CONTRACT", content: "Contractors may abort registration up to 7 days prior for a 50% extraction fee.", color: "#ff003c" },
    { id: "03", title: "GHOSTING POLICY", content: "No refunds for ghosting the event. If your bio-signature is missing, credits are forfeited.", color: "#f3e600" },
    { id: "04", title: "SYSTEM CRASH", content: "Natural disasters or blackouts do not trigger automatic refunds. Alternative tokens will be issued.", color: "#00ff9f" }
  ];

  return (
    <main style={mainContainerStyle} className="font-mono text-white relative overflow-x-hidden">
      {/* 1. MASSIVE SCSE BRANDING */}
      <RefundHeader />

      {/* BACKGROUND GRID & SCANLINES */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      
      {/* Heavy Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.2)_50%),linear-gradient(90deg,rgba(255,0,0,0.05),rgba(0,255,0,0.02),rgba(0,0,255,0.05))] z-40 bg-[size:100%_4px,3px_100%] opacity-30"></div>

      <div className="relative max-w-6xl mx-auto z-10 p-6 sm:p-12 pt-48 sm:pt-64">
        
        {/* HERO SECTION */}
        <header className="mb-20 relative">
          <div className="relative inline-block group">
             <div className="absolute -inset-2 bg-[#f3e600] blur-xl opacity-10 group-hover:opacity-30 transition"></div>
             <div className="bg-[#f3e600] text-black px-12 py-4 skew-x-[-15deg] font-black text-5xl sm:text-7xl relative shadow-[10px_10px_0px_#ff003c]">
               <span className="inline-block skew-x-[15deg]">REFUND_V3</span>
             </div>
          </div>
        </header>

        {/* POLICY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {policies.map((p) => (
            <div key={p.id} className="relative group cursor-crosshair">
              <div className="absolute -inset-1 opacity-10 group-hover:opacity-100 transition duration-700 blur-lg" style={{ backgroundColor: p.color }}></div>
              <div className="relative bg-black/90 backdrop-blur-2xl border border-white/5 p-10 h-full transition-all duration-300 group-hover:border-white/20"
                   style={{ clipPath: 'polygon(0 0, 100% 0, 100% 85%, 90% 100%, 0 100%)' }}>
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-3xl font-black italic tracking-tighter uppercase" style={{ color: p.color }}>{p.title}</h3>
                  <span className="text-[10px] font-bold text-gray-600 tracking-widest border border-gray-800 px-2 py-1">#{p.id}</span>
                </div>
                <p className="text-gray-400 text-base leading-relaxed mb-6 group-hover:text-gray-200 transition-colors">{p.content}</p>
                <div className="h-[2px] w-0 group-hover:w-full transition-all duration-700 shadow-[0_0_15px]" style={{ backgroundColor: p.color, boxShadow: `0 0 15px ${p.color}` }}></div>
              </div>
            </div>
          ))}
        </div>

        {/* CONTACT TERMINAL */}
        <div className="mt-24 border-l-8 border-[#ff003c] bg-white/5 p-10 backdrop-blur-md">
            <h4 className="text-[#ff003c] font-black text-2xl uppercase mb-6 italic tracking-tighter">Support_Uplink_Established</h4>
            <div className="grid sm:grid-cols-2 gap-8 text-lg font-bold">
              <a href="mailto:amrishrock2002@gmail.com" className="hover:text-[#ff003c] transition-all flex items-center gap-4">
                <span className="bg-[#ff003c] text-white px-2 text-xs py-1">MAIL</span> 
                <span className="tracking-tighter">amrishrock2002@gmail.com</span>
              </a>
              <a href="tel:+919118841006" className="hover:text-[#ff003c] transition-all flex items-center gap-4">
                <span className="bg-[#ff003c] text-white px-2 text-xs py-1">VOICE</span> 
                <span className="tracking-tighter">+91 91188 41006</span>
              </a>
            </div>
        </div>
      </div>
    </main>
  );
};

export default CyberpunkRefund;