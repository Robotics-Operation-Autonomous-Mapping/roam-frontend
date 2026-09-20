"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { useClerk, useUser } from "@clerk/nextjs";
import type { Member } from "@/lib/members/types";
import {
  canAccessAllMembers,
  canAccessCompose,
  canAccessRecruitment,
} from "@/lib/members/access";

type PortalAuthContextValue = {
  member: Member;
  userEmail: string;
  refreshMember: () => Promise<void>;
  onLogout: () => Promise<void>;
  canRecruitment: boolean;
  canMembers: boolean;
  canCompose: boolean;
};

const PortalAuthContext = createContext<PortalAuthContextValue | null>(null);

export function useAdminAuth() {
  const ctx = useContext(PortalAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within PortalAuthProvider");
  return ctx;
}

export function usePortalAuth() {
  return useAdminAuth();
}

export function PortalAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refreshMember = useCallback(async () => {
    const res = await fetch("/api/members/me");
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(
        body.error ||
          "Not permitted. If you believe this is a mistake, contact vyapakbansal@gmail.com",
      );
      setMember(null);
      return;
    }
    const data = await res.json();
    setMember(data.member as Member);
    setError("");
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      setLoading(false);
      return;
    }
    refreshMember().finally(() => setLoading(false));
  }, [isLoaded, user, refreshMember]);

  // Kick non-roster Clerk sessions out of the portal
  useEffect(() => {
    if (!isLoaded || loading || !user || member) return;
    const t = window.setTimeout(() => {
      void signOut({ redirectUrl: "/portal" });
    }, 4000);
    return () => window.clearTimeout(t);
  }, [isLoaded, loading, user, member, signOut]);

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/portal" });
  };

  if (!isLoaded || loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--admin-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "monospace",
        }}
      >
        <div
          style={{
            color: "var(--admin-muted)",
            fontSize: 11,
            letterSpacing: "0.2em",
          }}
        >
          VERIFYING SESSION...
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "var(--admin-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 24,
          fontFamily: "monospace",
        }}
      >
        <div style={{ maxWidth: 420, textAlign: "center" }}>
          <p
            style={{
              color: "var(--admin-accent)",
              fontSize: 11,
              letterSpacing: "0.2em",
              marginBottom: 12,
            }}
          >
            ACCESS DENIED
          </p>
          <p style={{ color: "var(--admin-text)", fontSize: 14, marginBottom: 16 }}>
            {error ||
              "Not permitted. If you believe this is a mistake, contact vyapakbansal@gmail.com"}
          </p>
          <a
            href="mailto:vyapakbansal@gmail.com"
            style={{
              color: "var(--admin-accent)",
              fontSize: 13,
              display: "inline-block",
              marginBottom: 16,
            }}
          >
            vyapakbansal@gmail.com
          </a>
          <p
            style={{
              color: "var(--admin-muted)",
              fontSize: 11,
              marginBottom: 16,
              lineHeight: 1.5,
            }}
          >
            Signing you out automatically…
          </p>
          <button
            type="button"
            onClick={handleLogout}
            style={{
              background: "var(--admin-surface)",
              color: "var(--admin-muted)",
              border: "1px solid var(--admin-border)",
              padding: "8px 14px",
              fontFamily: "monospace",
              fontSize: 10,
              cursor: "pointer",
            }}
          >
            SIGN OUT NOW
          </button>
        </div>
      </div>
    );
  }

  return (
    <PortalAuthContext.Provider
      value={{
        member,
        userEmail: member.email,
        refreshMember,
        onLogout: handleLogout,
        canRecruitment: canAccessRecruitment(member.role),
        canMembers: canAccessAllMembers(member.role),
        canCompose: canAccessCompose(member.role),
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}

/** @deprecated Use PortalAuthProvider */
export const AdminAuthProvider = PortalAuthProvider;
