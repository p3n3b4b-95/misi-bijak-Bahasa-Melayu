#!/usr/bin/env node
// Gate G7 (docs/android/09-ci-gates.md): dependency allowlist + denylist.
// Usage: node tools/check-dependencies.js <gradle-dependencies-output.txt> [allowlist file]
"use strict";
const fs = require("node:fs");
const path = require("node:path");

const input = process.argv[2];
if (!input) { console.error("usage: check-dependencies.js <deps.txt> [allowlist]"); process.exit(2); }
const allowFile = process.argv[3] || path.join(__dirname, "dependency-allowlist.txt");

const allow = fs.readFileSync(allowFile, "utf8").split("\n").map((l) => l.trim()).filter((l) => l && !l.startsWith("#"));
const deny = [
  /okhttp/i, /retrofit/i, /\bktor\b/i, /volley/i, /firebase/i, /play-services/i, /\bgms\b/i, /crashlytics/i,
  /analytics/i, /admob/i, /(^|[.:_-])ads?([.:_-]|$)/i, /sentry/i, /mixpanel/i, /appsflyer/i, /facebook/i,
  /\bcoil\b/i, /glide/i, /picasso/i, /webkit/i,
];

const coords = new Set();
for (const line of fs.readFileSync(input, "utf8").split("\n")) {
  const m = line.match(/[+\\]--- ([A-Za-z0-9_.\-]+):([A-Za-z0-9_.\-]+)(?::[^\s]+)?/);
  if (m) coords.add(`${m[1]}:${m[2]}`);
}
if (!coords.size) { console.error("no dependencies parsed - is this a `gradle dependencies` output?"); process.exit(2); }

const failures = [];
for (const c of [...coords].sort()) {
  if (deny.some((r) => r.test(c))) failures.push(`denied dependency: ${c}`);
  else if (!allow.some((a) => (a.endsWith("*") ? c.startsWith(a.slice(0, -1)) : c === a))) failures.push(`not on allowlist: ${c}`);
}
console.log(`resolved release runtime dependencies: ${coords.size}`);
if (failures.length) {
  console.error("DEPENDENCY POLICY FAILED");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("DEPENDENCY POLICY OK (G7)");
