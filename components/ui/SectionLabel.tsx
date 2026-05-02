import React from "react";
import { cn } from "@/lib/utils";

interface SectionLabelProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "font-mono text-xs text-primary uppercase tracking-[0.3em] mb-4",
        className,
      )}
    >
      [ {children} ]
    </div>
  );
};
