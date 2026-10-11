# Panduan Maintenance

## Tambah atau ubah soalan

Edit `js/questions.js`.

Setiap entri perkataan menggunakan format:

```js
{ word: "buku", emoji: "📘", type: "kv", sentence: "Siti baca buku." }
```

Nilai `type` yang digunakan ialah `vokal`, `kv` atau `kvk`. Pastikan perkataan menggunakan huruf kecil tanpa ruang.

Soalan ayat menggunakan format:

```js
{ sentence: "Siti baca ____.", answer: "buku", emoji: "📘" }
```

Gunakan tepat empat garis bawah (`____`) untuk tempat jawapan.

## Ubah warna atau susun atur

Edit pemboleh ubah warna pada bahagian `:root` dalam `css/styles.css`. Jangan tambah mod hitam putih atau `grayscale`, kerana reka bentuk permainan ini mesti kekal berwarna.

## Ubah bilangan soalan

Dalam `js/app.js`, cari:

```js
questions = Core.buildRound(currentMode, DATA, 8);
```

Tukar `8` kepada bilangan yang dikehendaki. Paparan teks “8 soalan / misi” dalam `index.html` juga perlu dikemas kini.

## Sebelum release

1. Jalankan `npm test`.
2. Jalankan server tempatan dengan `npm run serve`.
3. Lengkapkan semua semakan dalam `TESTING.md`.
4. Semak tiada ralat pada browser console.
5. Commit perubahan dengan mesej yang jelas sebelum push.

## Versi dan rollback

Gunakan tag Git untuk release stabil:

```bash
git tag -a v1.0.0 -m "Release v1.0.0"
git push origin v1.0.0
```

Jika release baharu bermasalah, revert commit berkenaan melalui Git dan jangan padam sejarah branch utama.
