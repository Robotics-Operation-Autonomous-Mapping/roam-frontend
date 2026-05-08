"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SYSTEM_STACK } from "./constants";

export const TechStackTable = () => (
  <section className="max-w-7xl mx-auto px-6 w-full mb-24">
    <SectionLabel className="mb-4">TECHNOLOGY</SectionLabel>
    <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
      PLANNED TECHNOLOGY STACK
    </h2>

    <div className="flex flex-col gap-0 border border-border">
      {SYSTEM_STACK.map((item, i) => (
        <motion.div
          key={item.component}
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="flex items-center justify-between border-b border-border last:border-b-0 px-6 py-4 hover:bg-surface transition-colors"
        >
          <div className="flex items-baseline gap-6 flex-1 min-w-0">
            <span className="font-mono text-sm text-primary shrink-0 w-[200px]">
              {item.component}
            </span>
            <span className="font-mono text-xs text-muted hidden sm:block">—</span>
            <span className="font-mono text-sm text-cream/80 truncate">
              {item.spec}
            </span>
          </div>
          <span
            className={`font-mono text-xs tracking-widest shrink-0 ml-6 px-3 py-1 border ${
              item.status === "CONFIRMED"
                ? "border-primary text-primary"
                : "border-border text-muted"
            }`}
          >
            {item.status}
          </span>
        </motion.div>
      ))}
    </div>
  </section>
);
