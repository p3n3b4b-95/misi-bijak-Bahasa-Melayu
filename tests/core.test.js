const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../js/core.js");

const data = {
  words: [
    { word: "api", emoji: "🔥", type: "vokal" },
    { word: "baju", emoji: "👕", type: "kv" },
    { word: "bola", emoji: "⚽", type: "kv" },
    { word: "bas", emoji: "🚌", type: "kvk" },
    { word: "jam", emoji: "⏰", type: "kvk" }
  ],
  sentenceQuestions: [{ sentence: "Ali sepak ____.", answer: "bola", emoji: "⚽" }]
};

test("uniqueOptions keeps one answer and unique choices", () => {
  const options = Core.uniqueOptions("a", ["a", "e", "i", "o", "u"], 4, () => .3);
  assert.equal(options.length, 4);
  assert.equal(new Set(options).size, 4);
  assert.ok(options.includes("a"));
});

test("each supported mode builds a valid question", () => {
  const items = { vokal: data.words[0], kv: data.words[1], kvk: data.words[3], padan: data.words[2], susun: data.words[4], ayat: data.words[2] };
  Object.entries(items).forEach(([mode, item]) => {
    const question = Core.buildQuestion(mode, item, data.words, data.sentenceQuestions, () => .42);
    assert.equal(question.mode, mode);
    assert.ok(question.answer);
  });
});

test("buildRound returns requested count", () => {
  assert.equal(Core.buildRound("kv", data, 8, () => .25).length, 8);
});

test("rank thresholds are stable", () => {
  assert.equal(Core.rankFor(0).name, "Tunas Bahasa");
  assert.equal(Core.rankFor(80).name, "Bintang Bahasa");
  assert.equal(Core.rankFor(240).name, "Jaguh Membaca");
  assert.equal(Core.rankFor(480).name, "Wira Bahasa");
});

test("performance converts score to zero through three stars", () => {
  assert.equal(Core.performanceStars(20, 80), 0);
  assert.equal(Core.performanceStars(30, 80), 1);
  assert.equal(Core.performanceStars(50, 80), 2);
  assert.equal(Core.performanceStars(70, 80), 3);
});
