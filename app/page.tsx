import { Metadata } from "next";
import HomeClient from "@/components/home/HomeClient";

export const metadata: Metadata = {
  title: "ROAM Robotics Club | Autonomous Systems & AI",
  description:
    "ROAM (Robotics Operation for Autonomous Mapping) is a premier student-led robotics club at the Schulich School of Engineering, University of Calgary. We build intelligent autonomous systems, LiDAR mapping rigs, and advanced Mars rovers.",
  alternates: {
    canonical: "https://schulichroam.com",
  },
};

export default function Home() {
  return <HomeClient />;
}