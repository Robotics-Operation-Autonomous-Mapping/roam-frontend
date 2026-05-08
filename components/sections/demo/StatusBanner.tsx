"use client";

import React from "react";
import { motion } from "framer-motion";

export const StatusBanner = () => (
  <div className="max-w-7xl mx-auto px-6 w-full mb-16">
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="border-l-4 border-primary bg-surface px-8 py-6 flex flex-col sm:flex-row gap-4 sm:gap-12"
    >
      <div>
        <p className="font-mono text-xs text-muted mb-1 uppercase tracking-widest">Current Status</p>
        <p className="font-mono text-primary font-bold tracking-wider">
          DESIGN & SYSTEMS PLANNING
        </p>
      </div>
      <div className="w-px bg-border hidden sm:block" />
      <div>
        <p className="font-mono text-xs text-muted mb-1 uppercase tracking-widest">Target</p>
        <p className="font-mono text-cream font-bold tracking-wider">
          FIRST AUTONOMOUS NAVIGATION TEST → Q4 2026
        </p>
      </div>
      <div className="sm:ml-auto flex items-center gap-3">
        <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
        <span className="font-mono text-xs text-primary tracking-widest">ACTIVE</span>
      </div>
    </motion.div>
  </div>
);
