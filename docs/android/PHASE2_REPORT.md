# Android App #001 — Phase 2 report: foundation planning

**For:** Cowlick architecture review · **Branch:** `feature/android-app` (from `claude/misi-bijak-android-recon-h4okhm` @ `fb826ce`; Phase 1 report retained) · **Type:** documentation only

Evidence labels: **VERIFIED** (observed this session) · **ASSUMED** (reasoned, not confirmed) · **UNKNOWN** (cannot determine).

## 1. Summary

- All eight Phase 2 tasks have a deliverable. **Seven are complete; task 1 (screen spec from the design board) is only partly done because no visual reference has been supplied.** The behavioural spec, states, accessibility rules, copy draft and intake checklist are done; every visual field is `PENDING-BOARD`.
- Approved decisions A1–A10 are recorded; where the handoff was ambiguous I wrote a labelled default (P-items) and a question (Q-items) instead of guessing silently. The main ambiguity: whether "sequential unlock with at least one star" applies to missions, levels, or both (Q1).
- The existing web app is **unchanged** (no diff against the Phase 1 tip for any web, Supabase, workflow or test file) and `npm test` still passes 13/13.
- **No Android code, no workflow, no Gradle project, no UI.** No merge, no PR, no release, no Supabase access of any kind.
- Biggest blockers: design board (Q2), audio/illustration/repo licensing (Q5, Q6), target devices (Q4), and the unlock-rule ambiguity (Q1).

## 2. Deliverables

All under `docs/android/`.

| Task | Deliverable | Status |
|---|---|---|
| 1 Screen spec from design board | [`05-screen-spec.md`](05-screen-spec.md) | **PARTIAL** — board not supplied; behaviour/a11y/copy complete |
| 2 Architecture diagrams, navigation contracts | [`02-architecture.md`](02-architecture.md), [`03-navigation-contracts.md`](03-navigation-contracts.md) | Done; 6 Mermaid diagrams render |
| 3 Kotlin domain model, content JSON schemas | [`04-domain-and-content.md`](04-domain-and-content.md), [`schemas/`](schemas/) | Done; schemas validated against real data |
| 4 Pages isolation plan | [`06-pages-isolation-plan.md`](06-pages-isolation-plan.md) | Done; prototype verified; **not applied** |
| 5 Privacy remediation proposal (web) | [`07-privacy-remediation-proposal.md`](07-privacy-remediation-proposal.md) | Done; **nothing applied**, tiers T0–T3 |
| 6 Audio and illustration licensing audit | [`08-licensing-audit.md`](08-licensing-audit.md), [`asset-register.csv`](asset-register.csv) | Done; result: **0 of 83 assets cleared** |
| 7 CI build/test acceptance gates | [`09-ci-gates.md`](09-ci-gates.md) | Done (definition only) |
| 8 Milestone checklist | [`10-milestone-checklist.md`](10-milestone-checklist.md) | Done |
| — | [`01-decisions.md`](01-decisions.md) decision register | Done |

## 3. Evidence table

### VERIFIED this session

| Claim | How |
|---|---|
| `feature/android-app` created at `fb826ce`; Phase 1 report present | `git log` |
| No web/Supabase/workflow/test/README file differs from the Phase 1 tip | `git diff --stat fb826ce -- <web paths>` printed nothing |
| `npm test` 13 tests, 13 pass, 0 fail | run twice, Node 22.22.0 |
| Five content schemas compile (Ajv 8, 2020-12, strict) | script run |
| Example content generated from current `js/questions.js` (48 words, 24 sentences, 6 missions) passes schema **and** semantic checks (all 16 KVK words are CVC; all 16 vokal words start with a vowel; all 72 voice clips exist) | `validate-examples.js` → "ALL CHECKS PASSED" |
| Schemas reject 5 deliberately bad inputs (reviewed sentence without distractors; no blank; two blanks; 2 levels; 2 characters) | inline negative tests |
| 3 levels × 8 questions cannot be disjoint for `vokal`/`kv`/`kvk` (pools of 16) | arithmetic on data |
| Staged allowlist site: 93 files; 86 distinct references (HTML links + all audio paths) served 200; `supabase/…sql`, Phase 1 report, `package.json`, `README.md` return 404 | local static server + requests |
| All 6 Mermaid diagrams render with Mermaid CLI 11 (headless Chromium) | `mmdc` run, 6/6 |
| No broken relative links in the docs | link check script |
| Asset register: 83 rows — 48 word clips, 24 sentence clips, 3 effects, 3 brand SVGs, 5 empty SVGs; no row has a recorded source or licence | generated from the working tree |
| Word clips 0.72–1.22 s, sentence clips 1.68–3.02 s, 24 kHz mono 64 kbps; word/sentence clips have no tags; the three effects carry an ffmpeg encoder tag | `ffprobe`, `strings` |
| No LICENSE file in the repo | `ls` |
| Upstream licence texts: Twemoji graphics = CC BY 4.0; OpenMoji = CC BY-SA 4.0; Andika and Nunito = SIL OFL 1.1; Noto Emoji README says fonts OFL and "most image resources" Apache 2.0 but its root `LICENSE` is OFL text with no Apache text | fetched and read |
| Web data flows: name, class, scores POSTed to Supabase after each round; class list fetched on every page load; anonymous select not granted on `results`; no delete/retention in migrations; hard-coded teacher e-mail in migrations/function | read `js/app.js`, `js/teacher.js`, `supabase/migrations/*` |
| The web README's "no data sent to server" statement is inaccurate | README vs code |
| Pages workflow uploads repo root, triggers on `main` only; run #27 succeeded | workflow file; Actions API (Phase 1) |

### ASSUMED

| Claim | Basis |
|---|---|
| Pages artifact excludes hidden folders (`.git`, `.github`) | general knowledge of the action |
| Repo is public | README text; Pages requirement on free plans |
| Voice clips are synthetic TTS; the three effects are locally synthesised | uniform format / ffmpeg tag — a guess |
| Newer emoji (🪿 Emoji 15, 🫙 Emoji 14, 🪑 Emoji 12) show as boxes on older Android | Unicode/Android version history |
| GitHub-hosted runners include an Android SDK | common knowledge; fallback is the SDK setup action |
| Kotlin/AndroidX/Compose licences are Apache 2.0 | general knowledge; CI's generated licence report will be the evidence |
| Supabase publishable key is safe to expose when RLS is correct | vendor model |
| `minSdk 24`, nickname rule numbers, parent-gate method, 25 MB size budget, 90% coverage | my proposals — see P-items |

### UNKNOWN

| Item | Needed from |
|---|---|
| Design Board V1 contents (Q2) and character details (Q3) | Cowlick/designer |
| Target devices and distribution route (Q4) | Cowlick/school |
| Audio source, tool/service, terms (Q5) | Owner |
| Repo/asset licence (Q6) | Owner |
| Live Supabase policies, retention, region, logs; who administers the project | Owner (not queried by design) |
| Whether teacher/linguist approves content changes (Q9) | Teacher |
| Applicable legal obligations for children's data | Data controller / counsel |
| Real Pages deployment behaviour under the new workflow; what the live site serves today (`github.io` blocked from the sandbox) | Owner after approval |
| Current stable versions of AGP/Kotlin/Compose, Play target-SDK requirement, and action SHAs | to be looked up at M0 |
| Whether any Android build works | no SDK here; CI is the verifier and no workflow exists yet |
| Rendering quality of BM copy draft | teacher / native speaker |

## 4. Blockers

| # | Blocker | Blocks | Needs |
|---|---|---|---|
| B1 | Design board not supplied | S01–S23 visual spec; M3–M7 | Q2 |
| B2 | Unlock-rule ambiguity | M6 | Q1 |
| B3 | Licensing: no repo licence, audio provenance unknown, no usable illustrations | any distribution; M4 art; G9 | Q5, Q6, L3 |
| B4 | No target-device information | `minSdk`, perf budgets | Q4 |
| B5 | Approval to change the Pages workflow | G12; protecting `android/` from publication once merged | Q7 |
| B6 | Pedagogy sign-off on content changes | M1 | Q9 |

None of these blocks starting M0 (project skeleton and CI) except the applicationId/namespace choice and approval of Q7 for the Pages job.

## 5. Notable findings from Phase 2 work

1. **Level design collides with content size** (P5): three disjoint 8-question levels need 24 words; each of the three word-type pools has 16. Proposed parameter-based difficulty instead; needs sign-off.
2. **Android default backup** would copy child progress to a Google account unless disabled; proposed `allowBackup=false` (P6), a privacy-relevant default that is easy to miss.
3. **Licensing is worse than "unknown"**: 0 of 83 assets cleared; 15 of 48 word pictures need replacement or review regardless of licence (wrong objects such as 🪑 for "table" and 🧹 for "mop").
4. **Privacy**: the README makes a false claim (PR1) that costs nothing to correct (T0). Server-side changes (T2) are risky enough to warrant a non-production rehearsal.
5. **Process note**: the one command that tried to delete a scratch directory was blocked by a safety check and was not run; I used a fresh scratch directory instead. No repo files were deleted.

## 6. Guardrail compliance

| Guardrail | Status |
|---|---|
| Do not implement application UI | Complied — no Kotlin, no Gradle, no resources |
| Do not merge to main | Complied — `main` untouched |
| Do not publish APK or releases | Complied — none exist |
| Do not modify production data or Supabase configuration | Complied — no connection to Supabase at all |
| Do not treat provisional device/licensing decisions as verified | Complied — labelled P/UNKNOWN throughout |
| Report blockers with VERIFIED/ASSUMED/UNKNOWN | §3–§4 |
| Preserve existing web functionality | Complied — diff empty for web paths; 13/13 tests pass |
| Branch from the reconnaissance branch, retain Phase 1 report | Complied |
| Do not alter teacher functionality or Supabase policies | Complied — proposal only |

One scope note: to read licence texts I fetched raw files from public upstream repositories (Twemoji, OpenMoji, Noto Emoji, Andika, Nunito) with `curl`. That is read-only and limited to licence/README files, but it is outside the session's listed repository; flagging it for transparency.

## 7. Decisions I need from Cowlick

1. **Q1** unlock rule (missions, levels or both; which level counts).
2. **Q2/Q3** design board and the three characters.
3. **Q4** target devices and distribution route.
4. **Q5/Q6** audio provenance (or commission a human recording) and repository/asset licence.
5. **Q7** approval to change `deploy-pages.yml` per 06 (via a PR the owner merges).
6. **Q8** which privacy tiers to authorise: I recommend T0 now, T1 next, T2 only after a rehearsal.
7. **Q9** pedagogy sign-off: curated sentence distractors, varying KVK blank, level difficulty parameters, replacing the 15 flagged pictures.
8. **Q10** who will hold the signing key.
9. Confirm provisional items P1–P13, especially P5 (levels), P6 (no backup), P7 (nickname rules), P10 (parent gate).

## 8. Proposed next step (not started)

On approval of the above: **M0 foundation** — Android project skeleton, version/tool pinning, CI workflows with pinned actions, manifest/dependency policy tasks, content exporter. First evidence to return: a green CI run and the merged manifest showing no `INTERNET` permission.

**STOPPED here for Cowlick review.**
