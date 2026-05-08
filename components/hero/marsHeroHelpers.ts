/**
 * MarsHero Utility functions and drawing helpers
 */

export interface Star {
  x: number;
  y: number;
  r: number;
  flicker: number;
  speed: number;
}

export interface Dust {
  x: number;
  y: number;
  r: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  alpha: number;
}

export interface TerrainPt {
  x: number;
  y: number;
}

/**
 * Procedural terrain generator
 */
export function buildTerrain(
  seed: number,
  pts: number,
  yBase: number,
  rough: number
): TerrainPt[] {
  const rng = (s: number) => {
    const x = Math.sin(s * 9301 + 49297) * 233280;
    return x - Math.floor(x);
  };
  const out: TerrainPt[] = [{ x: 0, y: yBase }];
  for (let i = 0; i <= pts; i++) {
    const nx = i / pts;
    let y = yBase;
    for (let o = 1; o <= 5; o++) y += (rng(nx * o * 3.7 + seed) - 0.5) * rough / o;
    out.push({ x: nx, y: Math.max(0.52, Math.min(0.94, y)) });
  }
  out.push({ x: 1, y: yBase });
  return out;
}

/**
 * Get Y coordinate at X on terrain
 */
export function getTerrainY(pts: TerrainPt[], nx: number): number {
  for (let i = 0; i < pts.length - 1; i++) {
    if (nx >= pts[i].x && nx <= pts[i + 1].x) {
      const t = (nx - pts[i].x) / (pts[i + 1].x - pts[i].x);
      return pts[i].y + (pts[i + 1].y - pts[i].y) * t;
    }
  }
  return 0.88;
}

/**
 * Draw terrain layer
 */
export function drawTerrain(
  ctx: CanvasRenderingContext2D,
  pts: TerrainPt[],
  W: number,
  H: number,
  fill: string,
  stroke?: string
) {
  ctx.beginPath();
  ctx.moveTo(0, H);
  for (const p of pts) ctx.lineTo(p.x * W, p.y * H);
  ctx.lineTo(W, H);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.beginPath();
    for (let i = 0; i < pts.length; i++) {
      if (i === 0) ctx.moveTo(pts[i].x * W, pts[i].y * H);
      else ctx.lineTo(pts[i].x * W, pts[i].y * H);
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

/**
 * Draw Rover (ATLAS-1)
 */
export function drawRover(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  scale: number,
  primaryColor: string = "#E8512A"
) {
  const s = scale;
  ctx.save();
  ctx.translate(rx, ry);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, 4 * s, 18 * s, 4 * s, 0, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fill();

  // Wheels
  for (const wx of [-14 * s, -7 * s, 7 * s, 14 * s]) {
    ctx.beginPath();
    ctx.ellipse(wx, 2 * s, 3.5 * s, 4.5 * s, 0, 0, Math.PI * 2);
    ctx.fillStyle = "#1a1a1c";
    ctx.strokeStyle = "#3a3a3a";
    ctx.lineWidth = 0.6;
    ctx.fill();
    ctx.stroke();
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(wx, 2 * s);
      ctx.lineTo(wx + Math.cos(ang) * 3 * s, 2 * s + Math.sin(ang) * 3.8 * s);
      ctx.strokeStyle = "rgba(80,80,80,0.5)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
  }

  // Chassis
  ctx.beginPath();
  ctx.rect(-16 * s, -9 * s, 32 * s, 10 * s);
  ctx.fillStyle = "#28201a";
  ctx.strokeStyle = "#444";
  ctx.lineWidth = 0.7;
  ctx.fill();
  ctx.stroke();

  // Body
  ctx.beginPath();
  ctx.rect(-10 * s, -18 * s, 20 * s, 10 * s);
  ctx.fillStyle = "#1c1510";
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 0.8;
  ctx.fill();
  ctx.stroke();

  // Solar panels
  for (const [px, pw] of [[-22 * s, 10 * s], [12 * s, 10 * s]] as [number, number][]) {
    ctx.beginPath();
    ctx.rect(px, -17 * s, pw, 6 * s);
    ctx.fillStyle = "#0c1828";
    ctx.strokeStyle = "#1a3a5c";
    ctx.lineWidth = 0.5;
    ctx.fill();
    ctx.stroke();
    for (let gi = 0; gi < 3; gi++) {
      ctx.beginPath();
      ctx.moveTo(px + gi * (pw / 3), -17 * s);
      ctx.lineTo(px + gi * (pw / 3), -11 * s);
      ctx.strokeStyle = "rgba(26,90,140,0.4)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
  }

  // Mast
  ctx.beginPath();
  ctx.rect(-1.5 * s, -28 * s, 3 * s, 11 * s);
  ctx.fillStyle = "#2e2e2e";
  ctx.strokeStyle = "#555";
  ctx.lineWidth = 0.5;
  ctx.fill();
  ctx.stroke();

  // Camera head
  ctx.beginPath();
  ctx.rect(-4 * s, -32 * s, 8 * s, 5 * s);
  ctx.fillStyle = "#111";
  ctx.strokeStyle = primaryColor;
  ctx.lineWidth = 0.7;
  ctx.fill();
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, -30 * s, 1.8 * s, 0, Math.PI * 2);
  ctx.fillStyle = primaryColor;
  ctx.fill();

  // Antenna
  ctx.beginPath();
  ctx.moveTo(6 * s, -18 * s);
  ctx.lineTo(11 * s, -27 * s);
  ctx.strokeStyle = "#666";
  ctx.lineWidth = 0.7;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(11 * s, -27 * s, 2 * s, 0, Math.PI * 2);
  ctx.fillStyle = "#444";
  ctx.fill();

  ctx.restore();
}
