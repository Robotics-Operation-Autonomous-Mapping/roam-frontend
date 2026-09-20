"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { memberPhotoUrl } from "@/lib/members/photo";
import { ProfileLinks } from "./ProfileLinks";

type MemberPhotoCardProps = {
  name: string;
  roleLabel: string;
  bio?: string | null;
  photoPath?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  index?: number;
};

/** Photo-only member card — blur overlay (tap on touch, hover on mouse). */
export function MemberPhotoCard({
  name,
  roleLabel,
  bio,
  photoPath,
  linkedinUrl,
  portfolioUrl,
  index = 0,
}: MemberPhotoCardProps) {
  const photo = memberPhotoUrl(photoPath);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const pointerType = useRef<"mouse" | "touch" | "pen" | "other">("other");

  const revealed = open || hovered;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        delay: Math.min(index, 8) * 0.04,
        duration: 0.5,
        ease: [0.22, 1, 0.36, 1],
      }}
      role="button"
      tabIndex={0}
      aria-expanded={revealed}
      aria-label={`${name}, ${roleLabel}`}
      onPointerDown={(e) => {
        pointerType.current =
          e.pointerType === "mouse" ||
          e.pointerType === "touch" ||
          e.pointerType === "pen"
            ? e.pointerType
            : "other";
      }}
      onMouseEnter={() => {
        if (pointerType.current !== "touch" && pointerType.current !== "pen") {
          setHovered(true);
        }
      }}
      onMouseLeave={() => setHovered(false)}
      onClick={() => {
        if (pointerType.current === "touch" || pointerType.current === "pen") {
          setOpen((v) => !v);
          return;
        }
        setOpen(true);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          setOpen((v) => !v);
        }
        if (e.key === "Escape") setOpen(false);
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          setOpen(false);
        }
      }}
      className={[
        "group relative outline-none border bg-surface-2 overflow-hidden transition-[border-color] duration-300 cursor-pointer",
        "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg",
        revealed ? "border-primary" : "border-border",
      ].join(" ")}
    >
      <div className="relative aspect-[3/4]">
        {photo ? (
          <Image
            src={photo}
            alt={name}
            fill
            className={[
              "object-cover transition-[transform,filter] duration-500 ease-out",
              revealed ? "scale-105 blur-sm" : "scale-100 blur-0",
            ].join(" ")}
            sizes="(max-width: 768px) 50vw, 25vw"
          />
        ) : (
          <div
            className={[
              "absolute inset-0 flex items-center justify-center font-mono text-[10px] tracking-widest text-cream/30 transition-[filter] duration-500",
              revealed ? "blur-sm" : "blur-0",
            ].join(" ")}
          >
            NO PHOTO
          </div>
        )}

        <div
          className={[
            "absolute inset-x-0 bottom-0 p-2.5 sm:p-3 bg-gradient-to-t from-bg via-bg/55 to-transparent transition-opacity duration-300 pointer-events-none",
            revealed ? "opacity-0" : "opacity-100",
          ].join(" ")}
        >
          <p className="font-display text-base sm:text-lg md:text-xl text-cream leading-none truncate">
            {name}
          </p>
        </div>

        <div
          className={[
            "absolute inset-0 flex flex-col justify-end gap-2 p-3 sm:p-4 md:p-5 bg-bg/75 transition-opacity duration-300 ease-out",
            revealed
              ? "opacity-100"
              : "opacity-0 pointer-events-none",
          ].join(" ")}
          aria-hidden={!revealed}
        >
          <p className="font-mono text-[9px] md:text-[10px] uppercase tracking-[0.18em] text-primary">
            {roleLabel}
          </p>
          <h3 className="font-display text-lg sm:text-xl md:text-2xl text-cream leading-none">
            {name}
          </h3>
          {bio && (
            <p className="font-sans text-[11px] md:text-xs text-cream/70 leading-relaxed line-clamp-3 sm:line-clamp-4">
              {bio}
            </p>
          )}
          {revealed && (
            <ProfileLinks
              name={name}
              linkedinUrl={linkedinUrl}
              portfolioUrl={portfolioUrl}
              compact
            />
          )}
        </div>
      </div>
    </motion.article>
  );
}
