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
      setError(body.error || "Unable to load your member profile.");
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

  const handleLogout = async () => {
    await signOut({ redirectUrl: "/sign-in" });
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
            TEAM PORTAL
          </p>
          <p style={{ color: "var(--admin-text)", fontSize: 14, marginBottom: 16 }}>
            {error ||
              "Your account is signed in, but we could not provision a member profile. Ask an admin to confirm SUPABASE_SERVICE_ROLE_KEY is set and the members table exists."}
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
            SIGN OUT
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
