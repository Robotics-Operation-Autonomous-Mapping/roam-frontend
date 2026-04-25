import React, { forwardRef, useImperativeHandle, useRef, useMemo, useEffect } from "react";
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

interface RoverModelProps {
  /** When true, all parts start at assembled positions with full opacity.
   *  Use for FloatingRoverCanvas. Default false = scatter start for assembly animation. */
  assembled?: boolean;
}

export interface RoverModelHandle {
  getParts: () => RoverPartsMap;
}

export const RoverModel = forwardRef<RoverModelHandle, RoverModelProps>(
  ({ assembled = false }, ref) => {
    const partsRefs = useRef<RoverPartsMap>({ ...EMPTY_ROVER_PARTS });

    useImperativeHandle(ref, () => ({
      getParts: () => partsRefs.current,
    }));

    // Materials — opacity starts at 1 if assembled, 0 if scatter mode
    const initialOpacity = assembled ? 1 : 0;
    const materials = useMemo(
      () => ({
        chassis: new THREE.MeshStandardMaterial({ color: "#3A4252", metalness: 0.75, roughness: 0.35, emissive: "#0E1015", emissiveIntensity: 0.25, transparent: true, opacity: initialOpacity }),
        computeBay: new THREE.MeshStandardMaterial({ color: "#323949", metalness: 0.75, roughness: 0.35, emissive: "#0C0F14", emissiveIntensity: 0.2, transparent: true, opacity: initialOpacity }),
        mast: new THREE.MeshStandardMaterial({ color: "#4A5264", metalness: 0.7, roughness: 0.35, transparent: true, opacity: initialOpacity }),
        coral: new THREE.MeshStandardMaterial({ color: "#E8512A", metalness: 0.65, roughness: 0.3, emissive: "#E8512A", emissiveIntensity: 0.3, transparent: true, opacity: initialOpacity }),
        glass: new THREE.MeshStandardMaterial({ color: "#6BA8F0", metalness: 0.2, roughness: 0.08, emissive: "#2A4B72", emissiveIntensity: 0.25, transparent: true, opacity: assembled ? 0.85 : 0 }),
        rubber: new THREE.MeshStandardMaterial({ color: "#2C2E35", metalness: 0.02, roughness: 0.85, transparent: true, opacity: initialOpacity }),
        suspension: new THREE.MeshStandardMaterial({ color: "#3A3F4D", metalness: 0.65, roughness: 0.35, transparent: true, opacity: initialOpacity }),
        antenna: new THREE.MeshStandardMaterial({ color: "#8B919F", metalness: 0.55, roughness: 0.45, transparent: true, opacity: initialOpacity }),
        solar: new THREE.MeshPhysicalMaterial({ color: "#1A3A5C", metalness: 0.5, roughness: 0.2, iridescence: 0.8, iridescenceIOR: 1.5, transparent: true, opacity: initialOpacity }),
        battery: new THREE.MeshStandardMaterial({ color: "#2F3544", metalness: 0.7, roughness: 0.35, transparent: true, opacity: initialOpacity }),
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      []
    );

    // Dispose materials on unmount
    useEffect(() => {
      return () => {
        Object.values(materials).forEach((mat) => mat.dispose());
      };
    }, [materials]);

    const setRef = (name: RoverPartName) => (el: THREE.Mesh | THREE.Group | null) => {
      partsRefs.current[name] = el;
    };

    /**
     * Returns start position/rotation for a named part.
     * assembled=true  → part starts at its final assembled position
     * assembled=false → part starts at a random scatter position
     */
    const startProps = (partName: RoverPartName) => {
      if (assembled) {
        const t = ROVER_PARTS[partName];
        return {
          position: t.position,
          rotation: t.rotation,
        };
      }
      return {
        position: getRandomStartPos(),
        rotation: getRandomStartRot(),
      };
    };

    return (
      <group>
        <mesh ref={setRef("chassis")} material={materials.chassis} {...startProps("chassis")}>
          <boxGeometry args={[2.4, 0.35, 1.6]} />
        </mesh>

        <mesh ref={setRef("computeBay")} material={materials.computeBay} {...startProps("computeBay")}>
          <boxGeometry args={[1.0, 0.4, 1.2]} />
        </mesh>

        <mesh ref={setRef("jetsonLeft")} material={materials.computeBay} {...startProps("jetsonLeft")}>
          <boxGeometry args={[0.2, 0.08, 0.25]} />
        </mesh>

        <mesh ref={setRef("jetsonRight")} material={materials.computeBay} {...startProps("jetsonRight")}>
          <boxGeometry args={[0.2, 0.08, 0.25]} />
        </mesh>

        <mesh ref={setRef("sensorMast")} material={materials.mast} {...startProps("sensorMast")}>
          <cylinderGeometry args={[0.04, 0.04, 0.9]} />
        </mesh>

        <mesh ref={setRef("lidarFront")} material={materials.coral} {...startProps("lidarFront")}>
          <cylinderGeometry args={[0.12, 0.12, 0.1]} />
        </mesh>

        <mesh ref={setRef("lidarRear")} material={materials.coral} {...startProps("lidarRear")}>
          <cylinderGeometry args={[0.12, 0.12, 0.1]} />
        </mesh>

        <mesh ref={setRef("cameraBar")} material={materials.mast} {...startProps("cameraBar")}>
          <boxGeometry args={[0.6, 0.08, 0.08]} />
        </mesh>

        <mesh ref={setRef("cameraLensL")} material={materials.glass} {...startProps("cameraLensL")}>
          <cylinderGeometry args={[0.04, 0.04, 0.06]} />
        </mesh>

        <mesh ref={setRef("cameraLensR")} material={materials.glass} {...startProps("cameraLensR")}>
          <cylinderGeometry args={[0.04, 0.04, 0.06]} />
        </mesh>

        <mesh ref={setRef("irCamera")} material={materials.coral} {...startProps("irCamera")}>
          <boxGeometry args={[0.08, 0.1, 0.06]} />
        </mesh>

        <mesh ref={setRef("antenna")} material={materials.antenna} {...startProps("antenna")}>
          <cylinderGeometry args={[0.02, 0.02, 0.5]} />
        </mesh>

        <mesh ref={setRef("solarPanel")} material={materials.solar} {...startProps("solarPanel")}>
          <boxGeometry args={[0.5, 0.02, 0.4]} />
        </mesh>

        <mesh ref={setRef("battery")} material={materials.battery} {...startProps("battery")}>
          <boxGeometry args={[0.8, 0.2, 0.6]} />
        </mesh>

        {/* Wheels */}
        {(["FL", "FR", "ML", "MR", "RL", "RR"] as const).map((pos) => {
          const partName = `wheel${pos}` as RoverPartName;
          return (
          <group ref={setRef(partName)} key={`wheel${pos}`} {...startProps(partName)}>
            <mesh material={materials.rubber}>
              <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
            </mesh>
            <mesh material={materials.coral}>
              <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
            </mesh>
          </group>
          );
        })}

        {/* Suspension Arms */}
        {(["FL", "FR", "ML", "MR", "RL", "RR"] as const).map((pos) => {
          const partName = `suspension${pos}` as RoverPartName;
          return (
          <mesh
            ref={setRef(partName)}
            key={`suspension${pos}`}
            material={materials.suspension}
            {...startProps(partName)}
          >
            <boxGeometry args={[0.6, 0.06, 0.06]} />
          </mesh>
          );
        })}
      </group>
    );
  }
);

RoverModel.displayName = "RoverModel";
