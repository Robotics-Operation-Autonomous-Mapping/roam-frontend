"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { C, CATEGORY_COLOR } from "./constants";

export function useMats(isActive: boolean, category: string) {
  return useMemo(() => {
    const accent = CATEGORY_COLOR[category] ?? C.blue;

    const whitePanelMat = new THREE.MeshStandardMaterial({
      color: isActive ? C.white : C.offWhite,
      metalness: 0.15,
      roughness: 0.55,
      emissive: isActive ? accent : "#000000",
      emissiveIntensity: isActive ? 0.04 : 0,
    });
    const greyMat = new THREE.MeshStandardMaterial({
      color: C.panelGrey,
      metalness: 0.3,
      roughness: 0.5,
    });
    const darkMat = new THREE.MeshStandardMaterial({
      color: C.darkGrey,
      metalness: 0.6,
      roughness: 0.4,
    });
    const chassisMat = new THREE.MeshStandardMaterial({
      color: C.chassis,
      metalness: 0.7,
      roughness: 0.35,
    });
    const goldMat = new THREE.MeshStandardMaterial({
      color: C.gold,
      metalness: 0.9,
      roughness: 0.25,
      emissive: C.goldDark,
      emissiveIntensity: 0.15,
    });
    const goldFoilMat = new THREE.MeshStandardMaterial({
      color: C.goldLight,
      metalness: 1.0,
      roughness: 0.12,
      emissive: C.gold,
      emissiveIntensity: 0.2,
    });
    const lensMat = new THREE.MeshPhysicalMaterial({
      color: "#0D1220",
      transmission: 0.85,
      transparent: true,
      roughness: 0.04,
      metalness: 0.15,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    });
    const ledMat = new THREE.MeshBasicMaterial({
      color: isActive ? accent : C.darkGrey,
    });
    const pcbMat = new THREE.MeshStandardMaterial({
      color: "#0A2E1A",
      metalness: 0.35,
      roughness: 0.75,
      emissive: isActive ? "#0F4A2A" : "#000000",
      emissiveIntensity: isActive ? 0.3 : 0,
    });
    const accentMat = new THREE.MeshStandardMaterial({
      color: accent,
      metalness: 0.5,
      roughness: 0.4,
      emissive: accent,
      emissiveIntensity: isActive ? 0.6 : 0.12,
    });
    const radarMat = new THREE.MeshStandardMaterial({
      color: C.offWhite,
      metalness: 0.1,
      roughness: 0.6,
    });

    return {
      whitePanelMat,
      greyMat,
      darkMat,
      chassisMat,
      goldMat,
      goldFoilMat,
      lensMat,
      ledMat,
      pcbMat,
      accentMat,
      radarMat,
    };
  }, [isActive, category]);
}

export type Mats = ReturnType<typeof useMats>;
