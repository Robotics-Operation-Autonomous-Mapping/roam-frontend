import React from "react";
import { AppStatus } from "@/lib/supabase/client";
import { STATUS_COLORS } from "../constants";

export const StatusBadge = ({ status }: { status: AppStatus }) => {
  const color = STATUS_COLORS[status];
  // Convert rgba(..., 1) to rgba(..., 0.2) for the border
  const borderColor = color.replace("1)", "0.2)");

  return (
    <div
      style={{
        fontSize: 8,
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        color: color,
        border: `1px solid ${borderColor}`,
        padding: "3px 8px",
        borderRadius: 2,
        fontFamily: "monospace",
        whiteSpace: "nowrap",
      }}
    >
      {status}
    </div>
  );
};
