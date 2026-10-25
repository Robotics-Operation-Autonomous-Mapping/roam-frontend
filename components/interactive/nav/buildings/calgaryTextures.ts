import * as THREE from "three";

/**
 * Facade textures for the Calgary landmarks, drawn pixel by pixel in code
 * (no image files to download).
 */

type RGB = [number, number, number];

/** Same "random" number every time for the same input, so facades don't flicker. */
function rand(n: number) {
  const x = Math.sin(n * 127.1) * 43758.5453;
  return x - Math.floor(x);
}

/**
 * Build a texture by asking `pixel(u, v)` for the colour of every pixel.
 * u and v go from 0 to 1 across the texture.
 */
function makeTex(width: number, height: number, pixel: (u: number, v: number) => RGB) {
  const data = new Uint8Array(width * height * 4);
  for (let py = 0; py < height; py++) {
    for (let px = 0; px < width; px++) {
      const [r, g, b] = pixel(px / width, py / height);
      const i = (py * width + px) * 4;
      data[i] = r;
      data[i + 1] = g;
      data[i + 2] = b;
      data[i + 3] = 255;
    }
  }
  const tex = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.needsUpdate = true;
  return tex;
}

// ─── The Bow: blue glass behind a white triangle "diagrid" ───────────────────
// Each tile holds one diamond: lines from corner to corner make the X,
// and a line across the bottom splits it into triangles.
export const TEX_BOW = makeTex(64, 128, (u, v) => {
  const line = 0.035;
  const onDiagonal = Math.abs(u - v) < line || Math.abs(u - (1 - v)) < line;
  const onFloor = v < line * 0.6;
  if (onDiagonal || onFloor) return [235, 240, 244];
  const shade = 95 + v * 45; // glass gets lighter higher up (sky reflection)
  return [shade * 0.6, shade * 0.82, shade * 1.1];
});

// ─── Central Library: white panels with glowing hexagon windows ──────────────
// Splits the texture into a hexagon grid, then randomly makes each hexagon
// either a white panel or a lit window. The texture size is a whole number of
// hexagons across and down, so it repeats without a visible seam.
const HEX = 10; // hexagon size in pixels
const LIB_W = Math.round(Math.sqrt(3) * HEX * 14); // 14 hexagons across
const LIB_H = HEX * 3 * 4; // 8 rows of hexagons down

function hexCell(u: number, v: number) {
  const px = u * LIB_W;
  const py = v * LIB_H;
  // Standard pixel → hexagon conversion (axial coordinates)
  const q = ((Math.sqrt(3) / 3) * px - py / 3) / HEX;
  const r = ((2 / 3) * py) / HEX;
  // Round to the nearest hexagon
  let x = Math.round(q), z = Math.round(r);
  const y = Math.round(-q - r);
  const dx = Math.abs(x - q), dy = Math.abs(y - (-q - r)), dz = Math.abs(z - r);
  if (dx > dy && dx > dz) x = -y - z;
  else if (dy <= dz) z = -x - y;
  // How close to the hexagon's edge this pixel is (for the frame lines)
  const edge = Math.max(dx, dy, dz);
  // Wrap the ids round so hexagons on opposite edges match up
  const id = (((x + Math.floor(z / 2)) % 14) + 14) % 14 + ((((z % 8) + 8) % 8) * 14);
  return { id, edge };
}

function libraryIsWindow(u: number, v: number) {
  const { id, edge } = hexCell(u, v);
  return { lit: rand(id) < 0.45, frame: edge > 0.42 };
}

export const TEX_LIBRARY = makeTex(LIB_W, LIB_H, (u, v) => {
  const { lit, frame } = libraryIsWindow(u, v);
  if (frame) return [205, 208, 210];
  return lit ? [255, 205, 120] : [232, 233, 230];
});

/** Same pattern, but only the lit windows are bright: used to make them glow. */
export const TEX_LIBRARY_GLOW = makeTex(LIB_W, LIB_H, (u, v) => {
  const { lit, frame } = libraryIsWindow(u, v);
  return lit && !frame ? [255, 190, 100] : [0, 0, 0];
});

// ─── BMO Centre: copper panels in horizontal bands ───────────────────────────
export const TEX_BMO = makeTex(128, 128, (u, v) => {
  const band = Math.floor(v * 10);
  const gap = (v * 10) % 1 < 0.08;
  if (gap) return [70, 32, 24];
  // Each panel in a band gets a slightly different tone
  const panel = Math.floor(u * 6 + band * 0.5);
  const t = 0.85 + rand(panel * 13 + band) * 0.3;
  return [150 * t, 72 * t, 52 * t];
});

// ─── Downtown office towers: dark glass, some windows lit ────────────────────
function officeLit(u: number, v: number) {
  const col = Math.floor(u * 8);
  const row = Math.floor(v * 16);
  const frame = (u * 8) % 1 < 0.12 || (v * 16) % 1 < 0.15;
  return { lit: !frame && rand(col * 7 + row * 131) < 0.22, frame };
}

export const TEX_OFFICE = makeTex(128, 128, (u, v) => {
  const { lit, frame } = officeLit(u, v);
  if (frame) return [62, 58, 54];
  return lit ? [235, 185, 115] : [30, 38, 50];
});

export const TEX_OFFICE_GLOW = makeTex(128, 128, (u, v) => {
  const { lit } = officeLit(u, v);
  return lit ? [200, 140, 70] : [0, 0, 0];
});
