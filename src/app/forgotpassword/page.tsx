"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    await fetch("/api/auth/forgotpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // Always show success to avoid leaking whether email exists
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-xl w-[400px] space-y-4">

        <h1 className="text-3xl font-bold text-center">Forgot Password</h1>

        {submitted ? (
          <div className="space-y-4 text-center">
            <p className="text-gray-300 text-sm">
              If an account with that email exists, a reset link has been sent.
              Check your inbox (and spam folder).
            </p>
            <Link
              href="/login"
              className="block text-purple-400 hover:text-purple-300 hover:underline text-sm"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-400 text-sm">
              Enter your registered email and we'll send you a password reset link.
            </p>

            <input
              type="email"
              placeholder="Email"
              required
              className="w-full p-3 bg-black border border-gray-700 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-gray-400 hover:text-gray-300 hover:underline"
              >
                Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}