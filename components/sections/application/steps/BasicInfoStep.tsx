"use client";

import React from "react";
import { FormStepProps } from "../types";
import { YEAR_OPTIONS } from "../constants";
import { SectionHeader, Field, Input, Select } from "../controls";

export const BasicInfoStep: React.FC<FormStepProps> = ({ data, set }) => {
  return (
    <div>
      <SectionHeader
        number="02"
        title="Basic Information"
        subtitle="Tell us who you are."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label="Full Name" required value={data.full_name}>
          <Input
            value={data.full_name}
            onChange={(v) => set("full_name", v)}
            placeholder="Jane Smith"
          />
        </Field>
        <Field label="UCID" required value={data.ucid}>
          <Input
            value={data.ucid}
            onChange={(v) => set("ucid", v)}
            placeholder="30XXXXXXX"
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field
          label="University of Calgary Email"
          required
          value={data.university_email}
        >
          <Input
            type="email"
            value={data.university_email}
            onChange={(v) => set("university_email", v)}
            placeholder="jsmith@ucalgary.ca"
          />
        </Field>
        <Field
          label="Personal Email (Optional)"
          value={data.personal_email}
        >
          <Input
            type="email"
            value={data.personal_email}
            onChange={(v) => set("personal_email", v)}
            placeholder="jane@gmail.com"
          />
        </Field>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        <Field label="Phone Number" value={data.phone}>
          <Input
            value={data.phone}
            onChange={(v) => set("phone", v)}
            placeholder="+1 (403) 000-0000"
          />
        </Field>
        <Field label="Year of Study" required value={data.year_of_study}>
          <Select
            value={data.year_of_study}
            onChange={(v) => set("year_of_study", v)}
            options={YEAR_OPTIONS}
            placeholder="Select year..."
          />
        </Field>
      </div>
      <Field
        label="Degree Program / Field of Study"
        required
        value={data.degree_program}
        hint="e.g. Mechanical Engineering, Software Engineering, Business, Communications"
      >
        <Input
          value={data.degree_program}
          onChange={(v) => set("degree_program", v)}
          placeholder="Your program"
        />
      </Field>
    </div>
  );
};
