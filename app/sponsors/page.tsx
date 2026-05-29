import { Metadata } from "next";
import SponsorsClient from "@/components/sections/sponsors/SponsorsClient";

export const metadata: Metadata = {
  title: "Sponsor Us & Partner with ROAM | ROAM Robotics",
  description:
    "Support next-generation engineering talent. Partner with ROAM Robotics to fuel hands-on autonomous systems education and state-of-the-art rover development.",
  alternates: {
    canonical: "https://schulichroam.com/sponsors",
  },
  keywords: [
    "sponsor ROAM robotics",
    "engineering sponsorship",
    "University of Calgary sponsors",
    "rover team funding",
    "partner with student engineering",
    "Calgary corporate sponsorships"
  ],
};

export default function SponsorPage() {
  return <SponsorsClient />;
}
