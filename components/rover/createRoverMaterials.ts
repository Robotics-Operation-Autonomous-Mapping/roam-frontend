import * as THREE from "three";

export type RoverMaterials = {
  chassis: THREE.MeshStandardMaterial;
  computeBay: THREE.MeshStandardMaterial;
  mast: THREE.MeshStandardMaterial;
  coral: THREE.MeshStandardMaterial;
  glass: THREE.MeshStandardMaterial;
  rubber: THREE.MeshStandardMaterial;
  suspension: THREE.MeshStandardMaterial;
  antenna: THREE.MeshStandardMaterial;
  solar: THREE.MeshPhysicalMaterial;
  battery: THREE.MeshStandardMaterial;
};

export function createRoverMaterials(
  initialOpacity: number,
  assembled: boolean,
): RoverMaterials {
  return {
    chassis: new THREE.MeshStandardMaterial({
      color: "#3A4252",
      metalness: 0.75,
      roughness: 0.35,
      emissive: "#0E1015",
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: initialOpacity,
    }),
    computeBay: new THREE.MeshStandardMaterial({
      color: "#323949",
      metalness: 0.75,
      roughness: 0.35,
      emissive: "#0C0F14",
      emissiveIntensity: 0.2,
      transparent: true,
      opacity: initialOpacity,
    }),
    mast: new THREE.MeshStandardMaterial({
      color: "#4A5264",
      metalness: 0.7,
      roughness: 0.35,
      transparent: true,
      opacity: initialOpacity,
    }),
    coral: new THREE.MeshStandardMaterial({
      color: "#E8512A",
      metalness: 0.65,
      roughness: 0.3,
      emissive: "#E8512A",
      emissiveIntensity: 0.3,
      transparent: true,
      opacity: initialOpacity,
    }),
    glass: new THREE.MeshStandardMaterial({
      color: "#6BA8F0",
      metalness: 0.2,
      roughness: 0.08,
      emissive: "#2A4B72",
      emissiveIntensity: 0.25,
      transparent: true,
      opacity: assembled ? 0.85 : 0,
    }),
    rubber: new THREE.MeshStandardMaterial({
      color: "#2C2E35",
      metalness: 0.02,
      roughness: 0.85,
      transparent: true,
      opacity: initialOpacity,
    }),
    suspension: new THREE.MeshStandardMaterial({
      color: "#3A3F4D",
      metalness: 0.65,
      roughness: 0.35,
      transparent: true,
      opacity: initialOpacity,
    }),
    antenna: new THREE.MeshStandardMaterial({
      color: "#8B919F",
      metalness: 0.55,
      roughness: 0.45,
      transparent: true,
      opacity: initialOpacity,
    }),
    solar: new THREE.MeshPhysicalMaterial({
      color: "#1A3A5C",
      metalness: 0.5,
      roughness: 0.2,
      iridescence: 0.8,
      iridescenceIOR: 1.5,
      transparent: true,
      opacity: initialOpacity,
    }),
    battery: new THREE.MeshStandardMaterial({
      color: "#2F3544",
      metalness: 0.7,
      roughness: 0.35,
      transparent: true,
      opacity: initialOpacity,
    }),
  };
}
