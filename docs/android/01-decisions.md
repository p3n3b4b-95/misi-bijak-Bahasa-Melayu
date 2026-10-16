# 01 — Decision register

Status labels: **APPROVED** (Cowlick, Phase 2 handoff) · **PROVISIONAL** (my proposal, not verified, needs confirmation) · **OPEN** (question blocking or shaping work).
Evidence labels: VERIFIED / ASSUMED / UNKNOWN as in the Phase 1 report.

## A. Approved by Cowlick

| ID | Decision | Consequence recorded here |
|---|---|---|
| A1 | Kotlin + Jetpack Compose | Phase 1 §2 option A |
| A2 | Offline-only V1, **no `INTERNET` permission** | Enforced by CI gate G6; also `allowBackup=false` proposed (P6) |
| A3 | Three initial characters | `characters.schema.json` enforces exactly 3 for V1 |
| A4 | Three levels per mission | `missions.schema.json` enforces exactly 3 |
| A5 | Sequential unlock, at least one star | Rule details are ambiguous → Q1 |
| A6 | Nickname-only local profiles | No surname/class/ID fields; see P7 |
| A7 | Release tags `android-vX.Y.Z` | Distinct from any future web tag; see P8 |
| A8 | Android build verification is CI-based | Local sandbox cannot build (no SDK; `dl.google.com` blocked — VERIFIED in Phase 1) |
| A9 | Preserve existing web functionality | No web file changed in Phase 2 (git diff evidence in the report) |
| A10 | Work on `feature/android-app`, branched from the recon branch | Done: created at `fb826ce`, Phase 1 report retained |

## B. Provisional (do **not** treat as verified)

| ID | Proposal | Why provisional |
|---|---|---|
| P1 | `minSdk 24` | No device census (UNKNOWN). Must be re-decided when target devices are known |
| P2 | `compileSdk`/`targetSdk` = the level Google Play requires at release time | Current requirement not checked (UNKNOWN) |
| P3 | Manual DI (`AppContainer`), no Hilt | Preference for fewer build plugins; revisit if the graph grows |
| P4 | Room (progress) + DataStore (settings) | Standard; no conflict found |
| P5 | Level difficulty is parameter-driven (option count, picture shown, auto-voice), not disjoint word sets | The 16-word pools for `vokal`/`kv`/`kvk` cannot supply three disjoint 8-question levels (3×8=24 > 16 — VERIFIED from data). Needs pedagogy sign-off |
| P6 | `android:allowBackup="false"` and empty data-extraction rules | Default Android backup could copy child progress to a Google account. Trade-off: progress is lost on device change. Needs confirmation |
| P7 | Nickname rule: 2–20 characters, Unicode letters and single spaces only, trimmed/NFC-normalised, no digits or `@` (discourages entering phone numbers/e-mails). Max 20 profiles per device | All numbers are my guesses (UNKNOWN). Profanity filtering needs a reviewed Bahasa Melayu list that does not exist yet |
| P8 | `versionName` = tag without prefix (`android-v1.2.3` → `1.2.3`); `versionCode = major*10000 + minor*100 + patch` | Simple monotonic scheme; CI verifies tag/versionName match |
| P9 | Mission unlock default: mission *k+1* opens when mission *k* level 1 has ≥ 1 star; level *n+1* opens when level *n* has ≥ 1 star | A5 does not say whether it applies to missions, levels or both → Q1 |
| P10 | Parent gate for destructive actions = press-and-hold plus a confirm dialog | Simplest option that needs no reading/maths; accessibility of hold gesture needs a TalkBack alternative (UNKNOWN) |
| P11 | Word pictures: original illustrations are the target; an openly licensed icon set is only an interim | Licences not cleared — see 08 |
| P12 | Voice clips: replace or clear existing MP3s before release | Provenance UNKNOWN — see 08 |
| P13 | Initial achievement list (9 items in `achievements.example.json`, status `proposed`) | Needs product-owner approval |

## C. Open questions for Cowlick

| ID | Question | Blocks |
|---|---|---|
| Q1 | Does "sequential unlock with at least one star" apply to **missions**, **levels**, or both? Is the threshold on level 1 only, or must all three levels of a mission have ≥ 1 star before the next mission opens? (P9 is my default; the stricter reading means 18 rounds before mission 6.) | M6 |
| Q2 | Design Board V1 files (Figma/PDF/PNG) — not supplied in any form | 05, M3–M7 |
| Q3 | Names, appearance, and diversity of the three characters | M6 |
| Q4 | Target devices: oldest Android, RAM, phone/tablet, distribution (Play, school MDM, sideload) | P1, M8 |
| Q5 | Who owns the audio recordings, and with what terms? | 08, M4, release |
| Q6 | Which licence will the repository and its original assets carry? | 08 |
| Q7 | May I stage Pages deployment as described in 06? (changes an existing workflow; needs separate approval) | 06 |
| Q8 | Approve the privacy remediation tiers in 07 individually (T0 text-only, T1 client flag, T2 server-side) | 07 |
| Q9 | Pedagogy sign-off: curated sentence distractors, varying hidden KVK letter, level difficulty parameters (P5), replacing poor pictures | M1, M4 |
| Q10 | Who is the maintainer who will hold the release signing key, and where is it backed up? | M9 |

## D. Tool and platform versions pinned in M0 (UI-01)

Pinned in `android/gradle/libs.versions.toml` and the Gradle wrapper. "Looked up" = read from the vendor documentation page by a summarising fetch tool, not from the artifact repository itself (Google Maven was unreachable from this sandbox), so treat the vendor claims as ASSUMED until CI resolves the artifacts.

| Item | Pinned | Basis |
|---|---|---|
| Android Gradle Plugin | 8.11.1 | **Not the newest.** The vendor page lists AGP 9.4.0 as current (needs Gradle 9.6). I chose 8.11.1 (Gradle 8.14.3, JDK 17) to avoid the AGP 9 migration (built-in Kotlin, new DSL) in the foundation milestone. Revisit at M1. CI resolving it is the evidence it exists |
| Gradle | 8.14.3, wrapper with `distributionSha256Sum` (bd711022…3531, computed from the downloaded distribution) | VERIFIED locally; wrapper jar validated in CI by `setup-gradle` |
| Kotlin / Compose compiler plugin | 2.2.21 (Maven plugin metadata lists 2.2.21 and newer 2.4.x) | VERIFIED listed on the plugin portal |
| Compose BOM | 2025.10.00 | **Older than current** (vendor page shows Compose UI 1.12.x as of Oct 2026); chosen for stability with AGP 8.11 |
| compileSdk / targetSdk | 36 | Vendor page: new apps and updates must target API 36 from 2026-08-31 (ASSUMED from the summary); AGP 8.11.1 supports 36 |
| minSdk | 24 | PROVISIONAL (P1) — no device census |
| JDK | 17 (Temurin in CI) | AGP 8.x requirement |
| `applicationId` / namespace | `io.github.p3n3b495.misibijak` | **PROVISIONAL**: derived from the GitHub Pages domain with hyphens removed. Permanent once published, so the owner must confirm before any release (Q19) |
| `versionName` / `versionCode` | 0.1.0 / 100 | P8 scheme |
| Font | Nunito 700/800/900, SIL OFL 1.1 | VERIFIED licence metadata in the font files |

Additional open question: **Q19** confirm or replace the application ID.
