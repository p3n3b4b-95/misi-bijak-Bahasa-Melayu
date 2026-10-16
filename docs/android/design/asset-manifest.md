# Visual asset manifest — Design Board V1

Lists every visual (and the audio/typography that goes with it) that the 19 board screens need, what exists in the repository today, and what is missing. Companion to `../05-screen-spec.md` and `../08-licensing-audit.md`.

**Key fact (VERIFIED):** the board was supplied only as one flattened 1312 × 1199 picture (`design-board-v1.png`). No artwork files (SVG, layered, or transparent PNG) were supplied. Each phone frame is about 175 × 285 px, so even cropping from it would give 2–4× too little resolution for a 1080-px-wide screen, and the picture's provenance and licence are UNKNOWN. **Nothing is extracted from the board for use in the app.**

Status vocabulary: **Implemented** (real, cleared asset in the app) · **Placeholder** (original code-drawn stand-in in the app, not board art) · **Missing** (nothing in the app) · **Bundled** (file in the repo with a verified licence).

Licence column: `UNKNOWN` unless stated. Board crop file names refer to `crops/`.

## 1. Scenery and backgrounds

| ID | Asset | Screens (board) | Needed form | App status | Licence / source |
|---|---|---|---|---|---|
| BG-01 | Daytime meadow scene: sky, clouds, mountains, hills, winding sand path, trees, bushes | 1, 2 (reused in headers of 3–19) | Vector (SVG→VectorDrawable) or layered WebP, portrait + landscape + tablet variants | **Placeholder**: `SceneBackground.kt`, original shapes drawn in code | Original code (project-owned once the repo licence is set — Q6) |
| BG-02 | Sky header (blue gradient, soft clouds) above cream cards | 3, 5–11, 15–18 | Vector | Missing | UNKNOWN |
| BG-03 | World map "Pulau Kata" (island, sea, path, hut, trees) | 4 | Large illustration, scrollable | Missing | UNKNOWN |
| BG-04 | Success background (green gradient, sparkles) | 12 | Vector | Missing | UNKNOWN |
| BG-05 | Failure/encouragement background (pink gradient, hearts) | 13 | Vector | Missing | UNKNOWN |
| BG-06 | Results background (yellow card on sky) | 14 | Vector | Missing | UNKNOWN |
| BG-07 | Celebration scene with three children | 19 | Illustration | Missing | UNKNOWN |
| BG-08 | Guide illustration: mother and child reading, cat | 18 | Illustration | Missing | UNKNOWN |
| BG-09 | Decorative island, treasure chest, ship (style panel) | Panel; chest also on 4 | Illustrations | Missing | UNKNOWN |

## 2. Characters

| ID | Asset | Screens | Poses needed | App status | Licence / source |
|---|---|---|---|---|---|
| CH-01 | Boy (black cap, yellow shirt, blue backpack) | 1, 3, 9, 12, 13, 14, 15, 19 | waving (1), portrait on yellow (3, 15), picture card (9), cheering (12), sad (13), small head (19) | **Placeholder**: waving pose only (`BoyMascot`) | Original code |
| CH-02 | Girl in pink hijab | 3, 18, 19 | portrait on pink (3), reading with child (18), group (19) | Missing | UNKNOWN |
| CH-03 | Small boy (selectable, unlocked) | 3, 18, 19 | portrait on light blue, reading | Missing | UNKNOWN |
| CH-04 | Two locked character silhouettes (grey, dark) | 3 | portrait + padlock overlay | Missing | UNKNOWN |
| CH-05 | Ginger cat mascot | 2, 6, 10, 18 | sitting on button (2), side view (6), picture card (10), playing (18) | **Placeholder**: sitting pose only (`CatMascot`) | Original code |
| CH-06 | Woman in hijab with child | 18 | reading together | Missing | UNKNOWN |

Names of the characters (the profile shows "Watak : Amir") are not given; the character roster is therefore an open question (Q3).

## 3. Learning pictures

| ID | Asset | Screens | App status | Notes |
|---|---|---|---|---|
| PX-01 | Red apple | 8 | Missing | Illustration needed (Malay: epal) |
| PX-02 | Sun | 11 | Missing | Options on board are mata/batu/satu; correct Malay word is matahari (content issue B11) |
| PX-03 | Cat picture | 10 | Missing | Pattern "k _ t" is unclear (B11) |
| PX-04 | Boy picture | 9 | Missing | Same artwork as CH-01 |
| PX-05 | 48 word pictures + sentence pictures from the web game (currently emoji) | Web game / future | Missing | See `../08-licensing-audit.md` §4: 15 of 48 emoji are wrong or ambiguous |
| PX-06 | Pictures for Susun Huruf and Ayat Mudah | none on board | Missing | Activities not on board (B1) |

## 4. Icons and UI graphics

| ID | Asset | Screens | App status | Notes |
|---|---|---|---|---|
| IC-01 | Back arrow in circle (teal/blue; red and orange variants on map) | 3–19 | Missing | Needs ≥ 48 dp touch area |
| IC-02 | Settings gear (glossy blue button) | 2 | **Placeholder**: Material `Settings` glyph in a gradient circle | Material Icons are Apache-2.0 (ASSUMED from general knowledge; dependency licence report in CI will confirm) |
| IC-03 | Profile person (green button) | 2 | **Placeholder**: Material `Person` glyph | as above |
| IC-04 | Exit (blue-grey button) | 2 | **Placeholder**: Material `ExitToApp` glyph | as above |
| IC-05 | Home | style panel | Missing | |
| IC-06 | Star (gold, grey, empty) | 4, 5, 12, 14, 16 | Missing | Also star badges |
| IC-07 | Speaker (blue and lilac variants) | 7, 8, 9 | Missing | |
| IC-08 | Padlock (lilac and grey) | 3, 5, 16 | Missing | |
| IC-09 | Check marks (grey, teal) | 6 | Missing | |
| IC-10 | Level tile icons (three small emblems on tiles) | 5 | Missing | Emblems indecipherable on the board |
| IC-11 | Achievement badges: 2 gold, 1 grey star badge; 3 locked | 16 | Missing | Badge names unreadable |
| IC-12 | Map node bubbles with stars; treasure chest | 4 | Missing | |
| IC-13 | Launcher icon (adaptive + legacy PNG) | OS | **Implemented (provisional)**: book + star derived from the repo's own `assets/logo.svg` geometry | Not from the board; owner should confirm or replace |
| IC-14 | Toggle, dropdown chevron, progress bar, pill buttons, tiles, cards | many | Pill button, round button, progress bar: **Implemented** in code; others Missing | Drawn in code, no bitmap assets |

## 5. Typography

| ID | Item | Status | Licence / source |
|---|---|---|---|
| TY-01 | Nunito Bold 700, ExtraBold 800, Black 900 (static TTFs) | **Bundled** (`res/font/`, 125 KB each) | SIL Open Font License 1.1. Font metadata reads "Copyright 2014 The Nunito Project Authors (https://github.com/googlefonts/nunito)" and points to the SIL OFL URL (VERIFIED by decoding the font's name table). Obtained from Google Fonts' distribution endpoint; SHA-256 recorded in `../asset-register.csv`. Licence text shipped at `assets/licenses/Nunito-OFL-1.1.txt` |
| TY-02 | Poppins (named on the board) | Missing; deliberately not bundled yet | Would need its own licence check |
| TY-03 | Logo display lettering (thick outlined) | **Placeholder**: Nunito Black with a stroked outline | The board's logo face is not named |

## 6. Audio

| ID | Item | Needed for | Status |
|---|---|---|---|
| AU-01 | Letter sounds a, e, i, o, u | Screen 7, 8 | **Missing** — only word and sentence clips exist |
| AU-02 | Syllable sounds (ba, be, bi, bo …) | 9, 10 | Missing |
| AU-03 | Word clips (48) and sentence clips (24) | Web game; Android activities | Present in `assets/audio/` but provenance **UNKNOWN** (`../08-licensing-audit.md` §3); not yet copied into the app |
| AU-04 | Success / wrong / tap effects | 12, 13, 7–11 | Present (3 files, ffmpeg-tagged, source UNKNOWN); not yet in the app |
| AU-05 | Background music (Muzik toggle on screen 17) | 17 | **Missing**; any track needs a licence |
| AU-06 | Speech for UI text (optional) | — | Not specified |

## 7. What UI-01 actually ships

Original, code-drawn scenery and two simple mascot placeholders; a bundled OFL font; Material icon glyphs; an adaptive launcher icon derived from the repo's own logo geometry. **No artwork was copied or traced from the board.** The visual gap between these placeholders and the board's illustrated characters and scenery is intentional and reported in the UI-01 review.

## 8. Actions to close the manifest

| # | Action | Owner |
|---|---|---|
| V1 | Supply artwork as files (SVG preferred; PNG ≥ 3× with transparency) with a written licence, or authorise original illustration work (Q16) | Owner / Cowlick |
| V2 | Confirm who created the board and whether its characters may be redistributed | Owner |
| V3 | Provide or approve names and personalities for the three starting characters (Q3) | Owner |
| V4 | Decide the audio route: re-record with a human narrator (preferred), or document the TTS source | Owner |
| V5 | Decide whether Poppins is required in addition to Nunito | Designer |
| V6 | Decide on music (supply a licensed track or drop the toggle) (Q17) | Owner |
