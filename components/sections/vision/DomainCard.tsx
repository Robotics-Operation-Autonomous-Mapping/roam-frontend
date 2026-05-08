"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { DomainConfig } from "./constants";

export const DomainCard: React.FC<{ domain: DomainConfig; index: number }> = ({ domain, index }) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);
  const { Canvas } = domain;

  const active = hovered || clicked;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      animate={{ borderColor: active ? domain.statusColor : "rgba(255,255,255,0.05)" }}
      transition={{ delay: index * 0.18, duration: 0.7, ease: [0.16, 1, 0.3, 1], borderColor: { duration: 0.4 } }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      onClick={() => setClicked((v) => !v)}
      style={{ cursor: "pointer" }}
      className="relative flex flex-col border transition-all duration-500 ease-out overflow-hidden"
    >
      {/* Live viz viewport */}
      <div className="relative w-full" style={{ height: 180 }}>
        <Canvas active={active} />
        {/* Corner crosshairs */}
        {["top-0 left-0", "top-0 right-0", "bottom-0 left-0", "bottom-0 right-0"].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-3 h-3`} style={{ opacity: active ? 1 : 0.4, transition: "opacity 0.3s" }}>
            <div style={{
              position: "absolute",
              width: 8, height: 1,
              background: domain.statusColor,
              top: i < 2 ? 0 : "auto", bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto", right: i % 2 === 1 ? 0 : "auto",
            }} />
            <div style={{
              position: "absolute",
              width: 1, height: 8,
              background: domain.statusColor,
              top: i < 2 ? 0 : "auto", bottom: i >= 2 ? 0 : "auto",
              left: i % 2 === 0 ? 0 : "auto", right: i % 2 === 1 ? 0 : "auto",
            }} />
          </div>
        ))}
        {/* Status badge */}
        <div className="absolute top-2 right-2 flex items-center gap-1.5" style={{
          background: "rgba(0,0,0,0.7)",
          border: `1px solid ${domain.statusColor}44`,
          padding: "2px 7px",
        }}>
          <motion.div
            animate={{ opacity: active ? [1, 0.2, 1] : 0.4 }}
            transition={{ repeat: Infinity, duration: 1.1 }}
            style={{ width: 5, height: 5, borderRadius: "50%", background: domain.statusColor }}
          />
          <span style={{ fontFamily: "monospace", fontSize: 9, color: domain.statusColor, letterSpacing: "0.12em" }}>
            {active ? domain.status : "STANDBY"}
          </span>
        </div>
        {/* Hover prompt */}
        {!active && (
          <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(0,0,0,0.35)" }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: "rgba(255,255,255,0.5)", letterSpacing: "0.2em" }}>
              HOVER TO ACTIVATE
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex-1 bg-surface-2" style={{ borderTop: `1px solid ${domain.statusColor}22` }}>
        <div className="flex items-start justify-between mb-3">
          <span style={{ fontFamily: "monospace", fontSize: 10, color: domain.statusColor, letterSpacing: "0.15em", opacity: 0.7 }}>
            [{domain.label}]
          </span>
          <motion.div
            animate={{ rotate: active ? 45 : 0 }}
            transition={{ duration: 0.3 }}
            style={{ width: 14, height: 14, border: `1px solid ${domain.statusColor}`, opacity: active ? 1 : 0.3 }}
          />
        </div>
        <h3 className="font-sans font-bold text-cream mb-1" style={{ fontSize: 13, letterSpacing: "0.08em" }}>
          {domain.title}
        </h3>
        <p className="font-sans text-cream/60" style={{ fontSize: 12, lineHeight: 1.5 }}>
          {domain.sub}
        </p>
        <motion.div
          animate={{ height: active ? "auto" : 0, opacity: active ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{ overflow: "hidden" }}
        >
          <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${domain.statusColor}22` }}>
            <span style={{ fontFamily: "monospace", fontSize: 9, color: domain.statusColor, letterSpacing: "0.12em" }}>
              {clicked ? "CLICK TO DEACTIVATE" : "RELEASE TO STANDBY"}
            </span>
          </div>
        </motion.div>
      </div>

      {/* Bottom scan line on active */}
      <motion.div
        animate={{ scaleX: active ? 1 : 0, opacity: active ? 1 : 0 }}
        style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${domain.statusColor}, transparent)`,
          transformOrigin: "left",
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};
