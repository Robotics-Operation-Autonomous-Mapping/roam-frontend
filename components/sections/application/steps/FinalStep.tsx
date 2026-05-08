"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, Field, RadioGroup, Input, Textarea } from "../controls";

export const FinalStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="08"
        title="Final Questions"
        subtitle="Almost done."
      />
      <Field
        label="Are you applying to other clubs or design teams?"
        required
        value={data.other_clubs}
      >
        <RadioGroup
          value={data.other_clubs}
          onChange={(v) => set("other_clubs", v)}
          options={["Yes", "No"]}
        />
      </Field>
      {data.other_clubs === "Yes" && (
        <Field label="If yes, which ones?" value={data.which_clubs}>
          <Input
            value={data.which_clubs}
            onChange={(v) => set("which_clubs", v)}
            placeholder="Team names..."
          />
        </Field>
      )}
      <Field
        label="Why should ROAM bet on you?"
        required
        maxWords={100}
        value={data.why_bet_on_you}
      >
        <Textarea
          value={data.why_bet_on_you}
          onChange={(v) => set("why_bet_on_you", v)}
          placeholder="Make your case..."
          rows={4}
        />
      </Field>
    </div>
  );
};
