"use client";
import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import axios from "axios";
import { useRouter } from "next/navigation";

const loadRazorpayScript = () => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Razorpay SDK failed to load"));
    document.body.appendChild(script);
  });
};

interface RegistrationFeesButtonProps {
  email: string;
}

// ── Receipt Modal (rendered via Portal → escapes any parent stacking context) ──
function ReceiptModal({
  paymentId,
  onClose,
}: {
  paymentId: string;
  onClose: () => void;
}) {
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Wait for document to be available (SSR safety)
  useEffect(() => { setMounted(true); }, []);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/receipt");

      // Log exact status for debugging
      if (!res.ok) {
        const text = await res.text();
        console.error(`Receipt fetch failed: ${res.status}`, text);
        alert(`Could not download receipt (${res.status}). Check console for details.`);
        return;
      }

      // Confirm it's actually a PDF before blobbing
      const contentType = res.headers.get("content-type") || "";
      if (!contentType.includes("pdf")) {
        const text = await res.text();
        console.error("Receipt route returned non-PDF:", text);
        alert("Receipt generation failed. Check server logs.");
        return;
      }
      // blob is binary large object
      // when server sends pdf binary data then browser receives ReadableStream
      // it converts blob(file-like-object) so browser can treat it like a file
      const blob = await res.blob();
      // it converts file to a temporary downloadable link
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement("a");
      a.href     = url;
      a.download = `receipt_${paymentId}.pdf`;
      document.body.appendChild(a); // required for Firefox
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download error:", err);
      alert("Network error while downloading receipt. Try from the Receipt tab in dashboard.");
    } finally {
      setDownloading(false);
    }
  };

  const modal = (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 999999,
        background: "rgba(0,0,10,0.88)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "1rem",
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "linear-gradient(135deg,#0a0a1f,#0f0f2a)",
          border: "1px solid rgba(0,245,255,0.25)",
          borderRadius: "2px",
          padding: "2.5rem 2rem",
          width: "100%", maxWidth: "420px",
          boxShadow: "0 0 60px rgba(0,245,255,0.12), 0 0 120px rgba(255,0,128,0.07)",
          position: "relative",
        }}
      >
        {/* Corner accents */}
        <span style={{ position:"absolute",top:-1,left:-1,width:16,height:16,borderTop:"2px solid #00f5ff",borderLeft:"2px solid #00f5ff" }} />
        <span style={{ position:"absolute",bottom:-1,right:-1,width:16,height:16,borderBottom:"2px solid #ff0080",borderRight:"2px solid #ff0080" }} />

        {/* Success icon */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: 64, height: 64, margin: "0 auto 1rem",
            background: "rgba(0,255,136,0.1)",
            border: "2px solid #00ff88",
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.8rem",
            boxShadow: "0 0 24px rgba(0,255,136,0.3)",
            color: "#00ff88",
          }}>
            ✓
          </div>
          <h2 style={{
            fontFamily: "'Orbitron', monospace",
            fontSize: "1rem", fontWeight: 900,
            color: "#ffffff", letterSpacing: 3,
            marginBottom: "0.4rem",
          }}>
            PAYMENT SUCCESSFUL
          </h2>
          <p style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: "0.7rem", letterSpacing: 2,
            color: "#00ff88",
          }}>
            // PRIME ACCESS GRANTED
          </p>
        </div>

        {/* Payment details */}
        <div style={{
          background: "rgba(0,245,255,0.04)",
          border: "1px solid rgba(0,245,255,0.1)",
          padding: "1rem",
          marginBottom: "1.5rem",
        }}>
          {[
            { label: "AMOUNT",     value: "₹900" },
            { label: "PAYMENT ID", value: paymentId },
            { label: "STATUS",     value: "✓ VERIFIED" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              display: "flex", justifyContent: "space-between",
              alignItems: "center", padding: "6px 0",
              borderBottom: "1px solid rgba(0,245,255,0.06)",
            }}>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.62rem", letterSpacing:2, color:"rgba(0,245,255,0.5)", flexShrink: 0 }}>
                {label}
              </span>
              <span style={{ fontFamily:"'Share Tech Mono',monospace", fontSize:"0.72rem", color:"rgba(220,230,255,0.9)", maxWidth:"60%", textAlign:"right", wordBreak:"break-all" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Download button */}
        <button
          onClick={handleDownload}
          disabled={downloading}
          style={{
            width: "100%", padding: "12px",
            background: downloading ? "rgba(0,245,255,0.1)" : "linear-gradient(90deg,#00f5ff,#bf00ff)",
            border: "none", cursor: downloading ? "not-allowed" : "pointer",
            fontFamily: "'Orbitron',monospace", fontSize: "0.72rem",
            fontWeight: 700, letterSpacing: 2,
            color: downloading ? "rgba(0,245,255,0.5)" : "#000",
            marginBottom: "0.8rem",
            transition: "all 0.25s",
            clipPath: "polygon(0 0,calc(100% - 10px) 0,100% 10px,100% 100%,10px 100%,0 calc(100% - 10px))",
          }}
        >
          {downloading ? "// GENERATING PDF..." : "⬇  DOWNLOAD RECEIPT"}
        </button>

        {/* Continue button */}
        <button
          onClick={onClose}
          style={{
            width: "100%", padding: "10px",
            background: "transparent",
            border: "1px solid rgba(0,245,255,0.2)",
            cursor: "pointer",
            fontFamily: "'Share Tech Mono',monospace", fontSize: "0.68rem",
            letterSpacing: 2, color: "rgba(0,245,255,0.6)",
            transition: "all 0.25s",
          }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = "#00f5ff")}
          onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(0,245,255,0.2)")}
        >
          CONTINUE TO DASHBOARD ›
        </button>
      </div>
    </div>
  );

  // Portal renders directly into document.body — bypasses ALL parent stacking contexts
  return mounted ? createPortal(modal, document.body) : null;
}

// ── Main Button ────────────────────────────────────────────────────────────────
export default function RegistrationFeesButton({ email }: RegistrationFeesButtonProps) {
  const [loading, setLoading] = useState(false);
  const [receiptPaymentId, setReceiptPaymentId] = useState<string | null>(null);
  const router = useRouter();

  const handlePayment = async () => {
    setLoading(true);
    try {
      await loadRazorpayScript();

      const { data } = await axios.post("/api/razorpay/registrationFeesOrder");
      if (!data.success) {
        setLoading(false);
        alert("Failed to create order: " + data.message + ". Retry Later");
        return;
      }

      const { order } = data;

      if (!(window as any).Razorpay) {
        setLoading(false);
        alert("Razorpay SDK failed to load. Check your internet connection.");
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY!,
        amount: order.amount,
        currency: order.currency,
        name: "SCSE",
        description: "Registration Fees — Xavenir '26",
        order_id: order.id,
        handler: async function (response: any) {
          try {
            const { data: verifyData } = await axios.post(
              "/api/razorpay/verifyRegistrationPayment",
              { ...response }
            );
            setLoading(false);
            if (verifyData.success) {
              setReceiptPaymentId(verifyData.paymentId || response.razorpay_payment_id);
            } else {
              alert("Payment verification failed. Contact support.");
            }
          } catch {
            setLoading(false);
            alert("Verification error. Contact support with payment ID: " + response.razorpay_payment_id);
          }
        },
        prefill: { email },
        theme: { color: "#00f5ff" },
        modal: {
          // disabling escape key to close popup
          escape: false,
          // this runs when user manually closes the popup
          ondismiss: () => setLoading(false),
        },
      };

      const rzp1 = new (window as any).Razorpay(options);
      rzp1.on("payment.failed", () => setLoading(false));
      // this opens the razorpay checkout ui
      rzp1.open();

    } catch (error) {
      setLoading(false);
      console.error("Payment Error:", error);
      alert("Something went wrong. Try later");
    }
  };

  const handleModalClose = () => {
    setReceiptPaymentId(null);
    window.location.reload();
    router.push("/dashboard");
  };

  return (
    <>
      {receiptPaymentId && (
        <ReceiptModal paymentId={receiptPaymentId} onClose={handleModalClose} />
      )}
      <button
        className="w-full mb-2 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-semibold py-3 px-6 rounded-xl transition-all transform hover:scale-105 shadow-lg shadow-purple-500/20 border border-purple-500/30 mt-5"
        onClick={handlePayment}
        disabled={loading}
      >
        {loading ? "Processing..." : "Pay Registration Fees"}
      </button>
    </>
  );
}