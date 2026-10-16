#!/usr/bin/env bash
# Runs the instrumented tests on an already-booted emulator and collects screenshots.
# Usage: tools/android-instrument.sh <apk-dir> <out-dir>
# Not `connectedAndroidTest`: that uninstalls the app afterwards and the screenshots
# (stored in the app's private files dir) would be lost before they can be pulled.
set -euo pipefail

APK_DIR="${1:?apk dir}"
OUT="${2:?output dir}"
PKG="io.github.p3n3b495.misibijak"

mkdir -p "$OUT/screenshots"
adb wait-for-device
adb shell settings put global window_animation_scale 0 || true
adb shell settings put global transition_animation_scale 0 || true
adb shell settings put global animator_duration_scale 0 || true

{
  echo "sdk=$(adb shell getprop ro.build.version.sdk | tr -d '\r')"
  echo "release=$(adb shell getprop ro.build.version.release | tr -d '\r')"
  echo "model=$(adb shell getprop ro.product.model | tr -d '\r')"
  adb shell wm size | tr -d '\r'
  adb shell wm density | tr -d '\r'
} | tee "$OUT/device.txt"

adb install -r -t "$APK_DIR/app-debug.apk"
adb install -r -t "$APK_DIR/app-debug-androidTest.apk"

set +e
adb shell am instrument -w "$PKG.test/androidx.test.runner.AndroidJUnitRunner" | tee "$OUT/instrument.log"
set -e

# Pull screenshots out of the (debuggable) app's private storage.
adb exec-out run-as "$PKG" tar -c -C files/screenshots . > "$OUT/screenshots.tar" || true
tar -xf "$OUT/screenshots.tar" -C "$OUT/screenshots" || true
adb logcat -d -t 400 > "$OUT/logcat-tail.txt" || true

if grep -qE '^OK \([0-9]+ tests?\)' "$OUT/instrument.log"; then
  echo "INSTRUMENTED TESTS PASSED"
else
  echo "INSTRUMENTED TESTS FAILED" >&2
  exit 1
fi
