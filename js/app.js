(function () {
  "use strict";

  const DATA = window.GAME_DATA;
  const Core = window.GameCore;
  const $ = (id) => document.getElementById(id);
  const storageKey = "misiBijakBM.v1";
  const defaultProgress = { stars: 0, best: {}, name: "", className: "", sound: true };
  let progress = loadProgress();
  let currentMode = "vokal";
  let questions = [];
  let questionIndex = 0;
  let score = 0;
  let locked = false;
  let chosenLetters = [];

  function loadProgress() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
      return saved && typeof saved === "object" ? { ...defaultProgress, ...saved, best: saved.best || {} } : { ...defaultProgress };
    } catch (_) {
      return { ...defaultProgress };
    }
  }

  function saveProgress() {
    try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch (_) { /* Permainan kekal boleh dimainkan. */ }
  }

  function showScreen(id) {
    ["homeScreen", "gameScreen", "resultScreen"].forEach((screenId) => $(screenId).classList.toggle("hidden", screenId !== id));
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateHome() {
    $("totalStars").textContent = `⭐ ${progress.stars}`;
    $("studentName").value = progress.name || "";
    $("studentClass").value = progress.className || "";
    $("soundToggle").setAttribute("aria-pressed", String(progress.sound));
    $("soundToggle").firstChild.textContent = progress.sound ? "🔊 " : "🔇 ";
    const rank = Core.rankFor(progress.stars);
    $("rankIcon").textContent = rank.icon;
    $("rankName").textContent = rank.name;
    $("rankHint").textContent = rank.nextAt ? `Kumpul ${rank.nextAt - progress.stars} bintang lagi untuk naik tahap.` : "Tahap tertinggi sudah dicapai!";
    $("missionGrid").innerHTML = DATA.modes.map((mode, index) => {
      const best = progress.best[mode.id] || 0;
      const stars = Core.performanceStars(best, 80);
      return `<button class="mission-card" data-mode="${mode.id}" data-tone="${mode.tone}" type="button">
        <span class="mission-number" aria-hidden="true">${index + 1}</span>
        <span class="mission-card-top"><h3>${mode.title}</h3><p>${mode.description}</p></span>
        <span class="mission-preview"><span class="mission-icon" aria-hidden="true">${mode.icon}</span></span>
        <span class="mission-card-bottom">
          <span><span class="mission-stars" aria-label="${stars} daripada 3 bintang">${"⭐".repeat(stars)}${"☆".repeat(3 - stars)}</span><small>Terbaik ${best}</small></span>
          <span class="mission-start">Mulakan ▶</span>
        </span>
      </button>`;
    }).join("");
    document.querySelectorAll(".mission-card").forEach((button) => button.addEventListener("click", () => startGame(button.dataset.mode)));
  }

  function startGame(modeId) {
    const mode = DATA.modes.find((entry) => entry.id === modeId) || DATA.modes[0];
    progress.name = $("studentName").value.trim().slice(0, 30);
    progress.className = $("studentClass").value.trim().slice(0, 30);
    saveProgress();
    currentMode = mode.id;
    questions = Core.buildRound(currentMode, DATA, 8);
    questionIndex = 0;
    score = 0;
    $("missionIcon").textContent = mode.icon;
    $("missionTitle").textContent = mode.title;
    showScreen("gameScreen");
    renderQuestion();
  }

  function currentQuestion() { return questions[questionIndex]; }

  function renderQuestion() {
    locked = false;
    chosenLetters = [];
    const question = currentQuestion();
    $("questionCount").textContent = `${questionIndex + 1} / ${questions.length}`;
    $("gameScore").textContent = `⭐ ${score}`;
    $("progressBar").style.width = `${(questionIndex / questions.length) * 100}%`;
    $("feedback").textContent = "";
    $("feedback").className = "feedback";
    $("nextButton").classList.add("hidden");
    $("listenButton").classList.remove("hidden");
    $("pictureEmoji").textContent = question.emoji;
    $("pictureLabel").textContent = "";
    $("pictureStage").setAttribute("aria-label", `Gambar ${question.word}`);

    const views = {
      vokal: () => renderChoice(`Huruf vokal pertama dalam “${question.word}” ialah…`, "Dengar perkataan dan pilih huruf.", question.options),
      kv: () => renderChoice(`Suku kata awal bagi “${question.word}” ialah…`, "Pilih suku kata KV yang betul.", question.options),
      kvk: () => renderChoice(question.word.split("").map((letter, index) => index === question.missingIndex ? "_" : letter).join("  "), "Lengkapkan perkataan KVK.", question.options),
      padan: () => renderPictureMatch(question),
      susun: () => renderLetterSort(question),
      ayat: () => renderChoice(question.sentence, "Lengkapkan ayat mudah ini.", question.options)
    };
    views[question.mode]();
  }

  function renderChoice(title, instruction, options) {
    $("questionText").textContent = title;
    $("instruction").textContent = instruction;
    $("interaction").innerHTML = `<div class="choices">${options.map((option) => `<button class="choice" type="button" data-answer="${option}">${option}</button>`).join("")}</div>`;
    bindChoiceButtons();
  }

  function renderPictureMatch(question) {
    $("pictureEmoji").textContent = "❓";
    $("pictureLabel").textContent = question.word;
    $("pictureStage").setAttribute("aria-label", `Cari gambar untuk ${question.word}`);
    $("questionText").textContent = `Pilih gambar “${question.word}”`;
    $("instruction").textContent = "Padankan perkataan dengan gambar.";
    $("interaction").innerHTML = `<div class="choices">${question.options.map((option) => {
      const item = DATA.words.find((entry) => entry.word === option);
      return `<button class="choice emoji-choice" type="button" data-answer="${option}" aria-label="${option}">${item ? item.emoji : "❔"}</button>`;
    }).join("")}</div>`;
    bindChoiceButtons();
  }

  function renderLetterSort(question) {
    $("questionText").textContent = "Susun huruf menjadi perkataan";
    $("instruction").textContent = "Tekan huruf mengikut urutan gambar.";
    $("interaction").innerHTML = `
      <div class="answer-slots">${question.word.split("").map(() => `<span class="letter-slot">&nbsp;</span>`).join("")}</div>
      <div class="piece-row">${question.letters.map(({ letter, index }) => `<button class="letter-piece" type="button" data-index="${index}">${letter}</button>`).join("")}</div>
      <div class="game-buttons"><button class="button button-soft" id="clearLetters" type="button">↻ Cuba semula</button><button class="button button-primary" id="checkLetters" type="button">Semak</button></div>`;
    document.querySelectorAll(".letter-piece").forEach((button) => button.addEventListener("click", () => chooseLetter(button)));
    $("clearLetters").addEventListener("click", clearLetters);
    $("checkLetters").addEventListener("click", () => {
      if (chosenLetters.length !== question.word.length) {
        feedback("Tekan semua huruf dahulu ya!", false, false);
        return;
      }
      checkAnswer(chosenLetters.map((entry) => entry.letter).join(""));
    });
  }

  function bindChoiceButtons() {
    document.querySelectorAll(".choice").forEach((button) => button.addEventListener("click", () => checkAnswer(button.dataset.answer)));
  }

  function chooseLetter(button) {
    if (locked || button.classList.contains("used")) return;
    chosenLetters.push({ letter: button.textContent, index: button.dataset.index });
    button.classList.add("used");
    document.querySelectorAll(".letter-slot").forEach((slot, index) => { slot.textContent = chosenLetters[index]?.letter || " "; });
    playTone(440, .05);
  }

  function clearLetters() {
    if (locked) return;
    chosenLetters = [];
    document.querySelectorAll(".letter-piece").forEach((button) => button.classList.remove("used"));
    document.querySelectorAll(".letter-slot").forEach((slot) => { slot.innerHTML = "&nbsp;"; });
  }

  function checkAnswer(value) {
    if (locked) return;
    locked = true;
    const correct = value === currentQuestion().answer;
    if (correct) {
      score += 10;
      feedback("Hebat! Jawapan kamu betul!", true);
      celebrate(18);
      playSuccess();
    } else {
      feedback(`Hampir! Jawapan betul ialah “${currentQuestion().answer}”.`, false);
      playTone(185, .2);
    }
    document.querySelectorAll(".choice").forEach((button) => {
      button.disabled = true;
      if (button.dataset.answer === currentQuestion().answer) button.classList.add("correct");
      else if (button.dataset.answer === value) button.classList.add("wrong");
    });
    $("gameScore").textContent = `⭐ ${score}`;
    $("nextButton").classList.remove("hidden");
  }

  function feedback(message, positive, lockState = true) {
    if (!lockState) locked = false;
    $("feedback").textContent = `${positive ? "🎉" : "💛"} ${message}`;
    $("feedback").className = `feedback ${positive ? "success" : "error"}`;
  }

  function nextQuestion() {
    questionIndex += 1;
    if (questionIndex >= questions.length) finishGame();
    else renderQuestion();
  }

  function finishGame() {
    const maxScore = questions.length * 10;
    const earned = Core.performanceStars(score, maxScore);
    progress.stars += score;
    progress.best[currentMode] = Math.max(progress.best[currentMode] || 0, score);
    saveProgress();
    updateHome();
    $("progressBar").style.width = "100%";
    $("resultName").textContent = progress.name || "Adik";
    $("resultScore").textContent = `${score} / ${maxScore} mata`;
    $("starsEarned").textContent = `${"⭐".repeat(earned)}${"☆".repeat(3 - earned)}`;
    $("resultIcon").textContent = earned === 3 ? "🏆" : earned === 2 ? "🌟" : earned === 1 ? "🎈" : "💪";
    $("resultMessage").textContent = earned === 3 ? "Cemerlang! Kamu memang Wira Bahasa!" : earned === 2 ? "Bagus! Sedikit lagi untuk tiga bintang." : "Teruskan latihan. Setiap cubaan menjadikan kamu lebih bijak!";
    showScreen("resultScreen");
    if (earned >= 2) celebrate(30);
  }

  function speakCurrent() {
    if (!progress.sound) return;
    const question = currentQuestion();
    const text = question.mode === "ayat" ? question.sentence.replace("____", question.answer) : question.word;
    const audioName = question.mode === "ayat" ? `ayat-${question.answer}` : question.word;
    const player = $("voicePlayer");
    player.pause();
    player.currentTime = 0;
    player.src = `assets/audio/${audioName}.mp3`;
    const playback = player.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => speakWithBrowser(text));
  }

  function speakWithBrowser(text) {
    if (!window.speechSynthesis || typeof window.SpeechSynthesisUtterance !== "function") {
      feedback("Audio tidak dapat dimainkan pada pelayar ini.", false, false);
      return;
    }
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "ms-MY";
    utterance.rate = .72;
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
  }

  function playEffect(name) {
    if (!progress.sound) return;
    const player = $("sfxPlayer");
    player.pause();
    player.currentTime = 0;
    player.src = `assets/audio/${name}.mp3`;
    const playback = player.play();
    if (playback && typeof playback.catch === "function") playback.catch(() => {});
  }

  function playTone(frequency, duration) {
    if (!progress.sound) return;
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        playEffect(frequency < 300 ? "wrong" : "tap");
        return;
      }
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = "sine";
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(.08, context.currentTime);
      gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + duration);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start();
      oscillator.stop(context.currentTime + duration);
      oscillator.addEventListener("ended", () => context.close());
    } catch (_) { /* Audio ialah peningkatan pilihan. */ }
  }

  function playSuccess() {
    if (!(window.AudioContext || window.webkitAudioContext)) {
      playEffect("success");
      return;
    }
    playTone(523, .16);
    window.setTimeout(() => playTone(659, .16), 110);
    window.setTimeout(() => playTone(784, .2), 220);
  }

  function celebrate(count) {
    const symbols = ["⭐", "✨", "🎉", "💛", "💙"];
    for (let index = 0; index < count; index += 1) {
      const piece = document.createElement("span");
      piece.className = "confetti";
      piece.textContent = symbols[index % symbols.length];
      piece.style.left = `${20 + Math.random() * 60}vw`;
      piece.style.top = `${42 + Math.random() * 24}vh`;
      piece.style.setProperty("--x", `${Math.random() * 360 - 180}px`);
      $("confettiLayer").appendChild(piece);
      window.setTimeout(() => piece.remove(), 1200);
    }
  }

  function goHome() {
    if ("speechSynthesis" in window) speechSynthesis.cancel();
    updateHome();
    showScreen("homeScreen");
  }

  $("quickStart").addEventListener("click", () => startGame("vokal"));
  $("exitGame").addEventListener("click", goHome);
  $("brandHome").addEventListener("click", goHome);
  $("resultHome").addEventListener("click", goHome);
  $("playAgain").addEventListener("click", () => startGame(currentMode));
  $("nextButton").addEventListener("click", nextQuestion);
  $("listenButton").addEventListener("click", speakCurrent);
  $("studentName").addEventListener("change", (event) => { progress.name = event.target.value.trim().slice(0, 30); saveProgress(); });
  $("soundToggle").addEventListener("click", () => { progress.sound = !progress.sound; saveProgress(); updateHome(); if (progress.sound) playTone(523, .12); });
  $("resetProgress").addEventListener("click", () => $("confirmOverlay").classList.remove("hidden"));
  $("cancelReset").addEventListener("click", () => $("confirmOverlay").classList.add("hidden"));
  $("confirmReset").addEventListener("click", () => { progress = { ...defaultProgress }; saveProgress(); $("confirmOverlay").classList.add("hidden"); updateHome(); });
  $("confirmOverlay").addEventListener("click", (event) => { if (event.target === $("confirmOverlay")) $("confirmOverlay").classList.add("hidden"); });
  document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !$("confirmOverlay").classList.contains("hidden")) $("confirmOverlay").classList.add("hidden"); });

  updateHome();
}());
