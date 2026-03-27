import Link from "next/link";

export default function Footer() {
  return (
    <footer id="contact" className="footer">
      <div className="footer-top-line" />

      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link href="/" className="logo" style={{ fontSize: "1.4rem", display: "block", marginBottom: "1rem" }}>
            &lt;/SCSE&gt;
          </Link>
          <p>Innovate. Create. Dominate.<br />Join the biggest tech event of the year.<br />Code to the Future.</p>
          <div className="social-links">
            <a href="https://www.instagram.com/scse.nitjsr" target="_blank" rel="noreferrer" className="social-link">IG</a>
            <a href="https://www.youtube.com/channel/UChVrvyEjDkUEhqoBezJLxpw" target="_blank" rel="noreferrer" className="social-link">YT</a>
            <a href="https://www.linkedin.com/company/scse-nitjsr" target="_blank" rel="noreferrer" className="social-link">IN</a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="footer-col">
          <h4>Quick Links</h4>
          <Link href="/terms">Terms &amp; Conditions</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy Policy</Link>
          <Link href="/refund">Refund &amp; Cancellation</Link>
          <Link href="/shipping">Shipping &amp; Delivery</Link>
        </div>

        {/* Navigate */}
        <div className="footer-col">
          <h4>Navigate</h4>
          <a href="/#hero">Home</a>
          <a href="/about">About</a>
          <a href="/events">Events</a>
          <Link href="/gallery">Gallery</Link>
          <Link href="/sponsors">Sponsors</Link>
        </div>

        {/* Contact */}
        <div className="footer-col footer-contact-col">
          <h4>Contact Us</h4>
          <p>National Institute of Technology<br />Adityapur, Jamshedpur<br />Jharkhand <span>831014</span></p>
          <p><span>+91 91188 41006</span></p>
          <p><span>+91 97986 87024</span></p>
          <p>
            <span>
              <a href="mailto:scse@nitjsr.ac.in" style={{ color: "var(--cyan)", textDecoration: "none" }}>
                scse@nitjsr.ac.in
              </a>
            </span>
          </p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Xavenir. All rights reserved. | Designed &amp; Managed by SCSE Web Team</p>
        <div className="visitors">⬡ VISITORS : 78,772</div>
      </div>
    </footer>
  );
}