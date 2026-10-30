// ---------------------------------------------------------------------------
// Konfigurasi klinik — UBAH NOMOR INI SEBELUM DIPAKAI PRODUKSI.
// Nomor harus format internasional tanpa "+" dan tanpa spasi, contoh: 62812...
// Nomor di bawah ini HANYA placeholder supaya tombol WA tidak rusak saat
// development; ganti dengan nomor WhatsApp Business klinik yang sebenarnya.
// ---------------------------------------------------------------------------
export const CLINIC_NAME = 'Ruang Pulih Fisioterapi';
export const CLINIC_WHATSAPP_NUMBER = '6280000000000'; // TODO: ganti nomor WA klinik
export const CLINIC_LOCATION = 'Kemang, Jakarta Selatan';
export const CLINIC_HOURS = 'Senin–Sabtu, 08.00–19.00';

export const TIME_SLOTS = [
  '08.00', '09.00', '10.00', '11.00', '13.00',
  '14.00', '15.00', '16.00', '17.00', '18.00',
];

export const BOOKING_SERVICES = [
  'Fisioterapi muskuloskeletal',
  'Rehabilitasi olahraga',
  'Terapi gerak & postur',
  'Home visit',
  'Konsultasi umum',
];

export const BOOKING_LOCATIONS = ['Klinik Kemang', 'Home visit'];

/** Normalisasi nomor HP Indonesia ke format 62...; return '' kalau tidak valid. */
export function normalizeIndonesianPhone(raw) {
  const digits = String(raw || '').replace(/\D/g, '');
  let normalized = digits;
  if (normalized.startsWith('0')) normalized = `62${normalized.slice(1)}`;
  if (normalized.startsWith('62')) return /^62\d{9,13}$/.test(normalized) ? normalized : '';
  return '';
}

/** true kalau tanggal adalah hari operasional klinik (Senin–Sabtu). */
export function isClinicDay(dateString) {
  if (!dateString) return false;
  const day = new Date(`${dateString}T12:00:00`).getDay(); // 0 = Minggu
  return day !== 0;
}

/** Format YYYY-MM-DD ke bahasa Indonesia, mis. "Senin, 3 November 2026". */
export function formatDateId(dateString) {
  if (!dateString) return '';
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(new Date(`${dateString}T12:00:00`));
}

export function buildBookingMessage(booking) {
  const lines = [
    `Halo ${CLINIC_NAME}, saya ingin booking sesi fisioterapi.`,
    '',
    `Nama: ${booking.name}`,
    `Nomor WA: ${booking.phone}`,
    `Layanan: ${booking.service}`,
    `Lokasi: ${booking.location}`,
    `Tanggal: ${formatDateId(booking.date)}`,
    `Jam: ${booking.time} WIB`,
  ];
  if (booking.complaint?.trim()) lines.push(`Keluhan singkat: ${booking.complaint.trim()}`);
  lines.push('', 'Mohon konfirmasi ketersediaan jadwalnya. Terima kasih.');
  return lines.join('\n');
}

export function buildWhatsAppUrl(message, number = CLINIC_WHATSAPP_NUMBER) {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

export function buildGeneralWhatsAppUrl() {
  return buildWhatsAppUrl(
    `Halo ${CLINIC_NAME}, saya ingin konsultasi tentang layanan fisioterapi.`,
  );
}
