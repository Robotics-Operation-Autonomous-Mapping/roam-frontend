"use client";

import React from "react";
import { FormData } from "./types";

export const SuccessScreen: React.FC<{ data: FormData }> = ({ data }) => {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-cream)] py-20 px-6">
      <div className="max-w-3xl mx-auto text-center py-20 px-10">
        <div className="text-5xl mb-6">🚀</div>
        <h2 className="font-display text-4xl text-[var(--color-cream)] tracking-tight mb-4 uppercase">
          Application Received
        </h2>
        <p className="text-[var(--color-muted)] font-mono text-sm leading-[1.8] max-w-lg mx-auto mb-8">
          Thank you,{" "}
          <span className="text-[var(--color-primary)]">
            {data.full_name}
          </span>
          . Your application to{" "}
          <span className="text-[var(--color-primary)]">
            {data.department}
          </span>{" "}
          has been submitted. We&apos;ll be in touch at{" "}
          <span className="text-[var(--color-cream)]">
            {data.university_email}
          </span>
          .
        </p>
        <div className="font-mono text-[11px] tracking-[0.15em] text-[var(--color-muted)] uppercase">
          — ROAM Recruitment Team
        </div>
      </div>
    </div>
  );
};
