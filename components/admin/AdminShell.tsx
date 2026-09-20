"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { usePortalAuth } from "./AdminAuthContext";

type NavItem = {
  href: string;
  label: string;
  visible: boolean;
  exact?: boolean;
};

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { userEmail, canRecruitment, canMembers, canCompose } = usePortalAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: NavItem[] = useMemo(
    () => [
      { href: "/admin/profile", label: "Profile", visible: true },
      { href: "/admin/members", label: "All Members", visible: canMembers },
      {
        href: "/admin",
        label: "Recruitment",
        visible: canRecruitment,
        exact: true,
      },
      { href: "/admin/email", label: "Compose", visible: canCompose },
    ],
    [canRecruitment, canMembers, canCompose],
  );

  const visibleNav = navItems.filter((item) => item.visible);

  const isActive = (item: NavItem) =>
    item.exact
      ? pathname === item.href
      : pathname === item.href || pathname?.startsWith(`${item.href}/`);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--admin-bg)] text-[var(--admin-text)]">
      <header className="border-b border-[var(--admin-border)] bg-[var(--admin-bg-dark)] sticky top-0 z-40">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-2.5 h-2.5 shrink-0 rounded-full bg-[var(--admin-accent)]" />
            <span className="font-mono text-[11px] sm:text-[13px] tracking-[0.15em] truncate">
              ROAM TEAM PORTAL
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden md:inline font-mono text-[11px] text-[var(--admin-muted)] truncate max-w-[200px]">
              {userEmail}
            </span>
            <UserButton afterSignOutUrl="/" />
            <button
              type="button"
              className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 border border-[var(--admin-border)]"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((o) => !o)}
            >
              <span
                className={`block w-4 h-0.5 bg-[var(--admin-text)] transition ${menuOpen ? "translate-y-[4px] rotate-45" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-[var(--admin-text)] transition ${menuOpen ? "opacity-0" : ""}`}
              />
              <span
                className={`block w-4 h-0.5 bg-[var(--admin-text)] transition ${menuOpen ? "-translate-y-[4px] -rotate-45" : ""}`}
              />
            </button>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex flex-wrap gap-1 px-6 pb-3">
          {visibleNav.map((item) => (
            <NavLink key={item.href} item={item} active={isActive(item)} />
          ))}
        </nav>

        {/* Mobile nav */}
        {menuOpen && (
          <nav className="md:hidden border-t border-[var(--admin-border)] px-3 py-2 flex flex-col gap-1">
            {visibleNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className={`font-mono text-[11px] uppercase tracking-[0.14em] px-3 py-3 ${
                  isActive(item)
                    ? "text-[var(--admin-accent)] bg-[rgba(232,81,42,0.1)] border border-[rgba(232,81,42,0.35)]"
                    : "text-[var(--admin-muted)] border border-transparent"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <p className="px-3 py-2 font-mono text-[10px] text-[var(--admin-muted)] truncate">
              {userEmail}
            </p>
          </nav>
        )}
      </header>

      <div className="flex-1 min-w-0 w-full">{children}</div>
    </div>
  );
}

function NavLink({ item, active }: { item: NavItem; active: boolean }) {
  return (
    <Link
      href={item.href}
      className={`font-mono text-[10px] uppercase tracking-[0.12em] px-3.5 py-2 no-underline transition-colors ${
        active
          ? "text-[var(--admin-accent)] bg-[rgba(232,81,42,0.1)] border border-[rgba(232,81,42,0.35)]"
          : "text-[var(--admin-muted)] border border-transparent hover:text-[var(--admin-text)]"
      }`}
    >
      {item.label}
    </Link>
  );
}
