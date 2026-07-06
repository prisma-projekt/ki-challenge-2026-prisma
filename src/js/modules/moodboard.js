/**
 * PRISMA — Moodboard
 * Drag & Drop Inspirations-Board mit localStorage-Persistenz.
 *
 * Öffentliche API:
 *   initMoodboard(selector)   -> baut das Board auf
 *   addItem({ type, content }) -> fügt Item hinzu
 *   removeItem(itemId)         -> entfernt Item
 *
 * Item-Typen: 'color' (#hex), 'text' (String), 'image' (URL)
 */

const STORAGE_KEY = 'prisma-moodboard';

/** @type {Array<{id: string, type: string, content: string}>} */
const DEFAULT_ITEMS = [
  { id: 'seed-1', type: 'color', content: '#4F46E5' },
  { id: 'seed-2', type: 'color', content: '#06B6D4' },
  { id: 'seed-3', type: 'text', content: 'Minimal & Clean' },
  { id: 'seed-4', type: 'color', content: '#F9FAFB' },
  { id: 'seed-5', type: 'text', content: 'Viel Weißraum' },
  { id: 'seed-6', type: 'color', content: '#1F2937' },
];

let items = [];
let boardSelector = '#moodboard-grid';
let draggedId = null;

/* -------------------------
   Persistenz
--------------------------*/

function loadOrder() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...DEFAULT_ITEMS];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : [...DEFAULT_ITEMS];
  } catch (error) {
    console.error('[Moodboard] localStorage konnte nicht gelesen werden:', error);
    return [...DEFAULT_ITEMS];
  }
}

function saveOrder(currentItems) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentItems));
  } catch (error) {
    console.error('[Moodboard] localStorage konnte nicht geschrieben werden:', error);
  }
}

function generateId() {
  return `item-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

/* -------------------------
   Rendering
--------------------------*/

function buildItemBody(item) {
  if (item.type === 'color') {
    const swatch = document.createElement('div');
    swatch.className = 'challenge-moodboard__color';
    swatch.style.backgroundColor = item.content;
    const code = document.createElement('span');
    code.className = 'challenge-moodboard__color-code';
    code.textContent = item.content;
    swatch.appendChild(code);
    return swatch;
  }

  if (item.type === 'image') {
    const img = document.createElement('img');
    img.className = 'challenge-moodboard__image';
    img.src = item.content;
    img.alt = 'Moodboard-Bild';
    img.loading = 'lazy';
    return img;
  }

  const text = document.createElement('p');
  text.className = 'challenge-moodboard__text';
  text.textContent = item.content;
  return text;
}

function createItemElement(item) {
  const el = document.createElement('figure');
  el.className = 'challenge-moodboard__item';
  el.draggable = true;
  el.dataset.itemId = item.id;
  el.setAttribute('aria-label', `Moodboard-Element (${item.type})`);

  el.appendChild(buildItemBody(item));

  // Steuerung: hoch / runter (Tastatur-Barrierefreiheit) + löschen
  const controls = document.createElement('div');
  controls.className = 'challenge-moodboard__controls';

  const upBtn = document.createElement('button');
  upBtn.type = 'button';
  upBtn.className = 'challenge-moodboard__control';
  upBtn.setAttribute('aria-label', 'Element nach vorne verschieben');
  upBtn.textContent = '←';
  upBtn.addEventListener('click', () => moveItem(item.id, -1));

  const downBtn = document.createElement('button');
  downBtn.type = 'button';
  downBtn.className = 'challenge-moodboard__control';
  downBtn.setAttribute('aria-label', 'Element nach hinten verschieben');
  downBtn.textContent = '→';
  downBtn.addEventListener('click', () => moveItem(item.id, 1));

  const removeBtn = document.createElement('button');
  removeBtn.type = 'button';
  removeBtn.className = 'challenge-moodboard__control challenge-moodboard__control--remove';
  removeBtn.setAttribute('aria-label', 'Element entfernen');
  removeBtn.textContent = '✕';
  removeBtn.addEventListener('click', () => removeItem(item.id));

  controls.append(upBtn, downBtn, removeBtn);
  el.appendChild(controls);

  attachDragHandlers(el);
  return el;
}

function render() {
  if (typeof document === 'undefined') return;
  const container = document.querySelector(boardSelector);
  if (!container) {
    console.error('[Moodboard] Container nicht gefunden:', boardSelector);
    return;
  }

  container.innerHTML = '';
  items.forEach((item) => container.appendChild(createItemElement(item)));
}

/* -------------------------
   Reihenfolge ändern
--------------------------*/

function moveItem(itemId, direction) {
  const index = items.findIndex((i) => i.id === itemId);
  const target = index + direction;
  if (index === -1 || target < 0 || target >= items.length) return;

  [items[index], items[target]] = [items[target], items[index]];
  saveOrder(items);
  render();
}

function reorderByDrop(sourceId, targetId) {
  if (sourceId === targetId) return;
  const from = items.findIndex((i) => i.id === sourceId);
  const to = items.findIndex((i) => i.id === targetId);
  if (from === -1 || to === -1) return;

  const [moved] = items.splice(from, 1);
  items.splice(to, 0, moved);
  saveOrder(items);
  render();
}

/* -------------------------
   HTML5 Drag & Drop
--------------------------*/

function attachDragHandlers(el) {
  el.addEventListener('dragstart', (event) => {
    draggedId = el.dataset.itemId;
    el.classList.add('challenge-moodboard__item--dragging');
    event.dataTransfer.effectAllowed = 'move';
    // Firefox braucht gesetzte Daten, sonst startet kein Drag
    event.dataTransfer.setData('text/plain', draggedId);
  });

  el.addEventListener('dragover', (event) => {
    event.preventDefault(); // erlaubt Drop
    event.dataTransfer.dropEffect = 'move';
    el.classList.add('challenge-moodboard__item--dropzone');
  });

  el.addEventListener('dragleave', () => {
    el.classList.remove('challenge-moodboard__item--dropzone');
  });

  el.addEventListener('drop', (event) => {
    event.preventDefault();
    el.classList.remove('challenge-moodboard__item--dropzone');
    const targetId = el.dataset.itemId;
    if (draggedId) reorderByDrop(draggedId, targetId);
  });

  el.addEventListener('dragend', () => {
    el.classList.remove('challenge-moodboard__item--dragging');
    draggedId = null;
  });
}

/* -------------------------
   Öffentliche API
--------------------------*/

/**
 * Fügt ein neues Item hinzu.
 * @param {{type: string, content: string}} item
 */
export function addItem(item) {
  if (!item || !item.type || !item.content) {
    console.warn('[Moodboard] addItem: type und content sind Pflicht.');
    return;
  }
  items.push({ id: generateId(), type: item.type, content: item.content });
  saveOrder(items);
  render();
}

/**
 * Entfernt ein Item anhand seiner ID.
 * @param {string} itemId
 */
export function removeItem(itemId) {
  items = items.filter((i) => i.id !== itemId);
  saveOrder(items);
  render();
}

/**
 * Initialisiert das Moodboard: lädt State, rendert, verdrahtet das Add-Formular.
 * @param {string} [containerSelector='#moodboard-grid']
 */
export function initMoodboard(containerSelector = '#moodboard-grid') {
  boardSelector = containerSelector;
  items = loadOrder();
  render();
  wireAddForm();
}

/**
 * Verbindet ein optionales Add-Formular
 * (.challenge-moodboard__add mit [data-moodboard-type] + [data-moodboard-content]).
 */
function wireAddForm() {
  const form = document.querySelector('.challenge-moodboard__add');
  if (!form) return;

  const typeInput = form.querySelector('[data-moodboard-type]');
  const contentInput = form.querySelector('[data-moodboard-content]');
  const submitBtn = form.querySelector('[data-moodboard-submit]');
  if (!contentInput || !submitBtn) return;

  submitBtn.addEventListener('click', () => {
    const content = contentInput.value.trim();
    if (!content) return;
    addItem({ type: typeInput ? typeInput.value : 'text', content });
    contentInput.value = '';
  });
}
