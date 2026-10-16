// PROTOTYPE ONLY. Validates examples against schemas and checks semantic rules.
// Usage: NODE_PATH=<dir containing node_modules with ajv + ajv-formats> node validate-examples.js
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const Ajv2020 = require("ajv/dist/2020");
const dir = path.join(__dirname, "..");
const repo = path.join(dir, "../../..");
const read = (p) => JSON.parse(fs.readFileSync(p, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
let failures = 0;
const fail = (msg) => { failures += 1; console.error("FAIL", msg); };

const docs = {};
for (const name of ["words", "sentences", "missions", "characters", "achievements"]) {
  const validate = ajv.compile(read(path.join(dir, `${name}.schema.json`)));
  docs[name] = read(path.join(dir, "examples", `${name}.example.json`));
  if (!validate(docs[name])) fail(`${name}: ${ajv.errorsText(validate.errors)}`); else console.log("ok schema", name);
}

// Semantic rules a JSON Schema cannot express (to be re-implemented in the Kotlin/Node validator).
const words = docs.words.words;
const unique = (arr, label) => { if (new Set(arr).size !== arr.length) fail(`duplicate ${label}`); };
unique(words.map((w) => w.id), "word id");
unique(words.map((w) => w.imageId), "word imageId");
const isVowel = (c) => "aeiou".includes(c);
words.forEach((w) => {
  if (w.type === "vokal" && !isVowel(w.text[0])) fail(`vokal word must start with a vowel: ${w.text}`);
  if (w.type === "kvk" && !(w.text.length === 3 && !isVowel(w.text[0]) && isVowel(w.text[1]) && !isVowel(w.text[2]))) fail(`kvk shape: ${w.text}`);
  if (!fs.existsSync(path.join(repo, "assets/audio", `${w.audioId}.mp3`))) fail(`missing audio ${w.audioId}`);
  if (!w.exampleSentence.toLowerCase().includes(w.text)) fail(`example sentence lacks word: ${w.text}`);
});
docs.sentences.sentences.forEach((s) => {
  if (s.distractors.includes(s.answer)) fail(`distractor equals answer: ${s.id}`);
  if (!fs.existsSync(path.join(repo, "assets/audio", `${s.audioId}.mp3`))) fail(`missing audio ${s.audioId}`);
});
const pool = (type) => words.filter((w) => w.type === type).length;
docs.missions.missions.forEach((m) => {
  const size = m.pool.source === "sentences" ? docs.sentences.sentences.length : (m.pool.wordType === "any" ? words.length : pool(m.pool.wordType));
  m.levels.forEach((l) => { if (l.questionCount > size) fail(`${m.id} level ${l.index} needs ${l.questionCount} but pool has ${size}`); });
  if (m.id === "vokal" && m.levels.some((l) => l.optionCount > 5)) fail("vokal has only 5 vowels");
});
docs.missions.missions.forEach((m, i) => {
  if (i === 0 && m.unlockAfter) fail("first mission must be unlocked from the start");
  if (i > 0 && (!m.unlockAfter || m.unlockAfter.missionId !== docs.missions.missions[i - 1].id)) fail(`${m.id}: unlockAfter must reference the previous mission`);
  if (m.order !== i + 1) fail(`${m.id}: order must equal position`);
});
console.log(`words=${words.length} (vokal ${pool("vokal")}, kv ${pool("kv")}, kvk ${pool("kvk")}) sentences=${docs.sentences.sentences.length}`);
if (failures) { console.error(`${failures} failure(s)`); process.exit(1); }
console.log("ALL CHECKS PASSED");
