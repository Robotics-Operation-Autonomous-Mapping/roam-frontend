"use client";

import React from "react";
import { inputStyle, labelStyle } from "../adminFormStyles";

interface EmailComposerAttachmentsProps {
  attachments: File[];
  onFiles: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (index: number) => void;
}

export function EmailComposerAttachments({
  attachments,
  onFiles,
  onRemove,
}: EmailComposerAttachmentsProps) {
  return (
    <div style={{ marginBottom: 20 }}>
      <label style={labelStyle}>Attachments</label>
      <input
        type="file"
        multiple
        onChange={onFiles}
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
                onClick={() => onRemove(i)}
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
  );
}
