"use client";

import React from "react";
import {
  MEMBER_ROLES,
  SUBTEAMS,
  type Member,
  type MemberRole,
  type Subteam,
} from "@/lib/members/types";
import { SUBTEAM_LABELS } from "@/lib/members/constants";
import { memberPhotoUrl } from "@/lib/members/photo";
import {
  ghostBtnStyle,
  inputStyle,
  panelStyle,
  primaryBtnStyle,
} from "@/components/admin/email/adminFormStyles";
import { Field } from "./MemberField";

export function MemberEditPanel({
  selected,
  setSelected,
  onSave,
  onRemove,
}: {
  selected: Member;
  setSelected: (member: Member) => void;
  onSave: () => void;
  onRemove: (id: string) => void;
}) {
  return (
    <div style={{ ...panelStyle, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <div
          style={{
            width: 64,
            height: 64,
            border: "1px solid var(--admin-border)",
            overflow: "hidden",
            flexShrink: 0,
          }}
        >
          {memberPhotoUrl(selected.photo_path) ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={memberPhotoUrl(selected.photo_path)!}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          ) : null}
        </div>
        <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--admin-muted)" }}>
          {selected.clerk_user_id ? "Clerk linked" : "Awaiting Clerk signup"}
        </div>
      </div>

      <Field label="Full name">
        <input
          style={inputStyle}
          value={selected.full_name}
          onChange={(e) =>
            setSelected({ ...selected, full_name: e.target.value })
          }
        />
      </Field>
      <Field label="Email (primary)">
        <input
          style={inputStyle}
          value={selected.email}
          onChange={(e) => setSelected({ ...selected, email: e.target.value })}
          placeholder="name@ucalgary.ca"
        />
      </Field>
      <Field label="University email">
        <input
          style={inputStyle}
          value={selected.university_email ?? ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              university_email: e.target.value.trim()
                ? e.target.value
                : null,
            })
          }
          placeholder="name@ucalgary.ca"
        />
      </Field>
      <Field label="Personal email">
        <input
          style={inputStyle}
          value={selected.personal_email ?? ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              personal_email: e.target.value.trim()
                ? e.target.value
                : null,
            })
          }
          placeholder="name@gmail.com"
        />
      </Field>
      <Field label="Title">
        <input
          style={inputStyle}
          value={selected.title ?? ""}
          onChange={(e) =>
            setSelected({ ...selected, title: e.target.value || null })
          }
          placeholder="Team Captain & Geomatics Lead"
        />
      </Field>
      <Field label="Portfolio URL">
        <input
          style={inputStyle}
          value={selected.portfolio_url ?? ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              portfolio_url: e.target.value || null,
            })
          }
          placeholder="https://yoursite.com"
        />
      </Field>
      <Field label="LinkedIn URL">
        <input
          style={inputStyle}
          value={selected.linkedin_url ?? ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              linkedin_url: e.target.value || null,
            })
          }
          placeholder="https://linkedin.com/in/..."
        />
      </Field>
      <Field label="Role">
        <select
          style={inputStyle}
          value={selected.role}
          onChange={(e) =>
            setSelected({
              ...selected,
              role: e.target.value as MemberRole,
            })
          }
        >
          {MEMBER_ROLES.map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Subteam">
        <select
          style={inputStyle}
          value={selected.subteam ?? ""}
          onChange={(e) =>
            setSelected({
              ...selected,
              subteam: (e.target.value || null) as Subteam | null,
            })
          }
        >
          <option value="">—</option>
          {SUBTEAMS.map((s) => (
            <option key={s} value={s}>
              {SUBTEAM_LABELS[s]}
            </option>
          ))}
        </select>
        {selected.role === "admin" && (
          <p style={{ fontSize: 10, color: "var(--admin-muted)", marginTop: 6, fontFamily: "monospace" }}>
            Admin + subteam = Captain section and that subteam&apos;s lead card.
          </p>
        )}
      </Field>
      <Field label="Sort order">
        <input
          style={inputStyle}
          type="number"
          value={selected.sort_order}
          onChange={(e) =>
            setSelected({
              ...selected,
              sort_order: Number(e.target.value) || 0,
            })
          }
        />
      </Field>
      <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 12 }}>
        <input
          type="checkbox"
          checked={selected.is_public}
          onChange={(e) =>
            setSelected({ ...selected, is_public: e.target.checked })
          }
        />
        Public on Team page
      </label>

      <div className="flex flex-col sm:flex-row gap-2">
        <button type="button" style={primaryBtnStyle} onClick={onSave} className="w-full sm:w-auto">
          SAVE
        </button>
        <button
          type="button"
          style={ghostBtnStyle}
          onClick={() => onRemove(selected.id)}
          className="w-full sm:w-auto"
        >
          DELETE
        </button>
      </div>
    </div>
  );
}
