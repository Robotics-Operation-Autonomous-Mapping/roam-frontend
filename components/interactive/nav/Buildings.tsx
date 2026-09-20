"use client";

import React from "react";
import { type Obstacle } from "./types";
import { EmpireBuilding } from "./buildings/EmpireBuilding";
import { FallbackBuilding } from "./buildings/FallbackBuilding";
import { GuggenheimBuilding } from "./buildings/GuggenheimBuilding";
import { LouvreBuilding } from "./buildings/LouvreBuilding";
import { PentagonBuilding } from "./buildings/PentagonBuilding";
import { SagradaBuilding } from "./buildings/SagradaBuilding";
import { TaipeiBuilding } from "./buildings/TaipeiBuilding";
import { WillisBuilding } from "./buildings/WillisBuilding";

export const Building: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  if (obs.type === "guggenheim") return <GuggenheimBuilding obs={obs} />;
  if (obs.type === "sagrada") return <SagradaBuilding obs={obs} />;
  if (obs.type === "empire") return <EmpireBuilding obs={obs} />;
  if (obs.type === "pentagon") return <PentagonBuilding obs={obs} />;
  if (obs.type === "louvre") return <LouvreBuilding obs={obs} />;
  if (obs.type === "willis") return <WillisBuilding obs={obs} />;
  if (obs.type === "taipei") return <TaipeiBuilding obs={obs} />;
  return <FallbackBuilding obs={obs} />;
};
