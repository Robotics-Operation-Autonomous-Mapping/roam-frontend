import type { CSSProperties } from "react";

export const labelStyle: CSSProperties = {
  display: "block",
  fontSize: 9,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "var(--admin-muted)",
  marginBottom: 6,
};

export const inputStyle: CSSProperties = {
  width: "100%",
  background: "var(--admin-bg)",
  border: "1px solid var(--admin-border)",
  color: "var(--admin-text)",
  fontFamily: "monospace",
  fontSize: 12,
  padding: "10px 12px",
  outline: "none",
  boxSizing: "border-box",
};

export const panelStyle: CSSProperties = {
  border: "1px solid var(--admin-border)",
  background: "var(--admin-bg-dark)",
  padding: "24px",
};

export const primaryBtnStyle: CSSProperties = {
  background: "var(--admin-accent)",
  color: "#fff",
  border: "none",
  fontFamily: "monospace",
  fontSize: 11,
  letterSpacing: "0.15em",
  textTransform: "uppercase",
  padding: "12px 24px",
  cursor: "pointer",
};

export const ghostBtnStyle: CSSProperties = {
  background: "transparent",
  color: "var(--admin-muted)",
  border: "1px solid var(--admin-border)",
  fontFamily: "monospace",
  fontSize: 10,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  padding: "8px 12px",
  cursor: "pointer",
};
