"use client";

import React from "react";
import { FormStepProps, Department } from "../types";
import { TECH_QUESTIONS } from "../constants";
import { SectionHeader, Field, Textarea, Input } from "../controls";

export const TechnicalStep: React.FC<FormStepProps> = ({ data, setTech }) => {
  if (!data.department || !setTech) return null;
  const techQuestions = TECH_QUESTIONS[data.department as Department];

  return (
    <div>
      <SectionHeader
        number="04"
        title={`${data.department} — Technical Questions`}
        subtitle="Answer based on your current knowledge. Honesty beats bluffing."
      />
      {techQuestions.map((q) => (
        <Field
          key={q.key}
          label={q.label}
          required={q.key !== "portfolio_link"}
          maxWords={q.maxWords}
          value={data.technical[q.key] ?? ""}
        >
          {q.multiline ? (
            <Textarea
              value={data.technical[q.key] ?? ""}
              onChange={(v) => setTech(q.key, v)}
              placeholder={q.placeholder}
              rows={4}
            />
          ) : (
            <Input
              value={data.technical[q.key] ?? ""}
              onChange={(v) => setTech(q.key, v)}
              placeholder={q.placeholder}
            />
          )}
        </Field>
      ))}
    </div>
  );
};
