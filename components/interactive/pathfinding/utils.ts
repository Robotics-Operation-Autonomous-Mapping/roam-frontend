import * as THREE from "three";
import { Cell } from "./types";
import { GRID_SIZE, CELL_SIZE, HALF_GRID, OBSTACLES } from "./constants";

export function toCell(point: THREE.Vector3): Cell {
  const x = Math.floor((point.x + HALF_GRID) / CELL_SIZE);
  const z = Math.floor((point.z + HALF_GRID) / CELL_SIZE);
  return {
    x: Math.max(0, Math.min(GRID_SIZE - 1, x)),
    z: Math.max(0, Math.min(GRID_SIZE - 1, z)),
  };
}

export function toWorld(cell: Cell): [number, number, number] {
  return [
    cell.x * CELL_SIZE - HALF_GRID + CELL_SIZE / 2,
    0.18,
    cell.z * CELL_SIZE - HALF_GRID + CELL_SIZE / 2,
  ];
}

export function isBlocked(cell: Cell): boolean {
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

export function findPath(start: Cell, goal: Cell): Cell[] {
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
