const test = require("node:test");
const assert = require("node:assert/strict");
const Core = require("../js/core.js");
global.window = {};
require("../js/questions.js");
const liveData = global.window.GAME_DATA;

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
  assert.equal(Core.buildRound("padan", data, 4, () => .25).length, 4);
});

test("buildRound never repeats a question", () => {
  const round = Core.buildRound("padan", data, 5, () => .25);
  assert.equal(new Set(round.map(({ word }) => word)).size, round.length);
});

test("every live mission has eight unique questions", () => {
  liveData.modes.forEach(({ id }) => {
    const round = Core.buildRound(id, liveData, 8, () => .25);
    assert.equal(round.length, 8, id);
    assert.equal(new Set(round.map(({ word }) => word)).size, 8, id);
  });
});

test("the next round avoids every question from the previous round", () => {
  liveData.modes.forEach(({ id }) => {
    const first = Core.buildRound(id, liveData, 8, () => .25);
    const second = Core.buildRound(id, liveData, 8, () => .75, first.map(({ word }) => word));
    assert.equal(second.filter(({ word }) => first.some((item) => item.word === word)).length, 0, id);
  });
});

test("each picture represents only one word", () => {
  const picturedWords = new Map();
  liveData.words.forEach(({ word, emoji }) => {
    assert.equal(picturedWords.has(emoji), false, `${emoji} is shared by ${picturedWords.get(emoji)} and ${word}`);
    picturedWords.set(emoji, word);
  });
  liveData.sentenceQuestions.forEach(({ answer, emoji }) => {
    const matchingWord = liveData.words.find(({ word }) => word === answer);
    if (matchingWord) assert.equal(emoji, matchingWord.emoji, answer);
  });
});

test("sentence prompts and answers are not duplicated", () => {
  const sentences = liveData.sentenceQuestions.map(({ sentence }) => sentence);
  const answers = liveData.sentenceQuestions.map(({ answer }) => answer);
  assert.equal(new Set(sentences).size, sentences.length);
  assert.equal(new Set(answers).size, answers.length);
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

test("result sync retries failures but accepts saved duplicates", async () => {
  const results = [{ id: "saved" }, { id: "duplicate" }, { id: "failed" }];
  const statuses = { saved: 201, duplicate: 409, failed: 500 };
  assert.deepEqual(await Core.unsentResults(results, async ({ id }) => statuses[id]), [{ id: "failed" }]);
});

test("dashboard keeps only the latest daily result per pupil and mission", () => {
  const rows = [
    { student_name: "Aina", class_name: "1Amanah", mission_id: "vokal", score: 80 },
    { student_name: "aina", class_name: "1Amanah", mission_id: "vokal", score: 40 },
    { student_name: "Aina", class_name: "1Amanah", mission_id: "kv", score: 60 }
  ];
  assert.deepEqual(Core.latestResults(rows).map(({ score }) => score), [80, 60]);
});
