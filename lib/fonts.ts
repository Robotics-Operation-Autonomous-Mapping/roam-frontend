import { Bebas_Neue, DM_Sans, JetBrains_Mono } from "next/font/google";

export const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  // Condensed face: an Arial fallback wraps differently, so a late swap shifts hero layouts (CLS).
  display: "optional",
});

export const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  // Same reason as the display face: the generated fallback is not monospaced.
  display: "optional",
});
