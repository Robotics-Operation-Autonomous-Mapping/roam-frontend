"""
Turns an OpenStreetMap export (map.osm) of campus into the data file the
demo page's LiDAR simulation uses: components/pointcloud/parts/campusData.json

Usage (from the roam-frontend folder):
    pip install numpy matplotlib
    python scripts/build-campus-data.py path/to/map.osm

Everything is converted to metres: x = east, z = south, y = up, centred on
the middle of the export.
"""
import json
import math
import random
import sys
import xml.etree.ElementTree as ET

import numpy as np
from matplotlib.path import Path as MplPath

SRC = sys.argv[1] if len(sys.argv) > 1 else "map.osm"
OUT = sys.argv[2] if len(sys.argv) > 2 else "components/pointcloud/parts/campusData.json"
random.seed(7)

# ─── Read the OSM file ────────────────────────────────────────────────────────
root = ET.parse(SRC).getroot()
bounds = root.find("bounds").attrib
lat0 = (float(bounds["minlat"]) + float(bounds["maxlat"])) / 2
lon0 = (float(bounds["minlon"]) + float(bounds["maxlon"])) / 2
KX = 111320 * math.cos(math.radians(lat0))
KZ = 110540


def to_xz(lon, lat):
    return ((float(lon) - lon0) * KX, -(float(lat) - lat0) * KZ)


nodes = {n.get("id"): n for n in root.findall("node")}
ways = {w.get("id"): w for w in root.findall("way")}


def tags(e):
    return {t.get("k"): t.get("v") for t in e.findall("tag")}


def points(w):
    return [to_xz(nodes[nd.get("ref")].get("lon"), nodes[nd.get("ref")].get("lat"))
            for nd in w.findall("nd") if nd.get("ref") in nodes]


def height(t):
    try:
        return float(t["height"])
    except (KeyError, ValueError):
        pass
    if "building:levels" in t:
        return float(t["building:levels"]) * 4.2
    return 10.0


SHORT_NAMES = {
    "MacEwan Student Centre": "MacHall",
    "Taylor Institute for Teaching and Learning": "Taylor Institute",
    "Cenovus Spo’pi Solar House": "Spo'pi Solar House",
}

buildings, roads, paths, crossings, grass, plazas, parking, trees = [], [], [], [], [], [], [], []
for w in ways.values():
    t, p = tags(w), points(w)
    if len(p) < 2:
        continue
    hw = t.get("highway")
    if "building" in t:
        buildings.append({"name": t.get("name"), "h": height(t), "poly": p})
    elif hw in ("tertiary", "service", "unclassified", "residential"):
        roads.append((7 if hw == "tertiary" else 5, p))
    elif hw in ("footway", "steps", "path", "pedestrian", "cycleway"):
        if "Tunnel" in (t.get("name") or "") or t.get("tunnel") == "yes":
            continue
        (crossings if t.get("footway") == "crossing" else paths).append(p)
    elif t.get("landuse") == "grass" or t.get("leisure") == "garden" or t.get("natural") == "scrub":
        grass.append(p)
    elif t.get("amenity") == "parking":
        parking.append(p)
for rel in root.findall("relation"):
    t = tags(rel)
    for m in rel.findall("member"):
        if m.get("type") != "way" or m.get("role") != "outer" or m.get("ref") not in ways:
            continue
        p = points(ways[m.get("ref")])
        if "building" in t:
            buildings.append({"name": t.get("name"), "h": height(t), "poly": p})
        elif t.get("highway") == "pedestrian":
            plazas.append(p)
        elif t.get("amenity") == "parking":
            parking.append(p)
for n in root.findall("node"):
    if tags(n).get("natural") == "tree":
        trees.append(to_xz(n.get("lon"), n.get("lat")))

# ─── Ground map: what the ground is made of, every 0.5 m ──────────────────────
X0, X1, Z0, Z1, CELL = -110, 120, -130, 140, 0.5
GROUND, GRASS, PATH, ROAD, PARKING, MARKING, PLAZA = range(7)
nx, nz = int((X1 - X0) / CELL), int((Z1 - Z0) / CELL)
cx, cz = np.meshgrid(X0 + (np.arange(nx) + 0.5) * CELL, Z0 + (np.arange(nz) + 0.5) * CELL)
cells = np.stack([cx.ravel(), cz.ravel()], axis=1)
ground = np.zeros(nx * nz, dtype=np.uint8)


def fill_polygons(polys, value):
    for p in polys:
        if len(p) >= 3:
            ground[MplPath(p).contains_points(cells)] = value


def near_line(line, width):
    """Mask of cells within width/2 of a polyline, plus distance along it."""
    mask = np.zeros(len(cells), dtype=bool)
    along = np.zeros(len(cells))
    walked = 0.0
    for (ax, az), (bx, bz) in zip(line, line[1:]):
        dx, dz = bx - ax, bz - az
        seg = math.hypot(dx, dz) or 1e-6
        t = np.clip(((cells[:, 0] - ax) * dx + (cells[:, 1] - az) * dz) / seg ** 2, 0, 1)
        dist = np.hypot(cells[:, 0] - (ax + t * dx), cells[:, 1] - (az + t * dz))
        hit = dist < width / 2
        along[hit & ~mask] = walked + t[hit & ~mask] * seg
        mask |= hit
        walked += seg
    return mask, along


fill_polygons(grass, GRASS)
fill_polygons(plazas, PLAZA)
fill_polygons(parking, PARKING)
for line in paths:
    ground[near_line(line, 3)[0]] = PATH
for width, line in roads:
    ground[near_line(line, width)[0]] = ROAD
for width, line in roads:  # dashed centre lines, 3 m on, 3 m off
    mask, along = near_line(line, 0.35)
    ground[mask & ((along % 6) < 3)] = MARKING
for line in crossings:  # zebra stripes
    mask, along = near_line(line, 4)
    ground[mask & ((along % 1.0) < 0.5)] = MARKING

# Run-length encode: [value, count, value, count, ...]
rle, prev, count = [], int(ground[0]), 0
for v in ground:
    v = int(v)
    if v == prev:
        count += 1
    else:
        rle += [prev, count]
        prev, count = v, 1
rle += [prev, count]


def ground_at(x, z):
    i, j = int((x - X0) / CELL), int((z - Z0) / CELL)
    if 0 <= i < nx and 0 <= j < nz:
        return int(ground[j * nx + i])
    return -1


# ─── Rover route: a loop along Collegiate Boulevard ──────────────────────────
def road_with(start):
    for _, line in roads:
        if math.hypot(line[0][0] - start[0], line[0][1] - start[1]) < 0.5:
            return line
    raise SystemExit(f"No road starting near {start}")


loop = road_with((-3.59, -6.81))  # round the roundabout, then west
west = [p for p in road_with((-311.96, -30.49)) if p[0] >= -95]  # other carriageway, east
link1 = road_with((-50.01, -13.42))
link2 = road_with((-33.54, -16.23))
route = loop + west + link1[1:] + link2[1:-1]

# Even 1 m spacing, then smooth corners (Chaikin's corner cutting)
def resample(line, step):
    out = [line[0]]
    carry = 0.0
    for (ax, az), (bx, bz) in zip(line + [line[0]], line[1:] + [line[0]]):
        seg = math.hypot(bx - ax, bz - az)
        d = step - carry
        while d <= seg:
            out.append((ax + (bx - ax) * d / seg, az + (bz - az) * d / seg))
            d += step
        carry = seg - (d - step)
    return out


route = resample(route, 1.0)
for _ in range(3):
    route = [p for a, b in zip(route, route[1:] + route[:1])
             for p in ((0.75 * a[0] + 0.25 * b[0], 0.75 * a[1] + 0.25 * b[1]),
                       (0.25 * a[0] + 0.75 * b[0], 0.25 * a[1] + 0.75 * b[1]))]
route = resample(route, 2.0)

# ─── Cherry blossom trees: the real trees plus more along the paths ──────────
building_paths = [MplPath(b["poly"]) for b in buildings if len(b["poly"]) >= 3]


def clear_of_buildings(x, z, margin):
    return not any(bp.contains_point((x, z), radius=margin) or bp.contains_point((x, z), radius=-margin)
                   for bp in building_paths)


spots = list(trees)
for line in paths:
    for (ax, az), (bx, bz) in zip(line, line[1:]):
        seg = math.hypot(bx - ax, bz - az)
        for k in range(int(seg // 9)):
            t = (k + 0.5) * 9 / seg
            nxn, nzn = -(bz - az) / seg, (bx - ax) / seg
            side = random.choice((-1, 1)) * 3.2
            spots.append((ax + (bx - ax) * t + nxn * side, az + (bz - az) * t + nzn * side))

blossoms = []
for x, z in spots:
    if not (X0 < x < X1 and Z0 < z < Z1):
        continue
    if ground_at(x, z) not in (GRASS, GROUND, PLAZA) or not clear_of_buildings(x, z, 3):
        continue
    if any(math.hypot(x - b["x"], z - b["z"]) < 5 for b in blossoms):
        continue
    trunk = random.uniform(2.6, 3.6)
    crowns = []
    for _ in range(random.randint(4, 6)):  # lumpy crown made of several balls
        r = random.uniform(1.0, 1.8)
        crowns.append([round(x + random.uniform(-1.4, 1.4), 2),
                       round(trunk + random.uniform(0.3, 1.8), 2),
                       round(z + random.uniform(-1.4, 1.4), 2), round(r, 2)])
    blossoms.append({"x": round(x, 2), "z": round(z, 2), "trunk": round(trunk, 2), "crowns": crowns})

# ─── Cars in the parking lots ─────────────────────────────────────────────────
cars = []
for p in parking:
    if len(p) < 3:
        continue
    poly = MplPath(p)
    xs, zs = [q[0] for q in p], [q[1] for q in p]
    for x in np.arange(min(xs) + 1.5, max(xs) - 1.5, 2.8):
        for z in np.arange(min(zs) + 2.5, max(zs) - 2.5, 5.5):
            if poly.contains_point((x, z)) and clear_of_buildings(x, z, 2.5) and random.random() < 0.65:
                cars.append([round(x - 0.9, 2), round(z - 2.2, 2), round(x + 0.9, 2), round(z + 2.2, 2),
                             round(random.uniform(1.4, 1.8), 2)])

# ─── Street lamps along the boulevard ────────────────────────────────────────
lamps = []
for _, line in roads:
    walked = 0.0
    for (ax, az), (bx, bz) in zip(line, line[1:]):
        seg = math.hypot(bx - ax, bz - az)
        while walked < seg:
            t = walked / seg
            nxn, nzn = -(bz - az) / seg, (bx - ax) / seg
            x, z = ax + (bx - ax) * t + nxn * 4.5, az + (bz - az) * t + nzn * 4.5
            if X0 < x < X1 and Z0 < z < Z1 and clear_of_buildings(x, z, 1) and ground_at(x, z) != ROAD:
                lamps.append([round(x, 2), round(z, 2)])
            walked += 28
        walked -= seg

rnd = lambda poly: [[round(x, 2), round(z, 2)] for x, z in poly]
data = {
    "origin": {"lat": round(lat0, 6), "lon": round(lon0, 6)},
    "ground": {"x0": X0, "z0": Z0, "cell": CELL, "nx": nx, "nz": nz, "rle": rle},
    "buildings": [{"name": SHORT_NAMES.get(b["name"], b["name"]), "h": b["h"], "poly": rnd(b["poly"])}
                  for b in buildings],
    "route": rnd(route),
    "blossoms": blossoms,
    "cars": cars,
    "lamps": lamps,
}
json.dump(data, open(OUT, "w"), separators=(",", ":"))
print(f"buildings {len(buildings)}  route {len(route)} pts  blossoms {len(blossoms)}  cars {len(cars)}  lamps {len(lamps)}  rle {len(rle)}")
