"use client";

import React from "react";
import { ContactHero } from "./ContactHero";
import { ContactForm } from "./ContactForm";
import { ContactSidebar } from "./ContactSidebar";

export default function ContactClient() {
  return (
    <div className="flex flex-col w-full bg-bg text-cream min-h-screen">
      <ContactHero />
      <section className="max-w-7xl mx-auto px-6 py-16 md:py-24 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <div className="lg:col-span-7 order-1">
            <ContactForm />
          </div>
          <div className="lg:col-span-5 order-2">
            <ContactSidebar />
          </div>
        </div>
      </section>
    </div>
  );
}
