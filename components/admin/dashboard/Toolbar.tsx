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
        flex: 1, minWidth: 200, background: "#1E293B", border: "1px solid #334155",
        color: "#F1F5F9", fontFamily: "monospace", fontSize: 12,
        padding: "9px 14px", outline: "none",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#E8512A")}
      onBlur={(e) => (e.target.style.borderColor = "#1A2535")}
    />
    <select
      value={sortBy}
      onChange={(e) => setSortBy(e.target.value as SortOption)}
      style={{ background: "#0D1220", border: "1px solid #1A2535", color: "#8899BB", fontFamily: "monospace", fontSize: 11, padding: "9px 12px", outline: "none", cursor: "pointer" }}
    >
      <option value="newest">Newest First</option>
      <option value="oldest">Oldest First</option>
      <option value="name">Name A→Z</option>
    </select>
    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#334455", letterSpacing: "0.1em" }}>
      {resultCount} result{resultCount !== 1 ? "s" : ""}
    </div>
  </div>
);
