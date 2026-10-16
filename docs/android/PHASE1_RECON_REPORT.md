# Android App #001 — Phase 1: Recon and Implementation Plan

**Project:** Misi Bijak Bahasa Melayu — Android
**Prepared for:** Cowlick architecture review
**Phase:** 1 of N (recon and plan only; no application code written)
**Branch:** `claude/misi-bijak-android-recon-h4okhm` (docs only)
**Repo state inspected:** `main` @ `90cf5f3` "Add daily score view and PDF export"

Evidence labels used throughout:

- **VERIFIED** — observed directly in this session (file read, command run, API response).
- **ASSUMED** — reasoned from general knowledge or convention; not confirmed here.
- **UNKNOWN** — cannot be determined from what I have; needs an answer or a check.

---

## 0. Executive summary

1. **The five approved design modules are not available to me.** The repo, GitHub issues and PRs contain no Design Board V1 files, and none were attached to this session. Everything in §4–§5 about visuals is derived from the module *names* plus the existing web game. This is the largest blocker for Phase 2. (UNKNOWN)
2. **Recommendation: native Kotlin + Jetpack Compose**, not a WebView wrapper. Three of the five modules (character selection, adventure map, achievements/profile) do not exist in the web game at all, so a WebView would save little UI work, while native gives better TalkBack support, reliable audio, reliable storage, and no emoji-font breakage on older devices. Full tradeoffs in §2.
3. **The existing web app already sends student name, class and scores to a third-party backend (Supabase).** This contradicts the README's privacy statement and conflicts with the Android brief's "no accounts / no analytics" intent. The Android app should ship with **no `INTERNET` permission in v1**. Cowlick decision needed (D1).
4. **Pictures in the web game are system emoji; the "object illustration" SVGs in the repo are empty 1-byte files.** There are no usable illustration assets for the 48 vocabulary words. (VERIFIED)
5. **I cannot build or test an APK in this sandbox.** No Android SDK is installed and `dl.google.com` is blocked by the network policy. No Android build or test result exists or is claimed. (VERIFIED)
6. **The web app is safe so far.** I changed nothing under the web paths. Existing `npm test`: 13/13 pass. (VERIFIED)
7. **Two things in the existing repo would interact badly with Android work** and need a decision: the Pages workflow publishes the whole repo root (so `android/` would be published to the public site), and the repo has no LICENSE file. See §1.5 and D4/D5.

---

## 1. Repository reconnaissance

### 1.1 Git state

| Item | Finding | Status |
|---|---|---|
| Remote | `origin` → `github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu` | VERIFIED |
| Branches (local) | `main`, `claude/misi-bijak-android-recon-h4okhm` both at `90cf5f3` | VERIFIED |
| Branches (GitHub API) | Only `main` listed; the feature branch is not yet visible server-side | VERIFIED |
| Tags | None (local and GitHub) | VERIFIED |
| Releases | None | VERIFIED |
| Open/closed issues | 0 | VERIFIED |
| Pull requests | 0 | VERIFIED |
| Commits | 28, one author (`p3n3b4b-95`) | VERIFIED |
| Repo size | ~1.2 MB, 106 tracked files | VERIFIED |
| LICENSE file | **None** | VERIFIED |
| Pages deploys | Run #27 on `main` succeeded (2026-10-13) | VERIFIED |

`MAINTENANCE.md` recommends `vX.Y.Z` tags, but none exist. The Android release tag scheme must not collide with a future web tag scheme (see D6).

### 1.2 Existing web game

Plain HTML/CSS/JS, no build step, no dependencies. (VERIFIED)

| File | Role | Lines |
|---|---|---|
| `index.html` | Single page: home, game, result, reset dialog | 108 |
| `js/questions.js` | Word bank (48), sentence bank (24), 6 mission definitions | 92 |
| `js/core.js` | Pure logic: shuffle, option generation, round building, ranks, stars. UMD, Node-testable | 113 |
| `js/app.js` | DOM, audio, `localStorage`, Supabase sync | 378 |
| `js/supabase-config.js` | Supabase URL + publishable key | 4 |
| `teacher.html`, `js/teacher.js`, `css/teacher.css` | Teacher dashboard (login, class list, results table, print-to-PDF) | — |
| `supabase/migrations/*.sql` | 5 migrations (results, teachers, classes) | — |
| `css/styles.css` | Responsive styles, 2 breakpoints (820px, 560px), reduced-motion handled | 206 |

**Content (VERIFIED):** 16 vokal + 16 KV + 16 KVK words = 48 words; 24 sentence items. Six missions: `vokal`, `kv`, `kvk`, `padan`, `susun`, `ayat`. Each round = 8 questions, 10 points each, max 80.

**Game rules (VERIFIED, `core.js`):**
- Stars per round: ratio ≥ 0.875 → 3, ≥ 0.625 → 2, ≥ 0.375 → 1, else 0.
- Ranks by cumulative points: 0 "Tunas Bahasa", 80 "Bintang Bahasa", 240 "Jaguh Membaca", 480 "Wira Bahasa".
- A new round avoids the words from the previous round for that mission.
- `progress.stars` in code is actually **cumulative points**, while the per-round "stars" are 0–3. The UI uses "bintang" for both. Android must name these distinctly (see §3.4).

**Persistence (VERIFIED):** `localStorage` key `misiBijakBM.v1` holds `{stars, best{}, recent{}, name, className, sound}`; `misiBijakBM.pendingResults` holds an outbox for Supabase.

**Not present in the web game (VERIFIED):** splash screen, character selection, adventure map, levels within a mission, achievements/badges, multiple student profiles, settings beyond a sound toggle, any service worker or PWA manifest (so the web game is *not* offline-capable on first load, only cache-dependent).

### 1.3 Tests

- `npm test` → `node --test tests/*.test.js`. **Result in this session: 13 tests, 13 pass, 0 fail** (Node 22.22.0). (VERIFIED)
- Coverage: option uniqueness, each mode builds a valid question, 8 unique questions per live mission, next-round avoidance, one emoji per word, no duplicate sentences, rank/star thresholds, sync retry logic, dashboard de-duplication, and that every word/sentence has a bundled MP3.
- Not covered: DOM/UI, `localStorage` handling, accessibility, answer-ambiguity in sentences (see 1.6).
- `TESTING.md` is a manual checklist in Bahasa Melayu.

### 1.4 Assets

| Asset | Finding | Status |
|---|---|---|
| `assets/audio/*.mp3` | 75 files, 964 KB total. 48 word clips + 24 sentence clips (`ayat-*.mp3`) + `tap`, `wrong`, `success`. Mono, 64 kbps / 24 kHz — sounds like synthetic TTS. A test confirms full coverage. | VERIFIED |
| Audio provenance and licence | Not documented anywhere | UNKNOWN |
| `assets/logo.svg`, `favicon.svg`, `mascots.svg` | Small hand-written SVGs (two children reading on an island). Authorship/licence not documented; appear to be project-original | ASSUMED |
| `assets/objects/{bas,bola,buku,epal,ikan}.svg` | **Each file is 1 byte (empty).** Not referenced anywhere in HTML/JS/CSS | VERIFIED |
| Word pictures | System **emoji** rendered by the device font | VERIFIED |

### 1.5 Workflows

`.github/workflows/deploy-pages.yml` (VERIFIED):
- Triggers on `push` to `main` and manual dispatch only — **not** on PRs or feature branches. Pushing the feature branch will not deploy.
- Runs `npm test`, then uploads **the whole repository root** (`path: .`) to GitHub Pages.
  - Consequence: anything under `android/`, `docs/`, or `supabase/` will be published to the public site once merged. (The upload action normally skips hidden folders such as `.git` and `.github` — ASSUMED.)
  - I tried to probe the live site (e.g. `/supabase/migrations/...`), but the sandbox proxy blocked `github.io`, so I could not confirm what is actually served. (UNKNOWN)
- There is no PR-time CI, no lint, no Android job, no dependency or secret scanning.

### 1.6 Findings that affect the Android plan

| # | Finding | Status |
|---|---|---|
| F1 | Web app POSTs `student_name`, `class_name`, `mission_id`, score and stars to `ipuukoeqhuzefbimjtwg.supabase.co` after every round (`js/app.js` `flushResults`), and fetches a class list from it. README says "tidak menghantar data ke server" — **that statement is inaccurate for the current code.** | VERIFIED |
| F2 | Insert policy on `results` is `with check (true)` for `anon`: anyone with the publishable key can insert arbitrary rows (forged or spam scores). The key itself is designed to be public. | VERIFIED (policy text); impact ASSUMED |
| F3 | A teacher's personal e-mail address is hard-coded in two committed migrations and in the `is_teacher()` SQL function in a public repo. | VERIFIED |
| F4 | White text on the primary pink `#ff759f` has contrast **2.53:1**; on red `#ed607d` 3.20:1; on green `#32ae74` 2.82:1; muted grey `#667b90` on white 4.37:1. All below WCAG AA 4.5:1 for normal text. Ink `#27415f` on white is 10.46:1 (fine). | VERIFIED (computed) |
| F5 | Several emoji are poor or wrong teaching pictures: "meja" (table) → 🪑 chair; "obor" (torch) → 🗽 Statue of Liberty; "rak" (shelf) → 🗄️ filing cabinet; "zip" → 🤐 zipper-mouth face; "bom" → 💣; "gam" → 🧴 lotion bottle. | VERIFIED (data), judgement mine |
| F6 | Newer emoji will show as blank boxes on older Android: 🪿 angsa (Emoji 15, Android 14+), 🫙 sos (Emoji 14, Android 13+), 🪑 meja (Emoji 12). Many school devices are older. | ASSUMED (Unicode/Android version mapping from general knowledge) |
| F7 | Sentence distractors are drawn from the whole word bank, so more than one answer can be valid: e.g. "Saya minum ____." (jus) can offer "susu"; "Saya memakai ____." (baju) can offer "topi". For remedial learners this is unfair. | VERIFIED (code path `core.js` `ayat`); frequency UNKNOWN |
| F8 | KVK questions always hide the 2nd letter (`missingIndex = 1`), so the pattern is predictable. | VERIFIED |
| F9 | Reduced-motion is respected in CSS; focus ring, skip link and `aria-live` feedback exist. No TalkBack testing is documented. | VERIFIED / UNKNOWN |
| F10 | The reset action needs only one confirm tap; a young child can wipe progress. | VERIFIED |

---

## 2. Technology recommendation: Kotlin/Compose vs WebView

### 2.1 Options

| | A. Native Kotlin + Compose | B. WebView wrapper (bundle current site as assets) | C. Capacitor / TWA |
|---|---|---|---|
| Reuse of existing code | Re-implement ~113 lines of logic and the content bank; share content via JSON | ~100% reuse | ~100% reuse |
| New modules (splash, characters, map, levels, achievements, profile) | Built natively | Must still be designed and built in HTML/CSS/JS | Same as B |
| Offline | Native: always | Works if all files are bundled and loaded via `WebViewAssetLoader` | TWA needs a service worker (none today); Capacitor bundles like B |
| Accessibility / TalkBack | Compose semantics, font scale, 48dp targets, focus order under our control | ARIA works but is less predictable in WebView; page zoom vs system font scale differs | Same as B |
| Audio | `SoundPool`/`MediaPlayer`, reliable low latency, no autoplay limits | HTMLAudio has autoplay/gesture restrictions; 3 `new AudioContext()` per tone in current code | Same as B |
| Local storage | Room/DataStore, survives cache clears | `localStorage` may be cleared by "clear cache/storage" and is tied to a single origin string | Same as B |
| Emoji pictures | Bundle our own images → identical on every device | Depends on device emoji font (F6) | Same as B |
| Multi-profile on shared tablets | First-class | Possible but more state plumbing in JS | Same as B |
| Risk to web app | None if content is exported read-only | None if web files are copied, but two diverging copies | Higher: couples to web build |
| Effort | Highest | Lowest for a first APK | Medium |
| Play Store acceptability | Good | Acceptable, but "web wrapper" apps get more scrutiny | Good |
| Long-term maintenance | One Kotlin codebase + content JSON | Web copy drift | Web build dependency |

### 2.2 Recommendation

**Choose A (native Kotlin + Jetpack Compose).** Reasons:

1. The approved design adds six screens' worth of new interaction (character pick, map, level select, rewards, profile, achievements). That UI must be built either way; Compose is not materially more work than building it in HTML/CSS.
2. The target users are remedial primary-school children on likely older, low-end, shared devices. Native gives dependable audio, storage, TalkBack behaviour, and removes the emoji-font risk.
3. The logic that must be ported is tiny and already pure (`core.js`), with existing tests that can be ported as golden tests.
4. The web game stays untouched and keeps deploying to Pages.

**What option B would be good for:** a fast throw-away APK to put the *current* game on a tablet. It does not deliver the approved design. I recommend against it as the product path, but it is a valid stop-gap if Cowlick wants something installable before Phase 3 completes.

**Honest cost of A:** two implementations of question generation can drift. Mitigation (proposal P1): treat content as data. A read-only export script produces `content/*.json` from `js/questions.js`; the Android app reads that JSON; a CI check fails if the JSON is out of date. The web app is not modified.

---

## 3. Android architecture proposal

### 3.1 Principles

- **Offline-only v1.** No `INTERNET` permission, no network libraries, no analytics/ads SDKs, no Google Play Services dependency. CI asserts this (§7).
- **Pure domain logic** with seedable randomness, unit-testable on the JVM.
- **Content is data**, versioned, with a validation test.
- **Single Gradle module** to start (`app`), package-by-feature, to keep build simple. Split into modules only if build time or ownership demands.
- Library choices below are **proposals**; exact versions to be pinned at M0 against then-current stable releases. I did not check current versions (UNKNOWN).

### 3.2 Stack (proposed)

| Concern | Choice | Why |
|---|---|---|
| Language/UI | Kotlin, Jetpack Compose, Material 3 as base (custom theme) | Standard, accessible |
| Navigation | Navigation Compose with typed routes | Simple graph |
| State | `ViewModel` + `StateFlow`, unidirectional state | Testable |
| Persistence | Room (profiles, progress, attempts, achievements); DataStore (settings) | Reliable local storage |
| DI | Manual `AppContainer` (no Hilt/Dagger) | Fewer build plugins, smaller APK, enough for this size |
| Audio | `SoundPool` for SFX; `MediaPlayer` for voice clips; Android `TextToSpeech` (`ms-MY`) as fallback | Reuse the 75 MP3s; TTS fallback only if voice data exists |
| Images | Bundled vector drawables / WebP; no image-loading library | Offline, small |
| Min SDK | **24** (Android 7.0) proposed | ASSUMED; needs device census (D7) |
| Target/compile SDK | The level Play requires at release time | UNKNOWN until checked |
| Build | Gradle wrapper, version catalog, R8 minify on release | Standard |
| Quality | Android Lint, ktlint or detekt (pick one at M0), JUnit5/JUnit4, Compose UI tests, screenshot tests | See §7 |

### 3.3 Package layout

```text
android/
  app/src/main/
    java/my/misibijak/
      MisiBijakApp.kt              Application + AppContainer
      MainActivity.kt              Single activity, edge-to-edge, hosts NavHost
      navigation/                  Routes, NavHost, back-stack rules
      ui/theme/                    Color, Type, Shape, Dimens, high-contrast tokens
      ui/components/               BigButton, StarRow, AnswerTile, ProgressBar, Mascot, ConfirmDialog, ParentGate
      feature/splash/
      feature/menu/
      feature/profile/             Create/select profile, character selection
      feature/map/                 Adventure map
      feature/levels/              Level selection
      feature/activity/            ActivityScaffold + 6 activity screens
      feature/feedback/            Correct/incorrect overlay, round result, reward
      feature/achievements/
      feature/settings/
      domain/                      QuestionGenerator, Scoring, Ranks, AchievementRules (pure Kotlin)
      data/db/                     Room entities, DAOs, database
      data/settings/               DataStore
      data/content/                ContentRepository, JSON models, validator
      audio/                       AudioController (SFX, voice, TTS fallback)
    res/values/strings.xml         Bahasa Melayu (default locale)
    assets/content/                words.json, sentences.json, missions.json
    assets/audio/                  copied from web assets (see D8)
  gradle/libs.versions.toml
tools/
  export-content.js                Reads js/questions.js, writes content JSON; `--check` mode for CI
```

All student-facing strings live in `strings.xml` with `ms` as the default (no English fallback shown to children). English appears only in docs and developer UI.

### 3.4 Domain model

Terminology (resolves the web app's overloaded "bintang"):
- **Mata** (points): 10 per correct answer; cumulative total drives **Tahap** (rank).
- **Bintang** (stars): 0–3 per completed level, from the ratio rule in §1.2.
- **Lencana** (badges): achievements.

Entities (Room):

| Entity | Fields |
|---|---|
| `StudentProfile` | `id` (UUID), `displayName` (≤30), `characterId`, `createdAt`, `lastPlayedAt` |
| `LevelProgress` | `profileId`, `missionId`, `levelIndex`, `bestScore`, `bestStars`, `attempts`, `unlockedAt`, `completedAt?` |
| `Attempt` | `id` (UUID), `profileId`, `missionId`, `levelIndex`, `score`, `total`, `stars`, `startedAt`, `durationMs` |
| `AchievementUnlock` | `profileId`, `achievementId`, `unlockedAt` |
| `RecentWord` | `profileId`, `missionId`, `word`, `roundId` (replaces web `recent{}`) |

Settings (DataStore, device-wide): `soundEffects`, `voice`, `music` (off by default; no music asset exists), `reducedMotion`, `haptics`, `lastProfileId`, `parentGateEnabled`.

Content (JSON, bundled, schema-validated in tests):

```text
Word        { id, text, type: vokal|kv|kvk, imageId, audioId, sentence }
Sentence    { id, text_with_blank, answer, imageId, audioId, acceptableAnswers[], distractors[] }
Mission     { id, titleKey, descriptionKey, iconId, tone, levelCount }
Level       { missionId, index, questionCount, wordIds | selection rule, requiredStars }
Achievement { id, titleKey, descriptionKey, iconId, rule }
```

`Sentence.distractors` is **curated** (not random from the word bank) to fix F7. `Word.imageId` points at bundled art, replacing emoji (F5, F6).

### 3.5 Question engine

Port `core.js` to Kotlin as `QuestionGenerator(random: Random)`. Six generators: vowel, KV, KVK (vary `missingIndex` — fixes F8, subject to content owner approval), image match, letter arrangement, sentence completion. Golden tests: with a fixed seed, option sets are unique, contain exactly one correct answer, and rounds never repeat a word.

### 3.6 Navigation graph

```text
Splash ──► MainMenu ──┬─► ProfileSelect ──► (new) CharacterSelect ──► ProfileSelect
                      │         │
                      │         └─► AdventureMap ──► LevelSelect(mission) ──► Activity(mission, level)
                      │                                                           │
                      │                                         ┌─────────────────┘
                      │                                         ▼
                      │                              Feedback overlay (per answer)
                      │                                         ▼
                      │                                RoundResult ──► Reward (if new badge/rank)
                      │                                         ▼
                      │                         back to LevelSelect (or replay level)
                      ├─► StudentProfile ──► Achievements
                      └─► Settings ──► (parent gate) ──► Reset progress / About & Licences
```

Back-stack rules: Android Back inside an activity opens a "Keluar dari misi?" confirm (no silent loss); on MainMenu Back exits; Splash is removed from the back stack.

---

## 4. Screen-by-screen implementation specification

Because Design Board V1 is unavailable, layout, art and exact copy below are **placeholders to be reconciled with the board**. Behaviour, states and accessibility rules are binding proposals.

**Global rules for every screen**
- Touch targets ≥ 48×48 dp; primary actions and answer tiles ≥ 64 dp tall; ≥ 8 dp between targets.
- Text contrast ≥ 4.5:1 (large text ≥ 3:1); the web palette's pink/green/red as white-text backgrounds fails (F4) and needs darker tokens or dark text.
- Usable at system font scale up to 200% without clipped text or lost buttons.
- Layouts: phone portrait (360×640 dp), phone landscape, 7–10" tablet (≥ 600 dp, two-pane or centred max-width). No fixed pixel sizes.
- Every non-text element has a Bahasa Melayu `contentDescription`, or is marked decorative.
- Meaning never conveyed by colour alone (correct/incorrect also show icon + text).
- Honour system animation-scale and the in-app reduced-motion setting.
- No external links, no network calls, no ads, no analytics.

### Module 1 — Splash screen and Main menu

| Screen | Content | Behaviour | States |
|---|---|---|---|
| **Splash** | Logo, title "Misi Bijak Bahasa Melayu", mascots | Shows ≤ 1.5 s while `ContentRepository` and DB initialise; use Android 12 SplashScreen API for the system splash and a Compose branded screen after; auto-advance; no "tap to skip" required | Init failure → friendly retry screen (BM) |
| **MainMenu** | Large buttons: **Mula Bermain**, **Profil Saya**, **Pencapaian**, **Tetapan**; sound toggle | Mula Bermain → ProfileSelect if no active profile, else AdventureMap | No profile yet; content-load error |

A11y: heading semantics on title; buttons announce purpose; focus starts at the first button.

### Module 2 — Character selection and Adventure map

| Screen | Content | Behaviour | States |
|---|---|---|---|
| **ProfileSelect** | List of local profiles (avatar + name), "Murid baharu" button | Selecting sets `lastProfileId`. Needed because school tablets are shared and there are no accounts | Empty (first launch) shows only "Murid baharu" |
| **CharacterSelect** | N characters (count UNKNOWN — D2), name input (≤30, trimmed) | Name is required; stored locally only; no class field in v1 (see D1) | Empty name error; duplicate name allowed with warning |
| **AdventureMap** | Scrollable map with the six missions as locations in a fixed order; per-location stars; locked/unlocked/completed states; current character avatar | Tapping unlocked location → LevelSelect. Unlock rule proposed: mission 1 open; each next mission opens after ≥ 1 star on any level of the previous one (D3) | Locked tap → gentle spoken/visible hint, not an error |

A11y: map must be reachable without drag gestures — provide a list-like traversal order for TalkBack ("Misi 2, Suku Kata KV, terkunci / dibuka, 2 daripada 3 bintang").

### Module 3 — Level selection and Learning activities

| Screen | Content | Behaviour |
|---|---|---|
| **LevelSelect(mission)** | Mission title + icon, level tiles 1…N with 0–3 stars, best score | Level k+1 unlocks when level k has ≥ 1 star (D3). Level count per mission is UNKNOWN (D2); web has effectively one level of 8 questions |
| **ActivityScaffold** | Top: back/exit, progress bar (`n / total`), points; middle: question + picture; bottom: answer area; "🔊 Dengar" and "Seterusnya" | Shared by all six; handles lock-after-answer, listen button, progress, back-confirm |
| **Vokal** | "Huruf vokal pertama dalam «word» ialah…", picture, options a/e/i/o/u | Spoken word on tap of Dengar; single choice |
| **KV** | Pick the first syllable among 4 | Distractors from a curated syllable list |
| **KVK** | Word with one letter hidden; 4 letter options | Hidden position varies (F8) once approved |
| **Padan Gambar** | Word shown; 4 pictures to choose from | Pictures are bundled art (F5/F6); each image has a BM `contentDescription` that does **not** reveal the answer to TalkBack users (use "gambar 1…4" + play-word audio) |
| **Susun Huruf** | Shuffled letter tiles → slots; Cuba semula / Semak | Tap-to-place (no drag required); tiles ≥ 64 dp; announce placed letters |
| **Ayat Mudah** | Sentence with blank; 4 word options | Curated distractors with exactly one acceptable answer (F7) |

Audio: word/sentence MP3 from bundle; fallback to `TextToSpeech` `ms-MY` if file missing and engine has the voice; otherwise a visible "Audio tidak tersedia" message (never a silent failure).

### Module 4 — Correct/incorrect feedback, stars and rewards

| Screen | Behaviour |
|---|---|
| **Feedback overlay** | Correct: positive icon + "Hebat! Jawapan kamu betul!" + success sound + brief confetti (skipped under reduced motion). Incorrect: encouraging icon + "Hampir! Jawapan betul ialah «x»." + soft sound; no red-only signalling; never punitive. Text announced via live region |
| **RoundResult** | Score `n / total mata`, 0–3 animated stars (static under reduced motion), message by star band, buttons **Main lagi** / **Pilih tahap** / next level if unlocked. Writes `Attempt` + updates `LevelProgress` in one transaction |
| **Reward** | Shown only when a new badge or rank was earned: big badge art, name, short BM message, **Teruskan**. Queue multiple rewards one at a time |

Scoring: unchanged from web (10 per correct; star thresholds §1.2) so web and Android results are comparable.

### Module 5 — Student profile, Achievements and Settings

| Screen | Content | Behaviour |
|---|---|---|
| **StudentProfile** | Avatar/character, name, Tahap (rank + progress to next), total mata, total bintang, per-mission summary | Rename and change character allowed; no sensitive data |
| **Achievements** | Grid of badges, earned vs locked (locked shown with hint, not hidden) | Initial set proposed: first round finished; first 3-star; one mission fully 3-star; 5/10 rounds played; each rank reached. Final list needs product owner (D2) |
| **Settings** | Sound effects, voice, reduced motion, haptics; About (version, licences, privacy statement "Tiada data dihantar keluar peranti"); **Padam kemajuan** | Destructive actions sit behind a simple parent gate (e.g., hold-to-confirm or a short arithmetic prompt) plus a confirm dialog (fixes F10). No account, login, or network settings |

Privacy statement text must be accurate for the Android app only; it does not describe the web app.

---

## 5. Missing design assets and unresolved requirements

### 5.1 Missing assets

| Need | Notes | Status |
|---|---|---|
| Design Board V1 for all 5 modules | Frames, spacing, typography, colour tokens, copy | UNKNOWN / not supplied |
| Character set | Count, names, poses (idle, happy, encouraging) | UNKNOWN |
| Splash art, app icon (adaptive + monochrome), launcher assets | Existing `logo.svg` / `favicon.svg` may be adaptable | ASSUMED |
| Adventure map art and location icons | None exist | VERIFIED |
| 48 word illustrations + sentence images | `assets/objects/*.svg` are empty; emoji are inadequate (F5/F6) | VERIFIED |
| Badge/achievement art, star art, reward art | None | VERIFIED |
| UI sound effects and optional music | Only `tap`, `wrong`, `success` exist; origin unknown | UNKNOWN |
| Font | Need a bundled, clearly licensed, literacy-friendly font (a rounded or literacy-oriented family with an open licence such as SIL OFL is a candidate; licence to be verified at selection) | UNKNOWN |

**Licensing options for word pictures** (proposal, licence terms to be re-verified before use):
1. Bundle an openly licensed emoji/icon set rendered as images so all devices match (e.g., a permissively licensed set). Fast, but art style may not match Design Board.
2. Commission or create original illustrations in the Design Board style. Best fit, slowest.
3. Avoid share-alike sets unless Cowlick accepts the obligations.
Interim recommendation: option 1 for M3–M4, option 2 swapped in later, with the 6 poor pictures in F5 replaced first.

### 5.2 Unresolved requirements (need an answer before or during M0)

| ID | Question |
|---|---|
| D1 | Should Android ever sync scores to teachers? If yes, who is the data controller, what consent applies to children's names, and is Supabase acceptable? Recommendation: **no network in v1**; add local export (CSV/print via share sheet) later. |
| D2 | How many characters, levels per mission, and which achievements are in scope? Web has 1 level/mission. |
| D3 | Unlock rules for missions and levels (my proposal in §4: sequential, ≥ 1 star). |
| D4 | OK to change `deploy-pages.yml` so Pages publishes only web files (not `android/`, `docs/`, `supabase/`)? Or accept publishing everything? |
| D5 | Which licence should the repo carry (none today)? Affects asset and font choices. |
| D6 | Release tag scheme: e.g. `android-v1.0.0` vs shared `v1.0.0`. |
| D7 | Target devices: oldest Android version, RAM, tablets vs phones, school MDM vs Play Store vs sideload. Drives min SDK, APK vs AAB, and update path. |
| D8 | Provenance/licence of the 75 audio files; may they be redistributed inside an APK? Can a recording be commissioned? |
| D9 | Pedagogy sign-off: approve fixing sentence ambiguity (F7), varying the KVK hidden letter (F8), and replacing poor pictures (F5). |
| D10 | Do students enter a full name or a nickname? Recommend nickname/first name only, stored on-device. |

---

## 6. Development milestones

Sizes are relative effort (S/M/L), not calendar estimates; I have no velocity data.

| M | Name | Scope | Exit criteria | Size |
|---|---|---|---|---|
| M0 | Foundation | Create `android/` project, Gradle wrapper, version catalog, theme tokens, CI skeleton, content export script + `--check`, manifest permission check | CI green on a hello-screen debug build; **actual** CI run linked; no INTERNET permission | M |
| M1 | Content + domain | Content JSON + validator; `QuestionGenerator`, scoring, ranks ported; golden tests | Unit tests pass; parity vs web counts (16/16/16 words, 24 sentences, 8-question rounds) | M |
| M2 | Data layer | Room, DataStore, repositories, migrations test | Instrumented/Robolectric tests pass; progress survives process death | M |
| M3 | Module 1 + shell | Splash, MainMenu, navigation, settings skeleton | UI tests; TalkBack walkthrough notes | S |
| M4 | Module 3 (activities) | Scaffold + six activities, audio controller | All six playable offline; audio fallback tested | L |
| M5 | Module 4 | Feedback overlay, result, reward | Star/score rules match web tests | M |
| M6 | Module 2 | Profiles, character select, adventure map, level select, unlocks | Multi-profile isolation tests | M |
| M7 | Module 5 | Profile, achievements, settings, parent gate, reset | Reset verified; accessibility checks pass | M |
| M8 | Hardening | Accessibility audit, font-scale/landscape/tablet screenshots, low-end device pass, APK size/perf, licence audit | Acceptance criteria §8 all evidenced | M |
| M9 | Closure | README, English operator runbook, troubleshooting, test report, release notes, signed-release procedure | Documents reviewed; release candidate artifact built by CI; **no publication without approval** | S |

Order rationale: M1/M2 are risk-free and fully unit-testable in CI; activities (M4) before map (M6) because the map is a thin shell around levels.

---

## 7. Proposed GitHub Actions

None of these exist yet; nothing below has been run.

| Workflow | Trigger | Jobs |
|---|---|---|
| `web-ci.yml` (new, additive) | PR, push to feature branches | `npm test` (Node 22). Closes the gap that tests only run on `main` |
| `android-ci.yml` | PR and push touching `android/**`, `tools/**`, `content/**`, workflow file | Gradle wrapper validation → `lintDebug` → `testDebugUnitTest` → `assembleDebug` → upload debug APK + test/lint reports; **manifest check** fails if merged manifest contains `INTERNET`/`ACCESS_NETWORK_STATE` or any analytics/ads dependency is present (allow-list of dependencies); `tools/export-content.js --check` |
| `android-instrumented.yml` | Nightly + manual | Emulator run of Compose UI + Room tests on an API level matrix. Slow, so not on every PR |
| `android-release.yml` | Manual or tag `android-v*` | Runs inside a GitHub **environment with required reviewer**. Builds a signed AAB/APK from keystore stored in repo/environment **secrets**; creates a **draft** release only; never auto-publishes |
| `dependabot.yml` | Weekly | Gradle and GitHub Actions updates |

Practices: third-party actions pinned to full commit SHAs; `permissions: contents: read` by default; no secrets on PRs from forks; Gradle caching via the official Gradle action; secret scanning enabled on the repo; keystore, `local.properties`, and `*.jks` listed in `.gitignore` before any Android file is committed.

**Interaction with the existing deploy workflow:** merging to `main` will redeploy Pages and (today) publish `android/`. Proposal: add a staging step so Pages publishes only `index.html`, `teacher.html`, `css/`, `js/`, `assets/` (D4). This changes an existing workflow, so I will not touch it without approval.

**Sandbox limitation:** `dl.google.com` is blocked here (HTTP 403 via the proxy), so the Android SDK cannot be installed and **no local Android build is possible**. `maven.google.com` and `plugins.gradle.org` returned 200. Either allow `dl.google.com` in the environment's network settings, or rely on GitHub-hosted runners for all Android verification. I recommend both.

Test strategy summary:
- JVM unit tests: generator, scoring, ranks, achievement rules, content validator.
- Room tests: DAOs, transactions, migrations.
- Compose UI tests: navigation, state, semantics.
- Screenshot tests: 360 dp, 600 dp, landscape, font scale 1.0 and 2.0.
- Accessibility: automated checks plus a written TalkBack script run on a real device.
- Offline: airplane-mode run; manifest-permission test.
- Manual device matrix per D7.

---

## 8. Risks and acceptance criteria

### 8.1 Risks

| # | Risk | Impact | Mitigation |
|---|---|---|---|
| R1 | Design Board not available / not matching assumptions | Rework of M3–M7 | Obtain board before M3; keep UI behind shared components |
| R2 | Children's data handling (names, class, scores) — current web sync | Compliance and trust | No network in v1 (D1); nickname-only (D10); privacy review by project owner. I am not giving a legal opinion |
| R3 | Cannot verify builds locally | Unverified claims | CI as the only source of build truth; allow `dl.google.com`; report CI run links, never assumptions |
| R4 | Audio/art/font licensing unclear | Cannot ship | Asset register with source + licence per file; block release on unknown licences (D5, D8) |
| R5 | Emoji/art mismatch across devices | Blank or wrong pictures | Bundled images; replace F5 items |
| R6 | Pedagogical defects carried over (F7, F8) | Frustrates remedial learners | Curated distractors; teacher/content review (D9) |
| R7 | Content drift between web and Android | Inconsistent teaching | Single exported content JSON + CI parity check |
| R8 | Low-end device performance, APK size | Poor experience | Vector/WebP art, R8, size budget, test on a low-RAM device |
| R9 | Pages publishes `android/` and other non-web folders | Information exposure | D4 staging step |
| R10 | Signing key handling | Compromise / lost update path | Secrets only; environment approval; backup procedure in runbook |
| R11 | Accessibility regressions (contrast, font scale) | Excludes learners | Tokenised palette checked in CI; screenshot tests at 200% |
| R12 | Scope creep into teacher dashboard/sync | Delay | Explicitly out of v1 |

### 8.2 Acceptance criteria (testable)

**Global**
- AC-G1: App installs and every feature works with network off; merged manifest has no `INTERNET` permission. *Evidence: CI manifest check + airplane-mode run.*
- AC-G2: No ads or analytics libraries. *Evidence: dependency allow-list check.*
- AC-G3: All student-facing text is Bahasa Melayu. *Evidence: string-resource review; no hard-coded UI strings (lint rule).*
- AC-G4: Progress persists across app restart and process death for each profile; profiles are isolated. *Evidence: Room tests.*
- AC-G5: No account/login anywhere. *Evidence: navigation graph review.*
- AC-G6: Touch targets ≥ 48 dp; text contrast meets AA; layouts hold at 200% font scale on 360 dp width. *Evidence: automated checks + screenshots.*
- AC-G7: Existing web app unchanged and `npm test` still 13/13 (or more) passing. *Evidence: CI.*
- AC-G8: No secrets, keystores, or credentials in the repo. *Evidence: secret scan.*
- AC-G9: Every bundled asset has a recorded source and licence. *Evidence: asset register.*

**Per module**
- AC-1: Splash→Menu works; each menu item reaches its screen; Back behaves per §3.6.
- AC-2: A profile with a character can be created, selected, renamed; map shows correct locked/unlocked/star states; map is operable via TalkBack without gestures.
- AC-3: All six activity types are playable; each round has the specified question count with no repeated word; option sets contain exactly one correct answer; voice playback works offline for all 48 words and 24 sentences.
- AC-4: Feedback text matches §4; scoring and star thresholds identical to `core.js` for equal inputs; rewards appear once per earned badge/rank.
- AC-5: Profile shows accurate totals; achievements unlock per rules; destructive reset requires parent gate + confirmation and wipes only the chosen scope.

**Evidence rule:** a criterion is "met" only when a CI run, test report or recorded manual check is linked in the closure report. Anything else stays ASSUMED.

---

## 9. Decisions requested from Cowlick

1. **Approve native Kotlin + Compose** (§2.2), or choose the WebView stop-gap.
2. **D1:** confirm Android v1 has no network/teacher sync.
3. **Provide Design Board V1** and answer D2/D3/D10.
4. **D4/D5/D6:** Pages staging change, licence, tag scheme.
5. **D7/D8/D9:** target devices, audio provenance, pedagogy sign-off.
6. Allow `dl.google.com` for this environment, or confirm CI-only verification.
7. Confirm the Android implementation branch name. I propose continuing on `claude/misi-bijak-android-recon-h4okhm` for Phase 2 unless you want a separate `feature/android-app`; I have not created or pushed any other branch.

## 10. What was and was not done in this phase

- **Done:** read all source, docs, tests, workflows, migrations and asset metadata; ran `npm test`; queried GitHub for branches, tags, releases, issues, PRs and workflow runs; computed palette contrast; probed toolchain and network.
- **Not done (by design):** no application code, no Gradle project, no workflow files, no changes to web files, no push to `main`, no release, no PR.
- **Not possible here:** installing the Android SDK or running any Android build/test; reaching `github.io` to inspect the live site.
