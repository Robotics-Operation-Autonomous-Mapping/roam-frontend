"use client";

import React from "react";
import { CP, GRID_SIZE, CELL_SIZE, HALF_GRID, type Cell, type Obstacle } from "./types";

interface MinimapProps {
  obstacles: Obstacle[];
  path:      Cell[];
  start:     Cell | null;
  end:       Cell | null;
  visited:   Cell[];
  roverPos:  { x: number; z: number } | null;
}

const SIZE    = 130;
const PADDING = 4;
const CELL    = (SIZE - PADDING * 2) / GRID_SIZE;

// Cell → SVG pixel
const cx = (cell: Cell) => PADDING + cell.x * CELL + CELL / 2;
const cz = (cell: Cell) => PADDING + cell.z * CELL + CELL / 2;

// World XZ → SVG pixel
const worldToMini = (wx: number, wz: number) => ({
  x: PADDING + ((wx + HALF_GRID) / CELL_SIZE) * CELL,
  z: PADDING + ((wz + HALF_GRID) / CELL_SIZE) * CELL,
});

export const Minimap: React.FC<MinimapProps> = ({
  obstacles,
  path,
  start,
  end,
  visited,
  roverPos,
}) => {
  const obsBlocks = obstacles.map((obs) => {
    const m = worldToMini(obs.x - obs.w / 2, obs.z - obs.d / 2);
    return {
      x: m.x,
      z: m.z,
      w: (obs.w / CELL_SIZE) * CELL,
      d: (obs.d / CELL_SIZE) * CELL,
      isDynamic: obs.isDynamic,
    };
  });

  const pathPoints = path.map((c) => `${cx(c)},${cz(c)}`).join(" ");

  return (
    <div
      style={{
        position:   "absolute",
        bottom:     12,
        right:      12,
        zIndex:     20,
        background: "rgba(0,5,15,0.92)",
        border:     `1px solid ${CP.cyan}44`,
        fontFamily: "monospace",
      }}
    >
      {/* Label */}
      <div
        style={{
          fontSize:      8,
          color:         CP.cyan,
          padding:       "3px 5px",
          letterSpacing: "0.15em",
          opacity:       0.7,
        }}
      >
        MINIMAP
      </div>

      <svg width={SIZE} height={SIZE} style={{ display: "block" }}>
        {/* Grid lines */}
        {Array.from({ length: GRID_SIZE + 1 }, (_, i) => (
          <React.Fragment key={i}>
            <line
              x1={PADDING + i * CELL} y1={PADDING}
              x2={PADDING + i * CELL} y2={SIZE - PADDING}
              stroke={CP.gridLine} strokeWidth={0.3} opacity={0.4}
            />
            <line
              x1={PADDING} y1={PADDING + i * CELL}
              x2={SIZE - PADDING} y2={PADDING + i * CELL}
              stroke={CP.gridLine} strokeWidth={0.3} opacity={0.4}
            />
          </React.Fragment>
        ))}

        {/* Heatmap (cap at 200 cells to keep SVG small) */}
        {visited.slice(0, 200).map((c, i) => (
          <rect
            key={i}
            x={cx(c) - CELL / 2}
            y={cz(c) - CELL / 2}
            width={CELL}
            height={CELL}
            fill={`hsl(${260 - (i / visited.length) * 120},100%,55%)`}
            opacity={0.25}
          />
        ))}

        {/* Obstacles */}
        {obsBlocks.map((ob, i) => (
          <rect
            key={i}
            x={ob.x} y={ob.z}
            width={ob.w} height={ob.d}
            fill={ob.isDynamic ? "#FF330044" : "#0D4F6E55"}
            stroke={ob.isDynamic ? CP.orange : CP.cyan}
            strokeWidth={0.5}
          />
        ))}

        {/* Path */}
        {path.length > 1 && (
          <polyline
            points={pathPoints}
            fill="none"
            stroke={CP.cyan}
            strokeWidth={1.5}
            opacity={0.8}
          />
        )}

        {/* Start marker */}
        {start && <circle cx={cx(start)} cy={cz(start)} r={3} fill="#00FF88" />}

        {/* End marker */}
        {end && <circle cx={cx(end)} cy={cz(end)} r={3} fill={CP.orange} />}

        {/* Rover dot */}
        {roverPos && (() => {
          const mp = worldToMini(roverPos.x, roverPos.z);
          return (
            <circle
              cx={mp.x} cy={mp.z} r={2.5}
              fill={CP.cyan}
              style={{ filter: `drop-shadow(0 0 3px ${CP.cyan})` }}
            />
          );
        })()}
      </svg>
    </div>
  );
};
