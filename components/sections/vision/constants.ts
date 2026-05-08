import { TerrainCanvas } from "./canvases/TerrainCanvas";
import { InfraCanvas }   from "./canvases/InfraCanvas";
import { EnvCanvas }     from "./canvases/EnvCanvas";

export interface DomainConfig {
  id: string;
  label: string;
  title: string;
  sub: string;
  status: string;
  statusColor: string;
  Canvas: React.FC<{ active: boolean }>;
}

export const DOMAIN_CONFIG: DomainConfig[] = [
  {
    id: "terrain",
    label: "01",
    title: "TERRAIN MAPPING",
    sub: "Centimeter-level spatial reconstruction",
    status: "ACTIVE SCAN",
    statusColor: "#00FF8C",
    Canvas: TerrainCanvas,
  },
  {
    id: "infra",
    label: "02",
    title: "INFRASTRUCTURE INSPECTION",
    sub: "Autonomous defect detection at scale",
    status: "ANOMALY DETECT",
    statusColor: "#FF9500",
    Canvas: InfraCanvas,
  },
  {
    id: "env",
    label: "03",
    title: "ENVIRONMENTAL MONITORING",
    sub: "Real-time ecological data capture",
    status: "LIVE CAPTURE",
    statusColor: "#00E5A0",
    Canvas: EnvCanvas,
  },
];
