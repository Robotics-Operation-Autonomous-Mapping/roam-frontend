import { Metadata } from "next";
import ProjectsClient from "@/components/sections/projects/ProjectsClient";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "The rigs and rovers built by ROAM Robotics at the University of Calgary, starting with ARGOS, our first LiDAR mapping rig.",
  alternates: {
    canonical: "https://schulichroam.com/projects",
  },
};

export default function ProjectsPage() {
  return <ProjectsClient />;
}