import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useMemo,
  useEffect,
} from "react";
import * as THREE from "three";
import {
  EMPTY_ROVER_PARTS,
  ROVER_PARTS,
  getRandomStartPos,
  getRandomStartRot,
  type RoverPartName,
  type RoverPartsMap,
} from "./roverParts";
import { createRoverMaterials } from "./createRoverMaterials";
import { RoverMeshes } from "./RoverMeshes";

export type { RoverPartName, RoverPartObject, RoverPartsMap } from "./roverParts";
export {
  EMPTY_ROVER_PARTS,
  ROVER_PARTS,
  getRandomStartPos,
  getRandomStartRot,
} from "./roverParts";

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

    const initialOpacity = assembled ? 1 : 0;
    const materials = useMemo(
      () => createRoverMaterials(initialOpacity, assembled),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [],
    );

    useEffect(() => {
      return () => {
        Object.values(materials).forEach((mat) => mat.dispose());
      };
    }, [materials]);

    const setRef =
      (name: RoverPartName) => (el: THREE.Mesh | THREE.Group | null) => {
        partsRefs.current[name] = el;
      };

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
      <RoverMeshes
        materials={materials}
        setRef={setRef}
        startProps={startProps}
      />
    );
  },
);

RoverModel.displayName = "RoverModel";
