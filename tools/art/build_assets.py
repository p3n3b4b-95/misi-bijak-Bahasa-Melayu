#!/usr/bin/env python3
"""Renders the artwork SVGs (android/art/svg) to WebP bitmaps in the Android resources.

Pipeline: SVG --(headless Chromium, tools/art/render.cjs)--> PNG --(Pillow, lossless WebP)--> res/drawable-nodpi.
Also writes docs/android/design/ui-01b/asset-manifest.csv (dimensions, bytes, SHA-256, source).

Run from the repository root:
    python3 android/art/gen/scenery.py && python3 android/art/gen/ui_art.py   # regenerate procedural SVGs
    python3 tools/art/build_assets.py
Requires: node with playwright, Chromium (CHROMIUM_PATH), Pillow. Artwork is original; see the asset manifest.
"""
import csv
import hashlib
import subprocess
import tempfile
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[2]
SVG = ROOT / "android/art/svg"
RES = ROOT / "android/app/src/main/res/drawable-nodpi"
MANIFEST = ROOT / "docs/android/design/ui-01b/asset-manifest.csv"

# name -> (output width, output height, role)
ASSETS = {
    "amir_wave":      (800, 880, "character: Amir (boy), waving and pointing, torso up"),
    "aina_portrait":  (800, 880, "character: Aina (girl, hijab), portrait"),
    "cat_sit":        (800, 640, "mascot: orange-and-white cat, sitting, winking"),
    "mountains":      (1800, 570, "scenery: two snow-capped mountain ranges with foothills"),
    "ground":         (1800, 975, "scenery: rolling meadow with winding sand path"),
    "tree_a":         (400, 520, "scenery: tree"),
    "tree_b":         (400, 520, "scenery: tree"),
    "tree_c":         (400, 520, "scenery: tree"),
    "bush_a":         (380, 250, "scenery: bush"),
    "bush_b":         (380, 250, "scenery: bush"),
    "cloud_a":        (560, 240, "scenery: cloud"),
    "cloud_b":        (560, 240, "scenery: cloud"),
    "cloud_c":        (560, 240, "scenery: cloud"),
    "rocks":          (420, 220, "scenery: rocks"),
    "logo_splash":    (1600, 480, "logo wordmark, yellow first line (Nunito Black lettering)"),
    "logo_menu":      (1600, 480, "logo wordmark, orange first line (Nunito Black lettering)"),
    "icon_settings":  (256, 256, "menu icon: settings (gear)"),
    "icon_profile":   (256, 256, "menu icon: profile (person)"),
    "icon_exit":      (256, 256, "menu icon: exit (door and arrow)"),
}

def main():
    RES.mkdir(parents=True, exist_ok=True)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        svgs = [str(SVG / f"{n}.svg") for n in ASSETS]
        subprocess.run(["node", str(ROOT / "tools/art/render.cjs"), tmp, *svgs], check=True, stdout=subprocess.DEVNULL)
        rows = []
        for name, (w, h, role) in ASSETS.items():
            im = Image.open(Path(tmp) / f"{name}.png").convert("RGBA")
            if im.size != (w, h):
                im = im.resize((w, h), Image.LANCZOS)
            out = RES / f"{name}.webp"
            im.save(out, "WEBP", lossless=True, quality=100, method=6)
            data = out.read_bytes()
            rows.append([f"android/app/src/main/res/drawable-nodpi/{name}.webp", w, h, len(data),
                         hashlib.sha256(data).hexdigest(), f"android/art/svg/{name}.svg", role])
    with MANIFEST.open("w", newline="") as fh:
        wr = csv.writer(fh)
        wr.writerow(["file", "width_px", "height_px", "bytes", "sha256", "source", "role",
                     "provenance", "licence_status"])
        for r in rows:
            wr.writerow(r + ["Original work created for this project (hand-authored SVG, no third-party art, no image generator)",
                             "Project-owned original; repository licence pending (Q6). Lettering uses Nunito (SIL OFL 1.1)" if r[0].endswith(("logo_splash.webp", "logo_menu.webp")) else "Project-owned original; repository licence pending (Q6)"])
    total = sum(r[3] for r in rows)
    print(f"{len(rows)} assets, {total / 1024:.0f} KiB total -> {RES}")

if __name__ == "__main__":
    main()
