"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { supabase, type AdminUser } from "@/lib/supabase/client";
import { LoginForm, RestrictedView } from "./Login";

type AdminAuthContextValue = {
  admin: AdminUser;
  userEmail: string;
  onLogout: () => Promise<void>;
  getAccessToken: () => Promise<string | null>;
};

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
}

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [restrictedEmail, setRestrictedEmail] = useState<string | null>(null);

  const verifyAdmin = useCallback(async (userEmail: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("id, email")
      .eq("email", userEmail)
      .single();

    if (data && !error) {
      setAdmin(data as AdminUser);
      setRestrictedEmail(null);
      return true;
    }
    await supabase.auth.signOut();
    setAdmin(null);
    setRestrictedEmail(userEmail);
    return false;
  }, []);

  useEffect(() => {
    const check = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user?.email) {
        await verifyAdmin(session.user.email);
      }
      setLoading(false);
    };
    check();
  }, [verifyAdmin]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user?.email) {
      setError(signInError?.message ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    await verifyAdmin(data.user.email);
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setAdmin(null);
    setRestrictedEmail(null);
    setEmail("");
    setPassword("");
  };

  const getAccessToken = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session?.access_token ?? null;
  }, []);

  if (loading) {
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

  if (restrictedEmail) {
    return <RestrictedView onBack={handleLogout} />;
  }

  if (!admin) {
    return (
      <LoginForm
        email={email}
        setEmail={setEmail}
        password={password}
        setPassword={setPassword}
        submitting={submitting}
        error={error}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <AdminAuthContext.Provider
      value={{
        admin,
        userEmail: admin.email,
        onLogout: handleLogout,
        getAccessToken,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}
