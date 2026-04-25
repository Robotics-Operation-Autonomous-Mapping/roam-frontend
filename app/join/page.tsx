"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Content ─────────────────────────────────────────────────────────────────
const ROLES = [
  {
    title: "MECHANICAL ENGINEERING",
    desc: "Design chassis, suspension systems, and sensor mounts. Optimize for weight, durability, and extreme terrain.",
  },
  {
    title: "ELECTRICAL ENGINEERING",
    desc: "Develop power distribution, motor controllers, and sensor integration. Ensure robust communication.",
  },
  {
    title: "COMPUTER ENGINEERING",
    desc: "Bridge hardware and software — embedded systems, FPGA work, and low-level firmware.",
  },
  {
    title: "SOFTWARE DEVELOPMENT",
    desc: "Write the autonomous stack: ROS 2, computer vision, point cloud processing, and path planning.",
  },
  {
    title: "GEOMATICS",
    desc: "Analyze LiDAR and photogrammetry data. Build highly accurate 3D maps of the environment.",
  },
  {
    title: "MECHATRONICS",
    desc: "Integrate mechanical and electrical systems. Design actuators, sensors, and control loops.",
  },
  {
    title: "BUSINESS / OPERATIONS",
    desc: "Manage sponsorships, marketing, project timelines, and team logistics.",
  },
  {
    title: "CONTENT & MEDIA",
    desc: "Document the build journey, create technical content, and manage club communications.",
  },
];

const GAINS = [
  "Hands-on robotics development with real hardware.",
  "Real team project experience you can point to.",
  "Cross-discipline collaboration with engineers and designers.",
  "Hardware and software exposure — both sides of the stack.",
  "Leadership opportunities as the club scales.",
  "Portfolio-worthy work that proves you can build.",
  "A strong technical network of peers and mentors.",
];

const TRAITS = [
  "Reliable",
  "Curious",
  "Self-motivated",
  "Collaborative",
  "Growth-oriented",
];

// ─── Subcomponents ────────────────────────────────────────────────────────────
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

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function JoinPage() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-bg">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex flex-col justify-center items-center pt-24 pb-16 overflow-hidden">
        {/* Large watermark */}
        <div
          aria-hidden="true"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden"
        >
          <span
            className="font-display text-[clamp(8rem,30vw,22rem)] text-cream leading-none"
            style={{ opacity: 0.03 }}
          >
            JOIN
          </span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <SectionLabel className="mb-6">RECRUITMENT</SectionLabel>
            <h1 className="font-display text-[clamp(3.5rem,12vw,8rem)] text-cream leading-[0.85] mb-8">
              JOIN THE MISSION.
            </h1>
            <p className="font-sans text-xl text-primary font-bold mb-4">
              Real experience. Real challenges. Real impact.
            </p>
            <p className="font-sans text-lg text-cream/80 max-w-xl mx-auto leading-relaxed">
              You do not need to know everything. You need curiosity, commitment,
              and the willingness to learn fast.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── WHO WE'RE LOOKING FOR ── */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <SectionLabel className="mb-4">OPEN ROLES</SectionLabel>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
            WHO WE&apos;RE LOOKING FOR
          </h2>

          {/* Scrolling row on mobile, grid on desktop */}
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto pb-4 md:overflow-x-visible md:pb-0 snap-x snap-mandatory md:snap-none">
            {ROLES.map((role, i) => (
              <div key={role.title} className="snap-start min-w-[280px] md:min-w-0">
                <RoleCard title={role.title} desc={role.desc} index={i} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT YOU GET ── */}
      <section className="py-24 bg-bg">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <SectionLabel className="mb-4">BENEFITS</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
              WHAT YOU GET
            </h2>

            <div className="relative pl-8 border-l border-border flex flex-col gap-8">
              {/* Animated coral line drawing in */}
              <motion.div
                className="absolute left-[-1px] top-0 w-[2px] bg-primary origin-top"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.8, ease: "easeInOut" }}
                style={{ height: "100%" }}
              />

              {GAINS.map((gain, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + i * 0.15, duration: 0.5 }}
                  className="relative"
                >
                  <div className="absolute -left-[34px] top-[5px] w-3 h-3 rounded-full bg-bg border-2 border-primary z-10" />
                  <p className="font-sans text-cream/90 leading-relaxed">{gain}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* ── WHAT WE EXPECT ── */}
          <div>
            <SectionLabel className="mb-4">EXPECTATIONS</SectionLabel>
            <h2 className="font-display text-4xl md:text-5xl text-cream mb-12">
              WHAT WE EXPECT
            </h2>

            <div className="flex flex-wrap gap-3 mb-8">
              {TRAITS.map((trait, i) => (
                <motion.span
                  key={trait}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="px-5 py-2 border border-primary text-primary font-sans text-sm font-bold uppercase tracking-wider"
                >
                  {trait}
                </motion.span>
              ))}
            </div>

            <p className="font-sans text-cream/70 leading-relaxed mb-8">
              We value people who show up, push through, and care about doing good work.
            </p>

            <div className="bg-surface-2 border border-border p-6">
              <h3 className="font-mono text-xs text-primary tracking-widest mb-4">
                [ COMMITMENT LEVEL ]
              </h3>
              <ul className="space-y-3 font-sans text-sm text-cream/80">
                {[
                  "5–10 hours per week minimum",
                  "Attend weekly subteam meetings",
                  "Take full ownership of your tasks",
                  "Communicate proactively with your team",
                  "Show up. Every week counts.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="text-primary mt-0.5 shrink-0">—</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ── FINAL CTA — coral background ── */}
      <section className="w-full bg-primary py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-display text-[clamp(2rem,6vw,4rem)] text-bg leading-[0.9] mb-10">
              IF YOU WANT TO HELP SHAPE THIS FROM DAY ONE — NOW IS THE TIME.
            </h2>
            <a
              href="#apply"
              className="inline-block bg-bg text-cream font-sans font-bold uppercase tracking-widest px-10 py-4 hover:bg-surface-2 transition-colors min-h-[44px]"
            >
              APPLY NOW →
            </a>
            <p className="font-mono text-xs text-bg/70 mt-6 uppercase tracking-widest">
              [ Microsoft Forms link — coming soon ]
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
