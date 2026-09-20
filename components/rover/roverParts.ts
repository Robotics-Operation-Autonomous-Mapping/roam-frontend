import * as THREE from "three";

type Transform = {
  position: [number, number, number];
  rotation: [number, number, number];
};

export type RoverPartName =
  | "chassis"
  | "computeBay"
  | "jetsonLeft"
  | "jetsonRight"
  | "sensorMast"
  | "lidarFront"
  | "lidarRear"
  | "cameraBar"
  | "cameraLensL"
  | "cameraLensR"
  | "irCamera"
  | "antenna"
  | "solarPanel"
  | "battery"
  | "wheelFL"
  | "wheelFR"
  | "wheelML"
  | "wheelMR"
  | "wheelRL"
  | "wheelRR"
  | "suspensionFL"
  | "suspensionFR"
  | "suspensionML"
  | "suspensionMR"
  | "suspensionRL"
  | "suspensionRR";

export type RoverPartObject = THREE.Mesh | THREE.Group;
export type RoverPartsMap = Record<RoverPartName, RoverPartObject | null>;

export const EMPTY_ROVER_PARTS: RoverPartsMap = {
  chassis: null,
  computeBay: null,
  jetsonLeft: null,
  jetsonRight: null,
  sensorMast: null,
  lidarFront: null,
  lidarRear: null,
  cameraBar: null,
  cameraLensL: null,
  cameraLensR: null,
  irCamera: null,
  antenna: null,
  solarPanel: null,
  battery: null,
  wheelFL: null,
  wheelFR: null,
  wheelML: null,
  wheelMR: null,
  wheelRL: null,
  wheelRR: null,
  suspensionFL: null,
  suspensionFR: null,
  suspensionML: null,
  suspensionMR: null,
  suspensionRL: null,
  suspensionRR: null,
};

// Final assembled positions
export const ROVER_PARTS: Record<RoverPartName, Transform> = {
  chassis: { position: [0, 0, 0], rotation: [0, 0, 0] },
  computeBay: { position: [0, 0.375, -0.2], rotation: [0, 0, 0] },
  jetsonLeft: { position: [-0.18, 0.4, -0.15], rotation: [0, 0, 0] },
  jetsonRight: { position: [0.18, 0.4, -0.15], rotation: [0, 0, 0] },
  sensorMast: { position: [0, 0.825, 0.4], rotation: [0, 0, 0] },
  lidarFront: { position: [0, 1.325, 0.4], rotation: [0, 0, 0] },
  lidarRear: { position: [0, 1.325, -0.3], rotation: [0, 0, 0] },
  cameraBar: { position: [0, 1.2, 0.45], rotation: [0, 0, 0] },
  cameraLensL: { position: [-0.2, 1.2, 0.49], rotation: [Math.PI / 2, 0, 0] },
  cameraLensR: { position: [0.2, 1.2, 0.49], rotation: [Math.PI / 2, 0, 0] },
  irCamera: { position: [0, 1.1, 0.45], rotation: [0, 0, 0] },
  antenna: { position: [0.3, 0.8, -0.4], rotation: [0, 0, 0] },
  solarPanel: { position: [0, 0.585, -0.2], rotation: [-Math.PI / 8, 0, 0] },
  battery: { position: [0, -0.275, 0], rotation: [0, 0, 0] },
  // Wheels
  wheelFL: { position: [-1.4, -0.1, 0.6], rotation: [0, 0, Math.PI / 2] },
  wheelFR: { position: [1.4, -0.1, 0.6], rotation: [0, 0, Math.PI / 2] },
  wheelML: { position: [-1.4, -0.1, 0], rotation: [0, 0, Math.PI / 2] },
  wheelMR: { position: [1.4, -0.1, 0], rotation: [0, 0, Math.PI / 2] },
  wheelRL: { position: [-1.4, -0.1, -0.6], rotation: [0, 0, Math.PI / 2] },
  wheelRR: { position: [1.4, -0.1, -0.6], rotation: [0, 0, Math.PI / 2] },
  // Suspension Arms
  suspensionFL: { position: [-0.8, 0.1, 0.6], rotation: [0, 0, Math.PI / 8] },
  suspensionFR: { position: [0.8, 0.1, 0.6], rotation: [0, 0, -Math.PI / 8] },
  suspensionML: { position: [-0.8, 0.1, 0], rotation: [0, 0, Math.PI / 8] },
  suspensionMR: { position: [0.8, 0.1, 0], rotation: [0, 0, -Math.PI / 8] },
  suspensionRL: { position: [-0.8, 0.1, -0.6], rotation: [0, 0, Math.PI / 8] },
  suspensionRR: { position: [0.8, 0.1, -0.6], rotation: [0, 0, -Math.PI / 8] },
};

// Generates random start position far from scene (for scatter assembly animation)
export const getRandomStartPos = (): [number, number, number] => [
  (Math.random() - 0.5) * 24,
  6 + Math.random() * 8,
  (Math.random() - 0.5) * 24,
];

export const getRandomStartRot = (): [number, number, number] => [
  Math.random() * Math.PI * 2,
  Math.random() * Math.PI * 2,
  Math.random() * Math.PI * 2,
];
