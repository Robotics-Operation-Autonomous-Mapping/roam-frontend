"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, useInView, useMotionValue, useSpring } from "framer-motion";

// ─── Terrain Mapping Canvas ───────────────────────────────────────────────────
const TerrainCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

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

    // Simplex-like noise using sin harmonics
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

      const isActive = activeRef.current;
      t += isActive ? 0.018 : 0.004;
      ctx.clearRect(0, 0, W, H);

      const cw = W / COLS;
      const ch = H / ROWS;

      // Draw elevation grid
      for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
          const n = noise(col, row, t);
          const elev = (n + 1) / 2; // 0..1
          const x = col * cw;
          const y = row * ch;

          // Cell fill — elevation mapped to colour
          const r = Math.round(10 + elev * 20);
          const g = Math.round(30 + elev * 60);
          const b = Math.round(20 + elev * 40);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
          ctx.fillRect(x, y, cw, ch);
        }
      }

      // Contour lines at fixed elevation thresholds
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

      // Scanning beam
      const scanX = ((t * 0.3) % 1) * W;
      const grad = ctx.createLinearGradient(scanX - 20, 0, scanX + 4, 0);
      grad.addColorStop(0, "rgba(0,255,140,0)");
      grad.addColorStop(0.7, "rgba(0,255,140,0.18)");
      grad.addColorStop(1, "rgba(0,255,140,0.55)");
      ctx.fillStyle = grad;
      ctx.fillRect(scanX - 20, 0, 24, H);

      // Data readouts along scan line
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

// ─── Infrastructure Inspection Canvas ────────────────────────────────────────
const InfraCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

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

    // Blueprint grid structure — a stylised bridge cross-section
    const DEFECTS = [
      { x: 0.22, y: 0.38, r: 6, sev: "HIGH" },
      { x: 0.55, y: 0.61, r: 4, sev: "MED" },
      { x: 0.71, y: 0.28, r: 5, sev: "HIGH" },
      { x: 0.38, y: 0.72, r: 3, sev: "LOW" },
      { x: 0.84, y: 0.52, r: 4, sev: "MED" },
    ];

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => { isVisible = entry.isIntersecting; });
    observer.observe(canvas);

    const draw = () => {
      frameId = requestAnimationFrame(draw);
      if (!isVisible) return;

      const isActive = activeRef.current;
      t += 0.012;

      if (isActive) {
        scanY = (scanY + 1.4) % H;
      }

      ctx.clearRect(0, 0, W, H);

      // Blueprint background
      ctx.fillStyle = "#020d1a";
      ctx.fillRect(0, 0, W, H);

      // Blueprint grid
      ctx.strokeStyle = "rgba(40,120,200,0.18)";
      ctx.lineWidth = 0.5;
      const GRID = 18;
      for (let x = 0; x < W; x += GRID) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += GRID) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Structure outline — simplified bridge truss
      ctx.strokeStyle = "rgba(80,160,255,0.5)";
      ctx.lineWidth = 1.5;
      const structs = [
        // bottom chord
        [0.05, 0.7, 0.95, 0.7],
        // top chord
        [0.05, 0.3, 0.95, 0.3],
        // verticals
        [0.05, 0.3, 0.05, 0.7], [0.25, 0.3, 0.25, 0.7],
        [0.5, 0.3, 0.5, 0.7],   [0.75, 0.3, 0.75, 0.7],
        [0.95, 0.3, 0.95, 0.7],
        // diagonals
        [0.05, 0.7, 0.25, 0.3], [0.25, 0.7, 0.5, 0.3],
        [0.5, 0.7, 0.75, 0.3],  [0.75, 0.7, 0.95, 0.3],
      ];
      structs.forEach(([x1, y1, x2, y2]) => {
        ctx.beginPath();
        ctx.moveTo(x1 * W, y1 * H);
        ctx.lineTo(x2 * W, y2 * H);
        ctx.stroke();
      });

      // Defects — pulse with severity colour
      DEFECTS.forEach((d) => {
        const px = d.x * W;
        const py = d.y * H;
        const revealed = scanY > py || !isActive;
        if (!revealed) return;

        const pulse = 0.6 + Math.sin(t * 3 + d.x * 10) * 0.4;
        const color = d.sev === "HIGH" ? `rgba(255,60,40,${pulse})` :
                      d.sev === "MED"  ? `rgba(255,160,0,${pulse})` :
                                         `rgba(255,230,0,${pulse * 0.7})`;
        // Defect ring
        ctx.beginPath();
        ctx.arc(px, py, d.r + 2 + pulse * 2, 0, Math.PI * 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, d.r, 0, Math.PI * 2);
        ctx.fillStyle = color.replace(/[\d.]+\)$/, "0.25)");
        ctx.fill();

        // Label
        ctx.font = "7px monospace";
        ctx.fillStyle = color;
        ctx.fillText(d.sev, px + d.r + 3, py - 2);
      });

      // Scan line
      if (isActive) {
        const sg = ctx.createLinearGradient(0, scanY - 30, 0, scanY + 4);
        sg.addColorStop(0, "rgba(0,180,255,0)");
        sg.addColorStop(0.6, "rgba(0,180,255,0.12)");
        sg.addColorStop(1, "rgba(0,180,255,0.6)");
        ctx.fillStyle = sg;
        ctx.fillRect(0, scanY - 30, W, 34);

        ctx.strokeStyle = "rgba(0,220,255,0.8)";
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 3]);
        ctx.beginPath(); ctx.moveTo(0, scanY); ctx.lineTo(W, scanY); ctx.stroke();
        ctx.setLineDash([]);

        // Readout
        const detected = DEFECTS.filter((d) => d.y * H <= scanY).length;
        ctx.font = "8px monospace";
        ctx.fillStyle = "rgba(0,220,255,0.85)";
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

// ─── Environmental Monitoring Canvas ─────────────────────────────────────────
type Particle = { x: number; y: number; vx: number; vy: number; life: number; maxLife: number; type: "co2" | "o2" | "pollen" };

const EnvCanvas: React.FC<{ active: boolean }> = ({ active }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const activeRef = useRef(active);

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

    // Init particles
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

      const isActive = activeRef.current;
      t += 0.01;

      // Atmosphere gradient layers
      const atmo = ctx.createLinearGradient(0, 0, 0, H);
      atmo.addColorStop(0, "#000a08");
      atmo.addColorStop(0.4, "#011a10");
      atmo.addColorStop(1, "#001408");
      ctx.fillStyle = atmo;
      ctx.fillRect(0, 0, W, H);

      // Ground / forest silhouette
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

      // Wind field visualisation — faint horizontal flow lines
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

      // Spawn new particles
      if (Math.random() < (isActive ? 0.35 : 0.12)) spawn();

      // Update & draw particles
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

        // Label on some particles
        if (p.life === 30 && Math.random() < 0.4) {
          ctx.font = "7px monospace";
          ctx.fillStyle = color;
          ctx.fillText(p.type.toUpperCase(), p.x + 4, p.y - 2);
        }
      });

      // Live readout panel - smoothed so the text doesn't jitter crazily
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



// ─── Domain card ──────────────────────────────────────────────────────────────
const DOMAIN_CONFIG = [
  {
    id: "terrain",
    label: "01",
    title: "TERRAIN MAPPING",
    sub: "Centimeter-level spatial reconstruction",
    status: "ACTIVE SCAN",
    statusColor: "#00FF8C",
    Canvas: TerrainCanvas,
  },
  {
    id: "infra",
    label: "02",
    title: "INFRASTRUCTURE INSPECTION",
    sub: "Autonomous defect detection at scale",
    status: "ANOMALY DETECT",
    statusColor: "#FF9500",
    Canvas: InfraCanvas,
  },
  {
    id: "env",
    label: "03",
    title: "ENVIRONMENTAL MONITORING",
    sub: "Real-time ecological data capture",
    status: "LIVE CAPTURE",
    statusColor: "#00E5A0",
    Canvas: EnvCanvas,
  },
];

const DomainCard: React.FC<{ domain: typeof DOMAIN_CONFIG[0]; index: number }> = ({ domain, index }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { Canvas } = domain;

  const active = hovered || clicked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ delay: index * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setClicked((v) => !v)}
      style={{ cursor: "pointer" }}
      className="relative flex flex-col border border-border hover:border-primary transition-colors duration-300 overflow-hidden"
    >
      {/* Live viz viewport */}
      <div className="relative w-full" style={{ height: 180 }}>
        <Canvas active={active} />
        {/* Corner crosshairs */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3`} style={{ opacity: active ? 1 : 0.4, transition: "opacity 0.3s" }}>
            <div style={{
              position: "absolute",
              width: 8, height: 1,
              background: domain.statusColor,
              top: i < 2 ? 0 : "auto", bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto", right: i % 2 === 1 ? 0 : "auto",
            }} />
            <div style={{
              position: "absolute",
              width: 1, height: 8,
              background: domain.statusColor,
              top: i < 2 ? 0 : "auto", bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto", right: i % 2 === 1 ? 0 : "auto",
            }} />
          </div>
        ))}
        {/* Status badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5" style={{
          background: "rgba(0,0,0,0.7)",
          border: `1px solid ${domain.statusColor}44`,
          padding: "2px 7px",
        }}>
          <motion.div
            animate={{ opacity: active ? [1, 0.2, 1] : 0.4 }}
            transition={{ repeat: Infinity, duration: 1.1 }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: domain.statusColor }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: domain.statusColor, letterSpacing: "0.12em" }}>
            {active ? domain.status : "STANDBY"}
          </span>
        </div>
        {/* Hover prompt */}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}>
              HOVER TO ACTIVATE
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 bg-surface-2" style={{ borderTop: `1px solid ${domain.statusColor}22` }}>
        <div className="flex items-start justify-between mb-3">
          <span style={{ fontFamily: "monospace", fontSize: 10, color: domain.statusColor, letterSpacing: "0.15em", opacity: 0.7 }}>
            [{domain.label}]
          </span>
          <motion.div
            animate={{ rotate: active ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: 14, height: 14, border: `1px solid ${domain.statusColor}`, opacity: active ? 1 : 0.3 }}
          />
        </div>
        <h3 className="font-sans font-bold text-cream mb-1" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
          {domain.title}
        </h3>
        <p className="font-sans text-cream/60" style={{ fontSize: 12, lineHeight: 1.5 }}>
          {domain.sub}
        </p>
        {/* Active state extra info */}
        <motion.div
          animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${domain.statusColor}22` }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: domain.statusColor, letterSpacing: "0.12em" }}>
              {clicked ? "CLICK TO DEACTIVATE" : "RELEASE TO STANDBY"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom scan line on active */}
      <motion.div
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${domain.statusColor}, transparent)`,
          transformOrigin: "left",
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

// ─── Section header ───────────────────────────────────────────────────────────
const SectionHeader: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className="text-center max-w-3xl mx-auto mb-16">
      <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.3em", color: "rgba(255,255,255,0.35)", marginBottom: 16 }}>
        <motion.span
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.3 }}
        >
          MISSION STATEMENT // ROAM ROBOTICS
        </motion.span>
      </div>
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-6">
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{ display: "inline-block" }}
        >
          WE BELIEVE ROBOTICS SHOULD DO MORE THAN MOVE.
        </motion.span>
      </h2>
      {/* Animated underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        style={{
          height: 1,
          background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)",
          transformOrigin: "left",
          marginBottom: 24,
        }}
      />
      <motion.p
        initial={{ opacity: 0, y: 12 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 0.6, duration: 0.6 }}
        className="font-sans text-lg text-cream/80"
      >
        ROAM aims to become a hub for ambitious builders who want to create
        autonomous machines that solve real-world problems in mapping,
        exploration, infrastructure inspection, and environmental monitoring.
      </motion.p>
    </div>
  );
};

// ─── Main export ──────────────────────────────────────────────────────────────
export const VisionSection: React.FC = () => {
  return (
    <section className="relative w-full py-24 bg-surface z-10 pointer-events-auto shadow-2xl overflow-hidden">
      {/* Subtle scanline texture overlay */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.04) 2px, rgba(0,0,0,0.04) 4px)",
        }}
      />
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <SectionHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-px w-full" style={{ border: "1px solid rgba(255,255,255,0.06)" }}>
          {DOMAIN_CONFIG.map((domain, i) => (
            <DomainCard key={domain.id} domain={domain} index={i} />
          ))}
        </div>
        {/* Footer metadata row */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.8 }}
          className="flex items-center justify-between mt-4"
          style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: "0.2em" }}
        >
          <span>SYS.VISION_MODULE v2.4.1</span>
          <span>3 DOMAIN MODULES LOADED</span>
          <span>HOVER CARDS TO ACTIVATE</span>
        </motion.div>
      </div>
    </section>
  );
};