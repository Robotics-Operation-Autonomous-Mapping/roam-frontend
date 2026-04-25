"use client";

import React, { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Html } from "@react-three/drei";
import * as THREE from "three";

type Cell = { x: number; z: number };
type Obstacle = { x: number; z: number; w: number; d: number; h: number };

const GRID_SIZE = 20;
const CELL_SIZE = 1;
const HALF_GRID = (GRID_SIZE * CELL_SIZE) / 2;

const OBSTACLES: Obstacle[] = [
  { x: -4, z: -3, w: 2, d: 4, h: 1.2 },
  { x: 2, z: -1, w: 3, d: 2, h: 1.7 },
  { x: -1, z: 4, w: 4, d: 2, h: 1.1 },
  { x: 5, z: 5, w: 2, d: 3, h: 1.4 },
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
    return world[0] >= minX && world[0] <= maxX && world[2] >= minZ && world[2] <= maxZ;
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
  return n.filter((c) => c.x >= 0 && c.x < GRID_SIZE && c.z >= 0 && c.z < GRID_SIZE);
}

function findPath(start: Cell, goal: Cell): Cell[] {
  if (isBlocked(start) || isBlocked(goal)) return [];

  const open: Cell[] = [start];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[key(start), 0]]);
  const fScore = new Map<string, number>([[key(start), heuristic(start, goal)]]);

  while (open.length > 0) {
    open.sort((a, b) => (fScore.get(key(a)) ?? Infinity) - (fScore.get(key(b)) ?? Infinity));
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

      <gridHelper args={[GRID_SIZE, GRID_SIZE, "#E8512A", "#3A3A3A"]} position={[0, 0, 0]} />

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
        <mesh key={idx} position={[obs.x, obs.h / 2, obs.z]}>
          <boxGeometry args={[obs.w, obs.h, obs.d]} />
          <meshStandardMaterial color="#2B313E" metalness={0.45} roughness={0.55} />
        </mesh>
      ))}

      {start && (
        <mesh position={toWorld(start)}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#2ECC71" emissive="#2ECC71" emissiveIntensity={0.5} />
        </mesh>
      )}

      {end && (
        <mesh position={toWorld(end)}>
          <sphereGeometry args={[0.22, 20, 20]} />
          <meshStandardMaterial color="#E8512A" emissive="#E8512A" emissiveIntensity={0.6} />
        </mesh>
      )}

      {pathPoints.length > 1 && (
        <Line points={pathPoints} color="#F5ECD7" lineWidth={2.2} />
      )}

      {endPoint && (
        <mesh position={endPoint}>
          <sphereGeometry args={[0.1, 12, 12]} />
          <meshStandardMaterial color="#F5ECD7" emissive="#F5ECD7" emissiveIntensity={1} />
        </mesh>
      )}

      <Html position={[-8.8, 3.5, 0]} transform>
        <div className="bg-bg/85 border border-border px-3 py-2 font-mono text-[10px] tracking-wider text-muted uppercase w-[180px]">
          Click once for START, again for END.
        </div>
      </Html>

      <OrbitControls enablePan={false} maxPolarAngle={Math.PI / 2.2} minDistance={10} maxDistance={24} />
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
        {path.length > 1 ? `Path nodes: ${path.length}` : "Awaiting route input"}
      </div>
      {error && (
        <div className="absolute bottom-3 right-3 z-10 font-mono text-[10px] tracking-wide text-primary uppercase bg-bg/80 border border-primary px-2 py-1">
          {error}
        </div>
      )}
      <Canvas camera={{ position: [10, 11, 10], fov: 48 }} dpr={typeof window !== "undefined" ? Math.min(window.devicePixelRatio, 2) : 1} gl={{ antialias: typeof window !== "undefined" && window.innerWidth > 768 }}>
        <Scene start={start} end={end} path={path} onSelect={handleSelect} />
      </Canvas>
    </div>
  );
};

