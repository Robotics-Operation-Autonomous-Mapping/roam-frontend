"use client";

import React from "react";
import { type Obstacle, type ObstacleType } from "./types";
import { BuildingLabel } from "./BuildingLabel";
import { CalgaryTower } from "./buildings/CalgaryTower";
import { CentralLibrary } from "./buildings/CentralLibrary";
import { CityHall } from "./buildings/CityHall";
import { EmpireBuilding } from "./buildings/EmpireBuilding";
import { FallbackBuilding } from "./buildings/FallbackBuilding";
import { GuggenheimBuilding } from "./buildings/GuggenheimBuilding";
import { LouvreBuilding } from "./buildings/LouvreBuilding";
import { OfficeTower } from "./buildings/OfficeTower";
import { PentagonBuilding } from "./buildings/PentagonBuilding";
import { SagradaBuilding } from "./buildings/SagradaBuilding";
import { TaipeiBuilding } from "./buildings/TaipeiBuilding";
import { TheBow } from "./buildings/TheBow";
import { WillisBuilding } from "./buildings/WillisBuilding";

// Names shown above each landmark (office towers have none).
// `y` overrides the label height; by default it floats just above the roof.
const LABELS: Partial<Record<ObstacleType, { name: string; y?: number }>> = {
  "calgary-tower": { name: "Calgary Tower" },
  bow: { name: "The Bow", y: 3.2 }, // lower, so it stays in view
  library: { name: "Central Library" },
  "city-hall": { name: "City Hall" },};

export const Building: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  const label = obs.type ? LABELS[obs.type] : undefined;
  return (
    <>
      <BuildingModel obs={obs} />
      {label && <BuildingLabel text={label.name} x={obs.x} y={label.y ?? obs.h + 0.9} z={obs.z} />}
    </>
  );
};

const BuildingModel: React.FC<{ obs: Obstacle }> = ({ obs }) => {
  if (obs.type === "calgary-tower") return <CalgaryTower obs={obs} />;
  if (obs.type === "bow") return <TheBow obs={obs} />;
  if (obs.type === "library") return <CentralLibrary obs={obs} />;
  if (obs.type === "city-hall") return <CityHall obs={obs} />;  if (obs.type === "office") return <OfficeTower obs={obs} />;
  // Original world landmarks
  if (obs.type === "empire") return <EmpireBuilding obs={obs} />;
  if (obs.type === "pentagon") return <PentagonBuilding obs={obs} />;
  if (obs.type === "louvre") return <LouvreBuilding obs={obs} />;
  if (obs.type === "willis") return <WillisBuilding obs={obs} />;
  if (obs.type === "taipei") return <TaipeiBuilding obs={obs} />;
  if (obs.type === "guggenheim") return <GuggenheimBuilding obs={obs} />;
  if (obs.type === "sagrada") return <SagradaBuilding obs={obs} />;
  return <FallbackBuilding obs={obs} />;
};
