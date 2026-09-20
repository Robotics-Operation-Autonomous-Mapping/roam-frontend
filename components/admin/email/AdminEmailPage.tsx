"use client";

import React, { useState, useCallback } from "react";
import { EmailComposer } from "./EmailComposer";
import { SentLog } from "./SentLog";

export default function AdminEmailPage() {
  const [logRefresh, setLogRefresh] = useState(0);
  const [notification, setNotification] = useState<{
    msg: string;
    show: boolean;
    isError?: boolean;
  }>({ msg: "", show: false });

  const notify = useCallback((msg: string, isError?: boolean) => {
    setNotification({ msg, show: true, isError });
    setTimeout(
      () => setNotification({ msg: "", show: false, isError: false }),
      4000,
    );
  }, []);

  const refreshLog = useCallback(() => {
    setLogRefresh((n) => n + 1);
  }, []);

  return (
    <div
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "16px",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
    >
      <EmailComposer onSent={refreshLog} onNotify={notify} />
      <SentLog refreshKey={logRefresh} />

      {notification.show && (
        <div
          style={{
            position: "fixed",
            bottom: 40,
            left: "50%",
            transform: "translateX(-50%)",
            background: notification.isError ? "#3d2020" : "#E8512A",
            color: "#fff",
            border: notification.isError
              ? "1px solid var(--admin-accent)"
              : "none",
            padding: "12px 24px",
            fontFamily: "monospace",
            fontSize: 11,
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            zIndex: 100,
            boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
            maxWidth: "90vw",
            textAlign: "center",
          }}
        >
          {notification.isError ? "✕" : "✓"} {notification.msg}
        </div>
      )}
    </div>
  );
}
