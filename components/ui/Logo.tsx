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
            y="42"
            fontFamily="var(--font-mono)"
            fontSize="45"
            fontWeight="900"
            letterSpacing="1  px"
            fill="var(--color-primary)"
          >
            ROAM
          </text>
        </svg>
      )}
    </div>
  );
};
