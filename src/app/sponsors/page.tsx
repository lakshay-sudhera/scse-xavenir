import type { Metadata } from "next";
import Contact from "./sponsorspage";
import Sponsors from "./sponsorspage";

export const metadata: Metadata = {
  title: "Sponsors - SCSE",
  description: "Sponsor us page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <Sponsors/>
}