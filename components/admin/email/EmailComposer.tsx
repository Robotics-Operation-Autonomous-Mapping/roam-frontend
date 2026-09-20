"use client";

import React, { useState } from "react";
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
import { parseList, fileToBase64 } from "./parts/emailComposerUtils";
import { EmailComposerAttachments } from "./parts/EmailComposerAttachments";

interface EmailComposerProps {
  onSent: () => void;
  onNotify: (msg: string, isError?: boolean) => void;
}

export function EmailComposer({ onSent, onNotify }: EmailComposerProps) {
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

  const loadSignupInviteTemplate = () => {
    const signupUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}/sign-up`
        : "https://schulichroam.com/sign-up";
    setFrom("team@schulichroam.com");
    setShowBcc(true);
    setSubject("You're invited to the ROAM Team Portal");
    setBodyHtml(
      `<p>Hey team,</p><p>We've launched the <strong>ROAM Team Portal</strong> — create your account, fill your profile, and upload a photo for the public Team page.</p><p><a href="${signupUrl}">Sign up here →</a></p><p>Use the same email we have on file so your profile links automatically.</p><p>— ROAM</p>`,
    );
    setEditorKey((k) => k + 1);
    onNotify("Invite template loaded — paste teammate emails in BCC, then send.");
  };

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
        onNotify(`Email sent, but log failed: ${data.logError}`, true);
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
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 20,
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
          Compose Email
        </h2>
        <button type="button" style={ghostBtnStyle} onClick={loadSignupInviteTemplate}>
          Portal signup invite
        </button>
      </div>

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

      <EmailComposerAttachments
        attachments={attachments}
        onFiles={handleFiles}
        onRemove={removeAttachment}
      />

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
