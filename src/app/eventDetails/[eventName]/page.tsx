import type { Metadata } from "next";
import RegisterEventPage from "./eventdetails";

export const metadata: Metadata = {
  title: "Event Details - SCSE",
  description: "Event details page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <RegisterEventPage/>
}

