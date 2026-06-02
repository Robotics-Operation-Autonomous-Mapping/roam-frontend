"use client";

import React, { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import type { EmailLog } from "@/lib/supabase/email-types";
import { EmailLogModal } from "./EmailLogModal";
import { ghostBtnStyle, panelStyle } from "./adminFormStyles";

const PAGE_SIZE = 25;

interface SentLogProps {
  refreshKey?: number;
}

export function SentLog({ refreshKey = 0 }: SentLogProps) {
  const [logs, setLogs] = useState<EmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selected, setSelected] = useState<EmailLog | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchLogs = useCallback(async (offset: number, append: boolean) => {
    setFetchError(null);

    const { data, error } = await supabase
      .from("email_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .range(offset, offset + PAGE_SIZE - 1);

    if (error) {
      console.error("[SentLog]", error);
      setFetchError(error.message);
      return;
    }

    const rows = (data ?? []) as EmailLog[];
    setHasMore(rows.length === PAGE_SIZE);
    setLogs((prev) => (append ? [...prev, ...rows] : rows));
  }, []);

  useEffect(() => {
    setLoading(true);
    fetchLogs(0, false).finally(() => setLoading(false));
  }, [fetchLogs, refreshKey]);

  const loadMore = async () => {
    setLoadingMore(true);
    await fetchLogs(logs.length, true);
    setLoadingMore(false);
  };

  return (
    <section style={{ ...panelStyle, marginTop: 24 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <h2
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "var(--admin-muted)",
            margin: 0,
          }}
        >
          Sent Log
        </h2>
        <button
          type="button"
          style={ghostBtnStyle}
          onClick={() => {
            setLoading(true);
            fetchLogs(0, false).finally(() => setLoading(false));
          }}
        >
          Refresh
        </button>
      </div>

      {fetchError && (
        <p
          style={{
            fontFamily: "monospace",
            fontSize: 11,
            color: "var(--admin-accent)",
            marginBottom: 12,
            lineHeight: 1.5,
          }}
        >
          Could not load sent log: {fetchError}. Check Supabase policies on
          email_logs and that column names match the migration (cc, bcc).
        </p>
      )}

      {loading ? (
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "var(--admin-muted)" }}>
          Loading...
        </p>
      ) : logs.length === 0 && !fetchError ? (
        <p style={{ fontFamily: "monospace", fontSize: 11, color: "var(--admin-muted)" }}>
          No emails sent yet.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontFamily: "monospace",
              fontSize: 11,
            }}
          >
            <thead>
              <tr style={{ borderBottom: "1px solid var(--admin-border)" }}>
                {["Time", "From", "To", "Subject", ""].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 8px",
                      color: "var(--admin-muted)",
                      fontWeight: 400,
                      letterSpacing: "0.1em",
                      textTransform: "uppercase",
                      fontSize: 9,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr
                  key={log.id}
                  style={{ borderBottom: "1px solid var(--admin-border)" }}
                >
                  <td style={{ padding: "12px 8px", color: "var(--admin-muted)" }}>
                    {new Date(log.created_at).toLocaleString([], {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td style={{ padding: "12px 8px" }}>{log.from_address}</td>
                  <td
                    style={{
                      padding: "12px 8px",
                      maxWidth: 160,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {(log.to_addresses ?? []).join(", ")}
                  </td>
                  <td style={{ padding: "12px 8px" }}>{log.subject}</td>
                  <td style={{ padding: "12px 8px" }}>
                    <button
                      type="button"
                      style={{
                        ...ghostBtnStyle,
                        color:
                          log.status === "sent"
                            ? "rgba(var(--status-accepted-rgb), 1)"
                            : "var(--admin-accent)",
                      }}
                      onClick={() => setSelected(log)}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {hasMore && logs.length > 0 && (
        <button
          type="button"
          style={{ ...ghostBtnStyle, marginTop: 16 }}
          onClick={loadMore}
          disabled={loadingMore}
        >
          {loadingMore ? "Loading..." : "Load more"}
        </button>
      )}

      {selected && (
        <EmailLogModal log={selected} onClose={() => setSelected(null)} />
      )}
    </section>
  );
}
