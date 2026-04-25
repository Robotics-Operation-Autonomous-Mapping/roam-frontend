import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { ROVER_PARTS, RoverPartName, RoverPartObject } from "./RoverModel";
import { RoverSceneHandle } from "./RoverScene";

export const useRoverScroll = (
  sceneRef: React.RefObject<RoverSceneHandle | null>,
  containerRef: React.RefObject<HTMLDivElement>
) => {
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const triggersRef = useRef<ScrollTrigger[]>([]);

  useEffect(() => {
    if (!sceneRef.current || !containerRef.current) return;

    const parts = sceneRef.current.getParts();
    const particles = sceneRef.current.getParticles();

    // Kill any existing timeline
    if (tlRef.current) tlRef.current.kill();
    triggersRef.current.forEach((st) => st.kill());
    triggersRef.current = [];

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: `+=${window.innerHeight * 6}`,
        scrub: 1.5,
        pin: true,
        invalidateOnRefresh: true,
      },
    });
    tlRef.current = tl;
    if (tl.scrollTrigger) triggersRef.current.push(tl.scrollTrigger);

    // Phase 1 (0 -> 15%): Fade in all scattered parts
    const partMaterials = Object.values(parts).flatMap((part) => {
      if (!part || !("material" in part)) return [];
      const material = part.material;
      if (Array.isArray(material)) return material;
      return [material];
    });

    tl.to(
      partMaterials,
      { opacity: 1, duration: 0.15, ease: "power1.inOut" },
      0
    );

    // Helper to animate part(s)
    const animPart = (
      partNames: RoverPartName[],
      duration: number,
      startTime: number,
      ease = "power2.out"
    ) => {
      partNames.forEach((name) => {
        const p = parts[name];
        const target = ROVER_PARTS[name];
        if (p && target) {
          const [tx, ty, tz] = target.position;
          const [rx, ry, rz] = target.rotation;
          tl.to(
            p.position,
            { x: tx, y: ty, z: tz, duration, ease },
            startTime
          );
          tl.to(
            p.rotation,
            { x: rx, y: ry, z: rz, duration, ease },
            startTime
          );
        }
      });
    };

    // Phase 2 (15% -> 35%): Mobility Systems
    animPart(
      [
        "chassis",
        "suspensionFL",
        "suspensionFR",
        "suspensionML",
        "suspensionMR",
        "suspensionRL",
        "suspensionRR",
      ],
      0.2,
      0.15
    );
    (["wheelFL", "wheelFR", "wheelML", "wheelMR", "wheelRL", "wheelRR"] as RoverPartName[]).forEach(
      (w, i) => {
        animPart([w], 0.2, 0.15 + i * 0.02);
      }
    );

    // Phase 3 (35% -> 55%): Compute Core
    animPart(["battery", "computeBay", "jetsonLeft", "jetsonRight"], 0.2, 0.35);

    // Phase 4 (55% -> 75%): Sensor Suite
    animPart(
      [
        "sensorMast",
        "cameraBar",
        "cameraLensL",
        "cameraLensR",
        "irCamera",
        "lidarFront",
        "lidarRear",
        "antenna",
        "solarPanel",
      ],
      0.2,
      0.55
    );

    // Phase 5 (75% -> 100%): Elastic snap + LiDAR glow + Y-axis auto-rotate
    Object.keys(ROVER_PARTS).forEach((name) => {
      const typedName = name as RoverPartName;
      const p = parts[typedName];
      const target = ROVER_PARTS[typedName];
      if (p && target) {
        const [tx, ty, tz] = target.position;
        tl.to(
          p.position,
          {
            x: tx,
            y: ty,
            z: tz,
            duration: 0.25,
            ease: "elastic.out(1, 0.5)",
          },
          0.75
        );
      }
    });

    // LiDAR pulsing glow after assembly (#15)
    const lidar = parts.lidarFront;
    if (lidar && "material" in lidar) {
      const lidarMaterial = lidar.material as THREE.MeshStandardMaterial;
      tl.to(
        lidarMaterial,
        {
          emissiveIntensity: 1.5,
          duration: 0.1,
          onStart: () => {
            lidarMaterial.emissive = new THREE.Color("#E8512A");
          },
        },
        0.9
      );
    }

    // Particle Burst
    if (particles) {
      tl.set(particles, { visible: true }, 0.75);
      tl.to(particles.material, { opacity: 1, duration: 0.05 }, 0.75);

      const positions = particles.geometry.attributes.position
        .array as Float32Array;
      const targetPositions = new Float32Array(positions.length);
      for (let i = 0; i < positions.length; i += 3) {
        targetPositions[i] = (Math.random() - 0.5) * 6;
        targetPositions[i + 1] = (Math.random() - 0.5) * 6;
        targetPositions[i + 2] = (Math.random() - 0.5) * 6;
      }

      const proxy = { p: 0 };
      const startPositions = new Float32Array(positions);

      tl.to(
        proxy,
        {
          p: 1,
          duration: 0.25,
          ease: "power2.out",
          onUpdate: () => {
            for (let i = 0; i < positions.length; i++) {
              positions[i] =
                startPositions[i] +
                (targetPositions[i] - startPositions[i]) * proxy.p;
            }
            particles.geometry.attributes.position.needsUpdate = true;
          },
        },
        0.75
      );

      tl.to(particles.material, { opacity: 0, duration: 0.1 }, 0.9);
    }

    // End state: face down the screen and settle into a driving pose.
    const allPartsGroup = Object.values(parts).find(
      (p): p is RoverPartObject => Boolean(p && p.parent?.type === "Group")
    );
    if (allPartsGroup?.parent) {
      tl.to(
        allPartsGroup.parent.rotation,
        { x: Math.PI / 20, y: -Math.PI / 8, z: 0, duration: 0.15, ease: "power2.out" },
        0.88
      );
      tl.to(
        allPartsGroup.parent.position,
        { x: 0.25, z: 0.2, duration: 0.12, ease: "power2.out" },
        0.9
      );
    }

    // Targeted cleanup — only kill triggers we created
    return () => {
      tl.kill();
      triggersRef.current.forEach((st) => st.kill());
      triggersRef.current = [];
    };
  }, [sceneRef, containerRef]);
};
