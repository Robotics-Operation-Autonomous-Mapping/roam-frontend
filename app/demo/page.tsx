import { Metadata } from "next";
import DemoClient from "@/components/sections/demo/DemoClient";

export const metadata: Metadata = {
  title: "Mission Control Telemetry Demo | ROAM Robotics",
  description:
    "Explore the live mission telemetry dashboard, point cloud visualizations, and autonomous navigation simulations built by the ROAM Robotics engineering team.",
  alternates: {
    canonical: "https://schulichroam.com/demo",
  },
  keywords: [
    "mission control telemetry",
    "ROAM demo",
    "autonomous rover simulator",
    "point cloud visualization",
    "LiDAR data stream",
    "student robotics demo"
  ],
};

export default function DemoPage() {
  return <DemoClient />;
}
