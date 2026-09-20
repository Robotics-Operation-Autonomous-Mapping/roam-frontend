// Detect mobile for quality-tiered rendering
export const IS_MOBILE =
  typeof window !== "undefined" && window.innerWidth < 768;
export const POINT_COUNT = IS_MOBILE ? 3_000 : 10_000;
export const SCAN_DURATION = 3.2; // seconds for the sweep
export const INTRO_HOLD = 1.2; // seconds of cinematic camera before handoff
