# UI-01 review report — M0 foundation, Splash, Main menu, shared theme

**For:** Cowlick UI-01 review · **Branch:** `feature/android-app` · **Validated code commit:** `22dcdeb` (later commits are documentation only)
**Not done, by instruction:** UI-02 and later modules, merge to `main`, releases, any Supabase access.

Evidence labels: **VERIFIED** (observed in CI output or a CI-produced file this session) · **ASSUMED** · **UNKNOWN**.

## 1. Bottom line

- **Build and tests: VERIFIED green in CI** for commit `22dcdeb`: lint, unit tests, debug/instrumented-test/release assembly, the APK permission policy, the dependency allowlist, and **11 instrumented tests passing on two Android 14 emulators (phone and tablet)**.
- **Visual parity with the design board: NOT achieved, and not claimed.** Screen *structure*, colours, typography family, copy and element order follow the board. The **illustrations do not**: the board's characters and scenery were supplied only as a flattened picture, so Splash and Main Menu use simple original code-drawn placeholders (§5). Side-by-side images are in §4.
- **Debug APK: available** as a CI artifact (§3). I could not download or inspect it myself because the artifact storage host is blocked from this sandbox.
- Design documents were completed first as instructed (§6).

## 2. CI evidence

| Item | Result | Link |
|---|---|---|
| Latest run (commit `22dcdeb`) | **success** — all jobs | <https://github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu/actions/runs/38924921466> |
| Previous green runs (same pipeline) | runs 7, 8, 9 success | run 9: <https://github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu/actions/runs/38923722570> |
| Workflow | `.github/workflows/android-ci.yml`, actions pinned by commit SHA | [file](../../.github/workflows/android-ci.yml) |

Gates (see `09-ci-gates.md`). "Passed" means the step concluded success in a CI run; I read per-step results for run 6 and the overall conclusion for runs 7–10, and read the actual test result lines from the emulator logs.

| Gate | What ran | Result |
|---|---|---|
| G0 wrapper integrity | `setup-gradle` with `validate-wrappers` | Passed |
| G1 build | `assembleDebug`, `assembleDebugAndroidTest`, `assembleRelease` (R8 on, unsigned) | Passed |
| G2 lint | `lintDebug`, `abortOnError` | Passed |
| G4 unit tests | 7 JVM tests: contrast tokens (3), splash timing (4) | Passed (count from source; step success from CI) |
| G6 offline/privacy policy | `tools/check-apk-policy.js` on the release APK via `aapt2`: no forbidden permissions (INTERNET etc.), `allowBackup=false`, only the launcher activity exported | Passed |
| G7 dependency allowlist | `tools/check-dependencies.js` on the release runtime classpath | Passed |
| G8 forbidden files | no keystores/APKs/`local.properties` tracked | Passed |
| Emulator tests | 11 instrumented tests (4 menu semantics/touch-target/dialog/exit, 1 splash semantics, 1 end-to-end splash→menu, 4 screenshot renders, 1 real-app capture) on **Android 14 (API 34, x86_64 emulator)**, phone 1080×2400 @420 dpi and tablet 2560×1800 @320 dpi | `OK (11 tests)` on both (read from `instrument.log`) |
| G9, G10, G11, G12, G13, G14, G15 | content, screenshot-baseline, nightly, Pages-isolation, web non-regression, size budget, release | **Not run** — out of UI-01 scope or awaiting approvals |

**CI history, for honesty:** runs 1, 2, 4 and 5 **failed** on compile errors in my code (a wrong import, a non-existent test API, an unresolved `matchParentSize`); each was fixed and re-run. Runs 3 and 6 were cancelled by later pushes. Runs 7–10 passed.

## 3. Artifacts

| Artifact (run 10) | Contents | Notes |
|---|---|---|
| `android-apks` (id 12055364719, 13.7 MB, sha256 of the zip `a5d59468…82cc`) | `app-debug.apk`, `app-debug-androidTest.apk`, `app-release-unsigned.apk` | Expires 2026-10-30. Download from the run page above (needs repository access). The **debug APK is the one to install**; the release APK is unsigned and not installable. Nothing was published as a Release |
| `ui01-screenshots-phone` / `-tablet` | Screenshots, `instrument.log`, `device.txt`, logcat tail | Expires 2026-11-15 |
| Branch `ci-evidence/ui-01` | The same screenshots (PNG and logs only, no code), pushed by CI because artifact storage is unreachable from the review sandbox | Never merged |

The stored copies used below are committed under `design/ui-01/`.

## 4. Screenshots and side-by-side comparison

All are real renders on Android 14 emulators. "Compose render" = the screen composable rendered on the emulator and captured (deterministic, progress fixed at 35% like the board). "Real app" = the running app captured full-screen with UiAutomator, including status/navigation bars.

| Image | What it shows |
|---|---|
| [`design/ui-01/comparison/splash-board-vs-android.png`](design/ui-01/comparison/splash-board-vs-android.png) | Board screen 1 · Compose render · real app |
| [`design/ui-01/comparison/menu-board-vs-android.png`](design/ui-01/comparison/menu-board-vs-android.png) | Board screen 2 · Compose render · real app |
| [`design/ui-01/comparison/tablet-landscape.png`](design/ui-01/comparison/tablet-landscape.png) | Tablet landscape splash and menu (no board frame exists) |
| [`design/ui-01/comparison/phone-font-scale-2.png`](design/ui-01/comparison/phone-font-scale-2.png) | Phone at 200% font size |
| [`design/ui-01/phone/`](design/ui-01/phone/), [`tablet/`](design/ui-01/tablet/) | Individual screenshots |

Coverage gaps (VERIFIED): the **real-app splash was captured on the phone only**; on the tablet the capture sequence only caught the menu (the splash lasts ~1.8 s), so the tablet splash is a Compose render, not a real-app frame. The real-app splash frame shows the bar at about 70%, not 35%.

## 5. Visual differences from the board

Measured on the comparison images; positions are fractions of screen height and accurate to a few percent.

### Illustration and art (largest differences)
| # | Board | Android UI-01 | Why |
|---|---|---|---|
| D1 | Detailed illustrated boy with backpack, both hands gesturing | Simple vector placeholder: cap, face, one raised arm, rounded shirt, no legs | No artwork files supplied; copying from the flattened board is not usable (resolution, licence) |
| D2 | Illustrated ginger-and-white cat, smiling, paws over the button | Placeholder cat: orange head, white muzzle, tail | same |
| D3 | Painted scenery: snowy mountains, varied trees, huts, river path, soft clouds | Flat vector sky, three mountain layers, round trees, sand path, plain clouds | same |
| D4 | Glossy 3D icon buttons with custom glyphs (gear, person, person-in-door) | Gradient circles with Material glyphs (`Settings`, `Person`, `ExitToApp`) | No icon files; Material icons are a placeholder |
| D5 | Logo with a heavy sticker outline in a display face | Nunito Black with a stroked outline; slightly lighter and smaller | The board's logo face is not named |

### Layout and sizing
| # | Board | Android UI-01 |
|---|---|---|
| D6 | Splash title block centre ≈ 28% from the top | ≈ 20% (title is higher) |
| D7 | Splash boy ≈ 48–83% of height, ≈ 53% of width | ≈ 50–85%, ≈ 52% of width (close) |
| D8 | Menu cat ≈ 38–59%, large | ≈ 48–66%, about 25% smaller and lower |
| D9 | MULA ≈ 58–71% of height, tall glossy pill, large label | ≈ 66–76%, shorter, 36 sp label |
| D10 | Icon row ≈ 77–93%, large icons and ≈ 20 sp captions | ≈ 80–92%, 72 dp icons, 18 sp captions |
| D11 | Back arrow in the top-left of the main menu | Not implemented: the menu is the root screen |
| D12 | Phone only; Android notch drawn in the mockup | Real status bar and system navigation shown; layouts are edge-to-edge |

### Deliberate deviations (spec wins over board)
| # | Deviation | Reason |
|---|---|---|
| D13 | MULA/Tetapan/Profil show a temporary "Akan datang" dialog | Their destinations belong to UI-02+; **not on the board** |
| D14 | MULA announces "Mula bermain" to TalkBack | Avoids letter-by-letter reading of capitals |
| D15 | Landscape tablet layouts and the translucent caption panel in landscape | The board has no tablet or landscape frames; the panel keeps captions off trees (found in the first tablet screenshots) |
| D16 | Logo ignores system font size; other text scales | At 200% the logo clipped in the first screenshots |
| D17 | Loading bar is a timed 1.8 s animation | No real loading work exists yet; it is wired to an initialisation flag for later |

### Defects found from the screenshots and fixed
Logo clipped at 200% font size; tablet mascot oversized and cut off; mouth drawn below the chin; stray sand spike behind the cat; "Keluar" caption over a tree trunk on tablet; cloud touching the title; real-app splash frame missing. All fixed and re-captured in run 10 except as noted in §4.

## 6. Design documents completed first

| Requested | Delivered |
|---|---|
| Store the board under `docs/android/design/` | [`design/design-board-v1.png`](design/design-board-v1.png) + 22 crops in [`design/crops/`](design/crops/) |
| Complete all PENDING-BOARD fields | [`05-screen-spec.md`](05-screen-spec.md): all 19 screens, components C01–C22, navigation diagram, colours, typography, contrast review, 13 board-vs-requirement findings (B1–B13) and open questions Q11–Q18 |
| Visual asset manifest | [`design/asset-manifest.md`](design/asset-manifest.md) |
| Exact components, colours, spacing, typography, navigation for 19 screens | `05-screen-spec.md` §3–§5. Colours were **sampled from the board's pixels**; text sizes and spacing for screens 3–19 are derived, not measured |

Key findings from the board (details in `05`): **Susun Huruf and Ayat Mudah have no frames**; the board uses 10 questions/100 points per round (web: 8/80) and a retry-on-wrong flow; several board button colours fail contrast (white on pink 2.81:1, white on green 1.76:1) so dark labels are used; there is no nickname-entry or profile-selection screen.

## 7. What was built

| Area | Files |
|---|---|
| Project | `android/` Gradle project, wrapper pinned with checksum, version catalog; AGP 8.11.1, Kotlin 2.2.21, Compose BOM 2025.10.00, minSdk 24 (provisional), target/compile 36; `applicationId` `io.github.p3n3b495.misibijak` (**provisional**) |
| Screens | `feature/splash` (Splash with timed progress, hand-over to menu, popped from back stack), `feature/menu` (Main menu; portrait and landscape layouts, scrolls at large font sizes) |
| Theme and components | `ui/theme`: palette tokens (board-sampled), contrast maths, Nunito (OFL, bundled), dimensions. `ui/components`: `PillButton`, `RoundIconButton`, `LoadingBar`, `GameTitle`/`OutlinedText`, `SceneBackground`, placeholder `BoyMascot`/`CatMascot`, `ComingSoonDialog` |
| Navigation | typed routes `Splash`, `MainMenu` |
| Policies | `AndroidManifest.xml` with no permissions, `allowBackup=false`, backup/transfer exclusions |
| Tooling | `tools/check-apk-policy.js`, `check-dependencies.js`, `android-instrument.sh`, `ci-gradle.sh`, `make-comparison.py` |

## 8. Unresolved issues and risks

| # | Issue | Evidence / status |
|---|---|---|
| U1 | **Artwork**: no usable character/scenery/icon files; board provenance and licence UNKNOWN. Placeholders are not a substitute for approved art | Q16, `design/asset-manifest.md` |
| U2 | Only Android 14 emulators (API 34, x86_64) were tested. API 24–33, real devices, low-RAM devices and ARM are **UNKNOWN** | Device census still missing (Q4) |
| U3 | **No manual TalkBack test.** Automated semantics checks only (labels, roles, touch-target sizes) | |
| U4 | Reduced-motion / system animation scale is not handled by the splash progress or any animation | Not implemented |
| U5 | Phone **landscape** was not captured; tablet landscape was | |
| U6 | Tablet layouts are functional but not designed (no board frames); controls are small relative to the screen | D15 |
| U7 | Real-app splash not captured on the tablet | §4 |
| U8 | Menu back arrow, glossy icons and the board's exact logo face are not reproduced | D4, D5, D11 |
| U9 | `applicationId`, `minSdk`, AGP/Compose versions are provisional and **older than the newest releases** (AGP 9.x exists); revisit at M1 | `01-decisions.md` §D |
| U10 | Artifact download from CI is blocked in the review sandbox; screenshots were read via the evidence branch. I did not install or inspect the APK myself | §3 |
| U11 | CI uses the Gradle action's proprietary caching component (stated in its log); CI-only, no effect on the app, but note the terms | Log of every run |
| U12 | The workflow has a job with `contents: write` that pushes only to `ci-evidence/ui-01`. Confirm you accept this, or remove the job | `android-ci.yml` |
| U13 | Pages deployment still publishes the repository root; `android/` and `docs/` will be published after any merge to `main` unless the isolation plan (06) is approved | Q7 |
| U14 | Board content questions (sun with *mata/batu/satu*, cat with "k _ t") and missing activities (Susun Huruf, Ayat Mudah) remain open | `05` §1 |

## 9. Guardrail check

| Guardrail | Status |
|---|---|
| No UI-02 or later | Complied: only Splash, Main menu, theme, components |
| No merge to `main`, no releases | Complied. The release APK exists only inside a CI artifact, unsigned |
| No production Supabase changes | Complied: no access of any kind |
| No UI parity claim without screenshots | Complied: parity is **not** claimed; screenshots and differences are listed |
| Preserve the web app | Complied: `git diff` against the Phase 1 tip is empty for every web, Supabase, test and Pages-workflow file; `npm test` re-run at the end of UI-01: **13/13 pass**. The only non-Android file touched is the root `.gitignore` (3 lines: `*.jks`, `*.keystore`, `local.properties`). `npm test` is not part of the Android workflow |
| No secrets or signing keys | Complied; G8 passed. Nothing is signed |

## 10. Decisions needed

1. Artwork route (Q16): supply files, or authorise original illustration work; until then the placeholders stand.
2. Whether to accept the evidence-branch job (U12).
3. Layout deviations D6–D10: ask for a further tuning pass toward the board, or wait for real artwork first (my recommendation: wait, since proportions will change with real art).
4. Answers to Q1 and Q11–Q15 before UI-02 (character selection and map) can start.
5. Confirm or replace the application ID (Q19).

**STOPPED for Cowlick UI-01 review.**
