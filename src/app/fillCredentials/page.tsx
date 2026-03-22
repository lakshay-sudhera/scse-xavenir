import type { Metadata } from "next";
import Page from "./fpage";

export const metadata: Metadata = {
  title: "Register - SCSE",
  description: "Register to the SCSE ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function DashboardPage() {
  return <Page />;
}
