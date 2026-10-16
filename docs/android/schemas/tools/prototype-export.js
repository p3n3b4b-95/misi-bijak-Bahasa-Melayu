// PROTOTYPE ONLY (Phase 2). Reads js/questions.js read-only and writes example
// content JSON. The product exporter (tools/export-content.js) is an M0 task.
"use strict";
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const repo = path.join(__dirname, "../../../..");
const outDir = path.join(__dirname, "../examples");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(repo, "js/questions.js"), "utf8"), context);
const data = context.window.GAME_DATA;
const header = { schemaVersion: 1, contentVersion: "0.1.0" };
const write = (name, body) => fs.writeFileSync(path.join(outDir, name), JSON.stringify({ ...header, ...body }, null, 2) + "\n");

write("words.example.json", {
  words: data.words.map((w) => ({
    id: w.word, text: w.word, type: w.type,
    imageId: `img_${w.word}`, audioId: w.word,
    exampleSentence: w.sentence, status: "draft"
  }))
});

write("sentences.example.json", {
  sentences: data.sentenceQuestions.map((s) => ({
    id: `sent_${s.answer}`, textWithBlank: s.sentence, answer: s.answer,
    imageId: `img_${s.answer}`, audioId: `ayat-${s.answer}`,
    distractors: [], status: "draft"
  }))
});

const level = (index, optionCount, showPicture, autoPlayVoice, questionCount = 8) =>
  ({ index, questionCount, optionCount, showPicture, autoPlayVoice, starsRequiredToUnlockNext: 1 });
const levels = (full) => [level(1, 3, true, true), level(2, full, true, false), level(3, full, false, false)];
const wordType = { vokal: "vokal", kv: "kv", kvk: "kvk", padan: "any", susun: "any", ayat: "any" };
write("missions.example.json", {
  missions: data.modes.map((m, i) => ({
    id: m.id, order: i + 1, titleKey: `mission_${m.id}_title`, descriptionKey: `mission_${m.id}_desc`,
    iconId: `ic_mission_${m.id}`, tone: m.tone,
    ...(i === 0 ? {} : { unlockAfter: { missionId: data.modes[i - 1].id, levelIndex: 1 } }),
    pool: { source: m.id === "ayat" ? "sentences" : "words", wordType: wordType[m.id] },
    levels: levels(m.id === "vokal" ? 5 : 4)
  }))
});

write("characters.example.json", {
  characters: [1, 2, 3].map((n) => ({
    id: `char_placeholder_${n}`, nameKey: `char_placeholder_${n}_name`, descriptionKey: `char_placeholder_${n}_desc`,
    poses: { idle: `img_char_placeholder_${n}_idle`, happy: `img_char_placeholder_${n}_happy`, encouraging: `img_char_placeholder_${n}_encourage` }
  }))
});

const ach = (id, type, threshold, missionId) => ({
  id: `ach_${id}`, titleKey: `ach_${id}_title`, descriptionKey: `ach_${id}_desc`, iconId: `ic_ach_${id}`,
  status: "proposed", rule: { type, threshold, ...(missionId ? { missionId } : {}) }
});
write("achievements.example.json", {
  achievements: [
    ach("first_round", "roundsCompleted", 1), ach("rounds_5", "roundsCompleted", 5), ach("rounds_10", "roundsCompleted", 10),
    ach("first_perfect", "perfectRounds", 1), ach("points_80", "totalPoints", 80),
    ach("rank_2", "rankReached", 2), ach("rank_3", "rankReached", 3), ach("rank_4", "rankReached", 4),
    ach("vokal_master", "missionAllLevels3Stars", 1, "vokal")
  ]
});
console.log("examples written to", outDir);
