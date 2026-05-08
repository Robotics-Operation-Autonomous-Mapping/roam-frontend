"use client";

import React from "react";
import { AppStatus } from "@/lib/supabase/client";
import { ALL_STATUSES, STATUS_COLORS } from "./constants";
import { DEPARTMENTS as FORM_DEPARTMENTS } from "@/components/sections/application/constants";

interface SidebarProps {
  currentDept: string;
  setDept: (d: string) => void;
  statusFilter: AppStatus | "all";
  setStatusFilter: (s: AppStatus | "all") => void;
  deptCounts: Record<string, number>;
}

const DEPARTMENTS = ["All", ...FORM_DEPARTMENTS];

export const Sidebar: React.FC<SidebarProps> = ({
  currentDept,
  setDept,
  statusFilter,
  setStatusFilter,
  deptCounts,
}) => (
  <aside
    style={{
      width: 240,
      borderRight: "1px solid var(--admin-border)",
      padding: "24px 18px",
      display: "flex",
      flexDirection: "column",
      gap: 32,
      background: "var(--admin-bg-dark)",
    }}
  >
    {/* Depts */}
    <div>
      <h3
        style={{
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "var(--admin-muted)",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Departments
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {DEPARTMENTS.map((d) => (
          <button
            key={d}
            onClick={() => setDept(d)}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              background:
                currentDept === d ? "rgba(232,81,42,0.1)" : "transparent",
              border: "none",
              color: currentDept === d ? "var(--admin-accent)" : "var(--status-pending-rgb)",
              fontFamily: "monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{d}</span>
            {d !== "All" && deptCounts[d] > 0 && (
              <span style={{ opacity: 0.4 }}>{deptCounts[d]}</span>
            )}
          </button>
        ))}
      </div>
    </div>

    {/* Status */}
    <div>
      <h3
        style={{
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "var(--admin-muted)",
          marginBottom: 16,
          textTransform: "uppercase",
        }}
      >
        Application Status
      </h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <button
          onClick={() => setStatusFilter("all")}
          style={{
            textAlign: "left",
            padding: "8px 12px",
            background:
              statusFilter === "all" ? "var(--admin-surface)" : "transparent",
            border: "none",
            color:
              statusFilter === "all" ? "var(--admin-text)" : "var(--admin-muted)",
            fontFamily: "monospace",
            fontSize: 11,
            cursor: "pointer",
          }}
        >
          All Applications
        </button>
        {ALL_STATUSES.map((s) => {
          const color = STATUS_COLORS[s];
          // Use the RGB variable directly for the background transparency
          const bg =
            statusFilter === s
              ? color.replace("1)", "0.15)")
              : "transparent";

          return (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              style={{
                textAlign: "left",
                padding: "8px 12px",
                background: bg,
                border: "none",
                color: statusFilter === s ? color : "var(--admin-muted)",
                fontFamily: "monospace",
                fontSize: 11,
                cursor: "pointer",
              }}
            >
              {s.toUpperCase()}
            </button>
          );
        })}
      </div>
    </div>
  </aside>
);
