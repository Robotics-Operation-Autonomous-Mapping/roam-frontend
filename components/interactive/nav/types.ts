// ─── Grid constants ───────────────────────────────────────────────────────────
export const GRID_SIZE = 20;
export const CELL_SIZE = 1;
export const HALF_GRID = (GRID_SIZE * CELL_SIZE) / 2;

// ─── Domain types ─────────────────────────────────────────────────────────────
export type Cell = { x: number; z: number };

export type ObstacleType =
  | "empire"
  | "pentagon"
  | "louvre"
  | "willis"
  | "taipei"
  | "guggenheim"
  | "sagrada";

export type Obstacle = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  isDynamic?: boolean;
  type?: ObstacleType;
};

// ─── Default obstacle map ─────────────────────────────────────────────────────
// Buildings are spread across the grid so they read as distinct landmarks.
export const STATIC_OBSTACLES: Obstacle[] = [
  { x: -5, z: -4, w: 2.2, d: 2.2, h: 2.4, type: "empire" }, // NW quad
  { x: 0, z: 0, w: 3.2, d: 3.2, h: 1.0, type: "pentagon" }, // centre
  { x: 5, z: 5, w: 4.2, d: 2.2, h: 1.4, type: "louvre" }, // SE quad
  { x: 6, z: -5, w: 3.2, d: 3.2, h: 2.8, type: "willis" }, // NE quad
  { x: -2, z: 7, w: 2.2, d: 2.2, h: 2.2, type: "taipei" }, // S edge
  { x: -7, z: 4, w: 3.2, d: 3.2, h: 1.8, type: "guggenheim" }, // W edge
  { x: 7, z: 2, w: 2.8, d: 2.8, h: 3.5, type: "sagrada" }, // E edge
];

// ─── Cyberpunk colour palette ─────────────────────────────────────────────────
export const CP = {
  cyan: "#00F5FF",
  magenta: "#FF00CC",
  orange: "#FF6B00",
  yellow: "#FFE600",
  grid: "#0A2540",
  gridLine: "#0D4F6E",
  bg: "#000D1A",
} as const;
