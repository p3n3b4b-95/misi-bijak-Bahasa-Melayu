(function (root, factory) {
  "use strict";

  const api = factory();

  if (typeof module === "object" && module.exports) {
    module.exports = api;
  }

  if (root) {
    root.GameCore = api;
  }

}(
  typeof window !== "undefined"
    ? window
    : typeof globalThis !== "undefined"
      ? globalThis
      : this,

  function () {
    "use strict";

    /*
     * =========================================================
     * MISI BIJAK BAHASA MELAYU
     * core.js
     * ---------------------------------------------------------
     * Pure game logic.
     *
     * Fail ini:
     * - TIDAK sentuh DOM
     * - TIDAK guna localStorage
     * - TIDAK main audio
     * - TIDAK urus CSS
     *
     * Semua fungsi boleh diuji melalui tests/core.test.js.
     * =========================================================
     */


    /*
     * =========================================================
     * CONSTANTS
     * =========================================================
     */

    const VOWELS = Object.freeze([
      "a",
      "e",
      "i",
      "o",
      "u"
    ]);

    const ALPHABET = Object.freeze(
      "abcdefghijklmnopqrstuvwxyz".split("")
    );

    const MIXED_MODES = Object.freeze([
      "vokal",
      "kv",
      "kvk",
      "padan",
      "susun",
      "hilang",
      "ayat"
    ]);


    /*
     * =========================================================
     * BASIC UTILITIES
     * =========================================================
     */

    function normalizeText(value) {
      return String(value || "")
        .trim()
        .toLowerCase();
    }


    function shuffle(items, random = Math.random) {
      const output = Array.isArray(items)
        ? items.slice()
        : [];

      for (let i = output.length - 1; i > 0; i -= 1) {
        const j = Math.floor(random() * (i + 1));

        [
          output[i],
          output[j]
        ] = [
          output[j],
          output[i]
        ];
      }

      return output;
    }


    function sample(items, count, random = Math.random) {
      if (!Array.isArray(items) || count <= 0) {
        return [];
      }

      return shuffle(items, random)
        .slice(0, count);
    }


    function randomItem(items, random = Math.random) {
      if (!Array.isArray(items) || !items.length) {
        return null;
      }

      return items[
        Math.floor(random() * items.length)
      ];
    }


    function unique(items) {
      return [
        ...new Set(
          (items || []).filter(
            (item) => item !== undefined &&
                      item !== null &&
                      item !== ""
          )
        )
      ];
    }


    /*
     * =========================================================
     * OPTION GENERATOR
     * =========================================================
     */

    function uniqueOptions(
      answer,
      candidates,
      count = 4,
      random = Math.random
    ) {
      const correct = normalizeText(answer);

      const pool = unique(
        (candidates || [])
          .map(normalizeText)
          .filter(Boolean)
      ).filter(
        (item) => item !== correct
      );

      const distractors = sample(
        pool,
        Math.max(0, count - 1),
        random
      );

      return shuffle(
        unique([
          correct,
          ...distractors
        ]),
        random
      );
    }


    /*
     * =========================================================
     * DATA HELPERS
     * =========================================================
     */

    function getWordById(data, id) {
      if (!data ||
          !Array.isArray(data.words)) {
        return null;
      }

      return data.words.find(
        (item) => item.id === id
      ) || null;
    }


    function getWordByName(data, word) {
      const target = normalizeText(word);

      if (!data ||
          !Array.isArray(data.words)) {
        return null;
      }

      return data.words.find(
        (item) =>
          normalizeText(item.word) === target
      ) || null;
    }


    function wordsByCategory(data, category) {
      if (!data ||
          !Array.isArray(data.words)) {
        return [];
      }

      return data.words.filter(
        (item) =>
          item.category === category
      );
    }


    function getMode(data, modeId) {
      if (!data ||
          !Array.isArray(data.modes)) {
        return null;
      }

      return data.modes.find(
        (mode) =>
          mode.id === modeId
      ) || null;
    }


    /*
     * =========================================================
     * VISUAL INFORMATION
     * =========================================================
     */

    function visualFromWord(item) {
      return {
        id: item.id || item.word,
        word: item.word,
        image: item.image || null,
        emoji: item.emoji || "❓",
        sentence: item.sentence || "",
        category: item.category || null,
        pattern: item.pattern || null,
        syllables: Array.isArray(item.syllables)
          ? item.syllables.slice()
          : [],
        difficulty: Number(item.difficulty || 1)
      };
    }


    /*
     * =========================================================
     * VOWEL HELPERS
     * =========================================================
     */

    function vowelsInWord(word) {
      return unique(
        normalizeText(word)
          .split("")
          .filter(
            (letter) =>
              VOWELS.includes(letter)
          )
      );
    }


    function firstVowel(word) {
      return vowelsInWord(word)[0] || "a";
    }


    /*
     * =========================================================
     * MISSING LETTER
     * =========================================================
     */

    function chooseMissingIndex(
      word,
      random = Math.random
    ) {
      const letters = normalizeText(word)
        .split("");

      if (!letters.length) {
        return 0;
      }

      /*
       * Elakkan sentiasa hilangkan huruf
       * pertama supaya visual lebih mudah
       * dibaca murid pemulihan.
       */

      const candidates =
        letters.length <= 2
          ? letters.map((_, index) => index)
          : letters
              .map((_, index) => index)
              .filter(
                (index) =>
                  index > 0 &&
                  index < letters.length - 1
              );

      return randomItem(
        candidates,
        random
      ) ?? 0;
    }


    function maskWord(word, missingIndex) {
      return normalizeText(word)
        .split("")
        .map(
          (letter, index) =>
            index === missingIndex
              ? "_"
              : letter
        )
        .join("");
    }


    /*
     * =========================================================
     * QUESTION BUILDERS
     * =========================================================
     */

    function buildVowelQuestion(
      item,
      data,
      random
    ) {
      const visual = visualFromWord(item);

      const availableVowels =
        vowelsInWord(item.word);

      const answer =
        randomItem(
          availableVowels,
          random
        ) || firstVowel(item.word);

      return {
        type: "choice",
        mode: "vokal",

        ...visual,

        prompt:
          `Pilih huruf vokal dalam perkataan "${item.word}".`,

        answer,

        options: shuffle(
          VOWELS,
          random
        )
      };
    }


    function buildKVQuestion(
      item,
      data,
      random
    ) {
      const visual = visualFromWord(item);

      const syllables =
        Array.isArray(item.syllables) &&
        item.syllables.length
          ? item.syllables
          : [item.word];

      const answer = syllables[0];

      /*
       * Ambil suku kata sebenar daripada
       * seluruh bank data supaya distractor
       * lebih relevan.
       */

      const syllablePool = unique(
        data.words.flatMap(
          (entry) =>
            Array.isArray(entry.syllables)
              ? entry.syllables
              : []
        )
      );

      return {
        type: "choice",
        mode: "kv",

        ...visual,

        prompt:
          `Pilih suku kata pertama bagi "${item.word}".`,

        answer,

        syllables:
          syllables.slice(),

        display:
          syllables.join(" + "),

        options:
          uniqueOptions(
            answer,
            syllablePool,
            4,
            random
          )
      };
    }


    function buildKVKQuestion(
      item,
      data,
      random
    ) {
      const visual =
        visualFromWord(item);

      const letters =
        normalizeText(item.word)
          .split("");

      /*
       * Untuk mode KVK:
       * fokus huruf tengah (vokal)
       * bagi perkataan tiga huruf.
       */

      const missingIndex =
        letters.length === 3
          ? 1
          : chooseMissingIndex(
              item.word,
              random
            );

      const answer =
        letters[missingIndex];

      return {
        type: "choice",
        mode: "kvk",

        ...visual,

        prompt:
          "Lengkapkan perkataan KVK.",

        answer,

        missingIndex,

        maskedWord:
          maskWord(
            item.word,
            missingIndex
          ),

        options:
          uniqueOptions(
            answer,
            VOWELS.includes(answer)
              ? VOWELS
              : ALPHABET,
            4,
            random
          )
      };
    }


    function buildMatchQuestion(
      item,
      data,
      random
    ) {
      const visual =
        visualFromWord(item);

      const candidates =
        data.words.map(
          (entry) => entry.word
        );

      return {
        type: "image-choice",
        mode: "padan",

        ...visual,

        prompt:
          `Pilih gambar untuk perkataan "${item.word}".`,

        answer:
          item.word,

        /*
         * app.js boleh resolve setiap
         * perkataan kepada image/emoji.
         */

        options:
          uniqueOptions(
            item.word,
            candidates,
            4,
            random
          )
      };
    }


    function buildArrangeQuestion(
      item,
      data,
      random
    ) {
      const visual =
        visualFromWord(item);

      const letters =
        normalizeText(item.word)
          .split("")
          .map(
            (letter, index) => ({
              id:
                `${item.id || item.word}-${index}`,

              letter,

              originalIndex:
                index
            })
          );

      return {
        type: "arrange",
        mode: "susun",

        ...visual,

        prompt:
          "Susun huruf menjadi perkataan yang betul.",

        answer:
          normalizeText(item.word),

        letters:
          shuffle(
            letters,
            random
          )
      };
    }


    function buildMissingQuestion(
      item,
      data,
      random
    ) {
      const visual =
        visualFromWord(item);

      const letters =
        normalizeText(item.word)
          .split("");

      const missingIndex =
        chooseMissingIndex(
          item.word,
          random
        );

      const answer =
        letters[missingIndex];

      /*
       * Distractor cuba ambil huruf
       * kategori sama dahulu:
       * vowel vs consonant.
       */

      const candidateLetters =
        VOWELS.includes(answer)
          ? VOWELS
          : ALPHABET.filter(
              (letter) =>
                !VOWELS.includes(letter)
            );

      return {
        type: "choice",
        mode: "hilang",

        ...visual,

        prompt:
          "Cari huruf yang hilang.",

        answer,

        missingIndex,

        maskedWord:
          maskWord(
            item.word,
            missingIndex
          ),

        options:
          uniqueOptions(
            answer,
            candidateLetters,
            4,
            random
          )
      };
    }


    function buildSentenceQuestion(
      sentenceEntry,
      data,
      random
    ) {
      const target =
        getWordById(
          data,
          sentenceEntry.answerId
        );

      if (!target) {
        throw new Error(
          `answerId "${sentenceEntry.answerId}" tidak ditemui dalam GAME_DATA.words`
        );
      }

      const visual =
        visualFromWord(target);

      /*
       * Utamakan distractor daripada
       * kategori sama supaya lebih masuk akal.
       */

      let candidatePool =
        data.words
          .filter(
            (word) =>
              word.category === target.category
          )
          .map(
            (word) => word.word
          );

      if (candidatePool.length < 4) {
        candidatePool =
          data.words.map(
            (word) => word.word
          );
      }

      return {
        type: "choice",
        mode: "ayat",

        ...visual,

        prompt:
          "Lengkapkan ayat.",

        sentence:
          sentenceEntry.sentence,

        answer:
          target.word,

        answerId:
          target.id,

        options:
          uniqueOptions(
            target.word,
            candidatePool,
            4,
            random
          )
      };
    }


    /*
     * =========================================================
     * GENERIC QUESTION BUILDER
     * =========================================================
     */

    function buildQuestion(
      mode,
      source,
      data,
      random = Math.random
    ) {
      if (!source) {
        throw new Error(
          `Tiada data untuk membina soalan mode "${mode}".`
        );
      }

      switch (mode) {

        case "vokal":
          return buildVowelQuestion(
            source,
            data,
            random
          );

        case "kv":
          return buildKVQuestion(
            source,
            data,
            random
          );

        case "kvk":
          return buildKVKQuestion(
            source,
            data,
            random
          );

        case "padan":
          return buildMatchQuestion(
            source,
            data,
            random
          );

        case "susun":
          return buildArrangeQuestion(
            source,
            data,
            random
          );

        case "hilang":
          return buildMissingQuestion(
            source,
            data,
            random
          );

        case "ayat":
          return buildSentenceQuestion(
            source,
            data,
            random
          );

        default:
          throw new Error(
            `Mod tidak dikenali: ${mode}`
          );
      }
    }


    /*
     * =========================================================
     * SOURCE POOL
     * =========================================================
     */

    function sourcePoolForMode(
      mode,
      data
    ) {
      switch (mode) {

        case "vokal":
          return wordsByCategory(
            data,
            "vokal"
          );

        case "kv":
          return wordsByCategory(
            data,
            "kv"
          );

        case "kvk":
          return wordsByCategory(
            data,
            "kvk"
          );

        case "padan":
        case "susun":
        case "hilang":
          return data.words.slice();

        case "ayat":
          return data.sentenceQuestions.slice();

        default:
          return [];
      }
    }


    /*
     * =========================================================
     * ROUND GENERATOR
     * =========================================================
     */

    function buildRound(
      mode,
      data,
      count,
      random = Math.random
    ) {
      if (!data ||
          !Array.isArray(data.words)) {

        throw new Error(
          "GAME_DATA tidak sah."
        );
      }

      const roundCount =
        Number(
          count ||
          data.settings
            ?.questionsPerRound ||
          10
        );

      if (
        !Number.isFinite(roundCount) ||
        roundCount <= 0
      ) {
        return [];
      }


      /*
       * =====================================================
       * MISSION CAMPURAN
       * =====================================================
       */

      if (mode === "campuran") {

        const result = [];

        let modeQueue =
          shuffle(
            MIXED_MODES,
            random
          );

        while (
          result.length <
          roundCount
        ) {

          if (!modeQueue.length) {
            modeQueue =
              shuffle(
                MIXED_MODES,
                random
              );
          }

          const selectedMode =
            modeQueue.shift();

          const pool =
            sourcePoolForMode(
              selectedMode,
              data
            );

          if (!pool.length) {
            continue;
          }

          const source =
            randomItem(
              pool,
              random
            );

          result.push(
            buildQuestion(
              selectedMode,
              source,
              data,
              random
            )
          );
        }

        return result;
      }


      /*
       * =====================================================
       * NORMAL MODE
       * =====================================================
       */

      const pool =
        sourcePoolForMode(
          mode,
          data
        );

      if (!pool.length) {
        throw new Error(
          `Tiada soalan tersedia untuk mode "${mode}".`
        );
      }

      const queue = [];

      while (
        queue.length <
        roundCount
      ) {
        queue.push(
          ...shuffle(
            pool,
            random
          )
        );
      }

      return queue
        .slice(
          0,
          roundCount
        )
        .map(
          (source) =>
            buildQuestion(
              mode,
              source,
              data,
              random
            )
        );
    }


    /*
     * =========================================================
     * ANSWER CHECKING
     * =========================================================
     */

    function isCorrectAnswer(
      question,
      submittedAnswer
    ) {
      if (!question) {
        return false;
      }

      return (
        normalizeText(
          submittedAnswer
        ) ===
        normalizeText(
          question.answer
        )
      );
    }


    /*
     * =========================================================
     * SCORING
     * =========================================================
     */

    function calculateScore(
      correctAnswers,
      totalQuestions,
      pointsPerCorrect = 10
    ) {
      const correct =
        Math.max(
          0,
          Number(correctAnswers) || 0
        );

      const total =
        Math.max(
          0,
          Number(totalQuestions) || 0
        );

      return (
        Math.min(
          correct,
          total
        ) *
        pointsPerCorrect
      );
    }


    function performanceStars(
      score,
      maximumScore
    ) {
      const maximum =
        Number(maximumScore) || 0;

      if (
        maximum <= 0
      ) {
        return 0;
      }

      const ratio =
        Number(score || 0) /
        maximum;

      if (ratio >= 0.8) {
        return 3;
      }

      if (ratio >= 0.6) {
        return 2;
      }

      if (ratio >= 0.4) {
        return 1;
      }

      return 0;
    }


    /*
     * =========================================================
     * REWARD
     * =========================================================
     */

    function rewardForScore(
      score,
      maximumScore,
      rewards = []
    ) {
      if (!rewards.length) {
        return null;
      }

      const percentage =
        maximumScore > 0
          ? Math.round(
              (
                score /
                maximumScore
              ) * 100
            )
          : 0;

      const ordered =
        rewards
          .slice()
          .sort(
            (a, b) =>
              Number(
                b.minimumScore
              ) -
              Number(
                a.minimumScore
              )
          );

      return (
        ordered.find(
          (reward) =>
            percentage >=
            reward.minimumScore
        ) ||
        ordered[
          ordered.length - 1
        ]
      );
    }


    /*
     * =========================================================
     * LEVEL / PROGRESS
     * =========================================================
     */

    function levelForStars(
      stars,
      levels = []
    ) {
      const totalStars =
        Math.max(
          0,
          Number(stars) || 0
        );

      if (!levels.length) {
        return null;
      }

      const ordered =
        levels
          .slice()
          .sort(
            (a, b) =>
              Number(
                a.requiredStars || 0
              ) -
              Number(
                b.requiredStars || 0
              )
          );

      let current =
        ordered[0];

      ordered.forEach(
        (level) => {

          if (
            totalStars >=
            Number(
              level.requiredStars || 0
            )
          ) {
            current = level;
          }
        }
      );

      const currentIndex =
        ordered.findIndex(
          (level) =>
            level.id ===
            current.id
        );

      const next =
        ordered[
          currentIndex + 1
        ] || null;

      return {
        ...current,

        currentStars:
          totalStars,

        nextLevel:
          next,

        starsToNext:
          next
            ? Math.max(
                0,
                Number(
                  next.requiredStars
                ) -
                totalStars
              )
            : 0
      };
    }


    function isModeUnlocked(
      modeId,
      stars,
      data
    ) {
      const mode =
        getMode(
          data,
          modeId
        );

      if (!mode) {
        return false;
      }

      return (
        Number(stars || 0) >=
        Number(
          mode.unlockStars || 0
        )
      );
    }


    /*
     * =========================================================
     * LEGACY RANK
     *
     * Boleh digunakan untuk header/profile.
     * =========================================================
     */

    function rankFor(stars) {
      const total =
        Number(stars || 0);

      if (total >= 150) {
        return {
          name:
            "Wira Bahasa",

          icon:
            "🏆",

          nextAt:
            null
        };
      }

      if (total >= 80) {
        return {
          name:
            "Jaguh Membaca",

          icon:
            "🦸",

          nextAt:
            150
        };
      }

      if (total >= 30) {
        return {
          name:
            "Bintang Bahasa",

          icon:
            "⭐",

          nextAt:
            80
        };
      }

      return {
        name:
          "Tunas Bahasa",

        icon:
          "🌱",

        nextAt:
          30
      };
    }


    /*
     * =========================================================
     * QUESTION VALIDATION
     * =========================================================
     */

    function validateQuestion(question) {
      if (!question) {
        return false;
      }

      if (!question.mode) {
        return false;
      }

      if (
        question.answer ===
        undefined ||
        question.answer ===
        null
      ) {
        return false;
      }

      if (
        question.type === "choice" ||
        question.type === "image-choice"
      ) {

        if (
          !Array.isArray(
            question.options
          ) ||
          !question.options.length
        ) {
          return false;
        }

        if (
          !question.options
            .map(normalizeText)
            .includes(
              normalizeText(
                question.answer
              )
            )
        ) {
          return false;
        }
      }

      return true;
    }


    /*
     * =========================================================
     * DATA VALIDATION
     * =========================================================
     */

    function validateGameData(data) {
      const errors = [];

      if (!data) {
        return [
          "GAME_DATA tidak dijumpai."
        ];
      }

      if (
        !Array.isArray(data.words) ||
        !data.words.length
      ) {
        errors.push(
          "GAME_DATA.words kosong."
        );
      }

      if (
        !Array.isArray(
          data.sentenceQuestions
        )
      ) {
        errors.push(
          "GAME_DATA.sentenceQuestions tidak sah."
        );
      }

      if (
        !Array.isArray(data.modes)
      ) {
        errors.push(
          "GAME_DATA.modes tidak sah."
        );
      }


      /*
       * Check duplicate IDs.
       */

      const ids =
        (data.words || [])
          .map(
            (item) =>
              item.id
          )
          .filter(Boolean);

      const duplicateIds =
        ids.filter(
          (id, index) =>
            ids.indexOf(id) !== index
        );

      if (
        duplicateIds.length
      ) {
        errors.push(
          `Duplicate word ID: ${
            unique(
              duplicateIds
            ).join(", ")
          }`
        );
      }


      /*
       * Check sentence answerId.
       */

      (
        data.sentenceQuestions ||
        []
      ).forEach(
        (entry) => {

          if (
            !entry.answerId
          ) {
            errors.push(
              `Ayat "${entry.id || "tanpa-id"}" tiada answerId.`
            );

            return;
          }

          if (
            !getWordById(
              data,
              entry.answerId
            )
          ) {
            errors.push(
              `answerId "${entry.answerId}" tidak dijumpai.`
            );
          }
        }
      );

      return errors;
    }


    /*
     * =========================================================
     * PUBLIC API
     * =========================================================
     */

    return Object.freeze({

      VOWELS,

      ALPHABET,

      MIXED_MODES,

      normalizeText,

      shuffle,

      sample,

      randomItem,

      unique,

      uniqueOptions,

      getWordById,

      getWordByName,

      wordsByCategory,

      getMode,

      visualFromWord,

      vowelsInWord,

      firstVowel,

      chooseMissingIndex,

      maskWord,

      buildQuestion,

      buildRound,

      isCorrectAnswer,

      calculateScore,

      performanceStars,

      rewardForScore,

      levelForStars,

      isModeUnlocked,

      rankFor,

      validateQuestion,

      validateGameData

    });

  }
));
