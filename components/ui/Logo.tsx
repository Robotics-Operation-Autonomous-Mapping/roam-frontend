import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  variant?: "full" | "icon-only" | "wordmark-only";
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({
  size = 40,
  variant = "full",
  className = "",
}) => {
  const iconSize = size * 1.5;
  const wordmarkHeight = size * 0.8 * 1.2;

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {variant !== "wordmark-only" && (
        <div
          style={{
            width: iconSize,
            height: iconSize,
            position: "relative",
            display: "flex",
            alignItems: "center",
          }}
        >
          <Image
            src="/logo.png"
            alt="ROAM Icon"
            fill
            sizes={`${iconSize}px`}
            style={{
              objectFit: "contain",
              mixBlendMode: "screen",
            }}
            className="hover:opacity-90 transition-opacity"
            priority
          />
        </div>
      )}

      {variant !== "icon-only" && (
        <svg
          height={wordmarkHeight}
          viewBox="0 0 200 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "auto" }}
        >
          <text
            x="0"
            y="38"
            fontFamily="var(--font-mono)"
            fontSize="32"
            fontWeight="700"
            letterSpacing="0.2em"
            fill="var(--color-primary)"
            className="tracking-[0.2em]"
          >
            ROAM
          </text>
          {/* Subtle underline detail for the 'technical ID' look */}
          <rect x="0" y="44" width="24" height="2" fill="var(--color-primary)" />
        </svg>
      )}
    </div>
  );
};
