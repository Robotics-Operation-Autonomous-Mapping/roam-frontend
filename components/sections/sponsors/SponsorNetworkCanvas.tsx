"use client";

import React, { useEffect, useRef } from "react";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export const SponsorNetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrapper = wrapperRef.current;
    if (!canvas || !wrapper) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = 0, H = 0;
    let nodes: Node[] = [];

    const initNodes = () => {
      nodes = [];
      const numNodes = Math.min(Math.floor((W * H) / 15000), 100);
      for (let i = 0; i < numNodes; i++) {
        nodes.push({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          radius: Math.random() * 2 + 1,
        });
      }
    };

    const resize = () => {
      W = canvas.width = wrapper.offsetWidth;
      H = canvas.height = wrapper.offsetHeight;
      initNodes();
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };
    wrapper.addEventListener("mousemove", onMouseMove);
    wrapper.addEventListener("mouseleave", onMouseLeave);

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue("--color-primary").trim() || "#E8512A";

    // Convert hex to rgb for opacity handling
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result
        ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
        : "232, 81, 42"; // Default primary
    };
    const primaryRgb = hexToRgb(primaryColor);

    let animationFrameId: number;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      
      const MAX_DISTANCE = 150;
      const MOUSE_DISTANCE = 200;

      // Update nodes
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.x += node.vx;
        node.y += node.vy;

        // Bounce off walls
        if (node.x <= 0 || node.x >= W) node.vx *= -1;
        if (node.y <= 0 || node.y >= H) node.vy *= -1;

        // Mouse interaction
        const dx = mouseRef.current.x - node.x;
        const dy = mouseRef.current.y - node.y;
        const distToMouse = Math.sqrt(dx * dx + dy * dy);
        
        if (distToMouse < MOUSE_DISTANCE) {
          // Push away slightly
          const force = (MOUSE_DISTANCE - distToMouse) / MOUSE_DISTANCE;
          node.x -= (dx / distToMouse) * force * 1.5;
          node.y -= (dy / distToMouse) * force * 1.5;
        }

        // Draw connections
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const ddx = node.x - other.x;
          const ddy = node.y - other.y;
          const distance = Math.sqrt(ddx * ddx + ddy * ddy);

          if (distance < MAX_DISTANCE) {
            const opacity = 1 - distance / MAX_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = `rgba(${primaryRgb}, ${opacity * 0.3})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${primaryRgb}, 0.6)`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", resize);
      wrapper.removeEventListener("mousemove", onMouseMove);
      wrapper.removeEventListener("mouseleave", onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="absolute inset-0 pointer-events-auto">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
};
