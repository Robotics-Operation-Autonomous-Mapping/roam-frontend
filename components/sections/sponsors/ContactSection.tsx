"use client";

import React from "react";
import { motion } from "framer-motion";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SPONSORSHIP_EMAIL } from "@/lib/site";

export const ContactSection = () => (
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
          <h2 className="font-display text-[clamp(2.5rem,7vw,5rem)] leading-[0.8] tracking-tight text-cream mb-6 uppercase">
            LET&apos;S BUILD <span className="text-primary">SOMETHING.</span>
          </h2>
          <p className="font-mono text-sm text-cream/50 leading-relaxed tracking-wide max-w-sm">
            Questions about packages, custom deals, or just want to know more about
            what we&apos;re building? We&apos;d love to hear from you.
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
);

function ContactForm() {
  const [name, setName] = React.useState("");
  const [org, setOrg] = React.useState("");
  const [message, setMessage] = React.useState("");
  const [pkg, setPkg] = React.useState("General Inquiry");

  const handleSubmit = () => {
    const subject = `Sponsorship Inquiry — ${pkg}`;
    const body = `Hi ROAM team,\n\nName: ${name}\nOrganization: ${org}\nPackage Interest: ${pkg}\n\n${message}`;
    window.location.href = `mailto:${SPONSORSHIP_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
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
        <option value="Title / Platinum Package">Title / Platinum ($7,500+)</option>
        <option value="Gold Package">Gold ($4,000 – $7,500)</option>
        <option value="Basic Package">Basic (up to $4,000)</option>
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
        Opens your email client · {SPONSORSHIP_EMAIL}
      </p>
    </>
  );
}
