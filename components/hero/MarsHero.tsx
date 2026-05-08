"use client";

import React, { useEffect, useRef } from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel } from "@/components/ui/SectionLabel";
import {
  Star,
  Dust,
  buildTerrain,
  getTerrainY,
  drawTerrain,
  drawRover,
} from "./marsHeroHelpers";

// ─── Sub-Components ───────────────────────────────────────────────────────────

const HUD = () => (
  <>
    <div className="absolute top-7 left-[72px] font-mono text-[9px] tracking-[0.22em] text-white/20 leading-[1.9] uppercase pointer-events-none z-10">
      ROAM / ATLAS-1<br />
      Engineering · UofA<br />
      Status: Operational
    </div>
    <div className="absolute top-7 right-[48px] font-mono text-[9px] tracking-[0.22em] text-white/20 leading-[1.9] text-right uppercase pointer-events-none z-10">
      53.5461° N 113.4938° W<br />
      Alt: 645M · Edmonton, AB<br />
      Mission cycle: Active
    </div>
  </>
);

const HeroContent = ({ controls }: { controls: ReturnType<typeof useAnimation> }) => {
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
      <div className="max-w-7xl mx-auto w-full px-6 pb-20">
        <motion.div
          variants={container}
          initial="hidden"
          animate={controls}
          className="flex flex-col items-start"
        >
          <motion.div variants={item}>
            <SectionLabel className="mb-5">Robotics Operation & Autonomous Mapping</SectionLabel>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-display text-[clamp(4rem,11vw,8.5rem)] leading-[0.86] tracking-tight text-cream mb-7"
          >
            EXPLORE.<br />
            <span className="text-primary">UNDERSTAND.</span><br />
            <span
              className="text-cream"
              style={{
                WebkitTextStroke: "1px rgba(245,236,215,0.25)",
                color: "transparent",
                textShadow: "0 0 20px rgba(232,81,42,0.2)", // Subtle Martian glow
              }}
            >
              RECREATE.
            </span>
          </motion.h1>

          <motion.p
            variants={item}
            className="font-mono text-sm text-cream/45 max-w-[420px] leading-[1.85] tracking-wide mb-10"
          >
            We build machines that read the world.<br />
            Student engineers. Serious technology.<br />
            One rover at a time.
          </motion.p>

          <motion.div
            variants={item}
            className="flex flex-col sm:flex-row items-start gap-5 pointer-events-auto"
          >
            <Button href="/join" variant="primary">Apply Now</Button>
            <Button href="/demo" variant="ghost">Explore the Demo</Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export interface MarsHeroProps {
  onRoverArrived?: () => void;
}

export const MarsHero: React.FC<MarsHeroProps> = ({ onRoverArrived }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);
  const mouseRef = useRef({ x: -999, y: -999 });
  const arrivedRef = useRef(false);
  const uiControls = useAnimation();

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // ─── Scene Initialization ─────────────────────────────────────────────────
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--color-primary').trim() || "#E8512A";

    const stars: Star[] = Array.from({ length: 280 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.65,
      r: Math.random() * 1.1 + 0.2,
      flicker: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.014 + 0.004,
    }));

    const ridge1 = buildTerrain(1.1, 200, 0.7, 0.2);
    const ridge2 = buildTerrain(2.7, 160, 0.79, 0.13);
    const ridge3 = buildTerrain(5.3, 120, 0.87, 0.08);

    const dust: Dust[] = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: 0.68 + Math.random() * 0.28,
      r: Math.random() * 2 + 0.4,
      vx: (Math.random() - 0.3) * 0.0007,
      vy: -Math.random() * 0.0003,
      life: Math.random(),
      maxLife: 0.4 + Math.random() * 0.6,
      alpha: Math.random() * 0.3 + 0.05,
    }));

    const rover = { x: -0.04, tx: 0.44, speed: 0.00035 };
    const SCAN_DURATION = 1600;
    
    let W = 0, H = 0;
    let scanStart = -1;
    let startTime = -1;
    let uiStarted = false;

    // ─── Resize Handling ──────────────────────────────────────────────────────
    const resize = () => {
      if (!canvasRef.current || !wrap) return;
      W = canvasRef.current.width = wrap.offsetWidth;
      H = canvasRef.current.height = wrap.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ─── Drawing Functions ────────────────────────────────────────────────────
    
    const drawEnvironment = (ctx: CanvasRenderingContext2D, px: number) => {
      // Sky
      const sky = ctx.createLinearGradient(0, 0, 0, H * 0.85);
      sky.addColorStop(0, "#08080C");
      sky.addColorStop(0.35, "#12121D");
      sky.addColorStop(0.72, "#2A1810");
      sky.addColorStop(1, "#3D2212");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, H);

      // Stars
      for (const s of stars) {
        s.flicker += s.speed;
        const a = 0.35 + Math.sin(s.flicker) * 0.22;
        const parallax = (px / W - 0.5) * s.r * 5;
        ctx.beginPath();
        ctx.arc(s.x * W + parallax, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245,236,215,${a})`;
        ctx.fill();
      }

      // Distant silhouette
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let i = 0; i <= W; i += 4) {
        const nx = i / W;
        let y = 0.62;
        for (let o = 1; o <= 4; o++) y += (Math.sin(nx * o * 7.3 + 2.1) * 0.5 + 0.5) * 0.038 / o;
        ctx.lineTo(i, y * H);
      }
      ctx.lineTo(W, H);
      ctx.fillStyle = "#0c0907";
      ctx.fill();

      // Ridges
      drawTerrain(ctx, ridge1, W, H, "#120F0C", "rgba(75,42,20,0.4)");
      drawTerrain(ctx, ridge2, W, H, "#18120D", "rgba(85,47,22,0.35)");
      drawTerrain(ctx, ridge3, W, H, "#221811", "rgba(95,52,24,0.3)");

      // Ground
      ctx.fillStyle = "#251B15";
      ctx.fillRect(0, H * 0.91, W, H * 0.09);
    };

    const drawActors = (ctx: CanvasRenderingContext2D, px: number, t: number) => {
      // Dust Particles
      const windBias = (px / W - 0.5) * 0.0001;
      for (const d of dust) {
        d.x += d.vx + windBias;
        d.y += d.vy;
        d.life += 0.003;
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

      // Rover Update
      if (t > 0.3 && rover.x < rover.tx) {
        rover.x += rover.speed;
      } else if (rover.x >= rover.tx && !arrivedRef.current) {
        arrivedRef.current = true;
        onRoverArrived?.();
      }

      // Rover Render
      if (rover.x > 0) {
        const gY = getTerrainY(ridge3, Math.max(0, rover.x));
        const roverRealY = gY * H - 3;
        const roverScale = 0.7 + (Math.max(0, rover.x) / rover.tx) * 0.38;
        const rx = rover.x * W;

        // Dust trail
        if (rover.x < rover.tx && t > 0.5) {
          for (let di = 0; di < 2; di++) {
            ctx.beginPath();
            ctx.arc(rx - 22 - Math.random() * 14, roverRealY + 2 + Math.random() * 4, Math.random() * 2.2 + 0.4, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(155,80,30,${0.05 + Math.random() * 0.12})`;
            ctx.fill();
          }
        }

        // Rover Glow
        ctx.save();
        const glow = ctx.createRadialGradient(rx, roverRealY, 0, rx, roverRealY, 40 * roverScale);
        glow.addColorStop(0, `${primaryColor}22`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.fillRect(rx - 60, roverRealY - 60, 120, 120);
        ctx.restore();

        drawRover(ctx, rx, roverRealY, roverScale, primaryColor);
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

      // Mouse Glow
      const { x: mx, y: my } = mouseRef.current;
      if (mx > 0) {
        const gr = ctx.createRadialGradient(mx, my, 0, mx, my, 80);
        gr.addColorStop(0, "rgba(232,81,42,0.04)");
        gr.addColorStop(1, "transparent");
        ctx.fillStyle = gr;
        ctx.fillRect(0, 0, W, H);
      }
    };

    // ─── Animation Loop ───────────────────────────────────────────────────────
    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (startTime < 0) startTime = now;
      if (scanStart < 0) scanStart = now;

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
      drawActors(ctx, px, t);
      drawUIOverlay(ctx, scanPct);
    };

    rafRef.current = requestAnimationFrame(frame);

    // ─── Interaction ──────────────────────────────────────────────────────────
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
  }, [onRoverArrived, uiControls]);

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-screen overflow-hidden bg-bg"
      style={{ cursor: "none" }}
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      />

      <HUD />
      <HeroContent controls={uiControls} />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, transparent 45%, rgba(10,10,11,0.55) 100%)",
        }}
      />
    </div>
  );
};

export default MarsHero;