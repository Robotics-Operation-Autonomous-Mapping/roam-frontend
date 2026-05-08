"use client";

import React, { useRef, useEffect } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; type: "co2" | "o2" | "pollen" };

export const EnvCanvas: React.FC<{ active: boolean }> = ({ active }) => {
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

    let particles: Particle[] = [];
    let dispCo2 = 12;
    let dispO2 = 12;
    let currentWind = 0.12;

    const spawn = () => {
      const types = ["co2", "o2", "pollen"] as const;
      const type = types[Math.floor(Math.random() * 3)];
      particles.push({
        x: Math.random() * W,
        y: H + 5,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -(0.4 + Math.random() * 0.8),
        life: 0,
        maxLife: 160 + Math.random() * 120,
        type,
      });
    };
    for (let i = 0; i < 35; i++) {
      spawn();
      particles[i].y = Math.random() * H;
      particles[i].life = Math.random() * particles[i].maxLife;
    }

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const targetActive = activeRef.current ? 1 : 0;
      smoothActiveRef.current += (targetActive - smoothActiveRef.current) * 0.06;
      const sa = smoothActiveRef.current;

      t += 0.01;
      const targetWind = 0.12 + sa * 0.23;
      currentWind += (targetWind - currentWind) * 0.05;

      const atmo = ctx.createLinearGradient(0, 0, 0, H);
      atmo.addColorStop(0, "#000a08");
      atmo.addColorStop(0.4, "#011a10");
      atmo.addColorStop(1, "#001408");
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = "#021a0a";
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 8) {
        const treeH = 18 + Math.sin(x * 0.08 + t * 0.05) * 8 + Math.sin(x * 0.22) * 5;
        ctx.lineTo(x, H - treeH);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = `rgba(0,200,100,0.07)`;
      ctx.lineWidth = 0.5;
      for (let y = 0; y < H; y += 14) {
        const waveY = y + Math.sin(t * 0.8 + y * 0.04) * 3;
        ctx.beginPath();
        ctx.moveTo(0, waveY);
        for (let x = 0; x < W; x += 12) {
          const deflect = Math.sin(t * 1.2 + x * 0.03 + y * 0.05) * 4 * currentWind;
          ctx.lineTo(x, waveY + deflect);
        }
        ctx.stroke();
      }

      if (Math.random() < (0.12 + sa * 0.23)) spawn();

      particles = particles.filter((p) => p.life < p.maxLife);
      particles.forEach((p) => {
        p.life += 1;
        const wind = Math.sin(t * 0.9 + p.y * 0.02) * currentWind;
        p.x += p.vx + wind;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;

        const alpha = Math.min(p.life / 20, 1) * Math.min((p.maxLife - p.life) / 20, 1);
        const r = p.type === "co2" ? 2.5 : p.type === "o2" ? 2 : 3;
        const color = p.type === "co2" ? `rgba(255,80,40,${alpha * 0.8})` :
                      p.type === "o2"  ? `rgba(60,220,140,${alpha * 0.9})` :
                                         `rgba(220,200,60,${alpha * 0.6})`;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();

        if (p.life === 30 && Math.random() < 0.4) {
          ctx.font = "7px monospace";
          ctx.fillStyle = color;
          ctx.fillText(p.type.toUpperCase(), p.x + 4, p.y - 2);
        }
      });

      const co2Count = particles.filter((p) => p.type === "co2").length;
      const o2Count  = particles.filter((p) => p.type === "o2").length;
      dispCo2 += (co2Count - dispCo2) * 0.08;
      dispO2 += (o2Count - dispO2) * 0.08;

      const ppm = (412 + dispCo2 * 0.4 + Math.sin(t) * 1.2).toFixed(1);
      const temp = (18.4 + Math.sin(t * 0.3) * 0.8).toFixed(1);

      ctx.font = "8px monospace";
      [
        { label: `CO₂ ${ppm}ppm`, color: "rgba(255,80,40,0.8)",   y: 12 },
        { label: `O₂  ${((dispO2 / 40) * 20.9).toFixed(1)}%`, color: "rgba(60,220,140,0.8)", y: 24 },
        { label: `TMP ${temp}°C`, color: "rgba(220,200,60,0.7)",  y: 36 },
        { label: `WND ${(currentWind * 28).toFixed(1)}km/h`, color: "rgba(100,180,255,0.7)", y: 48 },
      ].forEach(({ label, color, y }) => {
        ctx.fillStyle = color;
        ctx.fillText(label, 6, y);
      });
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
