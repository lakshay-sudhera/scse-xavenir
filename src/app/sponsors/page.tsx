
import './page.css'
import SponsorCard from './SponsorCard'

function Sponsors() {


  return (
    <>
      <video autoPlay muted loop id="video-bg">
        <source src="carMoving.mp4" type="video/mp4" />
      </video>

    
      <div className="scanlines"></div>
      <div className="vignette"></div>

      
      <main className="relative z-10 flex flex-col items-center w-full min-h-screen pt-24 pb-20">
        
    
        <div className="relative flex flex-col items-center mb-64 py-12 w-full max-w-5xl">
          <div className="cyber-frame">
            <div className="cyber-frame-tr"></div>
            <div className="cyber-frame-bl"></div>
          </div>
          <h1 className="glitch" data-text="SPONSORS" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>SPONSORS</h1>
          
          <div className="h-1 w-48 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full shadow-[0_0_10px_#00f7ff]"></div>
        </div>

        
        <div className="flex flex-wrap justify-center gap-12 w-full max-w-6xl px-4 mt-48">

          {/* CARD 1 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 
                          min-w-[260px] max-w-[300px] flex-1 
                          cursor-pointer transition-all duration-300
                          hover:-translate-y-2 hover:scale-105
                          hover:shadow-[0_0_20px_#00f7ff,0_0_40px_#ff00ff]
                          active:scale-95">
            <SponsorCard
              title="Cloud Partner"
              logo="utho.png"
              name="Utho"
              tagline="UTHO - BHARAT KA CLOUD"
            />
          </div>

          {/* CARD 2 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 
                          min-w-[260px] max-w-[300px] flex-1 
                          cursor-pointer transition-all duration-300
                          hover:-translate-y-2 hover:scale-105
                          hover:shadow-[0_0_20px_#00f7ff,0_0_40px_#ff00ff]
                          active:scale-95">
            <SponsorCard
              title="Travel Partner"
              logo="wheelBros.png"
              name="WheelBros"
              tagline="Your Travel, your way"
            />
          </div>

          {/* CARD 3 */}
          <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 
                          min-w-[260px] max-w-[300px] flex-1 
                          cursor-pointer transition-all duration-300
                          hover:-translate-y-2 hover:scale-105
                          hover:shadow-[0_0_20px_#00f7ff,0_0_40px_#ff00ff]
                          active:scale-95">
            <SponsorCard
              title="Food Partner"
              logo="foodAffair.png"
              name="FoodAffairs"
              tagline="You decide.. your Taste.."
            />
          </div>

        </div>

        
    <div
      className="sponsor-cta text-fuchsia-200  text-6xl p-4 bg-pink-500 rounded-3xl pt-4"
    >
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSclbHWh3OGFRJP31Zic5KFtvQ1QSQ-wOyAnJLbhBM3huR39hw/viewform?pli=1"> BE OUR SPONSORS </a>
    </div>
        
      </main>

<div className="flex justify-center mt-20">
  <div className="max-w-3xl text-center space-y-4">
    <h2 className="text-6xl font-bold ">
      Be at the forefront of innovation!
    </h2>
    <p className="leading-relaxed text-2xl">
      SCSE, the premier event of NIT Jamshedpur, where creativity meets
      cutting-edge technology. By sponsoring us, you align your brand with
      groundbreaking innovations, vibrant competitions, and a community of
      future leaders.
    </p>
    <p className="leading-relaxed text-2xl">
      Partner with us to drive progress, inspire excellence, and be a part of
      the legacy that shapes tomorrow.
    </p>
  </div>
</div>



<div className="flex flex-col items-center mb-12 mt-20 why-sponsor-margin">
  <h2 className="glitch !text-[3.5rem] md:!text-[5rem] text-center text-fuchsia-600" data-text="WHY SPONSOR US ?" style={{textShadow: '0 0 10px rgba(0, 255, 255, 0.5)'}}>
    WHY SPONSOR US ?
  </h2>
  {/* Subtle gradient divider matching the top section */}
  <div className="h-1 w-48 bg-gradient-to-r from-blue-500 to-purple-500 mt-2 rounded-full shadow-[0_0_10px_#00f7ff]"></div>
</div>

<div className="flex flex-col gap-8 p-6 items-center w-full mt-7">

  {/* BRAND EXPOSURE (CYAN) */}
  <div className="w-[850px] h-[100px] perspective max-w-full">
    <div className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 cursor-pointer">

      <div className="absolute w-full h-full bg-black/80 border-[2px] border-[#00f7ff] text-[#00f7ff] rounded-xl 
                      flex items-center justify-center font-bold text-3xl tracking-widest uppercase
                      shadow-[0_0_15px_rgba(0,247,255,0.4)_inset,0_0_15px_rgba(0,247,255,0.4)] backface-hidden">
        Brand Exposure
      </div>

      <div className="absolute w-full h-full bg-black flex flex-col items-center justify-center text-center p-6 
                      text-[#00f7ff] border-[2px] border-[#00f7ff] rounded-xl text-lg font-medium 
                      shadow-[0_0_20px_rgba(0,247,255,0.6)_inset,0_0_20px_rgba(0,247,255,0.6)] rotate-y-180 backface-hidden">
        <p className="text-white">Get visibility on social media, event banners, and official merchandise.</p>
        <p>Connect with top-tier tech talent and future innovators.</p>
      </div>

    </div>
  </div>

  {/* RECRUITMENT EDGE (PINK) */}
  <div className="w-[850px] h-[100px] perspective max-w-full">
    <div className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 cursor-pointer">

      <div className="absolute w-full h-full bg-black/80 border-[2px] border-[#ff00ff] text-[#ff00ff] rounded-xl 
                      flex items-center justify-center font-bold text-3xl tracking-widest uppercase
                      shadow-[0_0_15px_rgba(255,0,255,0.4)_inset,0_0_15px_rgba(255,0,255,0.4)] backface-hidden">
        Recruitment Edge
      </div>

      <div className="absolute w-full h-full bg-black flex flex-col items-center justify-center text-center p-6 
                      text-[#ff00ff] border-[2px] border-[#ff00ff] rounded-xl text-lg font-medium 
                      shadow-[0_0_20px_rgba(255,0,255,0.6)_inset,0_0_20px_rgba(255,0,255,0.6)] rotate-y-180 backface-hidden">
        <p className="text-white">Targeted Reach:</p>
        <p>Access a pool of skilled students for internships and job opportunities.</p>
      </div>

    </div>
  </div>

  {/* CAMPUS PRESENCE (YELLOW) */}
  <div className="w-[850px] h-[100px] perspective max-w-full">
    <div className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 cursor-pointer">

      <div className="absolute w-full h-full bg-black/80 border-[2px] border-[#fce436] text-[#fce436] rounded-xl 
                      flex items-center justify-center font-bold text-3xl tracking-widest uppercase
                      shadow-[0_0_15px_rgba(252,228,54,0.4)_inset,0_0_15px_rgba(252,228,54,0.4)] backface-hidden">
        Campus Presence
      </div>

      <div className="absolute w-full h-full bg-black flex flex-col items-center justify-center text-center p-6 
                      text-[#fce436] border-[2px] border-[#fce436] rounded-xl text-lg font-medium 
                      shadow-[0_0_20px_rgba(252,228,54,0.6)_inset,0_0_20px_rgba(252,228,54,0.6)] rotate-y-180 backface-hidden">
        <p className="text-white">Strengthen your presence in the academic ecosystem of NIT Jamshedpur.</p>
      </div>

    </div>
  </div>

  {/* CREDIBILITY BOOST (GREEN) */}
  <div className="w-[850px] h-[100px] perspective max-w-full">
    <div className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 cursor-pointer">

      <div className="absolute w-full h-full bg-black/80 border-[2px] border-[#0f0] text-[#0f0] rounded-xl 
                      flex items-center justify-center font-bold text-3xl tracking-widest uppercase
                      shadow-[0_0_15px_rgba(0,255,0,0.4)_inset,0_0_15px_rgba(0,255,0,0.4)] backface-hidden">
        Credibility Boost
      </div>

      <div className="absolute w-full h-full bg-black flex flex-col items-center justify-center text-center p-6 
                      text-[#0f0] border-[2px] border-[#0f0] rounded-xl text-lg font-medium 
                      shadow-[0_0_20px_rgba(0,255,0,0.6)_inset,0_0_20px_rgba(0,255,0,0.6)] rotate-y-180 backface-hidden">
        <p className="text-white">Associate your brand with a prestigious technical society.</p>
      </div>

    </div>
  </div>

  {/* INDUSTRY COLLABORATION (PURPLE) */}
  <div className="w-[850px] h-[100px] perspective max-w-full">
    <div className="relative w-full h-full transition-transform duration-500 transform-style preserve-3d hover:rotate-y-180 cursor-pointer">

      <div className="absolute w-full h-full bg-black/80 border-[2px] border-[#9d00ff] text-[#9d00ff] rounded-xl 
                      flex items-center justify-center font-bold text-3xl tracking-widest uppercase
                      shadow-[0_0_15px_rgba(157,0,255,0.4)_inset,0_0_15px_rgba(157,0,255,0.4)] backface-hidden">
        Industry Collaboration
      </div>

      <div className="absolute w-full h-full bg-black flex flex-col items-center justify-center text-center p-6 
                      text-[#9d00ff] border-[2px] border-[#9d00ff] rounded-xl text-lg font-medium 
                      shadow-[0_0_20px_rgba(157,0,255,0.6)_inset,0_0_20px_rgba(157,0,255,0.6)] rotate-y-180 backface-hidden">
        <p className="text-white">Connect with future tech leaders and create opportunities</p>
        <p>for collaborative projects and internships.</p>
      </div>

    </div>
  </div>

</div>

<div className="flex justify-center mt-12 download-brochure">
  <a
    href="https://www.scse-nitjsr.in/SCSE_brochure.pdf"
    className="inline-block text-fuchsia-200 text-6xl px-6 py-4 bg-pink-500 rounded-3xl pt-2"
  >
    Download Brochure
  </a>
</div>

<div className="flex justify-evenly items-start w-full px-16 mt-20 gap-12 footer">

  {/* BANK DETAILS CARD */}
  <div className="flex flex-col w-[900px] text-3xl p-10 rounded-xl 
                  bg-black/70 border-2 border-cyan-400 text-cyan-400 
                  shadow-[0_0_25px_rgba(0,247,255,0.6)_inset,0_0_25px_rgba(0,247,255,0.6)] 
                  space-y-4">
    <h2 className="text-4xl font-bold pb-4 pt-4 tracking-widest uppercase bank">
      Our Bank Details
    </h2>

    <p><span className="font-semibold bdetail">Account Name:</span> Society of Computer Application</p>
    <p><span className="font-semibold bdetail">Bank Branch:</span> NIT Campus Adityapur</p>
    <p><span className="font-semibold bdetail">Account Number:</span> 35637764271</p>
    <p><span className="font-semibold bdetail">IFSC Code:</span> SBIN0001882</p>
    <p><span className="font-semibold bdetail">CIF:</span> 88953256160</p>
  </div>

  {/* CONTACT US CARD */}
  <div className="flex flex-col items-center justify-center 
                  bg-black/70 border-2 border-fuchsia-400 text-fuchsia-400 
                  rounded-xl p-10 text-2xl font-semibold 
                  shadow-[0_0_25px_rgba(255,0,255,0.6)_inset,0_0_25px_rgba(255,0,255,0.6)] 
                  space-y-6 cursor-pointer transition-transform duration-300 
                  hover:scale-105 hover:shadow-[0_0_35px_#ff00ff,0_0_55px_#00f7ff] bank">
    <div>For more enquiries</div>
    <div className="uppercase tracking-widest bdetail">Contact Us</div>
  </div>

</div>


    </>
  )
}

export default Sponsors
