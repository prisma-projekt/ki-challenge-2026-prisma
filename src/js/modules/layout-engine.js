/**
 * PRISMA — Layout Engine
 * Generiert responsives CSS Grid aus einem Use Case + visuelle Preview.
 *
 * Öffentliche API:
 *   generateLayout(useCase)      -> { name, css, preview, regions } | Default
 *   getLayoutCss(useCase)        -> string (nur der CSS-Code)
 *   renderLayoutPreview(layout, selector)
 *   getCurrentCss()              -> string  (für die Export-Engine)
 */

/**
 * Layout-Templates. `regions` = [label, spaltenanteil] je Desktop-Spalte,
 * daraus baut die Preview die Wireframe-Blöcke.
 * @type {Object<string, {name: string, css: string, preview: string, regions: Array<[string, number]>}>}
 */
const LAYOUT_TEMPLATES = {
  blog: {
    name: 'Blog',
    preview: 'Content + Sidebar',
    regions: [['Content', 2], ['Sidebar', 1]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-4);',
      '}',
      '@media (min-width: 768px) {',
      '  .challenge-layout {',
      '    grid-template-columns: 2fr 1fr;',
      '  }',
      '}',
    ].join('\n'),
  },
  gallery: {
    name: 'Gallery',
    preview: 'Auto-Fill Karten-Raster',
    regions: [['Item', 1], ['Item', 1], ['Item', 1]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-3);',
      '}',
      '@media (min-width: 480px) {',
      '  .challenge-layout {',
      '    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));',
      '  }',
      '}',
    ].join('\n'),
  },
  dashboard: {
    name: 'Dashboard',
    preview: 'Sidebar + Haupt-Panel',
    regions: [['Nav', 1], ['Main', 3]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-4);',
      '}',
      '@media (min-width: 1024px) {',
      '  .challenge-layout {',
      '    grid-template-columns: 240px 1fr;',
      '  }',
      '}',
    ].join('\n'),
  },
  landing: {
    name: 'Landing',
    preview: 'Hero über 3 Feature-Spalten',
    regions: [['Feature', 1], ['Feature', 1], ['Feature', 1]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-6);',
      '}',
      '@media (min-width: 768px) {',
      '  .challenge-layout {',
      '    grid-template-columns: repeat(3, 1fr);',
      '  }',
      '  .challenge-layout > :first-child {',
      '    grid-column: 1 / -1;',
      '  }',
      '}',
    ].join('\n'),
  },
  magazine: {
    name: 'Magazine',
    preview: 'Asymmetrisches 12er-Raster',
    regions: [['Lead', 3], ['Side', 1], ['Side', 1]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-4);',
      '}',
      '@media (min-width: 768px) {',
      '  .challenge-layout {',
      '    grid-template-columns: repeat(12, 1fr);',
      '  }',
      '  .challenge-layout > :first-child { grid-column: span 6; }',
      '  .challenge-layout > :nth-child(2) { grid-column: span 3; }',
      '  .challenge-layout > :nth-child(3) { grid-column: span 3; }',
      '}',
    ].join('\n'),
  },
};

const LAYOUT_ALIASES = {
  blog: 'blog',
  gallery: 'gallery',
  portfolio: 'gallery',
  dashboard: 'dashboard',
  admin: 'dashboard',
  app: 'dashboard',
  landing: 'landing',
  startup: 'landing',
  magazine: 'magazine',
  editorial: 'magazine',
  news: 'magazine',
};

/** Zuletzt generiertes Layout — für die Export-Engine. */
let currentLayout = null;

function normalizeUseCase(useCase) {
  return (useCase || '')
    .toString()
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function getDefaultLayout() {
  return {
    name: 'Standard',
    preview: 'Flexibles Auto-Raster',
    regions: [['Block', 1], ['Block', 1]],
    css: [
      '.challenge-layout {',
      '  display: grid;',
      '  grid-template-columns: 1fr;',
      '  gap: var(--space-4);',
      '}',
      '@media (min-width: 768px) {',
      '  .challenge-layout {',
      '    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));',
      '  }',
      '}',
    ].join('\n'),
  };
}

/**
 * Generiert ein Layout für einen Use Case.
 * @param {string} useCase
 * @returns {{name: string, css: string, preview: string, regions: Array<[string, number]>}}
 */
export function generateLayout(useCase) {
  const normalized = normalizeUseCase(useCase);
  const key = LAYOUT_ALIASES[normalized] || normalized;
  const template = LAYOUT_TEMPLATES[key] || getDefaultLayout();

  // Kopie zurückgeben, damit niemand versehentlich das Template mutiert.
  currentLayout = { ...template, regions: template.regions.map((r) => [...r]) };
  return currentLayout;
}

/**
 * Gibt nur den CSS-Code für einen Use Case zurück.
 * @param {string} useCase
 * @returns {string}
 */
export function getLayoutCss(useCase) {
  return generateLayout(useCase).css;
}

/** CSS des zuletzt generierten Layouts (für die Export-Engine). */
export function getCurrentCss() {
  return currentLayout ? currentLayout.css : '';
}

/**
 * Rendert eine visuelle Wireframe-Preview des Layouts.
 * @param {{name: string, preview: string, regions: Array<[string, number]>}} layout
 * @param {string} [containerSelector='#layout-preview']
 */
export function renderLayoutPreview(layout, containerSelector = '#layout-preview') {
  if (typeof document === 'undefined') return;

  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('[LayoutEngine] Container nicht gefunden:', containerSelector);
    return;
  }
  if (!layout || !Array.isArray(layout.regions)) {
    console.error('[LayoutEngine] Ungültiges Layout-Objekt:', layout);
    return;
  }

  container.innerHTML = '';

  const wireframe = document.createElement('div');
  wireframe.className = 'challenge-layout-preview__wireframe';
  wireframe.setAttribute('role', 'img');
  wireframe.setAttribute('aria-label', `Layout-Vorschau: ${layout.name} — ${layout.preview}`);
  wireframe.style.gridTemplateColumns = layout.regions.map(([, span]) => `${span}fr`).join(' ');

  layout.regions.forEach(([label]) => {
    const block = document.createElement('span');
    block.className = 'challenge-layout-preview__block';
    block.textContent = label;
    block.setAttribute('aria-hidden', 'true');
    wireframe.appendChild(block);
  });

  const caption = document.createElement('p');
  caption.className = 'challenge-layout-preview__caption';
  caption.textContent = `${layout.name} · ${layout.preview}`;

  container.appendChild(wireframe);
  container.appendChild(caption);
}
