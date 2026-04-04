import GalleryPage from "./GalleryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gallery - SCSE",
  description: "Gallery page ",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <GalleryPage />;
}
