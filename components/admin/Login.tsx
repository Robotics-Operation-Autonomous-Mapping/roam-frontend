"use client";

import React from "react";

const pageStyles: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0F172A",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontFamily: "monospace",
  backgroundImage:
    "radial-gradient(ellipse at 20% 0%, rgba(232,81,42,0.05) 0%, transparent 55%), radial-gradient(ellipse at 80% 100%, rgba(34,68,170,0.07) 0%, transparent 55%)",
};

const cardStyles: React.CSSProperties = {
  width: "100%",
  maxWidth: 420,
  border: "1px solid #334155",
  background: "#1E293B",
  padding: "40px 36px",
};

const labelStyles: React.CSSProperties = {
  display: "block",
  fontSize: 10,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  color: "#556677",
  marginBottom: 6,
};

const inputStyles: React.CSSProperties = {
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

const btnStyles: React.CSSProperties = {
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

interface LoginProps {
  email: string;
  setEmail: (v: string) => void;
  password: string;
  setPassword: (v: string) => void;
  submitting: boolean;
  error: string;
  onLogin: (e: React.FormEvent) => void;
}

export const LoginForm: React.FC<LoginProps> = ({
  email, setEmail, password, setPassword, submitting, error, onLogin
}) => (
  <div style={pageStyles}>
    <div style={cardStyles}>
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

      <form onSubmit={onLogin}>
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyles}>Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@ucalgary.ca"
            required
            style={inputStyles}
          />
        </div>

        <div style={{ marginBottom: 28 }}>
          <label style={labelStyles}>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            required
            style={inputStyles}
          />
        </div>

        {error && (
          <div style={{ fontSize: 11, color: "#E8512A", border: "1px solid #E8512A", padding: "10px 14px", marginBottom: 16, letterSpacing: "0.05em" }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={submitting} style={{ ...btnStyles, opacity: submitting ? 0.5 : 1 }}>
          {submitting ? "Signing In..." : "Sign In →"}
        </button>
      </form>

      <div style={{ marginTop: 28, paddingTop: 20, borderTop: "1px solid #0F1825", fontSize: 10, color: "#1E2D3D", letterSpacing: "0.12em", textAlign: "center" }}>
        ROAM AUTONOMOUS ROVER TEAM — UNIVERSITY OF CALGARY
      </div>
    </div>
  </div>
);

export const RestrictedView: React.FC<{ onBack: () => void }> = ({ onBack }) => (
  <div style={pageStyles}>
    <div style={{ ...cardStyles, textAlign: "center" }}>
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
        onClick={onBack}
        style={{ ...btnStyles, background: "transparent", border: "1px solid #1A2535", color: "#556677", marginTop: 0 }}
      >
        Back to Login
      </button>
    </div>
  </div>
);
