import React from "react";
import * as THREE from "three";
import type { RoverPartName } from "./roverParts";
import type { RoverMaterials } from "./createRoverMaterials";

export interface RoverMeshesProps {
  materials: RoverMaterials;
  setRef: (name: RoverPartName) => (el: THREE.Mesh | THREE.Group | null) => void;
  startProps: (partName: RoverPartName) => {
    position: [number, number, number];
    rotation: [number, number, number];
  };
}

export const RoverMeshes: React.FC<RoverMeshesProps> = ({
  materials,
  setRef,
  startProps,
}) => (
  <group>
    <mesh
      ref={setRef("chassis")}
      material={materials.chassis}
      {...startProps("chassis")}
    >
      <boxGeometry args={[2.4, 0.35, 1.6]} />
    </mesh>

    <mesh
      ref={setRef("computeBay")}
      material={materials.computeBay}
      {...startProps("computeBay")}
    >
      <boxGeometry args={[1.0, 0.4, 1.2]} />
    </mesh>

    <mesh
      ref={setRef("jetsonLeft")}
      material={materials.computeBay}
      {...startProps("jetsonLeft")}
    >
      <boxGeometry args={[0.2, 0.08, 0.25]} />
    </mesh>

    <mesh
      ref={setRef("jetsonRight")}
      material={materials.computeBay}
      {...startProps("jetsonRight")}
    >
      <boxGeometry args={[0.2, 0.08, 0.25]} />
    </mesh>

    <mesh
      ref={setRef("sensorMast")}
      material={materials.mast}
      {...startProps("sensorMast")}
    >
      <cylinderGeometry args={[0.04, 0.04, 0.9]} />
    </mesh>

    <mesh
      ref={setRef("lidarFront")}
      material={materials.coral}
      {...startProps("lidarFront")}
    >
      <cylinderGeometry args={[0.12, 0.12, 0.1]} />
    </mesh>

    <mesh
      ref={setRef("lidarRear")}
      material={materials.coral}
      {...startProps("lidarRear")}
    >
      <cylinderGeometry args={[0.12, 0.12, 0.1]} />
    </mesh>

    <mesh
      ref={setRef("cameraBar")}
      material={materials.mast}
      {...startProps("cameraBar")}
    >
      <boxGeometry args={[0.6, 0.08, 0.08]} />
    </mesh>

    <mesh
      ref={setRef("cameraLensL")}
      material={materials.glass}
      {...startProps("cameraLensL")}
    >
      <cylinderGeometry args={[0.04, 0.04, 0.06]} />
    </mesh>

    <mesh
      ref={setRef("cameraLensR")}
      material={materials.glass}
      {...startProps("cameraLensR")}
    >
      <cylinderGeometry args={[0.04, 0.04, 0.06]} />
    </mesh>

    <mesh
      ref={setRef("irCamera")}
      material={materials.coral}
      {...startProps("irCamera")}
    >
      <boxGeometry args={[0.08, 0.1, 0.06]} />
    </mesh>

    <mesh
      ref={setRef("antenna")}
      material={materials.antenna}
      {...startProps("antenna")}
    >
      <cylinderGeometry args={[0.02, 0.02, 0.5]} />
    </mesh>

    <mesh
      ref={setRef("solarPanel")}
      material={materials.solar}
      {...startProps("solarPanel")}
    >
      <boxGeometry args={[0.5, 0.02, 0.4]} />
    </mesh>

    <mesh
      ref={setRef("battery")}
      material={materials.battery}
      {...startProps("battery")}
    >
      <boxGeometry args={[0.8, 0.2, 0.6]} />
    </mesh>

    {(["FL", "FR", "ML", "MR", "RL", "RR"] as const).map((pos) => {
      const partName = `wheel${pos}` as RoverPartName;
      return (
        <group
          ref={setRef(partName)}
          key={`wheel${pos}`}
          {...startProps(partName)}
        >
          <mesh material={materials.rubber}>
            <cylinderGeometry args={[0.28, 0.28, 0.18, 16]} />
          </mesh>
          <mesh material={materials.coral}>
            <cylinderGeometry args={[0.1, 0.1, 0.2, 8]} />
          </mesh>
        </group>
      );
    })}

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
