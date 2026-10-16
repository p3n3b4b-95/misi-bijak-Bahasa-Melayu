#!/usr/bin/env python3
"""Renders the artwork SVGs (android/art/svg) to WebP bitmaps in the Android resources.

Pipeline: SVG --(headless Chromium, tools/art/render.cjs)--> PNG --(Pillow, WebP)--> res/drawable-nodpi.
Painterly assets (grain and soft shading) are saved as high-quality lossy WebP with lossless alpha,
which is visually indistinguishable at screen size and several times smaller; flat UI art stays lossless.
Also writes docs/android/design/ui-01c/asset-manifest.csv (dimensions, bytes, SHA-256, source).

Run from the repository root:
    cd android/art/gen && python3 characters.py && python3 scenery.py && python3 ui_art.py && cd -   # regenerate SVGs
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
MANIFEST = ROOT / "docs/android/design/ui-01c/asset-manifest.csv"

# name -> (output width, output height, encoding, role)
ASSETS = {
    "amir_full":      (800, 1120, "lossy", "character: Amir (boy), full body, waving and pointing"),
    "aina_portrait":  (800, 880, "lossless", "character: Aina (girl, hijab), portrait (UI-01B art, not shown in UI-01 screens)"),
    "cat_peek":       (800, 720, "lossy", "mascot: orange-and-white cat, upper body, winking; sits behind the MULA button"),
    "cat_paws":       (800, 112, "lossy", "mascot: the cat's front paws, drawn over the MULA button"),
    "mountains":      (1800, 570, "lossy", "scenery: two mountain ranges with haze, forested foothills"),
    "ground":         (1800, 975, "lossy", "scenery: rolling meadow with winding path, grass and flowers"),
    "tree_a":         (400, 520, "lossy", "scenery: tree"),
    "tree_b":         (400, 520, "lossy", "scenery: tree"),
    "tree_c":         (400, 520, "lossy", "scenery: tree"),
    "bush_a":         (380, 250, "lossy", "scenery: flowering bush"),
    "bush_b":         (380, 250, "lossy", "scenery: flowering bush"),
    "cloud_a":        (560, 240, "lossy", "scenery: cloud"),
    "cloud_b":        (560, 240, "lossy", "scenery: cloud"),
    "cloud_c":        (560, 240, "lossy", "scenery: cloud"),
    "rocks":          (420, 220, "lossy", "scenery: rocks"),
    "hut":            (480, 416, "lossy", "scenery: wooden kampung hut on stilts"),
    "signpost":       (256, 336, "lossy", "scenery: wooden signpost with blank arrow boards"),
    "logo_splash":    (1600, 480, "lossless", "logo wordmark, yellow first line (Nunito Black lettering)"),
    "logo_menu":      (1600, 480, "lossless", "logo wordmark, orange first line (Nunito Black lettering)"),
    "icon_settings":  (256, 256, "lossless", "menu icon: settings (gear)"),
    "icon_profile":   (256, 256, "lossless", "menu icon: profile (person)"),
    "icon_exit":      (256, 256, "lossless", "menu icon: exit (door and arrow)"),
}
SOURCES = {"amir_full": "android/art/gen/characters.py", "cat_peek": "android/art/gen/characters.py",
           "cat_paws": "android/art/gen/characters.py", "aina_portrait": "hand-authored SVG"}

def main():
    RES.mkdir(parents=True, exist_ok=True)
    MANIFEST.parent.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as tmp:
        svgs = [str(SVG / f"{n}.svg") for n in ASSETS]
        subprocess.run(["node", str(ROOT / "tools/art/render.cjs"), tmp, *svgs], check=True, stdout=subprocess.DEVNULL)
        rows = []
        for name, (w, h, enc, role) in ASSETS.items():
            im = Image.open(Path(tmp) / f"{name}.png").convert("RGBA")
            if im.size != (w, h):
                im = im.resize((w, h), Image.LANCZOS)
            out = RES / f"{name}.webp"
            if enc == "lossless":
                im.save(out, "WEBP", lossless=True, quality=100, method=6)
            else:
                im.save(out, "WEBP", quality=90, alpha_quality=100, method=6)
            data = out.read_bytes()
            rows.append([f"android/app/src/main/res/drawable-nodpi/{name}.webp", w, h, len(data),
                         hashlib.sha256(data).hexdigest(),
                         f"android/art/svg/{name}.svg ({SOURCES.get(name, 'android/art/gen/' + ('ui_art.py' if name.startswith(('logo', 'icon')) else 'scenery.py'))})",
                         f"{enc} WebP; {role}"])
    with MANIFEST.open("w", newline="") as fh:
        wr = csv.writer(fh)
        wr.writerow(["file", "width_px", "height_px", "bytes", "sha256", "source", "role",
                     "provenance", "licence_status"])
        for r in rows:
            wr.writerow(r + ["Original work created for this project (SVG authored by hand or by the listed generator; no third-party art, no image generator, no pixels from the design board)",
                             "Project-owned original; repository licence pending (Q6). Lettering uses Nunito (SIL OFL 1.1)" if r[0].endswith(("logo_splash.webp", "logo_menu.webp")) else "Project-owned original; repository licence pending (Q6)"])
    total = sum(r[3] for r in rows)
    print(f"{len(rows)} assets, {total / 1024:.0f} KiB total -> {RES}")

if __name__ == "__main__":
    main()
