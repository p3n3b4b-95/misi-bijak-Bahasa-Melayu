# UI-01C art direction — premium 2D cartoon adventure

**Scope:** Splash and Main Menu only (UI-02 locked). **Source of truth:** Design Board V1 (`../design-board-v1.png`) for composition, characters and navigation. The owner's style references (detailed painterly boy on a mountain path; soft cartoon meadow with animal mascots) set the *finish*, not the content.

## 1. Inputs inspected

| Input | What it told us |
|---|---|
| Design Board V1, crops `01-splash`, `02-skrin-utama` | Composition: big two-line title in the upper third; Amir (splash) or the cat leaning on MULA (menu) in the middle; path winding toward the viewer; blue-violet mountains, layered hills, a signpost/hut at the left, round glossy icons with captions |
| `../../UI01B_REPORT.md` §5 | Gaps to close: flat rendering, Amir without legs, cat detached from MULA, no hut/signpost, mountains too uniform |
| `../ui-01b/asset-manifest.md` | 19 assets, all flat-vector; orange backpack on Amir (owner requires **blue**) |
| UI-01B emulator screenshots (run 12) | Scenery reads as clip-art; characters lack volume; MULA highlight is a flat stripe |

## 2. Principles

1. **One light.** Sun from the upper left. Every asset gets a soft lit edge top-left and a soft core shadow bottom-right; cast shadows fall down-right.
2. **Soft painterly shading, not gradients alone.** Form shadows are the part's own silhouette, offset toward the light and blurred, used as a mask (see `android/art/gen/paintkit.py`). Ambient occlusion where parts meet (under the cap brim, under the chin, under hair).
3. **Subtle texture.** A fine multiplied paint grain (8–12 %) and a broad warm colour mottle on every illustrated asset, so large areas do not read as flat vector.
4. **Coloured line art.** Warm dark brown outlines (`#4A2A1C` characters, `#5E2E12` cat, `#3E2210` wood), 5–6 px at 1000-px canvas; never pure black.
5. **Atmospheric depth.** Far layers paler, bluer and softer; haze at each mountain foot; a forested foothill band; saturation and detail increase toward the viewer (grass tufts and flowers grow with distance from the horizon).
6. **Warm highlights, gentle shadows.** Shadows are hue-shifted (skin shadow `#DB8F68`, shirt shadow orange `#E9862A`, never grey).
7. **Rounded, glossy UI.** Buttons and icons: bevelled rim, top gloss band fading to transparent, soft drop shadow.

## 3. Character identities (must stay consistent across modules)

| Character | Fixed traits | Proportions |
|---|---|---|
| **Amir** | Black six-panel cap with brim to his left; black hair with scalloped fringe; big brown eyes with two highlights; **yellow shirt** with blue collar and cuffs; **blue backpack** with blue straps and yellow buckles; navy shorts; white socks; red sneakers | Chibi: head ≈ 0.33 of body height; full body in UI-01C (canvas 1000 × 1400) |
| **Cat** ("Kucing Bijak") | Orange with a **white blaze, muzzle, chest and paws**; forehead stripes; ringed tail with white tip; left eye open, right eye winking; pink nose and inner ears | Head ≈ 0.5 of visible height; leans on MULA with both paws on the button edge |
| **Aina** | Pink hijab, pink top, denim dungarees | Unchanged UI-01B portrait; not on these screens. Must be redrawn in this style before UI-02 |

## 4. Palette (art)

Sky `#5BC8F5 → #BDE9FF`; far mountains `#BFCBF2`; mid mountains `#7E98E2`; foothills `#5DA98A`; meadow `#B4EC78 → #4FB232`; path `#F6D38A → #EDBE62` with `#C98F3E` worn edges; foliage `#1F7A3A / #33A047 / #62C255 / #A8E67A`; skin `#F7C59C`; Amir yellow `#FFC933`; backpack blue `#2F7BE0`; cat orange `#FFAE45`. UI tokens are unchanged (`Palette.kt`); contrast-tested colours were not altered.

## 5. Asset list for UI-01C

See [`asset-manifest.md`](asset-manifest.md). New: `amir_full`, `cat_peek`, `cat_paws`, `hut`, `signpost`. Redrawn: mountains, ground, three trees, two bushes, three clouds, rocks, both logos, three icons. Removed: `amir_wave`, `cat_sit` (in git history and in the UI-01B evidence).

## 6. Before/after comparison specification

| Comparison | Left | Right | File |
|---|---|---|---|
| Asset sheet | UI-01B bitmaps (as shipped in run 12) | UI-01C bitmaps (as shipped) | `comparison/assets-before-after.png` |
| Splash, phone portrait | Board crop | UI-01B real app (run 12) · UI-01C Compose render · UI-01C real app | `comparison/splash-phone.png` |
| Main Menu, phone portrait | Board crop | same three columns | `comparison/menu-phone.png` |
| Tablet landscape (**provisional**) | UI-01B | UI-01C | `comparison/tablet-landscape-provisional.png` |
| Font scale 200 % | UI-01C phone splash, menu, tablet menu | — | `comparison/font-scale-2.png` |

Rules: images scaled to equal height with no retouching (`tools/make-comparison.py`); real-app images come only from the emulator; board crops are references, never copied into assets.

## 7. Tooling limitation (stated before production)

No generative or raster painting tool is available in this environment. All art is authored as SVG (by hand or by the deterministic Python generators) and rendered by headless Chromium. This reaches **soft-shaded, textured cartoon vector** quality. It does **not** reach the hand-painted illustration in the style references (individually painted hair strands, rendered rock faces, detailed fabric folds, painted light scattering). See `../../UI01C_REPORT.md` §5 for the honest gap.
