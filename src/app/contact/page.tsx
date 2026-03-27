"use client";
import './styles.css'
import { useState } from "react";

const contacts = [
  {
    name: "Abhishek Kaushik",
    role: "Event Related Query",
    phone: "+91 97986 87024",
    email: "abhishekkumar89647@gmail.com",
    image: "/contact/abhishek.jpg",
    linkedin: "https://www.linkedin.com/in/abhishek-kaushik-836435282",
    tag: "PRESIDENT.NODE",
    color: "var(--pink)",
  },
  {
    name: "Sujal Kumar",
    role: "Payment Related Query",
    phone: "+91 99693780078",
    email: "sujalkumar@gmail.com",
    image: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774475261/1707369959885_re1yjn.jpg",
    linkedin: "https://www.linkedin.com/in/sujal-kumar-552a39237/",
    tag: "FINANCE.NODE",
    color: "var(--yellow)",
  },
  {
    name: "Priyanshu Raj",
    role: "Registration Related Query",
    phone: "+91 8789633693",
    email: "priyanshuraj979837@gmail.com",
    image: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774475067/WhatsApp_Image_2026-03-26_at_3.13.56_AM_yqltff.jpg",
    linkedin: "https://www.linkedin.com/in/priyanshuraj-nitjsr/",
    tag: "EVENTS.NODE",
    color: "var(--cyan)",
  },
   {
    name: "Ayush Verma",
    role: "General Query",
    phone: "+91 8936081707",
    email: "ayush7610jsr@gmail.com",
    image: "https://res.cloudinary.com/dtieuimsz/image/upload/v1774474434/WhatsApp_Image_2026-03-26_at_3.03.23_AM_yi25nd.jpg",
    linkedin: "https://www.linkedin.com/in/ayush-verma-jsr25",
    tag: "RESGISTER.NODE",
    color: "var(--purple)",
  },
 
];

         

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", mobile: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };


  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();

    // Validation
    if (!form.name || !form.email || !form.mobile || !form.message) {
      setError("All fields are required.");
      return;
    }

    const digitsOnly = form.mobile.replace(/\D/g, "");
    if (digitsOnly.length !== 10) {
      setError("Phone number must be exactly 10 digits.");
      return;
    }

    if (form.message.length < 5) {
      setError("Message must be at least 5 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contactUs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          number: digitsOnly,
          content: form.message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || data.message || "Something went wrong.");
        return;
      }

      setSubmitted(true);
      setForm({ name: "", email: "", mobile: "", message: "" });
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <>

       <div className="contact-page">

        <section className="contact-hero">
          <span className="contact-hero-label">// contact.init()</span>
          <h1 className="contact-hero-title">Contact <span>Us</span></h1>
          <p className="contact-hero-sub">// REACH_OUT · COLLABORATE · CONNECT</p>
        </section>

        <section className="contact-cards-section">
          <span className="contact-section-label">// team.contacts()</span>
          <div className="contact-cards-grid">
            {contacts.map((c, i) => (
              <div
                key={i}
                className="contact-card"
                style={{ "--card-accent": c.color, position: "relative" } as React.CSSProperties}
              >
                <div className="contact-card-img-wrap">
                  <img src={c.image} alt={c.name} className="contact-card-img" />
                  <div className="contact-card-corner tl" />
                  <div className="contact-card-corner br" />
                </div>
                <div className="contact-card-sep" />
                <div className="contact-card-body">
                  <span className="contact-card-tag">// {c.tag}</span>
                  <h3 className="contact-card-name">{c.name}</h3>
                  <p className="contact-card-role">{c.role}</p>
                  <div className="contact-card-details">
                    <a href={`tel:${c.phone}`} className="contact-card-detail"><span>☎</span> {c.phone}</a>
                    <a href={`mailto:${c.email}`} className="contact-card-detail"><span>✉</span> {c.email}</a>
                    <a href={c.linkedin} target="_blank" rel="noopener noreferrer" className="contact-card-linkedin">
                    <span>↗</span> LinkedIn Profile
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="contact-bottom">
          <span className="contact-section-label">// sys.connect()</span>
          <div className="contact-bottom-grid">

            

            <div className="info-stack">
              <div className="info-block">
                <div className="info-block-title">📍 Address</div>
                <div className="info-block-text">
                  Society of Computer Science and Engineering<br />
                  National Institute of Technology<br />
                  Adityapur, Jamshedpur, Jharkhand<br />
                  831014, India
                </div>
              </div>
              <div className="info-block">
                <div className="info-block-title">💼 Sponsorship</div>
                <div className="info-block-text">
                  For sponsorship and collaboration:<br />
                  <a href="mailto:scse.nit@gmail.com">scse.nit@gmail.com</a>
                </div>
              </div>
              <div className="info-block">
                <div className="info-block-title">🔗 Follow Us</div>
                <div className="info-block-text">
                  <a href="https://www.instagram.com/scse.nitjsr" target="_blank" rel="noreferrer">Instagram — @scse.nitjsr</a><br />
                  <a href="https://www.linkedin.com/company/scse-nitjsr" target="_blank" rel="noreferrer">LinkedIn — SCSE NITJSR</a><br />
                  <a href="https://www.youtube.com/channel/UChVrvyEjDkUEhqoBezJLxpw" target="_blank" rel="noreferrer">YouTube — SCSE Channel</a>
                </div>
              </div>
            </div>

            <div className="contact-form-wrap">
              <div className="contact-form-header">
  <span className="contact-form-tag">// sys.message.send()</span>
  <div className="contact-form-title">Send <span>Message</span></div>
</div>
            <div className="contact-form-inner">

  <div className="form-field">
    <label className="form-field-label">Full Name</label>
    <input type="text" name="name" placeholder="John Doe"
      value={form.name} onChange={handleChange} className="contact-input" />
  </div>

  <div className="form-field">
    <label className="form-field-label">Email Address</label>
    <input type="email" name="email" placeholder="you@example.com"
      value={form.email} onChange={handleChange} className="contact-input" />
  </div>

  <div className="form-field">
    <label className="form-field-label">Phone Number</label>
    <input name="mobile" placeholder="+91 98765 43210"
      value={form.mobile} onChange={handleChange} className="contact-input" />
  </div>

  <div className="form-field">
    <label className="form-field-label">Your Message</label>
    <textarea name="message" placeholder="Describe your query..." rows={5}
      value={form.message} onChange={handleChange} className="contact-input" />
  </div>

  {error && (
    <p style={{
      fontFamily: "'Share Tech Mono', monospace",
      fontSize: "0.72rem", color: "#ff4d6d",
      margin: "0", letterSpacing: "1px"
    }}>
      ⚠ {error}
    </p>
  )}

  <button
    onClick={handleSubmit}
    disabled={loading}
    className={`contact-submit ${submitted ? "contact-submit-success" : ""}`}
    style={{ opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
  >
    <span>{submitted ? "✓ MESSAGE SENT" : loading ? "SENDING..." : "SEND MESSAGE"}</span>
  </button>

</div>
            </div>

          </div>
        </section>

        <section className="contact-map-section">
          <span className="contact-section-label">// location.render()</span>
          <div className="contact-map-wrap">
            <div className="contact-map-bar">
              <div className="form-dots"><span /><span /><span /></div>
              <span>maps@nitjsr:~/location$ get_coordinates --nit-jamshedpur</span>
              <span className="map-status"><span className="map-dot" /> SIGNAL LOCKED</span>
            </div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14714.846067448243!2d86.1446394!3d22.77608485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e4daa475a5cd%3A0xd87b53fadcd771a1!2sNational%20Institute%20of%20Technology%20Jamshedpur%20(NIT%20Jamshedpur)!5e0!3m2!1sen!2sin!4v1774279951019!5m2!1sen!2sin"
              loading="lazy"
              title="NIT Jamshedpur Map"
            />
          </div>
        </section>

      </div>
    </>
  );
}