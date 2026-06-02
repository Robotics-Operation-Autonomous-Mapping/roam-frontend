"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminAuth } from "./AdminAuthContext";

const navItems = [
  { href: "/admin", label: "Applications" },
  { href: "/admin/email", label: "Compose" },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userEmail, onLogout } = useAdminAuth();

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--admin-bg)",
        color: "var(--admin-text)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <header
        style={{
          padding: "16px 24px",
          borderBottom: "1px solid var(--admin-border)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "var(--admin-bg-dark)",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div
              style={{
                width: 10,
                height: 10,
                background: "var(--admin-accent)",
                borderRadius: "50%",
              }}
            />
            <span
              style={{
                fontFamily: "monospace",
                fontSize: 13,
                letterSpacing: "0.15em",
                color: "var(--admin-text)",
              }}
            >
              ROAM ADMIN PORTAL
            </span>
          </div>
          <nav style={{ display: "flex", gap: 4 }}>
            {navItems.map((item) => {
              const active =
                item.href === "/admin"
                  ? pathname === "/admin"
                  : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  style={{
                    fontFamily: "monospace",
                    fontSize: 10,
                    letterSpacing: "0.12em",
                    textTransform: "uppercase",
                    padding: "8px 14px",
                    textDecoration: "none",
                    color: active ? "var(--admin-accent)" : "var(--admin-muted)",
                    background: active
                      ? "rgba(232,81,42,0.1)"
                      : "transparent",
                    border: active
                      ? "1px solid rgba(232,81,42,0.35)"
                      : "1px solid transparent",
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <span
            style={{
              fontSize: 11,
              color: "var(--admin-muted)",
              fontFamily: "monospace",
            }}
          >
            {userEmail}
          </span>
          <button
            type="button"
            onClick={onLogout}
            style={{
              background: "var(--admin-surface)",
              color: "var(--admin-muted)",
              border: "none",
              padding: "6px 12px",
              fontFamily: "monospace",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>
      {children}
    </div>
  );
}
