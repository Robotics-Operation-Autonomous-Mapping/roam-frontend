"use client";

import React, { useRef } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";

// ─── Package Data ──────────────────────────────────────────────────────────────

const PACKAGES = [
  {
    tier: "Standard",
    range: "$250 – $750",
    tagline: "Fuel the mission. Earn the recognition.",
    benefits: [
      "Logo featured on the ROAM website sponsor page",
      "Shoutout posts on Instagram & LinkedIn",
      "Featured in ROAM's sponsor newsletter",
      "Certificate of partnership from ROAM",
    ],
    cta: "Become a Standard Sponsor",
    highlight: false,
  },
  {
    tier: "Premium",
    range: "$1,000 – $2,500",
    tagline: "Your name on the machine. Your legacy on the field.",
    benefits: [
      "Everything in Standard",
      "Your brand physically on the rover — seen at every competition",
      "Live showcase alongside ROAM at conferences & competitions",
      "Co-branded content & dedicated feature post",
      "Direct recognition in team presentations & media",
      "Photoshoot of your brand with the rover and the team"
    ],
    cta: "Become a Premium Sponsor",
    highlight: true,
  },
];

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  }),
};

// ─── Sub-components ────────────────────────────────────────────────────────────

function BenefitRow({ text, index }: { text: string; index: number }) {
  return (
    <motion.li
      custom={index}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="flex items-start gap-3 border-b border-white/10 pb-3"
    >
      <span className="mt-1 w-2 h-2 shrink-0 bg-primary rotate-45 inline-block" />
      <span className="font-mono text-sm text-cream/80 leading-relaxed tracking-wide">{text}</span>
    </motion.li>
  );
}

function PackageCard({ pkg, index }: { pkg: (typeof PACKAGES)[0]; index: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });

  const mailto = `mailto:schulichroam@gmail.com?subject=Sponsorship%20Inquiry%20%E2%80%94%20${encodeURIComponent(pkg.tier)}%20Package&body=Hi%20ROAM%20team%2C%0A%0AI%27m%20interested%20in%20the%20${encodeURIComponent(pkg.tier)}%20sponsorship%20package.%0A%0AOrganization%3A%20%0AContact%20Name%3A%20%0AMessage%3A%20`;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      className={`relative flex flex-col border ${
        pkg.highlight
          ? "border-primary bg-primary/5"
          : "border-white/15 bg-white/[0.03]"
      } p-8 gap-6`}
    >
      {pkg.highlight && (
        <div className="absolute top-0 left-0 w-full h-[2px] bg-primary" />
      )}

      {/* Header */}
      <div className="flex flex-col gap-1">
        {pkg.highlight && (
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-primary mb-1">
            ★ Most Impactful
          </span>
        )}
        <h3 className="font-display text-5xl uppercase tracking-tight text-cream">
          {pkg.tier}
        </h3>
        <p className="font-mono text-xs text-cream/40 uppercase tracking-widest mt-1">
          {pkg.tagline}
        </p>
      </div>

      {/* Price Range */}
      <div className="border-t border-b border-white/10 py-4">
        <span className="font-display text-3xl text-primary tracking-tight">
          {pkg.range}
        </span>
        <span className="font-mono text-xs text-cream/40 ml-2 uppercase tracking-widest">/ year</span>
      </div>

      {/* Benefits */}
      <ul className="flex flex-col gap-3 flex-1">
        {pkg.benefits.map((b, i) => (
          <BenefitRow key={i} text={b} index={i} />
        ))}
      </ul>

      {/* CTA */}
      <a
        href={mailto}
        className={`mt-2 inline-block w-full text-center font-mono text-sm uppercase tracking-[0.2em] py-4 transition-colors duration-200 ${
          pkg.highlight
            ? "bg-primary text-bg hover:bg-primary/85"
            : "border border-primary/60 text-primary hover:bg-primary/10"
        }`}
      >
        {pkg.cta}
      </a>
    </motion.div>
  );
}

// ─── Stat Bar ──────────────────────────────────────────────────────────────────

const STATS = [
  { value: "2+", label: "Competitions / Year" },
  { value: "15+", label: "Team Members" },
  { value: "100%", label: "Student Built" },
  { value: "∞", label: "Ambition" },
];

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function SponsorPage() {
  const statsRef = useRef(null);
  const statsInView = useInView(statsRef, { once: true, margin: "-80px" });

  const generalMailto =
    "mailto:schulichroam@gmail.com?subject=Sponsorship%20Inquiry%20%E2%80%94%20General&body=Hi%20ROAM%20team%2C%0A%0AI%27d%20like%20to%20learn%20more%20about%20sponsoring%20ROAM.%0A%0AOrganization%3A%20%0AContact%20Name%3A%20%0AMessage%3A%20";

  return (
    <div className="flex flex-col w-full bg-bg text-cream">
      {/* ── HERO ── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden border-b border-white/10">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(to right, #E8512A 1px, transparent 1px), linear-gradient(to bottom, #E8512A 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />

        {/* Corner accent */}
        <div className="absolute top-0 right-0 w-[1px] h-full bg-primary/20" />
        <div className="absolute top-0 left-0 w-[1px] h-full bg-primary/10" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <SectionLabel className="mb-6">Sponsorship</SectionLabel>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-[clamp(3rem,10vw,7.5rem)] leading-[0.88] tracking-tight text-cream mb-8 max-w-5xl"
          >
            THE ROVER<br />
            DOESN'T BUILD<br />
            <span className="text-primary">ITSELF.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-mono text-base md:text-lg text-cream/60 max-w-[540px] leading-relaxed tracking-wide mb-12"
          >
            Behind every bolt, every sensor, every line of autonomous code — there's a
            team of students who refuse to accept limits. Your sponsorship doesn't just
            fund hardware. It launches careers, proves concepts, and puts your brand
            at the frontier of what students can achieve.
          </motion.p>

          <motion.a
            href={generalMailto}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="inline-block font-mono text-sm uppercase tracking-[0.2em] px-10 py-4 bg-primary text-bg hover:bg-primary/85 transition-colors duration-200"
          >
            Get in Touch
          </motion.a>
        </div>
      </section>

      {/* ── STAT BAR ── */}
      <section
        ref={statsRef}
        className="border-b border-white/10 grid grid-cols-2 md:grid-cols-4"
      >
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0 }}
            animate={statsInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className={`flex flex-col items-center justify-center py-10 px-6 text-center ${
              i < STATS.length - 1 ? "border-r border-white/10" : ""
            }`}
          >
            <span className="font-display text-5xl text-primary mb-1">{s.value}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-cream/40">
              {s.label}
            </span>
          </motion.div>
        ))}
      </section>

      {/* ── WHY SPONSOR ── */}
      <section className="max-w-7xl mx-auto px-6 py-28 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionLabel className="mb-4">Why Partner With Us</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.9] tracking-tight text-cream max-w-3xl">
            YOUR BRAND.<br />
            <span className="text-primary">OUR TERRAIN.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/10">
          {[
            {
              icon: "◈",
              title: "Real Visibility",
              body: "Your logo on a physical rover, competing in front of engineers, professors, and industry leaders at national and international competitions.",
            },
            {
              icon: "◉",
              title: "Talent Pipeline",
              body: "ROAM members are the engineers of tomorrow. Sponsoring us means first access to motivated, skilled graduates who know your brand.",
            },
            {
              icon: "◌",
              title: "Proof of Impact",
              body: "We document everything — from build logs to competition results. Your investment is traceable, visible, and shareable.",
            },
          ].map((item, i) => (
            <motion.div
              key={item.title}
              custom={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-bg p-8 flex flex-col gap-4"
            >
              <span className="font-mono text-3xl text-primary">{item.icon}</span>
              <h3 className="font-display text-2xl uppercase tracking-tight text-cream">
                {item.title}
              </h3>
              <p className="font-mono text-sm text-cream/50 leading-relaxed tracking-wide">
                {item.body}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── PACKAGES ── */}
      <section className="border-t border-white/10 max-w-7xl mx-auto px-6 py-28 w-full">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-16"
        >
          <SectionLabel className="mb-4">Packages</SectionLabel>
          <h2 className="font-display text-[clamp(2.2rem,6vw,4.5rem)] leading-[0.9] tracking-tight text-cream">
            CHOOSE YOUR<br />
            <span className="text-primary">MISSION LEVEL.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10">
          {PACKAGES.map((pkg, i) => (
            <PackageCard key={pkg.tier} pkg={pkg} index={i} />
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="font-mono text-xs text-cream/30 text-center mt-8 tracking-widest uppercase"
        >
          Custom packages available, reach out to discuss what works for you.
        </motion.p>
      </section>

      {/* ── CONTACT ── */}
      <section className="border-t border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6 py-28 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <SectionLabel className="mb-4">Contact</SectionLabel>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] leading-[0.9] tracking-tight text-cream mb-6">
                LET'S BUILD<br />
                <span className="text-primary">SOMETHING.</span>
              </h2>
              <p className="font-mono text-sm text-cream/50 leading-relaxed tracking-wide max-w-sm">
                Questions about packages, custom deals, or just want to know more about
                what we're building? We'd love to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="border border-white/15 p-8 flex flex-col gap-6"
            >
              <ContactForm />
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── CURRENT SPONSORS placeholder ── */}
      <section className="border-t border-white/10 max-w-7xl mx-auto px-6 py-20 w-full">
        <SectionLabel className="mb-8 block text-center">Current Sponsors</SectionLabel>
        <div className="border border-dashed border-white/15 py-14 text-center">
          <p className="font-mono text-xs text-cream/25 uppercase tracking-[0.25em]">
            Sponsor logos coming soon
          </p>
        </div>
      </section>
    </div>
  );
}

// ─── Contact Form ──────────────────────────────────────────────────────────────
// Opens mailto: on submit — no backend needed.

function ContactForm() {
  const [name, setName] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [pkg, setPkg] = React.useState("General Inquiry");

  const handleSubmit = () => {
    const subject = `Sponsorship Inquiry — ${pkg}`;
    const body = `Hi ROAM team,\n\nName: ${name}\nOrganization: ${org}\nPackage Interest: ${pkg}\n\n${message}`;
    window.location.href = `mailto:schulichroam@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const inputClass =
    "w-full bg-transparent border border-white/15 px-4 py-3 font-mono text-sm text-cream placeholder:text-cream/25 focus:outline-none focus:border-primary transition-colors tracking-wide";

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <input
          className={inputClass}
          placeholder="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          className={inputClass}
          placeholder="Organization"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
        />
      </div>

      <select
        className={`${inputClass} cursor-pointer`}
        value={pkg}
        onChange={(e) => setPkg(e.target.value)}
        style={{ background: "#0A0A0B" }}
      >
        <option value="General Inquiry">General Inquiry</option>
        <option value="Standard Package">Standard Package ($250–$750)</option>
        <option value="Premium Package">Premium Package ($1,000–$2,500)</option>
        <option value="Custom Package">Custom Package</option>
      </select>

      <textarea
        className={`${inputClass} resize-none`}
        rows={4}
        placeholder="Tell us about your organization and what excites you about ROAM..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />

      <button
        onClick={handleSubmit}
        className="w-full bg-primary text-bg font-mono text-sm uppercase tracking-[0.2em] py-4 hover:bg-primary/85 transition-colors duration-200"
      >
        Send Message
      </button>

      <p className="font-mono text-[10px] text-cream/25 text-center uppercase tracking-widest">
        Opens your email client · schulichroam@gmail.com
      </p>
    </>
  );
}
