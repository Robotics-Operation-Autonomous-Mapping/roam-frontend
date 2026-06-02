"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SPONSORSHIP_EMAIL } from "@/lib/site";
import { PACKAGES } from "./constants";

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

function BenefitRow({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-start gap-3 border-b border-white/10 pb-3"
    >
      <span className="mt-1 w-2 h-2 shrink-0 bg-primary rotate-45 inline-block" />
      <span className="font-mono text-sm text-cream/80 leading-relaxed tracking-wide">{text}</span>
    </motion.li>
  );
}

function PackageCard({ pkg, index }: { pkg: (typeof PACKAGES)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const mailto = `mailto:${SPONSORSHIP_EMAIL}?subject=Sponsorship%20Inquiry%20%E2%80%94%20${encodeURIComponent(pkg.tier)}%20Package&body=Hi%20ROAM%20team%2C%0A%0AI%27m%20interested%20in%20the%20${encodeURIComponent(pkg.tier)}%20sponsorship%20package.%0A%0AOrganization%3A%20%0AContact%20Name%3A%20%0AMessage%3A%20`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col border ${
        pkg.highlight
          ? "border-primary bg-primary/5"
          : "border-white/15 bg-white/[0.03]"
      } p-10 md:p-12 gap-8`}
    >
      {pkg.highlight && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
      )}

      <div className="flex flex-col gap-1">
        {pkg.highlight && (
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
            ★ Most Impactful
          </span>
        )}
        <h3 className="font-display text-5xl md:text-6xl uppercase tracking-tighter text-cream">
          {pkg.tier}
        </h3>
        <p className="font-mono text-xs text-cream/40 uppercase tracking-widest mt-1">
          {pkg.tagline}
        </p>
      </div>

      <div className="border-t border-b border-white/10 py-4">
        <span className="font-display text-3xl text-primary tracking-tight">
          {pkg.range}
        </span>
        <span className="font-mono text-xs text-cream/40 ml-2 uppercase tracking-widest">/ year</span>
      </div>

      <ul className="flex flex-col gap-3 flex-1">
        {pkg.benefits.map((b, i) => (
          <BenefitRow key={i} text={b} index={i} />
        ))}
      </ul>

      <a
        href={mailto}
        className={`mt-2 inline-block w-full text-center font-mono text-sm uppercase tracking-[0.2em] py-4 transition-colors duration-200 ${
          pkg.highlight
            ? "bg-primary text-bg hover:bg-primary/85"
            : "border border-primary/60 text-primary hover:bg-primary/10"
        }`}
      >
        {pkg.cta}
      </a>
    </motion.div>
  );
}

export const PackageSection = () => (
  <section className="border-t border-white/10 max-w-7xl mx-auto px-6 py-32 md:py-48 w-full">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
      className="mb-20 text-center md:text-left"
    >
      <SectionLabel className="mb-6">Sponsorship Tiers</SectionLabel>
      <h2 className="font-display text-[clamp(4rem,10vw,7rem)] leading-[0.8] tracking-tighter text-cream uppercase">
        CHOOSE YOUR<br />
        <span className="text-primary">MISSION LEVEL.</span>
      </h2>
    </motion.div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
      {PACKAGES.map((pkg, i) => (
        <PackageCard key={pkg.tier} pkg={pkg} index={i} />
      ))}
    </div>

    <motion.p
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 0.3 }}
      className="font-mono text-xs text-cream/30 text-center mt-8 tracking-widest uppercase"
    >
      Custom packages available, reach out to discuss what works for you.
    </motion.p>
  </section>
);
