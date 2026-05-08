"use client";

import React from "react";
import { FormStepProps } from "../types";
import { DEPARTMENTS, DEPT_ICONS, DEPT_DESCRIPTIONS } from "../constants";
import { SectionHeader } from "../controls";

export const DepartmentStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="01"
        title="Choose Your Department"
        subtitle="Select the team you'd like to join. This determines your technical questions."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
        {DEPARTMENTS.map((dept) => (
          <div
            key={dept}
            onClick={() => set("department", dept)}
            className={`border p-5 cursor-pointer transition-all relative group ${data.department === dept ? "border-[var(--color-primary)] bg-[rgba(232,81,42,0.06)]" : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-muted)]"}`}
          >
            {data.department === dept && (
              <div className="absolute top-3 right-3 text-[var(--color-primary)] font-mono text-[11px] tracking-[0.1em]">
                ✓ SELECTED
              </div>
            )}
            <div className="text-2xl mb-2.5">{DEPT_ICONS[dept]}</div>
            <div
              className={`font-mono text-[13px] tracking-[0.08em] mb-2 uppercase ${data.department === dept ? "text-[var(--color-primary)]" : "text-[var(--color-muted)] group-hover:text-[var(--color-cream)] transition-colors"}`}
            >
              {dept}
            </div>
            <div className="text-xs text-[var(--color-muted)] leading-[1.6] font-mono">
              {DEPT_DESCRIPTIONS[dept]}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
