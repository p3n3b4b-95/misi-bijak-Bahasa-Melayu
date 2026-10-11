# Misi Bijak Bahasa Melayu

Game pendidikan berwarna untuk murid Pemulihan Khas. Projek ini menggunakan HTML, CSS dan JavaScript tulen supaya ringan, mudah diselenggara dan terus serasi dengan GitHub Pages.

## Permainan

- Huruf vokal
- Suku kata KV
- Perkataan KVK
- Padanan gambar
- Susun huruf
- Ayat mudah

Setiap misi mempunyai 8 soalan, markah, bunyi maklum balas, animasi, bintang pencapaian dan sistem tahap. Kemajuan disimpan pada peranti melalui `localStorage`; tiada akaun atau login diperlukan.

## Jalankan di komputer

```bash
npm test
npm run serve
```

Buka `http://localhost:8080`. Elakkan membuka `index.html` terus daripada `file://` kerana sesetengah pelayar mengehadkan ciri suara dan storan dalam mod itu.

## Struktur projek

```text
index.html          Struktur antaramuka
css/styles.css      Gaya, responsif dan animasi
js/questions.js     Bank perkataan, ayat dan senarai misi
js/core.js          Logik tulen penjanaan soalan/tahap
js/app.js           Interaksi DOM, bunyi dan simpanan kemajuan
assets/             Logo dan ilustrasi SVG
tests/              Ujian automatik logik permainan
MAINTENANCE.md      Panduan kemas kini
TESTING.md          Senarai semak ujian manual
```

## Terbitkan dengan GitHub Pages

1. Push semua fail ke branch `main` bagi sebuah repository awam.
2. Workflow rasmi `.github/workflows/deploy-pages.yml` akan menjalankan deployment.
3. Buka **Settings → Pages** dan pastikan sumber **GitHub Actions** dipilih jika repository belum pernah menggunakan Pages.
4. Selepas workflow Pages selesai, URL lazimnya berbentuk `https://USERNAME.github.io/NAMA-REPO/`.

Semak tab **Actions** dan buka URL pada telefon sebelum berkongsi dengan murid.

## Privasi

Nama murid dan kemajuan hanya disimpan pada pelayar/peranti berkenaan. Projek ini tidak menghantar data ke server dan tidak menggunakan analitik.
