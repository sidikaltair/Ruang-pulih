# Ruang Pulih Fisioterapi

Situs satu halaman untuk klinik fisioterapi Ruang Pulih di Kemang,
Jakarta Selatan, dibangun dengan Vite + React 18.

## Fitur

- Profil layanan: fisioterapi muskuloskeletal, rehabilitasi olahraga,
  terapi gerak & postur, dan home visit
- Form booking: nama, nomor WhatsApp, layanan, lokasi, tanggal, jam,
  keluhan singkat, dan persetujuan dihubungi
- Ringkasan booking + pesan WhatsApp yang sudah diformat (via `wa.me`)
- Tombol WhatsApp mengambang di semua halaman

## Jalankan lokal

```bash
npm install
npm start
```

## Build

```bash
npm run build
npm run preview
```

## Deploy ke Vercel

Proyek ini siap deploy sebagai proyek Vite: build command `npm run build`,
output directory `dist` (lihat `vercel.json`).

## Penting sebelum produksi

- Ganti nomor WhatsApp di `src/clinic.js`
  (`CLINIC_WHATSAPP_NUMBER`) dengan nomor WhatsApp Business klinik.
  Saat ini masih placeholder.
- Booking lewat WhatsApp adalah permintaan booking, bukan konfirmasi slot
  final. Belum ada backend/database untuk mengecek slot asli.
