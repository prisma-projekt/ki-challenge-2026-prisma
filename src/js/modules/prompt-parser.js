/**
 * PRISMA — Prompt Parser
 * Verbessert vage Prompts über eine Regel-Engine (keine echte KI).
 *
 * Öffentliche API:
 *   optimizePrompt(input)               -> { original, improved, changes[] }
 *   renderResult(result, selector)
 *   initPromptTemplates(selector)
 *   PROMPT_TEMPLATES
 */

/**
 * Verbesserungsregeln. Jede Regel: schwaches Muster -> stärkere Formulierung + Begründung.
 * @type {Array<{pattern: RegExp, replacement: string, explanation: string}>}
 */
const PROMPT_RULES = [
  { pattern: /\b(mach(e)?|erstell mal|bau(e)?)\b/gi, replacement: 'Erstelle',
    explanation: 'Präzises, aktives Verb statt umgangssprachlicher Formulierung.' },
  { pattern: /\b(gut(e|es|er)?|nice|schön)\b/gi, replacement: 'professionell und responsiv',
    explanation: '„Gut/schön" ist subjektiv — konkrete Qualitätsmerkmale nennen.' },
  { pattern: /\b(modern|zeitgemäß)\b/gi, replacement: 'mit klarer Typografie, viel Weißraum und konsistenten Abständen',
    explanation: '„Modern" ist vage — den gemeinten Stil ausformulieren.' },
  { pattern: /\b(irgendwie|halt|einfach so)\b/gi, replacement: '',
    explanation: 'Füllwörter entfernt — sie tragen keine Information.' },
  { pattern: /\b(usw\.?|etc\.?|und so weiter)\b/gi, replacement: '',
    explanation: 'Offene Aufzählungen streichen und stattdessen konkrete Punkte nennen.' },
  { pattern: /\bschnell\b/gi, replacement: 'performant (kleine Bundle-Größe, Lazy-Loading)',
    explanation: '„Schnell" messbar machen: welche Performance-Kriterien zählen?' },
  { pattern: /\bwebsite\b/gi, replacement: 'responsive Website (Mobile-First)',
    explanation: 'Zielgerät und Ansatz ergänzt, damit das Ergebnis passt.' },
  { pattern: /\b(app|anwendung)\b/gi, replacement: 'Web-App mit klarer Komponentenstruktur',
    explanation: 'Architektur-Erwartung präzisiert.' },
  { pattern: /\bfarben?\b/gi, replacement: 'ein zugängliches Farbschema (WCAG-AA-Kontraste)',
    explanation: 'Barrierefreiheit als konkrete Anforderung ergänzt.' },
  { pattern: /\bbutton\b/gi, replacement: 'Button mit sichtbarem Fokus-State und aria-label',
    explanation: 'Interaktive Elemente brauchen Fokus und Beschriftung.' },
  { pattern: /\s{2,}/g, replacement: ' ',
    explanation: 'Doppelte Leerzeichen bereinigt.' },
];

/**
 * Wendet alle Regeln an und dokumentiert die Änderungen.
 * @param {string} input
 * @returns {{original: string, improved: string, changes: Array<{before: string, after: string, why: string}>}}
 */
export function optimizePrompt(input) {
  const original = (input || '').toString();
  let improved = original;
  const changes = [];

  PROMPT_RULES.forEach((rule) => {
    const matches = improved.match(rule.pattern);
    if (!matches) return;

    // Nur einmal pro Regel dokumentieren (erstes Vorkommen als Beispiel).
    changes.push({
      before: matches[0].trim(),
      after: rule.replacement.trim(),
      why: rule.explanation,
    });

    improved = improved.replace(rule.pattern, rule.replacement);
  });

  improved = addContextHeader(improved.trim());

  return { original, improved, changes };
}

/**
 * Stellt dem verbesserten Prompt den Projekt-Kontext voran.
 * @param {string} prompt
 * @returns {string}
 */
function addContextHeader(prompt) {
  const header =
    'Ich arbeite an einem Vite-Webprojekt mit ITCSS/BEM-Architektur. ' +
    'Nutze .challenge-*-Klassen, semantisches HTML, Mobile-First und ARIA-Labels. ';
  return header + prompt;
}

/* -------------------------
   Rendering
--------------------------*/

async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (error) {
      console.error('[PromptParser] Clipboard fehlgeschlagen:', error);
    }
  }
  return false;
}

/**
 * Rendert Original, verbesserten Prompt und die Änderungsliste.
 * @param {{original: string, improved: string, changes: Array}} result
 * @param {string} [containerSelector='#prompt-result']
 */
export function renderResult(result, containerSelector = '#prompt-result') {
  if (typeof document === 'undefined') return;
  const container = document.querySelector(containerSelector);
  if (!container) {
    console.error('[PromptParser] Container nicht gefunden:', containerSelector);
    return;
  }

  container.innerHTML = '';

  const before = document.createElement('div');
  before.className = 'challenge-prompt__block challenge-prompt__block--before';
  const beforeLabel = document.createElement('h3');
  beforeLabel.className = 'challenge-prompt__label';
  beforeLabel.setAttribute('data-i18n', 'promptParser.before');
  beforeLabel.textContent = 'Vorher';
  const beforeText = document.createElement('p');
  beforeText.className = 'challenge-prompt__original';
  beforeText.textContent = result.original || '—';
  before.append(beforeLabel, beforeText);

  const after = document.createElement('div');
  after.className = 'challenge-prompt__block challenge-prompt__block--after';
  const afterLabel = document.createElement('h3');
  afterLabel.className = 'challenge-prompt__label';
  afterLabel.setAttribute('data-i18n', 'promptParser.after');
  afterLabel.textContent = 'Nachher';
  const afterText = document.createElement('p');
  afterText.className = 'challenge-prompt__improved';
  afterText.textContent = result.improved || '—';

  const copyBtn = document.createElement('button');
  copyBtn.type = 'button';
  copyBtn.className = 'challenge-prompt__copy';
  copyBtn.setAttribute('aria-label', 'Verbesserten Prompt kopieren');
  copyBtn.setAttribute('data-i18n', 'promptParser.copy');
  copyBtn.textContent = 'Kopieren';
  copyBtn.addEventListener('click', async () => {
    const ok = await copyText(result.improved);
    copyBtn.textContent = ok ? 'Kopiert!' : 'Fehlgeschlagen';
    setTimeout(() => { copyBtn.textContent = 'Kopieren'; }, 2000);
  });
  after.append(afterLabel, afterText, copyBtn);

  const changes = document.createElement('ul');
  changes.className = 'challenge-prompt__changes';
  if (!result.changes || !result.changes.length) {
    const li = document.createElement('li');
    li.className = 'challenge-prompt__change';
    li.textContent = 'Keine Schwachstellen gefunden — der Prompt war schon konkret.';
    changes.appendChild(li);
  } else {
    result.changes.forEach((change) => {
      const li = document.createElement('li');
      li.className = 'challenge-prompt__change';
      const label = change.after
        ? `„${change.before}" → „${change.after}"`
        : `„${change.before}" entfernt`;
      li.innerHTML = '';
      const strong = document.createElement('strong');
      strong.textContent = label;
      const why = document.createElement('span');
      why.className = 'challenge-prompt__why';
      why.textContent = ` — ${change.why}`;
      li.append(strong, why);
      changes.appendChild(li);
    });
  }

  container.append(before, after, changes);
}

/* -------------------------
   Vorlagen
--------------------------*/

/** @type {Array<{label: string, prompt: string}>} */
export const PROMPT_TEMPLATES = [
  { label: 'Komponente erstellen', prompt: 'Erstelle eine [NAME]-Komponente mit BEM-Klassen und semantischem HTML.' },
  { label: 'Responsive Grid', prompt: 'Erstelle ein responsives Grid mit 3 Spalten ab 768px, Mobile-First.' },
  { label: 'Barrierefreies Formular', prompt: 'Erstelle ein Formular mit Labels, Fokus-States und aria-Beschreibungen.' },
  { label: 'Dark Mode', prompt: 'Ergänze einen Dark Mode über einen modes-Layer und data-mode="dark".' },
  { label: 'Ladeanimation', prompt: 'Erstelle eine dezente Ladeanimation, die prefers-reduced-motion respektiert.' },
  { label: 'CSS aufräumen', prompt: 'Räume dieses CSS nach ITCSS auf und ersetze Magic Numbers durch Tokens.' },
];

/**
 * Baut die Vorlagen-Buttons; Klick füllt das Eingabefeld.
 * @param {string} [containerSelector='.challenge-prompt__templates']
 * @param {string} [inputSelector='.challenge-prompt__input']
 */
export function initPromptTemplates(
  containerSelector = '.challenge-prompt__templates',
  inputSelector = '.challenge-prompt__input',
) {
  if (typeof document === 'undefined') return;
  const container = document.querySelector(containerSelector);
  const input = document.querySelector(inputSelector);
  if (!container) return;

  container.innerHTML = '';
  PROMPT_TEMPLATES.forEach((template) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'challenge-prompt__template';
    btn.textContent = template.label;
    btn.setAttribute('aria-label', `Vorlage einfügen: ${template.label}`);
    btn.addEventListener('click', () => {
      if (input) {
        input.value = template.prompt;
        input.focus();
      }
    });
    container.appendChild(btn);
  });
}
