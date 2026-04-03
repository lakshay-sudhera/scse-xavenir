import type { Metadata } from "next";
import TermsPage from "./termspage";

export const metadata: Metadata = {
  title: "T&C - SCSE",
  description: "Terms and conditions page",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <TermsPage />;
}