# ROAM — Robotics Operation for Autonomous Mapping

ROAM is the official digital presence of the ROAM Robotics Club, a student-led engineering initiative focused on building intelligent autonomous systems capable of exploring, understanding, and digitally recreating the world around them.

The website is a high-fidelity technical showcase, featuring an immersive scroll-driven 3D experience, procedural geometry, and real-time mapping simulations.

## 🚀 Key Features

- **Immersive Rover Assembly**: A scroll-driven 3D experience using Three.js and GSAP that demonstrates the modular engineering of the ROAM rover.
- **Live Demo Page**: Interactive 3D point cloud simulation showcasing the "Digital Twin" generation capabilities.
- **Technical Stack Display**: Industrial bento-grid layout highlighting the core hardware and software stack (NVIDIA Jetson, LiDAR, ROS2, etc.).
- **Mobile-First Industrial Design**: A dark-mode, high-contrast aesthetic built for performance and accessibility.
- **Procedural 3D Architecture**: Zero external model files — all 3D assets are built entirely in code for maximum performance and flexibility.

## 🛠️ Technology Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **3D Engine**: [Three.js](https://threejs.org/) with [React Three Fiber](https://r3f.docs.pmnd.rs/) & [@react-three/drei](https://github.com/pmndrs/drei)
- **Animations**: [GSAP](https://gsap.com/) (ScrollTrigger) & [Framer Motion](https://www.framer.com/motion/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State & Logic**: Custom React Hooks for 3D state and scroll orchestration.

## 📦 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-org/roam-website.git
   ```

2. Navigate to the frontend directory:
   ```bash
   cd roam-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```text
roam-frontend/
├── app/                  # Next.js App Router (Pages & Layouts)
├── components/           
│   ├── rover/            # Rover 3D model & assembly logic
│   ├── pointcloud/       # Point cloud simulation
│   ├── sections/         # Page sections (Hero, About, Tech)
│   └── ui/               # Reusable UI components
├── lib/                  # Shared utilities (GSAP, colors, fonts)
└── public/               # Static assets
```

## 🔧 Maintenance & Development

For detailed information on the architectural decisions, design system, and how to extend the 3D components, please refer to the [INTERNAL_DEVELOPMENT.md](./INTERNAL_DEVELOPMENT.md) guide.

## 📄 License

This project is proprietary to the ROAM Robotics Club. All rights reserved.
