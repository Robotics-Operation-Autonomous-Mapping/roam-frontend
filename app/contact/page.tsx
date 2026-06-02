import { Metadata } from "next";
import ContactClient from "@/components/sections/contact/ContactClient";

export const metadata: Metadata = {
  title: "Contact Us | ROAM Robotics",
  description:
    "Get in touch with ROAM Robotics — partnerships, sponsorships, media, recruitment, and general inquiries.",
  alternates: {
    canonical: "https://schulichroam.com/contact",
  },
  keywords: [
    "contact ROAM",
    "Schulich ROAM email",
    "robotics club Calgary contact",
    "sponsorship inquiry ROAM",
  ],
};

export default function ContactPage() {
  return <ContactClient />;
}
