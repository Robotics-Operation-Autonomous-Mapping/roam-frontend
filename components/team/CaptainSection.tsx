"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { PublicMember } from "@/lib/members/types";
import { memberPhotoUrl } from "@/lib/members/photo";
import { ProfileLinks } from "./ProfileLinks";
import { SectionLabel } from "@/components/ui/SectionLabel";

/** Featured Team Captain / admin leadership strip */
export function CaptainSection({ captains }: { captains: PublicMember[] }) {
  if (!captains.length) return null;

  return (
    <section className="py-16 md:py-24 bg-bg border-b border-border overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionLabel className="mb-4">COMMAND</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-6xl text-cream mb-3 md:mb-4">
          TEAM CAPTAIN
        </h2>
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cream/40 mb-10 md:mb-14">
          Overall mission lead
        </p>

        <div className="space-y-8">
          {captains.map((captain, index) => (
            <CaptainCard key={captain.id} captain={captain} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CaptainCard({
  captain,
  index,
}: {
  captain: PublicMember;
  index: number;
}) {
  const photo = memberPhotoUrl(captain.photo_path);

  return (
    <motion.article
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        delay: index * 0.08,
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative border border-border bg-surface overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-[3px] bg-primary" />
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <div className="relative aspect-[4/5] sm:aspect-[16/12] lg:aspect-auto lg:min-h-[440px] bg-surface-2 overflow-hidden min-h-[240px]">
          {photo ? (
            <Image
              src={photo}
              alt={captain.full_name}
              fill
              priority={index === 0}
              className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
              sizes="(max-width: 1024px) 100vw, 45vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-widest text-cream/30">
              NO PHOTO
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent lg:bg-gradient-to-r lg:from-transparent lg:to-surface/80" />
        </div>

        <div className="p-5 sm:p-8 md:p-12 flex flex-col justify-center min-w-0">
          <p className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-primary mb-3 sm:mb-4">
            {captain.title || "Team Captain"}
          </p>
          <h3 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-cream leading-[0.95] mb-4 sm:mb-6 break-words">
            {captain.full_name}
          </h3>
          {(captain.bio || captain.interesting_thing) && (
            <p className="font-sans text-sm sm:text-base md:text-lg text-cream/65 leading-relaxed max-w-xl mb-6 sm:mb-8">
              {captain.bio || captain.interesting_thing}
            </p>
          )}
          <ProfileLinks
            name={captain.full_name}
            linkedinUrl={captain.linkedin_url}
            portfolioUrl={captain.portfolio_url}
            variant="row"
          />
        </div>
      </div>
    </motion.article>
  );
}
