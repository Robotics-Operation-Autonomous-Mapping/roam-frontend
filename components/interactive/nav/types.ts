// ─── Grid constants ───────────────────────────────────────────────────────────
export const GRID_SIZE = 20;
export const CELL_SIZE = 1;
export const HALF_GRID = (GRID_SIZE * CELL_SIZE) / 2;

// ─── Domain types ─────────────────────────────────────────────────────────────
export type Cell = { x: number; z: number };

export type ObstacleType =
  // Calgary landmarks (in use)
  | "calgary-tower"
  | "bow"
  | "library"
  | "city-hall"
  | "office"
  // World landmarks (the original set, kept but not used: see WORLD_OBSTACLES)
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
// The obstacle list the sim uses. To switch back to the original world
// landmarks, change WHICH_CITY below to WORLD_OBSTACLES.

// Downtown Calgary. x/z is the centre, w/d the footprint the rover can't
// drive through, h the height. The camera looks from the +x/+z corner.
export const CALGARY_OBSTACLES: Obstacle[] = [
  { x: 0, z: 0, w: 1.6, d: 1.6, h: 5.6, type: "calgary-tower" }, // centre
  { x: -2.5, z: -6, w: 3.6, d: 3.6, h: 5.2, type: "bow" }, // back, turned to face the camera
  { x: -6, z: 4, w: 4, d: 2.6, h: 1.6, type: "library" }, // left
  { x: 4.5, z: 3, w: 4, d: 2.4, h: 4, type: "city-hall" }, // front right
  { x: 5, z: -5, w: 2, d: 2, h: 3.4, type: "office" },
  { x: 2.5, z: -7.5, w: 1.8, d: 1.8, h: 2.6, type: "office" },
  { x: 8, z: -1, w: 1.6, d: 1.6, h: 2.2, type: "office" },
];

// The original world landmarks, kept in case we want them back
export const WORLD_OBSTACLES: Obstacle[] = [
  { x: -5, z: -4, w: 2.2, d: 2.2, h: 2.4, type: "empire" }, // NW quad
  { x: 0, z: 0, w: 3.2, d: 3.2, h: 1.0, type: "pentagon" }, // centre
  { x: 5, z: 5, w: 4.2, d: 2.2, h: 1.4, type: "louvre" }, // SE quad
  { x: 6, z: -5, w: 3.2, d: 3.2, h: 2.8, type: "willis" }, // NE quad
  { x: -2, z: 7, w: 2.2, d: 2.2, h: 2.2, type: "taipei" }, // S edge
  { x: -7, z: 4, w: 3.2, d: 3.2, h: 1.8, type: "guggenheim" }, // W edge
  { x: 7, z: 2, w: 2.8, d: 2.8, h: 3.5, type: "sagrada" }, // E edge
];

// ← the one line to change to switch city
export const STATIC_OBSTACLES = CALGARY_OBSTACLES;

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
