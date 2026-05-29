import { Metadata } from "next";
import JoinClient from "@/components/sections/join/JoinClient";

export const metadata: Metadata = {
  title: "Join the Team | ROAM Robotics",
  description:
    "Build the future of autonomous systems. Apply for mechanical, electrical, geomatics, software, controls, and system integration student engineering roles at ROAM Robotics.",
  alternates: {
    canonical: "https://schulichroam.com/join",
  },
  keywords: [
    "join ROAM",
    "apply to ROAM robotics",
    "student engineering roles",
    "Calgary robotics club recruitment",
    "Schulich engineering teams",
    "systems integration student jobs"
  ],
};

export default function JoinPage() {
  return <JoinClient />;
}
