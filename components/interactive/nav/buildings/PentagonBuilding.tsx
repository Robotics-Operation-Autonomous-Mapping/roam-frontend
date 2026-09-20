"use client";

import React from "react";
import * as THREE from "three";
import { type Obstacle } from "../types";
import { concreteMat } from "./materials";

export const PentagonBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  // Generate a pentagon shape with a hole
  const rOuter = (Math.min(obs.w, obs.d) / 2) * 1.05;
  const rInner = rOuter * 0.45;

  const shape = new THREE.Shape();
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = Math.cos(angle) * rOuter;
    const py = Math.sin(angle) * rOuter;
    if (i === 0) shape.moveTo(px, py);
    else shape.lineTo(px, py);
  }
  shape.closePath();

  const hole = new THREE.Path();
  for (let i = 0; i < 5; i++) {
    const angle = (i / 5) * Math.PI * 2;
    const px = Math.cos(angle) * rInner;
    const py = Math.sin(angle) * rInner;
    if (i === 0) hole.moveTo(px, py);
    else hole.lineTo(px, py);
  }
  hole.closePath();
  shape.holes.push(hole);
  const pentagonGeo = new THREE.ExtrudeGeometry(shape, {
    depth: obs.h,
    bevelEnabled: false,
  });

  return (
    <group position={[obs.x, 0, obs.z]}>
      {/* Extruded Pentagon with Hole */}
      <mesh
        rotation={[-Math.PI / 2, 0, Math.PI / 10]}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        geometry={pentagonGeo}
      >
        {concreteMat("#7a7868")}
      </mesh>

      {/* Courtyard ground (grass) */}
      <mesh
        position={[0, 0.05, 0]}
        rotation={[-Math.PI / 2, 0, Math.PI / 10]}
      >
        <cylinderGeometry
          args={[
            (Math.min(obs.w, obs.d) / 2) * 0.45,
            (Math.min(obs.w, obs.d) / 2) * 0.45,
            0.01,
            5,
          ]}
        />
        <meshStandardMaterial color="#3d4a30" roughness={0.95} />
      </mesh>
    </group>
  );
};
