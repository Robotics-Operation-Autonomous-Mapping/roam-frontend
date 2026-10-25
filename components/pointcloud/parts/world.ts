import * as THREE from "three";
import campus from "./campusData.json";

/**
 * The hidden world the rover explores: the middle of the University of
 * Calgary campus, built from OpenStreetMap data (see scripts/build-campus-data.py).
 * Nothing here is drawn directly. The only way to see it is for the LiDAR
 * rays to hit it.
 *
 * Units are metres. x = east, z = south, y = up.
 */

// ─── What each laser can hit ─────────────────────────────────────────────────
export const KINDS = [
  "ground", "grass", "path", "road", "marking", // the ground
  "building", "glass", // building walls and windows
  "blossom", "trunk", // cherry trees
  "car", "lamp",
] as const;
export type Kind = (typeof KINDS)[number];

// ─── Ground: what the ground is made of, every 0.5 m ─────────────────────────
// The data file stores it run-length encoded: [value, count, value, count, ...]
const G = campus.ground;
const groundCells = new Uint8Array(G.nx * G.nz);
for (let i = 0, at = 0; i < G.rle.length; i += 2) {
  groundCells.fill(G.rle[i], at, at + G.rle[i + 1]);
  at += G.rle[i + 1];
}
// Values from the script → kind of ground and its height (roads sit below the curb)
const GROUND_KIND: Kind[] = ["ground", "grass", "path", "road", "road", "marking", "path"];
const GROUND_Y = [0, 0.04, 0, -0.15, -0.15, -0.15, 0];

/** Ground type at (x, z): an index into GROUND_KIND, or -1 off the edge of the map. */
function groundAt(x: number, z: number) {
  const i = Math.floor((x - G.x0) / G.cell);
  const j = Math.floor((z - G.z0) / G.cell);
  if (i < 0 || j < 0 || i >= G.nx || j >= G.nz) return -1;
  return groundCells[j * G.nx + i];
}

export const ROAD_Y = -0.15;

// ─── Buildings: walls from the map outlines, pushed up to their height ───────
type Wall = { ax: number; az: number; bx: number; bz: number; len: number; h: number; building: number };
export const BUILDINGS = campus.buildings.map((b) => {
  const xs = b.poly.map((p) => p[0]);
  const zs = b.poly.map((p) => p[1]);
  return {
    name: b.name as string | null,
    h: b.h,
    // Middle of the outline, used for the floating name
    cx: xs.reduce((a, v) => a + v, 0) / xs.length,
    cz: zs.reduce((a, v) => a + v, 0) / zs.length,
    minX: Math.min(...xs), maxX: Math.max(...xs), minZ: Math.min(...zs), maxZ: Math.max(...zs),
  };
});
const WALLS: Wall[] = [];
campus.buildings.forEach((b, building) => {
  for (let i = 0; i < b.poly.length - 1; i++) {
    const [ax, az] = b.poly[i];
    const [bx, bz] = b.poly[i + 1];
    const len = Math.hypot(bx - ax, bz - az);
    if (len > 0.05) WALLS.push({ ax, az, bx, bz, len, h: b.h, building });
  }
});

// ─── Round things: tree crowns (spheres), trunks and lamp posts (cylinders) ──
type Sphere = { x: number; y: number; z: number; r: number; tree: number };
type Cylinder = { x: number; z: number; r: number; y1: number; kind: Kind; tree: number };
type Box = { x0: number; z0: number; x1: number; z1: number; y0: number; y1: number; kind: Kind };

export const TREES = campus.blossoms;
const SPHERES: Sphere[] = [];
const CYLINDERS: Cylinder[] = [];
TREES.forEach((t, tree) => {
  CYLINDERS.push({ x: t.x, z: t.z, r: 0.22, y1: t.trunk + 0.5, kind: "trunk", tree });
  for (const [x, y, z, r] of t.crowns) SPHERES.push({ x, y, z, r, tree });
});
const BOXES: Box[] = campus.cars.map(([x0, z0, x1, z1, h]) => ({ x0, z0, x1, z1, y0: -0.15, y1: h - 0.15, kind: "car" }));
for (const [x, z] of campus.lamps) {
  CYLINDERS.push({ x, z, r: 0.09, y1: 6, kind: "lamp", tree: -1 });
  BOXES.push({ x0: x - 0.35, z0: z - 0.2, x1: x + 0.35, z1: z + 0.2, y0: 6, y1: 6.25, kind: "lamp" });
}

// ─── The rover's loop ────────────────────────────────────────────────────────
export const ROVER_PATH = new THREE.CatmullRomCurve3(
  campus.route.map(([x, z]) => new THREE.Vector3(x, ROAD_Y, z)),
  true,
  "centripetal",
);
export const PATH_LENGTH = ROVER_PATH.getLength();
export const ORIGIN = campus.origin;

// ─── Only test what the lasers can reach this frame ──────────────────────────
// Testing every ray against everything on campus would be slow. Each frame
// the LiDAR only sweeps a slice of its rotation (about 60°), so we pick out
// the things that are in range AND inside that slice.
export type Nearby = { walls: Wall[]; spheres: Sphere[]; cylinders: Cylinder[]; boxes: Box[] };

/**
 * @param fromAngle, toAngle  the slice being swept this frame, in radians,
 *   measured the same way as the rays (0 = +z, increasing towards +x)
 */
export function nearby(x: number, z: number, range: number, fromAngle: number, toAngle: number): Nearby {
  const mid = (fromAngle + toAngle) / 2;
  const half = (toAngle - fromAngle) / 2;

  /** Could something at (px, pz) with size r be hit by a ray in the slice? */
  const reachable = (px: number, pz: number, r: number) => {
    const dx = px - x, dz = pz - z;
    const dist = Math.hypot(dx, dz);
    if (dist > range + r) return false; // too far away
    if (dist < r + 1) return true; // right next to us: always test it
    // Angle from the slice's centre, wrapped to -π..π
    let diff = Math.atan2(dx, dz) - mid;
    diff = Math.atan2(Math.sin(diff), Math.cos(diff));
    return Math.abs(diff) <= half + Math.asin(Math.min(1, r / dist)) + 0.02;
  };

  return {
    walls: WALLS.filter((w) => reachable((w.ax + w.bx) / 2, (w.az + w.bz) / 2, w.len / 2)),
    spheres: SPHERES.filter((s) => reachable(s.x, s.z, s.r)),
    cylinders: CYLINDERS.filter((c) => reachable(c.x, c.z, c.r + 0.4)),
    boxes: BOXES.filter((b) => reachable((b.x0 + b.x1) / 2, (b.z0 + b.z1) / 2, 2.5)),
  };
}

// ─── Ray casting ─────────────────────────────────────────────────────────────

/** Result of the most recent castRay call. */
export const hit = { distance: 0, kind: "ground" as Kind, building: -1, tree: -1 };

/**
 * Fire one laser from `origin` in direction `dir` (length 1). Returns true if
 * it hit something within `maxRange`; the details are left in `hit`.
 */
export function castRay(o: THREE.Vector3, d: THREE.Vector3, maxRange: number, near: Nearby): boolean {
  let best = maxRange;
  let kind: Kind = "ground";
  let building = -1;
  let tree = -1;

  // Building walls: where the ray crosses each wall line, seen from above
  for (const w of near.walls) {
    const ex = w.bx - w.ax, ez = w.bz - w.az;
    const denom = d.x * ez - d.z * ex;
    if (Math.abs(denom) < 1e-9) continue; // parallel
    const t = ((w.ax - o.x) * ez - (w.az - o.z) * ex) / denom;
    const u = ((w.ax - o.x) * d.z - (w.az - o.z) * d.x) / denom;
    if (t <= 0 || t >= best || u < 0 || u > 1) continue;
    const y = o.y + d.y * t;
    if (y < 0 || y > w.h) continue;

    // Windows: a grid of panes 3 m apart along the wall, one row per 4.2 m floor.
    // Glass sits 0.35 m back from the stone, which gives the facade depth.
    const along = (u * w.len) % 3;
    const up = y % 4.2;
    const isWindow = along > 0.6 && along < 2.4 && up > 1 && up < 3.4 && y < w.h - 1;
    best = isWindow ? t + 0.35 : t;
    kind = isWindow ? "glass" : "building";
    building = w.building;
    tree = -1;
  }

  // Tree crowns: blossom is see-through, so rays get a little way in, and
  // some pass straight through to whatever is behind
  for (const s of near.spheres) {
    const ox = o.x - s.x, oy = o.y - s.y, oz = o.z - s.z;
    const b = ox * d.x + oy * d.y + oz * d.z;
    const c = ox * ox + oy * oy + oz * oz - s.r * s.r;
    const disc = b * b - c;
    if (disc < 0) continue;
    let t = -b - Math.sqrt(disc);
    if (t <= 0 || t >= best || Math.random() < 0.3) continue;
    t += Math.random() * s.r * 0.6;
    best = t;
    kind = "blossom";
    building = -1;
    tree = s.tree;
  }

  // Trunks and lamp posts: upright cylinders
  for (const cy of near.cylinders) {
    const ox = o.x - cy.x, oz = o.z - cy.z;
    const a = d.x * d.x + d.z * d.z;
    if (a < 1e-6) continue;
    const b = ox * d.x + oz * d.z;
    const c = ox * ox + oz * oz - cy.r * cy.r;
    const disc = b * b - a * c;
    if (disc < 0) continue;
    const t = (-b - Math.sqrt(disc)) / a;
    if (t <= 0 || t >= best) continue;
    const y = o.y + d.y * t;
    if (y < -0.2 || y > cy.y1) continue;
    best = t;
    kind = cy.kind;
    building = -1;
    tree = cy.tree;
  }

  // Cars and lamp heads: boxes
  // (the "slab" method: where the ray enters and leaves each pair of sides)
  const ix = 1 / d.x, iy = 1 / d.y, iz = 1 / d.z;
  for (const bx of near.boxes) {
    let t1 = (bx.x0 - o.x) * ix, t2 = (bx.x1 - o.x) * ix;
    let tmin = Math.min(t1, t2), tmax = Math.max(t1, t2);
    t1 = (bx.y0 - o.y) * iy; t2 = (bx.y1 - o.y) * iy;
    tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
    t1 = (bx.z0 - o.z) * iz; t2 = (bx.z1 - o.z) * iz;
    tmin = Math.max(tmin, Math.min(t1, t2)); tmax = Math.min(tmax, Math.max(t1, t2));
    if (tmax < tmin || tmin <= 0 || tmin >= best) continue;
    best = tmin;
    kind = bx.kind;
    building = -1;
    tree = -1;
  }

  // Ground: flat, so a simple plane hit. Then look up what it's made of
  if (d.y < -1e-4) {
    let t = (0 - o.y) / d.y;
    if (t < best) {
      let g = groundAt(o.x + d.x * t, o.z + d.z * t);
      if (g >= 0 && GROUND_Y[g] !== 0) {
        // Lower or raised surface (roads, grass): hit that height instead
        t = (GROUND_Y[g] - o.y) / d.y;
        g = groundAt(o.x + d.x * t, o.z + d.z * t);
      }
      if (g >= 0 && t < best) {
        best = t;
        kind = GROUND_KIND[g];
        building = -1;
        tree = -1;
      }
    }
  }

  if (best >= maxRange) return false;
  hit.distance = best;
  hit.kind = kind;
  hit.building = building;
  hit.tree = tree;
  return true;
}
