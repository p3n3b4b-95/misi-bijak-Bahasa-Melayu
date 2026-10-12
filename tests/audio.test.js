const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

test("every question has a bundled audio fallback", () => {
  const context = { window: {} };
  vm.runInNewContext(fs.readFileSync(path.join(__dirname, "../js/questions.js"), "utf8"), context);
  const data = context.window.GAME_DATA;
  const names = [
    ...data.words.map(({ word }) => word),
    ...data.sentenceQuestions.map(({ answer }) => `ayat-${answer}`),
    "tap", "wrong", "success"
  ];

  names.forEach((name) => {
    const file = path.join(__dirname, `../assets/audio/${name}.mp3`);
    assert.ok(fs.existsSync(file), `missing audio: ${name}`);
    assert.ok(fs.statSync(file).size > 0, `empty audio: ${name}`);
  });
});
