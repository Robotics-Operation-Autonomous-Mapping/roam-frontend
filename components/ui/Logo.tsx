import React from "react";

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
  const iconSize = size;
  const wordmarkHeight = size * 0.8;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {variant !== "wordmark-only" && (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="roamGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-primary)" />
              <stop offset="100%" stopColor="var(--color-primary-2)" />
            </linearGradient>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
              <feDropShadow
                dx="0"
                dy="2"
                stdDeviation="3"
                floodColor="#E8512A"
                floodOpacity="0.4"
              />
            </filter>
          </defs>
          <g filter="url(#shadow)">
            {/* Outer interlaced structure */}
            <g stroke="url(#roamGradient)" strokeWidth="12" strokeLinecap="square" strokeLinejoin="miter" fill="none">
              <path d="M 65 35 L 85 50 L 65 65" />
              <path d="M 35 35 L 15 50 L 35 65" />
              <path d="M 35 35 L 50 15 L 65 35" />
              <path d="M 35 65 L 50 85 L 65 65" />
              
              <rect x="35" y="35" width="30" height="30" transform="rotate(45 50 50)" />
            </g>
            
            {/* The 8-pointed Star */}
            <path
              d="M 50 10 L 55 40 L 78 22 L 60 45 L 90 50 L 60 55 L 78 78 L 55 60 L 50 90 L 45 60 L 22 78 L 40 55 L 10 50 L 40 45 L 22 22 L 45 40 Z"
              fill="url(#roamGradient)"
              stroke="var(--color-bg)"
              strokeWidth="2"
            />
            {/* Inner star highlight */}
            <path
              d="M 50 20 L 53 44 L 68 32 L 56 47 L 80 50 L 56 53 L 68 68 L 53 56 L 50 80 L 47 56 L 32 68 L 44 53 L 20 50 L 44 47 L 32 32 L 47 44 Z"
              fill="var(--color-cream)"
              opacity="0.9"
            />
          </g>
        </svg>
      )}

      {variant !== "icon-only" && (
        <svg
          height={wordmarkHeight}
          viewBox="0 0 160 50"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ width: "auto" }}
        >
          <text
            x="0"
            y="42"
            fontFamily="var(--font-display), sans-serif"
            fontSize="52"
            fontWeight="400"
            letterSpacing="0.05em"
            fill="var(--color-primary)"
            stroke="var(--color-cream)"
            strokeWidth="1"
            strokeOpacity="0.8"
            style={{ paintOrder: "stroke fill" }}
          >
            ROAM
          </text>
        </svg>
      )}
    </div>
  );
};
