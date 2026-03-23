"use client";
import "./styles.css"
import { useState } from "react";
const contacts = [
  {
    name: "Amrish Yadav",
    role: "Payment Related Query",
    phone: "+91 91188 41006",
    email: "amrishrock2002@gmail.com",
    image: "/contact/amrish.jpg",
    // desc: "Payment failure, refund issues or finance-related queries.",
  },
  {
    name: "Harshit Shrivastav",
    role: "General Query",
    phone: "+91 89571 44430",
    email: "harshitshrivastav2609@gmail.com",
    image: "/contact/harshit.jpg",
    // desc: "General queries related to events or any help.",
  },
  {
    name: "Abhishek Kaushik",
    role: "Registration Related Query",
    phone: "+91 97986 87024",
    email: "abhishekkumar89647@gmail.com",
    image: "/contact/abhishek.jpg",
    // desc: "Registration issues, PRIME or event registration.",
  },
  {
    name: "Murli Dharan",
    role: "Event Related Query",
    phone: "+91 62016 68754",
    email: "murlidharan93103@gmail.com",
    image: "/contact/murli.jpg",
    // desc: "All event-related queries and guidance.",
  },
];
export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    message: "",
  });
  
  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    alert("🚀 Feedback Sent!");
  };

  return (
    <div className="relative min-h-screen bg-black text-white px-6 py-12 font-mono overflow-hidden">

    {/* Background Image */}
    <div
      className="absolute inset-0 bg-contain bg-center opacity-30 "
      style={{ backgroundImage: "url('/contact/cyberpunk-bg.jpeg')" }}
    />
  
    {/* Glow Overlay */}
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#fffffff,transparent)] " />
  
    {/* Title */}
    <h1 className="text-4xl md:text-5xl font-extrabold text-center mb-10 cyber-clean relative z-10 tracking-tight">
  SCSE CONTACTS
</h1>
      
      {/* CONTACT CARDS */}
      <div className="my-10 grid md:grid-cols-2 lg:grid-cols-4 gap-3 max-w-7xl mx-auto">
  {/* {contacts.map((c, i) => ( */}
    <div
      // key={i}
      className="relative rounded-2xl overflow-hidden group border border-purple-500/30 hover:border-pink-500 transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={contacts[0].image}
        alt={contacts[0].name}
        className="w-full h-105 object-cover group-hover:scale-110 transition duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 space-y-2">
        <h2 className="text-lg font-bold">{contacts[0].name}</h2>
        <p className="text-purple-400 text-sm">{contacts[0].role}</p>

        {/* <p className="text-gray-300 text-sm mt-2">{c.desc}</p> */}

        <div className="text-sm mt-2 space-y-1">
          <p>📞 {contacts[0].phone}</p>
          <a href="mailto:amrishrock2002@gmail.com">📧 {contacts[0].email}</a><br/>
          
          <a href="https://www.linkedin.com/in/amrish-yadav-363b63289?utm_source=share&amp;utm_campaign=share_via&amp;utm_content=profile&amp;utm_medium=android_app" target="_blank"  className="text-purple-400 cursor-pointer hover:underline">
            🔗 Linkedin Profile
          </a>
        </div>
      </div>
    </div>

    <div
      // key={i}
      className="relative rounded-2xl overflow-hidden group border border-purple-500/30 hover:border-pink-500 transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={contacts[1].image}
        alt={contacts[1].name}
        className="w-full h-105 object-cover group-hover:scale-110 transition duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 space-y-2">
        <h2 className="text-lg font-bold">{contacts[1].name}</h2>
        <p className="text-purple-400 text-sm">{contacts[1].role}</p>

        {/* <p className="text-gray-300 text-sm mt-2">{c.desc}</p> */}

        <div className="text-sm mt-2 space-y-1">
          <p>📞 {contacts[1].phone}</p>
          <a href="mailto:harshitshrivastav2609@gmail.com">📧 {contacts[1].email}</a><br/>
          
          <a href="https://www.linkedin.com/in/harshit-shrivastav-8b513127a" target="_blank"  className="text-purple-400 cursor-pointer hover:underline">
            🔗 Linkedin Profile
          </a>
        </div>
      </div>
    </div>

    <div
      // key={i}
      className="relative rounded-2xl overflow-hidden group border border-purple-500/30 hover:border-pink-500 transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={contacts[2].image}
        alt={contacts[2].name}
        className="w-full h-105 object-cover group-hover:scale-110 transition duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 space-y-2">
        <h2 className="text-lg font-bold">{contacts[2].name}</h2>
        <p className="text-purple-400 text-sm">{contacts[2].role}</p>

        {/* <p className="text-gray-300 text-sm mt-2">{c.desc}</p> */}

        <div className="text-sm mt-2 space-y-1">
          <p>📞 {contacts[2].phone}</p>
          <a href="mailto:abhishekkumar89647@gmail.com">📧 {contacts[2].email}</a><br/>
          
          <a href="https://www.linkedin.com/in/abhishek-kaushik-836435282" target="_blank"  className="text-purple-400 cursor-pointer hover:underline">
            🔗 Linkedin Profile
          </a>
        </div>
      </div>
    </div>

    <div
      // key={i}
      className="relative rounded-2xl overflow-hidden group border border-purple-500/30 hover:border-pink-500 transition-all duration-300"
    >
      {/* Background Image */}
      <img
        src={contacts[3].image}
        alt={contacts[3].name}
        className="w-full h-105 object-cover group-hover:scale-110 transition duration-500"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/70 to-transparent" />

      {/* Content */}
      <div className="absolute bottom-0 p-4 space-y-2">
        <h2 className="text-lg font-bold">{contacts[3].name}</h2>
        <p className="text-purple-400 text-sm">{contacts[3].role}</p>

        {/* <p className="text-gray-300 text-sm mt-2">{c.desc}</p> */}

        <div className="text-sm mt-2 space-y-1">
          <p>📞 {contacts[3].phone}</p>
          <a href="mailto:murlidharan93103@gmail.com">📧 {contacts[3].email}</a><br/>
          
          <a href="https://www.linkedin.com/in/murli-dharan-614b89298?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank"  className="text-purple-400 cursor-pointer hover:underline">
            🔗 Linkedin Profile
          </a>
        </div>
      </div>
    </div>
  {/* ))} */}
</div>

<div className="grid md:grid-cols-2 gap-10 max-w-6xl mx-auto">

        {/* Left Section - Info */}
        <div className="space-y-6">
          <div className="cyber-card">
            <h2 className="text-2xl text-pink-400">📍 Address</h2>
            <p className="text-gray-300 mt-2">
              Society of Computer Science and Engineering<br />
              National Institute of Technology<br/>
              Jamshedpur, Jharkhand<br/>
              831014, India<br/>
            </p>
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl text-blue-400">💰 Sponsers</h2>
            <p className="text-gray-300 mt-2">
              
              Email: scse.nit@gmail.com<br/>
            </p>
          </div>

          <div className="cyber-card">
            <h2 className="text-2xl text-purple-400">🕒 Office Hours</h2>
            <p className="text-gray-300 mt-2">
              Mon - Fri: 9:00 AM - 5:00 PM<br/>
              Sat - Sun: Holiday<br/>
            </p>
          </div>
        </div>

        {/* Right Section - Form */}
        <form onSubmit={handleSubmit} className="cyber-card space-y-4">
          <h2 className="text-2xl text-cyan-400 mb-4">Send Message</h2>

          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className="cyber-input"
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            className="cyber-input"
            required
          />
          <input
            name="mobile"
            placeholder="eg.: +91 9876543210"
            className="cyber-input"
            onChange={handleChange}
          />
          <textarea
            name="message"
            placeholder="Your Query..."
            rows={4}
            onChange={handleChange}
            className="cyber-input"
            required
          />

          <button type="submit" className="cyber-button">
            SEND MESSAGE
          </button>
        </form>
      </div>

      {/* Map Section */}
      <div className="mt-16 max-w-6xl mx-auto cyber-card">
        <h2 className="text-2xl text-green-400 mb-4">📡 Location Map</h2>
        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14714.846067448243!2d86.1446394!3d22.77608485!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e4daa475a5cd%3A0xd87b53fadcd771a1!2sNational%20Institute%20of%20Technology%20Jamshedpur%20(NIT%20Jamshedpur)!5e0!3m2!1sen!2sin!4v1774279951019!5m2!1sen!2sin" className="w-full h-72 rounded-lg border border-cyan-500" loading="lazy" ></iframe>
      </div>
    </div>
  );
}