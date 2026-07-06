/**
 * PRISMA — Export System
 * Kopiert generierten Code in die Zwischenablage, bietet Datei-Downloads
 * und teilbare Links für den aktuellen Design-Zustand.
 *
 * INTEGRATIONS-HINWEISE (bitte in main.js / App-Bootstrap erledigen):
 *
 * 1. i18n:
 *    Dieses Modul kennt eure de.js/en.js-Struktur nicht direkt (kein Import,
 *    um keine falsche Pfad-Annahme zu riskieren). Stattdessen wird die
 *    echte Übersetzungsfunktion injiziert:
 *
 *      import { translate } from './i18n.js';
 *      import { setI18nTranslator } from './modules/export-system.js';
 *      setI18nTranslator(translate);
 *
 *    Ohne Injection greifen interne deutsche Fallback-Texte für
 *    export.feedback.success / .error / .linkCopied.
 *
 * 2. CSS-Quellen (Color/Type/Layout Engine):
 *    Ebenfalls über Injection, damit dieses Modul nicht an konkrete
 *    Engine-Dateinamen gekoppelt ist:
 *
 *      import { registerCssSource } from './modules/export-system.js';
 *      registerCssSource('colors', () => colorEngine.getCurrentCss());
 *      registerCssSource('typography', () => typeEngine.getCurrentCss());
 *      registerCssSource('layout', () => layoutEngine.getCurrentCss());
 *
 *    Alternativ: Ein DOM-Element mit data-export-source="colors" (o.ä.)
 *    im Markup — dessen .value/.textContent wird als Fallback gelesen.
 *
 * 3. Erwartetes HTML (Beispiel):
 *
 *      <button
 *        class="challenge-export-panel__copy-btn"
 *        data-export-target="colors"
 *        aria-label="Farb-CSS in Zwischenablage kopieren">
 *        Farben kopieren
 *      </button>
 *
 *      <button
 *        class="challenge-export-panel__download-btn"
 *        data-export-format="json"
 *        aria-label="Design Tokens als JSON herunterladen">
 *        JSON exportieren
 *      </button>
 *
 *      <button
 *        class="challenge-export-panel__share-btn"
 *        aria-label="Teilbaren Link erzeugen">
 *        Link teilen
 *      </button>
 *      <output class="challenge-export-panel__share-link" hidden></output>
 */

/* ==========================================================================
   PFLICHT — Basis-Export (Clipboard, CSS-Kombination, Feedback, Buttons)
   ========================================================================== */

export const EXPORT_TARGETS = ['colors', 'typography', 'layout', 'all'];

/**
 * Kopiert Text in die Zwischenablage.
 * @param {string} text - Der zu kopierende Text
 * @returns {Promise<boolean>} true = erfolgreich
 */
export async function copyToClipboard(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('[Export System] Clipboard API fehlgeschlagen, versuche Fallback:', error);
    }
  }
  return legacyCopy(text);
}

/**
 * Fallback-Kopiermechanismus über execCommand (ältere Browser / unsicherer Kontext).
 * @param {string} text
 * @returns {boolean}
 */
function legacyCopy(text) {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.top = '-9999px';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  textarea.setSelectionRange(0, textarea.value.length);

  let success = false;
  try {
    success = document.execCommand('copy');
  } catch (error) {
    console.error('[Export System] execCommand-Fallback fehlgeschlagen:', error);
    success = false;
  } finally {
    document.body.removeChild(textarea);
  }
  return success;
}

/**
 * Kombiniert CSS aus allen Engines zu einem kommentierten Block.
 * @param {Object} options
 * @param {string} [options.colorCss] - CSS aus Color Engine
 * @param {string} [options.typeCss] - CSS aus Type Engine
 * @param {string} [options.layoutCss] - CSS aus Layout Engine
 * @returns {string} Kombinierter CSS-Block
 */
export function combineCss({ colorCss = '', typeCss = '', layoutCss = '' } = {}) {
  const timestamp = new Date().toISOString().slice(0, 10);

  return [
    '/* ======================================== */',
    '/* PRISMA Design System                      */',
    `/* Generated: ${timestamp}                    */`,
    '/* ======================================== */',
    '',
    '/* --- Colors --- */',
    colorCss.trim() || '/* Keine Farb-Variablen generiert */',
    '',
    '/* --- Typography --- */',
    typeCss.trim() || '/* Keine Typografie-Regeln generiert */',
    '',
    '/* --- Layout --- */',
    layoutCss.trim() || '/* Keine Layout-Regeln generiert */',
    '',
  ].join('\n');
}

/* --- i18n-Injection (siehe Hinweis oben) --- */

const DEFAULT_FEEDBACK_TEXT = {
  'export.feedback.success': 'In die Zwischenablage kopiert!',
  'export.feedback.error': 'Kopieren fehlgeschlagen. Bitte erneut versuchen.',
  'export.feedback.linkCopied': 'Link in die Zwischenablage kopiert!',
};

const I18N_KEY_PATTERN = /^[a-z][a-zA-Z0-9]*(\.[a-z][a-zA-Z0-9]*)+$/;

let i18nTranslator = null;

/**
 * Registriert die echte Übersetzungsfunktion (aus eurem i18n-Modul).
 * @param {(key: string) => string} translatorFn
 */
export function setI18nTranslator(translatorFn) {
  i18nTranslator = typeof translatorFn === 'function' ? translatorFn : null;
}

/**
 * Löst einen Feedback-Text auf: entweder ein i18n-Key
 * (z. B. "export.feedback.success") oder ein freier Text.
 * @param {string} message
 * @returns {{ text: string, i18nKey: string|null }}
 */
function resolveFeedbackText(message) {
  const isKey = I18N_KEY_PATTERN.test(message);
  if (!isKey) {
    return { text: message, i18nKey: null };
  }

  if (i18nTranslator) {
    try {
      const translated = i18nTranslator(message);
      if (translated) return { text: translated, i18nKey: message };
    } catch (error) {
      console.error('[Export System] i18n-Übersetzung fehlgeschlagen:', error);
    }
  }

  return { text: DEFAULT_FEEDBACK_TEXT[message] || message, i18nKey: message };
}

/* --- Toast / Feedback --- */

let toastTimeoutId = null;

function getToastRegion() {
  let region = document.getElementById('challenge-export-toast-region');
  if (!region) {
    region = document.createElement('div');
    region.id = 'challenge-export-toast-region'; // JS-Hook, kein Styling-Hook
    region.className = 'challenge-export-panel__toast-region';
    document.body.appendChild(region);
  }
  return region;
}

/**
 * Zeigt visuelles Feedback nach dem Kopieren/Exportieren.
 * @param {string} message - i18n-Key (z. B. "export.feedback.success") oder freier Text
 * @param {'success'|'error'} [type='success']
 */
export function showFeedback(message, type = 'success') {
  const region = getToastRegion();
  const { text, i18nKey } = resolveFeedbackText(message);

  region.innerHTML = '';

  const toast = document.createElement('div');
  toast.className = `challenge-export-panel__toast challenge-export-panel__toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.setAttribute('aria-atomic', 'true');

  const icon = document.createElement('i');
  icon.className = `challenge-export-panel__toast-icon ph ${
    type === 'error' ? 'ph-warning-circle' : 'ph-check-circle'
  }`;
  icon.setAttribute('aria-hidden', 'true');

  const messageEl = document.createElement('span');
  messageEl.className = 'challenge-export-panel__toast-message';
  messageEl.textContent = text;
  if (i18nKey) {
    messageEl.setAttribute('data-i18n', i18nKey);
  }

  toast.append(icon, messageEl);
  region.append(toast);

  if (toastTimeoutId) {
    clearTimeout(toastTimeoutId);
  }
  toastTimeoutId = setTimeout(() => {
    toast.remove();
    toastTimeoutId = null;
  }, 3000);
}

/* --- CSS-Quellen-Injection (siehe Hinweis oben) --- */

const cssSources = new Map();

/**
 * Registriert eine Funktion, die aktuelles CSS für ein Ziel liefert.
 * @param {'colors'|'typography'|'layout'} target
 * @param {() => string} getter
 */
export function registerCssSource(target, getter) {
  if (typeof getter !== 'function') {
    console.warn(`[Export System] registerCssSource: getter für "${target}" ist keine Funktion.`);
    return;
  }
  cssSources.set(target, getter);
}

function readCssFromDom(target) {
  const source = document.querySelector(`[data-export-source="${target}"]`);
  if (!source) return '';
  return 'value' in source ? source.value : source.textContent;
}

function getCssFor(target) {
  if (cssSources.has(target)) {
    try {
      return cssSources.get(target)() || '';
    } catch (error) {
      console.error(`[Export System] CSS-Provider für "${target}" ist fehlgeschlagen:`, error);
      return '';
    }
  }
  return readCssFromDom(target);
}

function warnIfMissingAriaLabel(button, context) {
  if (!button.hasAttribute('aria-label')) {
    console.warn(`[Export System] ${context}: Button ohne aria-label gefunden.`, button);
  }
}

/**
 * Initialisiert alle Copy-to-Clipboard-Buttons
 * (.challenge-export-panel__copy-btn[data-export-target]).
 */
export function initExportButtons() {
  const buttons = document.querySelectorAll(
    '.challenge-export-panel__copy-btn[data-export-target]'
  );

  buttons.forEach((button) => {
    warnIfMissingAriaLabel(button, 'initExportButtons');

    button.addEventListener('click', async () => {
      const target = button.dataset.exportTarget;

      const cssBlock =
        target === 'all'
          ? combineCss({
              colorCss: getCssFor('colors'),
              typeCss: getCssFor('typography'),
              layoutCss: getCssFor('layout'),
            })
          : getCssFor(target);

      if (!cssBlock.trim()) {
        showFeedback('export.feedback.error', 'error');
        return;
      }

      const success = await copyToClipboard(cssBlock);
      showFeedback(
        success ? 'export.feedback.success' : 'export.feedback.error',
        success ? 'success' : 'error'
      );
    });
  });
}