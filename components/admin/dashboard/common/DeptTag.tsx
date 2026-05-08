import React from "react";

export const DeptTag = ({ dept }: { dept: string }) => (
  <span
    style={{
      fontSize: 9,
      letterSpacing: "0.15em",
      textTransform: "uppercase",
      color: "#4A5568",
      fontFamily: "monospace",
    }}
  >
    [{dept}]
  </span>
);
