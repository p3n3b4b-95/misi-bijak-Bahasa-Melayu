#!/usr/bin/env python3
"""Generates the scenery SVG sprites (mountains, trees, bushes, clouds, ground with path).

Original procedural artwork for Misi Bijak; no third-party art. Deterministic (fixed seeds).
Run from the repository root:  python3 android/art/gen/scenery.py
Output: android/art/svg/*.svg (sources of truth); build_assets.py renders them to WebP.
"""
import math
import random
from pathlib import Path

OUT = Path(__file__).resolve().parents[1] / "svg"
OUT.mkdir(parents=True, exist_ok=True)

def svg(w, h, body, defs=""):
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">'
            f'<defs>{defs}</defs>{body}</svg>\n')

def lin(id_, stops, x1=0, y1=0, x2=0, y2=1):
    s = "".join(f'<stop offset="{o}" stop-color="{c}"/>' for o, c in stops)
    return f'<linearGradient id="{id_}" x1="{x1}" y1="{y1}" x2="{x2}" y2="{y2}">{s}</linearGradient>'

def smooth_path(points, closed=True):
    """Quadratic-midpoint smoothing through control points."""
    def mid(a, b): return ((a[0] + b[0]) / 2, (a[1] + b[1]) / 2)
    n = len(points)
    if closed:
        m0 = mid(points[-1], points[0])
        d = f"M{m0[0]:.1f},{m0[1]:.1f}"
        for i in range(n):
            p, m = points[i], mid(points[i], points[(i + 1) % n])
            d += f" Q{p[0]:.1f},{p[1]:.1f} {m[0]:.1f},{m[1]:.1f}"
        return d + " Z"
    d = f"M{points[0][0]:.1f},{points[0][1]:.1f}"
    for i in range(1, n - 1):
        m = mid(points[i], points[i + 1])
        d += f" Q{points[i][0]:.1f},{points[i][1]:.1f} {m[0]:.1f},{m[1]:.1f}"
    return d + f" L{points[-1][0]:.1f},{points[-1][1]:.1f}"

# ----------------------------------------------------------------------------- mountains
def mountain_range(peaks, base_y, w, light, shade, snow, snow_depth, rng, rough=14):
    """Faceted range: lit left faces, shaded right faces, snow caps."""
    out = []
    xs = [(-200, base_y)] + peaks + [(w + 200, base_y)]
    # ridge polygon
    ridge = []
    for i in range(len(xs) - 1):
        a, b = xs[i], xs[i + 1]
        ridge.append(a)
        # valley between peaks
        vx = (a[0] + b[0]) / 2 + rng.uniform(-30, 30)
        vy = max(a[1], b[1]) + (base_y - max(a[1], b[1])) * 0.55 if (i != 0 and i != len(xs) - 2) else base_y
        ridge.append((vx, vy))
    ridge.append(xs[-1])
    pts = " ".join(f"{x:.1f},{y:.1f}" for x, y in ridge) + f" {w + 200},{base_y + 50} -200,{base_y + 50}"
    out.append(f'<polygon points="{pts}" fill="{light}" stroke="{light}" stroke-width="6" stroke-linejoin="round"/>')
    for (px, py) in peaks:
        height = base_y - py
        half = height * 0.95
        # shaded right face
        sh = [(px, py), (px + half * 0.18, py + height * 0.30), (px + half * 0.10, py + height * 0.52),
              (px + half * 0.34, py + height * 0.72), (px + half, base_y), (px + half * 0.2, base_y)]
        out.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in sh)}" fill="{shade}" opacity="0.95"/>')
        # ridge line highlight facets on lit side
        lit = [(px, py), (px - half * 0.16, py + height * 0.34), (px - half * 0.04, py + height * 0.60), (px - half * 0.5, base_y)]
        out.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in lit)}" fill="#ffffff" opacity="0.10"/>')
        # snow cap
        d = snow_depth * height
        cap = [(px, py - 2),
               (px + d * 0.55, py + d * 0.95), (px + d * 0.30, py + d * 0.72), (px + d * 0.1, py + d * 1.15),
               (px - d * 0.15, py + d * 0.78), (px - d * 0.38, py + d * 1.12), (px - d * 0.62, py + d * 0.9)]
        out.append(f'<polygon points="{" ".join(f"{x:.1f},{y:.1f}" for x, y in cap)}" fill="{snow}" stroke="{snow}" stroke-width="4" stroke-linejoin="round"/>')
    return "".join(out)

def mountains():
    rng = random.Random(7)
    W, H = 2400, 760
    far = mountain_range([(190, 330), (560, 190), (930, 290), (1300, 150), (1700, 280), (2060, 200), (2390, 320)],
                         H, W, "#C4CFF6", "#A6B6EE", "#FFFFFF", 0.26, rng)
    near = mountain_range([(30, 470), (420, 350), (820, 440), (1180, 330), (1560, 430), (1960, 340), (2330, 450)],
                          H, W, "#8EA6EA", "#6D86D8", "#F2F6FF", 0.20, rng)
    foothill = f'<path d="{smooth_path([(-100, H), (200, 640), (600, 600), (1000, 650), (1400, 610), (1800, 650), (2200, 600), (2500, H)])}" fill="#76CF58"/>'
    foothill2 = f'<path d="{smooth_path([(-100, H), (300, 690), (800, 660), (1300, 700), (1800, 665), (2300, 700), (2500, H)])}" fill="#5FC24A"/>'
    (OUT / "mountains.svg").write_text(svg(W, H, far + near + foothill + foothill2))

# ----------------------------------------------------------------------------- trees and bushes
def canopy(cx, cy, r, rng, dark, mid, light, hi, n=9):
    out = []
    blobs = []
    for i in range(n):
        ang = rng.uniform(0, 2 * math.pi)
        dist = rng.uniform(0.0, 0.55) * r
        blobs.append((cx + math.cos(ang) * dist, cy + math.sin(ang) * dist * 0.8, r * rng.uniform(0.42, 0.62)))
    blobs.append((cx, cy, r * 0.72))
    for (x, y, rr) in blobs:                       # dark base
        out.append(f'<circle cx="{x:.1f}" cy="{y + rr * 0.10:.1f}" r="{rr:.1f}" fill="{dark}"/>')
    for (x, y, rr) in blobs:                       # mid tone, nudged up-left
        out.append(f'<circle cx="{x - rr * 0.07:.1f}" cy="{y - rr * 0.08:.1f}" r="{rr * 0.9:.1f}" fill="{mid}"/>')
    for (x, y, rr) in blobs:                       # light tone, up-left
        out.append(f'<circle cx="{x - rr * 0.22:.1f}" cy="{y - rr * 0.28:.1f}" r="{rr * 0.55:.1f}" fill="{light}"/>')
    for (x, y, rr) in blobs[:5]:                   # tiny highlights
        out.append(f'<circle cx="{x - rr * 0.34:.1f}" cy="{y - rr * 0.42:.1f}" r="{rr * 0.20:.1f}" fill="{hi}" opacity="0.8"/>')
    return "".join(out)

def tree(name, seed, w=400, h=520, canopy_r=150, lean=0):
    rng = random.Random(seed)
    cx = w / 2
    defs = lin("trunk", [(0, "#A06A3C"), (0.6, "#7C4E2A"), (1, "#5E3A1F")], 0, 0, 1, 0)
    body = []
    body.append(f'<ellipse cx="{cx}" cy="{h - 14}" rx="{w * 0.30}" ry="18" fill="#2E7D32" opacity="0.28"/>')
    # trunk with a flared base and two branches
    body.append(f'<path d="M{cx - 26 + lean},{h - 18} C{cx - 14},{h - 120} {cx - 22},{h - 200} {cx - 12 + lean},{h - 280} '
                f'L{cx + 14 + lean},{h - 280} C{cx + 24},{h - 200} {cx + 16},{h - 120} {cx + 34 + lean},{h - 18} '
                f'C{cx + 10},{h - 8} {cx - 10},{h - 8} {cx - 26 + lean},{h - 18} Z" fill="url(#trunk)"/>')
    body.append(f'<path d="M{cx + lean},{h - 220} C{cx - 40},{h - 250} {cx - 70},{h - 270} {cx - 90},{h - 300}" fill="none" stroke="#6E4524" stroke-width="22" stroke-linecap="round"/>')
    body.append(f'<path d="M{cx + lean},{h - 200} C{cx + 40},{h - 240} {cx + 70},{h - 262} {cx + 92},{h - 296}" fill="none" stroke="#6E4524" stroke-width="20" stroke-linecap="round"/>')
    body.append(f'<path d="M{cx - 6},{h - 40} C{cx - 8},{h - 120} {cx - 10},{h - 190} {cx - 4},{h - 260}" fill="none" stroke="#4A2D15" stroke-width="5" opacity="0.5" stroke-linecap="round"/>')
    body.append(canopy(cx + lean, h - 340, canopy_r, rng, "#2F9E44", "#4CBB4D", "#7FDB5C", "#C5F59A"))
    (OUT / f"{name}.svg").write_text(svg(w, h, "".join(body), defs))

def bush(name, seed, w=380, h=250):
    rng = random.Random(seed)
    body = [f'<ellipse cx="{w / 2}" cy="{h - 12}" rx="{w * 0.42}" ry="14" fill="#2E7D32" opacity="0.25"/>']
    body.append(canopy(w / 2, h - 110, w * 0.30, rng, "#2F9E44", "#4CBB4D", "#7FDB5C", "#C5F59A", n=7))
    (OUT / f"{name}.svg").write_text(svg(w, h, "".join(body)))

# ----------------------------------------------------------------------------- clouds
def cloud(name, seed, w=560, h=240):
    rng = random.Random(seed)
    defs = lin("cl", [(0, "#FFFFFF"), (0.7, "#F4FAFF"), (1, "#D5E8FA")])
    puffs = [(0.25, 0.62, 0.20), (0.42, 0.45, 0.26), (0.62, 0.40, 0.28), (0.80, 0.58, 0.20), (0.52, 0.66, 0.24)]
    body = []
    body.append(f'<rect x="{w * 0.10}" y="{h * 0.52}" width="{w * 0.80}" height="{h * 0.34}" rx="{h * 0.17}" fill="url(#cl)"/>')
    for (px, py, pr) in puffs:
        r = pr * w * 0.55 * rng.uniform(0.95, 1.05)
        body.append(f'<circle cx="{px * w:.1f}" cy="{py * h:.1f}" r="{r:.1f}" fill="url(#cl)"/>')
    for (px, py, pr) in puffs[:3]:   # soft highlights
        body.append(f'<circle cx="{px * w - 10:.1f}" cy="{py * h - 14:.1f}" r="{pr * w * 0.22:.1f}" fill="#fff" opacity="0.85"/>')
    (OUT / f"{name}.svg").write_text(svg(w, h, "".join(body), defs))

# ----------------------------------------------------------------------------- ground with winding path
def path_ribbon(center, widths):
    left = [(x - w / 2, y) for (x, y), w in zip(center, widths)]
    right = [(x + w / 2, y) for (x, y), w in zip(center, widths)]
    pts = left + right[::-1]
    return smooth_path(pts, closed=True)

def ground(name="ground", seed=11):
    rng = random.Random(seed)
    W, H = 2400, 1300
    defs = (lin("g1", [(0, "#A8E86A"), (1, "#78D14A")]) + lin("g2", [(0, "#8FDD57"), (1, "#5DC23B")]) +
            lin("g3", [(0, "#82D94B"), (1, "#4DB02D")]) + lin("sand", [(0, "#F8DA8C"), (1, "#EFC468")]))
    body = []
    # solid base so no sky shows between the hills
    body.append(f'<rect x="-100" y="190" width="{W + 200}" height="{H}" fill="#7FD44B"/>')
    # back hills (their tops sit near y=40, the horizon line used by the app)
    body.append(f'<path d="{smooth_path([(-100, 330), (260, 150), (700, 90), (1100, 150), (1500, 80), (1950, 140), (2300, 100), (2500, 330), (2500, H), (-100, H)])}" fill="url(#g1)"/>')
    body.append(f'<path d="{smooth_path([(-100, 420), (300, 280), (800, 230), (1250, 290), (1700, 230), (2100, 270), (2500, 230), (2500, H), (-100, H)])}" fill="url(#g2)"/>')
    body.append(f'<path d="{smooth_path([(-100, 560), (400, 470), (1000, 440), (1500, 480), (2000, 450), (2500, 480), (2500, H), (-100, H)])}" fill="url(#g3)"/>')
    # soft light blotches for a painted feel
    for _ in range(26):
        x, y = rng.uniform(0, W), rng.uniform(120, H - 100)
        body.append(f'<ellipse cx="{x:.0f}" cy="{y:.0f}" rx="{rng.uniform(60, 180):.0f}" ry="{rng.uniform(18, 46):.0f}" fill="#C8F59A" opacity="{rng.uniform(0.10, 0.22):.2f}"/>')
    # winding path: centre line and widening width
    centre = [(1210, 300), (1130, 400), (1290, 540), (1040, 700), (1190, 880), (1120, 1080), (1200, H + 60)]
    widths = [60, 120, 190, 300, 460, 700, 980]
    body.append(f'<path d="{path_ribbon(centre, [w + 34 for w in widths])}" fill="#E1AA4F"/>')
    body.append(f'<path d="{path_ribbon(centre, widths)}" fill="url(#sand)"/>')
    body.append(f'<path d="{path_ribbon(centre, [w * 0.45 for w in widths])}" fill="#FCE7AE" opacity="0.55"/>')
    # pebbles along the edges
    for (cx, cy), w in zip(centre, widths):
        for side in (-1, 1):
            if rng.random() < 0.8:
                px, py = cx + side * (w / 2 + rng.uniform(10, 30)), cy + rng.uniform(-40, 40)
                body.append(f'<ellipse cx="{px:.0f}" cy="{py:.0f}" rx="{rng.uniform(10, 22):.0f}" ry="{rng.uniform(7, 14):.0f}" fill="#D9C28F" opacity="0.95"/>')
                body.append(f'<ellipse cx="{px - 3:.0f}" cy="{py - 3:.0f}" rx="6" ry="4" fill="#F3E6C2" opacity="0.8"/>')
    # grass tufts and flowers
    def tuft(x, y, s):
        d = "".join(f'<path d="M{x + dx * s:.0f},{y:.0f} q{dx * s * 0.2:.0f},{-s * 1.1:.0f} {dx * s * 0.9:.0f},{-s * 1.8:.0f}" fill="none" stroke="#3E9C2F" stroke-width="{max(3, s / 5):.0f}" stroke-linecap="round"/>' for dx in (-1.2, -0.4, 0.4, 1.2))
        return d
    for _ in range(70):
        x, y = rng.uniform(40, W - 40), rng.uniform(300, H - 60)
        if abs(x - 1150) < 330 + (y - 300) * 0.45:
            continue
        body.append(tuft(x, y, rng.uniform(14, 30)))
    colors = ["#FFFFFF", "#FFE066", "#FF8FB1", "#FFB347"]
    for _ in range(46):
        x, y = rng.uniform(60, W - 60), rng.uniform(320, H - 80)
        if abs(x - 1150) < 330 + (y - 300) * 0.45:
            continue
        c = rng.choice(colors)
        r = rng.uniform(7, 14)
        for k in range(5):
            a = k * 2 * math.pi / 5
            body.append(f'<circle cx="{x + math.cos(a) * r:.1f}" cy="{y + math.sin(a) * r:.1f}" r="{r * 0.62:.1f}" fill="{c}"/>')
        body.append(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{r * 0.5:.1f}" fill="#F7A21B"/>')
    (OUT / f"{name}.svg").write_text(svg(W, H, "".join(body), defs))

def rocks(name="rocks", w=420, h=220):
    defs = lin("rk", [(0, "#C9CED8"), (1, "#8D95A6")])
    body = ('<ellipse cx="210" cy="206" rx="170" ry="12" fill="#2E7D32" opacity="0.25"/>'
            '<path d="M40,196 C30,150 70,110 120,108 C160,92 210,96 230,130 C262,124 300,140 304,180 C306,200 290,208 270,208 L60,208 C48,208 42,204 40,196 Z" fill="url(#rk)"/>'
            '<path d="M70,160 C86,130 130,120 160,124" fill="none" stroke="#fff" stroke-width="9" opacity="0.5" stroke-linecap="round"/>'
            '<path d="M300,200 C300,170 330,150 360,156 C388,160 398,184 390,204 Z" fill="#A9B0BF"/>')
    (OUT / f"{name}.svg").write_text(svg(w, h, body, defs))

if __name__ == "__main__":
    mountains()
    tree("tree_a", 3, canopy_r=150)
    tree("tree_b", 8, canopy_r=130, lean=-8)
    tree("tree_c", 21, canopy_r=165, lean=10)
    bush("bush_a", 5)
    bush("bush_b", 17)
    cloud("cloud_a", 2)
    cloud("cloud_b", 9)
    cloud("cloud_c", 14)
    ground()
    rocks()
    print("scenery SVGs written to", OUT)
