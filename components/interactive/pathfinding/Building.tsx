"use client";

import React from "react";
import { Obstacle } from "./types";

export const Building = ({ obs }: { obs: Obstacle }) => {
  const genericMat = (
    <meshStandardMaterial color="#2D3340" metalness={0.4} roughness={0.6} />
  );

  if (obs.type === "empire") {
    const empireMat = (
      <meshStandardMaterial color="#A49C8C" metalness={0.2} roughness={0.8} />
    );
    const spireMat = (
      <meshStandardMaterial color="#D1D5DB" metalness={0.8} roughness={0.2} />
    );
    return (
      <group position={[obs.x, 0, obs.z]}>
        <mesh position={[0, obs.h * 0.2, 0]}>
          <boxGeometry args={[obs.w, obs.h * 0.4, obs.d]} />
          {empireMat}
        </mesh>
        <mesh position={[0, obs.h * 0.6, 0]}>
          <boxGeometry args={[obs.w * 0.7, obs.h * 0.4, obs.d * 0.7]} />
          {empireMat}
        </mesh>
        <mesh position={[0, obs.h * 0.9, 0]}>
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.2, obs.d * 0.3]} />
          {empireMat}
        </mesh>
        <mesh position={[0, obs.h * 1.1, 0]}>
          <cylinderGeometry args={[0.02, 0.05, obs.h * 0.3]} />
          {spireMat}
        </mesh>
      </group>
    );
  }

  if (obs.type === "pentagon") {
    const pentagonMat = (
      <meshStandardMaterial color="#8E9399" metalness={0.1} roughness={0.9} />
    );
    return (
      <group position={[obs.x, obs.h / 2, obs.z]}>
        <mesh rotation={[0, Math.PI / 10, 0]}>
          <cylinderGeometry
            args={[
              (Math.min(obs.w, obs.d) / 2) * 1.05,
              (Math.min(obs.w, obs.d) / 2) * 1.05,
              obs.h,
              5,
            ]}
          />
          {pentagonMat}
        </mesh>
        <mesh
          position={[0, obs.h / 2 + 0.01, 0]}
          rotation={[0, Math.PI / 10, 0]}
        >
          <cylinderGeometry
            args={[
              Math.min(obs.w, obs.d) / 4,
              Math.min(obs.w, obs.d) / 4,
              0.01,
              5,
            ]}
          />
          <meshStandardMaterial color="#4A5568" />
        </mesh>
      </group>
    );
  }

  if (obs.type === "louvre") {
    const louvreMat = (
      <meshStandardMaterial color="#C1B098" metalness={0.2} roughness={0.8} />
    );
    const louvreGlassMat = (
      <meshPhysicalMaterial
        color="#8BA1B8"
        transmission={0.9}
        transparent
        opacity={1}
        roughness={0.1}
        metalness={0.6}
        clearcoat={1}
      />
    );
    return (
      <group position={[obs.x, 0, obs.z]}>
        <mesh position={[0, obs.h * 0.3, -obs.d * 0.25]}>
          <boxGeometry args={[obs.w, obs.h * 0.6, obs.d * 0.5]} />
          {louvreMat}
        </mesh>
        <mesh position={[-obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}>
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
          {louvreMat}
        </mesh>
        <mesh position={[obs.w * 0.35, obs.h * 0.3, obs.d * 0.25]}>
          <boxGeometry args={[obs.w * 0.3, obs.h * 0.6, obs.d * 0.5]} />
          {louvreMat}
        </mesh>
        <mesh
          position={[0, obs.h * 0.4, obs.d * 0.1]}
          rotation={[0, Math.PI / 4, 0]}
        >
          <coneGeometry args={[0.7, 0.8, 4]} />
          {louvreGlassMat}
        </mesh>
      </group>
    );
  }

  if (obs.type === "willis") {
    const willisMat = (
      <meshStandardMaterial color="#181A1F" metalness={0.7} roughness={0.3} />
    );
    const glowMat = <meshBasicMaterial color="#FBBF24" />;
    const tubeW = obs.w / 3;
    const tubeD = obs.d / 3;
    return (
      <group position={[obs.x, 0, obs.z]}>
        {[-1, 0, 1].map((dx) =>
          [-1, 0, 1].map((dz) => {
            let hMult = 0.5;
            if (dx === 0 && dz === 0) hMult = 1.0;
            else if (
              (dx === 0 && dz === -1) ||
              (dx === 0 && dz === 1) ||
              (dx === -1 && dz === 0)
            )
              hMult = 0.8;
            else hMult = 0.6;
            return (
              <group key={`${dx}-${dz}`} position={[dx * tubeW, 0, dz * tubeD]}>
                <mesh position={[0, (obs.h * hMult) / 2, 0]}>
                  <boxGeometry
                    args={[tubeW * 0.95, obs.h * hMult, tubeD * 0.95]}
                  />
                  {willisMat}
                </mesh>
                <mesh position={[0, obs.h * hMult - 0.05, 0]}>
                  <boxGeometry args={[tubeW * 0.98, 0.02, tubeD * 0.98]} />
                  {glowMat}
                </mesh>
              </group>
            );
          }),
        )}
      </group>
    );
  }

  if (obs.type === "taipei") {
    const taipeiMat = (
      <meshStandardMaterial color="#355E5D" metalness={0.5} roughness={0.4} />
    );
    const taipeiAccent = (
      <meshStandardMaterial color="#A3B8B5" metalness={0.7} roughness={0.3} />
    );
    return (
      <group position={[obs.x, 0, obs.z]}>
        <mesh position={[0, obs.h * 0.1, 0]}>
          <boxGeometry args={[obs.w * 0.8, obs.h * 0.2, obs.d * 0.8]} />
          {taipeiMat}
        </mesh>
        {[1, 2, 3, 4].map((i) => (
          <group key={i} position={[0, obs.h * 0.1 + i * (obs.h * 0.18), 0]}>
            <mesh rotation={[0, Math.PI / 4, 0]}>
              <cylinderGeometry
                args={[
                  Math.min(obs.w, obs.d) * 0.5,
                  Math.min(obs.w, obs.d) * 0.4,
                  obs.h * 0.16,
                  4,
                ]}
              />
              {taipeiMat}
            </mesh>
            <mesh position={[0, -obs.h * 0.08, 0]}>
              <boxGeometry
                args={[
                  Math.min(obs.w, obs.d) * 0.72,
                  0.02,
                  Math.min(obs.w, obs.d) * 0.72,
                ]}
              />
              <meshBasicMaterial color="#E0F2FE" />
            </mesh>
          </group>
        ))}
        <mesh position={[0, obs.h * 0.95, 0]}>
          <cylinderGeometry args={[0.04, 0.04, obs.h * 0.2]} />
          {taipeiAccent}
        </mesh>
      </group>
    );
  }

  return (
    <mesh position={[obs.x, obs.h / 2, obs.z]}>
      <boxGeometry args={[obs.w, obs.h, obs.d]} />
      {genericMat}
    </mesh>
  );
};
