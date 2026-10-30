# Booking + Tombol WhatsApp — Ruang Pulih

## Yang ditambahkan

- `src/clinic.js` — konfigurasi klinik, daftar jam, validasi nomor HP
  Indonesia, format pesan booking, dan link `wa.me`.
- `src/components/BookingForm.jsx` — form booking: nama, nomor WA, layanan,
  lokasi (klinik/home visit), tanggal, jam, keluhan singkat, dan persetujuan
  dihubungi. Ada validasi: tanggal tidak boleh lewat, hari Minggu ditolak
  (klinik tutup), dan jam hanya slot 08.00–18.00 WIB.
- `src/components/WhatsAppButton.jsx` — tombol WA mengambang di semua halaman.
- `src/App.jsx` — CTA “Jadwalkan sesi” dan “Mulai konsultasi” kini mengarah
  ke `#booking`; klik panah di daftar layanan akan memilih layanan itu di form.
- `index.html` — bahasa diubah ke `id`, judul dan deskripsi SEO diperbarui.
- `src/App.css` — styling form, ringkasan booking, dan tombol WA.
- `src/App.test.jsx` — test untuk form booking dan tombol WA.

## Nomor WhatsApp klinik

Nomor di `src/clinic.js` sudah diisi: `6289512728697` (dari `089512728697`).
Kalau nomor klinik berubah, ganti baris `CLINIC_WHATSAPP_NUMBER` di file itu
(format internasional tanpa `+`).

## PWA (install sebagai aplikasi)

Situs ini sudah PWA, tanpa dependensi tambahan:

- `public/manifest.json` — nama "Ruang Pulih Fisioterapi", tema hijau
  `#244d3c`, tampil `standalone`.
- `public/sw.js` — service worker: navigasi network-first dengan fallback
  cache, aset same-origin cache-first. Diregistrasi hanya di production
  (`src/index.jsx`).
- `scripts/generate-icons.mjs` — ikon 192x192 dan 512x512 digenerate saat
  `npm run build` (latar hijau, huruf "RP", aksen coral, maskable-safe),
  jadi file PNG-nya tidak perlu disimpan di repo. Ikon tab browser pakai
  `public/favicon.svg` (teks, ikut ter-push).

Cara install setelah situs live (wajib HTTPS, mis. Vercel):

- Android (Chrome): buka situs → menu ⋮ → "Tambahkan ke Layar Utama"
  atau "Instal aplikasi".
- iOS (Safari): buka situs → Bagikan → "Tambah ke Layar Utama".
- Catatan: install penuh butuh service worker aktif + manifest valid;
  cek di Chrome DevTools → Application → Manifest & Service Workers.
  Booking tetap permintaan via WhatsApp, bukan konfirmasi slot otomatis.

## Cara kerja (saat ini)

1. Pengunjung isi form dan submit.
2. Muncul ringkasan + pesan WhatsApp yang sudah diformat.
3. Pengunjung klik “Kirim via WhatsApp” → membuka `wa.me` dengan pesan
   terisi. Pesan juga bisa disalin manual.
4. **Ini permintaan booking, bukan konfirmasi slot.** Admin harus membalas
   dan mengonfirmasi ketersediaan, karena belum ada backend/database.

## Yang belum ada (tahap berikutnya)

- Backend + database untuk menyimpan booking dan mengecek slot asli.
- Agen WA otomatis: itu butuh WhatsApp Business Cloud API + webhook di
  server, dan tidak boleh dijalankan dari kode frontend (token akan bocor).

## Cara pasang ke repo GitHub

Dari folder repo lokal (bukan dari folder hasil ini):

```bash
# Salin file-file baru/berubah ke repo lokal kamu, lalu:
git status
git add src/clinic.js src/components/BookingForm.jsx src/components/WhatsAppButton.jsx \
  src/App.jsx src/App.css src/App.test.jsx index.html
git commit -m "Tambah form booking dan tombol WhatsApp"
git push
```

## Cara test lokal

```bash
npm install
npm test
npm run build
npm run preview
```

Lalu buka `#booking`, isi form, dan cek ringkasan + link WhatsApp-nya.
