import { buildGeneralWhatsAppUrl } from '../clinic';

/**
 * Tombol WA mengambang. Ini HANYA tautan wa.me (chat manual) — bukan agen
 * otomatis. Agen WA otomatis butuh WhatsApp Business Cloud API + webhook di
 * server, dan tidak boleh dijalankan dari kode frontend.
 */
export default function WhatsAppButton() {
  return (
    <a
      className="whatsapp-float"
      href={buildGeneralWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat WhatsApp Ruang Pulih"
    >
      <span className="whatsapp-float-mark" aria-hidden="true">WA</span>
      <span className="whatsapp-float-label">Chat WhatsApp</span>
    </a>
  );
}
