/**
 * PRISMA — Color Engine
 * --------------------------------------------------
 * Features:
 * - Mood-basierte Farbpaletten
 * - HSL → HEX Conversion
 * - CSS Variable Generator
 * - DOM Rendering
 * - WCAG Kontrastprüfung
 * - Image Palette Extraction (Bonus)
 */

/**
 * Vordefinierte Farbpaletten für verschiedene Stimmungen
 * @type {Object<string, string[]>}
 */
const MOOD_PALETTES = {
  calm: ['#A7C7E7', '#89B0AE', '#BEE3DB', '#FAF9F9', '#DDEDEA'],
  energetic: ['#FF6B6B', '#FF9F1C', '#FFD93D', '#6BCB77', '#4D96FF'],
  focus: ['#1F2937', '#374151', '#4B5563', '#9CA3AF', '#E5E7EB'],
  sunset: ['#FF5E5B', '#FF9A8B', '#FF6F91', '#FFC75F', '#F9F871'],
  ocean: ['#003B73', '#0077B6', '#00B4D8', '#90E0EF', '#CAF0F8'],
  forest: ['#1B4332', '#2D6A4F', '#40916C', '#74C69D', '#B7E4C7'],
  lavender: ['#E6E6FA', '#CDB4DB', '#FFC8DD', '#FFAFCC', '#BDE0FE'],
  fire: ['#8B0000', '#B22222', '#FF4500', '#FF6347', '#FFD700'],
  neon: ['#39FF14', '#FF00FF', '#00FFFF', '#FF3131', '#FFFF00'],
  minimal: ['#FFFFFF', '#F5F5F5', '#E0E0E0', '#BDBDBD', '#9E9E9E']
};

/* -------------------------
   Utils
--------------------------*/

function normalizeMood(mood) {
  return (mood || '').toString().trim().toLowerCase();
}

function hexToRgb(hex) {
  const clean = hex.replace('#', '');
  const bigint = parseInt(clean, 16);

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

function getContrastRatio(hex1, hex2) {
  const luminance = (hex) => {
    const { r, g, b } = hexToRgb(hex);
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928
        ? v / 12.92
        : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  };

  const l1 = luminance(hex1);
  const l2 = luminance(hex2);

  return l1 > l2
    ? (l1 + 0.05) / (l2 + 0.05)
    : (l2 + 0.05) / (l1 + 0.05);
}

function getWcagBadge(ratio) {
  if (ratio >= 7) return 'AAA';
  if (ratio >= 4.5) return 'AA';
  return '✗';
}

/* -------------------------
   Palette Generation
--------------------------*/

function generateHslPalette(seedHue = Math.floor(Math.random() * 360)) {
  const palette = [];
  const step = 360 / 5;

  for (let i = 0; i < 5; i++) {
    const h = (seedHue + i * step) % 360;
    const s = 65 + Math.random() * 10;
    const l = 50 + Math.random() * 10;
    palette.push(hslToHex(h, s, l));
  }

  return palette;
}

export function generatePalette(mood) {
  const key = normalizeMood(mood);

  if (MOOD_PALETTES[key]) {
    return [...MOOD_PALETTES[key]];
  }

  return generateHslPalette();
}

/* -------------------------
   Color Conversion
--------------------------*/

export function hslToHex(h, s, l) {
  s /= 100;
  l /= 100;

  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;

  let r = 0, g = 0, b = 0;

  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];

  const toHex = (v) =>
    Math.round((v + m) * 255)
      .toString(16)
      .padStart(2, '0');

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/* -------------------------
   CSS Variables
--------------------------*/

export function generateCssVariables(palette) {
  return `:root {
${palette.map((c, i) => `  --challenge-generated-${i + 1}: ${c};`).join('\n')}
}`;
}

/* -------------------------
   Render UI
--------------------------*/

export function renderPalette(palette, containerSelector = '#color-preview') {
  const container = document.querySelector(containerSelector);

  if (!container) {
    console.error('[ColorEngine] Container not found:', containerSelector);
    return;
  }

  container.innerHTML = '';

  palette.forEach((color) => {
    const swatch = document.createElement('div');
    swatch.className = 'challenge-color-preview__swatch';
    swatch.style.backgroundColor = color;

    const label = document.createElement('span');
    label.className = 'challenge-color-preview__label';
    label.textContent = color;

    const badge = document.createElement('span');
    badge.className = 'challenge-color-preview__badge';

    const best = Math.max(
      getContrastRatio(color, '#FFFFFF'),
      getContrastRatio(color, '#000000')
    );

    badge.textContent = getWcagBadge(best);

    swatch.appendChild(label);
    swatch.appendChild(badge);

    container.appendChild(swatch);
  });
}

/* -------------------------
   BONUS: Image Extraction
--------------------------*/

function drawToCanvas(image, size = 64) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  canvas.width = size;
  canvas.height = size;

  ctx.drawImage(image, 0, 0, size, size);

  return ctx.getImageData(0, 0, size, size).data;
}

function rgbToHex(r, g, b) {
  return (
    '#' +
    [r, g, b]
      .map(v => v.toString(16).padStart(2, '0'))
      .join('')
      .toUpperCase()
  );
}

function quantize(r, g, b, step = 24) {
  return [
    Math.floor(r / step) * step,
    Math.floor(g / step) * step,
    Math.floor(b / step) * step
  ];
}

export function extractPaletteFromImage(imageElement, maxColors = 5) {
  if (!imageElement) {
    console.error('[ColorEngine] No image provided');
    return [];
  }

  const data = drawToCanvas(imageElement, 64);
  const map = new Map();

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (a < 128) continue;

    const [qr, qg, qb] = quantize(r, g, b);
    const key = `${qr}-${qg}-${qb}`;

    const luminance =
      0.2126 * r +
      0.7152 * g +
      0.0722 * b;

    const existing = map.get(key)?.weight || 0;

    map.set(key, {
      r: qr,
      g: qg,
      b: qb,
      weight: existing + luminance
    });
  }

  return [...map.values()]
    .sort((a, b) => b.weight - a.weight)
    .slice(0, maxColors)
    .map(c => rgbToHex(c.r, c.g, c.b));
}

/* -------------------------
   Export API
--------------------------*/

export default {
  MOOD_PALETTES,
  generatePalette,
  hslToHex,
  generateCssVariables,
  renderPalette,
  extractPaletteFromImage
};