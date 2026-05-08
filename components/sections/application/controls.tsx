"use client";

import React from "react";
import { SectionLabel } from "@/components/ui/SectionLabel";

export function wordCount(text: string): number {
  return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

export const Field: React.FC<{
  label: string;
  required?: boolean;
  hint?: string;
  maxWords?: number;
  value: string;
  children: React.ReactNode;
}> = ({ label, required, hint, maxWords, value, children }) => {
  const wc = maxWords ? wordCount(value) : 0;
  const over = maxWords ? wc > maxWords : false;
  return (
    <div className="mb-7">
      <label className="block mb-2 font-mono text-[11px] tracking-[0.14em] uppercase text-[var(--color-muted)]">
        {label}
        {required && (
          <span className="text-[var(--color-primary)] ml-1">*</span>
        )}
      </label>
      {hint && (
        <p className="font-mono text-xs text-[var(--color-muted)] opacity-80 mb-2">
          {hint}
        </p>
      )}
      {children}
      {maxWords && (
        <div
          className={`mt-1 font-mono text-[11px] text-right ${over ? "text-[var(--color-primary)]" : "text-[var(--color-muted)]"}`}
        >
          {wc} / {maxWords} words
        </div>
      )}
    </div>
  );
};

export const Input: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}> = ({ value, onChange, placeholder, type = "text" }) => (
  <input
    type={type}
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border placeholder-[var(--color-muted)]"
  />
);

export const Textarea: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ value, onChange, placeholder, rows = 4 }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    rows={rows}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border placeholder-[var(--color-muted)] resize-y leading-[1.6]"
  />
);

export const Select: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder?: string;
}> = ({ value, onChange, options, placeholder }) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="w-full bg-[var(--color-surface)] border border-[var(--color-border)] rounded-none text-[var(--color-cream)] font-mono text-sm px-4 py-3 outline-none transition-colors focus:border-[var(--color-primary)] box-border appearance-none cursor-pointer"
  >
    {placeholder && <option value="">{placeholder}</option>}
    {options.map((o) => (
      <option key={o} value={o}>
        {o}
      </option>
    ))}
  </select>
);

export const RadioGroup: React.FC<{
  value: string;
  onChange: (v: string) => void;
  options: string[];
}> = ({ value, onChange, options }) => (
  <div className="flex gap-3 flex-wrap">
    {options.map((o) => (
      <label
        key={o}
        className={`flex items-center gap-2 cursor-pointer font-mono text-[13px] px-4 py-2 transition-colors border ${value === o ? "text-[var(--color-primary)] border-[var(--color-primary)]" : "text-[var(--color-muted)] border-[var(--color-border)]"}`}
      >
        <input
          type="radio"
          checked={value === o}
          onChange={() => onChange(o)}
          className="accent-[var(--color-primary)]"
        />
        {o}
      </label>
    ))}
  </div>
);

export const SectionHeader: React.FC<{
  number: string;
  title: string;
  subtitle: string;
}> = ({ number, title, subtitle }) => (
  <div className="mb-10">
    <SectionLabel>Section {number}</SectionLabel>
    <h2 className="font-display text-4xl mt-2 text-[var(--color-cream)] uppercase tracking-wide">
      {title}
    </h2>
    <p className="font-mono text-[13px] text-[var(--color-muted)] mt-1.5">
      {subtitle}
    </p>
  </div>
);

export const ReviewRow: React.FC<{ label: string; value: string }> = ({
  label,
  value,
}) => (
  <>
    <div className="font-mono text-[11px] tracking-[0.1em] text-[var(--color-muted)] uppercase mt-1">
      {label}
    </div>
    <div className="font-mono text-[13px] text-[var(--color-cream)]">
      {value || "—"}
    </div>
  </>
);
