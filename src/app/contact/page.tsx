import type { Metadata } from "next";
import Contact from "./contactpage";

export const metadata: Metadata = {
  title: "Contact Us - SCSE",
  description: "Contact us page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <Contact/>
}