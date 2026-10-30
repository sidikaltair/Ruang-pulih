import { useEffect, useState } from 'react';
import {
  BOOKING_LOCATIONS,
  BOOKING_SERVICES,
  CLINIC_HOURS,
  TIME_SLOTS,
  buildBookingMessage,
  buildWhatsAppUrl,
  formatDateId,
  isClinicDay,
  normalizeIndonesianPhone,
} from '../clinic';

const EMPTY_FORM = {
  name: '',
  phone: '',
  service: BOOKING_SERVICES[0],
  location: BOOKING_LOCATIONS[0],
  date: '',
  time: '',
  complaint: '',
  consent: false,
};

function todayId() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function validate(form) {
  const errors = {};
  if (form.name.trim().length < 3) errors.name = 'Isi nama lengkap (minimal 3 karakter).';
  if (!normalizeIndonesianPhone(form.phone)) {
    errors.phone = 'Isi nomor WhatsApp yang valid, mis. 0812xxxxxxx.';
  }
  if (!BOOKING_SERVICES.includes(form.service)) errors.service = 'Pilih layanan.';
  if (!BOOKING_LOCATIONS.includes(form.location)) errors.location = 'Pilih lokasi.';
  if (!form.date) {
    errors.date = 'Pilih tanggal sesi.';
  } else if (form.date < todayId()) {
    errors.date = 'Tanggal tidak boleh di masa lalu.';
  } else if (!isClinicDay(form.date)) {
    errors.date = 'Klinik tutup hari Minggu. Pilih Senin–Sabtu.';
  }
  if (!TIME_SLOTS.includes(form.time)) errors.time = 'Pilih jam sesi.';
  if (form.complaint.length > 300) errors.complaint = 'Keluhan singkat maksimal 300 karakter.';
  if (!form.consent) errors.consent = 'Centang persetujuan untuk dihubungi via WhatsApp.';
  return errors;
}

export default function BookingForm({ preselectedService }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(null);
  const [copied, setCopied] = useState(false);

  // Saat pengunjung klik panah di daftar layanan, layanan itu jadi preselected.
  useEffect(() => {
    if (preselectedService && BOOKING_SERVICES.includes(preselectedService)) {
      setForm((prev) => ({ ...prev, service: preselectedService }));
    }
  }, [preselectedService]);

  const setField = (field) => (event) => {
    const value = field === 'consent' ? event.target.checked : event.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setCopied(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;
    const booking = { ...form, phone: normalizeIndonesianPhone(form.phone) };
    setSubmitted({ ...booking, message: buildBookingMessage(booking) });
  };

  const copyMessage = async () => {
    if (!submitted) return;
    try {
      await navigator.clipboard.writeText(submitted.message);
      setCopied(true);
    } catch {
      // Fallback: biarkan pengguna menyalin manual dari kotak pesan.
      setCopied(false);
    }
  };

  if (submitted) {
    return (
      <div className="booking-summary" aria-live="polite">
        <p className="eyebrow">PERMINTAAN BOOKING SIAP DIKIRIM</p>
        <h3>Ringkasan booking kamu</h3>
        <dl>
          <div><dt>Nama</dt><dd>{submitted.name}</dd></div>
          <div><dt>Layanan</dt><dd>{submitted.service}</dd></div>
          <div><dt>Lokasi</dt><dd>{submitted.location}</dd></div>
          <div><dt>Jadwal</dt><dd>{formatDateId(submitted.date)} · {submitted.time} WIB</dd></div>
          {submitted.complaint.trim() && (
            <div><dt>Keluhan</dt><dd>{submitted.complaint.trim()}</dd></div>
          )}
        </dl>
        <p className="booking-note">
          Ini permintaan booking, bukan konfirmasi final. Admin akan membalas
          via WhatsApp untuk memastikan slot masih tersedia.
        </p>
        <label className="booking-message-label" htmlFor="booking-message">Pesan WhatsApp</label>
        <textarea id="booking-message" readOnly value={submitted.message} rows={9} />
        <div className="booking-actions">
          <a
            className="button button-dark"
            href={buildWhatsAppUrl(submitted.message)}
            target="_blank"
            rel="noreferrer"
          >
            Kirim via WhatsApp <span aria-hidden="true">↗</span>
          </a>
          <button className="button button-outline" type="button" onClick={copyMessage}>
            {copied ? 'Pesan tersalin ✓' : 'Salin pesan'}
          </button>
          <button
            className="text-link"
            type="button"
            onClick={() => { setSubmitted(null); setForm(EMPTY_FORM); }}
          >
            Ubah booking
          </button>
        </div>
      </div>
    );
  }

  return (
    <form className="booking-form" onSubmit={handleSubmit} noValidate>
      <div className="form-field">
        <label htmlFor="booking-name">Nama lengkap *</label>
        <input id="booking-name" type="text" autoComplete="name" placeholder="Nama kamu"
          value={form.name} onChange={setField('name')} aria-invalid={!!errors.name} />
        {errors.name && <p className="field-error" role="alert">{errors.name}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="booking-phone">Nomor WhatsApp *</label>
        <input id="booking-phone" type="tel" autoComplete="tel" placeholder="0812xxxxxxx"
          value={form.phone} onChange={setField('phone')} aria-invalid={!!errors.phone} />
        {errors.phone && <p className="field-error" role="alert">{errors.phone}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="booking-service">Layanan *</label>
        <select id="booking-service" value={form.service} onChange={setField('service')}>
          {BOOKING_SERVICES.map((service) => (
            <option key={service} value={service}>{service}</option>
          ))}
        </select>
        {errors.service && <p className="field-error" role="alert">{errors.service}</p>}
      </div>

      <div className="form-field">
        <label htmlFor="booking-location">Lokasi *</label>
        <select id="booking-location" value={form.location} onChange={setField('location')}>
          {BOOKING_LOCATIONS.map((location) => (
            <option key={location} value={location}>{location}</option>
          ))}
        </select>
        {errors.location && <p className="field-error" role="alert">{errors.location}</p>}
      </div>

      <div className="form-row">
        <div className="form-field">
          <label htmlFor="booking-date">Tanggal *</label>
          <input id="booking-date" type="date" min={todayId()}
            value={form.date} onChange={setField('date')} aria-invalid={!!errors.date} />
          {errors.date && <p className="field-error" role="alert">{errors.date}</p>}
        </div>
        <div className="form-field">
          <label htmlFor="booking-time">Jam (WIB) *</label>
          <select id="booking-time" value={form.time} onChange={setField('time')}>
            <option value="">Pilih jam</option>
            {TIME_SLOTS.map((slot) => (
              <option key={slot} value={slot}>{slot}</option>
            ))}
          </select>
          {errors.time && <p className="field-error" role="alert">{errors.time}</p>}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="booking-complaint">Keluhan singkat (opsional)</label>
        <textarea id="booking-complaint" rows={3} maxLength={300}
          placeholder="Mis. nyeri punggung bawah sejak 2 minggu lalu"
          value={form.complaint} onChange={setField('complaint')} />
        <p className="field-hint">
          Cukup gambaran umum. Jangan tulis riwayat medis lengkap di sini.
          {form.complaint.length}/300
        </p>
        {errors.complaint && <p className="field-error" role="alert">{errors.complaint}</p>}
      </div>

      <label className="consent-row">
        <input type="checkbox" checked={form.consent} onChange={setField('consent')} />
        <span>Saya setuju dihubungi admin {CLINIC_HOURS} via WhatsApp untuk konfirmasi jadwal.</span>
      </label>
      {errors.consent && <p className="field-error" role="alert">{errors.consent}</p>}

      <button className="button button-dark booking-submit" type="submit">
        Lihat ringkasan &amp; kirim via WhatsApp <span aria-hidden="true">↗</span>
      </button>
      <p className="booking-note">
        Jadwal final dikonfirmasi admin. Klinik buka {CLINIC_HOURS}.
      </p>
    </form>
  );
}
