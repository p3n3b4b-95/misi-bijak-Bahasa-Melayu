# Misi Bijak BM — Android app (work in progress)

Native Kotlin + Jetpack Compose app, offline-only (no `INTERNET` permission), Bahasa Melayu UI. The web game at the repository root is a separate product and is not touched by this folder.

Status: **M0 foundation + UI-01** (splash screen, main menu, shared theme and components). Later screens are specified in `docs/android/05-screen-spec.md` but not built.

## Where things are

| Path | Purpose |
|---|---|
| `app/src/main/java/.../ui/theme` | Colour tokens (`Palette`), contrast maths, typography (Nunito), dimensions |
| `app/src/main/java/.../ui/components` | Reusable components: pill button, round icon button, loading bar, logo title, scenery, placeholder mascots |
| `app/src/main/java/.../feature/{splash,menu}` | UI-01 screens |
| `app/src/main/java/.../navigation` | Typed routes and the `NavHost` |
| `app/src/test` | JVM unit tests (contrast tokens, splash timing) |
| `app/src/androidTest` | Emulator tests (Compose semantics, touch targets, end-to-end flow) and screenshot capture |
| `../tools` | CI helper scripts (APK policy, dependency allowlist, emulator runner, comparison image) |

## Build and test

CI is the source of truth for builds (`.github/workflows/android-ci.yml`). To build locally you need JDK 17 and an Android SDK with `platforms;android-36` and `build-tools;36.0.0`:

```bash
cd android
./gradlew lintDebug testDebugUnitTest assembleDebug
```

Instrumented tests need an emulator or device (API 24+): `./gradlew connectedDebugAndroidTest`, or use `tools/android-instrument.sh` to also collect screenshots.

## Rules this project enforces in CI

- No permissions beyond an allowlist; `allowBackup=false`; only the launcher activity is exported (`tools/check-apk-policy.js`).
- Runtime dependencies must be on `tools/dependency-allowlist.txt`; ad, analytics and networking libraries are denied (`tools/check-dependencies.js`).
- No keystores, APKs or `local.properties` tracked in Git.

Signing keys and release publishing are **not** configured. Nothing here publishes a release.
