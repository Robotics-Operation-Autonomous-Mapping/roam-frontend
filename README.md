# ROAM — Engineering Intelligence Portal

> **Robotics Operation for Autonomous Mapping**
> *Building machines that read the world. Student engineers. Serious technology.*

ROAM is a high-fidelity digital infrastructure for the ROAM Robotics Club. It serves as both a public-facing portal and a technical demonstration of the autonomous mapping capabilities being developed. The platform is designed to emulate an industrial "Mission Control" aesthetic, prioritizing precision, technical depth, and immersive 3D visualization.

---

## 📡 Mission Architecture

The ROAM portal is built on a "Digital Twin" philosophy, ensuring that every software component reflects the high-precision engineering of the physical rover.

### 🧠 Core Perception Array
*   **High-Resolution LiDAR**: Real-time spatial mapping and obstacle avoidance.
*   **Stereo Vision System**: Depth perception and visual odometry for GPS-denied environments.
*   **9-DOF IMU**: High-precision orientation and acceleration tracking.
*   **RTK-GNSS**: Centimeter-level positioning for global navigation.

### 🔋 Autonomy Platform
*   **Edge AI Compute**: Onboard processing for real-time sensor fusion.
*   **Pathfinding Engine**: Advanced A* and Dijkstra implementations for dynamic obstacle navigation.
*   **Mission Clock**: Real-time mission telemetry and system status monitoring.

---

## 🛠️ Technical Stack

The platform utilizes a modern, performance-first stack to handle complex 3D rendering and real-time simulations in the browser.

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 14 (App Router) |
| **Rendering** | Three.js + React Three Fiber |
| **Logic** | TypeScript (Strict) |
| **Styling** | Tailwind CSS (Design Tokens) |
| **Animation** | GSAP (ScrollTrigger) + Framer Motion |
| **Environment** | Supabase (Data Management) |

---

## 📂 System Manifest

```text
roam-frontend/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           # Component-Driven Architecture
│   ├── hero/             # Immersive 3D landing experiences
│   ├── interactive/      # 3D Simulators & Exploded Rig views
│   │   ├── rig/          # 3D Sensor Rig sub-components
│   │   └── nav/          # Pathfinding & Navigation logic
│   ├── sections/         # Domain-specific page sections
│   └── ui/               # Design System primitives (Buttons, Labels)
├── lib/                  # Shared utilities & Animation providers
└── public/               # Static assets & 3D textures
```

---

## 🚀 Deployment & Operation

### Environmental Prerequisites
*   **Runtime**: Node.js 18.17.0 or higher.
*   **Package Manager**: npm v9.0.0 or higher.

### Command Procedures

1. **Initialize Dependencies**:
   ```bash
   npm install
   ```

2. **Launch Intelligence Center (Development)**:
   ```bash
   npm run dev
   ```

3. **Verify System Integrity (Linting)**:
   ```bash
   npm run lint
   ```

4. **Generate Production Manifest (Build)**:
   ```bash
   npm run build
   ```

---

## 🛡️ Engineering Standards

*   **Design Tokens**: All styles must adhere to the central design system defined in `globals.css` and the Tailwind configuration.
*   **Aesthetics**: Prioritize the "Engineering Intelligence" brand—mono-spaced typography, Coral primary accents, and high-contrast surfaces.
*   **Performance**: 3D scenes must utilize procedural geometry where possible to minimize external asset overhead.

---

## 📄 Operational License

This software and all associated assets are proprietary to the **ROAM Robotics Club**. All rights reserved. No unauthorized reproduction or redistribution is permitted.

---

<p align="center">
  <b>ROAM // 2026 // ATLAS-1 MISSION STATUS: ACTIVE</b>
</p>
