"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-4 bg-black text-white">
      
      <h1 className="text-xl font-bold">
        Xavenir
      </h1>

      <div className="flex gap-6">
        <Link href="/">Home</Link>
        <Link href="/events">Events</Link>
        <Link href="/team">Team</Link>
        <Link href="/sponsors">Sponsor</Link>
        <Link href="/contact">Contact</Link>
      </div>

    </nav>
  );
}