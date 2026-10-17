# UI-01C / Cowlick Visual Design V2 — asset gap report and implementation mapping

**For:** Cowlick review · **Branch:** `feature/android-app` · **Status:** analysis only. **No code, no assets, no layout changed.** Nothing implemented; UI-02 locked; no merge to `main`; no release.
**Reference stored:** [`design/cowlick-visual-design-v2.png`](design/cowlick-visual-design-v2.png) (1536 × 1024 px, SHA-256 `c7fe092a…812f`, supplied by the owner in this conversation). Element IDs below are drawn on [`design/cowlick-v2/element-map.png`](design/cowlick-v2/element-map.png) (boxes are approximate).

Evidence labels: **VERIFIED** (measured or read from the V2 image or the repo) · **ASSUMED** · **UNKNOWN**.

## 1. Bottom line

1. **Blocker (contract rule 8): the V2 sheet contains no production assets.** It is one flattened 1536 × 1024 picture. Each phone mock-up is only about 410 px wide, each character about 150 × 190 px, each background thumbnail about 160 × 100 px. Every illustration is baked together with its scenery, with no transparency and no layers. The panels are titled "PNG/SVG" and "Layered Assets", but the files themselves were not supplied. Per rules 6 and 7, I will not use the composite as a background and will not crop characters from it. **VERIFIED.**
2. **V2 changes the product, not only the look.** It adds a top bar with a player name, level and star total (profile data that does not exist yet), a Baca / Tulis / Faham signpost, a new slogan, and a Poppins font that is not bundled. These need owner decisions before coding (§6, §8).
3. **Several V2 colours fail WCAG contrast** and need approved deviations, as in UI-01 (§6).
4. **What can be built natively without the pack:** the MULA button, the three menu tiles and their glyphs, the progress bar, the top bar, the signpost boards (as real text on wood), and the text on the planks. V2's own "Komponen Utama (Jetpack Compose)" panel names exactly these as components. **Everything illustrated has to come from the pack:** the two logos, Amir, the cat, Aina (not on these screens), the scenery layers, the plank, the hut and the decorations.
5. **The architecture holds.** The existing `SplashScreen`, `MainMenuScreen`, `SceneBackground`, `PillButton`, `LoadingBar` and `RoundIconButton` map cleanly to V2 (§5). No navigation, DI or dependency changes are needed, and nothing touches offline or privacy settings.

## 2. What V2 contains (inventory)

| V2 region | Content | Usable as |
|---|---|---|
| Two phone mock-ups (9:16) | Splash and Main Menu | Visual hierarchy, proportions, palette, illustration direction. **Not** an asset source |
| "Watak Utama (PNG/SVG)" | Amir (idle, pointing), Aina (idle, holding a book), cat Happy / Sit / Jump | Character identity and style; thumbnails only |
| "Latar Belakang (Layered Assets)" | Four scenes: Langit & Gunung, Latar Kampung, Jalan Pengembaraan, Sungai & Air Terjun | Scenery direction; flattened thumbnails, not layers |
| "Komponen Utama (Jetpack Compose)" | Butang Utama (MULA), Butang Menu (Tetapan / Profil / Keluar), Papan Tanda (Baca / Tulis / Faham), Top Bar | Component specification |
| "Warna Tema" | `#4FC3F7` Sky Blue, `#81C784` Green, `#FFD54F` Yellow, `#FF8A65` Orange, `#F06292` Pink, `#9575CD` Purple, `#8D6E63` Brown, `#FFFFFF` White | Palette. The printed hex values differ slightly from the swatch pixels (e.g. sky swatch `#3DB5FC`); I take the printed values as authoritative, **ASSUMED** |
| "Tipografi" | Poppins (title, buttons, UI); Nunito (body) | Type spec |
| "Reka Letak Responsif" | Phone 9:16, Tablet 4:3, Landscape 16:9, each about 150 px wide | Layout *intent* only. Illegible at this size, and the text inside is garbled |
| "Peraturan Reka Bentuk" | Eight rules (big clear pictures, large buttons, pastel colours, short BM text, soft animation, responsive, audio for all questions, suitable for remedial pupils) | Design principles. "Audio for all questions" and "soft animation" are **not** part of Splash or Menu (see §8) |
| "Contoh Kod" | A Compose `MainButton` snippet | Illustrative only; it uses `Icons.Default.PlayArrow`, which the app deliberately does not depend on (material-icons was removed in UI-01B) |

## 3. Asset gap table

"Source size" is the approximate pixel size of the element in the V2 picture, measured from the annotation boxes (±10 %). "Target" is what a 1080 × 2400 phone needs for sharp display (large phones and tablets need more, so the pack should be delivered at 2× that). **VERIFIED** unless stated.

| ID | Element | Used on | Source size in V2 | Target size | Separate asset in V2? | Can be built natively? | Status |
|---|---|---|---|---|---|---|---|
| A1 | **Logo** "Misi Bijak / Bahasa Melayu" (navy-outlined, 3D, bubbly lettering; not Poppins and not Nunito) | S1, M4 | 353 × 140 | about 1000 × 400 | No (baked) | No: custom lettering | **BLOCKER:** need vector or high-res PNG with transparency |
| A2 | **Slogan plank** (wood board with leaves) | S2, M5 | 260 × 70 | about 800 × 220 | No (baked) | Partly: the text is native; the board needs a bitmap | **BLOCKER** (bitmap without text). The text "Belajar • Bermain / Maju Bersama!" would be real text on top |
| A3 | **Amir, walking and pointing** (splash pose) | S3 | 212 × 365 | about 600 × 1050 | No. The thumbnail pose differs (idle, pointing) | No | **BLOCKER** |
| A4 | **Amir, cheering (fist up)**, interlocked with the cat | M8 | 140 × 215 | about 450 × 700 | No | No | **BLOCKER** |
| A5 | **Amir, idle, pointing** (character sheet pose) | not placed on either screen | 150 × 190 | about 600 × 1000 | Thumbnail only | No | Needed only if a screen uses it; **decision D6** |
| A6 | **Cat, sitting and looking up** (splash pose, with collar and bell) | S4 | 157 × 210 | about 450 × 600 | No | No | **BLOCKER** |
| A7 | **Cat beside Amir, paw on his hand** (menu pose) | M8 | 135 × 195 | about 400 × 580 | No. It is not the Happy / Sit / Jump thumbnails | No | **BLOCKER.** Ideally A4 + A7 as two layers with the overlap order specified |
| A8 | Cat Happy / Sit / Jump (sheet) | not placed on either screen | about 130 × 150 each | about 400 × 500 | Thumbnails only | No | Not needed for Splash or Menu unless animation (D9) uses them |
| A9 | **Aina, idle** (pink hijab, holding a book) | not on these screens | 120 × 190 | for UI-02 | Thumbnail only | No | Not needed now; the UI-01C flat Aina no longer matches the style |
| A10 | **Player avatar** (Amir's face in a ring) | M1 | 50 × 50 | about 160 × 160 | No | No | Needs a head-and-shoulders crop made from the real Amir art in the pack. Cannot be made from this image |
| A11 | **Sky, clouds, far mountains** layer | S0, M0 | 158 × 100 thumbnail | about 1080 × 900 | Thumbnail ("Langit & Gunung") | No | **BLOCKER** |
| A12 | **Village / house** layer, and the small **hut** | M6 | 55 × 85 | about 300 × 460 | The thumbnail "Latar Kampung" shows a different, larger red-roofed house | No | **BLOCKER:** decide which house (D8) |
| A13 | **River, waterfall, bridge and rocks** layer | S5, menu mid-ground | 380 × 155 | about 1080 × 450 | Thumbnail "Sungai & Air Terjun" | No | **BLOCKER** |
| A14 | **Winding path and foreground** layer | both | thumbnail "Jalan Pengembaraan" | about 1080 × 1200 | Thumbnail only | No | **BLOCKER** |
| A15 | **Foreground foliage, fence, flowers, rocks** (framing left/right/bottom) | both | baked | separate PNGs, about 400–600 px | No | No | **BLOCKER** |
| A16 | **Trees** (left and right framing) | both | baked | about 400 × 700 | No | No | **BLOCKER** (or part of A15) |
| A17 | **Signpost post and wood texture** (the three boards are native) | M7 | 97 × 165 | about 300 × 500 | No | Partly: boards as shapes with a bitmap wood texture | Need post and wood texture. Board labels are native text |
| A18 | **MULA button** (yellow, glossy, play glyph, brown label) | M9 | 298 × 90 | native | n/a | **Yes** (gradient, gloss, vector play triangle) | No asset needed |
| A19 | **Menu tiles** (blue / green / red rounded squares) with gear, person and door glyphs | M10 | 85 × 85 each | native vectors | n/a | **Yes** (glyphs as vector drawables I author) | No asset needed; D4 is the glyph source |
| A20 | **Progress bar** and **status plank** | S7, S8 | 307 × 28 and 292 × 43 | native bar; the plank needs a wood bitmap | n/a | Bar yes; plank partly | Plank texture shares A2 / A17 |
| A21 | **Star icon**, **gear**, avatar ring, "pill" panels (top bar) | M1–M3 | small | native vectors | n/a | **Yes** | No asset needed except A10 |
| F1 | **Poppins** (SemiBold and Bold, TTF) with its licence | all titles, buttons, UI | n/a | n/a | n/a | n/a | Not bundled (**VERIFIED**: `Type.kt` notes it is missing). Poppins is SIL OFL and available from Google Fonts, so I can bundle it. **D5** |

**Gap summary:** 14 illustrated elements are blockers (A1–A4, A6, A7, A10–A17). Three are not needed for these screens (A5, A8, A9). Four can be built natively (A18–A21), though the plank and signpost boards (A2, A17, A20) still need a wood bitmap from the pack. One font (F1) is trivial to add.

**Reuse of my UI-01C art:** it does not match V2 (Amir in shorts and red shoes versus V2's jeans and blue sneakers, no collar bell, different cat design). It stays in the app as the interim art only until the pack arrives; I will not extend it, in line with rule 2.

## 4. Asset pack request (what to send)

**Characters** (one file per pose, transparent background, **no scenery baked in**, SVG preferred, otherwise PNG at least 2048 px on the long side): Amir walking-and-pointing; Amir cheering; cat sitting-looking-up; cat beside Amir (menu); optional Amir idle, cat Happy / Sit / Jump, Aina idle. For the two menu characters, deliver them as separate layers with the overlap order stated.

**Scenery layers** (transparent PNG or WebP, each at 1080 px wide minimum, 1620 px recommended): sky and clouds; far mountains; mid hills with trees; village house; river with waterfall and bridge; winding path; left and right foreground framing (foliage, fence, flowers, rocks); signpost post. Delivered as separate layers so each can sit behind or in front of the characters.

**UI art:** logo as SVG or high-res transparent PNG, with and without the dark outline if possible; wood plank bitmap *without text* (and the leaf pieces separate); wood texture tile; avatar head image; any special glyph shapes the owner wants for the gear, person, door and star.

**Provenance and licence statement for every file** (who made it, and whether any generative tool was used and under what terms), plus the licence under which the project may ship it. The V2 sheet shows signs of generated imagery (garbled text in the tablet and landscape thumbnails). This matters for the open decision Q6.

**Budget:** current Splash decodes about 24 MB of bitmaps and the debug APK is 15.5 MB. The pack should stay within about 40 MB decoded per screen (layers should be WebP; large layers can be downscaled per density bucket). **ASSUMED** limit, to be confirmed by Cowlick.

## 5. Implementation mapping (V2 element → native Compose)

Package `io.github.p3n3b495.misibijak`. "Keep" = no behaviour change.

| V2 element | Compose target | Change | Data / state | Accessibility and tests |
|---|---|---|---|---|
| Splash scene S0, S5, S6 and menu scene M0, M6, M7 backdrop | `ui/components/SceneBackground.kt` (decorative `Canvas`) | Replace the procedural sprite layout with the supplied layers, stacked back to front. Keep the horizon-relative layout and the landscape and tablet handling | none | Stays hidden from TalkBack (`clearAndSetSemantics`). Memory check on a low-RAM emulator |
| A1 / A2 logo | `ui/components/GameTitle.kt` | New bitmap (or vector) per variant; keep `contentDescription = "Misi Bijak Bahasa Melayu"` and `heading()` | none | Keep `MainMenuTest.showsTitleAndAllFourActions` |
| S2 / M5 slogan plank | **new** `ui/components/TaglinePlank.kt` | Plank bitmap behind a real `Text` (Poppins SemiBold, brown on wood); wraps on large font | string `tagline` (**needs approval**, D2) | Plain text, readable by TalkBack. Test at 200 % font scale |
| S3 / S4 Amir and cat on splash | `ui/components/Characters.kt` (`AmirMascot`, new `CatMascot`) | Swap to the pose bitmaps; fit-and-centre as now; ground contact on the path (`fadeBottom` not needed once the art has full legs) | none | Decorative, null descriptions |
| M8 Amir and cat on menu | `Characters.kt` (`AmirCheerWithCat` or two layers) | Replaces `CatOverButton`. The cat no longer rests on MULA, so that composable and the paws overlay are retired | none | Decorative |
| S7 progress bar | `ui/components/LoadingBar.kt` | Green fill on a light track with a white border (V2). **Contrast deviation needed** (§6) | `progress: Float` from `SplashGate` (unchanged) | Keep `progressBarRangeInfo` and the description; keep `SplashScreenTest` |
| S8 status plank | `LoadingBlock` in `SplashScreen.kt` | Text sits on the plank bitmap; keep `stringResource(R.string.splash_loading)` | none | Real text |
| M9 MULA | `ui/components/PillButton.kt` | Restyle: lighter top, darker rim, play glyph (vector drawable), brown label (darker token, §6). **Keep** the semantics `contentDescription = "Mula bermain"` and a height of at least 64 dp | `onPlay` (unchanged: coming-soon dialog until UI-02) | Keep `touchTargetsAreLargeEnough`, `unfinishedDestinationsShowComingSoonDialog` |
| M10 menu tiles | `ui/components/RoundIconButton.kt` → rounded-square tile | New shape (about 28 % corner radius) with gradient and vector glyph; real `Text` caption with a legible background (§6). Visible text stays "Tetapan / Profil / Keluar" | `onSettings`, `onProfile`, `onExit` (unchanged) | Keep text and click assertions and the ≥ 48 dp targets |
| M1 profile chip, M2 star counter, M3 gear | **new** `feature/menu/MenuTopBar.kt` (+ `PlayerChip`, `StarCounter`) | New composables per the V2 "Top Bar" component | **New state `PlayerSummary(name, level, stars)`. Nothing in the app provides it** (D1) | Merged semantics: "Adik Bijak, Tahap 1", "24 bintang", gear with its own description and ≥ 48 dp. New tests required |
| M7 signpost | **new** `feature/menu/SkillSignpost.kt` + post bitmap | Three wood boards as shapes with real text "Baca", "Tulis", "Faham" | Behaviour undefined (D3): decorative, or three real buttons | If decorative, hide from TalkBack. If interactive, ≥ 48 dp and a coming-soon dialog |
| Palette | `ui/theme/Palette.kt` | Add V2 tokens (`#4FC3F7`, `#81C784`, `#FFD54F`, `#FF8A65`, `#F06292`, `#9575CD`, `#8D6E63`); keep the existing contrast-corrected derivatives | none | Extend `ContrastTest` for every text-on-colour pair V2 introduces |
| Type | `ui/theme/Type.kt` + `res/font` | Add Poppins SemiBold and Bold (OFL licence text under `assets/licenses/`); Nunito stays for body | none | Offline, bundled, no network font loading; G7 allowlist unaffected (not a dependency) |
| Strings | `res/values/strings.xml` | Add `tagline`, `skill_baca`, `skill_tulis`, `skill_faham`, `profile_level`, `stars_count`, and others once approved; all in Bahasa Melayu | none | none |
| Responsive (tablet 4:3, landscape 16:9) | existing landscape branches in `SplashScreen` and `MainMenuScreen` | Re-lay out to V2 intent: in landscape, Amir at left, logo and MULA centred, signpost at right. The thumbnails are too small to specify spacing | none | Provisional until Cowlick supplies readable frames |

**No change needed:** navigation (`Routes.kt`, `AppNavHost.kt`), DI (`AppContainer`), `SplashGate`, the manifest (no permissions, `allowBackup=false`), CI workflow and gates, web app.

## 6. Accessibility and contrast findings (VERIFIED by calculation unless noted)

| Pair (from V2) | Ratio | Needed | Result and proposal |
|---|---|---|---|
| White glyph on Sky Blue `#4FC3F7` (Tetapan tile) | 2.00 : 1 | 3 : 1 (non-text) | **Fails.** Darken the tile gradient where the glyph sits, as in UI-01 (the deviation stays visibly close to V2) |
| White glyph on Green `#81C784` (Profil tile) | 2.01 : 1 | 3 : 1 | **Fails.** Same treatment |
| White on Orange `#FF8A65` | 2.31 : 1 | 3 : 1 / 4.5 : 1 | **Fails** for any text or glyph; avoid white-on-orange |
| Brown `#8D6E63` on Yellow `#FFD54F` (MULA label, as printed) | 3.28 : 1 | 3 : 1 (large text) | Passes only as large text. A darker brown (about `#5A2D0C`) gives a comfortable margin; V2's rendered label already looks darker than the printed swatch |
| Dark ink `#10213D` on Yellow `#FFD54F` | 11.39 : 1 | 4.5 : 1 | Passes (reference for fixes) |
| Progress fill (green) against the light track, sampled from the picture | about 1.7 : 1 | 3 : 1 (component boundary) | **Fails** (sampled, approximate). Needs a darker track outline or fill |
| White menu captions "Tetapan / Profil / Keluar" over grass and flowers | **UNKNOWN** | 4.5 : 1 | A dark outline helps but cannot be measured against changing art. Safer: a dark text on a light caption chip, or a verified dark stroke, with an emulator-render test |
| Text on wood planks (dark brown on tan) | not measured | 4.5 : 1 | Expected to pass; to be verified with real tokens |

Other accessibility points: the top bar adds a second path to Settings (gear plus the Tetapan tile), so the two must be distinguishable by TalkBack or one dropped (D7). The star count needs a spoken unit ("24 bintang"). Reduced-motion handling does not exist yet (relevant to the "soft animation" rule, D9). No manual TalkBack test has been done.

## 7. Existing tests and restrictions to preserve

11 instrumented tests (`MainMenuTest` ×4, `SplashScreenTest`, `AppFlowTest`, `ScreenshotTest` ×4, `DeviceScreenshotTest`) and 7 unit tests (`ContrastTest` ×3, `SplashGateTest` ×4) must keep passing; assertions on visible text and content descriptions are unchanged by this plan, and new components get new tests. Offline-only, no `INTERNET`, no ads or analytics, student-facing text in Bahasa Melayu, G6 / G7 / G8 and the web regression suite stay in force. The assets must also carry a provenance and licence row each in the asset manifest.

## 8. Decisions and answers needed from Cowlick / owner

| # | Question | Why it blocks |
|---|---|---|
| **D0** | **Will the asset pack (§4) be supplied, in what format, and when?** Or should I author the illustrated elements myself? If so, say that V2 may be matched as closely as my tooling allows, which is vector-plus-shading and has already been judged short of this target | Rule 8: no implementation without separate assets |
| D1 | **Top bar scope.** Player name, level and star total need a profile and progress store that is UI-02+ territory. Hide the top bar until then, show it with fixed placeholders ("Adik Bijak", "Tahap 1", 0), or build the minimal local store now? Placeholder numbers would be fake data | Avoids inventing behaviour and avoids a UI-02 leak |
| D2 | **New copy.** Approve "Belajar • Bermain / Maju Bersama!" as the slogan and the exact BM wording of the signpost and top bar | Copy was approved earlier; these strings are new |
| D3 | **Signpost.** Decorative, or three real buttons? If real, what do "Baca / Tulis / Faham" open? They do not match the six activity types in the spec | Needs a navigation target |
| D4 | **Glyphs.** May I author the gear, person, door, star and play glyphs as vector drawables (original)? | Otherwise they come from the pack |
| D5 | **Fonts.** Approve bundling Poppins (OFL) for titles, buttons and UI; the logo stays custom lettering | Adds font files and a licence text |
| D6 | **Which Amir and cat poses go on which screen?** I read splash = Amir walking and pointing + cat sitting; menu = Amir cheering + cat beside him. The sheet's idle and Happy / Sit / Jump poses are not placed on either screen | To list exact files |
| D7 | **Two settings entry points.** Keep both the top-right gear and the Tetapan tile? | Duplicate control |
| D8 | **Menu house.** The menu shows a small gnome-style house at the left; the "Latar Kampung" thumbnail shows a larger red-roofed one. Which? | Different assets |
| D9 | **Animation.** V2's rules say "soft animation". Splash and Menu animation (idle bounce, blinking, parallax) are out of scope unless specified, and need a reduced-motion setting | Unspecified; deferred |
| D10 | **Contrast deviations** in §6 (darker tiles, loading bar, MULA label, caption chips): approved as in UI-01? | Changes V2's colours slightly |
| D11 | **Tablet and landscape.** Supply readable frames, or accept the existing provisional layouts adapted to V2's proportions | Thumbnails are about 150 px wide |

## 9. Next steps

1. Cowlick answers D0 to D11 and supplies the pack (or authorises me to author the missing art).
2. On receipt, I check each file against §4 (size, transparency, alpha edges, layer order, licence), then produce the final file list and the build plan, and only then write code.
3. After implementation: lint, unit and instrumented tests on phone and tablet emulators, web regression, side-by-side comparisons against V2, and a UI-01C report that lists the remaining differences honestly.

**STOP:** awaiting Cowlick review. No implementation, no UI-02, no merge to `main`, no release.
