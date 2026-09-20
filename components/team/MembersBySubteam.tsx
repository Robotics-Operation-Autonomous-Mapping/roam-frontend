"use client";

import React from "react";
import type { PublicMember, Subteam } from "@/lib/members/types";
import { SUBTEAMS } from "@/lib/members/types";
import { SUBTEAM_LABELS } from "@/lib/members/constants";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { MemberPhotoCard } from "./MemberPhotoCard";

export function MembersBySubteam({ members }: { members: PublicMember[] }) {
  const bySubteam = SUBTEAMS.map((subteam) => ({
    subteam,
    people: members
      .filter((m) => m.subteam === subteam)
      .sort(
        (a, b) =>
          (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
          a.full_name.localeCompare(b.full_name),
      ),
  })).filter((g) => g.people.length > 0);

  const unassigned = members
    .filter((m) => !m.subteam)
    .sort(
      (a, b) =>
        (a.sort_order ?? 0) - (b.sort_order ?? 0) ||
        a.full_name.localeCompare(b.full_name),
    );

  if (!bySubteam.length && !unassigned.length) return null;

  return (
    <section className="py-16 md:py-24 bg-bg overflow-x-clip">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionLabel className="mb-4">THE CREW</SectionLabel>
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-cream mb-3 md:mb-4">
          THE TEAM
        </h2>
        <p className="font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-cream/40 mb-10 md:mb-16">
          Sorted by subteam · tap or hover for details
        </p>

        <div className="space-y-12 md:space-y-16">
          {bySubteam.map(({ subteam, people }) => (
            <SubteamBlock key={subteam} subteam={subteam} people={people} />
          ))}
          {unassigned.length > 0 && (
            <SubteamBlock subteam={null} people={unassigned} />
          )}
        </div>
      </div>
    </section>
  );
}

function SubteamBlock({
  subteam,
  people,
}: {
  subteam: Subteam | null;
  people: PublicMember[];
}) {
  return (
    <div>
      <h3 className="font-mono text-[11px] uppercase tracking-[0.25em] text-primary mb-6">
        {subteam ? SUBTEAM_LABELS[subteam] : "Unassigned"}
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5 sm:gap-3 md:gap-4 items-start">
        {people.map((person, index) => (
          <MemberPhotoCard
            key={person.id}
            index={index}
            name={person.full_name}
            roleLabel={
              person.title ||
              (person.subteam ? SUBTEAM_LABELS[person.subteam] : "Member")
            }
            bio={person.bio || person.interesting_thing}
            photoPath={person.photo_path}
            linkedinUrl={person.linkedin_url}
            portfolioUrl={person.portfolio_url}
          />
        ))}
      </div>
    </div>
  );
}
