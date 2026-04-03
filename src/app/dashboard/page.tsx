import type { Metadata } from "next";
import DashboardPage from "./dashboardpage";

export const metadata: Metadata = {
  title: "Dashboard - SCSE",
  description: "Dashboard page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <DashboardPage />;
}
