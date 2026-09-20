"use client";

import React from "react";
import { type Obstacle } from "../types";
import { concreteMat } from "./materials";

export const FallbackBuilding: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  return (
    <mesh position={[obs.x, obs.h / 2, obs.z]} castShadow receiveShadow>
      <boxGeometry args={[obs.w, obs.h, obs.d]} />
      {concreteMat()}
    </mesh>
  );
};
