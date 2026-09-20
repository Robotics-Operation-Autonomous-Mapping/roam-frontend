"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { PublicMember } from "@/lib/members/types";
import { TeamHero } from "./TeamHero";
import { CaptainSection } from "./CaptainSection";
import { LeadsSection } from "./LeadsSection";
import { MembersBySubteam } from "./MembersBySubteam";

export function TeamClient({ members }: { members: PublicMember[] }) {
  const captains = members
    .filter((m) => m.role === "admin")
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.full_name.localeCompare(b.full_name),
    );

  // Subteam leads + captain who also leads a subteam (e.g. Team Captain & Geomatics Lead)
  const leads = members.filter(
    (m) => m.role === "lead" || (m.role === "admin" && m.subteam),
  );

  const crew = members.filter((m) => m.role === "member");

  return (
    <>
      <TeamHero />
      <CaptainSection captains={captains} />
      <LeadsSection leads={leads} />
      <MembersBySubteam members={crew} />

      {!members.length && (
        <section className="py-24 bg-bg">
          <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="font-mono text-sm text-cream/50 tracking-wide">
              Roster coming online. Check back soon.
            </p>
          </div>
        </section>
      )}

      <section className="bg-primary py-16 sm:py-20 md:py-24 overflow-x-clip">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8 md:gap-10">
          <div>
            <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-bg/70 mb-3">
              Join the mission
            </p>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-bg">
              WANT IN?
            </h2>
          </div>
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            className="w-full md:w-auto"
          >
            <Link
              href="/join"
              className="inline-flex w-full md:w-auto items-center justify-center font-mono text-sm md:text-base font-bold uppercase tracking-[0.18em] bg-bg text-primary px-8 py-5 md:px-10 md:py-6 border-2 border-bg hover:bg-transparent hover:text-bg transition-colors shadow-[4px_4px_0_0_rgba(10,10,11,0.35)]"
            >
              Apply to ROAM →
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
