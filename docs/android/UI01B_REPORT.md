# UI-01B review report — visual refinement of Splash and Main Menu

**For:** Cowlick UI-01B visual review · **Branch:** `feature/android-app` · **Validated code commit:** `3157037` (later commits are documentation only)
**Not done, by instruction:** UI-02, merge to `main`, APK release, any Supabase change.

Evidence labels: **VERIFIED** (seen in CI output or a CI-produced file) · **ASSUMED** · **UNKNOWN**.

## 1. Bottom line

- **Artwork replaced.** The code-drawn placeholders are gone. Splash and Main Menu now use original hand-authored vector illustrations rendered to lossless WebP: Amir, Aina (asset ready, not yet shown on a screen), the orange-and-white cat, mountains, ground/path, trees, bushes, clouds, rocks, two logo wordmarks and three menu icons (19 files). **VERIFIED** in the repo.
- **CI: VERIFIED green** for `3157037` (run 12): lint, unit tests, debug/test/release assembly, APK policy, dependency allowlist, and `OK (11 tests)` on both a phone and a tablet Android 14 emulator.
- **Web regression: VERIFIED.** `git diff fb826ce` is empty for all web, test, Supabase and Pages-workflow files; `npm test` passes 13/13.
- **Visual parity with the board: not achieved, and not claimed.** The result is a coherent, clean flat-vector cartoon in the board's palette and layout. The board is painterly and more detailed. Differences are listed honestly in §5.

## 2. CI evidence

| Item | Result | Link |
|---|---|---|
| Run 12, commit `3157037` | **success**, all jobs | <https://github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu/actions/runs/38932248205> |
| Debug APK artifact `android-apks` | id 12059891883, 15.66 MB (13.7 MB before the artwork), digest `sha256:aeaae02e…ada74`, expires 2026-10-30 | in the run above |
| Screenshot artifacts | phone 12060116492, tablet 12059692588 | in the run above |
| Evidence branch | `ci-evidence/ui-01` ("UI-01 evidence: run 12 for 3157037") | repository branch |

Gates: G0 wrapper validation, G1 build, G2 lint, G4 unit tests (7), G6 APK policy, G7 dependency allowlist, G8 forbidden files all passed. Emulator tests: 11 instrumented tests, `OK (11 tests)` read from `instrument.log` on phone (1080×2400 @420 dpi) and tablet (2560×1800 @320 dpi), Android 14 / API 34 / x86_64. I could not download the APK from this sandbox (artifact host blocked), so APK size comes from CI metadata.

Earlier UI-01B runs: run 11 (`b62108b`) was green; run 12 added two visual fixes found in its screenshots (Amir's hard-cut torso, and a sky strip between mountains and meadow on the tablet).

## 3. Assets

Full specification: [`design/ui-01b/asset-spec.md`](design/ui-01b/asset-spec.md). Manifest with dimensions, filenames, provenance and licence status: [`design/ui-01b/asset-manifest.md`](design/ui-01b/asset-manifest.md) and `.csv`.

- Sources: `android/art/svg/*.svg` (hand-authored), `android/art/gen/*.py` (deterministic scenery and icon generators), pipeline `tools/art/render.cjs` + `tools/art/build_assets.py`.
- Provenance: **no generative image tool was available and no third-party art or board pixels were used.** Everything was authored as SVG/code and reviewed visually over several render iterations.
- Licence: created in this session for the project; the owner must confirm the licence they want to apply (decision Q6). Nunito (logo glyphs) is SIL OFL 1.1.
- Memory: Splash decodes about 22 MB of bitmaps; disk payload about 1.1 MB. Not yet measured on a low-RAM device (**UNKNOWN**).

## 4. Screenshots and comparisons

Stored in [`design/ui-01b/`](design/ui-01b/): `phone/`, `tablet/`, `comparison/`.

| Comparison | File |
|---|---|
| Splash: board vs Compose render vs real app (phone) | `comparison/splash-phone.png` |
| Main Menu: board vs Compose render vs real app (phone) | `comparison/menu-phone.png` |
| Tablet landscape: splash, menu, real-app menu | `comparison/tablet-landscape.png` |
| Font scale 200%: phone splash and menu, tablet menu | `comparison/font-scale-2.png` |

Coverage and gaps:
- Real emulator, real app: phone splash (frame `10-device-flow-01`) and menu (`11-device-menu`); tablet menu only. The tablet splash is shown from the Compose render because the rapid frame capture missed it.
- Only Android 14 was tested. No physical device.
- No screenshot-baseline gate (G10) yet; these are review evidence, not regression tests.

## 5. Visual differences from Design Board V1 (honest list)

1. **Rendering style.** Mine is flat vector with gradients; the board is painterly with texture and rim light. Characters read as clean and friendly but simpler.
2. **Amir.** Waving-and-pointing pose, cap, backpack and yellow shirt match; proportions and face differ. He has no legs: the torso fades into the path. On tablet landscape he is very large relative to the board's framing.
3. **Cat.** Orange-and-white, winking, paws over the MULA button as on the board; the board's cat is more detailed and the tail pose differs. On tablet it sits detached from the button panel.
4. **Scenery.** Mountains, trees, path, clouds and bushes are present. The board's hut/signpost, river and map/chest/ship props are **not** drawn. Mountains here are snow-capped and tiled symmetrically; the board's are softer and layered.
5. **Title.** Same two-line, yellow-over-white (splash) and orange-over-white (menu) treatment; mine sits slightly higher and smaller than on the board.
6. **Menu icons.** Settings, profile, exit match the board's intent; icon artwork differs (the board's exit icon is a character badge).
7. **Not implemented:** the menu's back arrow and the top status badges from the board frames.
8. **Layouts with no board frame.** Tablet and landscape layouts are my own design, including a translucent panel behind the menu actions.
9. **Contrast.** I kept deliberate deviations where the board's colours fail WCAG (loading bar track and fill, icon glyph colours), as unit-tested in `ContrastTest`.

## 6. Unresolved issues and risks

- Artwork licence statement pending owner (Q6); board provenance still unknown.
- `applicationId` still provisional (Q19).
- No manual TalkBack pass; reduced-motion not handled.
- Pages workflow still publishes the repository root (Q7), so `android/art` and `docs/android/design` assets would be publicly served if the Pages config is unchanged.
- The `publish-evidence` CI job writes to `ci-evidence/ui-01`; it needs the owner's acceptance.
- Memory/perf on low-end devices untested; minSdk 24 is provisional.

## 7. Guardrail check

| Instruction | Status |
|---|---|
| Do not implement UI-02 | Respected: only Splash and Main Menu changed |
| Do not merge to `main` | Respected: pushes only to `feature/android-app` |
| Do not publish an APK release | Respected: CI artifact only |
| Do not modify Supabase | Respected: no Supabase files or access |
| Keep the web game functional | **VERIFIED**: web diff empty, 13/13 tests pass |
| Offline-only, no ads or analytics | Unchanged: policy gate G6 passed (no INTERNET permission) |
| Report differences honestly | §5 |

## 8. Decisions needed from Cowlick

1. Accept the flat-vector style as the art direction, or commission or supply painterly assets to close the gap in §5.1–5.4?
2. Should the missing props (hut/signpost, map, chest, ship) be drawn for Splash/Menu or deferred to the screens that use them?
3. Licence statement for the original artwork (Q6).
4. Tablet/landscape: approve my layouts or supply frames.

**STOP:** awaiting Cowlick UI-01B visual review.
