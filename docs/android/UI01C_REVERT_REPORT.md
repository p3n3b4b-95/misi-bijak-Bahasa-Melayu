# UI-01C hold and safe revert — evidence report

**For:** Cowlick · **Branch:** `feature/android-app` · **Decision applied:** Option B (revert the unapproved UI-01C Android artwork and UI changes, restore UI-01B at `3157037`)
**Locks respected:** UI-02 locked · no merge to `main` · no APK release · no Supabase change · no production signing · no artwork created or modified · no new assets integrated.

Evidence labels: **VERIFIED** (read from git or CI output) · **ASSUMED** · **UNKNOWN**.

## 1. Result

- **The Android code and resources are exactly the validated UI-01B baseline.** The Git tree objects of `android/`, `tools/` and `.github/` at the revert commit are identical to those at `3157037` (`android` `e6d7f605b8d8`, `tools` `0bcf86e3265e`, `.github` `251aa323b083`), and `git diff 3157037 HEAD` shows no difference anywhere outside `docs/`. **VERIFIED.**
- **Done with one new revert commit, `ca6fde9`.** No reset, no force-push, no rewritten history and no manual file deletion. The branch moved from `4cbf792` to `ca6fde9` by a normal fast-forward push. **VERIFIED.**
- **All documentation, reports, checklists and evidence are preserved** (§4).
- **CI is fully green on `ca6fde9`; the web regression passes 13/13** (§5).

## 2. Which commits changed Android code and resources

Commits after the validated baseline `3157037` (`git log 3157037..HEAD`, before the revert):

| Commit | Content | Touched Android code, resources, art sources or tooling? | Action |
|---|---|---|---|
| `86d03b7` | UI-01B evidence and report | No (docs only) | kept |
| `9ee0dd5` | UI-01C painterly artwork pass: 5 Kotlin files, 22 bitmaps, 23 SVG sources, generators, build script (+ the generated `docs/…/ui-01c/asset-manifest.csv`) | **Yes** | **reverted** |
| `1cd53bf` | Ignore Python bytecode (`android/.gitignore`, removed a stray `.pyc`) | **Yes** (art tooling housekeeping) | **reverted** (it only supported the reverted generators) |
| `d415d8d` | UI-01C art direction, manifest, comparison sheet | No (docs only) | kept |
| `2a918d6` | `tools/art/build_assets.py`: also write a Markdown manifest | **Yes** (art tooling) | **reverted** |
| `292b423` | UI-01C run-15 evidence and report | No (docs only) | kept |
| `0499d6a` | V2 asset gap report, V2 sheet, element map | No (docs only) | kept |
| `4cbf792` | Asset intake checklist, manifest template | No (docs only) | kept |

`git revert --no-commit 2a918d6 1cd53bf 9ee0dd5` applied with no conflicts. Because `9ee0dd5` also added one documentation file, I restored `docs/android/design/ui-01c/asset-manifest.csv` from `HEAD` before committing, so the revert touches **no** file under `docs/`. **VERIFIED:** the committed revert contains 4 restored, 12 removed and 41 content-restored files, all under `android/` or `tools/`.

## 3. What the revert changed (commit `ca6fde9`)

**Kotlin sources** (5)

| Status | File |
|---|---|
| restored to UI-01B content | `android/app/src/main/java/io/github/p3n3b495/misibijak/feature/menu/MainMenuScreen.kt` |
| restored to UI-01B content | `android/app/src/main/java/io/github/p3n3b495/misibijak/feature/splash/SplashScreen.kt` |
| restored to UI-01B content | `android/app/src/main/java/io/github/p3n3b495/misibijak/ui/components/Characters.kt` |
| restored to UI-01B content | `android/app/src/main/java/io/github/p3n3b495/misibijak/ui/components/PillButton.kt` |
| restored to UI-01B content | `android/app/src/main/java/io/github/p3n3b495/misibijak/ui/components/SceneBackground.kt` |

**Resources (drawable-nodpi)** (23)

| Status | File |
|---|---|
| removed | `android/app/src/main/res/drawable-nodpi/amir_full.webp` |
| restored (added back) | `android/app/src/main/res/drawable-nodpi/amir_wave.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/bush_a.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/bush_b.webp` |
| removed | `android/app/src/main/res/drawable-nodpi/cat_paws.webp` |
| removed | `android/app/src/main/res/drawable-nodpi/cat_peek.webp` |
| restored (added back) | `android/app/src/main/res/drawable-nodpi/cat_sit.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/cloud_a.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/cloud_b.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/cloud_c.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/ground.webp` |
| removed | `android/app/src/main/res/drawable-nodpi/hut.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/icon_exit.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/icon_profile.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/icon_settings.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/logo_menu.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/logo_splash.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/mountains.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/rocks.webp` |
| removed | `android/app/src/main/res/drawable-nodpi/signpost.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/tree_a.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/tree_b.webp` |
| restored to UI-01B content | `android/app/src/main/res/drawable-nodpi/tree_c.webp` |

**Art sources: SVG** (23)

| Status | File |
|---|---|
| removed | `android/art/svg/amir_full.svg` |
| restored (added back) | `android/art/svg/amir_wave.svg` |
| restored to UI-01B content | `android/art/svg/bush_a.svg` |
| restored to UI-01B content | `android/art/svg/bush_b.svg` |
| removed | `android/art/svg/cat_paws.svg` |
| removed | `android/art/svg/cat_peek.svg` |
| restored (added back) | `android/art/svg/cat_sit.svg` |
| restored to UI-01B content | `android/art/svg/cloud_a.svg` |
| restored to UI-01B content | `android/art/svg/cloud_b.svg` |
| restored to UI-01B content | `android/art/svg/cloud_c.svg` |
| restored to UI-01B content | `android/art/svg/ground.svg` |
| removed | `android/art/svg/hut.svg` |
| restored to UI-01B content | `android/art/svg/icon_exit.svg` |
| restored to UI-01B content | `android/art/svg/icon_profile.svg` |
| restored to UI-01B content | `android/art/svg/icon_settings.svg` |
| restored to UI-01B content | `android/art/svg/logo_menu.svg` |
| restored to UI-01B content | `android/art/svg/logo_splash.svg` |
| restored to UI-01B content | `android/art/svg/mountains.svg` |
| restored to UI-01B content | `android/art/svg/rocks.svg` |
| removed | `android/art/svg/signpost.svg` |
| restored to UI-01B content | `android/art/svg/tree_a.svg` |
| restored to UI-01B content | `android/art/svg/tree_b.svg` |
| restored to UI-01B content | `android/art/svg/tree_c.svg` |

**Art sources: generators** (4)

| Status | File |
|---|---|
| removed | `android/art/gen/characters.py` |
| removed | `android/art/gen/paintkit.py` |
| restored to UI-01B content | `android/art/gen/scenery.py` |
| restored to UI-01B content | `android/art/gen/ui_art.py` |

**Tooling** (1)

| Status | File |
|---|---|
| restored to UI-01B content | `tools/art/build_assets.py` |

**Other** (1)

| Status | File |
|---|---|
| restored to UI-01B content | `android/.gitignore` |

Restored at the same time: the UI-01B `amir_wave` and `cat_sit` bitmaps and their SVG sources; `AmirMascot`, `CatMascot`, `SceneBackground`, `PillButton`, `MainMenuScreen` and `SplashScreen` return to their UI-01B code (with `Characters.kt` no longer containing `CatOverButton`).

## 4. Preserved (nothing under `docs/` was changed by the revert)

All of: `UI01B_REPORT.md`, `UI01C_REPORT.md`, `UI01C_V2_ASSET_GAP_REPORT.md`, `ASSET_INTAKE_CHECKLIST.md`, and everything under `design/` (`ui-01`, `ui-01b`, `ui-01c` including its `asset-manifest.csv`, `cowlick-v2`, `asset-intake`, the design board and V2 sheet). The CI evidence branch `ci-evidence/ui-01` is untouched apart from CI adding run 16.

**Reading note:** the preserved UI-01C documents describe artwork and code that are now reverted (for example the resource names `amir_full`, `cat_peek`, `hut`). They remain as history. The README index marks `UI01C_REPORT.md` as superseded and points to this report.

## 5. Validation

| Check | Result | Evidence |
|---|---|---|
| Android CI on `ca6fde9` (run 16) | **success, all 4 jobs** | <https://github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu/actions/runs/39004697076> |
| G8 forbidden files, G2 lint, G4 unit tests, G1 build (debug, test, release with R8), G6 APK policy, G7 dependency allowlist | all steps **success** | job "Build, lint, unit tests, policy gates" in run 16 |
| Instrumented tests | **`OK (11 tests)` on phone** (Android 14, API 34, 1080 × 2400 @ 420 dpi) **and on tablet** (Android 14, API 34, 2560 × 1800 @ 320 dpi) | `instrument.log` read from the evidence branch (`d506d84`) |
| Visual identity with UI-01B | The four Compose-render screenshots on each device (splash, menu, and both at 200 % font scale) are **pixel-identical** to the run-12 screenshots from `3157037` (8 of 8 compared) | local pixel comparison of the evidence-branch files |
| Web regression | `npm test`: **13 of 13 pass, 0 fail**. Since the web baseline `fb826ce` the only non-Android, non-docs difference is 5 added lines in the root `.gitignore` (a comment, `*.jks`, `*.keystore`, `local.properties`, from the M0 commit `d24d58f`). No web, test, Supabase or Pages-workflow file differs | local run; `git diff fb826ce HEAD` |
| Artifact `android-apks` | id 12090716538, 15,660,596 bytes (about 15.66 MB, the same as the UI-01B run), digest `sha256:cfd81ead…37d3`, expires 2026-10-31. CI artifact only; **not a release** | run 16 |
| Other artifacts | `android-reports` 12090925708; screenshots: phone 12090637219, tablet 12090277294 | run 16 |

Not run or not covered: the unused CI gates G9 to G15 (as before); real devices (Android 14 emulators only); manual TalkBack. I could not download the APK from this sandbox (artifact host blocked), so APK identity rests on the tree equality and the identical screenshots, not on a byte comparison. The earlier runs 13 and 14 were cancelled by my own pushes, and run 15 (the reverted state) stays in the history.

## 6. Locks and remaining state

| Item | State |
|---|---|
| UI-01B | Restored at `3157037` content; technically passed (runs 12 and 16); visual approval pending with Cowlick |
| UI-01C | Waiting for the Cowlick asset pack. The intake process in `ASSET_INTAKE_CHECKLIST.md` is accepted as provisional. Visual Design V2 and Blueprint V2 are treated as design references only, not production assets |
| UI-02 | Locked, not started |
| Tablet and landscape | Pending final visual review |
| `main`, APK release, Supabase, signing | No merge, no release, no change, no production signing |
| Artwork | None created, modified or integrated |

**STOP:** awaiting the separate Cowlick Asset Pack. On arrival I will run only the completeness checks of the intake checklist and report before changing any UI code.

The open questions in the checklist (§7) are unchanged by this revert. The ones I should have in hand before step 4 are D1, D2, D3, D5, D6 and the licence and Pages scope (Q6, Q7).
