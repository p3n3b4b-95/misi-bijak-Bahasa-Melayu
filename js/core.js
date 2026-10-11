(function (root, factory) {
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  if (root) root.GameCore = api;
}(typeof window !== "undefined" ? window : globalThis, function () {
  "use strict";

  const VOWELS = ["a", "e", "i", "o", "u"];

  function shuffle(items, random = Math.random) {
    const output = items.slice();
    for (let i = output.length - 1; i > 0; i -= 1) {
      const j = Math.floor(random() * (i + 1));
      [output[i], output[j]] = [output[j], output[i]];
    }
    return output;
  }

  function sample(items, count, random = Math.random) {
    return shuffle(items, random).slice(0, count);
  }

  function uniqueOptions(answer, candidates, count = 4, random = Math.random) {
    const others = [...new Set(candidates)].filter((item) => item !== answer);
    return shuffle([answer, ...sample(others, Math.max(0, count - 1), random)], random);
  }

  function buildQuestion(mode, item, allWords, sentences, random = Math.random) {
    const base = { mode, word: item.word, emoji: item.emoji, answer: item.word };
    const wordNames = allWords.map((entry) => entry.word);

    if (mode === "vokal") {
      const firstVowel = item.word.split("").find((letter) => VOWELS.includes(letter)) || "a";
      return { ...base, answer: firstVowel, options: shuffle(VOWELS, random) };
    }
    if (mode === "kv") {
      const syllables = item.word.match(/[^aeiou]*[aeiou]+/g) || [item.word];
      const answer = syllables[0];
      const pool = ["ba", "bi", "bu", "ka", "ki", "ku", "ma", "mi", "mu", "ro", "su", "to"];
      return { ...base, answer, display: `${answer} + ${item.word.slice(answer.length)}`, options: uniqueOptions(answer, pool, 4, random) };
    }
    if (mode === "kvk") {
      const missingIndex = 1;
      return { ...base, answer: item.word[missingIndex], missingIndex, options: uniqueOptions(item.word[missingIndex], "abcdefghijklmnopqrstuvwxyz".split(""), 4, random) };
    }
    if (mode === "padan") {
      return { ...base, options: uniqueOptions(item.word, wordNames, 4, random) };
    }
    if (mode === "susun") {
      return { ...base, letters: shuffle(item.word.split("").map((letter, index) => ({ letter, index })), random) };
    }
    if (mode === "ayat") {
      const selected = sentences.find((entry) => entry.answer === item.word) || sentences[0];
      return { ...base, word: selected.answer, answer: selected.answer, emoji: selected.emoji, sentence: selected.sentence, options: uniqueOptions(selected.answer, wordNames, 4, random) };
    }
    throw new Error(`Mod tidak dikenali: ${mode}`);
  }

  function buildRound(mode, data, count = 8, random = Math.random) {
    let pool = data.words;
    if (mode === "vokal") pool = data.words.filter((item) => item.type === "vokal");
    if (mode === "kv") pool = data.words.filter((item) => item.type === "kv");
    if (mode === "kvk") pool = data.words.filter((item) => item.type === "kvk");
    if (mode === "ayat") {
      pool = data.sentenceQuestions.map((entry) => ({ word: entry.answer, emoji: entry.emoji, type: "ayat" }));
    }
    const queue = [];
    while (queue.length < count) queue.push(...shuffle(pool, random));
    return queue.slice(0, count).map((item) => buildQuestion(mode, item, data.words, data.sentenceQuestions, random));
  }

  function rankFor(stars) {
    if (stars >= 480) return { name: "Wira Bahasa", icon: "🏆", nextAt: null };
    if (stars >= 240) return { name: "Jaguh Membaca", icon: "🦸", nextAt: 480 };
    if (stars >= 80) return { name: "Bintang Bahasa", icon: "⭐", nextAt: 240 };
    return { name: "Tunas Bahasa", icon: "🌱", nextAt: 80 };
  }

  function performanceStars(score, total) {
    const ratio = total ? score / total : 0;
    if (ratio >= .875) return 3;
    if (ratio >= .625) return 2;
    if (ratio >= .375) return 1;
    return 0;
  }

  return { VOWELS, shuffle, sample, uniqueOptions, buildQuestion, buildRound, rankFor, performanceStars };
}));
