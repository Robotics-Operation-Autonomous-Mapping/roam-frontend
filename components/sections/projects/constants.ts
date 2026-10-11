export type Project = {
    slug: string;
    name: string;
    tagline: string;
    status: string;
    summary: string;
    specs: { label: string; value: string }[];
    image?: string;
    model?: string;
};

export const PROJECTS: Project[] = [
{
    slug: "argos",
    name: "ARGOS",
    tagline: "Our first mapping rig",
    status: "COMPLETED",
    summary:
      "ARGOS is ROAM's first project: a sensor rig that maps its surroundings in 3D. Two Raspberry Pi 4 boards share the work, one reading the LiDAR and the other the IMU and camera, and RTAB-Map fuses it all into a live map.",
    specs: [
      { label: "Compute", value: "2× Raspberry Pi 4" },
      { label: "Software", value: "ROS 2 Humble" },
      { label: "LiDAR", value: "YDLidar G4" },
      { label: "IMU", value: "ICM-20948" },
      { label: "Camera", value: "FLIR Blackfly GigE" },
      { label: "Mapping", value: "RTAB-Map SLAM" },
    ],
      model: "/models/argos.glb",
  },
];