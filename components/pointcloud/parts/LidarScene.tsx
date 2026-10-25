"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";

import {
  ACCENT, AZIMUTH_STEP, BG, BLOSSOM, CHANNELS, FOV_DOWN, FOV_UP, HEIGHT_MAX, HEIGHT_MIN,
  HEIGHT_RAMP, INTENSITY, KIND_COLORS, MAX_MAP_POINTS, MAX_RANGE, ROVER_SPEED, SPIN_HZ, VOXEL_SIZE,
} from "./constants";
import {
  BUILDINGS, KINDS, PATH_LENGTH, ROAD_Y, ROVER_PATH, TREES, castRay, hit, nearby, type Kind,
} from "./world";
import { Rover, SENSOR_OFFSET } from "./Rover";
import { CherryPetals } from "./CherryPetals";
import { CampusLabels } from "./CampusLabels";

export type CameraMode = "chase" | "orbit" | "top";
export type ColorMode = "height" | "class";

/** Live numbers the HUD reads. The scene writes them every frame. */
export type LidarStats = {
  mapPoints: number;
  pointsPerSec: number;
  x: number;
  z: number;
  heading: number;
  distance: number;
  lap: number;
};

const DEG = Math.PI / 180;
const LIVE_MAX = CHANNELS * Math.ceil(360 / AZIMUTH_STEP); // one full rotation
const TRAIL_MAX = 600;
const TRAIL_SPACING = 0.6; // metres between trail points

// Beam angles, worked out once
const ELEVATIONS = Array.from({ length: CHANNELS }, (_, c) =>
  (FOV_DOWN + ((FOV_UP - FOV_DOWN) * c) / (CHANNELS - 1)) * DEG,
);
const COS_E = ELEVATIONS.map(Math.cos);
const SIN_E = ELEVATIONS.map(Math.sin);

// Colours
const RAMP = HEIGHT_RAMP.map((c) => new THREE.Color(c));
const KIND_RGB = KINDS.map((k) => new THREE.Color(KIND_COLORS[k]));
const KIND_INTENSITY = KINDS.map((k) => INTENSITY[k] ?? 1);
const BLOSSOM_RGB = BLOSSOM.map((c) => new THREE.Color(c));
const K_BLOSSOM = KINDS.indexOf("blossom");
const K_MARKING = KINDS.indexOf("marking");
const WHITE = new THREE.Color("#ffffff");

function paint(colors: Float32Array, i: number, y: number, kind: number, mode: ColorMode) {
  let c: THREE.Color;
  if (kind === K_BLOSSOM) {
    c = BLOSSOM_RGB[i % BLOSSOM_RGB.length]; // always pink, in a few shades
  } else if (mode === "class") {
    c = KIND_RGB[kind];
  } else if (kind === K_MARKING) {
    c = WHITE; // paint lines reflect strongly
  } else {
    const t = Math.min(Math.max((y - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN), 0), 1);
    const scaled = t * (RAMP.length - 1);
    const j = Math.min(Math.floor(scaled), RAMP.length - 2);
    c = _color.copy(RAMP[j]).lerp(RAMP[j + 1], scaled - j).multiplyScalar(KIND_INTENSITY[kind]);
  }
  colors[i * 3] = c.r;
  colors[i * 3 + 1] = c.g;
  colors[i * 3 + 2] = c.b;
}

// Reused every frame so we don't create garbage
const _color = new THREE.Color();
const _pos = new THREE.Vector3();
const _ahead = new THREE.Vector3();
const _origin = new THREE.Vector3();
const _dir = new THREE.Vector3();
const _point = new THREE.Vector3();
const _desired = new THREE.Vector3();
const _move = new THREE.Vector3();

/** A small soft circle, so points draw as round dots instead of squares. */
function makeDotTexture() {
  const size = 32;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.5, "rgba(255,255,255,0.9)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}

/** Tell the GPU only the part of a buffer that changed this frame. */
function upload(attr: THREE.BufferAttribute, start: number, count: number, max: number) {
  if (count === 0) return;
  if (start + count <= max) attr.addUpdateRange(start * attr.itemSize, count * attr.itemSize);
  attr.needsUpdate = true; // if it wrapped round, no range means "upload everything"
}

export const LidarScene: React.FC<{
  stats: React.MutableRefObject<LidarStats>;
  cameraMode: CameraMode;
  colorMode: ColorMode;
  resetKey: number;
}> = ({ stats, cameraMode, colorMode, resetKey }) => {
  const roverRef = useRef<THREE.Group>(null);
  const beamRef = useRef<THREE.Group>(null);
  const rangeRef = useRef<THREE.Mesh>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const controlsRef = useRef<any>(null);
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));
  // How many map points each building and tree has, so names and petals
  // only appear once the LiDAR has actually seen them
  const seen = useMemo(
    () => ({ buildings: new Uint32Array(BUILDINGS.length), trees: new Uint32Array(TREES.length) }),
    [],
  );
  const colorModeRef = useRef(colorMode);
  colorModeRef.current = colorMode;

  // ── Buffers (made once) ──────────────────────────────────────────────────
  const map = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(MAX_MAP_POINTS * 3);
    const colors = new Float32Array(MAX_MAP_POINTS * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    return {
      geometry, positions, colors,
      kinds: new Uint8Array(MAX_MAP_POINTS),
      keys: new Float64Array(MAX_MAP_POINTS),
      voxels: new Set<number>(),
      count: 0,
      next: 0, // where the next point is written (wraps round when full)
      repainted: false, // true after a colour-mode switch: upload all colours
    };
  }, []);

  const live = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(LIVE_MAX * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3).setUsage(THREE.DynamicDrawUsage));
    geometry.setDrawRange(0, 0);
    return { geometry, positions, count: 0, next: 0 };
  }, []);

  const trail = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(TRAIL_MAX * 3);
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setDrawRange(0, 0);
    const line = new THREE.Line(
      geometry,
      new THREE.LineBasicMaterial({ color: "#3DDC84", transparent: true, opacity: 0.9 }),
    );
    line.frustumCulled = false;
    return { line, positions, count: 0, lastDistance: -Infinity };
  }, []);

  const plannedPath = useMemo(() => {
    const pts = ROVER_PATH.getSpacedPoints(400).map(
      (p) => new THREE.Vector3(p.x, ROAD_Y + 0.08, p.z),
    );
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineDashedMaterial({ color: "#1FA5C9", dashSize: 1.2, gapSize: 0.8, transparent: true, opacity: 0.45 }),
    );
    line.computeLineDistances();
    return line;
  }, []);

  const beam = useMemo(() => {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, MAX_RANGE),
    ]);
    return new THREE.Line(geometry, new THREE.LineBasicMaterial({ color: ACCENT, transparent: true, opacity: 0.55 }));
  }, []);

  const dot = useMemo(makeDotTexture, []);

  const sim = useRef({ distance: 0, azimuth: 0, toFire: 0, pps: 0 });

  // ── Add one hit to the map, skipping it if its voxel is already filled ──
  function addToMap(p: THREE.Vector3, kind: Kind) {
    const key =
      (Math.floor(p.x / VOXEL_SIZE) + 1000) +
      (Math.floor(p.y / VOXEL_SIZE) + 1000) * 2048 +
      (Math.floor(p.z / VOXEL_SIZE) + 1000) * 2048 * 2048;
    if (map.voxels.has(key)) return false;

    const i = map.next;
    if (map.count === MAX_MAP_POINTS) map.voxels.delete(map.keys[i]); // overwrite the oldest
    map.voxels.add(key);
    map.keys[i] = key;
    map.kinds[i] = KINDS.indexOf(kind);
    map.positions[i * 3] = p.x;
    map.positions[i * 3 + 1] = p.y;
    map.positions[i * 3 + 2] = p.z;
    paint(map.colors, i, p.y, map.kinds[i], colorModeRef.current);

    map.next = (i + 1) % MAX_MAP_POINTS;
    map.count = Math.min(map.count + 1, MAX_MAP_POINTS);
    return true;
  }

  function addLive(p: THREE.Vector3) {
    const i = live.next;
    live.positions[i * 3] = p.x;
    live.positions[i * 3 + 1] = p.y;
    live.positions[i * 3 + 2] = p.z;
    live.next = (i + 1) % LIVE_MAX;
    live.count = Math.min(live.count + 1, LIVE_MAX);
  }

  // ── Reset button ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (resetKey === 0) return;
    map.voxels.clear();
    map.count = 0;
    map.next = 0;
    map.geometry.setDrawRange(0, 0);
    live.count = 0;
    live.next = 0;
    trail.count = 0;
    seen.buildings.fill(0);
    seen.trees.fill(0);
  }, [resetKey, map, live, trail, seen]);

  // ── Colour mode switch: repaint every point already in the map ─────────
  useEffect(() => {
    for (let i = 0; i < map.count; i++) {
      paint(map.colors, i, map.positions[i * 3 + 1], map.kinds[i], colorMode);
    }
    map.repainted = true;
  }, [colorMode, map]);

  // ── Free GPU memory when the section unmounts ────────────────────────────
  useEffect(() => {
    return () => {
      map.geometry.dispose();
      live.geometry.dispose();
      trail.line.geometry.dispose();
      plannedPath.geometry.dispose();
      beam.geometry.dispose();
      dot.dispose();
    };
  }, [map, live, trail, plannedPath, beam, dot]);

  // ── Every frame ──────────────────────────────────────────────────────────
  useFrame((state, rawDelta) => {
    const rover = roverRef.current;
    if (!rover) return;
    const dt = Math.min(rawDelta, 0.05); // avoid a huge jump after a tab switch
    const s = sim.current;

    // 1. Drive the rover along the loop
    s.distance += ROVER_SPEED * dt;
    const u = (s.distance / PATH_LENGTH) % 1;
    ROVER_PATH.getPointAt(u, _pos);
    ROVER_PATH.getPointAt((u + 1.5 / PATH_LENGTH) % 1, _ahead);
    rover.position.copy(_pos);
    rover.lookAt(_ahead);
    rover.updateMatrixWorld();
    _origin.copy(SENSOR_OFFSET).applyMatrix4(rover.matrixWorld);

    // 2. Fire the lasers for the slice of rotation covered this frame
    // The slice of rotation swept this frame, in world angles (rover heading + laser angle)
    const sweep = dt * SPIN_HZ * 360;
    const heading = Math.atan2(_ahead.x - _pos.x, _ahead.z - _pos.z);
    const near = nearby(
      _origin.x, _origin.z, MAX_RANGE,
      heading + s.azimuth * DEG,
      heading + (s.azimuth + s.toFire + sweep + AZIMUTH_STEP) * DEG,
    );
    const mapStart = map.next;
    const liveStart = live.next;
    let added = 0;
    let fired = 0;
    s.toFire += sweep;
    while (s.toFire >= AZIMUTH_STEP) {
      s.toFire -= AZIMUTH_STEP;
      s.azimuth = (s.azimuth + AZIMUTH_STEP) % 360;
      const a = s.azimuth * DEG;
      const sinA = Math.sin(a);
      const cosA = Math.cos(a);
      for (let c = 0; c < CHANNELS; c++) {
        _dir.set(sinA * COS_E[c], SIN_E[c], cosA * COS_E[c]).applyQuaternion(rover.quaternion);
        if (!castRay(_origin, _dir, MAX_RANGE, near)) continue;
        _point.copy(_dir).multiplyScalar(hit.distance).add(_origin);
        addLive(_point);
        fired++;
        if (addToMap(_point, hit.kind)) {
          added++;
          if (hit.building >= 0) seen.buildings[hit.building]++;
          if (hit.tree >= 0) seen.trees[hit.tree]++;
        }
      }
    }

    // 3. Send the new points to the GPU
    const mapPos = map.geometry.attributes.position as THREE.BufferAttribute;
    const mapCol = map.geometry.attributes.color as THREE.BufferAttribute;
    upload(mapPos, mapStart, added, MAX_MAP_POINTS);
    if (map.repainted) {
      mapCol.clearUpdateRanges(); // no range = upload the whole buffer
      mapCol.needsUpdate = true;
      map.repainted = false;
    } else {
      upload(mapCol, mapStart, added, MAX_MAP_POINTS);
    }
    map.geometry.setDrawRange(0, map.count);
    upload(live.geometry.attributes.position as THREE.BufferAttribute, liveStart, fired, LIVE_MAX);
    live.geometry.setDrawRange(0, live.count);

    // 4. Trail behind the rover
    if (s.distance - trail.lastDistance > TRAIL_SPACING) {
      trail.lastDistance = s.distance;
      if (trail.count === TRAIL_MAX) {
        trail.positions.copyWithin(0, 3); // drop the oldest point
        trail.count--;
      }
      trail.positions.set([_pos.x, _pos.y + 0.1, _pos.z], trail.count * 3);
      trail.count++;
      trail.line.geometry.attributes.position.needsUpdate = true;
      trail.line.geometry.setDrawRange(0, trail.count);
    }

    // 5. Beam and range ring follow the sensor
    if (beamRef.current) {
      beamRef.current.position.copy(_origin);
      beamRef.current.quaternion.copy(rover.quaternion);
      beamRef.current.rotateY(s.azimuth * DEG);
    }
    if (rangeRef.current) rangeRef.current.position.set(_pos.x, _pos.y + 0.05, _pos.z);

    // 6. Camera
    const cam = state.camera;
    const ease = 1 - Math.exp(-dt * 2.5);
    if (cameraMode === "chase") {
      _desired.set(0, 7, -14);
      rover.localToWorld(_desired);
      cam.position.lerp(_desired, ease);
      _desired.set(0, 2, 8);
      rover.localToWorld(_desired);
      lookTarget.current.lerp(_desired, ease * 2);
      cam.lookAt(lookTarget.current);
    } else if (cameraMode === "top") {
      _desired.set(_pos.x, _pos.y + 75, _pos.z + 20);
      cam.position.lerp(_desired, ease);
      lookTarget.current.lerp(_pos, ease * 2);
      cam.lookAt(lookTarget.current);
    } else if (controlsRef.current) {
      // Orbit: the user steers, the view drifts along with the rover
      const target = controlsRef.current.target as THREE.Vector3;
      _move.copy(_pos).sub(target);
      cam.position.add(_move);
      target.copy(_pos);
      lookTarget.current.copy(_pos);
    }

    // 7. Numbers for the HUD
    s.pps += (fired / dt - s.pps) * 0.05;
    const st = stats.current;
    st.mapPoints = map.count;
    st.pointsPerSec = s.pps;
    st.x = _pos.x;
    st.z = _pos.z;
    st.heading = (Math.atan2(_ahead.x - _pos.x, _ahead.z - _pos.z) / DEG + 360) % 360;
    st.distance = s.distance;
    st.lap = Math.floor(s.distance / PATH_LENGTH);
  });

  return (
    <>
      <color attach="background" args={[BG]} />
      <fog attach="fog" args={[BG, 70, 230]} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 5]} intensity={1.2} />

      {/* The map built so far */}
      <points geometry={map.geometry} frustumCulled={false}>        
        <pointsMaterial
          size={0.22}
          map={dot}
          vertexColors
          sizeAttenuation
          transparent
          opacity={0.9}
          alphaTest={0.05}
          depthWrite={false}
        />
      </points>

      {/* The latest full rotation, drawn bright on top */}
      <points geometry={live.geometry} frustumCulled={false}>
        <pointsMaterial
          size={0.2}
          map={dot}
          color="#F5ECD7"
          sizeAttenuation
          transparent
          opacity={0.6}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>

      <primitive object={plannedPath} />
      <primitive object={trail.line} />

      <group ref={beamRef}>
        <primitive object={beam} />
      </group>

      <mesh ref={rangeRef} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[MAX_RANGE - 0.08, MAX_RANGE, 96]} />
        <meshBasicMaterial color={ACCENT} transparent opacity={0.25} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>

      <Rover ref={roverRef} />

      <CherryPetals seenTrees={seen.trees} dot={dot} />
      <CampusLabels seenBuildings={seen.buildings} />

      <OrbitControls
        ref={controlsRef}
        enabled={cameraMode === "orbit"}
        enableDamping
        dampingFactor={0.08}
        enablePan={false}
        minDistance={6}
        maxDistance={120}
        maxPolarAngle={Math.PI / 2.1}
      />
    </>
  );
};
