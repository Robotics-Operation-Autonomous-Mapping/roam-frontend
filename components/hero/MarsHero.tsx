"use client";

import React, { useEffect, useRef} from "react";
import { motion, useAnimation, Variants } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { SectionLabel} from "@/components/ui/SectionLabel";

// ─── Types ─────────────────────────────────────────────────────────────────────

interface Star   { x:number; y:number; r:number; flicker:number; speed:number }
interface Dust   { x:number; y:number; r:number; vx:number; vy:number; life:number; maxLife:number; alpha:number }
interface TerrainPt { x:number; y:number }

// ─── Terrain generator ────────────────────────────────────────────────────────

function buildTerrain(seed:number, pts:number, yBase:number, rough:number): TerrainPt[] {
  const rng = (s:number) => { const x = Math.sin(s*9301+49297)*233280; return x - Math.floor(x); };
  const out: TerrainPt[] = [{x:0, y:yBase}];
  for (let i=0;i<=pts;i++) {
    const nx = i/pts;
    let y = yBase;
    for (let o=1;o<=5;o++) y += (rng(nx*o*3.7+seed)-0.5)*rough/o;
    out.push({x:nx, y:Math.max(0.52,Math.min(0.94,y))});
  }
  out.push({x:1, y:yBase});
  return out;
}

function terrainY(pts:TerrainPt[], nx:number): number {
  for (let i=0;i<pts.length-1;i++) {
    if (nx >= pts[i].x && nx <= pts[i+1].x) {
      const t = (nx-pts[i].x)/(pts[i+1].x-pts[i].x);
      return pts[i].y+(pts[i+1].y-pts[i].y)*t;
    }
  }
  return 0.88;
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────

function drawTerrain(ctx:CanvasRenderingContext2D, pts:TerrainPt[], W:number, H:number, fill:string, stroke?:string) {
  ctx.beginPath();
  ctx.moveTo(0,H);
  for (const p of pts) ctx.lineTo(p.x*W, p.y*H);
  ctx.lineTo(W,H);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.beginPath();
    for (let i=0;i<pts.length;i++) {
      if (i===0) ctx.moveTo(pts[i].x*W, pts[i].y*H);
      else ctx.lineTo(pts[i].x*W, pts[i].y*H);
    }
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 0.7;
    ctx.stroke();
  }
}

function drawRover(ctx:CanvasRenderingContext2D, rx:number, ry:number, scale:number) {
  const s = scale;
  ctx.save();
  ctx.translate(rx, ry);

  // Shadow
  ctx.beginPath();
  ctx.ellipse(0, 4*s, 18*s, 4*s, 0, 0, Math.PI*2);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.fill();

  // Wheels
  for (const wx of [-14*s, -7*s, 7*s, 14*s]) {
    ctx.beginPath();
    ctx.ellipse(wx, 2*s, 3.5*s, 4.5*s, 0, 0, Math.PI*2);
    ctx.fillStyle = "#1a1a1c";
    ctx.strokeStyle = "#3a3a3a";
    ctx.lineWidth = 0.6;
    ctx.fill(); ctx.stroke();
    for (let a=0;a<4;a++) {
      const ang = a*Math.PI/2;
      ctx.beginPath();
      ctx.moveTo(wx, 2*s);
      ctx.lineTo(wx+Math.cos(ang)*3*s, 2*s+Math.sin(ang)*3.8*s);
      ctx.strokeStyle = "rgba(80,80,80,0.5)";
      ctx.lineWidth = 0.4;
      ctx.stroke();
    }
  }

  // Chassis
  ctx.beginPath(); ctx.rect(-16*s,-9*s,32*s,10*s);
  ctx.fillStyle="#28201a"; ctx.strokeStyle="#444"; ctx.lineWidth=0.7;
  ctx.fill(); ctx.stroke();

  // Body
  ctx.beginPath(); ctx.rect(-10*s,-18*s,20*s,10*s);
  ctx.fillStyle="#1c1510"; ctx.strokeStyle="#E8512A"; ctx.lineWidth=0.8;
  ctx.fill(); ctx.stroke();

  // Solar panels
  for (const [px,pw] of [[-22*s,10*s],[12*s,10*s]] as [number,number][]) {
    ctx.beginPath(); ctx.rect(px,-17*s,pw,6*s);
    ctx.fillStyle="#0c1828"; ctx.strokeStyle="#1a3a5c"; ctx.lineWidth=0.5;
    ctx.fill(); ctx.stroke();
    for (let gi=0;gi<3;gi++) {
      ctx.beginPath();
      ctx.moveTo(px+gi*(pw/3),-17*s); ctx.lineTo(px+gi*(pw/3),-11*s);
      ctx.strokeStyle="rgba(26,90,140,0.4)"; ctx.lineWidth=0.4; ctx.stroke();
    }
  }

  // Mast
  ctx.beginPath(); ctx.rect(-1.5*s,-28*s,3*s,11*s);
  ctx.fillStyle="#2e2e2e"; ctx.strokeStyle="#555"; ctx.lineWidth=0.5;
  ctx.fill(); ctx.stroke();

  // Camera head
  ctx.beginPath(); ctx.rect(-4*s,-32*s,8*s,5*s);
  ctx.fillStyle="#111"; ctx.strokeStyle="#E8512A"; ctx.lineWidth=0.7;
  ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.arc(0,-30*s,1.8*s,0,Math.PI*2);
  ctx.fillStyle="#E8512A"; ctx.fill();

  // Antenna
  ctx.beginPath(); ctx.moveTo(6*s,-18*s); ctx.lineTo(11*s,-27*s);
  ctx.strokeStyle="#666"; ctx.lineWidth=0.7; ctx.stroke();
  ctx.beginPath(); ctx.arc(11*s,-27*s,2*s,0,Math.PI*2);
  ctx.fillStyle="#444"; ctx.fill();

  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export interface MarsHeroProps {
  /** Called when rover finishes driving in — triggers GSAP scroll assembly */
  onRoverArrived?: () => void;
}

export const MarsHero: React.FC<MarsHeroProps> = ({ onRoverArrived }) => {
  const canvasRef   = useRef<HTMLCanvasElement>(null);
  const wrapRef     = useRef<HTMLDivElement>(null);
  const rafRef      = useRef<number>(0);
  const mouseRef    = useRef({ x: -999, y: -999 });
  const arrivedRef  = useRef(false);
  const uiControls  = useAnimation();



  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    // ── Static scene data (created once) ──────────────────────────────────
    const stars: Star[] = Array.from({length:280}, () => ({
      x: Math.random(), y: Math.random()*0.65,
      r: Math.random()*1.1+0.2,
      flicker: Math.random()*Math.PI*2,
      speed: Math.random()*0.014+0.004,
    }));

    const ridge1 = buildTerrain(1.1, 200, 0.70, 0.20);
    const ridge2 = buildTerrain(2.7, 160, 0.79, 0.13);
    const ridge3 = buildTerrain(5.3, 120, 0.87, 0.08);

    const dust: Dust[] = Array.from({length:110}, () => ({
      x: Math.random(), y: 0.68+Math.random()*0.28,
      r: Math.random()*2+0.4,
      vx: (Math.random()-0.3)*0.0007,
      vy: -Math.random()*0.0003,
      life: Math.random(), maxLife: 0.4+Math.random()*0.6,
      alpha: Math.random()*0.3+0.05,
    }));

    const rover = { x: -0.04, tx: 0.44, speed: 0.00016 };

    let W = 0, H = 0;
    const resize = () => {
      if (!canvasRef.current || !wrap) return;
      W = canvasRef.current.width  = wrap.offsetWidth;
      H = canvasRef.current.height = wrap.offsetHeight;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ── Scanline wipe: reveal via clip-path ───────────────────────────────
    // We animate a CSS variable --scan-y from 0→100vh over 1.6s
    let scanStart = -1;
    const SCAN_DURATION = 1600;

    // ── Main render loop ──────────────────────────────────────────────────
    let startTime = -1;
    let uiStarted = false;

    const frame = (now: number) => {
      rafRef.current = requestAnimationFrame(frame);
      if (startTime < 0) startTime = now;
      const t = (now - startTime) / 1000;

      // Scanline wipe progress drives clip-path on the canvas wrapper
      if (scanStart < 0) scanStart = now;
      const scanPct = Math.min(1, (now - scanStart) / SCAN_DURATION);
      if (canvasRef.current) {
        canvasRef.current.style.clipPath = `inset(0 0 ${(1 - scanPct) * 100}% 0)`;
      }

      // Kick UI text in once scan is done
      if (scanPct >= 1 && !uiStarted) {
        uiStarted = true;
        uiControls.start("visible");
      }

      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx || W===0) return;

      ctx.clearRect(0,0,W,H);

      // ── Sky ──────────────────────────────────────────────────────────────
      const sky = ctx.createLinearGradient(0,0,0,H*0.85);
      sky.addColorStop(0,   "#030305");
      sky.addColorStop(0.35,"#07070f");
      sky.addColorStop(0.72,"#110c07");
      sky.addColorStop(1,   "#261508");
      ctx.fillStyle = sky;
      ctx.fillRect(0,0,W,H);

      // ── Stars ────────────────────────────────────────────────────────────
      const px = mouseRef.current.x;
      for (const s of stars) {
        s.flicker += s.speed;
        const a = 0.25+Math.sin(s.flicker)*0.18;
        const parallax = ((px/W)-0.5)*s.r*5;
        ctx.beginPath();
        ctx.arc(s.x*W+parallax, s.y*H, s.r, 0, Math.PI*2);
        ctx.fillStyle = `rgba(215,205,195,${a})`;
        ctx.fill();
      }

      // ── Distant silhouette peaks ─────────────────────────────────────────
      ctx.beginPath();
      ctx.moveTo(0,H);
      for (let i=0;i<=W;i+=4) {
        const nx = i/W;
        let y = 0.62;
        for (let o=1;o<=4;o++) y+=(Math.sin(nx*o*7.3+2.1)*0.5+0.5)*0.038/o;
        ctx.lineTo(i,y*H);
      }
      ctx.lineTo(W,H);
      ctx.fillStyle = "#0c0907";
      ctx.fill();

      // Horizon glow
      const hg = ctx.createLinearGradient(0,H*0.60,0,H*0.75);
      hg.addColorStop(0,"transparent");
      hg.addColorStop(0.5,"rgba(55,25,8,0.22)");
      hg.addColorStop(1,"transparent");
      ctx.fillStyle=hg; ctx.fillRect(0,H*0.58,W,H*0.18);

      // ── Terrain layers ───────────────────────────────────────────────────
      drawTerrain(ctx,ridge1,W,H,"#0e0b08","rgba(55,32,14,0.35)");
      drawTerrain(ctx,ridge2,W,H,"#130e0a","rgba(65,37,16,0.28)");
      drawTerrain(ctx,ridge3,W,H,"#1a120c","rgba(75,42,18,0.22)");

      // Ground
      ctx.fillStyle="#1d140f";
      ctx.fillRect(0,H*0.91,W,H*0.09);
      ctx.beginPath();
      ctx.moveTo(0,H*0.912); ctx.lineTo(W,H*0.912);
      ctx.strokeStyle="rgba(75,45,20,0.28)"; ctx.lineWidth=1; ctx.stroke();

      // ── Dust ─────────────────────────────────────────────────────────────
      const windBias = ((px/W)-0.5)*0.00010;
      for (const d of dust) {
        d.x += d.vx + windBias;
        d.y += d.vy;
        d.life += 0.003;
        if (d.life>d.maxLife || d.x<0 || d.x>1) {
          d.x=Math.random(); d.y=0.88+Math.random()*0.1;
          d.life=0; d.vx=(Math.random()-0.3)*0.0007;
        }
        const a = Math.sin((d.life/d.maxLife)*Math.PI)*d.alpha;
        ctx.beginPath();
        ctx.arc(d.x*W, d.y*H, d.r, 0, Math.PI*2);
        ctx.fillStyle=`rgba(155,85,35,${a})`;
        ctx.fill();
      }

      // ── Rover ────────────────────────────────────────────────────────────
      if (t > 0.3 && rover.x < rover.tx) {
        rover.x += rover.speed;
      } else if (rover.x >= rover.tx && !arrivedRef.current) {
        arrivedRef.current = true;
        onRoverArrived?.();
      }

      const gY = terrainY(ridge3, Math.max(0, rover.x));
      const roverRealY = gY*H - 3;
      const roverScale = 0.7 + (Math.max(0,rover.x)/rover.tx)*0.38;

      // Dust trail while moving
      if (rover.x > 0 && rover.x < rover.tx && t > 0.5) {
        for (let di=0;di<3;di++) {
          ctx.beginPath();
          ctx.arc(
            rover.x*W - 22 - Math.random()*14,
            roverRealY + 2 + Math.random()*4,
            Math.random()*2.2+0.4, 0, Math.PI*2
          );
          ctx.fillStyle=`rgba(155,80,30,${0.1+Math.random()*0.18})`;
          ctx.fill();
        }
      }

      if (rover.x > 0) drawRover(ctx, rover.x*W, roverRealY, roverScale);

      // ── Cursor atmosphere ────────────────────────────────────────────────
      const mx2 = mouseRef.current.x, my2 = mouseRef.current.y;
      if (mx2 > 0) {
        const gr = ctx.createRadialGradient(mx2,my2,0,mx2,my2,80);
        gr.addColorStop(0,"rgba(232,81,42,0.05)");
        gr.addColorStop(1,"transparent");
        ctx.fillStyle=gr; ctx.fillRect(0,0,W,H);
      }

      // ── Scanline sweep indicator (visible line during wipe) ───────────────
      if (scanPct < 1) {
        const lineY = scanPct * H;
        ctx.beginPath();
        ctx.moveTo(0, lineY); ctx.lineTo(W, lineY);
        const lg = ctx.createLinearGradient(0,0,W,0);
        lg.addColorStop(0,"transparent");
        lg.addColorStop(0.2,"rgba(232,81,42,0.7)");
        lg.addColorStop(0.8,"rgba(232,81,42,0.7)");
        lg.addColorStop(1,"transparent");
        ctx.strokeStyle=lg; ctx.lineWidth=1.5; ctx.stroke();

        // Scan label
        ctx.font = "9px 'JetBrains Mono', monospace";
        ctx.fillStyle = "rgba(232,81,42,0.6)";
        ctx.letterSpacing = "0.2em";
        ctx.fillText("SCANNING SURFACE ///", W-240, lineY - 8);
      }
    };

    rafRef.current = requestAnimationFrame(frame);

    // ── Mouse ──────────────────────────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      const r = wrap.getBoundingClientRect();
      mouseRef.current = { x: e.clientX-r.left, y: e.clientY-r.top };
    };
    const onLeave = () => { mouseRef.current = { x:-999, y:-999 }; };
    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      ro.disconnect();
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
    };
  }, [onRoverArrived, uiControls]);

  // ── UI text variants ───────────────────────────────────────────────────────
  const container: Variants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };
  const item: Variants = {
    hidden:  { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] as const } },
  };

  return (
    <div
      ref={wrapRef}
      className="relative w-full min-h-screen overflow-hidden bg-[#0A0A0B]"
      style={{ cursor: "none" }}
    >
      {/* ── Canvas world ── */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ clipPath: "inset(0 0 100% 0)" }}
      />

      {/* ── HUD corners ── */}
      <div className="absolute top-7 left-[72px] font-mono text-[9px] tracking-[0.22em] text-white/20 leading-[1.9] uppercase pointer-events-none z-10">
        ROAM / AUT-SYS-004<br />
        Schulich Engineering · UofA<br />
        Status: Operational
      </div>
      <div className="absolute top-7 right-[48px] font-mono text-[9px] tracking-[0.22em] text-white/20 leading-[1.9] text-right uppercase pointer-events-none z-10">
        53.5461° N 113.4938° W<br />
        Alt: 645M · Edmonton, AB<br />
        Mission cycle: Active
      </div>

      {/* ── UI overlay ── */}
      <div className="absolute inset-0 z-10 flex items-end pointer-events-none">
        <div className="max-w-7xl mx-auto w-full px-6 pb-20">
          <motion.div
            variants={container}
            initial="hidden"
            animate={uiControls}
            className="flex flex-col items-start"
          >
            <motion.div variants={item}>
              <SectionLabel className="mb-5">Autonomous Systems Club</SectionLabel>
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
                  WebkitTextStroke: "1px rgba(240,235,224,0.2)",
                  color: "transparent",
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

      {/* Scroll hint removed */}

      {/* ── Vignette ── */}
      <div
        className="absolute inset-0 pointer-events-none z-[5]"
        style={{
          background: "radial-gradient(ellipse at 50% 60%, transparent 35%, rgba(10,10,11,0.75) 100%)",
        }}
      />
    </div>
  );
};

export default MarsHero;