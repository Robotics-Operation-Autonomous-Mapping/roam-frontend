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
  {
    id: "core",
    label: "Compute Core",
    spec: "Dual Jetson + control stack",
    details: "Main compute housing with heat fins, side rails, and service panel.",
    position: [0, 0, 0],
  },
  {
    id: "lidar_top",
    label: "LiDAR",
    spec: "360 deg rotational scan head",
    details: "Upper spinning scan module with ring optics and central motor can.",
    position: [0, 1.1, 0],
  },
  {
    id: "rgb_left",
    label: "RGB Camera L",
    spec: "Wide stereo channel",
    details: "Left stereo enclosure with glass lens and mount bracket.",
    position: [-1.5, 0.25, 0.7],
  },
  {
    id: "rgb_right",
    label: "RGB Camera R",
    spec: "Wide stereo channel",
    details: "Right stereo enclosure with glass lens and mount bracket.",
    position: [1.5, 0.25, 0.7],
  },
  {
    id: "ir",
    label: "IR Sensor",
    spec: "Thermal imaging block",
    details: "Thermal package with protective shroud and front emitter glass.",
    position: [0, -0.2, 1.5],
  },
  {
    id: "gps",
    label: "GNSS Module",
    spec: "Localization receiver",
    details: "Low-profile GNSS puck with anti-vibration base and antenna cap.",
    position: [0, 0.9, -1.4],
  },
];

const RigMesh: React.FC<{
  part: RigPart;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}> = ({ part, activeId, setActiveId }) => {
  const bodyMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: part.id === "lidar_top" ? "#E8512A" : "#4E586C",
        metalness: 0.65,
        roughness: 0.35,
        emissive: part.id === "lidar_top" ? "#E8512A" : "#4E586C",
        emissiveIntensity: activeId === part.id ? 0.45 : 0.08,
      }),
    [activeId, part.id]
  );

  const accentMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#2A2F3A",
        metalness: 0.4,
        roughness: 0.6,
      }),
    []
  );

  const lensMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#7DB5FF",
        transmission: 0.85,
        transparent: true,
        opacity: 0.9,
        roughness: 0.08,
        metalness: 0.05,
      }),
    []
  );

  React.useEffect(
    () => () => {
      bodyMaterial.dispose();
      accentMaterial.dispose();
      lensMaterial.dispose();
    },
    [bodyMaterial, accentMaterial, lensMaterial]
  );

  return (
    <group
      position={part.position}
      onPointerEnter={() => setActiveId(part.id)}
      onPointerLeave={() => setActiveId(null)}
    >
      {part.id === "core" && (
        <>
          <mesh material={bodyMaterial}>
            <boxGeometry args={[1.2, 0.6, 0.9]} />
          </mesh>
          <mesh position={[0, 0.2, 0]} material={accentMaterial}>
            <boxGeometry args={[1.3, 0.08, 0.95]} />
          </mesh>
          <mesh position={[0, -0.2, 0]} material={accentMaterial}>
            <boxGeometry args={[1.3, 0.08, 0.95]} />
          </mesh>
          <mesh position={[0.64, 0, 0]} material={accentMaterial}>
            <boxGeometry args={[0.06, 0.45, 0.8]} />
          </mesh>
          <mesh position={[-0.64, 0, 0]} material={accentMaterial}>
            <boxGeometry args={[0.06, 0.45, 0.8]} />
          </mesh>
        </>
      )}

      {part.id === "lidar_top" && (
        <>
          <mesh material={bodyMaterial}>
            <cylinderGeometry args={[0.24, 0.24, 0.16, 30]} />
          </mesh>
          <mesh position={[0, 0.06, 0]} material={lensMaterial}>
            <torusGeometry args={[0.2, 0.03, 16, 32]} />
          </mesh>
          <mesh position={[0, -0.12, 0]} material={accentMaterial}>
            <cylinderGeometry args={[0.1, 0.1, 0.1, 18]} />
          </mesh>
        </>
      )}

      {(part.id === "rgb_left" || part.id === "rgb_right") && (
        <>
          <mesh material={bodyMaterial}>
            <boxGeometry args={[0.48, 0.22, 0.24]} />
          </mesh>
          <mesh position={[0, 0, 0.13]} material={lensMaterial}>
            <cylinderGeometry args={[0.08, 0.08, 0.04, 20]} />
          </mesh>
          <mesh position={[0, -0.12, -0.08]} material={accentMaterial}>
            <boxGeometry args={[0.3, 0.05, 0.2]} />
          </mesh>
        </>
      )}

      {part.id === "ir" && (
        <>
          <mesh material={bodyMaterial}>
            <boxGeometry args={[0.34, 0.2, 0.22]} />
          </mesh>
          <mesh position={[0, 0.02, 0.13]} material={lensMaterial}>
            <boxGeometry args={[0.18, 0.08, 0.02]} />
          </mesh>
          <mesh position={[0, -0.13, 0]} material={accentMaterial}>
            <boxGeometry args={[0.38, 0.05, 0.24]} />
          </mesh>
        </>
      )}

      {part.id === "gps" && (
        <>
          <mesh material={bodyMaterial}>
            <cylinderGeometry args={[0.24, 0.24, 0.12, 24]} />
          </mesh>
          <mesh position={[0, 0.08, 0]} material={accentMaterial}>
            <cylinderGeometry args={[0.16, 0.16, 0.04, 20]} />
          </mesh>
          <mesh position={[0, -0.1, 0]} material={accentMaterial}>
            <cylinderGeometry args={[0.2, 0.2, 0.06, 20]} />
          </mesh>
        </>
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
      <gridHelper args={[12, 12, "#E8512A", "#333333"]} position={[0, -1.1, 0]} />

      {PARTS.map((part) => (
        <RigMesh key={part.id} part={part} activeId={activeId} setActiveId={setActiveId} />
      ))}

      <lineSegments>
        <edgesGeometry args={[new THREE.BoxGeometry(3.4, 2.4, 3.4)]} />
        <lineBasicMaterial color="#444A57" />
      </lineSegments>

      <OrbitControls enablePan={false} minDistance={4} maxDistance={9} autoRotate autoRotateSpeed={0.5} />
    </>
  );
};

export const ExplodedSensorRig: React.FC = () => {
  const [activeId, setActiveId] = useState<string | null>(null);
  const activePart = PARTS.find((p) => p.id === activeId) ?? null;
  const activeLabel = activePart?.label ?? "Hover a module";
  const activeSpec = activePart?.spec ?? "Component metadata preview";
  const activeDetails = activePart?.details ?? "Move cursor over a component to inspect subsystem details.";

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
        <Canvas camera={{ position: [4.8, 3.2, 4.8], fov: 52 }} dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1}>
          <Scene activeId={activeId} setActiveId={setActiveId} />
        </Canvas>
      </div>
    </div>
  );
};

