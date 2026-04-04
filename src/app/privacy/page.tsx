import type { Metadata } from "next";
import PrivacyPage from "./privacypage";  

export const metadata: Metadata = {
  title: "Privacy Policy - SCSE",
  description: "Privacy policy page",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <PrivacyPage />;
}

