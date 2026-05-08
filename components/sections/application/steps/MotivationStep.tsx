"use client";

import React from "react";
import { FormStepProps } from "../types";
import { SectionHeader, Field, Textarea } from "../controls";

export const MotivationStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="03"
        title="Motivation"
        subtitle="We want to understand what drives you."
      />
      <Field
        label="Why do you want to join ROAM?"
        required
        maxWords={100}
        value={data.why_join}
      >
        <Textarea
          value={data.why_join}
          onChange={(v) => set("why_join", v)}
          placeholder="What draws you to this team specifically..."
          rows={4}
        />
      </Field>
      <Field
        label="What excites you most about building an autonomous rover?"
        required
        maxWords={75}
        value={data.rover_excitement}
      >
        <Textarea
          value={data.rover_excitement}
          onChange={(v) => set("rover_excitement", v)}
          placeholder="The part of the challenge you're most fired up about..."
          rows={3}
        />
      </Field>
      <Field
        label="What do you hope to learn this year?"
        required
        maxWords={75}
        value={data.hope_to_learn}
      >
        <Textarea
          value={data.hope_to_learn}
          onChange={(v) => set("hope_to_learn", v)}
          placeholder="Skills, knowledge, or experience you want to gain..."
          rows={3}
        />
      </Field>
      <Field
        label="Describe a project you built or worked on."
        required
        maxWords={150}
        value={data.project_description}
        hint="Class project, personal project, hobby, team project — anything relevant."
      >
        <Textarea
          value={data.project_description}
          onChange={(v) => set("project_description", v)}
          placeholder="What was it, what was your role, what did you learn..."
          rows={5}
        />
      </Field>
    </div>
  );
};
