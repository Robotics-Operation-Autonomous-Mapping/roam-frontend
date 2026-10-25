import type { Metadata } from "next";
import Link from "next/link";

// Next.js adds the noindex robots tag to not-found responses itself.
export const metadata: Metadata = {
  title: "Page Not Found",
};

const LINKS = [
  { href: "/team", label: "Meet the team" },
  { href: "/join", label: "Join ROAM" },
  { href: "/sponsors", label: "Sponsor us" },
  { href: "/contact", label: "Contact" },
];

export default function NotFound() {
  return (
    <div className="min-h-screen bg-bg text-cream flex items-center justify-center px-6">
      <div className="max-w-xl text-center border border-border bg-surface px-10 py-14">
        <p className="font-mono text-xs tracking-widest text-primary mb-4">[ 404 ]</p>
        <h1 className="font-display text-5xl md:text-6xl leading-none mb-6">
          PAGE NOT FOUND
        </h1>
        <p className="font-sans text-cream/80 mb-8">
          The route you requested does not exist. Return to the main site and continue exploring.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white transition-colors font-sans uppercase tracking-widest"
        >
          Go Home
        </Link>
        <nav aria-label="Popular pages" className="mt-8">
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 font-mono text-[11px] uppercase tracking-[0.18em]">
            {LINKS.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="text-cream/50 hover:text-primary transition-colors">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  );
}
