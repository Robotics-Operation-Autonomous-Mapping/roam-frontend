"use client";

import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

type RigPart = {
  id: string;
  label: string;
  spec: string;
  details: string;
  position: [number, number, number];
};

const PARTS: RigPart[] = [
  { id: "core", label: "Compute Core", spec: "Dual Jetson + control stack", details: "Main compute housing featuring heavy-duty ribbed heat sinks and ruggedized M12 I/O ports.", position: [0, 0, 0] },
  { id: "lidar_top", label: "LiDAR", spec: "360 deg rotational scan head", details: "High-frequency spinning optical array with 32-channel laser emitters and internal mirror mechanics.", position: [0, 1.2, 0] },
  { id: "rgb_left", label: "RGB Camera L", spec: "Wide stereo channel", details: "Left eye of the stereo vision system with multi-element glass optics and an integrated sun hood.", position: [-1.4, 0.3, 0.6] },
  { id: "rgb_right", label: "RGB Camera R", spec: "Wide stereo channel", details: "Right eye of the stereo vision system with multi-element glass optics and an integrated sun hood.", position: [1.4, 0.3, 0.6] },
  { id: "ir", label: "IR Sensor", spec: "Thermal imaging block", details: "Thermal package with a specialized germanium lens, designed to see through dust and darkness.", position: [0, -0.2, 1.4] },
  { id: "gps", label: "GNSS Module", spec: "Localization receiver", details: "Low-profile RTK-capable GPS puck on a vibration-damped stem for absolute global positioning.", position: [0, 1.0, -1.2] },
  { id: "imu", label: "Precision IMU", spec: "9-DOF Inertial Unit", details: "High-frequency gyroscope, accelerometer, and magnetometer package for dead reckoning and stabilization.", position: [0, -0.65, 0.5] },
  { id: "esc", label: "Motor Controllers", spec: "4x 50A ESC Array", details: "High-power motor drivers featuring oversized electrolytic capacitors and thick aluminum heat dissipation blocks.", position: [-1.1, -0.8, -0.5] },
  { id: "pdb", label: "Power Distribution", spec: "High-Current PDB", details: "Routes battery power safely to logic and drive systems with integrated buck converters and heavy-duty fuses.", position: [1.1, -0.8, -0.5] },
  { id: "telemetry", label: "Telemetry Radio", spec: "900MHz Long-Range", details: "Maintains a high-bandwidth connection for manual override, RTK corrections, and remote diagnostics.", position: [1.2, 0.5, -1.0] },
];

const RigMesh: React.FC<{
  part: RigPart;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}> = ({ part, activeId, setActiveId }) => {
  const isActive = activeId === part.id;

  const bodyColor = part.id === "lidar_top" ? "#E8512A" : (isActive ? "#5B667A" : "#3F4756");
  const emissiveColor = part.id === "lidar_top" ? "#E8512A" : (isActive ? "#5B667A" : "#000000");
  const emissiveIntensity = isActive ? 0.35 : 0.0;

  const materials = useMemo(() => ({
    bodyMat: new THREE.MeshStandardMaterial({
      color: bodyColor,
      metalness: 0.7,
      roughness: 0.3,
      emissive: emissiveColor,
      emissiveIntensity: emissiveIntensity,
    }),
    accentMat: new THREE.MeshStandardMaterial({
      color: isActive ? "#374151" : "#22262E",
      metalness: 0.8,
      roughness: 0.5,
      emissive: isActive ? "#1F2937" : "#000000",
      emissiveIntensity: isActive ? 0.3 : 0.0,
    }),
    heatsinkMat: new THREE.MeshStandardMaterial({
      color: isActive ? "#94A3B8" : "#687282",
      metalness: 0.8,
      roughness: 0.4,
      emissive: isActive ? "#475569" : "#000000",
      emissiveIntensity: isActive ? 0.3 : 0.0,
    }),
    lensMat: new THREE.MeshPhysicalMaterial({
      color: "#1E293B",
      transmission: 0.9,
      transparent: true,
      opacity: 1,
      roughness: 0.05,
      metalness: 0.2,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
    }),
    irLensMat: new THREE.MeshPhysicalMaterial({
      color: "#D97706",
      transmission: 0.6,
      transparent: true,
      roughness: 0.1,
      metalness: 0.5,
      clearcoat: 0.8,
      emissive: "#D97706",
      emissiveIntensity: isActive ? 0.5 : 0.1,
    }),
    imuMat: new THREE.MeshStandardMaterial({
      color: "#F97316",
      metalness: 0.3,
      roughness: 0.6,
      emissive: "#F97316",
      emissiveIntensity: isActive ? 0.4 : 0.0,
    }),
    pcbMat: new THREE.MeshStandardMaterial({
      color: isActive ? "#047857" : "#064E3B",
      metalness: 0.4,
      roughness: 0.8,
      emissive: isActive ? "#065F46" : "#000000",
      emissiveIntensity: isActive ? 0.4 : 0.0,
    }),
    capMat: new THREE.MeshStandardMaterial({
      color: isActive ? "#60A5FA" : "#3B82F6",
      metalness: 0.9,
      roughness: 0.2,
      emissive: isActive ? "#1D4ED8" : "#000000",
      emissiveIntensity: isActive ? 0.3 : 0.0,
    }),
    goldMat: new THREE.MeshStandardMaterial({
      color: "#EAB308",
      metalness: 1.0,
      roughness: 0.2,
    })
  }), [bodyColor, emissiveColor, emissiveIntensity, isActive]);

  React.useEffect(() => {
    return () => {
      Object.values(materials).forEach((m) => m.dispose());
    };
  }, [materials]);

  const { bodyMat, accentMat, heatsinkMat, lensMat, irLensMat, imuMat, pcbMat, capMat, goldMat } = materials;

  return (
    <group
      position={part.position}
      onClick={(e) => {
        e.stopPropagation();
        setActiveId(part.id);
      }}
    >
      {part.id === "core" && (
        <group>
          {/* Base plate */}
          <mesh position={[0, -0.25, 0]} material={accentMat}><boxGeometry args={[1.4, 0.1, 1.0]} /></mesh>
          {/* Main housing */}
          <mesh material={bodyMat}><boxGeometry args={[1.2, 0.4, 0.9]} /></mesh>
          {/* Heatsink fins */}
          {Array.from({ length: 9 }).map((_, i) => (
            <mesh key={i} position={[-0.4 + i * 0.1, 0.28, 0]} material={heatsinkMat}>
              <boxGeometry args={[0.04, 0.16, 0.8]} />
            </mesh>
          ))}
          {/* IO Ports Front */}
          <mesh position={[-0.3, 0, 0.46]} material={accentMat}><boxGeometry args={[0.2, 0.1, 0.05]} /></mesh>
          <mesh position={[0.2, 0, 0.46]} material={accentMat} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.05, 16]} /></mesh>
          <mesh position={[0.4, 0, 0.46]} material={accentMat} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.06, 0.06, 0.05, 16]} /></mesh>
        </group>
      )}

      {part.id === "lidar_top" && (
        <group>
          {/* Base mount */}
          <mesh position={[0, -0.15, 0]} material={accentMat}><cylinderGeometry args={[0.22, 0.25, 0.1, 32]} /></mesh>
          {/* Spinning head */}
          <mesh material={bodyMat}><cylinderGeometry args={[0.22, 0.22, 0.2, 32]} /></mesh>
          {/* Optical window */}
          <mesh material={lensMat}><cylinderGeometry args={[0.225, 0.225, 0.12, 32]} /></mesh>
          {/* Top cap */}
          <mesh position={[0, 0.12, 0]} material={accentMat}><cylinderGeometry args={[0.22, 0.22, 0.04, 32]} /></mesh>
        </group>
      )}

      {(part.id === "rgb_left" || part.id === "rgb_right") && (
        <group>
          {/* Main body */}
          <mesh material={bodyMat}><boxGeometry args={[0.4, 0.4, 0.5]} /></mesh>
          {/* Backplate */}
          <mesh position={[0, 0, -0.26]} material={accentMat}><boxGeometry args={[0.45, 0.45, 0.05]} /></mesh>
          {/* Lens barrel */}
          <mesh position={[0, 0, 0.3]} material={accentMat} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.15, 0.15, 0.2, 24]} /></mesh>
          {/* Lens glass */}
          <mesh position={[0, 0, 0.4]} material={lensMat} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.12, 0.12, 0.02, 24]} /></mesh>
          {/* Sun hood */}
          <mesh position={[0, 0.18, 0.4]} material={bodyMat}><boxGeometry args={[0.3, 0.04, 0.3]} /></mesh>
        </group>
      )}

      {part.id === "ir" && (
        <group>
          <mesh material={bodyMat}><boxGeometry args={[0.35, 0.35, 0.4]} /></mesh>
          {/* Ribbed sides */}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`l-${i}`} position={[-0.18, 0, -0.1 + i * 0.08]} material={heatsinkMat}><boxGeometry args={[0.04, 0.25, 0.02]} /></mesh>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <mesh key={`r-${i}`} position={[0.18, 0, -0.1 + i * 0.08]} material={heatsinkMat}><boxGeometry args={[0.04, 0.25, 0.02]} /></mesh>
          ))}
          {/* Lens base */}
          <mesh position={[0, 0, 0.22]} material={accentMat}><boxGeometry args={[0.25, 0.25, 0.1]} /></mesh>
          {/* IR Lens */}
          <mesh position={[0, 0, 0.28]} material={irLensMat}><boxGeometry args={[0.18, 0.18, 0.02]} /></mesh>
        </group>
      )}

      {part.id === "gps" && (
        <group>
          {/* Antenna dome */}
          <mesh position={[0, 0.05, 0]} material={bodyMat}><cylinderGeometry args={[0.15, 0.2, 0.1, 32]} /></mesh>
          {/* Base plate */}
          <mesh position={[0, -0.02, 0]} material={accentMat}><cylinderGeometry args={[0.22, 0.22, 0.04, 32]} /></mesh>
          {/* Stem */}
          <mesh position={[0, -0.15, 0]} material={accentMat}><cylinderGeometry args={[0.04, 0.04, 0.2, 16]} /></mesh>
        </group>
      )}

      {part.id === "imu" && (
        <group>
          <mesh material={imuMat}><boxGeometry args={[0.4, 0.2, 0.3]} /></mesh>
          <mesh position={[0, -0.08, 0]} material={accentMat}><boxGeometry args={[0.5, 0.04, 0.3]} /></mesh>
          {/* Screws */}
          <mesh position={[-0.2, -0.06, 0.1]} material={heatsinkMat}><cylinderGeometry args={[0.02, 0.02, 0.04, 12]} /></mesh>
          <mesh position={[-0.2, -0.06, -0.1]} material={heatsinkMat}><cylinderGeometry args={[0.02, 0.02, 0.04, 12]} /></mesh>
          <mesh position={[0.2, -0.06, 0.1]} material={heatsinkMat}><cylinderGeometry args={[0.02, 0.02, 0.04, 12]} /></mesh>
          <mesh position={[0.2, -0.06, -0.1]} material={heatsinkMat}><cylinderGeometry args={[0.02, 0.02, 0.04, 12]} /></mesh>
          {/* Direction indicator arrow */}
          <mesh position={[0, 0.11, 0]} material={accentMat}><boxGeometry args={[0.02, 0.01, 0.1]} /></mesh>
          <mesh position={[0, 0.11, 0.05]} material={accentMat} rotation={[0, Math.PI/4, 0]}><boxGeometry args={[0.04, 0.01, 0.04]} /></mesh>
        </group>
      )}

      {part.id === "esc" && (
        <group>
          {/* PCB Base */}
          <mesh position={[0, -0.05, 0]} material={pcbMat}><boxGeometry args={[0.6, 0.04, 0.4]} /></mesh>
          {/* Heatsink */}
          <mesh position={[-0.1, 0.05, 0]} material={heatsinkMat}><boxGeometry args={[0.3, 0.15, 0.3]} /></mesh>
          {/* Capacitors */}
          {[-0.1, 0.1].map((z, i) => (
            <mesh key={i} position={[0.2, 0.1, z]} material={capMat} rotation={[Math.PI/2, 0, 0]}><cylinderGeometry args={[0.08, 0.08, 0.2, 16]} /></mesh>
          ))}
          {/* Gold terminals */}
          {[-0.15, 0, 0.15].map((z, i) => (
            <mesh key={`t-${i}`} position={[-0.3, 0, z]} material={goldMat}><boxGeometry args={[0.04, 0.06, 0.06]} /></mesh>
          ))}
          {/* Status LED */}
          <mesh position={[0.24, -0.03, -0.16]}>
            <boxGeometry args={[0.04, 0.01, 0.04]} />
            <meshBasicMaterial color={isActive ? "#10B981" : "#1F2937"} />
          </mesh>
        </group>
      )}

      {part.id === "pdb" && (
        <group>
          {/* PCB Base */}
          <mesh material={pcbMat}><boxGeometry args={[0.7, 0.04, 0.5]} /></mesh>
          {/* Main processor/chip */}
          <mesh position={[0, 0.04, 0]} material={accentMat}><boxGeometry args={[0.2, 0.04, 0.2]} /></mesh>
          {/* Big Terminals */}
          <mesh position={[-0.25, 0.06, 0.15]} material={goldMat}><cylinderGeometry args={[0.04, 0.04, 0.08]} /></mesh>
          <mesh position={[-0.25, 0.06, -0.15]} material={goldMat}><cylinderGeometry args={[0.04, 0.04, 0.08]} /></mesh>
          {/* Fuses */}
          {[-0.1, 0, 0.1].map((z, i) => (
            <mesh key={i} position={[0.25, 0.04, z]} material={irLensMat}><boxGeometry args={[0.08, 0.06, 0.04]} /></mesh>
          ))}
          {/* Small ICs */}
          <mesh position={[0.1, 0.03, -0.15]} material={accentMat}><boxGeometry args={[0.08, 0.02, 0.08]} /></mesh>
          <mesh position={[-0.1, 0.03, 0.15]} material={accentMat}><boxGeometry args={[0.06, 0.02, 0.1]} /></mesh>
        </group>
      )}

      {part.id === "telemetry" && (
        <group>
          {/* Housing */}
          <mesh material={bodyMat}><boxGeometry args={[0.3, 0.1, 0.4]} /></mesh>
          {/* Connectors */}
          <mesh position={[0.16, 0, 0.1]} material={goldMat} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /></mesh>
          <mesh position={[0.16, 0, -0.1]} material={goldMat} rotation={[0, 0, Math.PI/2]}><cylinderGeometry args={[0.03, 0.03, 0.04]} /></mesh>
          {/* Antennas */}
          <group position={[0.18, 0, 0.1]} rotation={[0, 0, -Math.PI/6]}>
            <mesh position={[0, 0.3, 0]} material={accentMat}><cylinderGeometry args={[0.015, 0.015, 0.6]} /></mesh>
          </group>
          <group position={[0.18, 0, -0.1]} rotation={[0, 0, -Math.PI/4]}>
            <mesh position={[0, 0.3, 0]} material={accentMat}><cylinderGeometry args={[0.015, 0.015, 0.6]} /></mesh>
          </group>
        </group>
      )}
    </group>
  );
};

const Scene: React.FC<{
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}> = ({ activeId, setActiveId }) => {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 6, 4]} intensity={0.85} color="#F5ECD7" />
      <pointLight position={[0, 2.5, 0]} intensity={1.2} color="#E8512A" />
      <gridHelper args={[14, 14, "#E8512A", "#333333"]} position={[0, -1.6, 0]} />

      {PARTS.map((part) => (
        <RigMesh key={part.id} part={part} activeId={activeId} setActiveId={setActiveId} />
      ))}

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(4.0, 3.6, 4.0)]} />
        <lineBasicMaterial color="#444A57" transparent opacity={0.25} />
      </lineSegments>

      <OrbitControls enablePan={false} minDistance={4} maxDistance={10} autoRotate autoRotateSpeed={0.4} />
    </>
  );
};

export const ExplodedSensorRig: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePart = PARTS.find((p) => p.id === activeId) ?? null;
  const activeLabel = activePart?.label ?? "Select a module";
  const activeSpec = activePart?.spec ?? "Component metadata preview";
  const activeDetails = activePart?.details ?? "Tap or click a component to inspect subsystem details.";

  return (
    <div className="w-full mt-12 border border-border bg-surface/50">
      <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-border">
        <span className="font-mono text-xs tracking-widest text-primary uppercase">[ Exploded Sensor Rig ]</span>
        <span className="font-mono text-xs tracking-widest text-cream/80 uppercase">{activeLabel}</span>
      </div>
      <div className="px-6 py-3 border-b border-border bg-bg/35">
        <p className="font-mono text-[11px] tracking-widest text-primary uppercase mb-2">{activeSpec}</p>
        <p className="font-sans text-sm text-cream/80 leading-relaxed">{activeDetails}</p>
      </div>
      <div className="h-[340px]">
        <Canvas 
          camera={{ position: [5.2, 3.8, 5.2], fov: 50 }} 
          dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}
          onPointerMissed={() => setActiveId(null)}
        >
          <Scene activeId={activeId} setActiveId={setActiveId} />
        </Canvas>
      </div>
    </div>
  );
};


