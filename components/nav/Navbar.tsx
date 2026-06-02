"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Join Us", href: "/join" },
  { label: "Demo", href: "/demo" },
  { label: "Sponsors", href: "/sponsors" },
  { label: "Contact", href: "/contact" },
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      // Lowered from 120 → 80 so the navbar appears sooner
      setScrolled(window.scrollY > 80);
    };
    // Run once on mount so the state is correct if page loads mid-scroll
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  if (pathname?.startsWith("/admin")) return null;

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{
          y: scrolled ? 0 : -20,
          opacity: scrolled ? 1 : 0,
        }}
        transition={{
          // Was 0.8s — halved to 0.35s so it feels immediate
          duration: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled
            ? "bg-bg/95 backdrop-blur-md border-b border-white/5"
            : "bg-transparent pointer-events-none",
        )}
        style={{
          paddingTop: `calc(env(safe-area-inset-top) + ${scrolled ? "1rem" : "2rem"})`,
          paddingBottom: scrolled ? "1rem" : "2rem",
        }}
      >
        {/* Gradient bottom border — more refined than a flat line */}
        {scrolled && (
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link href="/" className="relative z-50">
            <Logo size={40} />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  className={cn(
                    "relative font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-200",
                    isActive
                      ? "text-primary"
                      : "text-cream/50 hover:text-primary",
                    link.href === "/sponsors" && !isActive && "text-primary/40",
                  )}
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary"
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden relative z-50 w-8 h-8 flex flex-col items-center justify-center gap-2 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <motion.div
              animate={{
                rotate: mobileMenuOpen ? 45 : 0,
                y: mobileMenuOpen ? 5 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="w-full h-[2px] bg-cream"
            />
            <motion.div
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              transition={{ duration: 0.15 }}
              className="w-full h-[2px] bg-cream"
            />
            <motion.div
              animate={{
                rotate: mobileMenuOpen ? -45 : 0,
                y: mobileMenuOpen ? -13 : 0,
              }}
              transition={{ duration: 0.2 }}
              className="w-full h-[2px] bg-cream"
            />
          </button>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-lg flex flex-col items-center justify-center"
            style={{ paddingTop: "env(safe-area-inset-top)" }}
          >
            {/* Subtle gradient accent at top of overlay */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />

            <nav className="flex flex-col gap-8 items-center text-center">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  // Tightened: was delay 0.1*i+0.1 at 0.4s — now 0.05*i+0.05 at 0.25s
                  transition={{
                    delay: 0.05 * i + 0.05,
                    duration: 0.25,
                    ease: "easeOut",
                  }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "group flex items-baseline gap-4 font-mono text-3xl uppercase tracking-widest",
                      pathname === link.href
                        ? "text-primary"
                        : "text-cream/40 hover:text-primary transition-colors duration-200",
                    )}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
