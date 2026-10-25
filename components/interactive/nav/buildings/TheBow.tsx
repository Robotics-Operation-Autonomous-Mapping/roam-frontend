"use client";

import React, { useMemo } from "react";
import * as THREE from "three";
import { type Obstacle } from "../types";
import { TEX_BOW } from "./calgaryTextures";

const RADIUS = 2.4; // how tight the curve is
const THICKNESS = 0.5; // distance between the outer and inner glass walls
const SPAN = (110 * Math.PI) / 180; // how far round the curve goes (110°)
const DEPTH = 2.8; // front-to-back size of the tower plus its plaza

// Diamonds across and up the facade (instead of one stretched diamond)
TEX_BOW.repeat.set(7, 4);

/**
 * The Bow: a curved glass tower with a white triangle grid, bowing round a
 * plaza. "Wonderland", the giant wire-mesh head sculpture, stands in the plaza.
 * The concave (inside) side faces +z, then the whole thing is turned 45° so
 * it faces the camera. Its footprint in types.ts is square so the turned
 * building still fits inside it.
 *
 * The walls are slices of a cylinder: CylinderGeometry can draw just part of
 * the way round using thetaStart and thetaLength.
 */
export const TheBow: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  // Centre of the curve, placed so the arc sits at the back of the footprint
  const curveCentreZ = RADIUS - DEPTH / 2 + THICKNESS / 2;
  const outerR = RADIUS + THICKNESS / 2;
  const innerR = RADIUS - THICKNESS / 2;

  // CylinderGeometry measures angles from +z, so the back (-z) is at π
  const thetaStart = Math.PI - SPAN / 2;

  const roof = useMemo(() => {
    // Flat curved strip (seen from above) for the top, pushed up 0.08 thick.
    // Shape angles are measured from +x, a quarter turn from the walls.
    const a1 = Math.PI / 2 - SPAN / 2;
    const a2 = Math.PI / 2 + SPAN / 2;
    const shape = new THREE.Shape();
    shape.absarc(0, 0, outerR, a1, a2, false);
    shape.absarc(0, 0, innerR, a2, a1, true);
    return new THREE.ExtrudeGeometry(shape, { depth: 0.08, bevelEnabled: false });
  }, [outerR, innerR]);

  // The two open ends of the curve, where the walls stop
  const ends = [thetaStart, thetaStart + SPAN].map((theta) => ({
    x: RADIUS * Math.sin(theta),
    z: RADIUS * Math.cos(theta),
    rotY: theta,
  }));

  const glass = <meshStandardMaterial map={TEX_BOW} metalness={0.35} roughness={0.15} side={THREE.DoubleSide} />;

  return (
    <group position={[obs.x, 0, obs.z]} rotation={[0, Math.PI / 4, 0]}>
      <group position={[0, 0, curveCentreZ]}>
        {/* Outer (convex) glass wall */}
        <mesh position={[0, obs.h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[outerR, outerR, obs.h, 48, 1, true, thetaStart, SPAN]} />
          {glass}
        </mesh>
        {/* Inner (concave) glass wall, facing the plaza */}
        <mesh position={[0, obs.h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[innerR, innerR, obs.h, 48, 1, true, thetaStart, SPAN]} />
          {glass}
        </mesh>
        {/* Roof */}
        <mesh geometry={roof} position={[0, obs.h, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
          <meshStandardMaterial color="#d8dde2" roughness={0.6} />
        </mesh>
        {/* White fins closing off each end */}
        {ends.map((e, i) => (
          <mesh key={i} position={[e.x, obs.h / 2, e.z]} rotation={[0, e.rotY, 0]} castShadow>
            <boxGeometry args={[0.06, obs.h, THICKNESS + 0.06]} />
            <meshStandardMaterial color="#e8ecef" roughness={0.5} />
          </mesh>
        ))}
      </group>

      {/* Plaza paving */}
      <mesh position={[0, 0.02, DEPTH / 4]} receiveShadow>
        <boxGeometry args={[2.4, 0.04, DEPTH / 2]} />
        <meshStandardMaterial color="#8f8a82" roughness={0.9} />
      </mesh>

      {/* Wonderland: a wire-mesh head in side profile, drawn as a glowing wireframe.
          It's much bigger than real life so it can be seen next to the tower. */}
      <group position={[0, 0, DEPTH / 4]} rotation={[0, Math.PI / 2, 0]}>
        {/* Skull: tall and slightly long front-to-back */}
        <mesh position={[0, 1.0, -0.05]} scale={[0.72, 1.1, 0.95]}>
          <sphereGeometry args={[0.55, 18, 14]} />
          <meshBasicMaterial color="#ffe2a8" wireframe />
        </mesh>
        {/* Jaw and chin, forward and lower */}
        <mesh position={[0, 0.5, 0.18]} scale={[0.55, 0.62, 0.7]}>
          <sphereGeometry args={[0.45, 14, 10]} />
          <meshBasicMaterial color="#ffe2a8" wireframe />
        </mesh>
        {/* Nose */}
        <mesh position={[0, 0.8, 0.55]} rotation={[Math.PI / 2.3, 0, 0]}>
          <coneGeometry args={[0.09, 0.22, 6]} />
          <meshBasicMaterial color="#ffe2a8" wireframe />
        </mesh>
        {/* Neck */}
        <mesh position={[0, 0.2, -0.08]}>
          <cylinderGeometry args={[0.22, 0.3, 0.4, 12, 2, true]} />
          <meshBasicMaterial color="#ffe2a8" wireframe />
        </mesh>
      </group>
    </group>
  );
};
