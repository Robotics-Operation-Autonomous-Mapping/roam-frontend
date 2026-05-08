"use client";

import React from "react";
import { Application } from "@/lib/supabase/client";
import { timeAgo } from "./helpers";
import { StatusBadge } from "./common/StatusBadge";
import { DeptTag } from "./common/DeptTag";

interface ApplicationListProps {
  apps: Application[];
  selectedId?: string;
  onSelect: (app: Application) => void;
}

export const ApplicationList: React.FC<ApplicationListProps> = ({
  apps,
  selectedId,
  onSelect,
}) => (
  <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
    {apps.map((app) => (
      <div
        key={app.id}
        onClick={() => onSelect(app)}
        style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto auto",
          alignItems: "center",
          gap: 16,
          padding: "14px 18px",
          background:
            selectedId === app.id
              ? "rgba(232,81,42,0.12)"
              : "var(--admin-surface)",
          border: `1px solid ${
            selectedId === app.id
              ? "rgba(232,81,42,0.4)"
              : "var(--admin-surface-2)"
          }`,
          cursor: "pointer",
          transition: "all 0.15s",
        }}
      >
        {/* Left: name + meta */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 4,
            }}
          >
            <span
              style={{
                fontFamily: "'Georgia', serif",
                fontSize: 14,
                color: "var(--admin-text)",
              }}
            >
              {app.full_name}
            </span>
            <DeptTag dept={app.department} />
          </div>
          <div
            style={{
              fontFamily: "monospace",
              fontSize: 10,
              color: "var(--admin-muted)",
            }}
          >
            {app.ucid} · {app.degree_program} · {app.year_of_study}
          </div>
        </div>

        {/* Resume indicator */}
        {app.resume_path && (
          <span
            style={{
              fontFamily: "monospace",
              fontSize: 9,
              color: "var(--admin-muted)",
              letterSpacing: "0.1em",
            }}
          >
            📄
          </span>
        )}

        {/* Status */}
        <StatusBadge status={app.status} />

        {/* Time */}
        <div
          style={{
            fontFamily: "monospace",
            fontSize: 10,
            color: "var(--admin-muted)",
            textAlign: "right",
            whiteSpace: "nowrap",
            opacity: 0.6,
          }}
        >
          {timeAgo(app.created_at)}
        </div>
      </div>
    ))}
  </div>
);
