// Brand color constants — mirrors globals.css CSS variables
// Use these in Three.js / GSAP code where CSS variables are not available.

export const COLORS = {
  bg:        "#0A0A0B",
  surface:   "#111113",
  surface2:  "#1A1A1E",
  primary:   "#E8512A",
  primary2:  "#F07A50",
  cream:     "#F5ECD7",
  muted:     "#6B6B72",
  border:    "#222226",
} as const;

export type ColorKey = keyof typeof COLORS;
