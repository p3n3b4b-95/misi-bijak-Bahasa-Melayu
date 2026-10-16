# 10 — Milestone implementation checklist

All boxes are **unchecked**: no milestone has started. A box is checked only with the evidence named in its row (CI run URL, report, or recorded manual check). `Needs` lists blocking inputs; see `01-decisions.md` for Q-numbers. Effort is relative (S/M/L), not a schedule.

Legend for gates: G-numbers refer to `09-ci-gates.md`; AC-numbers to the Phase 1 report §8.2.

## Phase 2 (this phase) — documentation exit

- [x] Branch `feature/android-app` created from the recon branch; Phase 1 report retained
- [x] Decision register (01)
- [x] Architecture + diagrams (02) — diagrams render (Mermaid CLI, see report)
- [x] Navigation contracts (03)
- [x] Domain model + content schemas validated against current data (04)
- [ ] Screen specification complete — **blocked: design board not supplied (Q2)**; behavioural spec done (05)
- [x] Pages isolation plan with prototype evidence (06)
- [x] Privacy remediation proposal (07)
- [x] Licensing audit + asset register (08)
- [x] CI gates defined (09)
- [x] This checklist (10)
- [ ] Cowlick review and answers to open questions

## M0 — Foundation (S–M) · Needs: Q4, applicationId/namespace, Q7 (for G12)

- [x] Choose `applicationId`/package; record in 01 (**provisional** `io.github.p3n3b495.misibijak`, Q19)
- [x] `android/` Gradle project, wrapper, version catalog, themed Compose activity (commit 22dcdeb)
- [x] Pin tool versions; recorded in 01 §D (AGP/Compose deliberately not the newest)
- [x] `.gitignore` additions (06 §7) committed with the first Android commit
- [x] Action SHAs resolved and pinned; `android-ci.yml` added. **Not done:** `web-ci.yml`, Dependabot
- [x] G6 and G7 implemented as scripts run in CI (`tools/check-apk-policy.js`, `check-dependencies.js`) instead of Gradle tasks
- [ ] `tools/export-content.js` + `--check`; promote schema validator from prototype
- [x] **Evidence:** green CI run for G0–G2, G4, G6–G8: <https://github.com/p3n3b4b-95/misi-bijak-Bahasa-Melayu/actions/runs/38924921466>. G3 (formatter) not set up; G9, G13 not run
- [x] **Evidence:** G6 policy check passed on the release APK in that run (log not excerpted here)
- [ ] Pages stage check job added (if Q7 approved); deploy workflow **not** changed without approval

## M1 — Content + domain (M) · Needs: Q9 (pedagogy), curated distractors

- [ ] Kotlin domain model per 04 §2
- [ ] `QuestionGenerator` for all six activities with seeded `Random`
- [ ] `ScoringPolicy`, `RankPolicy`, `UnlockPolicy`, `AchievementEvaluator`, `NicknamePolicy`
- [ ] `ContentRepository` + `ContentValidator` implementing 04 §4 rules
- [ ] Ported web tests (13) as JVM tests; golden-seed tests; parity test vs exported JSON
- [ ] Curated sentence distractors reviewed by a teacher; statuses → `reviewed`
- [ ] **Evidence:** G4 green with domain coverage ≥ 90%; AC-3 generator invariants

## M2 — Data layer (M)

- [ ] Room entities/DAOs per 04 §3; `exportSchema=true`, schema JSON committed
- [ ] DataStore settings
- [ ] `ProgressRepository.recordAttempt` as one transaction
- [ ] Cascade-delete of a profile verified
- [ ] Migration test harness (v1 baseline)
- [ ] **Evidence:** G5 green; AC-G4 (persistence, profile isolation)

## M3 — Module 1 and shell (S) · Needs: board frames S01–S02, font (L5)

- [x] Theme tokens from board; contrast token test (unit test passing in CI)
- [x] `AppContainer`, `MainActivity`, `NavHost` (typed routes Splash, MainMenu); guards not needed yet
- [x] S01 Splash, S02 MainMenu (placeholder art). [ ] S23 ErrorRetry not built
- [x] Manifest policy check passes with the real release manifest
- [ ] **Evidence:** UI tests passing (11 on two emulators) — **TalkBack walkthrough notes still missing**; AC-1 partly met (menu actions are placeholders)

## M4 — Module 3: activities (L) · Needs: M1, audio cleared or dev-only (L2), pictures (L3)

- [ ] `ActivityScaffold` (S08) incl. confirm-exit, process-death resume
- [ ] S09 Vokal, S10 KV, S11 KVK, S12 Padan, S13 Susun, S14 Ayat
- [ ] `AudioController` (SFX, voice, optional TTS fallback, visible error)
- [ ] S07 LevelSelect with three levels
- [ ] **Evidence:** emulator run of all six; offline run (airplane mode); AC-3; process-death test (03 §5)

## M5 — Module 4: feedback, stars, rewards (M)

- [ ] S15 FeedbackOverlay, S16 Result, S17 Reward queue
- [ ] Reduced-motion variants
- [ ] Score/star parity tests vs `core.js` thresholds
- [ ] **Evidence:** AC-4; G4/G10

## M6 — Module 2: profiles, characters, map (M) · Needs: Q1, Q3, board frames S03–S06

- [ ] S03 ProfileSelect (cap, empty state), S04 CreateProfile (nickname rules), S05 CharacterSelect (3 characters)
- [ ] S06 AdventureMap with lock states; unlock rule from content (Q1)
- [ ] Multi-profile isolation tests
- [ ] **Evidence:** AC-2; navigation guard tests

## M7 — Module 5: profile, achievements, settings (M)

- [ ] S18 StudentProfile, S19 Achievements (approved list, P13), S20 Settings
- [ ] S21 ParentGate with accessible alternative; reset per profile and all
- [ ] S22 About/Licences generated from the dependency/asset reports
- [ ] **Evidence:** AC-5; reset test wipes only the intended scope

## M8 — Hardening (M) · Needs: Q4 devices, final assets

- [ ] Accessibility audit incl. TalkBack on a real device; findings fixed
- [ ] Font scale 2.0, landscape, tablet screenshots approved
- [ ] Low-end device pass; size/startup budgets set (G14 → blocking)
- [ ] Asset register complete: no `UNKNOWN` (G9 release mode)
- [ ] Privacy statement in S22 verified against G6 output
- [ ] **Evidence:** all global ACs (AC-G1…G9) cited with links

## M9 — Closure and release candidate (S) · Needs: Q10 (key owner), L1 licence

- [ ] README (Android section), English operator runbook, troubleshooting, test report, release notes, release procedure (signing, tagging `android-vX.Y.Z`)
- [ ] Signing key held by owner; secrets in protected environment; backup procedure documented
- [ ] Release candidate built by CI as a **draft** release
- [ ] **Owner approval recorded** before any publication; nothing published without it

## Cross-cutting (every milestone)

- [ ] Web unchanged (G13) and `npm test` green
- [ ] No secrets/keys committed (G8)
- [ ] Status report uses VERIFIED/ASSUMED/UNKNOWN per 09 §5
- [ ] No merge to `main`; PR only when requested
