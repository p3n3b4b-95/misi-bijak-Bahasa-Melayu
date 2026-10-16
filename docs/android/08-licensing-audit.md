# 08 — Audio and illustration licensing audit

**Bottom line: nothing in the repository can yet be shown to be cleared for redistribution inside an Android app.** There is no repository LICENSE file, and none of the 83 asset files has a recorded source or licence. This audit establishes facts, lists what is unknown, and sets a release gate. It is not legal advice.

Machine-readable inventory: [`asset-register.csv`](asset-register.csv) — 83 rows with SHA-256, size, technical metadata, and `UNKNOWN` placeholders for source/licence (generated from the working tree; VERIFIED).

## 1. Scope and method

- Inspected: every file under `assets/` (audio, SVG), the CSS font stack, Git history for the asset commits, embedded media tags (`strings`, `ffprobe`).
- Fetched the licence texts of candidate third-party sets directly from their upstream repositories' raw files (read-only, public) to confirm what they say. That is a deliberate, narrow exception to the "this repository only" scope and involved no other repository operations.
- Not possible: reaching the audio's original source (no record), contacting any vendor, legal review.

## 2. Repository-level facts

| Item | Finding | Status |
|---|---|---|
| `LICENSE` / `COPYING` file in repo | **None** | VERIFIED |
| Default legal position without a licence | All rights reserved by the author(s); no permission granted to others | ASSUMED (general copyright principle) |
| Authors in Git | One account, `p3n3b4b-95`, all 28 commits | VERIFIED |
| Whether any asset was machine-generated or sourced elsewhere | Not recorded anywhere | UNKNOWN |

Consequence: before publishing an APK, the owner must state the licence for code and original assets (Q6).

## 3. Audio (75 files: 48 word clips, 24 sentence clips, 3 effects)

| Fact | Evidence | Status |
|---|---|---|
| Total 964 KB; all non-empty; each of the 48 words and 24 sentences has a clip | `du`, test `audio.test.js` passes | VERIFIED |
| Word and sentence clips: MP3, mono, 24 kHz, 64 kbps, durations 0.72–1.22 s (words) and 1.68–3.02 s (sentences) | `ffprobe` over all files, recorded in the register | VERIFIED |
| Word/sentence clips carry **no tags** (no encoder, artist, or licence frame) | `strings`/`ffprobe` | VERIFIED |
| `tap.mp3`, `wrong.mp3`, `success.mp3` carry an ffmpeg encoder tag (`Lavf62`/`Lavc62`), i.e. were encoded with ffmpeg | `strings` | VERIFIED |
| Voice clips are synthetic (TTS) rather than a human recording | Uniform format and the absence of any recording metadata | ASSUMED — a *guess*, not a finding |
| The three effects are synthesised locally rather than taken from a sound library | ffmpeg tag only | ASSUMED |
| Added to the repo in commits `5bb4264` ("Add reliable audio…") and `265bc58` by the repo owner | `git log` | VERIFIED |
| Service/engine/voice used, account type, date, and its terms | Not recorded | **UNKNOWN** |

Why this matters: if the clips came from a commercial TTS or voice service, its terms may restrict redistribution inside an app, require attribution, prohibit use for certain audiences, or limit the right to keep the output after a subscription ends. If a free engine was used, the voice model's licence applies. I cannot tell which.

**Required to clear (any one):**

1. Owner statement naming the tool/service, voice, plan, date, plus a copy of the terms in force at generation time → record in the register, or
2. Re-generate with an engine whose licence is verified for embedding in distributed apps, or
3. **Preferred pedagogically and legally:** record a native Malay speaker (a teacher) reading all 48 words and 24 sentences with a written release. Remedial literacy learners benefit from a clear human voice; this also removes the TTS question. Cost: recording time; the filenames and `audioId`s already exist so replacement is drop-in.

**Fallback:** Android `TextToSpeech` with an `ms-MY` voice only when a clip is missing. System voices ship with the device; whether a voice is installed is device-dependent (UNKNOWN), so TTS is never a primary path.

## 4. Illustrations and pictures

### 4.1 What exists

| Asset | Finding | Status |
|---|---|---|
| `assets/objects/{bas,bola,buku,epal,ikan}.svg` | **1-byte empty files**; referenced nowhere | VERIFIED |
| Word pictures in the game | System **emoji** drawn by each device's own font | VERIFIED |
| `assets/logo.svg`, `favicon.svg`, `mascots.svg` | Small hand-written SVG (path data, no embedded rasters, no metadata, no third-party notices) | VERIFIED (content); authorship/human vs generated UNKNOWN |

System emoji glyphs belong to the OS vendor (Google/Apple/Samsung, …). The web game does not redistribute them, but an APK cannot rely on them either: the same code point looks different (or is a blank box) on different devices. They are **not an asset we can ship**.

### 4.2 Picture quality issues that exist regardless of licence

My judgement from the data (needs teacher review — Q9). "Render risk" is ASSUMED from Unicode/Android emoji version history.

| Word | Emoji used | Problem |
|---|---|---|
| meja (table) | 🪑 chair | Wrong object. Also Emoji 12 (older devices may show a box) |
| mop | 🧹 broom | Wrong object |
| rak (shelf) | 🗄️ filing cabinet | Wrong object |
| obor (torch) | 🗽 Statue of Liberty | Wrong object; culturally unrelated |
| zip | 🤐 face with zipper mouth | Wrong object; not the fastener |
| bom (bomb) | 💣 | Suitability for young children — policy decision |
| gam (glue), enjin (engine), sos (sauce), cat (paint), tin (can) | 🧴 ⚙️ 🫙 🎨 🥫 | Ambiguous symbols for a literacy-matching task |
| sawi, ubi, emak | 🥬 🍠 👩 | Ambiguous (leaf vegetable vs mustard greens; sweet potato vs yam; woman vs mother) |
| angsa | 🪿 | Emoji 15 — blank box before Android 14 |
| sos | 🫙 | Emoji 14 — blank box before Android 13 |

Counting each word once: 5 are the wrong object, 1 needs a suitability decision, 8 are ambiguous, and 1 more (angsa) has only a render risk — **15 of 48 words need replacement or review**. The existing test "each picture represents only one word" passes but does not test accuracy.

### 4.3 Candidate sources (texts fetched and read)

| Set | Licence as stated upstream | What it obliges | Fit | Status |
|---|---|---|---|---|
| Twemoji graphics | Creative Commons **Attribution 4.0** (`LICENSE-GRAPHICS` begins "Attribution 4.0 International") | Credit the author, link the licence, indicate changes | Permissive; one consistent style; accurate pictures for table, mop, shelf, torch, zip are still missing | Licence text VERIFIED; maintenance status of that repository UNKNOWN |
| OpenMoji | Creative Commons **Attribution-ShareAlike 4.0** (`LICENSE.txt`) | Attribution **and** ShareAlike for adaptations | ShareAlike may affect how derived art must be licensed; avoid unless Cowlick accepts it | Licence text VERIFIED |
| Noto Emoji | README: fonts under **SIL OFL 1.1**; "tools and most image resources" under **Apache 2.0**. The root `LICENSE` file I fetched contains the **OFL** text and no Apache text | Unclear which licence covers the PNG/SVG images I would bundle | Do not rely on it until the exact directory and commit's licence is confirmed | **Inconsistent upstream wording — ASSUMED/needs re-check** |
| Original illustrations (commissioned or created in-house) | Whatever the contract says; recommend a work-for-hire or an explicit licence to the project | Written agreement and signed release | Best fit with the Design Board; fixes the F5 mismatches | Not started |

Recommendation (P11): **original illustrations are the target**. If a stop-gap is needed for development builds, use a CC-BY set (Twemoji) *only* for items where it is accurate, include the attribution in S22, and mark those assets "interim" in the register. Any set will still lack accurate pictures for table, mop, shelf, torch, zip, etc.

## 5. Fonts

| Item | Finding | Status |
|---|---|---|
| Web font stack | `"Trebuchet MS", "Arial Rounded MT Bold", Arial, sans-serif` — system fonts; **not** bundled | VERIFIED |
| Android implication | These families are not on Android and are proprietary; a font must be chosen, licensed and bundled | VERIFIED (stack) / ASSUMED (not on Android) |
| Candidates whose OFL text I fetched | **Andika** (SIL Global; reserved font names "Andika" and "SIL"), **Nunito** (Nunito Project Authors) — both SIL OFL 1.1 | Licence text VERIFIED |
| OFL obligations | Ship the licence text and copyright; do not sell the font by itself; a modified font must not use reserved names | ASSUMED reading of OFL 1.1 headers — not legally reviewed |
| Choice | Must follow the Design Board; Andika is literacy-oriented (ASSUMED from its stated purpose); suitability for remedial readers is a design/pedagogy decision | UNKNOWN |

## 6. Software dependencies

Not yet selected, so not audited. Standing rules:

- Only open-source or permissively licensed libraries; each dependency and its licence recorded in a generated third-party report at build time.
- No library that requires Google Play Services, an advertising ID, or network access (gate G6). Note: Google's own `oss-licenses` plugin pulls Play Services components — pick a different licence-report tool at M0.
- Kotlin, AndroidX, Jetpack Compose: licensing believed to be Apache 2.0 (ASSUMED from general knowledge; the generated report in CI is the evidence).

## 7. Release gate (see 09, gate G9)

A release build fails unless **every** file under `android/app/src/main/{assets,res}` that is not source code appears in the asset register with:

- `source` ≠ UNKNOWN, `licence` ≠ UNKNOWN, `author_or_tool` ≠ UNKNOWN, and
- status `cleared`, plus any required attribution surfaced in S22.

Debug builds may contain `UNKNOWN` items and show a "NOT CLEARED" watermark in About. Today: **83 files, 0 cleared** (counting the 5 empty SVGs as to-be-replaced).

## 8. Actions

| # | Action | Owner | Blocks |
|---|---|---|---|
| L1 | Choose and add a repository LICENSE (code) and an assets licence statement | Owner | any distribution |
| L2 | Provide audio provenance, or commission a human recording | Owner | M4 release, M8 |
| L3 | Decide the illustration route (original vs interim set) | Cowlick/owner | M4 art |
| L4 | Teacher review of the 15 flagged pictures | Teacher | content approval |
| L5 | Choose font after the Design Board; record licence | Designer | M3 |
| L6 | Fill the asset register as sources are confirmed; replace `UNKNOWN` | Claude with owner input | G9 |
