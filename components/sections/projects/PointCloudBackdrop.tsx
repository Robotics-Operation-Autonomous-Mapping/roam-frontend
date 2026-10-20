"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

// Fewer points on phones so the page stays smooth
const IS_MOBILE = typeof window !== "undefined" && window.innerWidth < 768;
const POINT_COUNT = IS_MOBILE ? 3500 : 10000;

// How far the cloud starts and ends from the model (the model is 4 units long)
const INNER_RADIUS = 4.3; // small gap around the model so it stays clearly visible
const OUTER_RADIUS = 10;

const ORANGE = new THREE.Color("#E8512A");
const CREAM = new THREE.Color("#F5ECD7");
const DARK = new THREE.Color("#3A3A40");

/**
 * A LiDAR-style point cloud surrounding the 3D model: a dense shell of points
 * in every direction, orange close to the model and fading to grey further out.
 * Slowly rotates.
 */
export function PointCloudBackdrop() {
  const ref = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(POINT_COUNT * 3);
    const colors = new Float32Array(POINT_COUNT * 3);
    const color = new THREE.Color();
    const direction = new THREE.Vector3();

    for (let i = 0; i < POINT_COUNT; i++) {
      // Random direction (evenly spread over a sphere)
      direction.randomDirection();

      // Distance from the model, spread evenly between the inner and outer radius
      const t = Math.random();
      const radius = INNER_RADIUS + t * (OUTER_RADIUS - INNER_RADIUS);

      positions[i * 3] = direction.x * radius;
      positions[i * 3 + 1] = direction.y * radius * 0.7; // slightly flattened, so it's wider than tall
      positions[i * 3 + 2] = direction.z * radius;

      // Close points orange, middle cream, far points dark grey
      if (t < 0.35) color.copy(ORANGE).lerp(CREAM, t / 0.35);
      else color.copy(CREAM).lerp(DARK, (t - 0.35) / 0.65);
      colors.set([color.r, color.g, color.b], i * 3);
    }

    return { positions, colors };
  }, []);

  // Slow spin, opposite to the model's auto-rotate
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y -= delta * 0.05;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.03} vertexColors sizeAttenuation transparent opacity={0.85} />
    </points>
  );
}
