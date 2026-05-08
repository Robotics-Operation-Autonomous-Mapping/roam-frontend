"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDashboard from "@/components/admin/AdminDashboard";
import { LoginForm, RestrictedView } from "@/components/admin/Login";

export default function AdminPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const check = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await verifyAdmin(session.user.email ?? "");
      }
      setLoading(false);
    };
    check();
  }, []);

  const verifyAdmin = async (email: string) => {
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", email)
      .single();

    if (data && !error) {
      setUser({ email });
      setAuthorized(true);
    } else {
      await supabase.auth.signOut();
      setUser({ email });
      setAuthorized(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    const { data: adminRow } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", data.user.email)
      .single();

    if (!adminRow) {
      await supabase.auth.signOut();
      setUser({ email: data.user.email ?? "" });
      setAuthorized(false);
      setSubmitting(false);
      return;
    }

    setUser({ email: data.user.email ?? "" });
    setAuthorized(true);
    setSubmitting(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthorized(false);
    setEmail("");
    setPassword("");
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "#0F172A", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "monospace" }}>
        <div style={{ color: "#334455", fontSize: 11, letterSpacing: "0.2em" }}>
          VERIFYING SESSION...
        </div>
      </div>
    );
  }

  if (authorized && user) {
    return <AdminDashboard userEmail={user.email} onLogout={handleLogout} />;
  }

  if (user && !authorized) {
    return <RestrictedView onBack={handleLogout} />;
  }

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