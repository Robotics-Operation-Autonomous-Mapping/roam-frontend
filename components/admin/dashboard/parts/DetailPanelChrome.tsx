import React from "react";

export const Section = ({
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

export const DetailGroup = ({
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

export const linkBtnStyle: React.CSSProperties = {
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
