"use client";

import React from "react";
import { CAPTAIN, INBOXES, SOCIAL_LINKS } from "./constants";

const SocialIcon = ({ label }: { label: string }) => {
  if (label === "Instagram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
      </svg>
    );
  }
  if (label === "LinkedIn") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (label === "GitHub") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 10h16" />
      <path d="M6.5 4.5l11 11" />
      <path d="M6.5 15.5l11 -11" />
      <path d="M12 10v-8" />
      <path d="M12 15v7" />
    </svg>
  );
};

export const ContactSidebar = () => (
  <aside className="flex flex-col gap-8">
    <div className="border border-white/10 p-6 md:p-8 bg-white/[0.02]">
      <h2 className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-4">
        General Info
      </h2>
      <div className="space-y-6">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-3">
            Email
          </p>
          <ul className="space-y-3">
            {INBOXES.map((inbox) => (
              <li key={inbox.email}>
                <p className="font-mono text-[10px] uppercase tracking-widest text-cream/35 mb-0.5">
                  {inbox.label}
                </p>
                <a
                  href={`mailto:${inbox.email}`}
                  className="font-mono text-sm text-cream hover:text-primary transition-colors break-all"
                >
                  {inbox.email}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-3">
            Social
          </p>
          <div className="flex flex-wrap gap-2">
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center text-cream/60 hover:border-primary hover:text-primary transition-colors"
                aria-label={link.srOnly}
              >
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-6">
          <p className="font-mono text-[11px] uppercase tracking-widest text-cream/40 mb-2">
            What to Expect
          </p>
          <p className="font-mono text-xs text-cream/55 leading-relaxed">
            We typically reply within 2–3 business days. Messages are reviewed by
            the ROAM executive team and routed to the right inbox automatically.
          </p>
        </div>
      </div>
    </div>

    <div className="border border-white/10 px-5 py-4 bg-white/[0.015]">
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/35 mb-2">
        Team Captain
      </p>
      <p className="font-sans text-sm text-cream/90">{CAPTAIN.name}</p>
      <p className="font-mono text-[11px] text-cream/45 mb-3">{CAPTAIN.role}</p>
      <a
        href={CAPTAIN.linkedIn}
        target="_blank"
        rel="noopener noreferrer"
        className="font-mono text-[11px] uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
      >
        LinkedIn →
      </a>
    </div>
  </aside>
);
