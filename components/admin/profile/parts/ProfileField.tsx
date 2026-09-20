import React from "react";

export const profileFieldClass =
  "w-full bg-[var(--admin-bg)] border border-[var(--admin-border)] text-[var(--admin-text)] font-mono text-sm px-3.5 py-3 outline-none focus:border-[var(--admin-accent)] transition-colors box-border placeholder:text-[var(--admin-muted)]";

export function ProfileField({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0">
      <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--admin-muted)] mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
