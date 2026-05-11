"use client";

import React from "react";
import { OrbitControls, ContactShadows, Environment } from "@react-three/drei";
import * as THREE from "three";
import { PARTS } from "./constants";
import { ConnectionLines } from "./ConnectionLines";
import { RigMesh } from "./RigMesh";

interface Props {
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const Scene: React.FC<Props> = ({ activeId, setActiveId }) => (
  <>
    {/* Atmosphere & Lighting */}
    <color attach="background" args={["#0A0A0B"]} />
    <fog attach="fog" args={["#0A0A0B", 8, 15]} />

    <ambientLight intensity={0.4} />
    <spotLight
      position={[10, 15, 10]}
      angle={0.3}
      penumbra={1}
      intensity={2}
      castShadow
      color="#F5ECD7"
    />
    <pointLight position={[-10, -10, -10]} color="#E8512A" intensity={1.5} />

    {/* Environment for reflections */}
    <Environment preset="city" />

    {/* Floor Shadow */}
    <ContactShadows
      position={[0, -0.5, 0]}
      opacity={0.4}
      scale={20}
      blur={2}
      far={4.5}
    />

    {/* Technical Grid */}
    <gridHelper
      args={[20, 40, "#E8512A30", "#222226"]}
      position={[0, -0.5, 0]}
    />

    {/* Bounding Volume (Visual Guide) */}
    <lineSegments position={[0, 1.8, 0]}>
      <edgesGeometry args={[new THREE.BoxGeometry(5.2, 5.2, 5.2)]} />
      <lineBasicMaterial color="#E8512A" transparent opacity={0.05} />
    </lineSegments>

    <ConnectionLines activeId={activeId} />

    {PARTS.map((part) => (
      <RigMesh
        key={part.id}
        part={part}
        activeId={activeId}
        setActiveId={setActiveId}
      />
    ))}

    <OrbitControls
      enablePan={false}
      target={[0, 1.8, 0]}
      minDistance={6}
      maxDistance={11}
      autoRotate={!activeId}
      autoRotateSpeed={0.4}
      maxPolarAngle={Math.PI * 0.48}
    />
  </>
);
