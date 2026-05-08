export type Cell = { x: number; z: number };

export type ObstacleType = "empire" | "pentagon" | "louvre" | "willis" | "taipei";

export type Obstacle = {
  x: number;
  z: number;
  w: number;
  d: number;
  h: number;
  type?: ObstacleType;
};
