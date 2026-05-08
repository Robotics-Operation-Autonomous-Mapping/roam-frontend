"use client";

import React, { useEffect } from "react";
import * as THREE from "three";
import { CATEGORY_COLOR } from "./constants";
import { useMats } from "./useMats";
import { PartRings } from "./PartRings";
import { LidarMesh }     from "./meshes/LidarMesh";
import { StereoCamMesh } from "./meshes/StereoCamMesh";
import { RadarMesh }     from "./meshes/RadarMesh";
import { RtkGpsMesh }   from "./meshes/RtkGpsMesh";
import { ComputeMesh }  from "./meshes/ComputeMesh";
import { BatteryMesh }  from "./meshes/BatteryMesh";
import { PdbMesh }      from "./meshes/PdbMesh";
import { EscMesh }      from "./meshes/EscMesh";
import { ImuMesh }      from "./meshes/ImuMesh";
import { CommsMesh }    from "./meshes/CommsMesh";
import { EstopMesh }    from "./meshes/EstopMesh";
import type { RigPart } from "./types";

interface Props {
  part: RigPart;
  activeId: string | null;
  setActiveId: (id: string | null) => void;
}

export const RigMesh: React.FC<Props> = ({ part, activeId, setActiveId }) => {
  const isActive = activeId === part.id;
  const mats = useMats(isActive, part.category);

  // Dispose materials when they change to avoid GPU leaks
  useEffect(() => {
    return () => {
      Object.values(mats).forEach((m: THREE.Material) => m?.dispose?.());
    };
  }, [mats]);

  const inner = (() => {
    switch (part.id) {
      case "lidar":      return <LidarMesh mats={mats} isActive={isActive} />;
      case "stereo_cam": return <StereoCamMesh mats={mats} />;
      case "radar":      return <RadarMesh mats={mats} />;
      case "rtk_gps":   return <RtkGpsMesh mats={mats} />;
      case "compute":    return <ComputeMesh mats={mats} isActive={isActive} />;
      case "battery":    return <BatteryMesh mats={mats} />;
      case "pdb":        return <PdbMesh mats={mats} />;
      case "esc":        return <EscMesh mats={mats} />;
      case "imu":        return <ImuMesh mats={mats} />;
      case "comms":      return <CommsMesh mats={mats} />;
      case "estop":      return <EstopMesh mats={mats} isActive={isActive} />;
      default:           return null;
    }
  })();

  return (
    <group
      position={part.position}
      onClick={e => { e.stopPropagation(); setActiveId(part.id); }}
    >
      {inner}
      {isActive && (
        <PartRings ringRadius={part.ringRadius} color={CATEGORY_COLOR[part.category]} />
      )}
    </group>
  );
};
