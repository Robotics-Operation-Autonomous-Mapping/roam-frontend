"use client";

import React from "react";

interface TopBarProps {
  userEmail: string;
  onRefresh: () => void;
  onLogout: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  userEmail,
  onRefresh,
  onLogout,
}) => (
  <header
    style={{
      padding: "16px 24px",
      borderBottom: "1px solid var(--admin-border)",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      background: "#0D1220",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
      <div
        style={{
          width: 10,
          height: 10,
          background: "var(--admin-accent)",
          borderRadius: "50%",
        }}
      />
      <span
        style={{
          fontFamily: "monospace",
          fontSize: 13,
          letterSpacing: "0.15em",
          color: "var(--admin-text)",
        }}
      >
        ROAM ADMIN PORTAL — V1.0
      </span>
    </div>
    <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
      <button
        onClick={onRefresh}
        style={{
          background: "transparent",
          border: "none",
          color: "rgba(var(--status-reviewed-rgb), 1)",
          cursor: "pointer",
          fontFamily: "monospace",
          fontSize: 10,
          letterSpacing: "0.1em",
        }}
      >
        REFRESH_DATA
      </button>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <span
          style={{
            fontSize: 11,
            color: "var(--admin-muted)",
            fontFamily: "monospace",
          }}
        >
          {userEmail}
        </span>
        <button
          onClick={onLogout}
          style={{
            background: "var(--admin-surface)",
            color: "var(--admin-muted)",
            border: "none",
            padding: "6px 12px",
            fontFamily: "monospace",
            fontSize: 10,
            cursor: "pointer",
          }}
        >
          LOGOUT
        </button>
      </div>
    </div>
  </header>
);
