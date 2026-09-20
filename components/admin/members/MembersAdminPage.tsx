"use client";

import React, { useCallback, useEffect, useState } from "react";
import { type Member } from "@/lib/members/types";
import { SUBTEAM_LABELS } from "@/lib/members/constants";
import {
  inputStyle,
  labelStyle,
  panelStyle,
  primaryBtnStyle,
} from "@/components/admin/email/adminFormStyles";
import { MemberEditPanel } from "./parts/MemberEditPanel";

export function MembersAdminPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Member | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/members");
    const data = await res.json().catch(() => ({}));
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "Failed to load members");
      return;
    }
    setMembers(data.members as Member[]);
    setError("");
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSelected = async () => {
    if (!selected) return;
    setMessage("");
    setError("");
    const res = await fetch(`/api/members/${selected.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        full_name: selected.full_name,
        email: selected.email,
        ucid: selected.ucid,
        title: selected.title,
        role: selected.role,
        subteam: selected.subteam,
        is_public: selected.is_public,
        sort_order: selected.sort_order,
        bio: selected.bio,
        linkedin_url: selected.linkedin_url,
        portfolio_url: selected.portfolio_url,
        interesting_thing: selected.interesting_thing,
        date_of_birth: selected.date_of_birth,
      }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Update failed");
      return;
    }
    setMessage("Member updated.");
    setSelected(data.member);
    await load();
  };

  const createMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/members", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: newName, email: newEmail }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Create failed");
      return;
    }
    setNewName("");
    setNewEmail("");
    setMessage("Member created. They can link via Clerk signup with the same email.");
    await load();
    setSelected(data.member);
  };

  const removeMember = async (id: string) => {
    if (!confirm("Delete this member row?")) return;
    const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(data.error || "Delete failed");
      return;
    }
    setSelected(null);
    await load();
  };

  return (
    <div className="w-full px-4 py-6 sm:px-6 sm:py-8 mx-auto max-w-6xl space-y-5">
      <div>
        <h1 className="font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--admin-accent)] mb-2">
          All Members
        </h1>
        <p className="text-sm text-[var(--admin-muted)]">
          Assign roles and subteams. Only one lead per subteam.
        </p>
      </div>

      <form
        onSubmit={createMember}
        style={panelStyle}
        className="flex flex-col sm:flex-row gap-3 sm:items-end"
      >
        <div className="flex-1 min-w-0 w-full">
          <label style={labelStyle}>Name</label>
          <input style={inputStyle} value={newName} onChange={(e) => setNewName(e.target.value)} required />
        </div>
        <div className="flex-1 min-w-0 w-full">
          <label style={labelStyle}>Email</label>
          <input
            style={inputStyle}
            type="email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            required
          />
        </div>
        <button type="submit" style={primaryBtnStyle} className="w-full sm:w-auto shrink-0">
          ADD MEMBER
        </button>
      </form>

      {error && (
        <p style={{ color: "#ff6b6b", fontSize: 12, fontFamily: "monospace" }}>{error}</p>
      )}
      {message && (
        <p style={{ color: "var(--admin-accent)", fontSize: 12, fontFamily: "monospace" }}>
          {message}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div style={{ ...panelStyle, padding: 0, overflow: "hidden" }}>
          {loading ? (
            <p style={{ padding: 16, fontFamily: "monospace", fontSize: 11 }}>LOADING…</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, maxHeight: 560, overflow: "auto" }}>
              {members.map((m) => (
                <li key={m.id}>
                  <button
                    type="button"
                    onClick={() => setSelected(m)}
                    style={{
                      width: "100%",
                      textAlign: "left",
                      padding: "12px 14px",
                      border: "none",
                      borderBottom: "1px solid var(--admin-border)",
                      background:
                        selected?.id === m.id
                          ? "rgba(232,81,42,0.12)"
                          : "transparent",
                      color: "var(--admin-text)",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ fontSize: 13 }}>{m.full_name || "(unnamed)"}</div>
                    <div
                      style={{
                        fontSize: 10,
                        fontFamily: "monospace",
                        color: "var(--admin-muted)",
                        marginTop: 4,
                      }}
                    >
                      {m.role.toUpperCase()}
                      {m.subteam ? ` · ${SUBTEAM_LABELS[m.subteam]}` : ""}
                      {m.is_public ? " · PUBLIC" : ""}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {selected ? (
          <MemberEditPanel
            selected={selected}
            setSelected={setSelected}
            onSave={saveSelected}
            onRemove={removeMember}
          />
        ) : (
          <div style={{ ...panelStyle, color: "var(--admin-muted)", fontSize: 13 }} className="hidden lg:block">
            Select a member to edit.
          </div>
        )}
      </div>
    </div>
  );
}
