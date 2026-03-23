"use client";

import { Suspense } from "react";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError("");

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/auth/resetpassword", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, email, newPassword }),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } else {
      setError(data.error || "Something went wrong.");
    }
  };

  if (!token || !email) {
    return (
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="bg-gray-900 p-10 rounded-xl w-[400px] text-center space-y-4">
          <p className="text-red-400">Invalid or missing reset link.</p>
          <Link href="/forgotpassword" className="text-purple-400 hover:underline text-sm">
            Request a new one
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="bg-gray-900 p-10 rounded-xl w-[400px] space-y-4">

        <h1 className="text-3xl font-bold text-center">Reset Password</h1>

        {success ? (
          <div className="text-center space-y-3">
            <p className="text-green-400 text-sm">
              Password reset successfully! Redirecting to login...
            </p>
            <Link href="/login" className="text-purple-400 hover:underline text-sm">
              Go to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-gray-400 text-sm">
              Enter a new password for <span className="text-white">{email}</span>
            </p>

            <input
              type="password"
              placeholder="New Password"
              required
              className="w-full p-3 bg-black border border-gray-700 rounded"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirm New Password"
              required
              className="w-full p-3 bg-black border border-gray-700 rounded"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
            />

            {error && (
              <p className="text-red-400 text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 py-3 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <div className="text-center">
              <Link href="/login" className="text-sm text-gray-400 hover:text-gray-300 hover:underline">
                Back to Login
              </Link>
            </div>
          </form>
        )}

      </div>
    </main>
  );
}

// Outer component wraps with Suspense 
export default function ResetPassword() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-gray-400 text-sm">Loading...</div>
      </main>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}