"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/Logo";

export const Footer = () => {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;
  return (
    <footer className="w-full border-t border-primary bg-bg pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start gap-12 mb-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Logo size={48} variant="full" />
          </div>

          {/* Center: Quote */}
          <div className="flex-1 text-center max-w-xl mx-auto lg:mx-0">
            <p className="font-display text-2xl md:text-3xl tracking-wide text-cream leading-tight">
              &quot;ROAM IS NOT JUST A CLUB. IT IS A LAUNCHPAD FOR
              BUILDERS.&quot;
            </p>
          </div>

          {/* Right: Links & Social */}
          <div className="flex flex-col items-center lg:items-end gap-6 text-center lg:text-right">
            <div className="flex gap-6 font-sans text-sm uppercase tracking-widest">
              <Link href="/" className="hover:text-primary transition-colors">
                Home
              </Link>
              <Link
                href="/join"
                className="hover:text-primary transition-colors"
              >
                Join Us
              </Link>
              <Link
                href="/demo"
                className="hover:text-primary transition-colors"
              >
                Demo
              </Link>
            </div>

            <div className="flex gap-4">
              <a
                href="https://www.instagram.com/schulichroam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors group"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                </svg>
              </a>
              <a
                href="https://www.linkedin.com/company/schulichroam/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors group"
              >
                <span className="sr-only">LinkedIn</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                  <rect x="2" y="9" width="4" height="12"></rect>
                  <circle cx="4" cy="4" r="2"></circle>
                </svg>
              </a>
              <a
                href="https://github.com/Robotics-Operation-Autonomous-Mapping"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors group"
              >
                <span className="sr-only">GitHub</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>
              <a
                href="https://linktr.ee/schulichroam"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors group"
              >
                <span className="sr-only">Linktree</span>
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="group-hover:scale-110 transition-transform"
                >
                  <path d="M4 10h16" />
                  <path d="M6.5 4.5l11 11" />
                  <path d="M6.5 15.5l11 -11" />
                  <path d="M12 10v-8" />
                  <path d="M12 15v7" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-muted uppercase">
          <p>© 2026 ROAM Robotics Club</p>
          <div className="flex gap-4 items-center">
            <p>Built by Builders</p>
            <Link href="/admin" style={{ color: "#1A2535", fontSize: 10 }}>
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
