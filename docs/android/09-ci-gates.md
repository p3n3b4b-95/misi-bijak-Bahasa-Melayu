# 09 — Android CI build and test acceptance gates

**Status: DEFINITION ONLY.** No workflow file exists for Android; nothing below has run. Per decision A8, **CI is the only source of build truth** — local verification is impossible in the current sandbox (no Android SDK; `dl.google.com` returns 403 — VERIFIED in Phase 1). A gate is "passing" only when a linked CI run shows it passing.

## 1. Principles

1. Fail closed: a missing report counts as failure.
2. Every gate has an owner-visible artefact (log, report, or file) kept as a CI artefact.
3. PR gates are fast (target ≤ 15 min — a goal, not a measurement); slower gates run nightly or on release.
4. Gates that depend on pending inputs (design board, licences) are marked **WARN until input, then BLOCK**, so work can proceed without silently lowering the bar.
5. Web and Android CI are separate; a failing Android job never blocks a web-only change and vice versa (path filters).

## 2. Gate catalogue

Severity: **B** = blocks merge; **R** = blocks release only; **W** = warns.

| ID | Gate | Pass criteria | Evidence | When | Sev |
|---|---|---|---|---|---|
| G0 | Wrapper integrity | Gradle wrapper checksum validated by the official validation action | action log | PR | B |
| G1 | Build | `assembleDebug` and `assembleRelease` (R8 on, unsigned) succeed | build log, APK size line | PR | B |
| G2 | Lint | Android Lint: 0 errors; warnings not growing vs the checked-in baseline; "hard-coded text" and "missing translation" are errors | lint report | PR | B |
| G3 | Static analysis | Chosen formatter/linter (ktlint or detekt — pick one at M0) clean | report | PR | B |
| G4 | Unit tests (JVM) | All pass. Domain package line coverage ≥ 90% (provisional threshold) via Kover or JaCoCo; includes architecture test enforcing the dependency rule (02 §2) | test + coverage reports | PR | B |
| G5 | Persistence tests | Room DAO/transaction tests pass; migration tests pass for every schema version; exported schema JSON is up to date (no uncommitted diff after build) | test report | PR | B |
| G6 | Offline & privacy manifest | Merged release manifest declares **no** `INTERNET`, `ACCESS_NETWORK_STATE`, `ACCESS_WIFI_STATE`, `READ_PHONE_STATE`, `AD_ID`, or any permission not on the allowlist (allowlist initially: `VIBRATE`); `allowBackup="false"`; only the launcher activity is `exported`; no `<intent-filter>` other than MAIN/LAUNCHER; `usesCleartextTraffic` absent/false; no `WebView` class referenced | script output reading the merged manifest and class list | PR | B |
| G7 | Dependency allowlist | Resolved runtime dependency list is a subset of `dependency-allowlist.txt`; no coordinates containing ads/analytics/crash-reporting/Play Services/Firebase/networking libraries (OkHttp, Retrofit, Ktor, Volley, Glide/Coil network loaders, etc.) | resolved-dependency report | PR | B |
| G8 | Secrets & signing hygiene | Secret scan (e.g. gitleaks) finds nothing; no `*.jks`, `*.keystore`, `local.properties`, `google-services.json`, `.env*` tracked; release signing config reads only from environment/CI secrets | scan report; `git ls-files` check | PR | B |
| G9 | Content & asset integrity | `tools/export-content.js --check` shows `content/*.json` equals the export from `js/questions.js` (apart from Android-only fields); JSON schemas validate; semantic validator passes (04 §4); every referenced audio/image exists; asset register covers every non-code file. For **release**: no `draft` content items, and no register row with `UNKNOWN` source/licence | validator output; register diff | PR (W for licence, B for the rest); release (B) | B/R |
| G10 | Accessibility & layout | Compose UI tests with accessibility checks enabled on S02, S03, S06, S08–S14, S16; screenshot tests at 360×640 dp, 600×960 dp, landscape, and font scale 1.0 and 2.0 compare to approved baselines; a token test asserts all text/background pairs ≥ 4.5:1 and all interactive targets ≥ 48 dp | test + screenshot reports | PR for functional; baselines require board frames → **W until Q2 resolved** | W→B |
| G11 | Instrumented / emulator | Compose navigation tests (03 §5), process-death test, audio controller smoke test on an API-level matrix (e.g. lowest supported, a middle one, latest) | emulator logs | Nightly + release | R |
| G12 | Pages isolation | `pages-stage-check` (06 §4) passes: staged tree equals allowlist; all references resolve; no forbidden file types | job log | PR | B (after Q7 approval) |
| G13 | Web non-regression | `npm test` passes (≥ 13 tests today); no change under `index.html`, `teacher.html`, `css/`, `js/`, `assets/`, `supabase/` in Android-only PRs unless labelled | CI + diff check | PR | B |
| G14 | Size & performance budget | Release APK/AAB size ≤ budget set from the M0 baseline (initial guess: 25 MB — UNKNOWN); cold start time recorded on the lowest emulator profile (no pass/fail until a baseline exists) | size line; benchmark log | PR (size) | W→B after baseline |
| G15 | Release provenance | Tag matches `android-vX.Y.Z`, equals `versionName`, `versionCode` increased; build runs inside a protected environment with required reviewer; output is a **draft** GitHub Release only | release job log | Release | R |

## 3. Workflow set (proposal)

| Workflow | Trigger | Gates | Notes |
|---|---|---|---|
| `web-ci.yml` | PR touching web paths | G13 | Additive; runs `npm test` before merge (today it runs only on `main` — VERIFIED) |
| `android-ci.yml` | PR / push on `android/**`, `tools/**`, content, this workflow | G0–G10, G12, G14 | Gradle cache; uploads debug APK, reports |
| `android-nightly.yml` | schedule + manual | G11, dependency-update dry-run | Emulator runner; slow |
| `android-release.yml` | manual or tag `android-v*.*.*` | G1, G9 (release mode), G15 + signing | Environment `android-release` with required reviewers; secrets only here; creates a **draft** release; never publishes |
| `pages-stage-check` (job in `web-ci.yml`) | PR | G12 | Becomes the guard for the new deploy workflow |
| Dependabot (`.github/dependabot.yml`) | weekly | — | Gradle + GitHub Actions; PRs only |

### Practices

- Third-party actions pinned by **full commit SHA** (none resolved yet — to be done at M0 from the official release tags), with Dependabot keeping them current.
- `permissions: contents: read` at workflow level; elevate per job only where required.
- No secrets in PR workflows from forks; release secrets only in the protected environment.
- JDK version: the one required by the pinned Android Gradle Plugin (UNKNOWN until M0; JDK 21 is installed in this sandbox — VERIFIED).
- Build scans/telemetry from Gradle are **not** published (no `--scan`), consistent with "no analytics" in spirit.

## 4. Skeleton for `android-ci.yml` (illustrative — not enabled)

```yaml
# DRAFT. Lives in docs only. Do not copy into .github/workflows until M0 is approved.
name: Android CI
on:
  pull_request:
    paths: ["android/**", "tools/**", "docs/android/schemas/**", ".github/workflows/android-ci.yml"]
permissions:
  contents: read
jobs:
  build-test:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - uses: actions/checkout@<SHA>
      - uses: actions/setup-node@<SHA>        # for tools/export-content.js
        with: { node-version: 22 }
      - uses: actions/setup-java@<SHA>
        with: { distribution: temurin, java-version: "<per AGP>" }
      - uses: gradle/actions/wrapper-validation@<SHA>
      - uses: gradle/actions/setup-gradle@<SHA>
      - run: node tools/export-content.js --check
      - run: ./gradlew lintDebug testDebugUnitTest assembleDebug assembleRelease checkManifestPolicy checkDependencyAllowlist
        working-directory: android
      - uses: actions/upload-artifact@<SHA>
        if: always()
        with:
          name: android-reports
          path: |
            android/app/build/reports/**
            android/app/build/outputs/apk/debug/*.apk
```

`checkManifestPolicy` and `checkDependencyAllowlist` are custom Gradle tasks to be written in M0 (they implement G6 and G7). The runner image's preinstalled Android SDK is ASSUMED; if absent the workflow must install it with the official SDK setup action.

## 5. Definition of "build verified"

For any status report I write, use these exact terms:

- **VERIFIED**: a CI run URL is cited, the run's commit SHA equals the reported commit, and the named gates are green in that run.
- **ASSUMED**: code is written but not yet run in CI.
- **UNKNOWN**: not attempted or not possible.

I will not report "builds" or "tests pass" for Android on any other basis.

## 6. Today's status of the gates

All Android gates: **NOT RUN** (no Android code, no workflow). Web: `npm test` — 13/13 pass locally (VERIFIED, run in this session, Node 22.22.0). Content schema prototype check — pass (VERIFIED, 04 §5).
