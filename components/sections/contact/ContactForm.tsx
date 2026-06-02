"use client";

import React, { useState } from "react";
import { Field, Input, Select, Textarea } from "@/components/sections/application/controls";
import { CONTACT_EMAIL, CONTACT_SUBJECTS } from "./constants";

type FormState = "idle" | "submitting" | "success" | "error";

const initialForm = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
  phone: "",
  linkedin: "",
};

export const ContactForm = () => {
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const set = (field: keyof typeof initialForm, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const isValid =
    form.fullName.trim().length >= 2 &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()) &&
    CONTACT_SUBJECTS.includes(form.subject as (typeof CONTACT_SUBJECTS)[number]) &&
    form.message.trim().length >= 10;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || state === "submitting") return;

    setState("submitting");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName.trim(),
          email: form.email.trim(),
          subject: form.subject,
          message: form.message.trim(),
          phone: form.phone.trim() || undefined,
          linkedin: form.linkedin.trim() || undefined,
        }),
      });

      const data = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok) {
        setState("error");
        setErrorMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setState("success");
      setForm(initialForm);
    } catch {
      setState("error");
      setErrorMessage(
        `Network error. Check your connection or email us at ${CONTACT_EMAIL}.`,
      );
    }
  };

  if (state === "success") {
    return (
      <div
        className="border border-primary/40 bg-primary/5 p-10 md:p-12 text-center"
        role="status"
      >
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">
          Message Sent
        </p>
        <h2 className="font-display text-3xl md:text-4xl text-cream uppercase tracking-tight mb-4">
          We&apos;ll Be In Touch
        </h2>
        <p className="font-mono text-sm text-cream/60 leading-relaxed max-w-md mx-auto mb-8">
          Thank you for reaching out. A member of the ROAM team will respond to
          your email within 2–3 business days.
        </p>
        <button
          type="button"
          onClick={() => setState("idle")}
          className="font-mono text-xs uppercase tracking-[0.2em] text-primary border border-primary/60 px-6 py-3 hover:bg-primary/10 transition-colors"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-white/10 p-6 md:p-10 bg-white/[0.02]"
      noValidate
    >
      <h2 className="font-display text-2xl md:text-3xl text-cream uppercase tracking-tight mb-2">
        Send a Message
      </h2>
      <p className="font-mono text-xs text-cream/45 mb-8 tracking-wide">
        Fields marked with <span className="text-primary">*</span> are required.
      </p>

      <Field label="Full Name" required value={form.fullName}>
        <Input
          value={form.fullName}
          onChange={(v) => set("fullName", v)}
          placeholder="Jane Doe"
        />
      </Field>

      <Field label="Email Address" required value={form.email}>
        <Input
          type="email"
          value={form.email}
          onChange={(v) => set("email", v)}
          placeholder="you@example.com"
        />
      </Field>

      <Field label="Subject / Reason for Contact" required value={form.subject}>
        <Select
          value={form.subject}
          onChange={(v) => set("subject", v)}
          options={[...CONTACT_SUBJECTS]}
          placeholder="Select a topic"
        />
      </Field>

      <Field label="Message" required value={form.message}>
        <Textarea
          value={form.message}
          onChange={(v) => set("message", v)}
          placeholder="How can we help?"
          rows={6}
        />
      </Field>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 sm:gap-4">
        <Field label="Phone" value={form.phone} hint="Optional">
          <Input
            type="tel"
            value={form.phone}
            onChange={(v) => set("phone", v)}
            placeholder="+1 (403) 000-0000"
          />
        </Field>
        <Field label="LinkedIn" value={form.linkedin} hint="Optional">
          <Input
            value={form.linkedin}
            onChange={(v) => set("linkedin", v)}
            placeholder="linkedin.com/in/you"
          />
        </Field>
      </div>

      {state === "error" && errorMessage && (
        <p
          className="font-mono text-sm text-primary mb-6 px-4 py-3 border border-primary/30 bg-primary/5"
          role="alert"
        >
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={!isValid || state === "submitting"}
        className="w-full font-mono text-sm uppercase tracking-[0.2em] py-4 bg-primary text-bg hover:bg-primary/85 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {state === "submitting" ? "Sending…" : "Submit Message"}
      </button>
    </form>
  );
};
