"use client";

import React, { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";

interface StatCounterProps {
  end: number;
  label: string;
  duration?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export const StatCounter: React.FC<StatCounterProps> = ({
  end,
  label,
  duration = 2000, // milliseconds
  className,
  prefix = "",
  suffix = "",
}) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-10px" });

  // Normalise: values < 100 are treated as seconds (legacy), ≥100 as ms
  const durationMs = duration < 100 ? duration * 1000 : duration;

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / durationMs, 1);

        // easeOutQuart
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(ease * end));

        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setCount(end);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [isInView, end, durationMs]);

  return (
    <div ref={ref} className={cn("flex flex-col items-start", className)}>
      <div className="font-mono text-4xl md:text-5xl text-cream mb-2">
        {prefix}
        {count}
        {suffix}
      </div>
      <div className="font-mono text-sm text-muted uppercase tracking-widest">
        {label}
      </div>
    </div>
  );
};
