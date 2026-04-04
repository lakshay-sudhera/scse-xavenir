import type { Metadata } from "next";
import AboutPage from "./aboutpage";

export const metadata: Metadata = {
  title: "About - SCSE",
  description: "About us page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <AboutPage/>
}