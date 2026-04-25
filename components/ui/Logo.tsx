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
            {/* Compass / Star */}
            <path
              d="M50 15 L55 45 L85 50 L55 55 L50 85 L45 55 L15 50 L45 45 Z"
              fill="url(#roamGradient)"
            />
            {/* Square 1 */}
            <rect
              x="30"
              y="30"
              width="40"
              height="40"
              stroke="url(#roamGradient)"
              strokeWidth="6"
              transform="rotate(45 50 50)"
              fill="none"
            />
            {/* Square 2 */}
            <rect
              x="25"
              y="25"
              width="50"
              height="50"
              stroke="url(#roamGradient)"
              strokeWidth="2"
              transform="rotate(45 50 50)"
              fill="none"
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
