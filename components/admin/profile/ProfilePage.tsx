"use client";

import React, { useState } from "react";
import { usePortalAuth } from "@/components/admin/AdminAuthContext";
import { SUBTEAMS, type Subteam } from "@/lib/members/types";
import { SUBTEAM_LABELS } from "@/lib/members/constants";
import { memberPhotoUrl } from "@/lib/members/photo";
import { ProfileField, profileFieldClass } from "./parts/ProfileField";
import { ProfilePhotoSection } from "./parts/ProfilePhotoSection";

export function ProfilePage() {
  const { member, refreshMember } = usePortalAuth();
  const [fullName, setFullName] = useState(member.full_name);
  const [email, setEmail] = useState(member.email);
  const [ucid, setUcid] = useState(member.ucid ?? "");
  const [dob, setDob] = useState(member.date_of_birth ?? "");
  const [interesting, setInteresting] = useState(member.interesting_thing ?? "");
  const [bio, setBio] = useState(member.bio ?? "");
  const [linkedin, setLinkedin] = useState(member.linkedin_url ?? "");
  const [portfolio, setPortfolio] = useState(member.portfolio_url ?? "");
  const [subteam, setSubteam] = useState<Subteam | "">(member.subteam ?? "");
  const [isPublic, setIsPublic] = useState(member.is_public);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [photoPath, setPhotoPath] = useState(member.photo_path);

  const photoUrl = memberPhotoUrl(photoPath);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    const res = await fetch("/api/members/me", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: fullName,
        email,
        ucid,
        date_of_birth: dob || null,
        interesting_thing: interesting,
        bio,
        linkedin_url: linkedin,
        portfolio_url: portfolio,
        subteam: subteam || null,
        is_public: isPublic,
      }),
    });

    const data = await res.json().catch(() => ({}));
    setSaving(false);

    if (!res.ok) {
      setError(data.error || "Save failed");
      return;
    }

    await refreshMember();
    setMessage("Profile saved.");
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    const form = new FormData();
    form.append("file", file);
    const res = await fetch("/api/members/photo", { method: "POST", body: form });
    const data = await res.json().catch(() => ({}));
    setUploading(false);
    e.target.value = "";
    if (!res.ok) {
      setError(data.error || "Upload failed");
      return;
    }
    setPhotoPath(data.photo_path);
    await refreshMember();
    setMessage("Photo updated.");
  };

  return (
    <div className="w-full px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl">
        <header className="mb-8 text-center sm:text-left">
          <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[var(--admin-accent)] mb-2">
            Profile
          </p>
          <h1 className="font-sans text-2xl sm:text-3xl text-[var(--admin-text)] mb-2">
            {fullName || "Your profile"}
          </h1>
          <p className="font-mono text-xs text-[var(--admin-muted)] leading-relaxed">
            Public Team page fields + private portal details · Role:{" "}
            <span className="text-[var(--admin-text)]">{member.role}</span>
            {member.title ? ` · ${member.title}` : ""}
          </p>
        </header>

        <form
          onSubmit={handleSave}
          className="border border-[var(--admin-border)] bg-[var(--admin-bg-dark)] p-5 sm:p-8 space-y-6"
        >
          <ProfilePhotoSection
            photoUrl={photoUrl}
            uploading={uploading}
            onPhotoChange={handlePhoto}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ProfileField label="Full name">
              <input
                className={profileFieldClass}
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </ProfileField>
            <ProfileField label="Email">
              <input
                className={profileFieldClass}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </ProfileField>
            <ProfileField label="UCID">
              <input
                className={profileFieldClass}
                value={ucid}
                onChange={(e) => setUcid(e.target.value)}
                placeholder="e.g. 30123456"
              />
            </ProfileField>
            <ProfileField label="Date of birth (private)">
              <input
                className={profileFieldClass}
                type="date"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </ProfileField>
          </div>

          <ProfileField label="Interesting thing about you">
            <textarea
              className={`${profileFieldClass} min-h-[80px] resize-y`}
              value={interesting}
              onChange={(e) => setInteresting(e.target.value)}
              placeholder="Something fun the crew should know…"
            />
          </ProfileField>

          <ProfileField label="Public bio (Team page)">
            <textarea
              className={`${profileFieldClass} min-h-[96px] resize-y`}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              maxLength={280}
              placeholder="Short description shown on /team"
            />
            <p className="mt-1 font-mono text-[10px] text-[var(--admin-muted)] text-right">
              {bio.length}/280
            </p>
          </ProfileField>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ProfileField label="LinkedIn URL">
              <input
                className={profileFieldClass}
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/..."
              />
            </ProfileField>
            <ProfileField label="Portfolio website">
              <input
                className={profileFieldClass}
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yoursite.com"
              />
            </ProfileField>
            <ProfileField label="Subteam">
              <select
                className={profileFieldClass}
                value={subteam}
                onChange={(e) => setSubteam(e.target.value as Subteam | "")}
              >
                <option value="">Select…</option>
                {SUBTEAMS.map((s) => (
                  <option key={s} value={s}>
                    {SUBTEAM_LABELS[s]}
                  </option>
                ))}
              </select>
              {member.role === "admin" && (
                <p className="mt-2 font-mono text-[10px] text-[var(--admin-muted)] leading-relaxed">
                  Captain tip: set a subteam (e.g. Geomatics) to also appear as
                  that subteam&apos;s lead on the Team page.
                </p>
              )}
            </ProfileField>
          </div>

          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isPublic}
              onChange={(e) => setIsPublic(e.target.checked)}
              className="mt-1 accent-[var(--admin-accent)]"
            />
            <span className="font-mono text-xs text-[var(--admin-muted)] leading-relaxed">
              Show me on the public{" "}
              <span className="text-[var(--admin-text)]">Team</span> page
            </span>
          </label>

          {error && (
            <p className="font-mono text-xs text-red-400">{error}</p>
          )}
          {message && (
            <p className="font-mono text-xs text-[var(--admin-accent)]">{message}</p>
          )}

          <div className="flex flex-col-reverse sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={() => refreshMember()}
              className="w-full sm:w-auto border border-[var(--admin-border)] px-5 py-3 font-mono text-[11px] uppercase tracking-widest text-[var(--admin-muted)] hover:text-[var(--admin-text)] hover:border-[var(--admin-muted)] transition-colors"
            >
              Refresh
            </button>
            <button
              type="submit"
              disabled={saving}
              className="w-full sm:flex-1 bg-[var(--admin-accent)] text-white px-5 py-3 font-mono text-[11px] uppercase tracking-widest hover:brightness-110 disabled:opacity-60 transition"
            >
              {saving ? "Saving…" : "Save profile"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
