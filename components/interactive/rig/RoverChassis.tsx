"use client";

import React from "react";
import * as THREE from "three";

export const RoverChassis: React.FC = () => {
  const frameMat  = new THREE.MeshStandardMaterial({ color: "#1A2030", metalness: 0.85, roughness: 0.25 });
  const deckMat   = new THREE.MeshStandardMaterial({ color: "#3A7BD5", metalness: 0.1, roughness: 0.5, transparent: true, opacity: 0.07, side: THREE.DoubleSide });
  const wheelMat  = new THREE.MeshStandardMaterial({ color: "#111418", metalness: 0.4, roughness: 0.7 });
  const spokeMat  = new THREE.MeshStandardMaterial({ color: "#2A3040", metalness: 0.7, roughness: 0.4 });
  const bumperMat = new THREE.MeshStandardMaterial({ color: "#D4A84B", metalness: 0.9, roughness: 0.2, emissive: "#4A3000", emissiveIntensity: 0.15 });

  const RAIL  = 0.045;
  const LEN_Z = 1.85;
  const LEN_X = 2.2;
  const BOT_Y = -0.85;
  const TOP_Y = 0.55;
  const CX_Y  = (BOT_Y + TOP_Y) / 2;

  const WHEEL_POSITIONS: [number, number, number][] = [
    [-0.9, BOT_Y, 0.85], [0.9, BOT_Y, 0.85],
    [-0.9, BOT_Y, -0.7], [0.9, BOT_Y, -0.7],
  ];

  return (
    <group position={[0, 0.15, 0.15]} scale={1.7}>
      {/* Bottom longitudinal rails */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={`brl${i}`} position={[x, BOT_Y, 0.075]} material={frameMat}>
          <boxGeometry args={[RAIL, RAIL, LEN_Z]} />
        </mesh>
      ))}
      {/* Top longitudinal rails */}
      {[-1.1, 1.1].map((x, i) => (
        <mesh key={`trl${i}`} position={[x, TOP_Y, 0.075]} material={frameMat}>
          <boxGeometry args={[RAIL, RAIL, LEN_Z]} />
        </mesh>
      ))}
      {/* Bottom lateral cross-members */}
      {[-0.7, 0.0, 0.55, 1.0].map((z, i) => (
        <mesh key={`bcm${i}`} position={[0, BOT_Y, z]} material={frameMat}>
          <boxGeometry args={[LEN_X, RAIL, RAIL]} />
        </mesh>
      ))}
      {/* Top lateral cross-members */}
      {[-0.7, 0.0, 0.55, 1.0].map((z, i) => (
        <mesh key={`tcm${i}`} position={[0, TOP_Y, z]} material={frameMat}>
          <boxGeometry args={[LEN_X, RAIL, RAIL]} />
        </mesh>
      ))}
      {/* Mid-deck lateral cross-members */}
      {[-0.35, 0.28].map((z, i) => (
        <mesh key={`mcm${i}`} position={[0, -0.15, z]} material={frameMat}>
          <boxGeometry args={[LEN_X, RAIL, RAIL]} />
        </mesh>
      ))}
      {/* 4 Corner uprights */}
      {([ [-1.1, -0.7], [1.1, -0.7], [-1.1, 1.0], [1.1, 1.0] ] as [number, number][]).map(([x, z], i) => (
        <mesh key={`up${i}`} position={[x, CX_Y, z]} material={frameMat}>
          <boxGeometry args={[RAIL, TOP_Y - BOT_Y, RAIL]} />
        </mesh>
      ))}
      {/* Mid vertical side stanchions */}
      {([ [-1.1, 0.15], [1.1, 0.15] ] as [number, number][]).map(([x, z], i) => (
        <mesh key={`ms${i}`} position={[x, CX_Y, z]} material={frameMat}>
          <boxGeometry args={[RAIL, TOP_Y - BOT_Y, RAIL]} />
        </mesh>
      ))}
      {/* Diagonal braces */}
      {([
        { x: -1.1, z: -0.7, ry: 0.55,  rz: Math.PI * 0.15  },
        { x:  1.1, z: -0.7, ry: 0.55,  rz: -Math.PI * 0.15 },
        { x: -1.1, z:  1.0, ry: 0.55,  rz: Math.PI * 0.15  },
        { x:  1.1, z:  1.0, ry: 0.55,  rz: -Math.PI * 0.15 },
      ]).map((b, i) => (
        <mesh key={`br${i}`} position={[b.x * 0.55, BOT_Y + 0.35, b.z]} rotation={[0, b.ry, b.rz]} material={frameMat}>
          <boxGeometry args={[RAIL * 0.8, 0.75, RAIL * 0.8]} />
        </mesh>
      ))}
      {/* Top deck plate (transparent) */}
      <mesh position={[0, TOP_Y, 0.075]} material={deckMat}>
        <boxGeometry args={[LEN_X - 0.08, 0.008, LEN_Z - 0.08]} />
      </mesh>
      {/* Bottom plate (transparent) */}
      <mesh position={[0, BOT_Y, 0.075]} material={deckMat}>
        <boxGeometry args={[LEN_X - 0.08, 0.008, LEN_Z - 0.08]} />
      </mesh>
      {/* Front bumper */}
      <mesh position={[0, BOT_Y + 0.12, 1.06]} material={bumperMat}>
        <boxGeometry args={[LEN_X + 0.06, 0.06, 0.055]} />
      </mesh>
      {/* Rear bumper */}
      <mesh position={[0, BOT_Y + 0.12, -0.82]} material={bumperMat}>
        <boxGeometry args={[LEN_X + 0.06, 0.06, 0.055]} />
      </mesh>
      {/* Hub-motor wheels */}
      {WHEEL_POSITIONS.map(([wx, wy, wz], wi) => (
        <group key={`w${wi}`} position={[wx, wy, wz]} rotation={[0, 0, Math.PI / 2]}>
          <mesh material={wheelMat}><cylinderGeometry args={[0.22, 0.22, 0.12, 32]} /></mesh>
          <mesh material={spokeMat}><cylinderGeometry args={[0.07, 0.07, 0.14, 16]} /></mesh>
          {Array.from({ length: 6 }).map((_, si) => (
            <mesh key={si} rotation={[0, 0, (si / 6) * Math.PI]} material={spokeMat}>
              <boxGeometry args={[0.28, 0.018, 0.015]} />
            </mesh>
          ))}
          <mesh material={frameMat}><torusGeometry args={[0.19, 0.014, 8, 32]} /></mesh>
        </group>
      ))}
      {/* Wheel arch ribs */}
      {WHEEL_POSITIONS.map(([wx, wy, wz], wi) => (
        <mesh key={`wa${wi}`} position={[wx, wy + 0.24, wz]} rotation={[0, 0, Math.PI / 2]} material={frameMat}>
          <torusGeometry args={[0.24, RAIL * 0.6, 6, 16, Math.PI]} />
        </mesh>
      ))}
      {/* LiDAR mast */}
      <mesh position={[0, TOP_Y + 0.5, 0]} material={frameMat}>
        <cylinderGeometry args={[0.025, 0.028, 1.0, 12]} />
      </mesh>
      {/* GPS rear-left mast */}
      <mesh position={[-0.3, TOP_Y + 0.55, -0.5]} material={frameMat}>
        <cylinderGeometry args={[0.018, 0.020, 1.1, 10]} />
      </mesh>
    </group>
  );
};
