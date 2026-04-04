import type { Metadata } from "next";
import Shipping from "./shippingpage";


export const metadata: Metadata = {
  title: "Shipping & Delivery Policy - SCSE",
  description: "Shipping and delivery information for SCSE events",
  icons: {
    icon: "/SCSElogo.svg",
    apple: "/SCSElogo.svg", // Apple devices
    shortcut: "/SCSElogo.svg", // Shortcut icon
  },
};

export default function Page() {
  return <Shipping/>
}