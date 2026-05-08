import { Obstacle } from "./types";

export const GRID_SIZE = 20;
export const CELL_SIZE = 1;
export const HALF_GRID = (GRID_SIZE * CELL_SIZE) / 2;

export const OBSTACLES: Obstacle[] = [
  { x: -4, z: -3, w: 2, d: 2, h: 2.2, type: "empire" },
  { x: 2, z: -1, w: 3, d: 3, h: 1.0, type: "pentagon" },
  { x: -1, z: 4, w: 4, d: 2, h: 1.1, type: "louvre" },
  { x: 5, z: 5, w: 3, d: 3, h: 2.5, type: "willis" },
];
