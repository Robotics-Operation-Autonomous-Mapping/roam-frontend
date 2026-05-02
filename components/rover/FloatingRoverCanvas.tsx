"use client";

import React from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { RoverModel } from "./RoverModel";
import * as THREE from "three";

/**
 * Shows the fully-assembled rover with:
 * - All parts at assembled positions, full opacity from frame 1 (assembled=true)
 * - Fixed downward-facing orientation (tilted so rover faces the direction of scroll)
 * - No auto-rotate — static, grounded presentation
 */
const FloatingRoverInner: React.FC<{ parked: boolean }> = ({ parked }) => {
  const roverGroupRef = React.useRef<THREE.Group>(null);
  const driveTimeRef = React.useRef(0);

  useFrame((_, delta) => {
    if (!roverGroupRef.current) return;
    driveTimeRef.current += delta;

    if (!parked) {
      const driveWave = Math.sin(driveTimeRef.current * 2.4);
      roverGroupRef.current.rotation.set(Math.PI / 12, -Math.PI / 7, 0);
      roverGroupRef.current.position.x = THREE.MathUtils.lerp(
        roverGroupRef.current.position.x,
        driveWave * 0.6,
        0.06,
      );
      roverGroupRef.current.position.z = THREE.MathUtils.lerp(
        roverGroupRef.current.position.z,
        0.06 + Math.abs(driveWave) * 0.08,
        0.08,
      );
    } else {
      roverGroupRef.current.rotation.set(Math.PI / 10, -Math.PI / 5, 0);
      roverGroupRef.current.position.x = THREE.MathUtils.lerp(
        roverGroupRef.current.position.x,
        0.45,
        0.06,
      );
      roverGroupRef.current.position.z = THREE.MathUtils.lerp(
        roverGroupRef.current.position.z,
        0.14,
        0.06,
      );
    }
  });

  return (
    // Tilt group: X rotation pitches the rover forward so it faces "down into the page"
    // Y rotation gives a 3/4 view showing depth
    <group ref={roverGroupRef} rotation={[Math.PI / 12, -Math.PI / 7, 0]}>
      {/* Lights */}
      <ambientLight color="#1A1A2E" intensity={0.7} />
      <pointLight position={[3, 5, 3]} color="#E8512A" intensity={2.5} />
      <spotLight
        position={[-3, 8, 2]}
        angle={0.4}
        penumbra={0.8}
        intensity={2}
      />
      <directionalLight position={[0, 10, 0]} intensity={0.4} color="#F5ECD7" />

      {/* Fully assembled rover — no scatter, full opacity */}
      <RoverModel assembled />

      {/* Headlights turn on when parked */}
      {parked && (
        <>
          <pointLight
            position={[-0.45, 0.45, 0.95]}
            color="#F5ECD7"
            intensity={1.6}
            distance={4}
          />
          <pointLight
            position={[0.45, 0.45, 0.95]}
            color="#F5ECD7"
            intensity={1.6}
            distance={4}
          />
        </>
      )}
    </group>
  );
};

interface FloatingRoverCanvasProps {
  parked: boolean;
}

const FloatingRoverCanvas: React.FC<FloatingRoverCanvasProps> = ({
  parked,
}) => {
  return (
    <Canvas
      camera={{ position: [5, 3, 5], fov: 42 }}
      dpr={1}
      gl={{ antialias: false, alpha: true }}
      style={{ background: "transparent" }}
      frameloop="always"
    >
      <FloatingRoverInner parked={parked} />
    </Canvas>
  );
};

export default FloatingRoverCanvas;
