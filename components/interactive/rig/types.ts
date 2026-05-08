export type RigPart = {
  id: string;
  label: string;
  partNumber: string;
  spec: string;
  voltage?: string;
  freq?: string;
  details: string;
  category: "sensor" | "compute" | "power" | "comms" | "drive";
  position: [number, number, number];
  ringRadius: number;
};
