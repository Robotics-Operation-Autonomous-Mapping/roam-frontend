"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import {
  PORTAL_CONTACT_EMAIL,
  PORTAL_DENIED_MESSAGE,
} from "@/lib/members/portal-access";

/**
 * Public Team Portal entry. Random visitors are blocked here.
 * Accepted members / admins continue to /admin/profile after sign-in.
 */
export default function PortalEntryPage() {
  const { isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const router = useRouter();
  const [checking, setChecking] = useState(false);
  const [denied, setDenied] = useState(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    let cancelled = false;
    setChecking(true);

    (async () => {
      const res = await fetch("/api/members/me");
      if (cancelled) return;
      if (res.ok) {
        router.replace("/admin/profile");
        return;
      }
      setDenied(true);
      setChecking(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || (isSignedIn && checking && !denied)) {
    return (
      <main className="min-h-screen bg-bg flex items-center justify-center px-6">
        <p className="font-mono text-[11px] tracking-[0.2em] text-cream/40 uppercase">
          Checking access…
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center border border-border bg-surface p-8 md:p-10">
        <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">
          Team Portal
        </p>
        <h1 className="font-display text-3xl md:text-4xl text-cream mb-4">
          NOT PERMITTED
        </h1>
        <p className="font-sans text-sm text-cream/65 leading-relaxed mb-3">
          {PORTAL_DENIED_MESSAGE}
        </p>
        <a
          href={`mailto:${PORTAL_CONTACT_EMAIL}`}
          className="inline-block font-mono text-sm text-primary hover:text-primary-2 transition-colors mb-8 break-all"
        >
          {PORTAL_CONTACT_EMAIL}
        </a>

        <div className="flex flex-col gap-3">
          {isSignedIn ? (
            <button
              type="button"
              onClick={() => void signOut({ redirectUrl: "/portal" })}
              className="font-mono text-[11px] uppercase tracking-[0.18em] border border-border text-cream/50 px-4 py-3 hover:border-primary hover:text-primary transition-colors"
            >
              Sign out
            </button>
          ) : (
            <Link
              href="/sign-in"
              className="font-mono text-[11px] uppercase tracking-[0.18em] border border-primary text-primary px-4 py-3 hover:bg-primary hover:text-bg transition-colors"
            >
              Accepted member? Sign in
            </Link>
          )}
          <Link
            href="/"
            className="font-mono text-[11px] uppercase tracking-[0.18em] text-cream/40 hover:text-cream transition-colors py-2"
          >
            ← Back to site
          </Link>
        </div>
      </div>
    </main>
  );
}
