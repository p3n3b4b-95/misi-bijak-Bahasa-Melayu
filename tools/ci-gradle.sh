#!/usr/bin/env bash
# Runs Gradle from android/ with plain output and, on failure, prints a short summary of the
# compiler/lint errors at the end of the step log (the full log stays above it).
# Usage (from android/): bash ../tools/ci-gradle.sh <label> <gradle args...>
set -uo pipefail
label="$1"; shift
log="$(mktemp)"
./gradlew --console=plain "$@" 2>&1 | tee "$log"
status=${PIPESTATUS[0]}
if [ "$status" -ne 0 ]; then
  echo
  summary="${RUNNER_TEMP:-/tmp}/failure-summary.txt"
  {
    echo "=================== FAILURE SUMMARY ($label) ==================="
    grep -nE '^(e|w): |: error:|Error:|FAILED|\* What went wrong|Execution failed|Unresolved|Could not' -A3 "$log" | grep -v 'at org\.gradle' | head -120
    echo "=================== END SUMMARY ==================="
  } | tee -a "$summary"
fi
exit "$status"
