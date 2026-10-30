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

## PENTING: ganti nomor WhatsApp dulu

Buka `src/clinic.js` dan ganti baris ini dengan nomor WhatsApp Business
klinik (format internasional tanpa `+`, mis. `62812...`):

```js
export const CLINIC_WHATSAPP_NUMBER = '6280000000000'; // TODO: ganti nomor WA klinik
```

Sampai diganti, tombol WA dan link kirim booking masih mengarah ke nomor
placeholder di atas.

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
