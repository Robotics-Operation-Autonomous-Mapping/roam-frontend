import React, { forwardRef, useImperativeHandle, useRef, useMemo } from "react";
import * as THREE from "three";
import { EMPTY_ROVER_PARTS, RoverModel, RoverModelHandle, RoverPartsMap } from "./RoverModel";

export interface RoverSceneHandle {
  getParts: () => RoverPartsMap;
  getParticles: () => THREE.Points | null;
}

export const RoverScene = forwardRef<RoverSceneHandle>((_props, ref) => {
  const modelRef = useRef<RoverModelHandle | null>(null);
  const pointsRef = useRef<THREE.Points>(null);

  useImperativeHandle(ref, () => ({
    getParts: () => modelRef.current?.getParts() ?? { ...EMPTY_ROVER_PARTS },
    getParticles: () => pointsRef.current,
  }));

  // Particle burst setup (hidden initially)
  const particlesCount = 80;
  const particlesPositions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      // Start them at center
      pos[i * 3] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 0.1;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.1;
    }
    return pos;
  }, []);

  return (
    <group>
      {/* Lights */}
      <ambientLight color="#1A1A2E" intensity={0.9} />
      <hemisphereLight args={["#F5ECD7", "#1A1A2E", 0.55]} />
      <pointLight position={[3, 5, 3]} color="#E8512A" intensity={3.2} />
      <spotLight position={[-4, 8, 4]} angle={0.3} penumbra={0.8} intensity={3.2} castShadow />
      <directionalLight position={[0, 10, 0]} intensity={0.55} color="#F5ECD7" />
      <directionalLight position={[5, 4, 2]} intensity={0.45} color="#D9E7FF" />

      {/* Grid Floor */}
      <gridHelper args={[40, 40, "#E8512A", "#E8512A"]} position={[0, -0.6, 0]} material-opacity={0.15} material-transparent />

      {/* Rover Model */}
      <RoverModel ref={modelRef} />

      {/* Particle Burst (Points) */}
      <points ref={pointsRef} visible={false}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particlesCount}
            array={particlesPositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#E8512A" transparent opacity={0} sizeAttenuation />
      </points>
    </group>
  );
});

RoverScene.displayName = "RoverScene";
