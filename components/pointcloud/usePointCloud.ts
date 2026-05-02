import { useMemo } from "react";
import * as THREE from "three";

// ─── Palette ──────────────────────────────────────────────────────────────────
// Earth LiDAR palette: deep forest floor → limestone → warm canopy
const C_GROUND  = new THREE.Color("#0D2B1F"); // deep forest floor
const C_MID     = new THREE.Color("#2A5C3F"); // moss / undergrowth
const C_ROCK    = new THREE.Color("#8A7B5C"); // limestone / rock
const C_HIGH    = new THREE.Color("#E8512A"); // coral highlight — ROAM accent
const C_CANOPY  = new THREE.Color("#F5ECD7"); // sky-scatter cream

function heightToColor(t: number): THREE.Color {
  // 4-stop gradient — ground to canopy
  if (t < 0.25) return C_GROUND.clone().lerp(C_MID,   t * 4);
  if (t < 0.55) return C_MID.clone().lerp(C_ROCK,     (t - 0.25) / 0.30);
  if (t < 0.80) return C_ROCK.clone().lerp(C_HIGH,    (t - 0.55) / 0.25);
  return C_HIGH.clone().lerp(C_CANOPY,                (t - 0.80) / 0.20);
}

// ─── Noise (simple smooth FBM) ────────────────────────────────────────────────
function hash(n: number) {
  const x = Math.sin(n) * 43758.5453123;
  return x - Math.floor(x);
}
function noise2(x: number, z: number) {
  const ix = Math.floor(x), iz = Math.floor(z);
  const fx = x - ix,       fz = z - iz;
  const ux = fx*fx*(3-2*fx), uz = fz*fz*(3-2*fz);
  const a = hash(ix     + iz*57);
  const b = hash(ix+1   + iz*57);
  const c = hash(ix     + (iz+1)*57);
  const d = hash(ix+1   + (iz+1)*57);
  return a + (b-a)*ux + (c-a)*uz + (d-b-c+a)*ux*uz;
}
function fbm(x: number, z: number, octaves=6): number {
  let v=0, amp=0.5, freq=1, max=0;
  for (let i=0;i<octaves;i++){
    v   += noise2(x*freq, z*freq)*amp;
    max += amp;
    amp  *= 0.5;
    freq *= 2.1;
  }
  return v/max;
}

// ─── Feature clusters (boulders, tree-trunks, rocky outcrops) ────────────────
const FEATURES = [
  { cx:  6.0, cz:  4.0, r: 1.2, h: 3.5, density: 0.06 }, // boulder cluster
  { cx: -7.0, cz: -3.5, r: 1.5, h: 2.8, density: 0.05 },
  { cx:  2.5, cz: -8.0, r: 0.9, h: 5.2, density: 0.04 }, // tall trunk
  { cx: -3.5, cz:  7.0, r: 1.8, h: 2.2, density: 0.07 },
  { cx:  8.5, cz: -6.0, r: 1.0, h: 4.0, density: 0.04 },
  { cx: -9.0, cz:  2.0, r: 1.3, h: 3.0, density: 0.05 },
];

// ─── Generator ───────────────────────────────────────────────────────────────
export function generateTerrain(count: number): {
  positions:     Float32Array;
  colors:        Float32Array;
  scanPositions: Float32Array; // secondary thin ring for scan animation
} {
  const positions = new Float32Array(count * 3);
  const colors    = new Float32Array(count * 3);

  let minY = Infinity, maxY = -Infinity;
  const raw: [number, number, number][] = [];

  // ── Canopy scatter layer (above terrain) ──────────────────────────────────
  const canopyCount = Math.floor(count * 0.08);
  for (let i = 0; i < canopyCount; i++) {
    const x = (Math.random()-0.5)*28;
    const z = (Math.random()-0.5)*28;
    const baseH = fbm(x*0.18+1.7, z*0.18+3.1)*3.5;
    const y = baseH + 4.5 + Math.random()*2.5 + (Math.random()-0.5)*0.6;
    raw.push([x,y,z]);
    if (y<minY) minY=y; if (y>maxY) maxY=y;
  }

  // ── Dense ground + terrain ────────────────────────────────────────────────
  const groundCount = Math.floor(count * 0.62);
  for (let i = 0; i < groundCount; i++) {
    const x = (Math.random()-0.5)*30;
    const z = (Math.random()-0.5)*30;
    const h = fbm(x*0.18+0.3, z*0.18+0.7);
    const ridge  = fbm(x*0.35+5.1, z*0.35+2.9)*0.8;
    const detail = fbm(x*1.4+11,   z*1.4+7  )*0.15;
    const y = h*3.2 + ridge + detail - 0.4 + (Math.random()-0.5)*0.08;
    raw.push([x,y,z]);
    if (y<minY) minY=y; if (y>maxY) maxY=y;
  }

  // ── Feature clusters ──────────────────────────────────────────────────────
  const featureCount = Math.floor(count * 0.22);
  for (let i = 0; i < featureCount; i++) {
    const f = FEATURES[Math.floor(Math.random()*FEATURES.length)];
    const angle = Math.random()*Math.PI*2;
    const dist  = Math.random()*f.r;
    const x = f.cx + Math.cos(angle)*dist;
    const z = f.cz + Math.sin(angle)*dist;
    const baseH = fbm(x*0.18+0.3, z*0.18+0.7)*3.2 - 0.4;
    const y = baseH + Math.random()*f.h;
    raw.push([x,y,z]);
    if (y<minY) minY=y; if (y>maxY) maxY=y;
  }

  // ── Road / path channel (low flat strip) ─────────────────────────────────
  const pathCount = Math.floor(count * 0.08);
  for (let i = 0; i < pathCount; i++) {
    const t  = (Math.random()-0.5)*28;
    const ox = (Math.random()-0.5)*1.8;
    const x  = Math.sin(t*0.18)*4 + ox;  // gentle curve
    const z  = t;
    const y  = fbm(x*0.18+0.3, z*0.18+0.7)*0.4 - 0.35 + (Math.random()-0.5)*0.05;
    raw.push([x,y,z]);
    if (y<minY) minY=y; if (y>maxY) maxY=y;
  }

  // ── Sort by X for left→right LiDAR sweep ─────────────────────────────────
  raw.sort((a,b) => a[0]-b[0]);

  const range = maxY - minY || 1;
  for (let i=0; i<raw.length && i<count; i++) {
    const [x,y,z] = raw[i];
    positions[i*3]=x; positions[i*3+1]=y; positions[i*3+2]=z;
    const col = heightToColor(Math.max(0,Math.min(1,(y-minY)/range)));
    colors[i*3]=col.r; colors[i*3+1]=col.g; colors[i*3+2]=col.b;
  }

  // ── Scan ring (thin horizontal slice for the sweep plane visual) ──────────
  const SCAN_PTS = 1800;
  const scanPositions = new Float32Array(SCAN_PTS*3);
  for (let i=0; i<SCAN_PTS; i++) {
    const angle = (i/SCAN_PTS)*Math.PI*2;
    const r     = 14 + Math.sin(angle*7)*0.4;
    scanPositions[i*3]   = Math.cos(angle)*r;
    scanPositions[i*3+1] = 0;
    scanPositions[i*3+2] = Math.sin(angle)*r;
  }

  return { positions, colors, scanPositions };
}

export function usePointCloud(count: number) {
  return useMemo(() => generateTerrain(count), [count]);
}