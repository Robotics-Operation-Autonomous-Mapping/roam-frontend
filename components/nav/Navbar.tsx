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
];

export const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-300",
          scrolled ? "bg-bg/80 backdrop-blur-md border-b border-primary/50 py-4" : "bg-transparent py-6"
        )}
      >
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
                  className="relative font-sans text-sm uppercase tracking-widest hover:text-primary transition-colors"
                >
                  {link.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="absolute -bottom-2 left-0 w-full h-[2px] bg-primary"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
              animate={{ rotate: mobileMenuOpen ? 45 : 0, y: mobileMenuOpen ? 5 : 0 }}
              className="w-full h-[2px] bg-cream"
            />
            <motion.div
              animate={{ opacity: mobileMenuOpen ? 0 : 1 }}
              className="w-full h-[2px] bg-cream"
            />
            <motion.div
              animate={{ rotate: mobileMenuOpen ? -45 : 0, y: mobileMenuOpen ? -13 : 0 }}
              className="w-full h-[2px] bg-cream"
            />
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-bg/95 backdrop-blur-lg flex flex-col items-center justify-center"
          >
            <nav className="flex flex-col gap-8 items-center text-center">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * i + 0.1, duration: 0.4 }}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "font-display text-4xl uppercase tracking-widest",
                      pathname === link.href ? "text-primary" : "text-cream hover:text-primary transition-colors"
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
