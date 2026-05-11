"use client";

import React, { useState } from "react";
import { Application, AppStatus, supabase } from "@/lib/supabase/client";
import { ALL_STATUSES, STATUS_COLORS } from "./constants";
import { StatusBadge } from "./common/StatusBadge";
import { DeptTag } from "./common/DeptTag";

interface DetailPanelProps {
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: AppStatus, notes: string) => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({
  app,
  onClose,
  onStatusChange,
}) => {
  const [notes, setNotes] = useState(app.reviewer_notes || "");
  const [saving, setSaving] = useState(false);

  const handleUpdate = async (newStatus: AppStatus) => {
    setSaving(true);
    await onStatusChange(app.id, newStatus, notes);
    setSaving(false);
  };

  const getResumeUrl = () => {
    if (!app.resume_path) return null;
    const { data } = supabase.storage
      .from("resumes")
      .getPublicUrl(app.resume_path);
    return data.publicUrl;
  };

  const ensureAbsoluteUrl = (url: string) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    return `https://${url}`;
  };

  return (
    <div
      style={{
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "80%",
        height: "80%",
        background: "var(--admin-bg)",
        border: "1px solid var(--admin-border)",
        zIndex: 100,
        display: "flex",
        flexDirection: "column",
        boxShadow: "0 20px 50px rgba(0,0,0,0.8)",
        borderRadius: "12px",
        overflow: "hidden",
        animation: "modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      <style>{`
        @keyframes modalEnter {
          from { opacity: 0; transform: translate(-50%, -45%) scale(0.95); }
          to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
      `}</style>
      {/* Header */}
      <div
        style={{
          padding: "24px 32px",
          borderBottom: "1px solid var(--admin-border)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          background: "var(--admin-bg-dark)",
        }}
      >
        <div>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              color: "var(--admin-text)",
              margin: "0 0 8px 0",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
            }}
          >
            {app.full_name}
          </h2>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <StatusBadge status={app.status} />
            <DeptTag dept={app.department} />
            <span
              style={{
                fontSize: 11,
                color: "var(--admin-muted)",
                fontFamily: "monospace",
              }}
            >
              {app.ucid}
            </span>
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "transparent",
            border: "none",
            color: "var(--admin-muted)",
            fontSize: 24,
            cursor: "pointer",
            padding: 4,
          }}
        >
          ×
        </button>
      </div>

      <div style={{ flex: 1, overflowY: "auto", padding: "32px" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
          {/* Section: Academic */}
          <Section title="Academic & Contact">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <DetailGroup label="Degree" value={app.degree_program} />
              <DetailGroup label="Year" value={app.year_of_study} />
              <DetailGroup label="Univ. Email" value={app.university_email} />
              <DetailGroup
                label="Personal Email"
                value={app.personal_email ?? undefined}
              />
              <DetailGroup label="Phone" value={app.phone ?? undefined} />
            </div>
          </Section>

          {/* Section: Motivation */}
          <Section title="Motivation & Goals">
            <div
              style={{ display: "flex", flexDirection: "column", gap: "24px" }}
            >
              <DetailGroup label="Why ROAM?" value={app.why_join} isLongText />
              <DetailGroup
                label="Rover Excitement"
                value={app.rover_excitement}
                isLongText
              />
              <DetailGroup
                label="Hope to Learn"
                value={app.hope_to_learn}
                isLongText
              />
              <DetailGroup
                label="Previous Project"
                value={app.project_description}
                isLongText
              />
            </div>
          </Section>

          {/* Section: Technical */}
          <Section title="Technical Profile">
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {Object.entries(app.technical_answers).map(([key, val]) => (
                <DetailGroup
                  key={key}
                  label={key.replace(/_/g, " ")}
                  value={val}
                  isLongText
                />
              ))}
            </div>
          </Section>

          {/* Section: Commitment & Fit */}
          <Section title="Commitment & Fit">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "24px",
              }}
            >
              <DetailGroup label="Hours/Week" value={app.hours_per_week} />
              <DetailGroup
                label="Attend Meetings?"
                value={app.attend_meetings}
              />
              <DetailGroup
                label="Intense Periods?"
                value={app.intense_periods}
              />
              <DetailGroup label="Other Clubs?" value={app.other_clubs} />
            </div>
            {app.which_clubs && (
              <div style={{ marginTop: 24 }}>
                <DetailGroup
                  label="Which Clubs"
                  value={app.which_clubs}
                  isLongText
                />
              </div>
            )}
            <div style={{ marginTop: 24 }}>
              <DetailGroup
                label="Team Environment"
                value={app.team_environment}
                isLongText
              />
            </div>
          </Section>

          {/* Section: Culture & Personality */}
          <Section title="Culture & Personality">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: "24px",
              }}
            >
              <DetailGroup label="Hobbies" value={app.hobbies} isLongText />
              <DetailGroup
                label="Favorite Song"
                value={app.favorite_song ?? undefined}
                isLongText
              />
              <DetailGroup
                label="Interesting Thing"
                value={app.interesting_thing}
                isLongText
              />
              <DetailGroup
                label="Why Bet On You?"
                value={app.why_bet_on_you}
                isLongText
              />
            </div>
          </Section>

          {/* Section: Documents & Links */}
          <Section title="Links">
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
              {getResumeUrl() && (
                <a
                  href={getResumeUrl()!}
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtnStyle}
                >
                  VIEW RESUME 📄
                </a>
              )}
              {app.linkedin && (
                <a
                  href={ensureAbsoluteUrl(app.linkedin)}
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtnStyle}
                >
                  LINKEDIN
                </a>
              )}
              {app.github && (
                <a
                  href={ensureAbsoluteUrl(app.github)}
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtnStyle}
                >
                  GITHUB
                </a>
              )}
              {app.portfolio && (
                <a
                  href={ensureAbsoluteUrl(app.portfolio)}
                  target="_blank"
                  rel="noreferrer"
                  style={linkBtnStyle}
                >
                  PORTFOLIO
                </a>
              )}
            </div>
          </Section>
        </div>
      </div>

      {/* Footer: Admin Actions */}
      <div
        style={{
          padding: "24px 32px",
          borderTop: "1px solid var(--admin-border)",
          background: "var(--admin-bg-dark)",
        }}
      >
        <div style={{ marginBottom: 16 }}>
          <label
            style={{
              fontSize: 10,
              color: "var(--admin-muted)",
              display: "block",
              marginBottom: 8,
              fontFamily: "monospace",
              letterSpacing: "0.1em",
            }}
          >
            REVIEWER NOTES
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter evaluation notes..."
            style={{
              width: "100%",
              minHeight: 50,
              background: "var(--admin-surface)",
              border: "1px solid var(--admin-border)",
              color: "var(--admin-text)",
              padding: 12,
              fontFamily: "sans-serif",
              fontSize: 13,
              borderRadius: 4,
              resize: "vertical",
            }}
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {ALL_STATUSES.map((status) => (
            <button
              key={status}
              onClick={() => handleUpdate(status)}
              disabled={saving}
              style={{
                padding: "8px 12px",
                background:
                  app.status === status ? STATUS_COLORS[status] : "transparent",
                border: `1px solid ${
                  app.status === status ? "transparent" : "var(--admin-border)"
                }`,
                color: app.status === status ? "#fff" : "var(--admin-muted)",
                fontFamily: "monospace",
                fontSize: 10,
                cursor: saving ? "wait" : "pointer",
                borderRadius: 2,
                textTransform: "uppercase",
                letterSpacing: "0.05em",
                transition: "all 0.2s",
              }}
            >
              {status}
            </button>
          ))}
        </div>
        {app.reviewed_at && (
          <div
            style={{
              marginTop: 16,
              fontSize: 10,
              color: "var(--admin-muted)",
              textAlign: "right",
              fontFamily: "monospace",
              opacity: 0.5,
            }}
          >
            LAST ACTION BY {app.reviewed_by?.split("@")[0].toUpperCase()} AT{" "}
            {new Date(app.reviewed_at).toLocaleString()}
          </div>
        )}
      </div>
    </div>
  );
};

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div>
    <h3
      style={{
        fontSize: 11,
        letterSpacing: "0.2em",
        color: "var(--admin-accent)",
        textTransform: "uppercase",
        borderBottom: "1px solid var(--admin-border)",
        paddingBottom: 8,
        marginBottom: 20,
        fontFamily: "monospace",
      }}
    >
      {title}
    </h3>
    {children}
  </div>
);

const DetailGroup = ({
  label,
  value,
  isLongText,
}: {
  label: string;
  value?: string | number;
  isLongText?: boolean;
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
    <span
      style={{
        fontSize: 9,
        color: "var(--admin-muted)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        fontFamily: "monospace",
      }}
    >
      {label}
    </span>
    <div
      style={{
        fontSize: isLongText ? 13 : 14,
        color: "var(--admin-text)",
        fontFamily: isLongText ? "sans-serif" : "monospace",
        lineHeight: 1.6,
        whiteSpace: isLongText ? "pre-wrap" : "nowrap",
        background: isLongText ? "rgba(255,255,255,0.02)" : "transparent",
        padding: isLongText ? "12px" : "0",
        border: isLongText ? "1px solid var(--admin-border)" : "none",
        borderRadius: isLongText ? 4 : 0,
      }}
    >
      {value || "—"}
    </div>
  </div>
);

const linkBtnStyle: React.CSSProperties = {
  padding: "8px 16px",
  background: "var(--admin-surface)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
  fontSize: 10,
  fontFamily: "monospace",
  textDecoration: "none",
  borderRadius: 4,
  letterSpacing: "0.1em",
  transition: "all 0.2s",
};
