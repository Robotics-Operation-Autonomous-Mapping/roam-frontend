"use client";

import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";

type Cell = { x: number; z: number };
type Obstacle = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  type?: "empire" | "pentagon" | "louvre" | "willis" | "taipei";
};

const GRID_SIZE = 20;
const CELL_SIZE = 1;
const HALF_GRID = (GRID_SIZE * CELL_SIZE) / 2;

const OBSTACLES: Obstacle[] = [
  { x: -4, z: -3, w: 2, d: 2, h: 2.2, type: "empire" },
  { x: 2, z: -1, w: 3, d: 3, h: 1.0, type: "pentagon" },
  { x: -1, z: 4, w: 4, d: 2, h: 1.1, type: "louvre" },
  { x: 5, z: 5, w: 3, d: 3, h: 2.5, type: "willis" },
];

function toCell(point: THREE.Vector3): Cell {
  const x = Math.floor((point.x + HALF_GRID) / CELL_SIZE);
  const z = Math.floor((point.z + HALF_GRID) / CELL_SIZE);
  return {
    x: Math.max(0, Math.min(GRID_SIZE - 1, x)),
    z: Math.max(0, Math.min(GRID_SIZE - 1, z)),
  };
}

function toWorld(cell: Cell): [number, number, number] {
  return [
    cell.x * CELL_SIZE - HALF_GRID + CELL_SIZE / 2,
    0.18,
    cell.z * CELL_SIZE - HALF_GRID + CELL_SIZE / 2,
  ];
}

function isBlocked(cell: Cell): boolean {
  return OBSTACLES.some((obs) => {
    const minX = obs.x - obs.w / 2;
    const maxX = obs.x + obs.w / 2;
    const minZ = obs.z - obs.d / 2;
    const maxZ = obs.z + obs.d / 2;
    const world = toWorld(cell);
    return (
      world[0] >= minX &&
      world[0] <= maxX &&
      world[2] >= minZ &&
      world[2] <= maxZ
    );
  });
}

function key(cell: Cell): string {
  return `${cell.x}:${cell.z}`;
}

function heuristic(a: Cell, b: Cell): number {
  return Math.abs(a.x - b.x) + Math.abs(a.z - b.z);
}

function neighbors(cell: Cell): Cell[] {
  const n: Cell[] = [
    { x: cell.x + 1, z: cell.z },
    { x: cell.x - 1, z: cell.z },
    { x: cell.x, z: cell.z + 1 },
    { x: cell.x, z: cell.z - 1 },
  ];
  return n.filter(
    (c) => c.x >= 0 && c.x < GRID_SIZE && c.z >= 0 && c.z < GRID_SIZE,
  );
}

function findPath(start: Cell, goal: Cell): Cell[] {
  if (isBlocked(start) || isBlocked(goal)) return [];

  const open: Cell[] = [start];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const fScore = new Map<string, number>([
    [key(start), heuristic(start, goal)],
  ]);

  while (open.length > 0) {
    open.sort(
      (a, b) =>
        (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity),
    );
    const current = open.shift();
    if (!current) break;

    if (current.x === goal.x && current.z === goal.z) {
      const path: Cell[] = [current];
      let cursor = key(current);
      while (cameFrom.has(cursor)) {
        const prev = cameFrom.get(cursor);
        if (!prev) break;
        const [x, z] = prev.split(":").map(Number);
        path.unshift({ x, z });
        cursor = prev;
      }
      return path;
    }

    for (const neighbor of neighbors(current)) {
      if (isBlocked(neighbor)) continue;
      const tentative = (gScore.get(key(current)) ?? Infinity) + 1;
      if (tentative < (gScore.get(key(neighbor)) ?? Infinity)) {
        cameFrom.set(key(neighbor), key(current));
        gScore.set(key(neighbor), tentative);
        fScore.set(key(neighbor), tentative + heuristic(neighbor, goal));
        if (!open.some((c) => c.x === neighbor.x && c.z === neighbor.z)) {
          open.push(neighbor);
        }
      }
    }
  }

  return [];
}

const Building = ({ obs }: { obs: Obstacle }) => {
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

const Scene: React.FC<{
  start: Cell | null;
  end: Cell | null;
  path: Cell[];
  onSelect: (cell: Cell) => void;
}> = ({ start, end, path, onSelect }) => {
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

export const PathPlanningSandbox: React.FC = () => {
  const [start, setStart] = useState<Cell | null>(null);
  const [end, setEnd] = useState<Cell | null>(null);
  const [path, setPath] = useState<Cell[]>([]);
  const [selecting, setSelecting] = useState<"start" | "end">("start");
  const [error, setError] = useState<string>("");

  const resetSelection = () => {
    setStart(null);
    setEnd(null);
    setPath([]);
    setError("");
    setSelecting("start");
  };

  const handleSelect = (cell: Cell) => {
    if (isBlocked(cell)) {
      setError("Selected cell is occupied by an obstacle.");
      return;
    }

    setError("");
    if (selecting === "start") {
      setStart(cell);
      setEnd(null);
      setPath([]);
      setSelecting("end");
      return;
    }

    if (!start) return;
    setEnd(cell);
    const computed = findPath(start, cell);
    setPath(computed);
    if (computed.length === 0) {
      setError("No valid path found. Pick another endpoint.");
    }
    setSelecting("start");
  };

  return (
    <div className="w-full h-full min-h-[360px] border border-border bg-surface/60 relative">
      <div className="absolute top-3 left-3 z-10 font-mono text-[11px] tracking-widest text-primary uppercase">
        [ Path Planning Sandbox ]
      </div>
      <div className="absolute top-3 right-3 z-10 font-mono text-[11px] tracking-widest text-muted uppercase">
        {selecting === "start" ? "Select Start" : "Select End"}
      </div>
      <button
        type="button"
        onClick={resetSelection}
        className="absolute top-10 right-3 z-10 font-mono text-[10px] tracking-widest text-primary uppercase border border-primary px-2 py-1 bg-bg/80 hover:bg-primary hover:text-white transition-colors"
      >
        Reset Start/End
      </button>
      <div className="absolute bottom-3 left-3 z-10 font-mono text-[11px] tracking-widest text-cream/80 uppercase">
        {path.length > 1
          ? `Path nodes: ${path.length}`
          : "Awaiting route input"}
      </div>
      {error && (
        <div className="absolute bottom-3 right-3 z-10 font-mono text-[10px] tracking-wide text-primary uppercase bg-bg/80 border border-primary px-2 py-1">
          {error}
        </div>
      )}
      <Canvas
        camera={{ position: [10, 11, 10], fov: 48 }}
        dpr={
          typeof window !== "undefined"
            ? Math.min(window.devicePixelRatio, 2)
            : 1
        }
        gl={{
          antialias: typeof window !== "undefined" && window.innerWidth > 768,
        }}
      >
        <Scene start={start} end={end} path={path} onSelect={handleSelect} />
      </Canvas>
    </div>
  );
};
