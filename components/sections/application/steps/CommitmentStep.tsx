"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, Field, Input, RadioGroup } from "../controls";

export const CommitmentStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="05"
        title="Commitment"
        subtitle="We need reliable people. Be honest about your schedule."
      />
      <Field
        label="How many hours per week can you realistically commit to ROAM?"
        required
        value={data.hours_per_week}
      >
        <Input
          value={data.hours_per_week}
          onChange={(v) => set("hours_per_week", v)}
          placeholder="e.g. 6–8 hours"
        />
      </Field>
      <Field
        label="Can you regularly attend meetings and build sessions?"
        required
        value={data.attend_meetings}
      >
        <RadioGroup
          value={data.attend_meetings}
          onChange={(v) => set("attend_meetings", v)}
          options={["Yes", "No", "Mostly"]}
        />
      </Field>
      <Field
        label="Are you willing to contribute during intense build periods near deadlines?"
        required
        value={data.intense_periods}
        hint="There will be crunch periods before competitions."
      >
        <RadioGroup
          value={data.intense_periods}
          onChange={(v) => set("intense_periods", v)}
          options={["Yes", "No", "Depends on schedule"]}
        />
      </Field>
    </div>
  );
};
