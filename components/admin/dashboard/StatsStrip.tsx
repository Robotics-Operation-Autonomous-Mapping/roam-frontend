"use client";

import React from "react";

interface StatsStripProps {
  stats: {
    total: number;
    pending: number;
    interview: number;
    accepted: number;
  };
}

export const StatsStrip: React.FC<StatsStripProps> = ({ stats }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      borderBottom: "1px solid var(--admin-border)",
      background: "var(--admin-bg-dark)",
    }}
  >
    {[
      {
        label: "TOTAL APPLICATIONS",
        val: stats.total,
        color: "var(--admin-text)",
      },
      {
        label: "PENDING REVIEW",
        val: stats.pending,
        color: "rgba(var(--status-pending-rgb), 1)",
      },
      {
        label: "INTERVIEWS",
        val: stats.interview,
        color: "rgba(var(--status-interview-rgb), 1)",
      },
      {
        label: "ACCEPTED",
        val: stats.accepted,
        color: "rgba(var(--status-accepted-rgb), 1)",
      },
    ].map((s, i) => (
      <div
        key={s.label}
        style={{
          padding: "16px 24px",
          borderRight: i === 3 ? "none" : "1px solid var(--admin-border)",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span
          style={{
            fontSize: 9,
            letterSpacing: "0.2em",
            color: "var(--admin-muted)",
            fontFamily: "monospace",
          }}
        >
          {s.label}
        </span>
        <span style={{ fontSize: 20, color: s.color, fontFamily: "monospace" }}>
          {s.val}
        </span>
      </div>
    ))}
  </div>
);
