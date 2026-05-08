"use client";

import React, { useRef, useEffect } from "react";

const DEFECTS = [
  { x: 0.22, y: 0.38, r: 6, sev: "HIGH" },
  { x: 0.55, y: 0.61, r: 4, sev: "MED" },
  { x: 0.71, y: 0.28, r: 5, sev: "HIGH" },
  { x: 0.38, y: 0.72, r: 3, sev: "LOW" },
  { x: 0.84, y: 0.52, r: 4, sev: "MED" },
];

export const InfraCanvas: React.FC<{ active: boolean }> = ({ active }) => {
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
    let scanY = 0;
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

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const targetActive = activeRef.current ? 1 : 0;
      smoothActiveRef.current += (targetActive - smoothActiveRef.current) * 0.06;
      const sa = smoothActiveRef.current;

      t += 0.012;
      if (sa > 0.01) {
        scanY = (scanY + 0.4 + sa * 1.0) % H;
      }

      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = "#020d1a";
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(40,120,200,0.18)";
      ctx.lineWidth = 0.5;
      const GRID = 18;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      ctx.strokeStyle = "rgba(80,160,255,0.5)";
      ctx.lineWidth = 1.5;
      const structs = [
        [0.05, 0.7, 0.95, 0.7], [0.05, 0.3, 0.95, 0.3],
        [0.05, 0.3, 0.05, 0.7], [0.25, 0.3, 0.25, 0.7],
        [0.5, 0.3, 0.5, 0.7],   [0.75, 0.3, 0.75, 0.7],
        [0.95, 0.3, 0.95, 0.7],
        [0.05, 0.7, 0.25, 0.3], [0.25, 0.7, 0.5, 0.3],
        [0.5, 0.7, 0.75, 0.3],  [0.75, 0.7, 0.95, 0.3],
      ];
      structs.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1 * W, y1 * H);
        ctx.lineTo(x2 * W, y2 * H);
        ctx.stroke();
      });

      DEFECTS.forEach((d) => {
        const px = d.x * W;
        const py = d.y * H;
        const revealed = scanY > py || sa < 0.1;
        if (!revealed) return;

        const pulse = 0.6 + Math.sin(t * 3 + d.x * 10) * 0.4;
        const color = d.sev === "HIGH" ? `rgba(255,60,40,${pulse})` :
                      d.sev === "MED"  ? `rgba(255,160,0,${pulse})` :
                                         `rgba(255,230,0,${pulse * 0.7})`;
        ctx.beginPath();
        ctx.arc(px, py, d.r + 2 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.25)");
        ctx.fill();
        ctx.font = "7px monospace";
        ctx.fillStyle = color;
        ctx.fillText(d.sev, px + d.r + 3, py - 2);
      });

      if (sa > 0.01) {
        const sg = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 4);
        sg.addColorStop(0, `rgba(0,180,255,0)`);
        sg.addColorStop(0.6, `rgba(0,180,255,${sa * 0.12})`);
        sg.addColorStop(1, `rgba(0,180,255,${sa * 0.6})`);
        ctx.fillStyle = sg;
        ctx.fillRect(0, scanY - 30, W, 34);
        ctx.strokeStyle = `rgba(0,220,255,${sa * 0.8})`;
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();
        ctx.setLineDash([]);
        const detected = DEFECTS.filter((d) => d.y * H <= scanY).length;
        ctx.font = "8px monospace";
        ctx.fillStyle = `rgba(0,220,255,${sa * 0.85})`;
        ctx.fillText(`DEFECTS: ${detected}/${DEFECTS.length}`, 6, scanY - 4);
        ctx.fillText(`SCAN: ${((scanY / H) * 100).toFixed(0)}%`, W - 68, scanY - 4);
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
