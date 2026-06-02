"use client";

import React from "react";
import type { EmailLog } from "@/lib/supabase/email-types";
import { ghostBtnStyle, panelStyle } from "./adminFormStyles";

interface EmailLogModalProps {
  log: EmailLog;
  onClose: () => void;
}

export function EmailLogModal({ log, onClose }: EmailLogModalProps) {
  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          backdropFilter: "blur(8px)",
          zIndex: 200,
        }}
      />
      <div
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "min(640px, 92vw)",
          maxHeight: "85vh",
          overflowY: "auto",
          zIndex: 201,
          ...panelStyle,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 20,
          }}
        >
          <div>
            <p
              style={{
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "var(--admin-muted)",
                textTransform: "uppercase",
                marginBottom: 8,
              }}
            >
              Sent {new Date(log.created_at).toLocaleString()}
            </p>
            <h2
              style={{
                fontFamily: "monospace",
                fontSize: 16,
                color: "var(--admin-text)",
                margin: 0,
              }}
            >
              {log.subject}
            </h2>
          </div>
          <button type="button" style={ghostBtnStyle} onClick={onClose}>
            Close
          </button>
        </div>

        <dl style={{ fontFamily: "monospace", fontSize: 11, margin: "0 0 20px" }}>
          {[
            ["From", log.from_address],
            ["To", log.to_addresses.join(", ")],
            ["CC", log.cc?.join(", ") || "—"],
            ["BCC", log.bcc?.join(", ") || "—"],
            ["Status", log.status.toUpperCase()],
            ["Sent by", log.sent_by ?? "—"],
          ].map(([k, v]) => (
            <div key={k} style={{ marginBottom: 10 }}>
              <dt style={{ color: "var(--admin-muted)", marginBottom: 2 }}>{k}</dt>
              <dd style={{ color: "var(--admin-text)", margin: 0 }}>{v}</dd>
            </div>
          ))}
        </dl>

        <p
          style={{
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "var(--admin-muted)",
            textTransform: "uppercase",
            marginBottom: 8,
          }}
        >
          Body
        </p>
        <div
          style={{
            border: "1px solid var(--admin-border)",
            padding: 16,
            background: "var(--admin-bg)",
            fontSize: 13,
            lineHeight: 1.6,
          }}
          dangerouslySetInnerHTML={{ __html: log.body_html }}
        />
      </div>
    </>
  );
}
