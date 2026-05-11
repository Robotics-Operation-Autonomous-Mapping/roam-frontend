"use client";

import React, { useMemo } from "react";
import { Line } from "@react-three/drei";
import { C, CONNECTIONS, PARTS } from "./constants";

interface Props {
  activeId: string | null;
}

export const ConnectionLines: React.FC<Props> = ({ activeId }) => {
  const partMap = useMemo(
    () => Object.fromEntries(PARTS.map((p) => [p.id, p])),
    [],
  );

  return (
    <>
      {CONNECTIONS.map(([a, b], i) => {
        const pa = partMap[a];
        const pb = partMap[b];
        if (!pa || !pb) return null;

        const isHighlighted = activeId && (activeId === a || activeId === b);
        const color = isHighlighted ? C.goldLight : "#2A3344";
        const opacity = isHighlighted ? 0.85 : 0.2;

        return (
          <Line
            key={i}
            points={[pa.position, pb.position]}
            color={color}
            lineWidth={isHighlighted ? 1.5 : 0.5}
            transparent
            opacity={opacity}
            dashed={!isHighlighted}
            dashScale={4}
            dashSize={0.15}
            gapSize={0.1}
          />
        );
      })}
    </>
  );
};
