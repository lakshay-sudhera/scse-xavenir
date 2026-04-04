import './page.css'
import SponsorCard from './SponsorCard'
import Link from "next/link";

function Sponsors() {
  return (
    <>
      <video autoPlay muted loop id="video-bg">
        <source src="carMoving.mp4" type="video/mp4" />
      </video>

      <div className="scanlines"></div>
      <div className="vignette"></div>

      {/* ─── WRAPPER ─── */}
      <div className="relative z-10 w-full">

        {/* ── HERO / SPONSOR CARDS ── */}
        <main className="flex flex-col items-center w-full min-h-screen pb-20" style={{ paddingTop: 'clamp(90px, 12vw, 140px)' }}>

          {/* Title */}
          <div className="relative flex flex-col items-center mb-16 md:mb-80 py-8 md:py-12 w-full max-w-5xl px-4">
            <div className="cyber-frame">
              <div className="cyber-frame-tr"></div>
              <div className="cyber-frame-bl"></div>
            </div>
            <h1
              className="glitch"
              data-text="SPONSORS"
              style={{ textShadow: '0 0 18px rgba(0,247,255,0.5)' }}
            >
              SPONSORS
            </h1>
            <div className="neon-divider"></div>
          </div>

          {/* Sponsor Cards */}
          <div className="flex flex-col md:flex-row flex-wrap justify-center gap-6 md:gap-12 w-full max-w-6xl px-6 md:px-4 mt-10 md:mt-72 items-center">

            {/* CARD 1 */}
            <div className="sponsor-card-wrapper">
              <SponsorCard
                title="Cloud Partner"
                logo="utho.png"
                name="Utho"
                tagline="UTHO - BHARAT KA CLOUD"
              />
            </div>

            {/* CARD 2 */}
            <div className="sponsor-card-wrapper">
              <SponsorCard
                title="Travel Partner"
                logo="wheelBros.png"
                name="WheelBros"
                tagline="Your Travel, your way"
              />
            </div>

            {/* CARD 3 */}
            <div className="sponsor-card-wrapper">
              <SponsorCard
                title="Food Partner"
                logo="foodAffair.png"
                name="FoodAffairs"
                tagline="You decide.. your Taste.."
              />
            </div>

          </div>

          {/* BE OUR SPONSORS CTA */}
          <div className="sponsor-cta">
            <a
              href="https://docs.google.com/forms/d/e/1FAIpQLSeYMEDPbFvrT6418RWm_ucp2OJ6y-0XaXkkrgdE4Zt82JGH4A/viewform?usp=dialog"
              className="cta-btn"
            >
              ⚡ Be Our Sponsor
            </a>
          </div>

        </main>

        {/* ── FOREFRONT SECTION ── */}
        <div className="flex justify-center mt-20 px-4">
          <div className="forefront-section max-w-3xl text-center space-y-6">
            <h2>Be at the forefront of innovation!</h2>
            <p>
              SCSE, the premier event of NIT Jamshedpur, where creativity meets
              cutting-edge technology. By sponsoring us, you align your brand with
              groundbreaking innovations, vibrant competitions, and a community of
              future leaders.
            </p>
            <p>
              Partner with us to drive progress, inspire excellence, and be a part of
              the legacy that shapes tomorrow.
            </p>
          </div>
        </div>

        {/* ── WHY SPONSOR US ── */}
        <div className="flex flex-col items-center mb-12 why-sponsor-margin">
          <h2
            className="glitch !text-[3.2rem] md:!text-[3.8rem] text-center"
            data-text="WHY SPONSOR US ?"
          >
            WHY SPONSOR US ?
          </h2>
          <div className="neon-divider"></div>
        </div>

        {/* ── FLIP CARDS ── */}
        <div className="flex flex-col gap-6 p-4 md:p-6 items-center w-full mt-4 md:mt-7">

          {/* BRAND EXPOSURE */}
          <div className="w-full max-w-[850px] min-h-[90px] h-auto perspective">
            <div className="flip-inner">
              <div className="flip-front"
                style={{
                  border: '1.5px solid rgba(0,247,255,0.45)',
                  boxShadow: '0 0 18px rgba(0,247,255,0.2) inset, 0 0 18px rgba(0,247,255,0.15)'
                }}>
                <span className="flip-front-label" style={{ color: '#00f7ff', textShadow: '0 0 12px rgba(0,247,255,0.7)' }}>
                  Brand Exposure
                </span>
              </div>
              <div className="flip-back"
                style={{
                  border: '1.5px solid rgba(0,247,255,0.45)',
                  boxShadow: '0 0 25px rgba(0,247,255,0.3) inset'
                }}>
                <p>Get visibility across social media, event banners, and official merchandise.</p>
                <p style={{ color: '#00f7ff' }}>Connect with top-tier tech talent and future innovators.</p>
              </div>
            </div>
          </div>

          {/* RECRUITMENT EDGE */}
          <div className="w-full max-w-[850px] min-h-[90px] h-auto perspective">
            <div className="flip-inner">
              <div className="flip-front"
                style={{
                  border: '1.5px solid rgba(255,0,200,0.45)',
                  boxShadow: '0 0 18px rgba(255,0,200,0.2) inset, 0 0 18px rgba(255,0,200,0.15)'
                }}>
                <span className="flip-front-label" style={{ color: '#ff00c8', textShadow: '0 0 12px rgba(255,0,200,0.7)' }}>
                  Recruitment Edge
                </span>
              </div>
              <div className="flip-back"
                style={{
                  border: '1.5px solid rgba(255,0,200,0.45)',
                  boxShadow: '0 0 25px rgba(255,0,200,0.3) inset'
                }}>
                <p>Targeted Reach — access a curated pool of skilled students</p>
                <p style={{ color: '#ff00c8' }}>for internships and full-time opportunities.</p>
              </div>
            </div>
          </div>

          {/* CAMPUS PRESENCE */}
          <div className="w-full max-w-[850px] min-h-[90px] h-auto perspective">
            <div className="flip-inner">
              <div className="flip-front"
                style={{
                  border: '1.5px solid rgba(252,228,54,0.45)',
                  boxShadow: '0 0 18px rgba(252,228,54,0.2) inset, 0 0 18px rgba(252,228,54,0.15)'
                }}>
                <span className="flip-front-label" style={{ color: '#fce436', textShadow: '0 0 12px rgba(252,228,54,0.7)' }}>
                  Campus Presence
                </span>
              </div>
              <div className="flip-back"
                style={{
                  border: '1.5px solid rgba(252,228,54,0.45)',
                  boxShadow: '0 0 25px rgba(252,228,54,0.3) inset'
                }}>
                <p style={{ color: '#fce436' }}>Strengthen your brand within the academic ecosystem of NIT Jamshedpur</p>
                <p>and build lasting recognition among tomorrow's engineers.</p>
              </div>
            </div>
          </div>

          {/* CREDIBILITY BOOST */}
          <div className="w-full max-w-[850px] min-h-[90px] h-auto perspective">
            <div className="flip-inner">
              <div className="flip-front"
                style={{
                  border: '1.5px solid rgba(0,255,136,0.45)',
                  boxShadow: '0 0 18px rgba(0,255,136,0.2) inset, 0 0 18px rgba(0,255,136,0.15)'
                }}>
                <span className="flip-front-label" style={{ color: '#00ff88', textShadow: '0 0 12px rgba(0,255,136,0.7)' }}>
                  Credibility Boost
                </span>
              </div>
              <div className="flip-back"
                style={{
                  border: '1.5px solid rgba(0,255,136,0.45)',
                  boxShadow: '0 0 25px rgba(0,255,136,0.3) inset'
                }}>
                <p>Associate your brand with a prestigious technical society.</p>
                <p style={{ color: '#00ff88' }}>Gain trust through institutional recognition.</p>
              </div>
            </div>
          </div>

          {/* INDUSTRY COLLABORATION */}
          <div className="w-full max-w-[850px] min-h-[90px] h-auto perspective">
            <div className="flip-inner">
              <div className="flip-front"
                style={{
                  border: '1.5px solid rgba(157,0,255,0.45)',
                  boxShadow: '0 0 18px rgba(157,0,255,0.2) inset, 0 0 18px rgba(157,0,255,0.15)'
                }}>
                <span className="flip-front-label" style={{ color: '#9d00ff', textShadow: '0 0 12px rgba(157,0,255,0.7)' }}>
                  Industry Collaboration
                </span>
              </div>
              <div className="flip-back"
                style={{
                  border: '1.5px solid rgba(157,0,255,0.45)',
                  boxShadow: '0 0 25px rgba(157,0,255,0.3) inset'
                }}>
                <p>Connect with future tech leaders and create opportunities</p>
                <p style={{ color: '#9d00ff' }}>for collaborative projects and internships.</p>
              </div>
            </div>
          </div>

        </div>

        {/* ── DOWNLOAD BROCHURE ── */}
        <div className="download-brochure">
          <a href="/brochure.pdf" className="download-btn">
            ↓ Download Brochure
          </a>
        </div>

        {/* ── FOOTER ── */}
        <div className="flex flex-wrap justify-evenly items-stretch w-full px-8 gap-12 footer">

          {/* BANK DETAILS */}
          <div className="bank-card w-full max-w-[720px] rounded-2xl overflow-hidden"
               style={{
                 background: 'linear-gradient(160deg, rgba(0,22,35,0.97) 0%, rgba(0,8,16,0.99) 100%)',
                 border: '1.5px solid rgba(0,247,255,0.35)',
                 boxShadow: '0 0 60px rgba(0,247,255,0.12) inset, 0 0 40px rgba(0,247,255,0.1), 0 20px 60px rgba(0,0,0,0.5)',
               }}>
            {/* Header */}
            <div className="flex items-center gap-4 px-10 py-6"
                 style={{ borderBottom: '1.5px solid rgba(0,247,255,0.18)', background: 'rgba(0,247,255,0.06)' }}>
              <div style={{ width: 12, height: 12, borderRadius: '50%', background: 'var(--cyan)', boxShadow: '0 0 12px var(--cyan), 0 0 24px var(--cyan)', flexShrink: 0 }}></div>
              <span className="bank-card-title">Our Bank Details</span>
            </div>
            {/* Rows */}
            <div className="flex flex-col px-10 py-4">
              {[
                { label: 'Account Name',   value: 'Society of Computer Application' },
                { label: 'Bank Branch',    value: 'NIT Campus Adityapur' },
                { label: 'Account Number', value: '35637764271' },
                { label: 'IFSC Code',      value: 'SBIN0001882' },
                { label: 'CIF',            value: '88953256160' },
              ].map(({ label, value }, i, arr) => (
                <div key={label}
                     className="bank-row flex items-center justify-between gap-8 py-5"
                     style={i < arr.length - 1 ? { borderBottom: '1px solid rgba(0,247,255,0.1)' } : {}}>
                  <span className="bank-label">{label}</span>
                  <span className="bank-value">{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CONTACT */}
          <Link href="/contact">
  <div className="contact-card-inner flex flex-col items-center justify-center w-full max-w-[300px]
                  bg-black/70 border border-fuchsia-400/40 text-fuchsia-200
                  rounded-2xl p-10
                  shadow-[0_0_30px_rgba(255,0,255,0.25)_inset,0_0_30px_rgba(255,0,255,0.15)]
                  space-y-5 cursor-pointer transition-transform duration-300
                  hover:scale-105 hover:shadow-[0_0_45px_rgba(255,0,255,0.5),0_0_70px_rgba(0,247,255,0.2)]">
    <div className="text-fuchsia-200/80 tracking-widest uppercase text-sm">
      For more enquiries
    </div>
    <div className="contact-label text-fuchsia-300">
      Contact Us
    </div>
  </div>
</Link>

        </div>

      </div>
    </>
  )
}

export default Sponsors