"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, ReviewRow } from "../controls";

export const ReviewStep: React.FC<FormStepProps & { error: string }> = ({
  data,
  set,
  error,
}) => {
  return (
    <div>
      <SectionHeader
        number="09"
        title="Review & Agreement"
        subtitle="Confirm your details and agree to our team expectations."
      />

      {/* Summary card */}
      <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 mb-8">
        <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-primary)] uppercase mb-4">
          Application Summary
        </div>
        <div className="grid grid-cols-[140px_1fr] gap-x-5 gap-y-2.5">
          <ReviewRow label="Name" value={data.full_name} />
          <ReviewRow label="UCID" value={data.ucid} />
          <ReviewRow label="Email" value={data.university_email} />
          <ReviewRow label="Year" value={data.year_of_study} />
          <ReviewRow label="Program" value={data.degree_program} />
          <ReviewRow label="Department" value={data.department} />
          <ReviewRow label="Hours / Week" value={data.hours_per_week} />
          <ReviewRow
            label="Attends Meetings"
            value={data.attend_meetings}
          />
        </div>
      </div>

      {/* Agreement */}
      <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-primary)] uppercase mb-4">
        Agreement — All Required
      </div>
      {[
        {
          key: "agree_professionalism" as const,
          text: "I understand ROAM values professionalism, reliability, respect, and teamwork.",
        },
        {
          key: "agree_contribution" as const,
          text: "I understand consistent contribution matters.",
        },
        {
          key: "agree_contact" as const,
          text: "I consent to being contacted regarding recruitment.",
        },
      ].map(({ key, text }) => (
        <label
          key={key}
          className={`flex items-start gap-3 mb-4 cursor-pointer font-mono text-[13px] leading-[1.6] ${data[key] ? "text-[var(--color-cream)]" : "text-[var(--color-muted)]"}`}
        >
          <input
            type="checkbox"
            checked={data[key]}
            onChange={(e) => set(key, e.target.checked)}
            className="accent-[var(--color-primary)] mt-[3px] shrink-0"
          />
          {text}
        </label>
      ))}

      {error && (
        <div className="border border-[var(--color-primary)] p-3 font-mono text-xs text-[var(--color-primary)] mt-4">
          {error}
        </div>
      )}
    </div>
  );
};
