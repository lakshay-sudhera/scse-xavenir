import type { Metadata } from "next";
import EventCard from "./epage";

export const metadata: Metadata = {
  title: "Events - SCSE",
  description: "Events of the SCSE ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function DashboardPage() {
  return <EventCard />;
}
