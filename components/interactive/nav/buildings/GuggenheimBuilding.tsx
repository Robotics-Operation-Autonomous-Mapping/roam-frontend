"use client";

import React from "react";
import { type Obstacle } from "../types";
import { concreteMat, pyramidGlass, titaniumMat } from "./materials";

export const GuggenheimBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  return (
    <group position={[obs.x, 0, obs.z]}>
      <mesh
        position={[0, obs.h * 0.22, 0]}
        rotation={[0, 0.4, 0.12]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[obs.w * 0.55, obs.w * 0.62, obs.h * 0.44, 7, 1]}
        />
        {titaniumMat("#8a9daa")}
      </mesh>
      <mesh
        position={[obs.w * 0.18, obs.h * 0.5, obs.d * 0.08]}
        rotation={[0.18, -0.28, 0.08]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[obs.w * 0.38, obs.w * 0.48, obs.h * 0.52, 6, 1]}
        />
        {titaniumMat("#7f94a5")}
      </mesh>
      <mesh
        position={[-obs.w * 0.22, obs.h * 0.58, -obs.d * 0.08]}
        rotation={[-0.08, 0.5, -0.08]}
        castShadow
        receiveShadow
      >
        <cylinderGeometry
          args={[obs.w * 0.28, obs.w * 0.4, obs.h * 0.48, 8, 1]}
        />
        {titaniumMat("#92a5b2")}
      </mesh>
      {/* Glass atrium lid */}
      <mesh position={[0, obs.h * 0.9, 0]} castShadow>
        <boxGeometry args={[obs.w * 0.75, 0.04, obs.d * 0.75]} />
        {pyramidGlass()}
      </mesh>
      {/* Concrete plinth */}
      <mesh position={[0, obs.h * 0.04, 0]} receiveShadow>
        <boxGeometry args={[obs.w * 1.15, obs.h * 0.08, obs.d * 1.15]} />
        {concreteMat("#4a5560")}
      </mesh>
    </group>
  );
};
