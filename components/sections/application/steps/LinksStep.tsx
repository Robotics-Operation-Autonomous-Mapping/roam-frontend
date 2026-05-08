"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, Field, Input } from "../controls";

export const LinksStep: React.FC<FormStepProps> = ({
  data,
  set,
  resumeFile,
  setResumeFile,
}) => {
  return (
    <div>
      <SectionHeader
        number="07"
        title="Resume & Links"
        subtitle="Share your work. All fields optional except what's marked."
      />
      <Field label="Resume" value="" hint="PDF preferred. Max 5MB.">
        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-4">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResumeFile?.(e.target.files?.[0] ?? null)}
            className="w-full font-mono text-[13px] text-[var(--color-muted)] file:mr-4 file:py-2 file:px-4 file:border-0 file:text-[11px] file:font-sans file:font-bold file:bg-[var(--color-surface-2)] file:text-[var(--color-cream)] hover:file:bg-[var(--color-border)] file:transition-colors file:cursor-pointer cursor-pointer"
          />
          {resumeFile && (
            <div className="mt-3 font-mono text-[11px] text-[var(--color-primary)]">
              ✓ {resumeFile.name} ({(resumeFile.size / 1024).toFixed(0)} KB)
            </div>
          )}
        </div>
      </Field>
      <Field label="LinkedIn (Optional)" value={data.linkedin}>
        <Input
          value={data.linkedin}
          onChange={(v) => set("linkedin", v)}
          placeholder="https://linkedin.com/in/..."
        />
      </Field>
      <Field label="GitHub (Optional)" value={data.github}>
        <Input
          value={data.github}
          onChange={(v) => set("github", v)}
          placeholder="https://github.com/..."
        />
      </Field>
      <Field
        label="Portfolio / Personal Website (Optional)"
        value={data.portfolio}
      >
        <Input
          value={data.portfolio}
          onChange={(v) => set("portfolio", v)}
          placeholder="https://..."
        />
      </Field>
    </div>
  );
};
