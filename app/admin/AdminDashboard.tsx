"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, Application, AppStatus } from "@/lib/supabase/client";

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPARTMENTS = [
  "All",
  "Mechanical Engineering",
  "Electrical Engineering",
  "Computer Engineering",
  "Software Development",
  "Geomatics",
  "Mechatronics",
  "Business / Operations",
  "Content & Media",
];

const DEPT_SHORT: Record<string, string> = {
  "Mechanical Engineering": "Mech",
  "Electrical Engineering": "Elec",
  "Computer Engineering":   "CompE",
  "Software Development":   "SWE",
  "Geomatics":              "Geo",
  "Mechatronics":           "Mech+",
  "Business / Operations":  "Biz",
  "Content & Media":        "Media",
};

const STATUS_COLORS: Record<AppStatus, { bg: string; text: string; border: string }> = {
  pending:    { bg: "rgba(100,120,160,0.12)", text: "#8899BB", border: "#1E2D45" },
  reviewed:   { bg: "rgba(59,130,246,0.12)",  text: "#60A5FA", border: "#1E3A6E" },
  interview:  { bg: "rgba(245,158,11,0.12)",  text: "#FBBF24", border: "#4A3000" },
  accepted:   { bg: "rgba(34,197,94,0.12)",   text: "#4ADE80", border: "#0F3020" },
  rejected:   { bg: "rgba(239,68,68,0.12)",   text: "#F87171", border: "#3A0F0F" },
  waitlisted: { bg: "rgba(168,85,247,0.12)",  text: "#C084FC", border: "#2D1A45" },
};

const ALL_STATUSES: AppStatus[] = ["pending", "reviewed", "interview", "accepted", "rejected", "waitlisted"];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function fmtDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-CA", {
    year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit",
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const StatusBadge: React.FC<{ status: AppStatus }> = ({ status }) => {
  const c = STATUS_COLORS[status];
  return (
    <span style={{
      fontSize: 9, letterSpacing: "0.16em", textTransform: "uppercase",
      fontFamily: "monospace", padding: "3px 8px",
      background: c.bg, color: c.text, border: `1px solid ${c.border}`,
    }}>
      {status}
    </span>
  );
};

const DeptTag: React.FC<{ dept: string }> = ({ dept }) => (
  <span style={{
    fontSize: 9, letterSpacing: "0.12em", textTransform: "uppercase",
    fontFamily: "monospace", padding: "2px 7px",
    background: "rgba(232,81,42,0.08)", color: "#E8512A", border: "1px solid rgba(232,81,42,0.2)",
  }}>
    {DEPT_SHORT[dept] ?? dept}
  </span>
);

// ─── Detail Panel Sub-components ──────────────────────────────────────────────
const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ marginBottom: 28 }}>
    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#E8512A", textTransform: "uppercase", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #111827" }}>
      {title}
    </div>
    {children}
  </div>
);

const Row: React.FC<{ label: string; value: string | null | undefined }> = ({ label, value }) => (
  <div style={{ display: "grid", gridTemplateColumns: "110px 1fr", gap: 8, marginBottom: 10, alignItems: "start" }}>
    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "#445566", textTransform: "uppercase", paddingTop: 2 }}>{label}</div>
    <div style={{ fontSize: 12, color: value ? "#C8D8E8" : "#334455", lineHeight: 1.6, fontFamily: "monospace" }}>{value || "—"}</div>
  </div>
);

const Answer: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{ marginBottom: 16 }}>
    <div style={{ fontSize: 10, letterSpacing: "0.1em", color: "#445566", textTransform: "uppercase", marginBottom: 5 }}>{label}</div>
    <div style={{ fontSize: 12, color: "#B0C0D0", lineHeight: 1.75, fontFamily: "monospace", background: "#080D18", padding: "10px 14px", border: "1px solid #111827" }}>{value || "—"}</div>
  </div>
);

function actionBtn(bg: string): React.CSSProperties {
  return {
    display: "inline-flex", alignItems: "center", gap: 6,
    fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em",
    textTransform: "uppercase", padding: "8px 14px", cursor: "pointer",
    background: "transparent", border: `1px solid ${bg}`, color: bg,
    transition: "all 0.15s",
  };
}

// ─── Detail Panel ─────────────────────────────────────────────────────────────
const DetailPanel: React.FC<{
  app: Application;
  onClose: () => void;
  onStatusChange: (id: string, status: AppStatus, notes: string) => Promise<void>;
  userEmail: string;
}> = ({ app, onClose, onStatusChange, userEmail }) => {
  const [status, setStatus]   = useState<AppStatus>(app.status);
  const [notes, setNotes]     = useState(app.reviewer_notes ?? "");
  const [saving, setSaving]   = useState(false);
  const [resumeLoading, setResumeLoading] = useState(false);

  const openResume = async () => {
    if (!app.resume_path) return;
    setResumeLoading(true);
    const { data, error } = await supabase.storage
      .from("resumes")
      .createSignedUrl(app.resume_path, 3600);
    setResumeLoading(false);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
    else alert(`Could not load resume: ${error?.message}`);
  };

  const save = async () => {
    setSaving(true);
    await onStatusChange(app.id, status, notes);
    setSaving(false);
    onClose();
  };

  return (
    <div style={{
      position: "fixed", top: "5vh", left: "50%", transform: "translateX(-50%)",
      width: "90vw", maxWidth: 1200, height: "90vh",
      background: "#111827", borderRadius: 4, border: "1px solid #334155",
      overflowY: "auto", zIndex: 50,
      boxShadow: "0 25px 80px rgba(0,0,0,0.8)",
      display: "flex", flexDirection: "column",
    }}>
      {/* Panel header */}
      <div style={{ padding: "20px 24px", borderBottom: "1px solid #111827", display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexShrink: 0 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
            <DeptTag dept={app.department} />
            <StatusBadge status={app.status} />
          </div>
          <h2 style={{ fontFamily: "'Georgia', serif", fontSize: 20, fontWeight: 400, color: "#D0E0F0", margin: 0 }}>
            {app.full_name}
          </h2>
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#445566", marginTop: 4 }}>
            {app.ucid} · {app.degree_program} · {app.year_of_study}
          </div>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#334455", cursor: "pointer", fontSize: 20, flexShrink: 0, padding: 4 }}>✕</button>
      </div>

      <div style={{ padding: "24px", flex: 1, overflowY: "auto" }}>

        {/* Quick actions */}
        <div style={{ display: "flex", gap: 10, marginBottom: 28, flexWrap: "wrap" }}>
          {app.resume_path && (
            <button onClick={openResume} disabled={resumeLoading} style={actionBtn("#E8512A")}>
              {resumeLoading ? "Loading..." : "📄 View Resume"}
            </button>
          )}
          {app.linkedin && (
            <a href={app.linkedin} target="_blank" rel="noreferrer" style={{ ...actionBtn("#2244AA"), textDecoration: "none" }}>
              🔗 LinkedIn
            </a>
          )}
          {app.github && (
            <a href={app.github} target="_blank" rel="noreferrer" style={{ ...actionBtn("#1E2D45"), textDecoration: "none" }}>
              💻 GitHub
            </a>
          )}
          {app.portfolio && (
            <a href={app.portfolio} target="_blank" rel="noreferrer" style={{ ...actionBtn("#1A2535"), textDecoration: "none" }}>
              🌐 Portfolio
            </a>
          )}
        </div>

        {/* Contact */}
        <Section title="Contact">
          <Row label="Email" value={app.university_email} />
          <Row label="Personal" value={app.personal_email} />
          <Row label="Phone" value={app.phone} />
          <Row label="Submitted" value={fmtDate(app.created_at)} />
        </Section>

        {/* Commitment */}
        <Section title="Commitment">
          <Row label="Hrs / Week" value={app.hours_per_week} />
          <Row label="Meetings" value={app.attend_meetings} />
          <Row label="Crunch" value={app.intense_periods} />
          <Row label="Other Clubs" value={app.other_clubs === "Yes" ? `Yes — ${app.which_clubs ?? ""}` : "No"} />
        </Section>

        {/* Motivation */}
        <Section title="Motivation">
          <Answer label="Why ROAM?" value={app.why_join} />
          <Answer label="Rover excitement" value={app.rover_excitement} />
          <Answer label="Hope to learn" value={app.hope_to_learn} />
          <Answer label="Project background" value={app.project_description} />
          <Answer label="Why bet on them" value={app.why_bet_on_you} />
        </Section>

        {/* Technical */}
        <Section title={`Technical — ${app.department}`}>
          {Object.entries(app.technical_answers ?? {}).map(([k, v]) => (
            <Answer key={k} label={k.replace(/_/g, " ")} value={v as string} />
          ))}
        </Section>

        {/* Culture */}
        <Section title="Culture Fit">
          <Answer label="Hobbies" value={app.hobbies} />
          <Answer label="Interesting thing" value={app.interesting_thing} />
          <Answer label="Team environment" value={app.team_environment} />
          {app.favorite_song && <Row label="Song / Artist" value={app.favorite_song} />}
        </Section>

        {/* Review panel */}
        <Section title="Review Decision">
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#445566", textTransform: "uppercase", marginBottom: 8 }}>
              Set Status
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {ALL_STATUSES.map((s) => {
                const c = STATUS_COLORS[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStatus(s)}
                    style={{
                      fontFamily: "monospace", fontSize: 10, letterSpacing: "0.12em",
                      textTransform: "uppercase", padding: "6px 14px", cursor: "pointer",
                      border: `1px solid ${status === s ? c.text : "#1A2535"}`,
                      background: status === s ? c.bg : "transparent",
                      color: status === s ? c.text : "#334455",
                      transition: "all 0.15s",
                    }}
                  >
                    {s}
                  </button>
                );
              })}
            </div>
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.12em", color: "#445566", textTransform: "uppercase", marginBottom: 8 }}>
              Reviewer Notes
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onWheel={(e) => e.stopPropagation()}
              onKeyDown={(e) => e.stopPropagation()}
              rows={4}
              placeholder="Add notes visible only to admins..."
              style={{
                width: "100%", background: "#0F172A", border: "1px solid #334155",
                color: "#F1F5F9", fontFamily: "monospace", fontSize: 12,
                padding: "10px 14px", outline: "none", resize: "vertical",
                lineHeight: 1.6, boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#E8512A")}
              onBlur={(e) => (e.target.style.borderColor = "#334155")}
            />
          </div>

          <button onClick={save} disabled={saving} style={actionBtn(saving ? "#1A2535" : "#E8512A")}>
            {saving ? "Saving..." : "Save Decision →"}
          </button>

          {app.reviewed_by && (
            <div style={{ marginTop: 12, fontSize: 10, color: "#2A3A50", fontFamily: "monospace" }}>
              Last reviewed by {app.reviewed_by} · {app.reviewed_at ? fmtDate(app.reviewed_at) : "—"}
            </div>
          )}
        </Section>
      </div>
    </div>
  );
};



// ─── Main Dashboard ───────────────────────────────────────────────────────────
export default function AdminDashboard({
  userEmail, onLogout,
}: {
  userEmail: string;
  onLogout: () => void;
}) {
  const [apps, setApps]           = useState<Application[]>([]);
  const [loading, setLoading]     = useState(true);
  const [dept, setDept]           = useState("All");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [search, setSearch]       = useState("");
  const [selected, setSelected]   = useState<Application | null>(null);
  const [sortBy, setSortBy]       = useState<"newest" | "oldest" | "name">("newest");
  const [notification, setNotification] = useState<{ msg: string; show: boolean }>({ msg: "", show: false });

  const notify = (msg: string) => {
    setNotification({ msg, show: true });
    setTimeout(() => setNotification({ msg: "", show: false }), 4000);
  };

  // ── Fetch all applications ───────────────────────────────
  const fetchApps = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) setApps(data as Application[]);
    setLoading(false);
  }, []);

  useEffect(() => { fetchApps(); }, [fetchApps]);

  // ── Status update ────────────────────────────────────────
  const handleStatusChange = async (id: string, status: AppStatus, notes: string) => {
    const { error } = await supabase
      .from("applications")
      .update({
        status,
        reviewer_notes: notes,
        reviewed_by: userEmail,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (!error) {
      setApps((prev: Application[]) => prev.map((a) => a.id === id ? { ...a, status, reviewer_notes: notes, reviewed_by: userEmail } : a));
      if (selected?.id === id) setSelected((prev: Application | null) => prev ? { ...prev, status, reviewer_notes: notes } : null);
      notify(`Reviewed by ${userEmail.split("@")[0]} at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`);
    }
  };

  // ── Filter + sort ────────────────────────────────────────
  const filtered = apps
    .filter((a) => dept === "All" || a.department === dept)
    .filter((a) => statusFilter === "all" || a.status === statusFilter)
    .filter((a) => {
      if (!search) return true;
      const q = search.toLowerCase();
      return (
        a.full_name.toLowerCase().includes(q) ||
        a.ucid.toLowerCase().includes(q) ||
        a.university_email.toLowerCase().includes(q) ||
        a.degree_program.toLowerCase().includes(q)
      );
    })
    .sort((a, b) => {
      if (sortBy === "newest") return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      if (sortBy === "oldest") return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      return a.full_name.localeCompare(b.full_name);
    });

  // ── Stats ────────────────────────────────────────────────
  const stats = {
    total:     apps.length,
    pending:   apps.filter((a) => a.status === "pending").length,
    interview: apps.filter((a) => a.status === "interview").length,
    accepted:  apps.filter((a) => a.status === "accepted").length,
  };

  const deptCounts: Record<string, number> = {};
  apps.forEach((a) => { deptCounts[a.department] = (deptCounts[a.department] ?? 0) + 1; });

  return (
    <div style={{ minHeight: "100vh", background: "#0F172A", color: "#F1F5F9", display: "flex", flexDirection: "column" }}>

      {/* ── Top bar ── */}
      <div style={{ background: "#1E293B", borderBottom: "1px solid #334155", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.22em", color: "#E8512A", textTransform: "uppercase" }}>
            ROAM // Admin Portal
          </div>
          <div style={{ width: 1, height: 18, background: "#1A2535" }} />
          <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334455" }}>
            {userEmail}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button onClick={fetchApps} style={{ ...topBtn, color: "#445566" }}>↻ Refresh</button>
          <button onClick={onLogout} style={{ ...topBtn, color: "#E8512A", borderColor: "#E8512A" }}>Sign Out</button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div style={{ background: "#111827", borderBottom: "1px solid #1E293B", padding: "14px 24px", display: "flex", gap: 32, flexWrap: "wrap" }}>
        {[
          { label: "Total",     value: stats.total,     color: "#8899BB" },
          { label: "Pending",   value: stats.pending,   color: "#8899BB" },
          { label: "Interview", value: stats.interview, color: "#FBBF24" },
          { label: "Accepted",  value: stats.accepted,  color: "#4ADE80" },
        ].map((s) => (
          <div key={s.label} style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span style={{ fontFamily: "monospace", fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</span>
            <span style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em", color: "#334455", textTransform: "uppercase" }}>{s.label}</span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        {/* ── Left sidebar ── */}
        <div style={{ width: 200, background: "#111827", borderRight: "1px solid #1E293B", padding: "20px 0", flexShrink: 0, overflowY: "auto" }}>
          <div style={{ padding: "0 16px 10px", fontSize: 9, letterSpacing: "0.2em", color: "#334455", textTransform: "uppercase" }}>
            Department
          </div>
          {DEPARTMENTS.map((d) => (
            <button
              key={d}
              onClick={() => setDept(d)}
              style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                width: "100%", padding: "9px 16px", background: "none",
                border: "none", cursor: "pointer", textAlign: "left",
                fontFamily: "monospace", fontSize: 11,
                color: dept === d ? "#E8512A" : "#445566",
                borderLeft: `2px solid ${dept === d ? "#E8512A" : "transparent"}`,
                transition: "all 0.15s",
              }}
            >
              <span>{d === "All" ? "All Departments" : DEPT_SHORT[d] ?? d}</span>
              {d !== "All" && deptCounts[d] != null && (
                <span style={{ fontSize: 10, color: dept === d ? "#E8512A" : "#223040", background: "#111827", padding: "1px 6px" }}>
                  {deptCounts[d]}
                </span>
              )}
            </button>
          ))}

          <div style={{ padding: "20px 16px 10px", fontSize: 9, letterSpacing: "0.2em", color: "#334455", textTransform: "uppercase" }}>
            Status
          </div>
          <button
            onClick={() => setStatusFilter("all")}
            style={{ ...sideBtn, color: statusFilter === "all" ? "#E8512A" : "#445566", borderLeft: `2px solid ${statusFilter === "all" ? "#E8512A" : "transparent"}` }}
          >
            All Statuses
          </button>
          {ALL_STATUSES.map((s) => {
            const c = STATUS_COLORS[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                style={{ ...sideBtn, color: statusFilter === s ? c.text : "#445566", borderLeft: `2px solid ${statusFilter === s ? c.text : "transparent"}` }}
              >
                {s}
              </button>
            );
          })}
        </div>

        {/* ── Main content ── */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Toolbar */}
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
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              style={{ background: "#0D1220", border: "1px solid #1A2535", color: "#8899BB", fontFamily: "monospace", fontSize: 11, padding: "9px 12px", outline: "none", cursor: "pointer" }}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="name">Name A→Z</option>
            </select>
            <div style={{ fontFamily: "monospace", fontSize: 10, color: "#334455", letterSpacing: "0.1em" }}>
              {filtered.length} result{filtered.length !== 1 ? "s" : ""}
            </div>
          </div>

          {/* Application list */}
          {loading ? (
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334455", letterSpacing: "0.2em", textTransform: "uppercase", textAlign: "center", padding: 60 }}>
              Loading Applications...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ fontFamily: "monospace", fontSize: 11, color: "#334455", letterSpacing: "0.1em", textAlign: "center", padding: 60 }}>
              No applications match your filters.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {filtered.map((app) => (
                <div
                  key={app.id}
                  onClick={() => setSelected(app)}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr auto auto auto",
                    alignItems: "center",
                    gap: 16,
                    padding: "14px 18px",
                    background: selected?.id === app.id ? "rgba(232,81,42,0.12)" : "#1E293B",
                    border: `1px solid ${selected?.id === app.id ? "rgba(232,81,42,0.4)" : "#334155"}`,
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { if (selected?.id !== app.id) (e.currentTarget as HTMLElement).style.borderColor = "#1A2D45"; }}
                  onMouseLeave={(e) => { if (selected?.id !== app.id) (e.currentTarget as HTMLElement).style.borderColor = "#111827"; }}
                >
                  {/* Left: name + meta */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontFamily: "'Georgia', serif", fontSize: 14, color: "#D0E0F0" }}>
                        {app.full_name}
                      </span>
                      <DeptTag dept={app.department} />
                    </div>
                    <div style={{ fontFamily: "monospace", fontSize: 10, color: "#334455" }}>
                      {app.ucid} · {app.degree_program} · {app.year_of_study}
                    </div>
                  </div>

                  {/* Resume indicator */}
                  {app.resume_path && (
                    <span style={{ fontFamily: "monospace", fontSize: 9, color: "#334455", letterSpacing: "0.1em" }}>
                      📄
                    </span>
                  )}

                  {/* Status */}
                  <StatusBadge status={app.status} />

                  {/* Time */}
                  <div style={{ fontFamily: "monospace", fontSize: 10, color: "#2A3A50", textAlign: "right", whiteSpace: "nowrap" }}>
                    {timeAgo(app.created_at)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Detail panel ── */}
      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 40 }}
          />
          <DetailPanel
            app={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
            userEmail={userEmail}
          />
        </>
      )}
      {/* ── Notification toast ── */}
      {notification.show && (
        <div style={{
          position: "fixed", bottom: 40, left: "50%", transform: "translateX(-50%)",
          background: "#E8512A", color: "#fff", padding: "12px 24px",
          fontFamily: "monospace", fontSize: 11, letterSpacing: "0.1em",
          textTransform: "uppercase", zIndex: 100, boxShadow: "0 10px 30px rgba(232,81,42,0.3)",
          animation: "fadeInUp 0.3s ease-out forwards",
        }}>
          ✓ {notification.msg}
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translate(-50%, 20px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}

const topBtn: React.CSSProperties = {
  fontFamily: "monospace", fontSize: 10, letterSpacing: "0.14em",
  textTransform: "uppercase", padding: "6px 14px", cursor: "pointer",
  background: "transparent", border: "1px solid #1A2535", transition: "all 0.15s",
};

const sideBtn: React.CSSProperties = {
  display: "block", width: "100%", padding: "8px 16px",
  background: "none", border: "none", borderLeft: "2px solid transparent",
  cursor: "pointer", textAlign: "left", fontFamily: "monospace", fontSize: 11,
  transition: "all 0.15s",
};