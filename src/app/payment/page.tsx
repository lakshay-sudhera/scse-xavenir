"use client";
import RegistrationFeesButton from "@/components/RegistrationFeesButton";

export default function PaymentPage() {
  const email = "priyanshuraj979837@gmail.com"; // replace with real email

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-900 to-blue-900">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-white/20 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold text-white mb-4">
          Pay Registration Fees
        </h1>
        <p className="text-gray-300 mb-6">
          Secure your spot by completing the payment.
        </p>
        <RegistrationFeesButton email={email} />
      </div>

    </div>
  );
}