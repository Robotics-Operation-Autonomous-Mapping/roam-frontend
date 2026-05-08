"use client";

import React, { useRef, useEffect } from "react";

export const TerrainCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);
  const smoothActiveRef = useRef(active ? 1 : 0);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let frameId: number;
    let t = 0;
    let W = 0;
    let H = 0;

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      W = rect.width;
      H = rect.height;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas.parentElement!);
    resize();

    const COLS = 28;
    const ROWS = 18;

    const noise = (x: number, y: number, t: number) =>
      Math.sin(x * 0.4 + t * 0.6) * Math.cos(y * 0.35 + t * 0.4) * 0.5 +
      Math.sin(x * 0.9 + y * 0.6 + t * 0.3) * 0.3 +
      Math.cos(x * 0.2 - y * 0.8 + t * 0.5) * 0.2;

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const targetActive = activeRef.current ? 1 : 0;
      smoothActiveRef.current += (targetActive - smoothActiveRef.current) * 0.06;
      const sa = smoothActiveRef.current;

      t += 0.004 + sa * 0.014;
      ctx.clearRect(0, 0, W, H);

      const cw = W / COLS;
      const ch = H / ROWS;

      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const n = noise(col, row, t);
          const elev = (n + 1) / 2;
          const x = col * cw;
          const y = row * ch;
          const r = Math.round(10 + elev * 20);
          const g = Math.round(30 + elev * 60);
          const b = Math.round(20 + elev * 40);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, cw, ch);
        }
      }

      const THRESHOLDS = [0.25, 0.42, 0.58, 0.72, 0.86];
      THRESHOLDS.forEach((thresh, ti) => {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,140,${0.12 + ti * 0.09})`;
        ctx.lineWidth = ti === 2 ? 1.5 : 0.8;
        for (let row = 0; row < ROWS - 1; row++) {
          for (let col = 0; col < COLS - 1; col++) {
            const n00 = (noise(col, row, t) + 1) / 2;
            const n10 = (noise(col + 1, row, t) + 1) / 2;
            const n01 = (noise(col, row + 1, t) + 1) / 2;
            const x0 = col * cw;
            const y0 = row * ch;
            if ((n00 < thresh) !== (n10 < thresh)) {
              const tx = x0 + (thresh - n00) / (n10 - n00) * cw;
              ctx.moveTo(tx, y0 + ch * 0.5);
              ctx.lineTo(tx, y0 + ch);
            }
            if ((n00 < thresh) !== (n01 < thresh)) {
              const ty = y0 + (thresh - n00) / (n01 - n00) * ch;
              ctx.moveTo(x0 + cw * 0.5, ty);
              ctx.lineTo(x0 + cw, ty);
            }
          }
        }
        ctx.stroke();
      });

      const scanX = ((t * 0.3) % 1) * W;
      const grad = ctx.createLinearGradient(scanX - 20, 0, scanX + 4, 0);
      grad.addColorStop(0, "rgba(0,255,140,0)");
      grad.addColorStop(0.7, "rgba(0,255,140,0.18)");
      grad.addColorStop(1, "rgba(0,255,140,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 20, 0, 24, H);

      ctx.font = "8px monospace";
      ctx.fillStyle = "rgba(0,255,140,0.7)";
      for (let row = 0; row < ROWS; row += 3) {
        const n = noise(scanX / cw, row, t);
        const elev = ((n + 1) / 2 * 812 + 120).toFixed(0);
        ctx.fillText(`${elev}m`, scanX + 5, row * ch + 10);
      }
    };

    frameId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frameId);
      ro.disconnect();
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ display: "block" }} />;
};
