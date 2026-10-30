import { expect, test } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the physiotherapy landing page and consultation link', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /kembali bergerak/i })).toBeDefined();
  expect(screen.getByRole('link', { name: /mulai konsultasi/i }).getAttribute('href')).toBe('#booking');
});

test('renders the booking form and floating WhatsApp button', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: /atur jadwalmu/i })).toBeDefined();
  expect(screen.getByLabelText(/nama lengkap/i)).toBeDefined();
  expect(screen.getByLabelText(/nomor whatsapp/i)).toBeDefined();
  expect(screen.getByRole('link', { name: /chat whatsapp ruang pulih/i }).getAttribute('href'))
    .toMatch(/^https:\/\/wa\.me\//);
});
