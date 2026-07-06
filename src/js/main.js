/**
 * PRISMA — KI Challenge 2026 Team B
 * Entry Point
 */

import { initI18n } from './modules/i18n.js';
import { initTheme } from './modules/theme.js';
import { ClassroomManager, initBackToTop, initMobileMenu } from './modules/classroom.js';
import { initMission } from './modules/mission.js';
import { initXP } from './modules/xp.js';

import de from '../translations/de.js';
import en from '../translations/en.js';

// Tool-Module
import colorEngine, { generatePalette, renderPalette, generateCssVariables } from './modules/color-engine.js';
import { generatePairings, renderPairings } from './modules/type-engine.js';
import { generateLayout, renderLayoutPreview } from './modules/layout-engine.js';
import { initMoodboard } from './modules/moodboard.js';
import { optimizePrompt, renderResult, initPromptTemplates } from './modules/prompt-parser.js';
import { initExportButtons, registerCssSource } from './modules/export-system.js';

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  initI18n(de, en);

  // Initialize theme (dark/light)
  initTheme();

  // Initialize classroom mode
  new ClassroomManager();

  // Initialize back-to-top
  initBackToTop();

  // Initialize mobile menu
  initMobileMenu();

  // Initialize mission onboarding
  initMission();

  // Initialize XP system
  initXP();

  // Initialize scroll reveal
  initScrollReveal();

  // === Tool-Module verdrahten ===
  initColorTool();
  initTypeTool();
  initLayoutTool();
  initMoodboard('#moodboard-grid');
  initPromptTool();

  // Export-Engine: CSS-Quellen registrieren + Copy-Buttons initialisieren
  registerCssSource('colors', () => colorEngine.getCurrentCss());
  registerCssSource('typography', () => (typeGetCss ? typeGetCss() : ''));
  registerCssSource('layout', () => (layoutGetCss ? layoutGetCss() : ''));
  initExportButtons();
});


// getCurrentCss aus den Modulen (fuer die Export-Engine)
import { getCurrentCss as typeGetCss } from './modules/type-engine.js';
import { getCurrentCss as layoutGetCss } from './modules/layout-engine.js';

function initColorTool() {
  const input = document.querySelector('#color-mood-input');
  const btn = document.querySelector('#color-generate-btn');
  const output = document.querySelector('#color-css-output');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const palette = generatePalette(input ? input.value : '');
    renderPalette(palette, '#color-preview');
    if (output) output.textContent = generateCssVariables(palette);
  });
}

function initTypeTool() {
  const select = document.querySelector('#type-usecase');
  const btn = document.querySelector('#type-generate');
  if (!btn) return;
  btn.addEventListener('click', () => {
    renderPairings(generatePairings(select ? select.value : 'blog'), '#type-preview');
  });
}

function initLayoutTool() {
  const select = document.querySelector('#layout-usecase');
  const btn = document.querySelector('#layout-generate');
  const output = document.querySelector('#layout-css-output');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const layout = generateLayout(select ? select.value : 'blog');
    renderLayoutPreview(layout, '#layout-preview');
    if (output) output.textContent = layout.css;
  });
}

function initPromptTool() {
  initPromptTemplates();
  const input = document.querySelector('#prompt-input');
  const btn = document.querySelector('#prompt-optimize');
  if (!btn) return;
  btn.addEventListener('click', () => {
    renderResult(optimizePrompt(input ? input.value : ''), '#prompt-result');
  });
}
function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('u-reveal--visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.u-reveal').forEach(el => observer.observe(el));

  // Stagger delay for role cards, tool cards, topic cards
  const staggerContainers = [
    '.challenge-roles__grid',
    '.tools-grid',
    '.topics-grid',
    '.challenge-workflow__timeline'
  ];

  staggerContainers.forEach(selector => {
    const container = document.querySelector(selector);
    if (container) {
      const children = container.children;
      Array.from(children).forEach((child, index) => {
        child.classList.add('u-reveal-stagger');
        child.style.setProperty('--stagger-delay', `${index * 0.1}s`);
        observer.observe(child);
      });
    }
  });
}
