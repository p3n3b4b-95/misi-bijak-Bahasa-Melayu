#!/usr/bin/env python3
"""Generates the painterly scenery sprites for UI-01C (mountains, ground with path, trees, bushes,
clouds, rocks, a kampung hut and a signpost).

Original procedural artwork for Misi Bijak; no third-party art. Deterministic (fixed seeds).
Built with paintkit.py: aerial perspective (far layers paler and bluer, haze at each base),
soft blurred shading, light from the upper left, and a fine paint grain.
Run from the repository root:  python3 android/art/gen/scenery.py
Output: android/art/svg/*.svg (sources of truth); tools/art/build_assets.py renders them to WebP.
"""
import math
import random
from pathlib import Path
from paintkit import Art, ellipse_d, circle_d

OUT = Path(__file__).resolve().parents[1] / "svg"


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


def poly(pts):
    return "M" + " L".join(f"{x:.1f},{y:.1f}" for x, y in pts) + " Z"


# ---------------------------------------------------------------------------------------- mountains

def mountain_range(a, peaks, base_y, w, base, shade, light, snow, snow_shade, snow_depth, haze, rng, soft=0):
    """A range with soft shaded right faces, lit ridges, shaded snow caps and haze at its foot."""
    xs = [(-200, base_y)] + peaks + [(w + 200, base_y)]
    ridge = []
    for i in range(len(xs) - 1):
        p, q = xs[i], xs[i + 1]
        ridge.append(p)
        if 0 < i < len(xs) - 2:
            vy = max(p[1], q[1]) + (base_y - max(p[1], q[1])) * 0.5
            ridge.append(((p[0] + q[0]) / 2 + rng.uniform(-40, 40), vy))
    ridge.append(xs[-1])
    rng_d = poly(ridge + [(w + 200, base_y + 60), (-200, base_y + 60)])
    out = [f'<path d="{rng_d}" fill="{base}" stroke="{base}" stroke-width="8" stroke-linejoin="round"/>']
    clip = a.clip(rng_d)
    inner = []
    for (px, py) in peaks:
        h = base_y - py
        half = h * 0.95
        face = [(px, py), (px + half * 0.14, py + h * 0.28), (px + half * 0.04, py + h * 0.5),
                (px + half * 0.3, py + h * 0.74), (px + half * 1.1, base_y + 20), (px + half * 0.1, base_y + 20)]
        inner.append(a.soft(poly(face), shade, 0.85, 7 + soft))
        gully = [(px - half * 0.12, py + h * 0.30), (px - half * 0.02, py + h * 0.62), (px - half * 0.22, base_y), (px - half * 0.34, base_y)]
        inner.append(a.soft(poly(gully), shade, 0.35, 6 + soft))
        lit = [(px, py), (px - half * 0.18, py + h * 0.36), (px - half * 0.06, py + h * 0.62), (px - half * 0.6, base_y)]
        inner.append(a.soft(poly(lit), light, 0.45, 8 + soft))
        d = snow_depth * h
        cap = [(px, py - 3), (px + d * 0.62, py + d * 0.98), (px + d * 0.34, py + d * 0.78), (px + d * 0.14, py + d * 1.16),
               (px - d * 0.12, py + d * 0.82), (px - d * 0.36, py + d * 1.1), (px - d * 0.66, py + d * 0.92)]
        cap_d = poly(cap)
        inner.append(f'<path d="{cap_d}" fill="{snow}" stroke="{snow}" stroke-width="5" stroke-linejoin="round"/>')
        inner.append(a.soft(poly([(px, py), (px + d * 0.7, py + d * 1.2), (px + d * 0.05, py + d * 1.3)]), snow_shade, 0.8, 4, clip_d=cap_d))
    inner.append(f'<rect x="-300" y="{base_y - (base_y - min(p[1] for p in peaks)) * 0.55}" width="{w + 600}" '
                 f'height="{(base_y - min(p[1] for p in peaks)) * 0.55 + 80}" fill="{a.grad([(0, (haze, 0)), (1, (haze, 0.75))])}"/>')
    out.append(f'<g clip-path="url(#{clip})">{"".join(inner)}</g>')
    return "".join(out)


def forest_band(a, y_line, w, rng, dark, mid, light, size=(18, 34), step=(22, 40)):
    out = []
    x = -40
    while x < w + 40:
        r = rng.uniform(*size)
        y = y_line(x)
        out.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="{r:.0f}" fill="{dark}"/>')
        out.append(f'<circle cx="{x - r * 0.2:.0f}" cy="{y - r * 0.25:.0f}" r="{r * 0.75:.0f}" fill="{mid}"/>')
        out.append(f'<circle cx="{x - r * 0.35:.0f}" cy="{y - r * 0.45:.0f}" r="{r * 0.35:.0f}" fill="{light}" opacity="0.8"/>')
        x += rng.uniform(*step)
    return "".join(out)


def mountains():
    rng = random.Random(7)
    W, H = 2400, 760
    a = Art(W, H)
    grain = a.grain(strength=0.08, freq=0.75, mottle=0.06, seed=3)
    far = mountain_range(a, [(190, 300), (560, 160), (930, 270), (1300, 120), (1700, 250), (2060, 170), (2390, 290)],
                         H - 60, W, "#BFCBF2", "#9DAEE6", "#E8EEFF", "#FFFFFF", "#C9D5F5", 0.24, "#EAF2FF", rng, soft=3)
    mid = mountain_range(a, [(30, 450), (420, 330), (820, 420), (1180, 300), (1560, 410), (1960, 320), (2330, 430)],
                         H - 20, W, "#7E98E2", "#5470C8", "#B3C6FF", "#F4F8FF", "#B5C4EE", 0.20, "#DCEBFF", rng)
    near = f'<path d="{smooth_path([(-100, H + 40), (-100, 600), (260, 560), (640, 600), (1020, 545), (1420, 590), (1800, 550), (2200, 590), (2500, 570), (2500, H + 40)])}" fill="#5DA98A"/>'
    near += a.soft(smooth_path([(-100, 640), (600, 610), (1200, 640), (1800, 610), (2500, 640), (2500, 700), (-100, 700)]), "#3D8C70", 0.6, 14)
    band = forest_band(a, lambda x: 600 + 22 * math.sin(x / 230), W, rng, "#2F7D5A", "#3F9A6A", "#7CC890")
    hill = f'<path d="{smooth_path([(-100, H + 40), (-100, 680), (300, 650), (800, 672), (1300, 640), (1800, 668), (2300, 645), (2500, 670), (2500, H + 40)])}" fill="#78C85A"/>'
    hill += a.soft(smooth_path([(-100, 690), (700, 676), (1500, 686), (2500, 676), (2500, 720), (-100, 720)]), "#BFF08E", 0.5, 10)
    (OUT / "mountains.svg").write_text(a.svg(far + mid + near + band + hill, grain=grain))


# ---------------------------------------------------------------------------------------- foliage

def canopy(a, cx, cy, r, rng, n=10, palette=("#1F7A3A", "#33A047", "#62C255", "#A8E67A")):
    """Leafy crown: dark mass, soft mid clusters, sunlit clusters top-left, scalloped edges."""
    dark, mid, light, hi = palette
    blobs = [(cx, cy, r * 0.74)]
    for _ in range(n):
        ang = rng.uniform(0, 2 * math.pi)
        dist = rng.uniform(0.15, 0.58) * r
        blobs.append((cx + math.cos(ang) * dist, cy + math.sin(ang) * dist * 0.8, r * rng.uniform(0.38, 0.56)))
    outline = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr + 5:.1f}" fill="#24502A"/>' for x, y, rr in blobs)
    mass = "".join(f'<circle cx="{x:.1f}" cy="{y:.1f}" r="{rr:.1f}"/>' for x, y, rr in blobs)
    mass_d = " ".join(ellipse_d(x, y, rr, rr) for x, y, rr in blobs)
    out = [outline, f'<g fill="{dark}">{mass}</g>']
    clip = a.clip(mass_d)
    inner = []
    for x, y, rr in blobs:
        inner.append(a.soft(circle_d(x - rr * 0.12, y - rr * 0.16, rr * 0.86), mid, 0.95, 3))
    for x, y, rr in sorted(blobs, key=lambda b: b[0] + b[1])[: max(4, len(blobs) // 2)]:
        inner.append(a.soft(circle_d(x - rr * 0.28, y - rr * 0.32, rr * 0.55), light, 0.9, 5))
    for x, y, rr in sorted(blobs, key=lambda b: b[0] + b[1])[:4]:
        inner.append(a.soft(circle_d(x - rr * 0.38, y - rr * 0.46, rr * 0.2), hi, 0.85, 3))
    # leaf flecks
    for _ in range(int(r / 3)):
        x, y = cx + rng.uniform(-r, r), cy + rng.uniform(-r * 0.8, r * 0.8)
        col = light if (x - cx) + (y - cy) < 0 else dark
        inner.append(f'<path d="M{x:.0f},{y:.0f} q6,-10 14,-4 q-4,9 -14,4 Z" fill="{col}" opacity="0.55"/>')
    inner.append(a.soft(ellipse_d(cx + r * 0.35, cy + r * 0.45, r * 0.9, r * 0.5), "#0F4A22", 0.45, 18))
    out.append(f'<g clip-path="url(#{clip})">{"".join(inner)}</g>')
    return "".join(out)


def tree(name, seed, w=400, h=520, canopy_r=150, lean=0, palette=None):
    rng = random.Random(seed)
    a = Art(w, h)
    grain = a.grain(strength=0.10, freq=0.9, mottle=0.06, seed=seed)
    cx = w / 2
    B = [a.soft(ellipse_d(cx, h - 16, w * 0.32, 16), "#1E5A22", 0.4, 8)]
    trunk = (f"M{cx - 28 + lean},{h - 18} C{cx - 14},{h - 120} {cx - 22},{h - 200} {cx - 12 + lean},{h - 280} "
             f"L{cx + 14 + lean},{h - 280} C{cx + 24},{h - 200} {cx + 16},{h - 120} {cx + 36 + lean},{h - 18} "
             f"C{cx + 10},{h - 8} {cx - 10},{h - 8} {cx - 28 + lean},{h - 18} Z")
    B.append(a.limb(f"M{cx + lean},{h - 220} C{cx - 40},{h - 250} {cx - 70},{h - 270} {cx - 90},{h - 300}", 20, "#7A4B28", "#4A2A14", None, lw=4))
    B.append(a.limb(f"M{cx + lean},{h - 200} C{cx + 40},{h - 240} {cx + 70},{h - 262} {cx + 92},{h - 296}", 18, "#7A4B28", "#4A2A14", None, lw=4))
    B.append(a.shape(trunk, "#8A5630", "#4E2C15", "#C08A58", lw=5, line="#3E2210", dx=14, dy=6, blur=6))
    B.append(f'<path d="M{cx - 8},{h - 50} C{cx - 10},{h - 120} {cx - 12},{h - 190} {cx - 6},{h - 250} M{cx + 10},{h - 70} '
             f'C{cx + 12},{h - 130} {cx + 8},{h - 170} {cx + 12},{h - 220}" fill="none" stroke="#4A2A14" stroke-width="5" opacity="0.5" stroke-linecap="round"/>')
    B.append(canopy(a, cx + lean, h - 340, canopy_r, rng, palette=palette or ("#1F7A3A", "#33A047", "#62C255", "#A8E67A")))
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=grain))


def bush(name, seed, w=380, h=250):
    rng = random.Random(seed)
    a = Art(w, h)
    grain = a.grain(strength=0.10, freq=0.9, mottle=0.06, seed=seed)
    B = [a.soft(ellipse_d(w / 2, h - 14, w * 0.42, 14), "#1E5A22", 0.4, 7)]
    B.append(canopy(a, w / 2, h - 108, w * 0.29, rng, n=7, palette=("#24863C", "#3DAE4C", "#78D35E", "#C2F29A")))
    for _ in range(5):
        x, y = rng.uniform(w * 0.25, w * 0.75), rng.uniform(h * 0.35, h * 0.7)
        B.append(f'<circle cx="{x:.0f}" cy="{y:.0f}" r="8" fill="#FF8FB1" stroke="#B0406A" stroke-width="2"/><circle cx="{x:.0f}" cy="{y:.0f}" r="3" fill="#FFE066"/>')
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=grain))


# ---------------------------------------------------------------------------------------- clouds

def cloud(name, seed, w=560, h=240):
    rng = random.Random(seed)
    a = Art(w, h)
    puffs = [(0.22, 0.62, 0.17), (0.40, 0.46, 0.25), (0.60, 0.40, 0.28), (0.80, 0.58, 0.18), (0.50, 0.64, 0.22),
             (0.32, 0.68, 0.16), (0.68, 0.66, 0.17), (0.14, 0.70, 0.11), (0.88, 0.68, 0.11)]
    circles = []
    for px, py, pr in puffs:
        r = pr * w * 0.55 * rng.uniform(0.95, 1.05)
        circles.append((px * w, py * h, r))
    shape_d = " ".join(ellipse_d(x, y, r, r) for x, y, r in circles)
    B = [f'<g filter="url(#{a.blur(1.5)})"><path d="{shape_d}" fill="#FFFFFF"/></g>']
    inner = [a.soft(f"M0,{h * 0.62} C{w * 0.3},{h * 0.74} {w * 0.7},{h * 0.7} {w},{h * 0.6} L{w},{h} L0,{h} Z", "#B7CDEB", 0.8, 14)]
    for x, y, r in circles[:3]:
        inner.append(a.soft(circle_d(x - r * 0.25, y - r * 0.3, r * 0.5), "#FFFFFF", 1, 8))
    inner.append(a.soft(f"M{w * 0.15},{h * 0.78} C{w * 0.4},{h * 0.88} {w * 0.7},{h * 0.86} {w * 0.88},{h * 0.76} L{w},{h} L0,{h} Z", "#9FB9E0", 0.55, 10))
    B.append(f'<g clip-path="url(#{a.clip(shape_d)})">{"".join(inner)}</g>')
    (OUT / f"{name}.svg").write_text(a.svg("".join(B)))


# ---------------------------------------------------------------------------------------- ground

def path_ribbon(center, widths):
    left = [(x - w / 2, y) for (x, y), w in zip(center, widths)]
    right = [(x + w / 2, y) for (x, y), w in zip(center, widths)]
    return smooth_path(left + right[::-1], closed=True)


def ground(name="ground", seed=11):
    rng = random.Random(seed)
    W, H = 2400, 1300
    a = Art(W, H)
    grain = a.grain(strength=0.10, freq=0.8, mottle=0.08, seed=seed)
    B = [f'<rect x="-100" y="190" width="{W + 200}" height="{H}" fill="#7CCF4C"/>']
    hills = [
        ([(-100, 330), (260, 150), (700, 90), (1100, 150), (1500, 80), (1950, 140), (2300, 100), (2500, 330), (2500, H), (-100, H)], ("#B4EC78", "#86D452")),
        ([(-100, 420), (300, 280), (800, 230), (1250, 290), (1700, 230), (2100, 270), (2500, 230), (2500, H), (-100, H)], ("#9BE262", "#62C23E")),
        ([(-100, 560), (400, 470), (1000, 440), (1500, 480), (2000, 450), (2500, 480), (2500, H), (-100, H)], ("#8ADB55", "#4FB232")),
    ]
    for pts, (top, bottom) in hills:
        d = smooth_path(pts)
        B.append(f'<path d="{d}" fill="{a.grad([(0, top), (0.55, bottom), (1, bottom)])}"/>')
        # sunlit crest and a soft shadow line under the crest of the next hill
        crest = smooth_path([(x, y) for x, y in pts[:-2]], closed=False)
        B.append(a.soft_line(crest, "#E2FFB0", 18, 0.55, 8, clip_d=d))
    for _ in range(30):
        x, y = rng.uniform(0, W), rng.uniform(150, H - 80)
        B.append(a.soft(ellipse_d(x, y, rng.uniform(80, 220), rng.uniform(20, 50)),
                        rng.choice(["#D4F7A2", "#3E9E34"]), rng.uniform(0.12, 0.25), 18))
    # winding path with soft worn edges, a lit centre and wheel-worn shading
    centre = [(1210, 300), (1130, 400), (1290, 540), (1040, 700), (1190, 880), (1120, 1080), (1200, H + 60)]
    widths = [60, 120, 190, 300, 460, 700, 980]
    edge = path_ribbon(centre, [w + 40 for w in widths])
    sand = path_ribbon(centre, widths)
    B.append(f'<g filter="url(#{a.blur(4)})"><path d="{edge}" fill="#C98F3E" opacity="0.85"/></g>')
    B.append(f'<path d="{sand}" fill="{a.grad([(0, "#F6D38A"), (1, "#EDBE62")])}"/>')
    B.append(f'<g clip-path="url(#{a.clip(sand)})">'
             + a.soft(path_ribbon(centre, [w * 0.42 for w in widths]), "#FFF0C0", 0.7, 16)
             + a.soft_line(smooth_path([(x + w * 0.38, y) for (x, y), w in zip(centre, widths)], closed=False), "#C88E3E", 26, 0.45, 12)
             + "</g>")
    for (cx, cy), w in zip(centre, widths):
        for side in (-1, 1):
            for _ in range(2):
                if rng.random() < 0.7:
                    px, py = cx + side * (w / 2 + rng.uniform(8, 34)), cy + rng.uniform(-50, 50)
                    rx, ry = rng.uniform(10, 22), rng.uniform(7, 13)
                    B.append(a.shape(ellipse_d(px, py, rx, ry), "#D2C29C", "#8E7E5C", "#FFF6DC", lw=2.5, line="#7A6A4A", dx=5, dy=4, blur=3))
    # grass tufts in three greens and small flowers, kept off the path
    def path_at(y):
        pts = list(zip(centre, widths))
        for ((x0, y0), w0), ((x1, y1), w1) in zip(pts, pts[1:]):
            if y0 <= y <= y1:
                t = (y - y0) / (y1 - y0)
                return x0 + (x1 - x0) * t, w0 + (w1 - w0) * t
        return pts[-1][0][0], pts[-1][1]

    def off_path(x, y):
        px, pw = path_at(y)
        return abs(x - px) > pw / 2 + 50

    def tuft(x, y, s, col):
        return "".join(f'<path d="M{x + dx * s:.0f},{y:.0f} q{dx * s * 0.2:.0f},{-s * 1.1:.0f} {dx * s * 0.9:.0f},{-s * 1.9:.0f}" '
                       f'fill="none" stroke="{col}" stroke-width="{max(3, s / 5):.0f}" stroke-linecap="round"/>' for dx in (-1.2, -0.4, 0.4, 1.2))
    for _ in range(420):
        x, y = rng.uniform(40, W - 40), rng.uniform(240, H - 40)
        if off_path(x, y):
            s = 8 + (y - 240) / 1000 * 26
            B.append(tuft(x, y, rng.uniform(0.8, 1.2) * s, rng.choice(["#3A9A2E", "#2E7F27", "#5DBA3C"])))
    colors = [("#FFFFFF", "#C7B8C8"), ("#FFE066", "#C99A1A"), ("#FF8FB1", "#B8486E"), ("#FFB347", "#C7701A")]
    for _ in range(150):
        x, y = rng.uniform(60, W - 60), rng.uniform(260, H - 60)
        if not off_path(x, y):
            continue
        c, cs = rng.choice(colors)
        r = rng.uniform(6, 13) * (0.7 + (y - 300) / 1000 * 0.6)
        petals = "".join(f'<circle cx="{x + math.cos(k * 1.2566) * r:.1f}" cy="{y + math.sin(k * 1.2566) * r:.1f}" r="{r * 0.62:.1f}"/>' for k in range(5))
        B.append(f'<g fill="{c}" stroke="{cs}" stroke-width="1.5">{petals}</g><circle cx="{x:.1f}" cy="{y:.1f}" r="{r * 0.48:.1f}" fill="#F7A21B"/>')
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=grain))


def rocks(name="rocks", w=420, h=220):
    a = Art(w, h)
    B = [a.soft(ellipse_d(210, 206, 170, 12), "#1E5A22", 0.4, 6)]
    B.append(a.shape("M40,196 C30,150 70,110 120,108 C160,92 210,96 230,130 C262,124 300,140 304,180 C306,200 290,208 270,208 L60,208 C48,208 42,204 40,196 Z",
                     "#B9C0CC", "#6E778A", "#F2F5FA", lw=4, line="#4E5566", dx=26, dy=20, blur=12))
    B.append(a.shape("M300,204 C298,170 330,150 360,156 C388,160 400,184 392,204 Z", "#A3ABBA", "#646D80", "#E6EAF2", lw=4, line="#4E5566", dx=14, dy=12, blur=8))
    B.append('<path d="M120,150 C140,160 150,180 148,200 M230,134 C236,150 232,170 226,184" fill="none" stroke="#6E778A" stroke-width="4" opacity="0.6" stroke-linecap="round"/>')
    B.append(a.soft(ellipse_d(110, 200, 60, 12), "#5DBA3C", 0.8, 3))
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=a.grain(0.10, 0.9, 0.05, 2)))


# ---------------------------------------------------------------------------------------- hut and signpost

def hut(name="hut", w=600, h=520):
    """A small wooden kampung hut on stilts with a thatched (attap) roof and a ladder."""
    a = Art(w, h, line="#3E2210")
    B = [a.soft(ellipse_d(300, 500, 250, 18), "#1E5A22", 0.4, 8)]
    wood, wood_s, wood_l = "#B9814A", "#6E4320", "#E2B47E"
    for x in (150, 250, 360, 450):
        B.append(a.shape(f"M{x - 9},{360} h18 v138 h-18 Z", "#7A4B28", "#4A2A14", None, lw=4, dx=6, dy=0, blur=3))
    wall = "M120,240 L480,240 L480,368 L120,368 Z"
    B.append(a.shape(wall, wood, wood_s, wood_l, lw=5, dx=30, dy=14, blur=14))
    B.append('<g stroke="#6E4320" stroke-width="3" opacity="0.6">' + "".join(f'<path d="M120,{y} L480,{y}"/>' for y in range(262, 368, 22)) + "</g>")
    B.append(a.shape("M184,272 h84 v70 h-84 Z", "#4A2A14", None, None, lw=4))
    B.append(a.shape("M184,272 h42 v70 h-42 Z", "#C98F52", "#7A4B28", "#EEC48E", lw=4, dx=8, dy=6, blur=4))
    B.append(a.shape("M330,262 h96 v106 h-96 Z", "#6E4320", "#3E2210", None, lw=4))
    B.append(a.shape("M110,368 L490,368 L490,384 L110,384 Z", "#8A5630", "#4E2C15", "#C08A58", lw=4, dx=6, dy=4, blur=3))
    roof = "M60,256 L300,96 L540,256 C470,268 130,268 60,256 Z"
    B.append(a.shape(roof, "#C8A050", "#7E5A22", "#F0D58A", lw=5, dx=40, dy=24, blur=18))
    B.append(f'<g clip-path="url(#{a.clip(roof)})" stroke="#8E6A2A" stroke-width="4" opacity="0.6" fill="none">'
             + "".join(f'<path d="M{80 + i * 34},{258} L{300 + (i - 7) * 6},{100}"/>' for i in range(14)) + "</g>")
    B.append(a.shape("M282,96 L300,80 L318,96 L300,108 Z", "#8E6A2A", None, None, lw=4))
    for i, y in enumerate(range(400, 500, 26)):
        B.append(f'<path d="M386,{y} L438,{y}" stroke="#7A4B28" stroke-width="9" stroke-linecap="round"/>')
    B.append('<path d="M384,384 L376,500 M440,384 L448,500" stroke="#5E3A1F" stroke-width="10" stroke-linecap="round"/>')
    B.append(a.soft("M120,368 L480,368 L480,420 L120,420 Z", "#1E3A10", 0.35, 12))
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=a.grain(0.12, 0.9, 0.06, 5)))


def signpost(name="signpost", w=320, h=420):
    """Wooden signpost with two blank arrow boards (no text, so no copy to translate)."""
    a = Art(w, h, line="#3E2210")
    B = [a.soft(ellipse_d(160, 404, 90, 12), "#1E5A22", 0.4, 6)]
    B.append(a.shape("M148,120 h24 v284 h-24 Z", "#8A5630", "#4E2C15", "#C08A58", lw=5, dx=8, dy=0, blur=4))
    B.append(a.shape("M40,120 L220,120 L262,156 L220,192 L40,192 Z", "#E0A85C", "#9A6328", "#FFE0A8", lw=5, dx=14, dy=10, blur=8))
    B.append(a.shape("M280,214 L104,214 L62,248 L104,282 L280,282 Z", "#73C15A", "#3E8A30", "#BDF0A0", lw=5, dx=14, dy=10, blur=8))
    B.append('<path d="M66,146 h120 M66,166 h90 M116,240 h134 M124,258 h96" stroke="#7A4B28" stroke-width="5" stroke-linecap="round" opacity="0.35"/>')
    for x, y in ((60, 156), (258, 248)):
        B.append(f'<circle cx="{x}" cy="{y}" r="6" fill="#5E3A1F"/>')
    B.append(a.soft(ellipse_d(160, 400, 70, 14), "#5DBA3C", 0.9, 3))
    (OUT / f"{name}.svg").write_text(a.svg("".join(B), grain=a.grain(0.12, 0.9, 0.06, 6)))


if __name__ == "__main__":
    OUT.mkdir(parents=True, exist_ok=True)
    mountains()
    tree("tree_a", 3, canopy_r=150)
    tree("tree_b", 8, canopy_r=130, lean=-8, palette=("#2A8A4A", "#45AE58", "#7ED26A", "#C2F29A"))
    tree("tree_c", 21, canopy_r=165, lean=10, palette=("#1A6E36", "#2E9A44", "#5BBE4F", "#A8E67A"))
    bush("bush_a", 5)
    bush("bush_b", 17)
    cloud("cloud_a", 2)
    cloud("cloud_b", 9)
    cloud("cloud_c", 14)
    ground()
    rocks()
    hut()
    signpost()
    print("scenery SVGs written to", OUT)
