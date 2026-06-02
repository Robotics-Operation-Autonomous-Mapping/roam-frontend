"use client";

import React, { useRef, useCallback } from "react";
import { ghostBtnStyle, inputStyle } from "./adminFormStyles";

interface RichTextEditorProps {
  onChange: (html: string) => void;
}

export function RichTextEditor({ onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = useCallback((command: string, val?: string) => {
    document.execCommand(command, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const handleInput = () => {
    if (editorRef.current) onChange(editorRef.current.innerHTML);
  };

  const addLink = () => {
    const url = window.prompt("Link URL");
    if (url) exec("createLink", url);
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 4,
          marginBottom: 8,
          padding: "8px",
          border: "1px solid var(--admin-border)",
          background: "var(--admin-surface)",
        }}
      >
        {[
          { label: "B", cmd: "bold" },
          { label: "I", cmd: "italic" },
          { label: "U", cmd: "underline" },
        ].map((t) => (
          <button
            key={t.cmd}
            type="button"
            style={ghostBtnStyle}
            onMouseDown={(e) => {
              e.preventDefault();
              exec(t.cmd);
            }}
          >
            {t.label}
          </button>
        ))}
        <button
          type="button"
          style={ghostBtnStyle}
          onMouseDown={(e) => {
            e.preventDefault();
            exec("insertUnorderedList");
          }}
        >
          • List
        </button>
        <button
          type="button"
          style={ghostBtnStyle}
          onMouseDown={(e) => {
            e.preventDefault();
            addLink();
          }}
        >
          Link
        </button>
      </div>
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        style={{
          ...inputStyle,
          minHeight: 220,
          lineHeight: 1.65,
          overflowY: "auto",
        }}
      />
    </div>
  );
}
