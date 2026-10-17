# UI-01C asset intake checklist and integration requirements

**For:** Cowlick · **Branch:** `feature/android-app` · **Status:** provisionally accepted by Cowlick as the intake process; updated with the confirmed decisions D1 to D12 (see [`01-decisions.md`](01-decisions.md) §E). Documentation only.
**Not done, by instruction:** no Android UI code, no artwork, no replacement SVG, character, scenery, logo or icon, no cropping from the V2 sheet, no UI-02, no merge to `main`, no release, no Supabase change.
**Ownership:** Cowlick owns all visual design and artwork. Claude Code owns Android implementation, integration, testing and validation.

Evidence labels: **VERIFIED** (read from the repo or the supplied files) · **ASSUMED** · **UNKNOWN**.

## 0. Status notes

1. **Branch state: resolved.** Cowlick chose to restore UI-01B. Commit `ca6fde9` reverted the UI-01C code and art changes; the Android, tools and workflow trees are identical to the validated baseline `3157037`, and CI run 16 passed. Details: [`UI01C_REVERT_REPORT.md`](UI01C_REVERT_REPORT.md). The branch is kept unchanged while waiting for the pack.
2. **"Asset Blueprint V2" has not been received.** Only three images were uploaded (Design Board V1, a style-reference screenshot, the Visual Design V2 sheet). The expected-asset list in §4 is derived from the V2 sheet and is to be replaced by Cowlick's own list in the Asset Pack V2 manifest.

## 1. Intake workflow (no UI code before step 4)

| Step | Who | What | Output |
|---|---|---|---|
| 1. Deliver | Cowlick | Pack in the layout of §2, with the manifest of §3 and a licence statement | Pack in a delivery location (see §2.4) |
| 2. Completeness check | Claude Code | Run every check in §5 against the manifest and the files. **No UI code changes** | `ASSET_INTAKE_REPORT.md`: per-file pass or fail, gaps, deviations |
| 3. Approve | Cowlick | Approves the report, or fixes the pack and goes back to step 2 | Written approval, with the final filename-to-resource mapping signed off |
| 4. Integrate | Claude Code | Copy approved files into resources, then change the UI per §6 | Code and resource changes on `feature/android-app` |
| 5. Validate | Claude Code | Lint, unit tests, instrumented tests (phone and tablet emulators), web regression, screenshots, comparisons against V2 | CI run links, screenshots, honest list of differences |
| 6. Review | Cowlick | Visual approval | UI-01C closed, or a new round |

## 2. Delivery requirements

### 2.1 File naming

Android resource names must match `[a-z][a-z0-9_]*` (lowercase, digits, underscores, starting with a letter; no hyphens, spaces, capitals or dots). If Cowlick's filenames do not follow this, supply a `resource_name` column in the manifest (§3). I will not rename files on my own initiative, and every rename is listed in the intake report.

### 2.2 Formats

| Kind | Accepted | Rules |
|---|---|---|
| Characters, scenery layers, plank, post, logo (if shaded) | **PNG or lossless/lossy WebP with a real 8-bit alpha channel**, sRGB | No scenery or background baked behind characters; no white or checkerboard "fake transparency"; clean edges with no light halo; no text baked into planks or buttons (text is native), except the logo |
| Flat vector art (glyphs, simple shapes) | **SVG** | Must convert to an Android `VectorDrawable`: paths and solid or simple linear/radial gradients only. No filters, blur, masks, clip-path chains, embedded raster, external fonts or links (the app is offline). Otherwise deliver a raster fallback |
| Logo | SVG or PNG, transparent | Both outlined and unoutlined versions if the design allows. Text is outlined to curves, so no font dependency |
| Fonts | TTF/OTF with the licence file | Poppins SemiBold and Bold are specified in V2. If I am allowed to fetch them from Google Fonts (SIL OFL) instead of Cowlick supplying them, say so (decision D5) |
| Metadata | Strip EXIF, XMP and any tool or author tags that reveal personal data | Provenance goes in the manifest, not in the files |

### 2.3 Size and memory rules

- **Reference frames:** phone portrait 1080 × 2400 px. Tablet portrait and landscape frames (e.g. 2560 × 1800) are Cowlick's to supply or approve (decision D11).
- **Deliver at twice the phone size** where tablets or large phones matter (long side at least 2048 px for characters).
- **Crop each layer to its content** and give its placement in the manifest (§3). A full-canvas transparent layer wastes memory: one 1080 × 2400 RGBA layer decodes to about 10.4 MB.
- **Budgets (provisional, confirmed by Cowlick):** debug APK **30 MB maximum** (the run-16 CI APK artifact, which bundles the debug, test and release APKs, is about 15.7 MB) and decoded bitmap memory **40 MB per screen** (the UI-01B Splash decodes about 22 MB, **computed**, not measured on a device).
- Prefer **WebP** for scenery to keep the APK small; lossless where gradients must not band.

### 2.4 Delivery location and a publishing warning

Deliver as a zip (or a directory) with this layout:

```
pack-<version>/
  manifest.csv            (columns in §3)
  LICENCE.md              (licence, provenance and usage rights for the whole pack)
  files/<as named in manifest.csv>
  fonts/ (optional)
```

**Warning (VERIFIED):** `.github/workflows/deploy-pages.yml` still publishes the whole repository root to GitHub Pages (open question Q7). Anything committed to the repository, including the masters, would be publicly served. Decide Q7 before committing a pack, or keep large masters outside git and commit only the integration copies and the manifest.

## 3. Manifest columns (template: [`design/asset-intake/manifest-template.csv`](design/asset-intake/manifest-template.csv))

| Column | Meaning |
|---|---|
| `asset_id` | Stable ID, e.g. `A3`. Must match the expected-asset list (§4) |
| `file` | Delivered filename, exactly as in the pack |
| `resource_name` | Android resource name (§2.1) without extension |
| `kind` | `character` · `scenery` · `ui` · `logo` · `glyph` · `font` |
| `format` | `png` · `webp` · `svg` · `ttf` |
| `width_px`, `height_px` | Exact pixel size (SVG: viewBox size) |
| `alpha` | `yes` / `no` (must be `yes` for characters, layers, plank, post, logo) |
| `colour_space` | `sRGB` expected |
| `sha256` | Checksum of the delivered file |
| `layer_order` | Back-to-front index within its screen (0 = backmost) |
| `used_on` | `splash` · `menu` · both · later (+ the element ID of the V2 map) |
| `ref_frame`, `x`, `y`, `anchor` | Placement as a fraction or pixel offset in the reference frame, and the anchor point (e.g. bottom-centre) |
| `overlaps` | For characters that interlock (Amir and cat on the menu): which asset sits in front |
| `creator`, `method` | Who made it; how (hand-drawn / vector tool / generative tool with name and version) |
| `licence`, `licence_evidence` | Licence under which the project may ship it, and where the proof is |
| `approved_by`, `approved_on` | Cowlick's approval for this file |
| `notes` | Anything else |

## 4. Expected deliverables (to be replaced by Cowlick's own list if it differs)

Derived from the V2 sheet ([gap report](UI01C_V2_ASSET_GAP_REPORT.md) §3). "Min px" is the minimum for the 1080 × 2400 phone; recommended delivery is twice that. Filenames and final sizes are Cowlick's to set.

| ID | Asset | Screen (V2 map ID) | Required | Min px (w × h) | Transparency and layering |
|---|---|---|---|---|---|
| A1 | Game logo ("Misi Bijak / Bahasa Melayu"), splash and menu versions (identical if the design is) | S1, M4 | Yes | 1000 × 400 | Alpha; outline included |
| A2 | Tagline plank (wood board, leaves) **without text**; the approved text "Belajar • Bermain, Maju Bersama!" is native | S2, M5 | Yes | 800 × 220 | Alpha; leaves separate if possible |
| A3 | Amir, pointing (Splash, D6) | S3 | Yes | 600 × 1050 | Alpha; full body; no scenery |
| A4 | Amir, cheering (Main Menu, D6) | M8 | Yes | 450 × 700 | Alpha; layer order vs A7 stated |
| A6 | Cat, sitting (Splash, D6) | S4 | Yes | 450 × 600 | Alpha |
| A7 | Cat beside Amir (Main Menu, D6) | M8 | Yes | 400 × 580 | Alpha; layer order vs A4 stated |
| A10 | Player avatar (Amir's face) | M1 | **Not required** (top bar deferred, D1) | n/a | n/a |
| A11 | Sky, clouds and far mountains layer | S0, M0 | Yes | 1080 × 900 | Opaque at the top; alpha only where it overlays a lower layer |
| A12 | **One consistent illustrated Malay village house** (D8), used wherever a house appears | M6 | Yes | 300 × 460 | Alpha |
| A13 | River, waterfall, bridge and rocks layer | S5 | Yes | 1080 × 450 | Alpha |
| A14 | Winding path and foreground layer | both | Yes | 1080 × 1200 | Alpha where grass meets the layers behind |
| A15 | Foreground framing: foliage, fence, flowers, rocks (left, right, bottom) | S6, menu | Yes | each 400–600 px | Alpha |
| A16 | Trees framing left and right | both | Yes (or inside A15) | 400 × 700 | Alpha |
| A17 | Signpost post (boards are native, decorative only, D3) and wood texture tile | M7 | Yes | 300 × 500 | Alpha |
| G1–G5 | Glyphs: gear, person, door, star, play | M3, M9, M10, M2 | **Now supplied by Cowlick** (hold item 2) | SVG; 256 px raster fallback | Vector preferred |
| T1 | Tile and button decoration, if Cowlick wants more than gradient shapes (rims, gloss highlights) | M9, M10 | Optional | as needed | Alpha |
| F1 | Poppins SemiBold and Bold + licence (permitted subject to licence verification, D5) | all | Yes | n/a | n/a |
| L1 | Pack licence and provenance for every file | all | **Yes** | n/a | n/a |
| Not needed for Splash and Menu | Aina idle (A9), Amir idle (A5), cat Happy/Sit/Jump (A8) | later screens | Not for this round | | |

**Animation (D9):** subtle character, cloud and button animation. If Cowlick wants any element animated by frame or by layer (for example a cat tail, eyes or cloud drift), say so in the manifest (`notes`), and deliver the separable parts as separate layers. Otherwise I animate whole layers by transform only. A motion spec (durations, amplitudes) is needed before implementation.

## 5. Completeness checks I will run (step 2)

**Pack-level**
1. Every required `asset_id` in §4 has exactly one manifest row and one delivered file, with no extra or missing files.
2. Filenames and `resource_name` follow §2.1; no duplicates after lower-casing.
3. `sha256` in the manifest matches the file (`sha256sum`).
4. `LICENCE.md` and a licence per file exist; `method` states whether a generative tool was used, with its terms.
5. Decoded memory per screen = sum over the layers used by that screen of `width × height × 4`; flagged if above the budget.
6. Layer order is stated for every file used on a screen; interlocking characters state their overlap.

**File-level**
7. Pixel size equals the manifest and meets the minimum (§4); no up-scaled low-resolution art (judged by a check at 100 % and by comparing against the stated source size).
8. Alpha: the file has a real alpha channel; the corners and the background outside the subject are fully transparent (spot-checked); no light fringe on a coloured test background (checked on green, blue and white).
9. Characters: no scenery or shadow plate baked in unless stated in `notes`.
10. No baked text on planks, buttons or glyphs (logo excepted).
11. Colour: sRGB; no embedded profile surprises; no EXIF or tool metadata.
12. SVG: converts to a `VectorDrawable` without losing features, or a raster fallback is present. No external references.
13. Fonts: licence file present; the family and weights match what the V2 sheet names.

**Output:** `docs/android/ASSET_INTAKE_REPORT.md` with a pass, fail or note per ID, the final filename-to-resource table, and a list of anything I cannot judge by script (for example, whether the likeness of Amir is consistent across poses), which is left for Cowlick.

## 6. Integration plan once the pack is approved (for step 4)

### 6.1 Current resources and what replaces them (mapping only)

The 22 bitmaps in `android/app/src/main/res/drawable-nodpi/` are my UI-01B/UI-01C art. **VERIFIED.**

| Current resource | Used by | Replaced by (from the approved pack) |
|---|---|---|
| `logo_splash`, `logo_menu` | `GameTitle` | A1 |
| `amir_full` | `AmirMascot` (splash) | A3 |
| `cat_peek`, `cat_paws` | `CatOverButton` (menu) | A6 / A7 and the A4 + A7 pair; `CatOverButton` goes away |
| `mountains`, `cloud_a-c` | `SceneBackground` | A11 |
| `ground` | `SceneBackground` | A14 |
| `tree_a-c`, `bush_a-b`, `rocks` | `SceneBackground` | A15, A16 |
| `hut` | `SceneBackground` | A12 |
| `signpost` | `SceneBackground` | A17 (+ native boards) |
| `icon_settings`, `icon_profile`, `icon_exit` | `RoundIconButton` | G1–G3 (+ native tile) |
| `aina_portrait` | not on a screen yet | A9 when UI-02 starts |

My generators and SVG sources (`android/art/gen/*.py`, `android/art/svg/*.svg`) and the build script `tools/art/build_assets.py` are **preserved** (D12). Integration is additive: the approved pack's files are added next to them, and the old bitmaps are retired from the UI by code, not deleted from the repository.

### 6.2 Where integrated files go

- Raster layers and characters → `res/drawable-nodpi/` (single bitmap, scaled by code), or density buckets if Cowlick supplies several sizes.
- Vector glyphs → `res/drawable/*.xml` (converted from SVG, reviewed in the intake report).
- Fonts → `res/font/` with the licence text under `assets/licenses/`.
- Manifest and provenance → `docs/android/design/ui-01c/asset-manifest.md` (regenerated from the pack manifest), plus an in-app licence list if the licence requires attribution.

### 6.3 Code changes that will be needed (implementation, not started)

From the [gap report mapping](UI01C_V2_ASSET_GAP_REPORT.md) §5: `SceneBackground` rebuilt around the supplied layers; `GameTitle`, `Characters` (poses); a new tagline plank composable; `LoadingBar` and `LoadingBlock` restyled; `PillButton` and `RoundIconButton` restyled with the supplied glyphs; new `MenuTopBar` and `SkillSignpost` if D1 and D3 keep them; Poppins in `Type.kt`; V2 tokens in `Palette.kt`; new strings in Bahasa Melayu. No change to navigation, DI, `SplashGate`, the manifest or CI.

### 6.4 Tests and gates that must stay green

11 instrumented tests (`MainMenuTest` ×4, `SplashScreenTest`, `AppFlowTest`, `ScreenshotTest` ×4, `DeviceScreenshotTest`) and 7 unit tests (`ContrastTest` ×3, `SplashGateTest` ×4); lint; the APK policy (no `INTERNET`, `allowBackup=false`); the dependency allowlist; forbidden files; web regression `npm test` (13/13). New tests for any new component: semantics, ≥ 48 dp touch targets, 200 % font scale, and contrast for each new text and glyph colour pair.

## 7. Decisions and remaining requirements

**Confirmed by Cowlick** (register: [`01-decisions.md`](01-decisions.md) §E): D0 pack produced by Cowlick; D1 top bar deferred; D2 tagline "Belajar • Bermain, Maju Bersama!"; D3 signpost decorative; D4 glyphs supplied by Cowlick; D5 Poppins permitted subject to licence verification; D6 pose mapping; D7 moot (no top bar); D8 one illustrated Malay village house; D9 subtle animations that respect reduced-motion; D10 correct contrast issues; D11 tablet and landscape stay provisional; D12 art sources and build scripts preserved; budgets 30 MB debug APK and 40 MB decoded bitmaps per screen.

**Still needed from Cowlick**

| # | Item | Needed before |
|---|---|---|
| 1 | **The Cowlick Asset Pack V2** with `manifest.csv` (§3), licence statement and, if it exists, the Asset Blueprint V2 / final asset list | Step 1 |
| 2 | Motion spec for the subtle animations (what moves, duration, amplitude, easing) | Implementation (after intake approval) |
| 3 | Readable tablet (4:3) and landscape (16:9) frames, when the final artwork is reviewed | Tablet work |
| Q6 | Artwork and repository licence: **pending owner confirmation**; stated per file in the pack manifest | Step 3 approval |
| Q7 | GitHub Pages isolation: **required before merging Android files into `main`** (the workflow still publishes the whole repository root). Also decide before committing a large pack: masters outside git, or accept public serving | Any merge; pack commit |
| Existing | `applicationId` provisional (Q19); `publish-evidence` job needs the owner's acceptance; no manual TalkBack test; Android 14 emulators only | Later |

## 8. Status and guardrails

| Item | Status |
|---|---|
| UI-01B | Restored at `3157037` content (revert `ca6fde9`, CI run 16 passed); visual approval pending (Cowlick) |
| UI-01C | Waiting for the Cowlick Asset Pack V2; this document is the provisional intake process |
| UI-02 | Locked, not started |
| Tablet and landscape | Pending final visual review; layouts remain provisional |
| `main`, APK release, Supabase | No merge, no release, no change (the web app and tests are untouched) |
| Artwork, UI code | None created or changed since the hold |

**STOP:** awaiting the Cowlick Asset Pack V2. Intake validation only when it arrives; no integration until Cowlick approves the intake report.
