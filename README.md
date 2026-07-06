# PRISMA 🎨

Team-Projekt für die **KI Challenge 2026** (HTL Traun) — fünf KI-gestützte Kreativ-Tools für Webdesign, gebaut mit Vanilla JS und einer strikten ITCSS/BEM-Architektur.

## Die 5 Tools

| Tool | Zweck |
|---|---|
| 🎨 **Color Engine** | Stimmung → 5-Farb-Palette (inkl. Foto-Farbextraktion) |
| ✍️ **Type Matcher** | Schriftpaarungen mit Begründung |
| 📐 **Layout Blueprint** | Use Case → responsives Grid-CSS |
| 📦 **Export Station** | Generiertes CSS/JSON exportieren & teilen |
| 🖼️ **Moodboard** | Drag & Drop Moodboard mit localStorage |
| 🤖 **Prompt Parser** | Prompt-Optimierer (regelbasiert + optionale KI-API) |

## Tech-Stack

- **Build:** Vite 6
- **JS:** Vanilla ES6 Module (kein Framework)
- **CSS:** ITCSS mit `@layer` (settings, generic, elements, components, utilities, modes)
- **Naming:** BEM mit `.challenge-*` Prefix
- **i18n:** Deutsch/Englisch über `data-i18n` Attribute

## Lokal starten

```bash
npm install
npm run dev
```
Danach im Browser öffnen: `http://localhost:5173/pages/index.html`

## Branches

Jedes Modul hat einen eigenen Branch — Details und fertige KI-Prompts pro Rolle liegen in [`team-anleitungen/`](./team-anleitungen).

| Branch | Modul |
|---|---|
| `feature/color-engine` | Color Engine |
| `feature/type-engine` | Type Matcher |
| `feature/layout-engine` | Layout Blueprint |
| `feature/export-system` | Export Station |
| `feature/moodboard` | Moodboard |
| `feature/prompt-parser` | Prompt Parser |

## Projektstruktur

```
src/
├── assets/           Bilder, Favicon
├── css/              ITCSS-Layer (00-settings … 09-print)
├── js/modules/        Die 6 Tool-Module + Kernsysteme (i18n, theme, xp, ...)
├── pages/index.html   Einstiegspunkt
└── translations/      de.js / en.js
```

## Team

Team PRISMA @ KI Challenge 2026
