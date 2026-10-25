"use client";

import React, { useEffect, useState } from "react";
import { Html } from "@react-three/drei";
import { motion } from "framer-motion";
import { BUILDINGS } from "./world";

const SEEN_ENOUGH = 400; // map points a building needs before its name appears

/**
 * Building names that float above campus, each appearing once the LiDAR has
 * scanned enough of that building.
 */
export const CampusLabels: React.FC<{ seenBuildings: Uint32Array }> = ({ seenBuildings }) => {
  const [shown, setShown] = useState<boolean[]>(() => BUILDINGS.map(() => false));

  // Checking twice a second is plenty, and avoids re-rendering every frame
  useEffect(() => {
    const id = setInterval(() => {
      setShown((prev) => {
        const next = BUILDINGS.map((_, i) => seenBuildings[i] >= SEEN_ENOUGH);
        return next.some((v, i) => v !== prev[i]) ? next : prev;
      });
    }, 500);
    return () => clearInterval(id);
  }, [seenBuildings]);

  return (
    <>
      {BUILDINGS.map((b, i) =>
        b.name && shown[i] ? (
          <Html key={i} position={[b.cx, b.h + 3, b.cz]} center zIndexRange={[5, 0]} wrapperClass="pointer-events-none">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="flex flex-col items-center pointer-events-none select-none"
            >
              <span className="whitespace-nowrap font-mono text-[9px] md:text-[10px] tracking-[0.2em] uppercase text-white bg-black/60 border border-[#E8512A]/60 px-2 py-1 backdrop-blur-sm">
                {b.name}
              </span>
              <span className="block w-px h-5 bg-[#E8512A]/60" />
            </motion.div>
          </Html>
        ) : null,
      )}
    </>
  );
};
