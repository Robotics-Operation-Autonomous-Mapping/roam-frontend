export const MILESTONES = [
  { label: "Rover concept & architecture",       status: "done" },
  { label: "Sensor placement design",            status: "done" },
  { label: "Compute stack selection",            status: "done" },
  { label: "Chassis CAD design",                 status: "active", note: "In progress" },
  { label: "Power distribution layout",          status: "upcoming" },
  { label: "Prototype chassis fabrication",      status: "upcoming" },
  { label: "Electronics integration",            status: "upcoming" },
  { label: "Sensor calibration",                 status: "upcoming" },
  { label: "First movement test",                status: "upcoming" },
  { label: "First autonomous navigation",        status: "upcoming" },
  { label: "First 3D digital twin generation",   status: "upcoming" },
];

export const SYSTEM_STACK = [
  { component: "Dual LiDAR Sensors",      spec: "Ouster OS1-32",        status: "CONFIRMED" },
  { component: "NVIDIA Jetson Orin ×2",   spec: "Onboard AI Compute",   status: "CONFIRMED" },
  { component: "Raspberry Pi 4",          spec: "Control & I/O Hub",    status: "CONFIRMED" },
  { component: "Dual RGB Cameras",        spec: "Stereo Vision Pipeline",status: "CONFIRMED" },
  { component: "IR Camera",               spec: "Thermal Sensing",       status: "CONFIRMED" },
  { component: "LiFePO4 Battery",         spec: "24V 30Ah",             status: "PLANNED"   },
  { component: "ROS 2 Humble",            spec: "Autonomy Framework",    status: "CONFIRMED" },
  { component: "FAST-LIO2",               spec: "LiDAR SLAM",           status: "PLANNED"   },
];
