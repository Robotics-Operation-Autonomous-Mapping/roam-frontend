"use client";

import { useEffect, type MutableRefObject, type RefObject } from "react";
import type { useAnimation } from "framer-motion";
import {
  Star,
  Dust,
  buildTerrain,
  getTerrainY,
  drawTerrain,
  drawRover,
} from "../marsHeroHelpers";

type MarsHeroUiControls = ReturnType<typeof useAnimation>;

export interface UseMarsHeroCanvasArgs {
  canvasRef: RefObject<HTMLCanvasElement | null>;
  wrapRef: RefObject<HTMLDivElement | null>;
  rafRef: MutableRefObject<number>;
  mouseRef: MutableRefObject<{ x: number; y: number }>;
  arrivedRef: MutableRefObject<boolean>;
  uiControls: MarsHeroUiControls;
  onRoverArrived?: () => void;
}

export function useMarsHeroCanvas({
  canvasRef,
  wrapRef,
  rafRef,
  mouseRef,
  arrivedRef,
  uiControls,
  onRoverArrived,
}: UseMarsHeroCanvasArgs): void {
  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const isMobile = window.innerWidth < 768;

    const primaryColor =
      getComputedStyle(document.documentElement)
        .getPropertyValue("--color-primary")
        .trim() || "#E8512A";

    const stars: Star[] = Array.from({ length: isMobile ? 120 : 280 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.65,
      r: Math.random() * 1.1 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.014 + 0.004,
    }));

    const terrainRes = isMobile ? 80 : 200;
    const ridge1 = buildTerrain(1.1, terrainRes, 0.7, 0.2);
    const ridge2 = buildTerrain(2.7, terrainRes, 0.79, 0.13);
    const ridge3 = buildTerrain(5.3, terrainRes, 0.87, 0.08);

    const dust: Dust[] = Array.from({ length: isMobile ? 40 : 110 }, () => ({
      x: Math.random(),
      y: 0.68 + Math.random() * 0.28,
      r: Math.random() * 2 + 0.4,
      vx: (Math.random() - 0.3) * 0.0007,
      vy: -Math.random() * 0.0003,
      life: Math.random(),
      maxLife: 0.4 + Math.random() * 0.6,
      alpha: Math.random() * 0.3 + 0.05,
    }));

    const rover = { x: -0.04, tx: 0.44, speed: 0.0002 };
    const SCAN_DURATION = 1600;

    const shootingStar = {
      x: -1,
      y: -1,
      length: 0,
      angle: 0,
      speed: 0,
      opacity: 0,
    };

    let W = 0,
      H = 0;
    let scanStart = -1;
    let startTime = -1;
    let lastTime = -1;
    let currentRoverY = -1;
    let uiStarted = false;

    const resize = () => {
      if (!canvasRef.current || !wrap) return;
      W = canvasRef.current.width = wrap.offsetWidth;
      H = canvasRef.current.height = wrap.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    const drawEnvironment = (ctx: CanvasRenderingContext2D, px: number) => {
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.85);
      sky.addColorStop(0, "#08080C");
      sky.addColorStop(0.35, "#12121D");
      sky.addColorStop(0.72, "#2A1810");
      sky.addColorStop(1, "#3D2212");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      for (const s of stars) {
        s.flicker += s.speed;
        const a = 0.35 + Math.sin(s.flicker) * 0.22;
        const parallax = (px / W - 0.5) * s.r * 5;
        ctx.beginPath();
        ctx.arc(s.x * W + parallax, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,236,215,${a})`;
        ctx.fill();
      }

      if (Math.random() < 0.002 && shootingStar.opacity <= 0) {
        shootingStar.x = Math.random() * W;
        shootingStar.y = Math.random() * (H * 0.3);
        shootingStar.length = Math.random() * 80 + 40;
        shootingStar.angle = Math.PI / 4 + (Math.random() * 0.2 - 0.1);
        shootingStar.speed = Math.random() * 15 + 15;
        shootingStar.opacity = 1;
      }

      if (shootingStar.opacity > 0) {
        ctx.save();
        ctx.translate(shootingStar.x, shootingStar.y);
        ctx.rotate(shootingStar.angle);

        const grad = ctx.createLinearGradient(0, 0, -shootingStar.length, 0);
        grad.addColorStop(0, `rgba(255,255,255,${shootingStar.opacity})`);
        grad.addColorStop(1, "transparent");

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-shootingStar.length, 0);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        ctx.restore();

        shootingStar.x += Math.cos(shootingStar.angle) * shootingStar.speed;
        shootingStar.y += Math.sin(shootingStar.angle) * shootingStar.speed;
        shootingStar.opacity -= 0.02;
      }

      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let i = 0; i <= W; i += 4) {
        const nx = i / W;
        let y = 0.62;
        for (let o = 1; o <= 4; o++)
          y += ((Math.sin(nx * o * 7.3 + 2.1) * 0.5 + 0.5) * 0.038) / o;
        ctx.lineTo(i, y * H);
      }
      ctx.lineTo(W, H);
      ctx.fillStyle = "#0c0907";
      ctx.fill();

      drawTerrain(ctx, ridge1, W, H, "#120F0C", "rgba(75,42,20,0.4)");
      drawTerrain(ctx, ridge2, W, H, "#18120D", "rgba(85,47,22,0.35)");
      drawTerrain(ctx, ridge3, W, H, "#221811", "rgba(95,52,24,0.3)");

      ctx.fillStyle = "#251B15";
      ctx.fillRect(0, H * 0.91, W, H * 0.09);
    };

    const drawActors = (
      ctx: CanvasRenderingContext2D,
      px: number,
      t: number,
      dt: number,
    ) => {
      const dt60 = dt * 60;

      const windBias = (px / W - 0.5) * 0.0001;
      for (const d of dust) {
        d.x += (d.vx + windBias) * dt60;
        d.y += d.vy * dt60;
        d.life += 0.003 * dt60;
        if (d.life > d.maxLife || d.x < 0 || d.x > 1) {
          d.x = Math.random();
          d.y = 0.88 + Math.random() * 0.1;
          d.life = 0;
          d.vx = (Math.random() - 0.3) * 0.0007;
        }
        const a = Math.sin((d.life / d.maxLife) * Math.PI) * d.alpha;
        ctx.beginPath();
        ctx.arc(d.x * W, d.y * H, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(155,85,35,${a})`;
        ctx.fill();
      }

      if (t > 0.3 && rover.x < rover.tx) {
        rover.x += rover.speed * dt60;
      } else if (rover.x >= rover.tx && !arrivedRef.current) {
        rover.x = rover.tx;
        arrivedRef.current = true;
        onRoverArrived?.();
      }

      if (rover.x > 0) {
        const targetY = getTerrainY(ridge3, Math.max(0, rover.x)) * H - 3;

        if (currentRoverY < 0) currentRoverY = targetY;

        currentRoverY += (targetY - currentRoverY) * 0.15 * dt60;

        const roverRealY = currentRoverY;
        const roverScale = 0.95 + (Math.max(0, rover.x) / rover.tx) * 0.45;
        const rx = rover.x * W;

        if (rover.x < rover.tx && t > 0.5) {
          for (let di = 0; di < 2; di++) {
            ctx.beginPath();
            ctx.arc(
              rx - 22 - Math.random() * 14,
              roverRealY + 2 + Math.random() * 4,
              Math.random() * 2.2 + 0.4,
              0,
              Math.PI * 2,
            );
            ctx.fillStyle = `rgba(155,80,30,${0.05 + Math.random() * 0.12})`;
            ctx.fill();
          }
        }

        ctx.save();
        const glow = ctx.createRadialGradient(
          rx,
          roverRealY,
          0,
          rx,
          roverRealY,
          40 * roverScale,
        );
        glow.addColorStop(0, `${primaryColor}22`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(rx - 60, roverRealY - 60, 120, 120);
        ctx.restore();

        drawRover(ctx, rx, roverRealY, roverScale, primaryColor, t);
      }
    };

    const drawUIOverlay = (ctx: CanvasRenderingContext2D, scanPct: number) => {
      if (scanPct < 1) {
        const lineY = scanPct * H;
        ctx.beginPath();
        ctx.moveTo(0, lineY);
        ctx.lineTo(W, lineY);
        const lg = ctx.createLinearGradient(0, 0, W, 0);
        lg.addColorStop(0, "transparent");
        lg.addColorStop(0.2, "rgba(232,81,42,0.7)");
        lg.addColorStop(0.8, "rgba(232,81,42,0.7)");
        lg.addColorStop(1, "transparent");
        ctx.strokeStyle = lg;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(232,81,42,0.6)";
        ctx.fillText("SCANNING SURFACE ///", W - 240, lineY - 8);
      }

      const { x: mx, y: my } = mouseRef.current;
      if (mx > 0) {
        const gr = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        gr.addColorStop(0, "rgba(232,81,42,0.04)");
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      }
    };

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (startTime < 0) startTime = now;
      if (scanStart < 0) scanStart = now;
      if (lastTime < 0) lastTime = now;

      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      const t = (now - startTime) / 1000;
      const scanPct = Math.min(1, (now - scanStart) / SCAN_DURATION);

      if (canvasRef.current) {
        canvasRef.current.style.clipPath = `inset(0 0 ${(1 - scanPct) * 100}% 0)`;
      }

      if (scanPct >= 1 && !uiStarted) {
        uiStarted = true;
        uiControls.start("visible");
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || W === 0) return;

      ctx.clearRect(0, 0, W, H);
      const px = mouseRef.current.x;

      drawEnvironment(ctx, px);
      drawActors(ctx, px, t, dt);
      drawUIOverlay(ctx, scanPct);
    };

    rafRef.current = requestAnimationFrame(frame);

    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - r.left, y: e.clientY - r.top };
    };
    const onLeave = () => {
      mouseRef.current = { x: -999, y: -999 };
    };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- refs are stable; same deps as pre-extract MarsHero
  }, [onRoverArrived, uiControls]);
}
