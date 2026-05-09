"use client";

import React from "react";
import { SortOption } from "./types";

interface ToolbarProps {
  search: string;
  setSearch: (s: string) => void;
  sortBy: SortOption;
  setSortBy: (s: SortOption) => void;
  resultCount: number;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  search,
  setSearch,
  sortBy,
  setSortBy,
  resultCount,
}) => (
  <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
    <input
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      placeholder="Search name, UCID, email..."
      style={{
        flex: 1, minWidth: 200, background: "var(--admin-surface)", border: "1px solid var(--admin-border)",
        color: "var(--admin-text)", fontFamily: "monospace", fontSize: 12,
        padding: "9px 14px", outline: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "var(--admin-accent)")}
      onBlur={(e) => (e.target.style.borderColor = "var(--admin-border)")}
    />
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as SortOption)}
      style={{ 
        background: "var(--admin-bg-dark)", 
        border: "1px solid var(--admin-border)", 
        color: "var(--admin-muted)", 
        fontFamily: "monospace", 
        fontSize: 11, 
        padding: "9px 12px", 
        outline: "none", 
        cursor: "pointer" 
      }}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="name">Name A→Z</option>
    </select>
    <div style={{ fontFamily: "monospace", fontSize: 10, color: "var(--admin-muted)", letterSpacing: "0.1em" }}>
      {resultCount} result{resultCount !== 1 ? "s" : ""}
    </div>
  </div>
);
