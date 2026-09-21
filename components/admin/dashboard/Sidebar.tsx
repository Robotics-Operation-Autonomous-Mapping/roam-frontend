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
  /** When set, only these departments (+ All) appear in the filter list. */
  allowedDepartments?: string[];
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentDept,
  setDept,
  statusFilter,
  setStatusFilter,
  deptCounts,
  allowedDepartments,
}) => {
  const departments = [
    "All",
    ...(allowedDepartments?.length
      ? FORM_DEPARTMENTS.filter((d) => allowedDepartments.includes(d))
      : FORM_DEPARTMENTS),
  ];

  return (
  <aside
    className="w-full md:w-60 shrink-0 border-b md:border-b-0 md:border-r border-[var(--admin-border)] bg-[var(--admin-bg-dark)] p-4 md:p-6 md:overflow-y-auto max-h-[40vh] md:max-h-none"
  >
    {/* Depts */}
    <div className="mb-6 md:mb-8">
      <h3
        style={{
          fontSize: 9,
          letterSpacing: "0.25em",
          color: "var(--admin-muted)",
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Departments
      </h3>
      <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
        {departments.map((d) => (
          <button
            key={d}
            onClick={() => setDept(d)}
            style={{
              textAlign: "left",
              padding: "8px 12px",
              background:
                currentDept === d ? "rgba(232,81,42,0.1)" : "transparent",
              border: "none",
              color:
                currentDept === d
                  ? "var(--admin-accent)"
                  : "var(--status-pending-rgb)",
              fontFamily: "monospace",
              fontSize: 11,
              cursor: "pointer",
              display: "flex",
              justifyContent: "space-between",
              gap: 8,
              whiteSpace: "nowrap",
              flexShrink: 0,
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
          marginBottom: 12,
          textTransform: "uppercase",
        }}
      >
        Application Status
      </h3>
      <div className="flex md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
        <button
          onClick={() => setStatusFilter("all")}
          style={{
            textAlign: "left",
            padding: "8px 12px",
            background:
              statusFilter === "all" ? "var(--admin-surface)" : "transparent",
            border: "none",
            color:
              statusFilter === "all"
                ? "var(--admin-text)"
                : "var(--admin-muted)",
            fontFamily: "monospace",
            fontSize: 11,
            cursor: "pointer",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          All Applications
        </button>
        {ALL_STATUSES.map((s) => {
          const color = STATUS_COLORS[s];
          const bg =
            statusFilter === s ? color.replace("1)", "0.15)") : "transparent";

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
                whiteSpace: "nowrap",
                flexShrink: 0,
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
};
