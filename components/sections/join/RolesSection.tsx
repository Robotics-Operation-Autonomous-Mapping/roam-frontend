"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { ROLES } from "./constants";

const RoleCard: React.FC<{ title: string; desc: string; index: number }> = ({
  title,
  desc,
  index,
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-60px" }}
    transition={{ delay: index * 0.07, duration: 0.5 }}
    className="bg-surface border-t-2 border-t-primary border border-border p-6 hover:border-primary transition-colors duration-300 flex flex-col"
  >
    <h3 className="font-sans font-bold text-base text-primary mb-3 tracking-wide">
      {title}
    </h3>
    <p className="font-sans text-sm text-cream/70 leading-relaxed flex-1">{desc}</p>
  </motion.div>
);

export const RolesSection = () => (
  <section className="py-24 bg-surface">
    <div className="max-w-7xl mx-auto px-6">
      <SectionLabel className="mb-4">OPEN ROLES</SectionLabel>
      <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
        WHO WE&apos;RE LOOKING FOR
      </h2>

      <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 md:overflow-x-visible md:pb-0 snap-x snap-mandatory md:snap-none">
        {ROLES.map((role, i) => (
          <div key={role.title} className="snap-start min-w-[280px] md:min-w-0">
            <RoleCard title={role.title} desc={role.desc} index={i} />
          </div>
        ))}
      </div>
    </div>
  </section>
);
