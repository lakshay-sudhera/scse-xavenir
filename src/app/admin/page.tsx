import type { Metadata } from "next";
import AdminPage from "./adminpage";

export const metadata: Metadata = {
  title: "Admin - SCSE",
  description: "Admin dashboard page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <AdminPage />;
}


