"use client";

import React from "react";

interface ProfilePhotoSectionProps {
  photoUrl: string | null;
  uploading: boolean;
  onPhotoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ProfilePhotoSection({
  photoUrl,
  uploading,
  onPhotoChange,
}: ProfilePhotoSectionProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-5 items-center sm:items-start">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0 border border-[var(--admin-border)] bg-[var(--admin-surface)] overflow-hidden">
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={photoUrl}
            alt=""
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full grid place-items-center font-mono text-[10px] tracking-widest text-[var(--admin-muted)]">
            NO PHOTO
          </div>
        )}
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-[var(--admin-accent)]" />
      </div>
      <div className="flex-1 w-full text-center sm:text-left">
        <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--admin-muted)] mb-3">
          Photograph
        </label>
        <label className="inline-flex items-center justify-center gap-2 cursor-pointer border border-[var(--admin-border)] px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-[var(--admin-text)] hover:border-[var(--admin-accent)] hover:text-[var(--admin-accent)] transition-colors">
          {uploading ? "Uploading…" : "Choose photo"}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={onPhotoChange}
            disabled={uploading}
            className="sr-only"
          />
        </label>
        <p className="mt-2 font-mono text-[10px] text-[var(--admin-muted)]">
          JPG / PNG / WebP · max 5MB
        </p>
      </div>
    </div>
  );
}
