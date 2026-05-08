"use client";

import React, { useMemo } from "react";
import { OrbitControls, Line, Html } from "@react-three/drei";
import { Cell } from "./types";
import { GRID_SIZE, OBSTACLES } from "./constants";
import { toCell, toWorld } from "./utils";
import { Building } from "./Building";

interface SceneProps {
  start: Cell | null;
  end: Cell | null;
  path: Cell[];
  onSelect: (cell: Cell) => void;
}

export const Scene: React.FC<SceneProps> = ({ start, end, path, onSelect }) => {
  const pathPoints = useMemo(() => path.map((c) => toWorld(c)), [path]);
  const endPoint = pathPoints[pathPoints.length - 1];

  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 8, 3]} intensity={0.7} color="#F5ECD7" />
      <pointLight position={[0, 5, 0]} intensity={0.7} color="#E8512A" />

      <gridHelper
        args={[GRID_SIZE, GRID_SIZE, "#E8512A", "#3A3A3A"]}
        position={[0, 0, 0]}
      />

      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.01, 0]}
        onPointerDown={(e) => {
          e.stopPropagation();
          onSelect(toCell(e.point));
        }}
      >
        <planeGeometry args={[GRID_SIZE, GRID_SIZE]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>

      {OBSTACLES.map((obs, idx) => (
        <Building key={idx} obs={obs} />
      ))}

      {start && (
        <mesh position={toWorld(start)}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial
            color="#2ECC71"
            emissive="#2ECC71"
            emissiveIntensity={0.5}
          />
        </mesh>
      )}

      {end && (
        <mesh position={toWorld(end)}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial
            color="#E8512A"
            emissive="#E8512A"
            emissiveIntensity={0.6}
          />
        </mesh>
      )}

      {pathPoints.length > 1 && (
        <Line points={pathPoints} color="#F5ECD7" lineWidth={2.2} />
      )}

      {endPoint && (
        <mesh position={endPoint}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial
            color="#F5ECD7"
            emissive="#F5ECD7"
            emissiveIntensity={1}
          />
        </mesh>
      )}

      <Html position={[-8.8, 3.5, 0]} transform>
        <div className="bg-bg/85 border border-border px-3 py-2 font-mono text-[10px] tracking-wider text-muted uppercase w-[180px]">
          Click once for START, again for END.
        </div>
      </Html>

      <OrbitControls
        enablePan={false}
        maxPolarAngle={Math.PI / 2.2}
        minDistance={10}
        maxDistance={24}
      />
    </>
  );
};
