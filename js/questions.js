(function () {
  "use strict";

  /*
   * =========================================================
   * MISI BIJAK BAHASA MELAYU
   * questions.js
   * ---------------------------------------------------------
   * Semua data pembelajaran disimpan di sini.
   *
   * Jangan letakkan logik permainan dalam fail ini.
   *
   * Digunakan oleh:
   *   core.js  -> jana soalan
   *   app.js   -> paparkan UI
   *
   * Asset:
   *   assets/objects/
   *   assets/audio/
   * =========================================================
   */

  const words = [

    /*
     * =====================================================
     * HURUF VOKAL
     * =====================================================
     */

    {
      id: "api",
      word: "api",
      image: "assets/objects/api.svg",
      emoji: "🔥",
      category: "vokal",
      pattern: "VKV",
      syllables: ["a", "pi"],
      vowels: ["a", "i"],
      difficulty: 1,
      sentence: "Api itu panas.",
      audio: null
    },

    {
      id: "epal",
      word: "epal",
      image: "assets/objects/epal.svg",
      emoji: "🍎",
      category: "vokal",
      pattern: "VKVK",
      syllables: ["e", "pal"],
      vowels: ["e", "a"],
      difficulty: 1,
      sentence: "Epal itu merah.",
      audio: null
    },

    {
      id: "ikan",
      word: "ikan",
      image: "assets/objects/ikan.svg",
      emoji: "🐟",
      category: "vokal",
      pattern: "VKVK",
      syllables: ["i", "kan"],
      vowels: ["i", "a"],
      difficulty: 1,
      sentence: "Ikan berenang.",
      audio: null
    },

    {
      id: "oren",
      word: "oren",
      image: "assets/objects/oren.svg",
      emoji: "🍊",
      category: "vokal",
      pattern: "VKVK",
      syllables: ["o", "ren"],
      vowels: ["o", "e"],
      difficulty: 1,
      sentence: "Oren itu manis.",
      audio: null
    },

    {
      id: "ular",
      word: "ular",
      image: "assets/objects/ular.svg",
      emoji: "🐍",
      category: "vokal",
      pattern: "VKVK",
      syllables: ["u", "lar"],
      vowels: ["u", "a"],
      difficulty: 1,
      sentence: "Ular itu panjang.",
      audio: null
    },

    {
      id: "ayam",
      word: "ayam",
      image: "assets/objects/ayam.svg",
      emoji: "🐔",
      category: "vokal",
      pattern: "VKVK",
      syllables: ["a", "yam"],
      vowels: ["a"],
      difficulty: 1,
      sentence: "Ayam itu makan.",
      audio: null
    },

    /*
     * =====================================================
     * SUKU KATA KV
     * =====================================================
     */

    {
      id: "baju",
      word: "baju",
      image: "assets/objects/baju.svg",
      emoji: "👕",
      category: "kv",
      pattern: "KVKV",
      syllables: ["ba", "ju"],
      vowels: ["a", "u"],
      difficulty: 1,
      sentence: "Ini baju saya.",
      audio: null
    },

    {
      id: "bola",
      word: "bola",
      image: "assets/objects/bola.svg",
      emoji: "⚽",
      category: "kv",
      pattern: "KVKV",
      syllables: ["bo", "la"],
      vowels: ["o", "a"],
      difficulty: 1,
      sentence: "Ali sepak bola.",
      audio: null
    },

    {
      id: "buku",
      word: "buku",
      image: "assets/objects/buku.svg",
      emoji: "📘",
      category: "kv",
      pattern: "KVKV",
      syllables: ["bu", "ku"],
      vowels: ["u"],
      difficulty: 1,
      sentence: "Siti baca buku.",
      audio: null
    },

    {
      id: "gigi",
      word: "gigi",
      image: "assets/objects/gigi.svg",
      emoji: "🦷",
      category: "kv",
      pattern: "KVKV",
      syllables: ["gi", "gi"],
      vowels: ["i"],
      difficulty: 1,
      sentence: "Gigi saya bersih.",
      audio: null
    },

    {
      id: "kaki",
      word: "kaki",
      image: "assets/objects/kaki.svg",
      emoji: "🦶",
      category: "kv",
      pattern: "KVKV",
      syllables: ["ka", "ki"],
      vowels: ["a", "i"],
      difficulty: 1,
      sentence: "Ini kaki saya.",
      audio: null
    },

    {
      id: "mata",
      word: "mata",
      image: "assets/objects/mata.svg",
      emoji: "👁️",
      category: "kv",
      pattern: "KVKV",
      syllables: ["ma", "ta"],
      vowels: ["a"],
      difficulty: 1,
      sentence: "Mata untuk melihat.",
      audio: null
    },

    {
      id: "roti",
      word: "roti",
      image: "assets/objects/roti.svg",
      emoji: "🍞",
      category: "kv",
      pattern: "KVKV",
      syllables: ["ro", "ti"],
      vowels: ["o", "i"],
      difficulty: 1,
      sentence: "Saya makan roti.",
      audio: null
    },

    {
      id: "susu",
      word: "susu",
      image: "assets/objects/susu.svg",
      emoji: "🥛",
      category: "kv",
      pattern: "KVKV",
      syllables: ["su", "su"],
      vowels: ["u"],
      difficulty: 1,
      sentence: "Adik minum susu.",
      audio: null
    },

    {
      id: "topi",
      word: "topi",
      image: "assets/objects/topi.svg",
      emoji: "🧢",
      category: "kv",
      pattern: "KVKV",
      syllables: ["to", "pi"],
      vowels: ["o", "i"],
      difficulty: 1,
      sentence: "Amin pakai topi.",
      audio: null
    },

    {
      id: "meja",
      word: "meja",
      image: "assets/objects/meja.svg",
      emoji: "🪑",
      category: "kv",
      pattern: "KVKV",
      syllables: ["me", "ja"],
      vowels: ["e", "a"],
      difficulty: 1,
      sentence: "Buku di atas meja.",
      audio: null
    },

    {
      id: "kuda",
      word: "kuda",
      image: "assets/objects/kuda.svg",
      emoji: "🐴",
      category: "kv",
      pattern: "KVKV",
      syllables: ["ku", "da"],
      vowels: ["u", "a"],
      difficulty: 1,
      sentence: "Kuda itu berlari.",
      audio: null
    },

    {
      id: "sapu",
      word: "sapu",
      image: "assets/objects/sapu.svg",
      emoji: "🧹",
      category: "kv",
      pattern: "KVKV",
      syllables: ["sa", "pu"],
      vowels: ["a", "u"],
      difficulty: 1,
      sentence: "Ibu guna sapu.",
      audio: null
    },

    /*
     * =====================================================
     * PERKATAAN KVK
     * =====================================================
     */

    {
      id: "bas",
      word: "bas",
      image: "assets/objects/bas.svg",
      emoji: "🚌",
      category: "kvk",
      pattern: "KVK",
      syllables: ["bas"],
      vowels: ["a"],
      difficulty: 2,
      sentence: "Saya naik bas.",
      audio: null
    },

    {
      id: "beg",
      word: "beg",
      image: "assets/objects/beg.svg",
      emoji: "🎒",
      category: "kvk",
      pattern: "KVK",
      syllables: ["beg"],
      vowels: ["e"],
      difficulty: 2,
      sentence: "Beg itu berat.",
      audio: null
    },

    {
      id: "cat",
      word: "cat",
      image: "assets/objects/cat.svg",
      emoji: "🎨",
      category: "kvk",
      pattern: "KVK",
      syllables: ["cat"],
      vowels: ["a"],
      difficulty: 2,
      sentence: "Cat itu biru.",
      audio: null
    },

    {
      id: "jam",
      word: "jam",
      image: "assets/objects/jam.svg",
      emoji: "⏰",
      category: "kvk",
      pattern: "KVK",
      syllables: ["jam"],
      vowels: ["a"],
      difficulty: 2,
      sentence: "Jam sudah berbunyi.",
      audio: null
    },

    {
      id: "kek",
      word: "kek",
      image: "assets/objects/kek.svg",
      emoji: "🍰",
      category: "kvk",
      pattern: "KVK",
      syllables: ["kek"],
      vowels: ["e"],
      difficulty: 2,
      sentence: "Kek itu sedap.",
      audio: null
    },

    {
      id: "pen",
      word: "pen",
      image: "assets/objects/pen.svg",
      emoji: "🖊️",
      category: "kvk",
      pattern: "KVK",
      syllables: ["pen"],
      vowels: ["e"],
      difficulty: 2,
      sentence: "Saya ada pen.",
      audio: null
    },

    {
      id: "rak",
      word: "rak",
      image: "assets/objects/rak.svg",
      emoji: "🗄️",
      category: "kvk",
      pattern: "KVK",
      syllables: ["rak"],
      vowels: ["a"],
      difficulty: 2,
      sentence: "Buku di atas rak.",
      audio: null
    },

    {
      id: "van",
      word: "van",
      image: "assets/objects/van.svg",
      emoji: "🚐",
      category: "kvk",
      pattern: "KVK",
      syllables: ["van"],
      vowels: ["a"],
      difficulty: 2,
      sentence: "Van itu putih.",
      audio: null
    },

    {
      id: "tin",
      word: "tin",
      image: "assets/objects/tin.svg",
      emoji: "🥫",
      category: "kvk",
      pattern: "KVK",
      syllables: ["tin"],
      vowels: ["i"],
      difficulty: 2,
      sentence: "Ini sebuah tin.",
      audio: null
    },

    {
      id: "zip",
      word: "zip",
      image: "assets/objects/zip.svg",
      emoji: "🤐",
      category: "kvk",
      pattern: "KVK",
      syllables: ["zip"],
      vowels: ["i"],
      difficulty: 2,
      sentence: "Zip beg itu rosak.",
      audio: null
    },

    /*
     * =====================================================
     * PERKATAAN MUDAH TAMBAHAN
     * =====================================================
     */

    {
      id: "nasi",
      word: "nasi",
      image: "assets/objects/nasi.svg",
      emoji: "🍚",
      category: "kv",
      pattern: "KVKV",
      syllables: ["na", "si"],
      vowels: ["a", "i"],
      difficulty: 2,
      sentence: "Saya makan nasi.",
      audio: null
    },

    {
      id: "dadu",
      word: "dadu",
      image: "assets/objects/dadu.svg",
      emoji: "🎲",
      category: "kv",
      pattern: "KVKV",
      syllables: ["da", "du"],
      vowels: ["a", "u"],
      difficulty: 2,
      sentence: "Ini buah dadu.",
      audio: null
    },

    {
      id: "sudu",
      word: "sudu",
      image: "assets/objects/sudu.svg",
      emoji: "🥄",
      category: "kv",
      pattern: "KVKV",
      syllables: ["su", "du"],
      vowels: ["u"],
      difficulty: 2,
      sentence: "Saya guna sudu.",
      audio: null
    },

    {
      id: "paku",
      word: "paku",
      image: "assets/objects/paku.svg",
      emoji: "🔩",
      category: "kv",
      pattern: "KVKV",
      syllables: ["pa", "ku"],
      vowels: ["a", "u"],
      difficulty: 2,
      sentence: "Ayah pegang paku.",
      audio: null
    }
  ];


  /*
   * =========================================================
   * AYAT MUDAH
   *
   * Gunakan answerId.
   *
   * Jangan duplicate image / emoji di sini.
   * core.js boleh cari word berdasarkan answerId.
   * =========================================================
   */

  const sentenceQuestions = [

    {
      id: "ayat-roti",
      sentence: "Saya makan ____.",
      answerId: "roti",
      difficulty: 1
    },

    {
      id: "ayat-susu",
      sentence: "Adik minum ____.",
      answerId: "susu",
      difficulty: 1
    },

    {
      id: "ayat-bola",
      sentence: "Ali sepak ____.",
      answerId: "bola",
      difficulty: 1
    },

    {
      id: "ayat-buku",
      sentence: "Siti baca ____.",
      answerId: "buku",
      difficulty: 1
    },

    {
      id: "ayat-topi",
      sentence: "Amin pakai ____.",
      answerId: "topi",
      difficulty: 1
    },

    {
      id: "ayat-bas",
      sentence: "Saya naik ____.",
      answerId: "bas",
      difficulty: 1
    },

    {
      id: "ayat-mata",
      sentence: "Kita melihat dengan ____.",
      answerId: "mata",
      difficulty: 1
    },

    {
      id: "ayat-rak",
      sentence: "Buku di atas ____.",
      answerId: "rak",
      difficulty: 1
    },

    {
      id: "ayat-pen",
      sentence: "Saya menulis dengan ____.",
      answerId: "pen",
      difficulty: 1
    },

    {
      id: "ayat-kek",
      sentence: "Ibu potong ____.",
      answerId: "kek",
      difficulty: 1
    },

    {
      id: "ayat-nasi",
      sentence: "Saya makan ____.",
      answerId: "nasi",
      difficulty: 2
    },

    {
      id: "ayat-sudu",
      sentence: "Saya makan dengan ____.",
      answerId: "sudu",
      difficulty: 2
    },

    {
      id: "ayat-meja",
      sentence: "Buku di atas ____.",
      answerId: "meja",
      difficulty: 2
    },

    {
      id: "ayat-kuda",
      sentence: "____ itu berlari.",
      answerId: "kuda",
      difficulty: 2
    }
  ];


  /*
   * =========================================================
   * MOD / MISI PERMAINAN
   * =========================================================
   */

  const modes = [

    {
      id: "vokal",
      icon: "🔤",
      mascot: "🌈",
      title: "Huruf Vokal",
      description: "Kenal bunyi a, e, i, o dan u.",
      tone: "pink",
      difficulty: 1,
      unlockStars: 0
    },

    {
      id: "kv",
      icon: "🗣️",
      mascot: "🐣",
      title: "Suku Kata KV",
      description: "Baca dan gabungkan suku kata mudah.",
      tone: "blue",
      difficulty: 1,
      unlockStars: 0
    },

    {
      id: "kvk",
      icon: "🧠",
      mascot: "🦊",
      title: "Perkataan KVK",
      description: "Kenal dan lengkapkan perkataan KVK.",
      tone: "yellow",
      difficulty: 2,
      unlockStars: 10
    },

    {
      id: "padan",
      icon: "🖼️",
      mascot: "🐼",
      title: "Padan Gambar",
      description: "Padankan gambar dengan perkataan.",
      tone: "mint",
      difficulty: 1,
      unlockStars: 0
    },

    {
      id: "susun",
      icon: "🧩",
      mascot: "🐸",
      title: "Susun Huruf",
      description: "Susun huruf menjadi perkataan betul.",
      tone: "purple",
      difficulty: 2,
      unlockStars: 15
    },

    {
      id: "hilang",
      icon: "🔎",
      mascot: "🐰",
      title: "Huruf Hilang",
      description: "Cari huruf yang hilang.",
      tone: "cyan",
      difficulty: 2,
      unlockStars: 10
    },

    {
      id: "ayat",
      icon: "📖",
      mascot: "🦉",
      title: "Ayat Mudah",
      description: "Lengkapkan ayat dengan perkataan sesuai.",
      tone: "orange",
      difficulty: 3,
      unlockStars: 20
    },

    {
      id: "campuran",
      icon: "🏆",
      mascot: "⭐",
      title: "Misi Juara",
      description: "Cabaran campuran semua kemahiran.",
      tone: "rainbow",
      difficulty: 3,
      unlockStars: 30
    }
  ];


  /*
   * =========================================================
   * TAHAP PEMBELAJARAN
   * =========================================================
   */

  const levels = [

    {
      id: 1,
      title: "Pengembara Vokal",
      description: "Kenali huruf vokal.",
      modes: ["vokal"],
      requiredStars: 0,
      badge: "🌱"
    },

    {
      id: 2,
      title: "Jaguh Suku Kata",
      description: "Belajar membaca suku kata KV.",
      modes: ["kv", "padan"],
      requiredStars: 5,
      badge: "🐣"
    },

    {
      id: 3,
      title: "Pakar Perkataan",
      description: "Cabaran perkataan KVK.",
      modes: ["kvk", "hilang"],
      requiredStars: 10,
      badge: "⭐"
    },

    {
      id: 4,
      title: "Detektif Bahasa",
      description: "Susun dan padankan perkataan.",
      modes: ["susun", "padan"],
      requiredStars: 20,
      badge: "🔎"
    },

    {
      id: 5,
      title: "Juara Ayat",
      description: "Baca dan lengkapkan ayat mudah.",
      modes: ["ayat"],
      requiredStars: 30,
      badge: "🏆"
    },

    {
      id: 6,
      title: "Juara Bahasa Melayu",
      description: "Selesaikan semua cabaran.",
      modes: ["campuran"],
      requiredStars: 50,
      badge: "👑"
    }
  ];


  /*
   * =========================================================
   * GANJARAN
   * =========================================================
   */

  const rewards = [

    {
      minimumScore: 100,
      stars: 3,
      badge: "🏆",
      title: "Hebat!",
      message: "Semua jawapan betul!"
    },

    {
      minimumScore: 80,
      stars: 3,
      badge: "🌟",
      title: "Cemerlang!",
      message: "Kamu sangat hebat!"
    },

    {
      minimumScore: 60,
      stars: 2,
      badge: "😊",
      title: "Bagus!",
      message: "Teruskan usaha!"
    },

    {
      minimumScore: 0,
      stars: 1,
      badge: "💪",
      title: "Cuba Lagi!",
      message: "Latihan menjadikan kita lebih pandai."
    }
  ];


  /*
   * =========================================================
   * MESEJ MAKLUM BALAS
   * =========================================================
   */

  const feedback = {

    correct: [
      "Hebat! 🎉",
      "Bagus sekali! ⭐",
      "Pandainya! 🌟",
      "Betul! Teruskan! 🚀",
      "Syabas! 👏",
      "Cemerlang! 🏆"
    ],

    wrong: [
      "Cuba lagi ya! 💪",
      "Hampir betul! 😊",
      "Jangan putus asa! 🌈",
      "Mari cuba sekali lagi! 🐣"
    ]
  };


  /*
   * =========================================================
   * KONFIGURASI PERMAINAN
   * =========================================================
   */

  const settings = {

    questionsPerRound: 10,

    pointsPerCorrectAnswer: 10,

    maxScore: 100,

    vowels: ["a", "e", "i", "o", "u"],

    speechLanguage: "ms-MY",

    speechRate: 0.72,

    localStorageKeys: {
      stars: "misiBijakStars",
      playerName: "misiBijakPlayer",
      progress: "misiBijakProgress",
      sound: "misiBijakSound"
    }
  };


  /*
   * =========================================================
   * EXPOSE DATA
   *
   * core.js / app.js akses melalui:
   *
   * window.GAME_DATA.words
   * window.GAME_DATA.modes
   * window.GAME_DATA.levels
   *
   * =========================================================
   */

  window.GAME_DATA = Object.freeze({

    words,

    sentenceQuestions,

    modes,

    levels,

    rewards,

    feedback,

    settings

  });

}());
