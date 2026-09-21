"use client";

import { useState, useEffect, useCallback } from "react";
import { Application, AppStatus } from "@/lib/supabase/client";
import { useAdminAuth } from "./AdminAuthContext";
import { StatsStrip } from "./dashboard/StatsStrip";
import { Sidebar } from "./dashboard/Sidebar";
import { Toolbar } from "./dashboard/Toolbar";
import { ApplicationList } from "./dashboard/ApplicationList";
import { DetailPanel } from "./dashboard/DetailPanel";
import { SortOption } from "./dashboard/types";

export default function AdminDashboard() {
  const { userEmail } = useAdminAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [dept, setDept] = useState("All");
  const [statusFilter, setStatusFilter] = useState<AppStatus | "all">("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Application | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [notification, setNotification] = useState<{
    msg: string;
    show: boolean;
  }>({
    msg: "",
    show: false,
  });

  const notify = (msg: string) => {
    setNotification({ msg, show: true });
    setTimeout(() => setNotification({ msg: "", show: false }), 4000);
  };

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setLoadError("");
    const res = await fetch("/api/admin/applications");
    const data = await res.json().catch(() => ({}));
    if (res.ok && data.applications) {
      setApps(data.applications as Application[]);
    } else {
      setApps([]);
      setLoadError(data.error || "Could not load applications");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const handleStatusChange = async (
    id: string,
    status: AppStatus,
    notes: string,
  ) => {
    const res = await fetch("/api/admin/applications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, notes }),
    });

    if (res.ok) {
      setApps((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status, reviewer_notes: notes, reviewed_by: userEmail }
            : a,
        ),
      );
      if (selected?.id === id) {
        setSelected((prev) =>
          prev ? { ...prev, status, reviewer_notes: notes } : null,
        );
      }
      notify(
        `Reviewed by ${userEmail.split("@")[0]} at ${new Date().toLocaleTimeString(
          [],
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        )}`,
      );
    }
  };

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
      if (sortBy === "newest")
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      if (sortBy === "oldest")
        return (
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        );
      return a.full_name.localeCompare(b.full_name);
    });

  const stats = {
    total: apps.length,
    pending: apps.filter((a) => a.status === "pending").length,
    interview: apps.filter((a) => a.status === "interview").length,
    accepted: apps.filter((a) => a.status === "accepted").length,
  };

  const deptCounts: Record<string, number> = {};
  apps.forEach((a) => {
    deptCounts[a.department] = (deptCounts[a.department] ?? 0) + 1;
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
      <div
        style={{
          padding: "12px 24px",
          borderBottom: "1px solid var(--admin-border)",
          display: "flex",
          justifyContent: "flex-end",
          background: "var(--admin-bg-dark)",
        }}
      >
        <button
          type="button"
          onClick={fetchApps}
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
      </div>

      <StatsStrip stats={stats} />

      <div className="flex flex-col md:flex-row flex-1 overflow-hidden min-h-0">
        <Sidebar
          currentDept={dept}
          setDept={setDept}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          deptCounts={deptCounts}
        />

        <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 min-w-0">
          <Toolbar
            search={search}
            setSearch={setSearch}
            sortBy={sortBy}
            setSortBy={setSortBy}
            resultCount={filtered.length}
          />

          {loading ? (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "var(--admin-muted)",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                textAlign: "center",
                padding: 60,
              }}
            >
              Loading Applications...
            </div>
          ) : loadError ? (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "var(--admin-accent)",
                letterSpacing: "0.1em",
                textAlign: "center",
                padding: 60,
              }}
            >
              {loadError}
            </div>
          ) : filtered.length === 0 ? (
            <div
              style={{
                fontFamily: "monospace",
                fontSize: 11,
                color: "var(--admin-muted)",
                letterSpacing: "0.1em",
                textAlign: "center",
                padding: 60,
              }}
            >
              No applications match your filters.
            </div>
          ) : (
            <ApplicationList
              apps={filtered}
              selectedId={selected?.id}
              onSelect={setSelected}
            />
          )}
        </div>
      </div>

      {selected && (
        <>
          <div
            onClick={() => setSelected(null)}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(8px)",
              zIndex: 90,
              animation: "fadeIn 0.3s ease-out",
            }}
          />
          <DetailPanel
            app={selected}
            onClose={() => setSelected(null)}
            onStatusChange={handleStatusChange}
          />
          <style>{`
            @keyframes fadeIn {
              from { opacity: 0; }
              to { opacity: 1; }
            }
          `}</style>
        </>
      )}

      {notification.show && (
        <div
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: "#E8512A",
            color: "#fff",
            padding: "12px 24px",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 100,
            boxShadow: "0 10px 30px rgba(232,81,42,0.3)",
            animation: "fadeInUp 0.3s ease-out forwards",
          }}
        >
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
