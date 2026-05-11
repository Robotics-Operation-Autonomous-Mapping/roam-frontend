import type { RigPart } from "./types";

// ─── Colour palette ───────────────────────────────────────────────────────────
export const C = {
  white: "#F5ECD7", // Cream
  offWhite: "#DDE2EB",
  panelGrey: "#222226", // Border/Surface-2
  midGrey: "#6B6B72", // Muted
  darkGrey: "#1A1A1E", // Surface-2
  chassis: "#111113", // Surface
  gold: "#E8512A", // Primary (Coral)
  goldDark: "#8B3018",
  goldLight: "#F07A50", // Primary-2
  blue: "#E8512A", // Remapping to primary theme
  blueGlow: "#F07A50",
  amber: "#F5ECD7", // Cream
  red: "#D94040", // Keep some functional colors
  green: "#2ECC71",
  black: "#0A0A0B", // BG
};

// ─── Category mappings ────────────────────────────────────────────────────────
export const CATEGORY_COLOR: Record<string, string> = {
  sensor: C.gold, // Primary Coral
  compute: C.white, // Cream
  power: C.goldLight,
  comms: C.midGrey,
  drive: C.red,
};

export const CATEGORY_LABEL: Record<string, string> = {
  sensor: "SENSOR",
  compute: "COMPUTE",
  power: "POWER",
  comms: "COMMS",
  drive: "DRIVE / SAFETY",
};

// ─── Wiring connections ───────────────────────────────────────────────────────
export const CONNECTIONS: [string, string][] = [
  ["lidar", "compute"],
  ["stereo_cam", "compute"],
  ["radar", "compute"],
  ["rtk_gps", "compute"],
  ["imu", "compute"],
  ["compute", "pdb"],
  ["battery", "pdb"],
  ["pdb", "esc"],
  ["pdb", "estop"],
  ["esc", "estop"],
  ["comms", "compute"],
];

// ─── Part definitions ─────────────────────────────────────────────────────────
export const PARTS: RigPart[] = [
  {
    id: "lidar",
    label: "Ouster OS1-64",
    partNumber: "SNS-LDR-001",
    spec: "64-ch · 120m range · 1024×20 res",
    voltage: "24 V",
    freq: "20 Hz",
    details:
      "64-channel solid-state LiDAR with 360° horizontal FOV and ±22.5° vertical FOV. Returns calibrated range, intensity, ambient and reflectivity per point. IP68-rated housing with integrated IMU for motion correction.",
    category: "sensor",
    position: [0, 3.1, 0],
    ringRadius: 0.42,
  },
  {
    id: "stereo_cam",
    label: "ZED X Stereo Camera",
    partNumber: "SNS-CAM-002",
    spec: "2×4K · 120° FOV · 0.3–20m depth",
    voltage: "5 V",
    freq: "60 Hz",
    details:
      "Wide-baseline stereo vision module with dual Sony IMX sensors. Provides neural depth maps, object detection, and positional tracking. Housed in an IP66 enclosure with integrated sunshield.",
    category: "sensor",
    position: [0, 2.1, 1.2],
    ringRadius: 0.65,
  },
  {
    id: "radar",
    label: "Continental ARS540",
    partNumber: "SNS-RAD-003",
    spec: "77 GHz FMCW · 300m range · ±60°",
    voltage: "12 V",
    freq: "77 GHz",
    details:
      "High-resolution 4D imaging radar with velocity disambiguation. Penetrates dust, fog, and rain where optical sensors fail. Outputs point cloud compatible with LiDAR fusion pipelines.",
    category: "sensor",
    position: [0, 1.65, 1.8],
    ringRadius: 0.48,
  },
  {
    id: "rtk_gps",
    label: "u-blox ZED-F9P RTK",
    partNumber: "SNS-GPS-004",
    spec: "RTK · ±1 cm accuracy · L1/L2 dual-band",
    voltage: "3.3 V",
    freq: "10 Hz",
    details:
      "Dual-band GNSS receiver with Real-Time Kinematic corrections for centimetre-level absolute positioning. Receives corrections via NTRIP over LTE modem. Mounted on vibration-isolated mast.",
    category: "sensor",
    position: [0, 3.5, -0.8],
    ringRadius: 0.3,
  },
  {
    id: "compute",
    label: "NVIDIA Jetson AGX Orin",
    partNumber: "CPU-JET-005",
    spec: "275 TOPS · 64 GB LPDDR5 · 12-core A78",
    voltage: "19–20 V",
    freq: "2.2 GHz",
    details:
      "Primary edge compute module running the full autonomy stack — perception, mapping, planning, and control at up to 275 TOPS. Thermally managed via vapour-chamber heat spreader and dual 80mm fans.",
    category: "compute",
    position: [-1.4, 1.8, 0],
    ringRadius: 0.65,
  },
  {
    id: "battery",
    label: "Li-NMC Pack 48V",
    partNumber: "PWR-BAT-006",
    spec: "48 V · 30 Ah · 1440 Wh · BMS integrated",
    voltage: "48 V",
    details:
      "Lithium NMC prismatic cell pack with integrated BMS monitoring cell voltage, temperature, and state-of-charge. IP67 rated aluminium enclosure. Provides ~4 hr runtime under nominal load.",
    category: "power",
    position: [0, 0.7, 0],
    ringRadius: 0.95,
  },
  {
    id: "pdb",
    label: "Power Distribution Unit",
    partNumber: "PWR-PDU-007",
    spec: "48→24→12→5→3.3 V · 30A mains",
    voltage: "48 V in",
    details:
      "Multi-rail power distribution with isolated DC-DC converters per subsystem. Fused outputs, current monitoring per rail, and hard-wired e-stop relay. PCB-mounted on ceramic standoffs.",
    category: "power",
    position: [1.4, 1.3, 0],
    ringRadius: 0.5,
  },
  {
    id: "esc",
    label: "Roboteq MDC2460 ESCs",
    partNumber: "DRV-ESC-008",
    spec: "4× 60A · CAN bus · encoder feedback",
    voltage: "48 V",
    freq: "20 kHz PWM",
    details:
      "Quad brushless motor controller array on a shared CAN network. Closed-loop current and velocity control with regenerative braking. Enclosed in anodised aluminium heatsink extrusion.",
    category: "drive",
    position: [-1.4, 0.9, 0],
    ringRadius: 0.55,
  },
  {
    id: "imu",
    label: "VectorNav VN-100",
    partNumber: "SNS-IMU-009",
    spec: "9-DOF · 800 Hz · ±0.5° pitch/roll",
    voltage: "3.3–5 V",
    freq: "800 Hz",
    details:
      "Tactical-grade MEMS IMU with onboard Kalman filter. Provides calibrated acceleration, angular rate, and magnetic field. Temperature-compensated over −40 to +85 °C for all-weather outdoor use.",
    category: "sensor",
    position: [1.4, 2.2, 0.6],
    ringRadius: 0.28,
  },
  {
    id: "comms",
    label: "Doodle Labs Mesh Rider",
    partNumber: "COM-RAD-010",
    spec: "900 MHz · 1 km LOS · MIMO · AES-256",
    voltage: "12 V",
    freq: "900 MHz",
    details:
      "Long-range mesh radio for telemetry, remote override, and RTK correction relay. Dual omnidirectional antennas in MIMO configuration. Encrypted link supports up to 50 Mbps throughput.",
    category: "comms",
    position: [1.4, 2.7, -0.8],
    ringRadius: 0.35,
  },
  {
    id: "estop",
    label: "E-Stop Safety Relay",
    partNumber: "SAF-EST-011",
    spec: "ISO 13849 PLd · dual-channel · <10ms",
    voltage: "24 V",
    details:
      "Dual-channel safety relay conforming to ISO 13849 Performance Level d. Cuts motor power within 10ms of activation. Hardwired to physical e-stop buttons and the comms watchdog timer.",
    category: "drive",
    position: [0, 1.3, -1.4],
    ringRadius: 0.42,
  },
];
