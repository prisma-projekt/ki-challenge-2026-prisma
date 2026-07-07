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
 *    export.feedback.success / .error / .linkCopied / .downloaded.
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
 *    Dieselben Quellen speisen auch den JSON-Download (BONUS 1) und den
 *    teilbaren Link (BONUS 2), da beide auf denselben CSS-Variablen
 *    basieren.
 *
 * 3. Buttons initialisieren:
 *
 *      import {
 *        initExportButtons,
 *        initDownloadButtons,
 *        initShareButton,
 *      } from './modules/export-system.js';
 *
 *      initExportButtons();
 *      initDownloadButtons();
 *      initShareButton();
 *
 * 4. Erwartetes HTML (Beispiel):
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
 *        data-export-format="css"
 *        aria-label="Gesamtes CSS als Datei herunterladen">
 *        CSS herunterladen
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
  'export.feedback.downloaded': 'Datei heruntergeladen!',
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

function warnIfMissingAriaLabel(element, context) {
  if (!element.hasAttribute('aria-label')) {
    console.warn(`[Export System] ${context}: Element ohne aria-label gefunden.`, element);
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

/* ==========================================================================
   BONUS 1 — Datei-Download (CSS & JSON)
   ========================================================================== */

export const DOWNLOAD_FORMATS = ['css', 'json'];

/**
 * Extrahiert CSS-Custom-Properties aus einem CSS-Text in ein flaches Objekt.
 * Erwartet Deklarationen der Form "--name: wert;" (umgebender Selektor bzw.
 * Verschachtelung egal). Der führende "--" wird für die JSON-Ausgabe entfernt.
 * @param {string} cssText
 * @returns {Object<string, string>}
 */
function parseCssVariables(cssText) {
  const variables = {};
  if (!cssText) return variables;

  const declarationPattern = /--([a-zA-Z0-9-]+)\s*:\s*([^;{}]+)/g;
  let match;
  while ((match = declarationPattern.exec(cssText)) !== null) {
    const [, name, rawValue] = match;
    variables[name] = rawValue.trim();
  }
  return variables;
}

/**
 * Baut das Design-Tokens-Objekt aus den registrierten CSS-Quellen
 * (siehe registerCssSource). Wird sowohl vom JSON-Download (BONUS 1)
 * als auch vom teilbaren Link (BONUS 2) verwendet, da beide denselben
 * aktuellen Design-Zustand abbilden.
 * @returns {{colors: Object, typography: Object, layout: Object}}
 */
function buildDesignTokens() {
  return {
    colors: parseCssVariables(getCssFor('colors')),
    typography: parseCssVariables(getCssFor('typography')),
    layout: parseCssVariables(getCssFor('layout')),
  };
}

/**
 * Erstellt eine Datei aus beliebigem Textinhalt und stößt den Download an.
 * Erzeugt einen Blob + Object-URL, hängt kurz ein unsichtbares <a>-Element
 * an, klickt es programmatisch, entfernt es wieder und gibt die Object-URL
 * anschließend frei. Funktioniert für beliebige Text-MIME-Types (u. a. CSS
 * und JSON).
 * @param {string} content - Dateiinhalt (z. B. CSS-Text oder JSON-String)
 * @param {string} filename - Ziel-Dateiname inkl. Endung
 * @param {string} mimeType - MIME-Type, z. B. "text/css" oder "application/json"
 */
export function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const objectUrl = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = objectUrl;
  link.download = filename;
  link.rel = 'noopener';
  link.style.display = 'none';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(objectUrl);
}

/**
 * Initialisiert alle Download-Buttons
 * (.challenge-export-panel__download-btn[data-export-format]).
 * format="css"  → kombiniertes CSS aller Engines (wie combineCss/"all")
 * format="json" → Design-Tokens-Objekt {colors, typography, layout}
 */
export function initDownloadButtons() {
  const buttons = document.querySelectorAll(
    '.challenge-export-panel__download-btn[data-export-format]'
  );

  buttons.forEach((button) => {
    warnIfMissingAriaLabel(button, 'initDownloadButtons');

    button.addEventListener('click', () => {
      const format = button.dataset.exportFormat;

      if (format === 'css') {
        const cssBlock = combineCss({
          colorCss: getCssFor('colors'),
          typeCss: getCssFor('typography'),
          layoutCss: getCssFor('layout'),
        });

        if (!cssBlock.trim()) {
          showFeedback('export.feedback.error', 'error');
          return;
        }

        downloadFile(cssBlock, 'prisma-design-system.css', 'text/css');
        showFeedback('export.feedback.downloaded', 'success');
        return;
      }

      if (format === 'json') {
        const tokens = buildDesignTokens();
        const hasTokens = Object.values(tokens).some(
          (group) => Object.keys(group).length > 0
        );

        if (!hasTokens) {
          showFeedback('export.feedback.error', 'error');
          return;
        }

        downloadFile(
          JSON.stringify(tokens, null, 2),
          'prisma-design-tokens.json',
          'application/json'
        );
        showFeedback('export.feedback.downloaded', 'success');
        return;
      }

      console.warn(`[Export System] initDownloadButtons: unbekanntes Format "${format}".`);
      showFeedback('export.feedback.error', 'error');
    });
  });
}

/* ==========================================================================
   BONUS 2 — Teilbarer Link
   ========================================================================== */

const SHARE_HASH_PARAM = 'design';

/**
 * Kodiert einen beliebigen Zustand als URL-sicherer Base64-String
 * (Base64url, ohne Padding) — kompatibel mit UTF-8-Inhalten (Umlaute etc.).
 * @param {Object} state
 * @returns {string}
 */
function encodeStateToBase64(state) {
  const json = JSON.stringify(state);
  const utf8Bytes = new TextEncoder().encode(json);

  let binary = '';
  utf8Bytes.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });

  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

/**
 * Kehrt encodeStateToBase64 um.
 * @param {string} encoded
 * @returns {Object}
 */
function decodeBase64ToState(encoded) {
  const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64 + '='.repeat((4 - (base64.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  const json = new TextDecoder().decode(bytes);

  return JSON.parse(json);
}

/**
 * Kodiert den übergebenen Zustand kompakt als Base64 im URL-Hash
 * (#design=...) und gibt die vollständige, teilbare URL zurück.
 * Schlägt die Kodierung fehl (z. B. nicht serialisierbarer Zustand),
 * wird die aktuelle URL ohne Hash zurückgegeben statt eine Exception
 * zu werfen.
 * @param {Object} state - Beliebiger, JSON-serialisierbarer Zustand
 * @returns {string} Vollständige, teilbare URL
 */
export function buildShareableLink(state) {
  const url = new URL(window.location.href);

  try {
    const encoded = encodeStateToBase64(state);
    url.hash = `${SHARE_HASH_PARAM}=${encoded}`;
  } catch (error) {
    console.error('[Export System] buildShareableLink: Zustand konnte nicht kodiert werden:', error);
  }

  return url.toString();
}

/**
 * Liest beim Laden der Seite #design=... aus dem URL-Hash und gibt das
 * dekodierte Zustandsobjekt zurück (oder null, wenn kein/kein gültiger
 * Hash vorhanden ist). Das Anwenden des Zustands auf die Engines übernimmt
 * der Gruppenleiter im App-Bootstrap.
 * @returns {Object|null}
 */
export function parseShareableLink() {
  const hash = window.location.hash;
  if (!hash || !hash.includes(`${SHARE_HASH_PARAM}=`)) {
    return null;
  }

  const params = new URLSearchParams(hash.slice(1));
  const encoded = params.get(SHARE_HASH_PARAM);
  if (!encoded) return null;

  try {
    return decodeBase64ToState(encoded);
  } catch (error) {
    console.error('[Export System] parseShareableLink: Dekodierung fehlgeschlagen:', error);
    return null;
  }
}

/**
 * Initialisiert den Share-Button (.challenge-export-panel__share-btn).
 * Erzeugt bei Klick einen teilbaren Link aus dem aktuellen Design-Zustand
 * (siehe buildDesignTokens), zeigt ihn in .challenge-export-panel__share-link
 * an (selbst per Klick/Tastatur kopierbar) und kopiert ihn zusätzlich
 * direkt in die Zwischenablage.
 *
 * Hinweis: Der geteilte Zustand basiert auf denselben CSS-Quellen wie der
 * JSON-Download (buildDesignTokens). Falls später mehr App-Zustand
 * (z. B. gesperrte Farben, gewählte Harmonie) mitgeteilt werden soll, kann
 * buildShareableLink(customState) auch direkt mit einem eigenen
 * Zustandsobjekt aufgerufen werden.
 */
export function initShareButton() {
  const button = document.querySelector('.challenge-export-panel__share-btn');
  if (!button) return;

  warnIfMissingAriaLabel(button, 'initShareButton');

  const linkOutput = document.querySelector('.challenge-export-panel__share-link');

  if (linkOutput) {
    // Macht das <output>-Element per Klick UND Tastatur bedienbar
    // (Klick-zum-Kopieren), ohne bestehende HTML-Attribute zu überschreiben.
    if (!linkOutput.hasAttribute('tabindex')) {
      linkOutput.setAttribute('tabindex', '0');
    }
    if (!linkOutput.hasAttribute('role')) {
      linkOutput.setAttribute('role', 'button');
    }
    warnIfMissingAriaLabel(linkOutput, 'initShareButton (share-link)');
  }

  const copyShareLink = async () => {
    const text = linkOutput?.textContent?.trim();
    if (!text) return;

    const success = await copyToClipboard(text);
    showFeedback(
      success ? 'export.feedback.linkCopied' : 'export.feedback.error',
      success ? 'success' : 'error'
    );
  };

  button.addEventListener('click', async () => {
    const state = buildDesignTokens();
    const shareUrl = buildShareableLink(state);

    if (linkOutput) {
      linkOutput.textContent = shareUrl;
      linkOutput.hidden = false;
    }

    const success = await copyToClipboard(shareUrl);
    showFeedback(
      success ? 'export.feedback.linkCopied' : 'export.feedback.error',
      success ? 'success' : 'error'
    );
  });

  if (!linkOutput) return;

  linkOutput.addEventListener('click', copyShareLink);
  linkOutput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      copyShareLink();
    }
  });
}