// Membuat ikon PWA Ruang Pulih (icon-192.png, icon-512.png) tanpa dependensi.
// Ikon digenerate saat build supaya file biner tidak perlu disimpan di repo:
// latar hijau brand, huruf "RP" putih, dan aksen coral di bawahnya.
// Desain maskable-safe: latar memenuhi seluruh kanvas, konten di zona tengah.
import { deflateSync } from 'node:zlib';
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const GREEN = [36, 77, 60, 255];
const PAPER = [251, 250, 247, 255];
const CORAL = [239, 118, 92, 255];

// Bitmap 5x7 untuk huruf R dan P.
const GLYPHS = {
  R: [
    '11110',
    '10001',
    '10001',
    '11110',
    '10100',
    '10010',
    '10001',
  ],
  P: [
    '11110',
    '10001',
    '10001',
    '11110',
    '10000',
    '10000',
    '10000',
  ],
};

const CRC_TABLE = (() => {
  const table = new Int32Array(256);
  for (let n = 0; n < 256; n += 1) {
    let c = n;
    for (let k = 0; k < 8; k += 1) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[n] = c;
  }
  return table;
})();

function crc32(buf) {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i += 1) c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, 'ascii');
  data.copy(out, 8);
  out.writeUInt32BE(crc32(Buffer.concat([Buffer.from(type, 'ascii'), data])), 8 + data.length);
  return out;
}

function encodePng(size, pixels) {
  const raw = Buffer.alloc(size * (size * 4 + 1));
  for (let y = 0; y < size; y += 1) {
    raw[y * (size * 4 + 1)] = 0; // filter: none
    Buffer.from(pixels.buffer, y * size * 4, size * 4).copy(raw, y * (size * 4 + 1) + 1);
  }
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(size, 0);
  ihdr.writeUInt32BE(size, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', deflateSync(raw)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

function drawIcon(size) {
  const pixels = new Uint8ClampedArray(size * size * 4);
  for (let i = 0; i < size * size; i += 1) pixels.set(GREEN, i * 4);

  const set = (x, y, color) => {
    if (x < 0 || y < 0 || x >= size || y >= size) return;
    pixels.set(color, (y * size + x) * 4);
  };
  const fillRect = (x0, y0, w, h, color) => {
    for (let y = y0; y < y0 + h; y += 1) for (let x = x0; x < x0 + w; x += 1) set(x, y, color);
  };

  const cell = Math.floor(size * 0.078); // 512 -> 39, 192 -> 14
  const cols = 11; // R (5) + gap (1) + P (5)
  const rows = 7;
  const textW = cols * cell;
  const textH = rows * cell;
  const barH = Math.max(4, Math.floor(cell / 2));
  const gap = barH * 2;
  const totalH = textH + gap + barH;
  const x0 = Math.floor((size - textW) / 2);
  const y0 = Math.floor((size - totalH) / 2);

  ['R', 'P'].forEach((letter, li) => {
    const gx = x0 + li * 6 * cell;
    GLYPHS[letter].forEach((row, ry) => {
      [...row].forEach((bit, rx) => {
        if (bit === '1') fillRect(gx + rx * cell, y0 + ry * cell, cell, cell, PAPER);
      });
    });
  });
  fillRect(x0, y0 + textH + gap, textW, barH, CORAL);

  return encodePng(size, pixels);
}

const here = dirname(fileURLToPath(import.meta.url));
const outDir = join(here, '..', 'public');
mkdirSync(outDir, { recursive: true });
for (const size of [192, 512]) {
  writeFileSync(join(outDir, `icon-${size}.png`), drawIcon(size));
  console.log(`icon-${size}.png dibuat (${size}x${size})`);
}
