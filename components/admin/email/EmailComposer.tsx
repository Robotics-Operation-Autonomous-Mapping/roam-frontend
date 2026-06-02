"use client";

import React, { useState } from "react";
import { useAdminAuth } from "@/components/admin/AdminAuthContext";
import { insertEmailLog } from "@/lib/supabase/email-log";
import { supabase } from "@/lib/supabase/client";
import {
  ADMIN_SENDER_OPTIONS,
  type AdminSenderAddress,
} from "@/lib/email/senders";
import { RichTextEditor } from "./RichTextEditor";
import {
  ghostBtnStyle,
  inputStyle,
  labelStyle,
  panelStyle,
  primaryBtnStyle,
} from "./adminFormStyles";

function parseList(raw: string): string[] {
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

async function fileToBase64(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((b) => {
    binary += String.fromCharCode(b);
  });
  return btoa(binary);
}

interface EmailComposerProps {
  onSent: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function EmailComposer({ onSent, onNotify }: EmailComposerProps) {
  const { getAccessToken, admin } = useAdminAuth();
  const [from, setFrom] = useState<AdminSenderAddress>(
    ADMIN_SENDER_OPTIONS[0].address,
  );
  const [to, setTo] = useState("");
  const [cc, setCc] = useState("");
  const [bcc, setBcc] = useState("");
  const [showCc, setShowCc] = useState(false);
  const [showBcc, setShowBcc] = useState(false);
  const [subject, setSubject] = useState("");
  const [bodyHtml, setBodyHtml] = useState("");
  const [attachments, setAttachments] = useState<File[]>([]);
  const [sending, setSending] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;
    setAttachments((prev) => [...prev, ...Array.from(files)]);
    e.target.value = "";
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    const token = await getAccessToken();
    if (!token) {
      onNotify("Session expired. Please log in again.", true);
      setSending(false);
      return;
    }

    try {
      const attachmentPayload = await Promise.all(
        attachments.map(async (file) => ({
          filename: file.name,
          content: await fileToBase64(file),
        })),
      );

      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          from,
          to: parseList(to),
          cc: parseList(cc),
          bcc: parseList(bcc),
          subject,
          html: bodyHtml,
          attachments: attachmentPayload,
        }),
      });

      const data = (await res.json()) as {
        error?: string;
        logError?: string;
        messageId?: string;
      };

      if (!res.ok) {
        onNotify(data.error ?? "Failed to send email.", true);
        setSending(false);
        onSent();
        return;
      }

      if (data.logError) {
        const clientLog = await insertEmailLog(supabase, admin.id, {
          from_address: from,
          to_addresses: parseList(to),
          cc: parseList(cc).length ? parseList(cc) : null,
          bcc: parseList(bcc).length ? parseList(bcc) : null,
          subject,
          body_html: bodyHtml,
          attachment_names: attachments.length
            ? attachments.map((f) => f.name)
            : null,
          status: "sent",
          resend_message_id: data.messageId ?? null,
          error_message: null,
        });
        if (!clientLog.ok) {
          onNotify(
            `Email sent, but log failed: ${data.logError}. ${clientLog.message}`,
            true,
          );
        } else {
          onNotify("Email sent (logged from browser).");
        }
      } else {
        onNotify("Email sent successfully.");
      }
      setTo("");
      setCc("");
      setBcc("");
      setSubject("");
      setBodyHtml("");
      setAttachments([]);
      setEditorKey((k) => k + 1);
      onSent();
    } catch {
      onNotify("Network error while sending.", true);
    }

    setSending(false);
  };

  return (
    <form onSubmit={handleSend} style={panelStyle}>
      <h2
        style={{
          fontFamily: "monospace",
          fontSize: 11,
          letterSpacing: "0.2em",
          textTransform: "uppercase",
          color: "var(--admin-muted)",
          margin: "0 0 20px",
        }}
      >
        Compose Email
      </h2>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>From</label>
        <select
          value={from}
          onChange={(e) => setFrom(e.target.value as AdminSenderAddress)}
          style={{ ...inputStyle, cursor: "pointer" }}
        >
          {ADMIN_SENDER_OPTIONS.map((opt) => (
            <option key={opt.address} value={opt.address}>
              {opt.label} — {opt.address}
            </option>
          ))}
        </select>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>To</label>
        <input
          type="text"
          value={to}
          onChange={(e) => setTo(e.target.value)}
          placeholder="one@example.com, two@example.com"
          style={inputStyle}
          required
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: showCc || showBcc ? 12 : 16 }}>
        {!showCc && (
          <button
            type="button"
            style={ghostBtnStyle}
            onClick={() => setShowCc(true)}
          >
            + CC
          </button>
        )}
        {!showBcc && (
          <button
            type="button"
            style={ghostBtnStyle}
            onClick={() => setShowBcc(true)}
          >
            + BCC
          </button>
        )}
      </div>

      {showCc && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>CC</label>
          <input
            type="text"
            value={cc}
            onChange={(e) => setCc(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}

      {showBcc && (
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>BCC</label>
          <input
            type="text"
            value={bcc}
            onChange={(e) => setBcc(e.target.value)}
            style={inputStyle}
          />
        </div>
      )}

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Subject</label>
        <input
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          style={inputStyle}
          required
        />
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={labelStyle}>Body</label>
        <RichTextEditor key={editorKey} onChange={setBodyHtml} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Attachments</label>
        <input
          type="file"
          multiple
          onChange={handleFiles}
          style={{
            ...inputStyle,
            padding: 8,
            fontSize: 11,
          }}
        />
        {attachments.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 10 }}>
            {attachments.map((file, i) => (
              <span
                key={`${file.name}-${i}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  fontFamily: "monospace",
                  fontSize: 10,
                  padding: "6px 10px",
                  background: "var(--admin-surface)",
                  border: "1px solid var(--admin-border)",
                }}
              >
                {file.name}
                <button
                  type="button"
                  onClick={() => removeAttachment(i)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--admin-accent)",
                    cursor: "pointer",
                    fontSize: 12,
                  }}
                  aria-label={`Remove ${file.name}`}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        style={{
          ...primaryBtnStyle,
          opacity: sending ? 0.6 : 1,
          cursor: sending ? "wait" : "pointer",
        }}
        disabled={sending}
      >
        {sending ? "Sending…" : "Send Email"}
      </button>
    </form>
  );
}
