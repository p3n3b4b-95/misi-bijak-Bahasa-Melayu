(function () {
  "use strict";

  /*
   * =========================================================
   * MISI BIJAK BAHASA MELAYU
   * app.js
   * ---------------------------------------------------------
   * UI / DOM / Audio / Progress
   *
   * Bergantung kepada:
   *   questions.js -> window.GAME_DATA
   *   core.js      -> window.GameCore
   * =========================================================
   */

  const DATA = window.GAME_DATA;
  const Core = window.GameCore;

  const $ = (id) => document.getElementById(id);

  /*
   * =========================================================
   * SAFETY CHECK
   * =========================================================
   */

  if (!DATA) {
    console.error("GAME_DATA tidak dijumpai. Pastikan questions.js dimuatkan dahulu.");
    return;
  }

  if (!Core) {
    console.error("GameCore tidak dijumpai. Pastikan core.js dimuatkan dahulu.");
    return;
  }

  const dataErrors = Core.validateGameData(DATA);

  if (dataErrors.length) {
    console.error("GAME_DATA mempunyai masalah:", dataErrors);
  }


  /*
   * =========================================================
   * SETTINGS
   * =========================================================
   */

  const settings = DATA.settings || {};

  const QUESTIONS_PER_ROUND =
    Number(settings.questionsPerRound) || 10;

  const POINTS_PER_CORRECT =
    Number(settings.pointsPerCorrectAnswer) || 10;

  const SPEECH_LANGUAGE =
    settings.speechLanguage || "ms-MY";

  const SPEECH_RATE =
    Number(settings.speechRate) || 0.72;

  /*
   * v2 sengaja digunakan.
   * Sistem lama menyimpan score sebagai stars.
   * Sistem baru stars = 0..3 setiap round.
   */
  const STORAGE_KEY = "misiBijakBM.v2";


  /*
   * =========================================================
   * STATE
   * =========================================================
   */

  const defaultProgress = {
    stars: 0,
    best: {},
    name: "",
    sound: true,
    completedRounds: 0
  };

  let progress = loadProgress();

  let currentMode = "vokal";
  let questions = [];
  let questionIndex = 0;
  let score = 0;
  let locked = false;
  let chosenLetters = [];

  let audioContext = null;


  /*
   * =========================================================
   * STORAGE
   * =========================================================
   */

  function loadProgress() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        return { ...defaultProgress };
      }

      const saved = JSON.parse(raw);

      if (!saved || typeof saved !== "object") {
        return { ...defaultProgress };
      }

      return {
        ...defaultProgress,
        ...saved,
        best: {
          ...defaultProgress.best,
          ...(saved.best || {})
        }
      };

    } catch (error) {
      console.warn("Progress tidak dapat dibaca:", error);
      return { ...defaultProgress };
    }
  }


  function saveProgress() {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(progress)
      );
    } catch (error) {
      console.warn(
        "Progress tidak dapat disimpan.",
        error
      );
    }
  }


  /*
   * =========================================================
   * GENERAL HELPERS
   * =========================================================
   */

  function randomItem(items) {
    if (!Array.isArray(items) || !items.length) {
      return "";
    }

    return items[
      Math.floor(Math.random() * items.length)
    ];
  }


  function currentQuestion() {
    return questions[questionIndex] || null;
  }


  function currentModeData() {
    return DATA.modes.find(
      (mode) => mode.id === currentMode
    ) || DATA.modes[0];
  }


  function getWord(wordName) {
    return Core.getWordByName(
      DATA,
      wordName
    );
  }


  /*
   * =========================================================
   * SCREEN
   * =========================================================
   */

  function showScreen(id) {
    [
      "homeScreen",
      "gameScreen",
      "resultScreen"
    ].forEach((screenId) => {
      const screen = $(screenId);

      if (!screen) {
        return;
      }

      screen.classList.toggle(
        "hidden",
        screenId !== id
      );
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }


  /*
   * =========================================================
   * HOME SCREEN
   * =========================================================
   */

  function updateHome() {
    if ($("totalStars")) {
      $("totalStars").textContent =
        `⭐ ${progress.stars}`;
    }

    if ($("studentName")) {
      $("studentName").value =
        progress.name || "";
    }

    updateSoundButton();
    updatePlayerLevel();
    renderMissionCards();
  }


  function updateSoundButton() {
    const button = $("soundToggle");

    if (!button) {
      return;
    }

    button.setAttribute(
      "aria-pressed",
      String(progress.sound)
    );

    button.innerHTML =
      progress.sound
        ? "🔊 Bunyi"
        : "🔇 Senyap";
  }


  function updatePlayerLevel() {
    const level =
      Core.levelForStars(
        progress.stars,
        DATA.levels || []
      );

    if (level) {

      if ($("rankIcon")) {
        $("rankIcon").textContent =
          level.badge || "🌱";
      }

      if ($("rankName")) {
        $("rankName").textContent =
          level.title;
      }

      if ($("rankHint")) {

        if (level.nextLevel) {
          $("rankHint").textContent =
            `Kumpul ${level.starsToNext} bintang lagi untuk buka "${level.nextLevel.title}".`;
        } else {
          $("rankHint").textContent =
            "Tahap tertinggi sudah dicapai!";
        }
      }

      return;
    }

    /*
     * fallback
     */

    const rank =
      Core.rankFor(
        progress.stars
      );

    if ($("rankIcon")) {
      $("rankIcon").textContent =
        rank.icon;
    }

    if ($("rankName")) {
      $("rankName").textContent =
        rank.name;
    }
  }


  function renderMissionCards() {
    const grid =
      $("missionGrid");

    if (!grid) {
      return;
    }

    grid.innerHTML = "";

    DATA.modes.forEach((mode) => {

      const unlocked =
        Core.isModeUnlocked(
          mode.id,
          progress.stars,
          DATA
        );

      const best =
        Number(
          progress.best[mode.id] || 0
        );

      const button =
        document.createElement("button");

      button.type =
        "button";

      button.className =
        "mission-card";

      button.dataset.mode =
        mode.id;

      button.dataset.tone =
        mode.tone || "blue";

      button.disabled =
        !unlocked;

      if (!unlocked) {
        button.classList.add(
          "locked"
        );
      }

      const lockText =
        unlocked
          ? `⭐ Terbaik ${best}`
          : `🔒 ${mode.unlockStars} bintang`;

      button.innerHTML = `
        <span class="mission-best">
          ${lockText}
        </span>

        <span
          class="mission-icon"
          aria-hidden="true"
        >
          ${mode.mascot || mode.icon}
        </span>

        <span
          class="mission-small-icon"
          aria-hidden="true"
        >
          ${mode.icon}
        </span>

        <h3>${mode.title}</h3>

        <p>
          ${mode.description}
        </p>
      `;

      if (unlocked) {

        button.addEventListener(
          "click",
          () => startGame(mode.id)
        );

      } else {

        button.setAttribute(
          "aria-label",
          `${mode.title}. Perlu ${mode.unlockStars} bintang untuk dibuka.`
        );
      }

      grid.appendChild(button);
    });
  }


  /*
   * =========================================================
   * START GAME
   * =========================================================
   */

  function startGame(modeId) {
    const mode =
      DATA.modes.find(
        (entry) =>
          entry.id === modeId
      ) || DATA.modes[0];

    if (
      !Core.isModeUnlocked(
        mode.id,
        progress.stars,
        DATA
      )
    ) {
      return;
    }

    if ($("studentName")) {
      progress.name =
        $("studentName")
          .value
          .trim()
          .slice(0, 30);
    }

    saveProgress();

    currentMode =
      mode.id;

    try {

      questions =
        Core.buildRound(
          currentMode,
          DATA,
          QUESTIONS_PER_ROUND
        );

    } catch (error) {

      console.error(error);

      alert(
        "Permainan tidak dapat dimulakan. Sila semak data soalan."
      );

      return;
    }

    if (!questions.length) {
      return;
    }

    questionIndex = 0;
    score = 0;
    locked = false;

    if ($("missionIcon")) {
      $("missionIcon").textContent =
        mode.mascot ||
        mode.icon;
    }

    if ($("missionTitle")) {
      $("missionTitle").textContent =
        mode.title;
    }

    showScreen(
      "gameScreen"
    );

    renderQuestion();
  }


  /*
   * =========================================================
   * QUESTION RENDER
   * =========================================================
   */

  function renderQuestion() {
    locked = false;
    chosenLetters = [];

    const question =
      currentQuestion();

    if (!question) {
      finishGame();
      return;
    }

    if ($("questionCount")) {
      $("questionCount").textContent =
        `${questionIndex + 1} / ${questions.length}`;
    }

    if ($("gameScore")) {
      $("gameScore").textContent =
        `⭐ ${score}`;
    }

    if ($("progressBar")) {
      $("progressBar").style.width =
        `${(questionIndex / questions.length) * 100}%`;
    }

    if ($("feedback")) {
      $("feedback").textContent = "";
      $("feedback").className =
        "feedback";
    }

    if ($("nextButton")) {
      $("nextButton").classList.add(
        "hidden"
      );
    }

    if ($("listenButton")) {
      $("listenButton").classList.remove(
        "hidden"
      );
    }

    renderMainVisual(question);

    const views = {

      vokal:
        () => renderChoice(
          `Huruf vokal dalam "${question.word}" ialah...`,
          "Lihat gambar, dengar perkataan dan pilih huruf.",
          question.options
        ),

      kv:
        () => renderChoice(
          `Suku kata pertama bagi "${question.word}" ialah...`,
          question.display ||
            "Pilih suku kata yang betul.",
          question.options
        ),

      kvk:
        () => renderChoice(
          spacedWord(
            question.maskedWord
          ),
          "Lengkapkan perkataan KVK.",
          question.options
        ),

      hilang:
        () => renderChoice(
          spacedWord(
            question.maskedWord
          ),
          "Huruf manakah yang hilang?",
          question.options
        ),

      padan:
        () =>
          renderPictureMatch(
            question
          ),

      susun:
        () =>
          renderLetterSort(
            question
          ),

      ayat:
        () => renderChoice(
          question.sentence,
          "Pilih perkataan yang melengkapkan ayat.",
          question.options
        )
    };

    const renderer =
      views[question.mode];

    if (!renderer) {
      console.error(
        "Renderer tidak dijumpai:",
        question.mode
      );

      return;
    }

    renderer();
  }


  function spacedWord(value) {
    return String(value || "")
      .split("")
      .join("  ");
  }


  /*
   * =========================================================
   * MAIN VISUAL
   * =========================================================
   */

  function renderMainVisual(question) {
    const stage =
      $("pictureStage");

    const emojiElement =
      $("pictureEmoji");

    const label =
      $("pictureLabel");

    if (!stage) {
      return;
    }

    /*
     * Remove previous image.
     */

    stage
      .querySelectorAll(
        ".generated-picture"
      )
      .forEach(
        (element) =>
          element.remove()
      );

    if (label) {
      label.textContent = "";
    }

    if (emojiElement) {
      emojiElement.style.display =
        "none";
    }

    /*
     * Untuk padan gambar:
     * murid kena pilih gambar.
     */

    if (question.mode === "padan") {

      if (emojiElement) {
        emojiElement.style.display =
          "";
        emojiElement.textContent =
          "❓";
      }

      if (label) {
        label.textContent =
          question.word;
      }

      stage.setAttribute(
        "aria-label",
        `Cari gambar ${question.word}`
      );

      return;
    }

    stage.setAttribute(
      "aria-label",
      `Gambar ${question.word}`
    );

    /*
     * Try SVG / image first.
     */

    if (question.image) {

      const image =
        document.createElement("img");

      image.className =
        "generated-picture";

      image.src =
        question.image;

      image.alt =
        question.word;

      image.loading =
        "eager";

      image.draggable =
        false;

      image.addEventListener(
        "load",
        () => {

          if (emojiElement) {
            emojiElement.style.display =
              "none";
          }
        }
      );

      image.addEventListener(
        "error",
        () => {

          image.remove();

          if (emojiElement) {
            emojiElement.style.display =
              "";
            emojiElement.textContent =
              question.emoji || "❓";
          }
        }
      );

      stage.appendChild(image);

      return;
    }

    /*
     * Emoji fallback.
     */

    if (emojiElement) {
      emojiElement.style.display =
        "";

      emojiElement.textContent =
        question.emoji || "❓";
    }
  }


  /*
   * =========================================================
   * STANDARD CHOICE
   * =========================================================
   */

  function renderChoice(
    title,
    instruction,
    options
  ) {
    if ($("questionText")) {
      $("questionText").textContent =
        title;
    }

    if ($("instruction")) {
      $("instruction").textContent =
        instruction;
    }

    const interaction =
      $("interaction");

    if (!interaction) {
      return;
    }

    interaction.innerHTML =
      '<div class="choices"></div>';

    const choices =
      interaction.querySelector(
        ".choices"
      );

    options.forEach((option) => {

      const button =
        document.createElement(
          "button"
        );

      button.type =
        "button";

      button.className =
        "choice";

      button.dataset.answer =
        option;

      button.textContent =
        option;

      button.addEventListener(
        "click",
        () =>
          checkAnswer(option)
      );

      choices.appendChild(button);
    });
  }


  /*
   * =========================================================
   * IMAGE MATCH
   * =========================================================
   */

  function renderPictureMatch(
    question
  ) {
    if ($("questionText")) {
      $("questionText").textContent =
        `Cari gambar "${question.word}"`;
    }

    if ($("instruction")) {
      $("instruction").textContent =
        "Tekan gambar yang sepadan dengan perkataan.";
    }

    const interaction =
      $("interaction");

    interaction.innerHTML =
      '<div class="choices image-choices"></div>';

    const choices =
      interaction.querySelector(
        ".choices"
      );

    question.options.forEach(
      (option) => {

        const item =
          getWord(option);

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "choice emoji-choice";

        button.dataset.answer =
          option;

        button.setAttribute(
          "aria-label",
          option
        );

        const visual =
          document.createElement(
            "span"
          );

        visual.className =
          "choice-visual";

        button.appendChild(
          visual
        );

        if (
          item &&
          item.image
        ) {

          const image =
            document.createElement(
              "img"
            );

          image.src =
            item.image;

          image.alt =
            option;

          image.className =
            "choice-image";

          image.draggable =
            false;

          image.addEventListener(
            "error",
            () => {

              image.remove();

              visual.textContent =
                item.emoji || "❔";
            }
          );

          visual.appendChild(
            image
          );

        } else {

          visual.textContent =
            item
              ? item.emoji
              : "❔";
        }

        button.addEventListener(
          "click",
          () =>
            checkAnswer(option)
        );

        choices.appendChild(
          button
        );
      }
    );
  }


  /*
   * =========================================================
   * LETTER SORT
   * =========================================================
   */

  function renderLetterSort(
    question
  ) {
    if ($("questionText")) {
      $("questionText").textContent =
        "Susun huruf menjadi perkataan";
    }

    if ($("instruction")) {
      $("instruction").textContent =
        "Tekan huruf mengikut urutan yang betul.";
    }

    const interaction =
      $("interaction");

    interaction.innerHTML = `
      <div
        class="answer-slots"
        id="answerSlots"
      ></div>

      <div
        class="piece-row"
        id="pieceRow"
      ></div>

      <div class="game-buttons">
        <button
          class="button button-soft"
          id="clearLetters"
          type="button"
        >
          ↻ Cuba semula
        </button>

        <button
          class="button button-primary"
          id="checkLetters"
          type="button"
        >
          ✓ Semak
        </button>
      </div>
    `;

    const slots =
      $("answerSlots");

    question.word
      .split("")
      .forEach(() => {

        const slot =
          document.createElement(
            "span"
          );

        slot.className =
          "letter-slot";

        slot.innerHTML =
          "&nbsp;";

        slots.appendChild(slot);
      });

    const row =
      $("pieceRow");

    question.letters.forEach(
      (entry) => {

        const button =
          document.createElement(
            "button"
          );

        button.type =
          "button";

        button.className =
          "letter-piece";

        button.dataset.id =
          entry.id;

        button.dataset.index =
          String(
            entry.originalIndex
          );

        button.dataset.letter =
          entry.letter;

        button.textContent =
          entry.letter;

        button.addEventListener(
          "click",
          () =>
            chooseLetter(
              button
            )
        );

        row.appendChild(
          button
        );
      }
    );

    $("clearLetters")
      .addEventListener(
        "click",
        clearLetters
      );

    $("checkLetters")
      .addEventListener(
        "click",
        () => {

          if (
            chosenLetters.length !==
            question.word.length
          ) {

            showFeedback(
              "Tekan semua huruf dahulu ya!",
              false,
              false
            );

            return;
          }

          const answer =
            chosenLetters
              .map(
                (entry) =>
                  entry.letter
              )
              .join("");

          checkAnswer(answer);
        }
      );
  }


  function chooseLetter(button) {
    if (
      locked ||
      button.classList.contains(
        "used"
      )
    ) {
      return;
    }

    chosenLetters.push({
      id:
        button.dataset.id,

      letter:
        button.dataset.letter,

      originalIndex:
        Number(
          button.dataset.index
        )
    });

    button.classList.add(
      "used"
    );

    updateLetterSlots();

    playTone(
      440,
      0.05
    );
  }


  function updateLetterSlots() {
    document
      .querySelectorAll(
        ".letter-slot"
      )
      .forEach(
        (slot, index) => {

          slot.textContent =
            chosenLetters[index]
              ?.letter || " ";
        }
      );
  }


  function clearLetters() {
    if (locked) {
      return;
    }

    chosenLetters = [];

    document
      .querySelectorAll(
        ".letter-piece"
      )
      .forEach(
        (button) =>
          button.classList.remove(
            "used"
          )
      );

    updateLetterSlots();
  }


  /*
   * =========================================================
   * ANSWER
   * =========================================================
   */

  function checkAnswer(value) {
    if (locked) {
      return;
    }

    const question =
      currentQuestion();

    if (!question) {
      return;
    }

    locked = true;

    const correct =
      Core.isCorrectAnswer(
        question,
        value
      );

    if (correct) {

      score +=
        POINTS_PER_CORRECT;

      const message =
        randomItem(
          DATA.feedback?.correct
        ) ||
        "Hebat! Jawapan betul!";

      showFeedback(
        message,
        true
      );

      celebrate(18);
      playSuccess();

    } else {

      const message =
        randomItem(
          DATA.feedback?.wrong
        ) ||
        "Cuba lagi!";

      showFeedback(
        `${message} Jawapan: "${question.answer}".`,
        false
      );

      playTone(
        185,
        0.2
      );
    }

    markChoiceButtons(
      value,
      question.answer
    );

    if ($("gameScore")) {
      $("gameScore").textContent =
        `⭐ ${score}`;
    }

    if ($("nextButton")) {
      $("nextButton")
        .classList.remove(
          "hidden"
        );
    }
  }


  function markChoiceButtons(
    submitted,
    correctAnswer
  ) {
    document
      .querySelectorAll(
        ".choice"
      )
      .forEach(
        (button) => {

          button.disabled = true;

          if (
            Core.normalizeText(
              button.dataset.answer
            ) ===
            Core.normalizeText(
              correctAnswer
            )
          ) {
            button.classList.add(
              "correct"
            );
          }

          if (
            Core.normalizeText(
              button.dataset.answer
            ) ===
              Core.normalizeText(
                submitted
              ) &&
            Core.normalizeText(
              submitted
            ) !==
              Core.normalizeText(
                correctAnswer
              )
          ) {
            button.classList.add(
              "wrong"
            );
          }
        }
      );
  }


  function showFeedback(
    message,
    positive,
    lockState = true
  ) {
    if (!lockState) {
      locked = false;
    }

    const element =
      $("feedback");

    if (!element) {
      return;
    }

    element.textContent =
      `${positive ? "🎉" : "💛"} ${message}`;

    element.className =
      `feedback ${
        positive
          ? "success"
          : "error"
      }`;
  }


  /*
   * =========================================================
   * NEXT
   * =========================================================
   */

  function nextQuestion() {
    questionIndex += 1;

    if (
      questionIndex >=
      questions.length
    ) {
      finishGame();
      return;
    }

    renderQuestion();
  }


  /*
   * =========================================================
   * RESULT
   * =========================================================
   */

  function finishGame() {
    const maxScore =
      questions.length *
      POINTS_PER_CORRECT;

    const earnedStars =
      Core.performanceStars(
        score,
        maxScore
      );

    /*
     * Penting:
     * stars = 0..3,
     * bukan score 0..100.
     */

    progress.stars +=
      earnedStars;

    progress.completedRounds += 1;

    progress.best[currentMode] =
      Math.max(
        progress.best[currentMode] || 0,
        score
      );

    saveProgress();

    if ($("progressBar")) {
      $("progressBar").style.width =
        "100%";
    }

    if ($("resultName")) {
      $("resultName").textContent =
        progress.name || "Adik";
    }

    if ($("resultScore")) {
      $("resultScore").textContent =
        `${score} / ${maxScore} mata`;
    }

    if ($("starsEarned")) {
      $("starsEarned").textContent =
        `${"⭐".repeat(earnedStars)}${"☆".repeat(3 - earnedStars)}`;
    }

    const reward =
      Core.rewardForScore(
        score,
        maxScore,
        DATA.rewards || []
      );

    if ($("resultIcon")) {
      $("resultIcon").textContent =
        reward?.badge ||
        (
          earnedStars === 3
            ? "🏆"
            : earnedStars === 2
              ? "🌟"
              : earnedStars === 1
                ? "🎈"
                : "💪"
        );
    }

    if ($("resultMessage")) {
      $("resultMessage").textContent =
        reward
          ? `${reward.title} ${reward.message}`
          : "Teruskan latihan!";
    }

    updateHome();

    showScreen(
      "resultScreen"
    );

    if (earnedStars >= 2) {
      celebrate(30);
    }
  }


  /*
   * =========================================================
   * SPEECH
   * =========================================================
   */

  function speakCurrent() {
    if (!progress.sound) {
      return;
    }

    if (
      !(
        "speechSynthesis"
        in window
      )
    ) {
      showFeedback(
        "Pelayar ini tidak menyokong suara.",
        false,
        false
      );

      return;
    }

    const question =
      currentQuestion();

    if (!question) {
      return;
    }

    let text =
      question.word;

    if (
      question.mode ===
      "ayat"
    ) {
      text =
        question.sentence.replace(
          "____",
          question.answer
        );
    }

    const utterance =
      new SpeechSynthesisUtterance(
        text
      );

    utterance.lang =
      SPEECH_LANGUAGE;

    utterance.rate =
      SPEECH_RATE;

    speechSynthesis.cancel();
    speechSynthesis.speak(
      utterance
    );
  }


  /*
   * =========================================================
   * AUDIO EFFECTS
   * =========================================================
   */

  function getAudioContext() {
    if (audioContext) {
      return audioContext;
    }

    const AudioContext =
      window.AudioContext ||
      window.webkitAudioContext;

    if (!AudioContext) {
      return null;
    }

    try {
      audioContext =
        new AudioContext();

      return audioContext;

    } catch (error) {
      return null;
    }
  }


  function playTone(
    frequency,
    duration
  ) {
    if (!progress.sound) {
      return;
    }

    try {

      const context =
        getAudioContext();

      if (!context) {
        return;
      }

      if (
        context.state ===
        "suspended"
      ) {
        context.resume();
      }

      const oscillator =
        context.createOscillator();

      const gain =
        context.createGain();

      oscillator.type =
        "sine";

      oscillator.frequency.value =
        frequency;

      gain.gain.setValueAtTime(
        0.07,
        context.currentTime
      );

      gain.gain
        .exponentialRampToValueAtTime(
          0.001,
          context.currentTime +
            duration
        );

      oscillator
        .connect(gain)
        .connect(
          context.destination
        );

      oscillator.start();

      oscillator.stop(
        context.currentTime +
          duration
      );

    } catch (error) {
      /*
       * Audio optional.
       */
    }
  }


  function playSuccess() {
    playTone(
      523,
      0.14
    );

    window.setTimeout(
      () =>
        playTone(
          659,
          0.14
        ),
      110
    );

    window.setTimeout(
      () =>
        playTone(
          784,
          0.18
        ),
      220
    );
  }


  /*
   * =========================================================
   * CELEBRATION
   * =========================================================
   */

  function celebrate(count) {
    const layer =
      $("confettiLayer") ||
      document.body;

    const symbols = [
      "⭐",
      "✨",
      "🎉",
      "🌈",
      "💛",
      "💙",
      "💖"
    ];

    for (
      let index = 0;
      index < count;
      index += 1
    ) {

      const piece =
        document.createElement(
          "span"
        );

      piece.className =
        "confetti";

      piece.textContent =
        symbols[
          index %
          symbols.length
        ];

      piece.style.left =
        `${15 + Math.random() * 70}vw`;

      piece.style.top =
        `${35 + Math.random() * 35}vh`;

      piece.style.setProperty(
        "--x",
        `${
          Math.random() * 400 -
          200
        }px`
      );

      layer.appendChild(piece);

      window.setTimeout(
        () =>
          piece.remove(),
        1300
      );
    }
  }


  /*
   * =========================================================
   * HOME
   * =========================================================
   */

  function goHome() {
    if (
      "speechSynthesis"
      in window
    ) {
      speechSynthesis.cancel();
    }

    updateHome();

    showScreen(
      "homeScreen"
    );
  }


  /*
   * =========================================================
   * RESET
   * =========================================================
   */

  function resetProgress() {
    progress = {
      ...defaultProgress,
      best: {}
    };

    saveProgress();

    if ($("confirmOverlay")) {
      $("confirmOverlay")
        .classList.add(
          "hidden"
        );
    }

    updateHome();
  }


  /*
   * =========================================================
   * EVENT BINDING
   * =========================================================
   */

  function bindEvents() {

    if ($("quickStart")) {
      $("quickStart")
        .addEventListener(
          "click",
          () =>
            startGame(
              "vokal"
            )
        );
    }


    if ($("exitGame")) {
      $("exitGame")
        .addEventListener(
          "click",
          goHome
        );
    }


    if ($("brandHome")) {
      $("brandHome")
        .addEventListener(
          "click",
          goHome
        );
    }


    if ($("resultHome")) {
      $("resultHome")
        .addEventListener(
          "click",
          goHome
        );
    }


    if ($("playAgain")) {
      $("playAgain")
        .addEventListener(
          "click",
          () =>
            startGame(
              currentMode
            )
        );
    }


    if ($("nextButton")) {
      $("nextButton")
        .addEventListener(
          "click",
          nextQuestion
        );
    }


    if ($("listenButton")) {
      $("listenButton")
        .addEventListener(
          "click",
          speakCurrent
        );
    }


    if ($("studentName")) {

      $("studentName")
        .addEventListener(
          "change",
          (event) => {

            progress.name =
              event.target
                .value
                .trim()
                .slice(
                  0,
                  30
                );

            saveProgress();
          }
        );
    }


    if ($("soundToggle")) {

      $("soundToggle")
        .addEventListener(
          "click",
          () => {

            progress.sound =
              !progress.sound;

            saveProgress();
            updateSoundButton();

            if (progress.sound) {
              playTone(
                523,
                0.12
              );
            }
          }
        );
    }


    if ($("resetProgress")) {

      $("resetProgress")
        .addEventListener(
          "click",
          () => {

            if ($("confirmOverlay")) {
              $("confirmOverlay")
                .classList.remove(
                  "hidden"
                );
            }
          }
        );
    }


    if ($("cancelReset")) {

      $("cancelReset")
        .addEventListener(
          "click",
          () =>
            $("confirmOverlay")
              ?.classList.add(
                "hidden"
              )
        );
    }


    if ($("confirmReset")) {

      $("confirmReset")
        .addEventListener(
          "click",
          resetProgress
        );
    }


    if ($("confirmOverlay")) {

      $("confirmOverlay")
        .addEventListener(
          "click",
          (event) => {

            if (
              event.target ===
              $("confirmOverlay")
            ) {
              $("confirmOverlay")
                .classList.add(
                  "hidden"
                );
            }
          }
        );
    }


    document.addEventListener(
      "keydown",
      (event) => {

        if (
          event.key ===
          "Escape"
        ) {

          $("confirmOverlay")
            ?.classList.add(
              "hidden"
            );
        }
      }
    );
  }


  /*
   * =========================================================
   * INIT
   * =========================================================
   */

  function init() {
    bindEvents();
    updateHome();

    showScreen(
      "homeScreen"
    );

    console.log(
      "✅ Misi Bijak Bahasa Melayu ready."
    );
  }


  init();

}());
