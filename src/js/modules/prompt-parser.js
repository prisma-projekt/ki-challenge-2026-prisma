/**
 * PRISMA — Prompt Parser
 * Regelbasierte Prompt-Optimierung + optionaler KI-Vergleich
 * Topmodernes Webdesign: ITCSS/BEM, Mobile-First, ARIA, i18n, Design-Tokens
 */

import { t } from './i18n.js';

/* ============================================================
   Konfiguration
   ============================================================ */

/**
 * Groq API-Konfiguration (OpenAI-kompatibel).
 * Der API-Key wird NIE hier im Code hinterlegt.
 * Möglichkeiten:
 * 1. .env.local mit VITE_GROQ_API_KEY (vom Gruppenleiter bereitgestellt)
 * 2. API-Key-Eingabefeld im UI (für Demozwecke)
 * Im Produktivbetrieb sollte der Call über ein Backend-Proxy laufen.
 */
const GROQ_API_URL = '/api/groq/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_MAX_TOKENS = 500;

const AI_SYSTEM_PROMPT = `Du bist ein Prompt-Optimierer für ein Webprojekt mit ITCSS/BEM-Architektur (.challenge-* Klassen, Mobile-First, ARIA-Labels, data-i18n). Verbessere den folgenden Prompt und erkläre in maximal 2 Sätzen, warum er jetzt besser ist.`;

const API_KEY_STORAGE_KEY = 'prisma-groq-api-key';
const AI_CACHE_STORAGE_KEY = 'prisma-prompt-ai-cache';
const AI_CACHE_MAX_ENTRIES = 20;

/* ============================================================
   Prompt-Regeln
   ============================================================ */

/**
 * Regeln zur Prompt-Verbesserung — speziell auf PRISMA zugeschnitten
 * @type {Array<{pattern: RegExp, replacement: string|Function, explanation: string}>}
 */
export const PROMPT_RULES = [
  {
    pattern: /\b(gut(e|er|es|en|em)?|schön(e|er|es|en|em)?|modern(e|er|es|en|em)?|cool(e|er|es|en|em)?|hübsch(e|er|es|en|em)?|nice|good|great|awesome|top|best(e|er|es|en|em)?|optimal(e|er|es|en|em)?)\b/gi,
    replacement: 'professionell, barrierefrei und responsiv',
    explanation: 'Vage Qualitätsbegriffe werden durch messbare Kriterien für Top-Webdesign ersetzt.'
  },
  {
    pattern: /\b(mach|mache|baue|do|create|make)\s+(mir\s+)?(bitte\s+)?/gi,
    replacement: 'Entwickle ',
    explanation: 'Unpräzise Aufforderungen werden durch eine klare Entwicklungsanweisung ersetzt.'
  },
  {
    pattern: /\b(eine?\s+)?(Website|Webseite|Landingpage|Homepage|page|site)\b/gi,
    replacement: (match) => {
      if (/^eine?\s/i.test(match)) return match.replace(/Website|Webseite|Landingpage|Homepage|page|site/gi, 'semantische, responsive Website mit ARIA-Labels und Tastatursteuerung');
      return 'eine semantische, responsive Website mit ARIA-Labels und Tastatursteuerung';
    },
    explanation: 'Webprojekte brauchen explizite Barrierefreiheit und semantisches HTML5.'
  },
  {
    pattern: /\b(CSS|Styles|Styling|Klassen|classes)\b/gi,
    replacement: 'ITCSS/BEM-konformes CSS mit .challenge-* Klassen',
    explanation: 'Das PRISMA-Projekt verwendet eine einheitliche ITCSS/BEM-Architektur mit challenge-Prefix.'
  },
  {
    pattern: /\b(Farben|Farbpalette|Akzentfarbe|Farbschema|colors|color palette)\b/gi,
    replacement: 'Design-Tokens (CSS-Custom-Properties) für Farben, Abstände und Schatten',
    explanation: 'Farben und Abstände werden über wiederverwendbare CSS-Variablen aus tokens.css gesteuert.'
  },
  {
    pattern: /\b(mobil|handy|smartphone|Tablet|Desktop|mobile|tablet|desktop)\b/gi,
    replacement: 'Mobile-First Layouts für alle Bildschirmgrößen',
    explanation: 'Topmodernes Webdesign startet mit Mobile-First und skaliert über @media(min-width) nach oben.'
  },
  {
    pattern: /\b(dunkel|hell|Dark Mode|Light Mode|Theme|dark mode|light mode)\b/gi,
    replacement: 'Light/Dark Mode Unterstützung über CSS-Custom-Properties',
    explanation: 'Das Design muss sowohl hell als auch dunkel funktionieren.'
  },
  {
    pattern: /\b(Texte|Inhalte|Sprache|Labels|Übersetzung|text|content|language)\b/gi,
    replacement: 'mehrsprachige Inhalte über data-i18n Attribute (DE/EN)',
    explanation: 'Alle sichtbaren Texte werden über data-i18n für Deutsch und Englisch bereitgestellt.'
  },
  {
    pattern: /\b(Schrift|Schriftart|Typografie|Font|typography|font)\b/gi,
    replacement: 'typografische Hierarchie mit Inter/Poppins und system-ui Fallback',
    explanation: 'Klare Typografie-Skala und lesbare Schriftarten sichern die Lesbarkeit.'
  },
  {
    pattern: /\b(Animation|Transition|Bewegung|Effekt|animation|transition|effect)s?\b/gi,
    replacement: 'Animationen mit prefers-reduced-motion Ausweichlösung',
    explanation: 'Animationen müssen Benutzer mit Bewegungsempfindlichkeit respektieren.'
  },
  {
    pattern: /\b(schnell(e|er|es|en|em)?|Performance|Ladezeit|Core Web Vitals|performance|fast)\b/gi,
    replacement: 'performance-optimiert (Core Web Vitals, lazy loading, minimale Bundle-Größe)',
    explanation: 'Topmoderne Webseiten müssen schnell laden und gute Core Web Vitals erreichen.'
  },
  {
    pattern: /\b(Button|Buttons|Link|Links|Formular|Navigation|button|link|form|navigation)\b/gi,
    replacement: (match) => {
      const lower = match.toLowerCase();
      if (lower === 'button' || lower === 'buttons') return 'barrierefreien Button mit Fokus-, Hover-States und aria-label';
      if (lower === 'link' || lower === 'links') return 'barrierefreien Link mit Fokus-, Hover-States und aria-label';
      if (lower === 'formular') return 'barrierefreies Formular mit Fokus-, Hover-States und aria-label';
      if (lower === 'navigation') return 'barrierefreie Navigation mit Fokus-, Hover-States und aria-label';
      return match;
    },
    explanation: 'Interaktive Elemente brauchen Barrierefreiheit, sichtbare Fokus- und Hover-Zustände sowie ARIA-Labels.'
  }
];

/**
 * Vordefinierte Prompt-Vorlagen für typische PRISMA-Anwendungsfälle
 * @type {Array<{label: string, prompt: string}>}
 */
export const PROMPT_TEMPLATES = [
  {
    label: 'Komponente erstellen',
    prompt: 'Erstelle eine Hero-Komponente mit BEM-Klassen, semantischem HTML, ARIA-Labels und Dark Mode Unterstützung.'
  },
  {
    label: 'Responsives Grid',
    prompt: 'Erstelle ein responsives Grid-Layout für eine Galerie mit 3 Spalten auf Desktop, 2 auf Tablet und 1 auf Mobile.'
  },
  {
    label: 'Button mit States',
    prompt: 'Erstelle einen primären Button mit Hover-, Focus- und Active-States, ARIA-Label und data-i18n Unterstützung.'
  },
  {
    label: 'Navigation',
    prompt: 'Erstelle eine responsive Navigation mit Mobile-Menü, Tastatursteuerung und ARIA-Attributen.'
  },
  {
    label: 'Farb-System',
    prompt: 'Erstelle ein Farb-System mit CSS-Custom-Properties für Primary, Accent, Success, Error und Dark Mode Variablen.'
  },
  {
    label: 'Kontaktformular',
    prompt: 'Erstelle ein barrierefreies Kontaktformular mit Labels, Fehlermeldungen, Fokus-States und data-i18n.'
  },
  {
    label: 'Card mit Animation',
    prompt: 'Erstelle eine Card-Komponente mit Hover-Animation, prefers-reduced-motion Fallback und responsivem Layout.'
  },
  {
    label: 'Hero Section',
    prompt: 'Erstelle eine Hero-Section mit großer Typografie, Call-to-Action-Button, Hintergrundbild und Mobile-First Layout.'
  }
];

/* ============================================================
   Kernfunktionen: Optimierung & Kontext
   ============================================================ */

/**
 * Verbessert einen Prompt basierend auf den PRISMA-Regeln
 * @param {string} input - Der ursprüngliche Prompt
 * @returns {{original: string, improved: string, changes: Array<{before: string, after: string, why: string}>}}
 */
export function optimizePrompt(input) {
  if (!input || typeof input !== 'string') {
    return { original: input || '', improved: '', changes: [] };
  }

  let improved = input;
  const changes = [];

  PROMPT_RULES.forEach((rule) => {
    const match = improved.match(rule.pattern);
    if (!match) return;

    const before = improved;
    improved = improved.replace(rule.pattern, rule.replacement);

    if (before !== improved) {
      const afterExample = typeof rule.replacement === 'function'
        ? rule.replacement(match[0])
        : rule.replacement;

      changes.push({
        before: match[0],
        after: afterExample,
        why: rule.explanation
      });
    }
  });

  return {
    original: input,
    improved,
    changes
  };
}

/**
 * Fügt dem verbesserten Prompt den PRISMA-Projektkontext voran
 * @param {string} prompt - Der verbesserte Prompt
 * @returns {string} Prompt mit PRISMA-Kontext
 */
export function addContextHeader(prompt) {
  return `Ich arbeite an einem Webprojekt mit ITCSS/BEM-Architektur.
Nutze .challenge-* Klassen, semantisches HTML, Mobile-First, ARIA-Labels und data-i18n für DE/EN.

Aufgabe: ${prompt}`;
}

/* ============================================================
   KI-Vergleich (Bonus)
   ============================================================ */

/**
 * Liest den Groq API-Key aus Umgebungsvariable oder localStorage.
 * Hinweis: Im Produktivbetrieb sollte der Key niemals im Frontend landen.
 * @returns {string}
 */
export function getApiKey() {
  // 1. Umgebungsvariable (z. B. aus .env.local vom Gruppenleiter)
  const envKey = typeof import.meta.env !== 'undefined'
    ? import.meta.env.VITE_GROQ_API_KEY
    : '';

  // 2. Eingabe im Browser (Demo-Modus)
  const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);

  return envKey || storedKey || '';
}

/**
 * Speichert den API-Key im Browser (nur für Demozwecke).
 * @param {string} key
 */
export function setApiKey(key) {
  if (key && typeof key === 'string') {
    localStorage.setItem(API_KEY_STORAGE_KEY, key.trim());
  } else {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  }
}

/**
 * Erzeugt einen deterministischen Cache-Schlüssel für einen Prompt.
 * @param {string} prompt
 * @returns {string}
 */
function getCacheKey(prompt) {
  // Einfacher Hash auf Basis von charCode — ausreichend für den Schul-Demo-Zweck.
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return `cache_${hash}`;
}

/**
 * Liest einen gecachten KI-Vergleich aus dem localStorage.
 * @param {string} prompt
 * @returns {{improved: string, explanation: string}|null}
 */
function getCachedAIResult(prompt) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_STORAGE_KEY) || '{}');
    const entry = cache[getCacheKey(prompt)];
    if (entry && entry.prompt === prompt) {
      return entry.result;
    }
  } catch (err) {
    console.warn('[PromptParser] Cache lesen fehlgeschlagen:', err);
  }
  return null;
}

/**
 * Speichert einen KI-Vergleich im localStorage (begrenzte Größe).
 * @param {string} prompt
 * @param {{improved: string, explanation: string}} result
 */
function setCachedAIResult(prompt, result) {
  try {
    const cache = JSON.parse(localStorage.getItem(AI_CACHE_STORAGE_KEY) || '{}');
    const key = getCacheKey(prompt);

    const keys = Object.keys(cache);
    if (keys.length >= AI_CACHE_MAX_ENTRIES && !cache[key]) {
      delete cache[keys[0]];
    }

    cache[key] = { prompt, result, timestamp: Date.now() };
    localStorage.setItem(AI_CACHE_STORAGE_KEY, JSON.stringify(cache));
  } catch (err) {
    console.warn('[PromptParser] Cache speichern fehlgeschlagen:', err);
  }
}

/**
 * Sendet den Original-Prompt an die Groq API.
 * @param {string} originalPrompt
 * @param {string} apiKey
 * @returns {Promise<{improved: string, explanation: string}>}
 */
async function callGroqAPI(originalPrompt, apiKey) {
  const response = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      max_tokens: GROQ_MAX_TOKENS,
      messages: [
        { role: 'system', content: AI_SYSTEM_PROMPT },
        { role: 'user', content: originalPrompt }
      ]
    })
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const message = errorData.error?.message || `HTTP ${response.status}`;
    throw new Error(message);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';

  // Versuche, verbesserten Prompt und Erklärung zu trennen.
  // Die Antwort sollte aus Prompt + 2-Satz-Erklärung bestehen.
  const parts = content.split(/\n\n/);
  let improved = '';
  let explanation = '';

  if (parts.length >= 2) {
    improved = parts.slice(0, -1).join('\n\n').trim();
    explanation = parts[parts.length - 1].trim();
  } else {
    improved = content.trim();
    explanation = '';
  }

  return { improved, explanation };
}

/**
 * Vergleicht den Original-Prompt mit einer echten KI.
 * Nutzt Cache, falls vorhanden.
 * @param {string} originalPrompt
 * @returns {Promise<{ok: boolean, improved?: string, explanation?: string, error?: string, cached?: boolean}>}
 */
export async function compareWithAI(originalPrompt) {
  const apiKey = getApiKey();

  if (!apiKey) {
    return {
      ok: false,
      error: t('promptParser.aiMissingKey')
    };
  }

  const cached = getCachedAIResult(originalPrompt);
  if (cached) {
    return { ok: true, ...cached, cached: true };
  }

  try {
    const result = await callGroqAPI(originalPrompt, apiKey);
    setCachedAIResult(originalPrompt, result);
    return { ok: true, ...result, cached: false };
  } catch (err) {
    console.error('[PromptParser] KI-Vergleich fehlgeschlagen:', err);
    return {
      ok: false,
      error: t('promptParser.aiError')
    };
  }
}

/* ============================================================
   Rendering
   ============================================================ */

/**
 * Kopiert Text in die Zwischenablage
 * @param {string} text
 * @returns {Promise<boolean>}
 */
async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();

    const success = document.execCommand('copy');
    document.body.removeChild(textarea);
    return success;
  } catch (err) {
    console.error('[PromptParser] Kopieren fehlgeschlagen:', err);
    return false;
  }
}

/**
 * Erstellt einen Copy-Button
 * @param {string} text
 * @returns {HTMLButtonElement}
 */
function createCopyButton(text) {
  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'challenge-prompt-result__copy-btn';
  copyBtn.setAttribute('aria-label', t('promptParser.copyBtn'));
  copyBtn.dataset.i18n = 'promptParser.copyBtn';
  copyBtn.textContent = t('promptParser.copyBtn');

  copyBtn.addEventListener('click', async () => {
    const success = await copyToClipboard(text);
    if (success) {
      const originalText = copyBtn.textContent;
      copyBtn.textContent = t('promptParser.copiedFeedback');
      copyBtn.classList.add('is-copied');
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove('is-copied');
      }, 2000);
    }
  });

  return copyBtn;
}

/**
 * Rendert das Optimierungsergebnis in den Container.
 * Optional mit KI-Vergleich und Compare-Button.
 * @param {Object} result - Ergebnis von optimizePrompt()
 * @param {string|HTMLElement} container - Selector oder Element
 * @param {Object} options
 * @param {boolean} options.showCompare - Compare-Button anzeigen?
 * @param {Function} options.onCompare - Callback beim Compare-Button
 * @param {{improved: string, explanation: string}|null} options.aiResult - KI-Ergebnis für Zwei-Spalten-Layout
 */
export function renderResult(result, container = '#prompt-result', options = {}) {
  const target = typeof container === 'string'
    ? document.querySelector(container)
    : container;

  if (!target) {
    console.warn('[PromptParser] Ergebnis-Container nicht gefunden:', container);
    return;
  }

  target.innerHTML = '';

  if (!result || !result.improved) {
    target.innerHTML = `<p class="challenge-prompt-result__empty">${escapeHtml(t('promptParser.errorEmpty'))}</p>`;
    return;
  }

  if (options.aiResult) {
    renderComparison(result, options.aiResult, target);
    return;
  }

  const finalPrompt = addContextHeader(result.improved);

  const wrapper = document.createElement('div');
  wrapper.className = 'challenge-prompt-result__content';

  // Original-Prompt (ausgegraut)
  const originalSection = document.createElement('div');
  originalSection.className = 'challenge-prompt-result__section challenge-prompt-result__section--original';
  originalSection.innerHTML = `
    <h4 class="challenge-prompt-result__heading" data-i18n="promptParser.originalLabel">${escapeHtml(t('promptParser.originalLabel'))}</h4>
    <p class="challenge-prompt-result__text challenge-prompt-result__text--muted">${escapeHtml(result.original)}</p>
  `;

  // Verbesserter Prompt (hervorgehoben)
  const improvedSection = document.createElement('div');
  improvedSection.className = 'challenge-prompt-result__section challenge-prompt-result__section--improved';
  improvedSection.innerHTML = `
    <h4 class="challenge-prompt-result__heading" data-i18n="promptParser.improvedLabel">${escapeHtml(t('promptParser.improvedLabel'))}</h4>
    <p class="challenge-prompt-result__text challenge-prompt-result__text--improved">${escapeHtml(result.improved)}</p>
  `;

  // Änderungsliste
  const changesSection = document.createElement('div');
  changesSection.className = 'challenge-prompt-result__section challenge-prompt-result__section--changes';

  if (result.changes && result.changes.length > 0) {
    const changesList = result.changes.map((change) => `
      <li class="challenge-prompt-result__change">
        <span class="challenge-prompt-result__change-before">${escapeHtml(change.before)}</span>
        <span class="challenge-prompt-result__change-arrow" aria-hidden="true">→</span>
        <span class="challenge-prompt-result__change-after">${escapeHtml(change.after)}</span>
        <span class="challenge-prompt-result__change-why">${escapeHtml(change.why)}</span>
      </li>
    `).join('');

    changesSection.innerHTML = `
      <h4 class="challenge-prompt-result__heading" data-i18n="promptParser.changesLabel">${escapeHtml(t('promptParser.changesLabel'))}</h4>
      <ul class="challenge-prompt-result__changes">${changesList}</ul>
    `;
  }

  // Actions: Copy + optional Compare
  const actions = document.createElement('div');
  actions.className = 'challenge-prompt-result__actions';

  actions.appendChild(createCopyButton(finalPrompt));

  if (options.showCompare && typeof options.onCompare === 'function') {
    const compareBtn = document.createElement('button');
    compareBtn.type = 'button';
    compareBtn.className = 'challenge-prompt-result__compare-btn';
    compareBtn.setAttribute('aria-label', t('promptParser.compareBtn'));
    compareBtn.dataset.i18n = 'promptParser.compareBtn';
    compareBtn.textContent = t('promptParser.compareBtn');
    compareBtn.addEventListener('click', options.onCompare);
    actions.appendChild(compareBtn);
  }

  wrapper.appendChild(originalSection);
  wrapper.appendChild(improvedSection);
  wrapper.appendChild(changesSection);
  wrapper.appendChild(actions);
  target.appendChild(wrapper);
}

/**
 * Rendert das Zwei-Spalten-Layout: Regelbasiert vs. KI
 * @param {Object} ruleResult
 * @param {{improved: string, explanation: string}} aiResult
 * @param {HTMLElement} target
 */
function renderComparison(ruleResult, aiResult, target) {
  const rulePrompt = addContextHeader(ruleResult.improved);
  const aiPrompt = addContextHeader(aiResult.improved);

  const wrapper = document.createElement('div');
  wrapper.className = 'challenge-prompt-result__content challenge-prompt-result__content--comparison';

  // Linke Spalte: Regelbasiert
  const ruleColumn = document.createElement('div');
  ruleColumn.className = 'challenge-prompt-result__column challenge-prompt-result__column--rules';
  ruleColumn.innerHTML = `
    <h4 class="challenge-prompt-result__column-title" data-i18n="promptParser.rulesColumnTitle">${escapeHtml(t('promptParser.rulesColumnTitle'))}</h4>
    <div class="challenge-prompt-result__section challenge-prompt-result__section--original">
      <h5 class="challenge-prompt-result__heading" data-i18n="promptParser.originalLabel">${escapeHtml(t('promptParser.originalLabel'))}</h5>
      <p class="challenge-prompt-result__text challenge-prompt-result__text--muted">${escapeHtml(ruleResult.original)}</p>
    </div>
    <div class="challenge-prompt-result__section challenge-prompt-result__section--improved">
      <h5 class="challenge-prompt-result__heading" data-i18n="promptParser.improvedLabel">${escapeHtml(t('promptParser.improvedLabel'))}</h5>
      <p class="challenge-prompt-result__text challenge-prompt-result__text--improved">${escapeHtml(ruleResult.improved)}</p>
    </div>
  `;

  // Rechte Spalte: KI
  const aiColumn = document.createElement('div');
  aiColumn.className = 'challenge-prompt-result__column challenge-prompt-result__column--ai';
  aiColumn.innerHTML = `
    <h4 class="challenge-prompt-result__column-title" data-i18n="promptParser.aiColumnTitle">${escapeHtml(t('promptParser.aiColumnTitle'))}</h4>
    <div class="challenge-prompt-result__section challenge-prompt-result__section--improved">
      <h5 class="challenge-prompt-result__heading" data-i18n="promptParser.improvedLabel">${escapeHtml(t('promptParser.improvedLabel'))}</h5>
      <p class="challenge-prompt-result__text challenge-prompt-result__text--improved">${escapeHtml(aiResult.improved)}</p>
    </div>
  `;

  if (aiResult.explanation) {
    const explanationSection = document.createElement('div');
    explanationSection.className = 'challenge-prompt-result__section';
    explanationSection.innerHTML = `
      <h5 class="challenge-prompt-result__heading" data-i18n="promptParser.aiExplanationTitle">${escapeHtml(t('promptParser.aiExplanationTitle'))}</h5>
      <p class="challenge-prompt-result__text">${escapeHtml(aiResult.explanation)}</p>
    `;
    aiColumn.appendChild(explanationSection);
  }

  if (aiResult.cached) {
    const cachedBadge = document.createElement('span');
    cachedBadge.className = 'challenge-prompt-result__cached-badge';
    cachedBadge.dataset.i18n = 'promptParser.cachedBadge';
    cachedBadge.textContent = t('promptParser.cachedBadge');
    aiColumn.appendChild(cachedBadge);
  }

  // Actions für beide Spalten
  const ruleActions = document.createElement('div');
  ruleActions.className = 'challenge-prompt-result__actions';
  ruleActions.appendChild(createCopyButton(rulePrompt));

  const aiActions = document.createElement('div');
  aiActions.className = 'challenge-prompt-result__actions';
  aiActions.appendChild(createCopyButton(aiPrompt));

  ruleColumn.appendChild(ruleActions);
  aiColumn.appendChild(aiActions);

  wrapper.appendChild(ruleColumn);
  wrapper.appendChild(aiColumn);
  target.appendChild(wrapper);
}

/* ============================================================
   UI-Initialisierung
   ============================================================ */

/**
 * Initialisiert die Prompt-Vorlagen als Buttons
 * @param {Object} options
 * @param {string|HTMLElement} options.container - Container für die Vorlagen-Buttons
 * @param {string|HTMLElement} options.input - Ziel-Eingabefeld
 */
export function initPromptTemplates(options = {}) {
  const container = typeof options.container === 'string'
    ? document.querySelector(options.container)
    : options.container;

  const input = typeof options.input === 'string'
    ? document.querySelector(options.input)
    : options.input;

  if (!container || !input) {
    console.warn('[PromptParser] Vorlagen-Container oder Eingabefeld nicht gefunden.');
    return;
  }

  container.innerHTML = '';

  PROMPT_TEMPLATES.forEach((template) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'challenge-prompt-input__template-btn';
    btn.textContent = template.label;
    btn.setAttribute('aria-label', `${t('promptParser.templatesLabel')}: ${template.label}`);

    btn.addEventListener('click', () => {
      input.value = template.prompt;
      input.focus();
    });

    container.appendChild(btn);
  });
}

/**
 * Initialisiert das API-Key-Eingabefeld (optional).
 * @param {Object} options
 * @param {string|HTMLElement} options.input
 */
export function initApiKeyInput(options = {}) {
  const input = typeof options.input === 'string'
    ? document.querySelector(options.input)
    : options.input;

  if (!input) return;

  // Bestehenden Key eintragen (maskiert durch type="password")
  const existingKey = getApiKey();
  if (existingKey) {
    input.value = existingKey;
  }

  input.addEventListener('change', () => {
    setApiKey(input.value);
  });

  input.addEventListener('blur', () => {
    setApiKey(input.value);
  });
}

/**
 * Initialisiert den gesamten Prompt Parser
 * @param {Object} options
 * @param {string|HTMLElement} options.input
 * @param {string|HTMLElement} options.optimizeBtn
 * @param {string|HTMLElement} options.resultContainer
 * @param {string|HTMLElement} options.templatesContainer
 * @param {string|HTMLElement} options.apiKeyInput - Optional
 * @param {boolean} options.enableAICompare - KI-Vergleich aktivieren?
 */
export function initPromptParser(options = {}) {
  const input = typeof options.input === 'string'
    ? document.querySelector(options.input)
    : options.input;

  const optimizeBtn = typeof options.optimizeBtn === 'string'
    ? document.querySelector(options.optimizeBtn)
    : options.optimizeBtn;

  const resultContainer = typeof options.resultContainer === 'string'
    ? document.querySelector(options.resultContainer)
    : options.resultContainer;

  const templatesContainer = typeof options.templatesContainer === 'string'
    ? document.querySelector(options.templatesContainer)
    : options.templatesContainer;

  if (!input || !optimizeBtn || !resultContainer) {
    console.warn('[PromptParser] Benötigte Elemente nicht gefunden. Initialisierung übersprungen.');
    return;
  }

  initPromptTemplates({ container: templatesContainer, input });
  initApiKeyInput({ input: options.apiKeyInput });

  let lastRuleResult = null;

  const handleOptimize = () => {
    const value = input.value.trim();
    if (!value) {
      renderResult(null, resultContainer);
      lastRuleResult = null;
      return;
    }

    lastRuleResult = optimizePrompt(value);
    renderResult(lastRuleResult, resultContainer, {
      showCompare: options.enableAICompare,
      onCompare: () => handleCompare(value)
    });
  };

  const handleCompare = async (originalPrompt) => {
    if (!lastRuleResult) return;

    // Ladezustand anzeigen
    renderResult(lastRuleResult, resultContainer, {
      showCompare: false
    });

    const aiResult = await compareWithAI(originalPrompt);

    if (aiResult.ok) {
      renderResult(lastRuleResult, resultContainer, {
        aiResult
      });
    } else {
      // Fehler: Regel-Engine bleibt nutzbar, freundliche Meldung anzeigen
      renderResult(lastRuleResult, resultContainer, {
        showCompare: true,
        onCompare: () => handleCompare(originalPrompt)
      });

      const errorBox = document.createElement('div');
      errorBox.className = 'challenge-prompt-result__ai-error';
      errorBox.setAttribute('role', 'alert');
      errorBox.textContent = aiResult.error || t('promptParser.aiError');

      const content = resultContainer.querySelector('.challenge-prompt-result__content');
      if (content) {
        content.appendChild(errorBox);
      } else {
        resultContainer.appendChild(errorBox);
      }
    }
  };

  optimizeBtn.addEventListener('click', handleOptimize);

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      handleOptimize();
    }
  });
}

/**
 * Hilfsfunktion: HTML-Entitäten escapen
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  if (typeof text !== 'string') return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
