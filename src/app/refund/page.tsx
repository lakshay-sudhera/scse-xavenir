import type { Metadata } from "next";
import RefundPage from "./refundpage";  

export const metadata: Metadata = {
  title: "Refund & Cancellation - SCSE",
  description: "Refund and cancellation policy page",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <RefundPage />;
}

