import type { Metadata } from "next";
import Login from "./loginpage";

export const metadata: Metadata = {
  title: "Login // SCSE — Secure Access",
  description: "Login to the SCSE Dashboard",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg",
    shortcut: "/SCSElogo.svg",
  },
};

export default function DashboardPage() {
  return <Login />;
}