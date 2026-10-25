// Detect mobile for quality-tiered rendering
export const IS_MOBILE =
  typeof window !== "undefined" && window.innerWidth < 768;

// ─── LiDAR sensor (modelled loosely on a 32-channel spinning LiDAR) ──────────
export const CHANNELS = IS_MOBILE ? 12 : 32; // vertical laser beams
export const FOV_DOWN = -25; // degrees, lowest beam
export const FOV_UP = 15; // degrees, highest beam
export const SPIN_HZ = 10; // full rotations per second
export const AZIMUTH_STEP = IS_MOBILE ? 1.4 : 0.8; // degrees between firings
export const MAX_RANGE = 40; // metres

// ─── Map ─────────────────────────────────────────────────────────────────────
export const MAX_MAP_POINTS = IS_MOBILE ? 100_000 : 450_000; // enough for a full lap of campus
export const VOXEL_SIZE = IS_MOBILE ? 0.55 : 0.28; // one map point per voxel

// ─── Rover ───────────────────────────────────────────────────────────────────
export const ROVER_SPEED = 5; // metres per second

// ─── Cherry blossom petals ───────────────────────────────────────────────────
export const PETALS = IS_MOBILE ? 500 : 2000;

// ─── Colours ─────────────────────────────────────────────────────────────────
export const BG = "#080909";
export const ACCENT = "#E8512A";
export const BLOSSOM = ["#FFB7D5", "#FF9CC8", "#FFD1E3", "#F58DBA"]; // shades of pink

// Height ramp, low → high (RViz-style rainbow, tuned to the ROAM palette)
export const HEIGHT_RAMP = ["#2B3A9A", "#1FA5C9", "#3DDC84", "#F2D64B", "#E8512A"];
export const HEIGHT_MIN = -3; // below the ground, so flat campus gets a lighter blue
export const HEIGHT_MAX = 24;

// What each kind of surface looks like in "class" colour mode
// (cherry blossom stays pink in both modes)
export const KIND_COLORS = {
  ground: "#4E5358",
  grass: "#3F9A55",
  path: "#C9C1AE",
  road: "#383C44",
  marking: "#FFFFFF",
  building: "#E8512A",
  glass: "#5B8FC9",
  blossom: "#FFB7D5",
  trunk: "#7A5A44",
  car: "#D8DCE2",
  lamp: "#FFD27A",
} as const;

// In height mode, some surfaces reflect more or less laser light (LiDAR
// "intensity"), so paint lines pop and glass looks dark
export const INTENSITY: Partial<Record<keyof typeof KIND_COLORS, number>> = {
  road: 0.55,
  glass: 0.45,
  grass: 0.8,
};

// ─── Where this is ───────────────────────────────────────────────────────────
export const LOCATION = "UCalgary · Main Campus";
