"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase/client";
import AdminDashboard from "./AdminDashboard";

// ─── Styles ───────────────────────────────────────────────────────────────────
const page: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0F172A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "monospace",
  backgroundImage:
    "radial-gradient(ellipse at 20% 0%, rgba(232,81,42,0.05) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(34,68,170,0.07) 0%, transparent 55%)",
};

const card: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  border: "1px solid #334155",
  background: "#1E293B",
  padding: "40px 36px",
};

const label: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#556677",
  marginBottom: 6,
};

const input: React.CSSProperties = {
  width: "100%",
  background: "#0F172A",
  border: "1px solid #334155",
  color: "#F1F5F9",
  fontFamily: "monospace",
  fontSize: 13,
  padding: "10px 14px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const btn: React.CSSProperties = {
  width: "100%",
  background: "#E8512A",
  color: "#fff",
  border: "none",
  fontFamily: "monospace",
  fontSize: 11,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  padding: "13px 0",
  cursor: "pointer",
  marginTop: 8,
  transition: "opacity 0.2s",
};

export default function AdminPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(true);   // checking session
  const [submitting, setSubmitting] = useState(false);
  const [error, setError]       = useState("");
  const [user, setUser]         = useState<{ email: string } | null>(null);
  const [authorized, setAuthorized] = useState(false);

  // ── Check existing session on mount ───────────────────────
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
      // Signed in but not an admin — sign them out
      await supabase.auth.signOut();
      setUser({ email });
      setAuthorized(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    

    const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password });

    if (signInError || !data.user) {
      setError(signInError?.message ?? "Login failed.");
      setSubmitting(false);
      return;
    }

    // Check if this email is in admin_users
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

  // ── Loading splash ─────────────────────────────────────────
  if (loading) {
    return (
      <div style={page}>
        <div style={{ color: "#334455", fontFamily: "monospace", fontSize: 11, letterSpacing: "0.2em" }}>
          VERIFYING SESSION...
        </div>
      </div>
    );
  }

  // ── Authorized → show dashboard ────────────────────────────
  if (authorized && user) {
    return <AdminDashboard userEmail={user.email} onLogout={handleLogout} />;
  }

  // ── Signed in but NOT admin ────────────────────────────────
  if (user && !authorized) {
    return (
      <div style={page}>
        <div style={{ ...card, textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 20 }}>🔒</div>
          <div style={{ fontSize: 10, letterSpacing: "0.2em", color: "#E8512A", textTransform: "uppercase", marginBottom: 12 }}>
            Access Restricted
          </div>
          <p style={{ color: "#556677", fontSize: 13, lineHeight: 1.8, marginBottom: 24 }}>
            This is an internal team tool.
          </p>
          <p style={{ color: "#445566", fontSize: 12, lineHeight: 1.8, marginBottom: 28 }}>
            If you think you need access to this, talk to{" "}
            <span style={{ color: "#C8D8E8" }}>Vyapak Bansal</span>.
          </p>
          <button
            onClick={handleLogout}
            style={{ ...btn, background: "transparent", border: "1px solid #1A2535", color: "#556677", marginTop: 0 }}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  // ── Login form ─────────────────────────────────────────────
  return (
    <div style={page}>
      <div style={card}>
        {/* Header */}
        <div style={{ marginBottom: 36 }}>
          <div style={{ fontSize: 10, letterSpacing: "0.22em", color: "#E8512A", textTransform: "uppercase", marginBottom: 10 }}>
            ROAM — Internal Portal
          </div>
          <h1 style={{ fontFamily: "'Georgia', serif", fontSize: 22, fontWeight: 400, color: "#D0E0F0", margin: 0 }}>
            Admin Access
          </h1>
          <p style={{ fontSize: 11, color: "#334455", marginTop: 8, letterSpacing: "0.05em" }}>
            Restricted to authorized team members only.
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 20 }}>
            <label style={label}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@ucalgary.ca"
              required
              style={input}
              onFocus={(e) => (e.target.style.borderColor = "#E8512A")}
              onBlur={(e) => (e.target.style.borderColor = "#1A2535")}
            />
          </div>

          <div style={{ marginBottom: 28 }}>
            <label style={label}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              required
              style={input}
              onFocus={(e) => (e.target.style.borderColor = "#E8512A")}
              onBlur={(e) => (e.target.style.borderColor = "#1A2535")}
            />
          </div>

          {error && (
            <div style={{ fontSize: 11, color: "#E8512A", border: "1px solid #E8512A", padding: "10px 14px", marginBottom: 16, letterSpacing: "0.05em" }}>
              {error}
            </div>
          )}

          <button type="submit" disabled={submitting} style={{ ...btn, opacity: submitting ? 0.5 : 1 }}>
            {submitting ? "Signing In..." : "Sign In →"}
          </button>
        </form>

        <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #0F1825", fontSize: 10, color: "#1E2D3D", letterSpacing: "0.12em", textAlign: "center" }}>
          ROAM AUTONOMOUS ROVER TEAM — UNIVERSITY OF CALGARY
        </div>
      </div>
    </div>
  );
}