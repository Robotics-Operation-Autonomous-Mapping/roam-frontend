"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface Props {
  ringRadius: number;
  color: string;
}

export const PartRings: React.FC<Props> = ({ ringRadius, color }) => {
  const outerRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (outerRef.current) {
      const pulse = 0.25 + Math.abs(Math.sin(clock.elapsedTime * 2.2)) * 0.55;
      (outerRef.current.material as THREE.MeshBasicMaterial).opacity = pulse;
      const scale = 1 + Math.abs(Math.sin(clock.elapsedTime * 1.6)) * 0.08;
      outerRef.current.scale.setScalar(scale);
    }
  });

  const outer = ringRadius + 0.04;

  return (
    <group rotation={[Math.PI / 2, 0, 0]}>
      {/* Static inner ring */}
      <mesh>
        <ringGeometry args={[ringRadius - 0.01, ringRadius + 0.03, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.55}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* Pulsing outer ring */}
      <mesh ref={outerRef}>
        <ringGeometry args={[outer + 0.04, outer + 0.09, 64]} />
        <meshBasicMaterial
          color={color}
          transparent
          opacity={0.3}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};
