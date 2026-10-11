(function () {
  "use strict";

  const words = [
    { word: "api", emoji: "🔥", type: "vokal", sentence: "Api itu panas." },
    { word: "epal", emoji: "🍎", type: "vokal", sentence: "Epal itu merah." },
    { word: "ikan", emoji: "🐟", type: "vokal", sentence: "Ikan berenang." },
    { word: "oren", emoji: "🍊", type: "vokal", sentence: "Oren itu manis." },
    { word: "ular", emoji: "🐍", type: "vokal", sentence: "Ular itu panjang." },
    { word: "baju", emoji: "👕", type: "kv", sentence: "Ini baju saya." },
    { word: "bola", emoji: "⚽", type: "kv", sentence: "Ali sepak bola." },
    { word: "buku", emoji: "📘", type: "kv", sentence: "Siti baca buku." },
    { word: "gigi", emoji: "🦷", type: "kv", sentence: "Gigi saya bersih." },
    { word: "kaki", emoji: "🦶", type: "kv", sentence: "Ini kaki saya." },
    { word: "mata", emoji: "👁️", type: "kv", sentence: "Mata untuk melihat." },
    { word: "roti", emoji: "🍞", type: "kv", sentence: "Saya makan roti." },
    { word: "susu", emoji: "🥛", type: "kv", sentence: "Adik minum susu." },
    { word: "topi", emoji: "🧢", type: "kv", sentence: "Amin pakai topi." },
    { word: "bas", emoji: "🚌", type: "kvk", sentence: "Saya naik bas." },
    { word: "beg", emoji: "🎒", type: "kvk", sentence: "Beg itu berat." },
    { word: "cat", emoji: "🎨", type: "kvk", sentence: "Cat itu biru." },
    { word: "jam", emoji: "⏰", type: "kvk", sentence: "Jam sudah berbunyi." },
    { word: "kek", emoji: "🍰", type: "kvk", sentence: "Kek itu sedap." },
    { word: "pen", emoji: "🖊️", type: "kvk", sentence: "Saya ada pen." },
    { word: "rak", emoji: "🗄️", type: "kvk", sentence: "Buku di atas rak." },
    { word: "van", emoji: "🚐", type: "kvk", sentence: "Van itu putih." }
  ];

  const sentenceQuestions = [
    { sentence: "Saya makan ____.", answer: "roti", emoji: "🍞" },
    { sentence: "Adik minum ____.", answer: "susu", emoji: "🥛" },
    { sentence: "Ali sepak ____.", answer: "bola", emoji: "⚽" },
    { sentence: "Siti baca ____.", answer: "buku", emoji: "📘" },
    { sentence: "Amin pakai ____.", answer: "topi", emoji: "🧢" },
    { sentence: "Saya naik ____.", answer: "bas", emoji: "🚌" },
    { sentence: "Kita lihat dengan ____.", answer: "mata", emoji: "👁️" },
    { sentence: "Buku di atas ____.", answer: "rak", emoji: "🗄️" },
    { sentence: "Saya menulis dengan ____.", answer: "pen", emoji: "🖊️" },
    { sentence: "Ibu potong ____.", answer: "kek", emoji: "🍰" }
  ];

  const modes = [
    { id: "vokal", icon: "🔤", title: "Huruf Vokal", description: "Kenal bunyi a, e, i, o dan u.", tone: "pink" },
    { id: "kv", icon: "🗣️", title: "Suku Kata KV", description: "Baca suku kata terbuka dengan yakin.", tone: "blue" },
    { id: "kvk", icon: "🧠", title: "Perkataan KVK", description: "Lengkapkan perkataan tiga huruf.", tone: "yellow" },
    { id: "padan", icon: "🖼️", title: "Padan Gambar", description: "Padankan gambar dengan perkataan.", tone: "mint" },
    { id: "susun", icon: "🧩", title: "Susun Huruf", description: "Susun huruf menjadi perkataan.", tone: "purple" },
    { id: "ayat", icon: "📖", title: "Ayat Mudah", description: "Lengkapkan ayat dengan perkataan sesuai.", tone: "orange" }
  ];

  window.GAME_DATA = { words, sentenceQuestions, modes };
}());
