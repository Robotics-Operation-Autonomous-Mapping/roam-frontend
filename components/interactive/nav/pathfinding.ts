/**
 * pathfinding.ts
 * Pure A* implementation with 8-directional movement.
 * Zero React / Three.js dependencies — fully unit-testable.
 */
import type { Cell, Obstacle } from "./types";
import { GRID_SIZE, CELL_SIZE, HALF_GRID } from "./types";

// ─── Grid math ────────────────────────────────────────────────────────────────

export function cellKey(cell: Cell): string {
  return `${cell.x}:${cell.z}`;
}

/** Euclidean heuristic (correct for 8-directional movement). */
export function heuristic(a: Cell, b: Cell): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.z - b.z) ** 2);
}

/** Cell → Three.js world position (Y=0.2 keeps path above ground). */
export function toWorld(cell: Cell): [number, number, number] {
  return [cell.x * CELL_SIZE - HALF_GRID, 0.2, cell.z * CELL_SIZE - HALF_GRID];
}

/** Three.js world position → nearest grid cell (clamped to bounds). */
import * as THREE from "three";
export function toCell(point: THREE.Vector3): Cell {
  const x = Math.round((point.x + HALF_GRID) / CELL_SIZE);
  const z = Math.round((point.z + HALF_GRID) / CELL_SIZE);
  return {
    x: Math.max(0, Math.min(GRID_SIZE - 1, x)),
    z: Math.max(0, Math.min(GRID_SIZE - 1, z)),
  };
}

// ─── Obstacle collision ───────────────────────────────────────────────────────

/** Returns true if a cell's world position overlaps any obstacle's AABB.
 * Margin of 0.35 (was 0.1) ensures the rover body never clips building edges.
 */
export function isBlockedByList(cell: Cell, obstacles: Obstacle[]): boolean {
  const [wx, , wz] = toWorld(cell);
  const MARGIN = 0.35;
  return obstacles.some((obs) => {
    return (
      wx >= obs.x - obs.w / 2 - MARGIN &&
      wx <= obs.x + obs.w / 2 + MARGIN &&
      wz >= obs.z - obs.d / 2 - MARGIN &&
      wz <= obs.z + obs.d / 2 + MARGIN
    );
  });
}

// ─── Neighbours ───────────────────────────────────────────────────────────────

const DIRS = [
  { dx: 1, dz: 0, cost: 1 },
  { dx: -1, dz: 0, cost: 1 },
  { dx: 0, dz: 1, cost: 1 },
  { dx: 0, dz: -1, cost: 1 },
  { dx: 1, dz: 1, cost: 1.414 },
  { dx: -1, dz: 1, cost: 1.414 },
  { dx: 1, dz: -1, cost: 1.414 },
  { dx: -1, dz: -1, cost: 1.414 },
];

function neighbors8(
  cell: Cell,
  obstacles: Obstacle[],
): { cell: Cell; cost: number }[] {
  return DIRS.map(({ dx, dz, cost }) => ({
    cell: { x: cell.x + dx, z: cell.z + dz },
    cost,
    dx,
    dz,
  }))
    .filter(({ cell: c, dx, dz }) => {
      // Bounds check
      if (c.x < 0 || c.x >= GRID_SIZE || c.z < 0 || c.z >= GRID_SIZE)
        return false;
      // Cell itself must be free
      if (isBlockedByList(c, obstacles)) return false;
      // Diagonal corner-cutting prevention:
      // if both cardinal neighbours beside a diagonal are blocked, disallow it
      if (dx !== 0 && dz !== 0) {
        const cardA = { x: cell.x + dx, z: cell.z };
        const cardB = { x: cell.x, z: cell.z + dz };
        if (
          isBlockedByList(cardA, obstacles) ||
          isBlockedByList(cardB, obstacles)
        )
          return false;
      }
      return true;
    })
    .map(({ cell: c, cost }) => ({ cell: c, cost }));
}

// ─── A* ──────────────────────────────────────────────────────────────────────

export interface PathResult {
  path: Cell[];
  visited: Cell[];
}

/**
 * Finds the shortest path from `start` to `goal` avoiding `obstacles`.
 * Returns both the optimal path and all visited cells (for heatmap rendering).
 */
export function findPath(
  start: Cell,
  goal: Cell,
  obstacles: Obstacle[],
): PathResult {
  if (isBlockedByList(start, obstacles) || isBlockedByList(goal, obstacles)) {
    return { path: [], visited: [] };
  }

  const open: Cell[] = [start];
  const cameFrom = new Map<string, string>();
  const gScore = new Map<string, number>([[cellKey(start), 0]]);
  const fScore = new Map<string, number>([
    [cellKey(start), heuristic(start, goal)],
  ]);
  const visited: Cell[] = [];

  while (open.length > 0) {
    open.sort(
      (a, b) =>
        (fScore.get(cellKey(a)) ?? Infinity) -
        (fScore.get(cellKey(b)) ?? Infinity),
    );
    const current = open.shift()!;
    visited.push(current);

    if (current.x === goal.x && current.z === goal.z) {
      const path: Cell[] = [current];
      let cursor = cellKey(current);
      while (cameFrom.has(cursor)) {
        const prev = cameFrom.get(cursor)!;
        const [x, z] = prev.split(":").map(Number);
        path.unshift({ x, z });
        cursor = prev;
      }
      return { path, visited };
    }

    for (const { cell: neighbor, cost } of neighbors8(current, obstacles)) {
      const tentative = (gScore.get(cellKey(current)) ?? Infinity) + cost;
      if (tentative < (gScore.get(cellKey(neighbor)) ?? Infinity)) {
        cameFrom.set(cellKey(neighbor), cellKey(current));
        gScore.set(cellKey(neighbor), tentative);
        fScore.set(cellKey(neighbor), tentative + heuristic(neighbor, goal));
        if (!open.some((c) => c.x === neighbor.x && c.z === neighbor.z)) {
          open.push(neighbor);
        }
      }
    }
  }

  return { path: [], visited };
}
