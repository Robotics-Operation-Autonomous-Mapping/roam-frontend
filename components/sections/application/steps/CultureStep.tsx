"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, Field, Textarea, Input } from "../controls";

export const CultureStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="06"
        title="Personality & Culture Fit"
        subtitle="We build together. We want to know who you are."
      />
      <Field
        label="What hobbies do you enjoy outside school?"
        required
        maxWords={75}
        value={data.hobbies}
      >
        <Textarea
          value={data.hobbies}
          onChange={(v) => set("hobbies", v)}
          placeholder="Anything goes..."
          rows={3}
        />
      </Field>
      <Field
        label="Favorite song or artist right now?"
        value={data.favorite_song}
      >
        <Input
          value={data.favorite_song}
          onChange={(v) => set("favorite_song", v)}
          placeholder="Currently on repeat..."
        />
      </Field>
      <Field
        label="Tell us one interesting thing about yourself."
        required
        maxWords={75}
        value={data.interesting_thing}
      >
        <Textarea
          value={data.interesting_thing}
          onChange={(v) => set("interesting_thing", v)}
          placeholder="Something unexpected..."
          rows={3}
        />
      </Field>
      <Field
        label="What kind of team environment helps you do your best work?"
        required
        maxWords={75}
        value={data.team_environment}
      >
        <Textarea
          value={data.team_environment}
          onChange={(v) => set("team_environment", v)}
          placeholder="How you work best with others..."
          rows={3}
        />
      </Field>
    </div>
  );
};
