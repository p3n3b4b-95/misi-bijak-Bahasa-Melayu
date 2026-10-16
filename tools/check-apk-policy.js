#!/usr/bin/env node
// Gate G6 (docs/android/09-ci-gates.md): offline-only / privacy manifest policy.
// Usage: node tools/check-apk-policy.js <release.apk> [--aapt2 <path>]
// Reads the built APK with aapt2, so it checks what is actually shipped, not just source.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync } = require("node:child_process");

const args = process.argv.slice(2);
const apk = args.find((a) => !a.startsWith("--"));
if (!apk) { console.error("usage: check-apk-policy.js <apk> [--aapt2 <path>]"); process.exit(2); }

function findAapt2() {
  const flag = args.indexOf("--aapt2");
  if (flag >= 0) return args[flag + 1];
  const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT;
  if (!sdk) throw new Error("ANDROID_HOME is not set and --aapt2 was not given");
  const dir = path.join(sdk, "build-tools");
  const versions = fs.readdirSync(dir).filter((v) => fs.existsSync(path.join(dir, v, "aapt2")));
  versions.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  if (!versions.length) throw new Error(`no aapt2 under ${dir}`);
  return path.join(dir, versions[versions.length - 1], "aapt2");
}

const aapt2 = findAapt2();
const run = (...a) => execFileSync(aapt2, a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });

const failures = [];
const notes = [];
const fail = (m) => failures.push(m);

// 1. Permissions: only the allowlist, never anything network- or identity-related.
const allowedPermissions = [
  /^[a-z0-9_.]+\.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION$/, // added automatically by AndroidX core (signature-level, app-private)
];
const forbiddenPermissions = [
  /INTERNET/, /ACCESS_NETWORK_STATE/, /ACCESS_WIFI_STATE/, /READ_PHONE_STATE/, /AD_ID/, /ADSERVICES/,
  /ACCESS_.*_LOCATION/, /CAMERA/, /RECORD_AUDIO/, /READ_CONTACTS/, /READ_EXTERNAL_STORAGE/, /WRITE_EXTERNAL_STORAGE/,
];
const permissionsOut = run("dump", "permissions", apk);
const permissions = [...permissionsOut.matchAll(/uses-permission(?:-sdk-\d+)?: name='([^']+)'/g)].map((m) => m[1]);
notes.push(`permissions: ${permissions.length ? permissions.join(", ") : "(none)"}`);
for (const p of permissions) {
  if (forbiddenPermissions.some((r) => r.test(p))) fail(`forbidden permission: ${p}`);
  else if (!allowedPermissions.some((r) => r.test(p))) fail(`permission not on allowlist: ${p}`);
}

// 2. Manifest flags and exported components.
const tree = run("dump", "xmltree", "--file", "AndroidManifest.xml", apk);
const lines = tree.split("\n");
if (!/allowBackup\([^)]*\)=(false|\(type 0x12\)0x0)/.test(tree)) fail("android:allowBackup must be explicitly false");
if (/usesCleartextTraffic\([^)]*\)=(true|\(type 0x12\)0xffffffff)/.test(tree)) fail("usesCleartextTraffic must not be true");
if (/debuggable\([^)]*\)=(true|\(type 0x12\)0xffffffff)/.test(tree)) fail("release APK must not be debuggable");

const elements = []; // {name, indent, attrs: {}}
for (const line of lines) {
  const e = line.match(/^(\s*)E: (\S+)/);
  if (e) { elements.push({ name: e[2], indent: e[1].length, attrs: {}, parent: null }); continue; }
  const a = line.match(/^(\s*)A: (?:\S+:)?([A-Za-z0-9_]+)(?:\([^)]*\))?=(?:"([^"]*)"|\(type 0x\w+\)(\S+)|(\S+))/);
  if (a && elements.length) elements[elements.length - 1].attrs[a[2]] = a[3] ?? a[4] ?? a[5];
}
for (let i = 0; i < elements.length; i++) {
  for (let j = i - 1; j >= 0; j--) if (elements[j].indent < elements[i].indent) { elements[i].parent = elements[j]; break; }
}
const truthy = (v) => v === "true" || v === "0xffffffff";
const components = elements.filter((e) => ["activity", "activity-alias", "service", "receiver", "provider"].includes(e.name));
const hasFilter = (c) => elements.some((e) => e.name === "intent-filter" && e.parent === c);
const exported = components.filter((c) => truthy(c.attrs.exported) || (c.attrs.exported === undefined && hasFilter(c)));
const knownLibraryExports = new Set(["androidx.profileinstaller.ProfileInstallReceiver"]);
const exportedActivities = exported.filter((c) => c.name.startsWith("activity"));
for (const c of exported) {
  const name = c.attrs.name || "(unnamed)";
  if (c.name.startsWith("activity")) continue;
  if (!knownLibraryExports.has(name)) fail(`unexpected exported ${c.name}: ${name}`);
  else notes.push(`allowed library export: ${name} (${c.name})`);
}
if (exportedActivities.length !== 1) fail(`expected exactly 1 exported activity (the launcher), found ${exportedActivities.length}`);
for (const c of exportedActivities) {
  const filters = elements.filter((e) => e.name === "intent-filter" && e.parent === c);
  const filterText = filters.map((f) => elements.filter((x) => x.parent === f).map((x) => `${x.name}:${x.attrs.name}`).join(",")).join("|");
  notes.push(`exported activity ${c.attrs.name}: ${filterText}`);
  if (!/android\.intent\.action\.MAIN/.test(filterText) || !/android\.intent\.category\.LAUNCHER/.test(filterText)) fail(`exported activity ${c.attrs.name} is not a plain launcher`);
  if (/VIEW|BROWSABLE|SEND/.test(filterText)) fail(`exported activity ${c.attrs.name} accepts external intents`);
}

console.log(`APK: ${apk}`);
notes.forEach((n) => console.log(`  ${n}`));
if (failures.length) {
  console.error("POLICY FAILED");
  failures.forEach((f) => console.error(`  - ${f}`));
  process.exit(1);
}
console.log("POLICY OK (G6): no forbidden permissions, backup disabled, only the launcher is exported");
