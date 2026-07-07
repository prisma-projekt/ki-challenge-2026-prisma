# PRISMA 🎨

Team-Projekt für die **KI Challenge 2026** (HTL Traun) — sechs KI-gestützte Kreativ-Tools für Webdesign, gebaut mit Vanilla JS und einer strikten ITCSS/BEM-Architektur.

> **Status:** Alle Tools sind integriert und laufen auf `main`. Ab hier geht es ums **Verbessern, Polieren und die Bonus-Features** — nicht ums Neubauen.

## Die 6 Tools

| Tool | Zweck | Branch |
|---|---|---|
| 🎨 **Color Engine** | Stimmung → 5-Farb-Palette (inkl. Foto-Farbextraktion) | `feature/color-engine` |
| ✍️ **Type Matcher** | Schriftpaarungen mit Begründung + Font-Roulette | `feature/type-engine` |
| 📐 **Layout Blueprint** | Use Case → responsives Grid-CSS + Vorschau | `feature/layout-engine` |
| 📦 **Export Station** | Generiertes CSS/JSON kopieren, herunterladen, teilen | `feature/export-system` |
| 🖼️ **Moodboard** | Drag & Drop Moodboard mit localStorage | `feature/moodboard` |
| 🤖 **Prompt Parser** | Prompt-Optimierer (regelbasiert + optionale KI-API) | `feature/prompt-parser` |

## Lokal starten

```bash
git clone https://github.com/prisma-projekt/ki-challenge-2026-prisma.git
cd ki-challenge-2026-prisma
npm install
npm run dev
```
Dann im Browser: `http://localhost:5173/pages/index.html`

## Tech-Stack

- **Build:** Vite 6
- **JS:** Vanilla ES6 Module (kein Framework)
- **CSS:** ITCSS mit `@layer` (settings, generic, elements, components, utilities, modes)
- **Naming:** BEM mit `.challenge-*` Prefix
- **i18n:** Deutsch/Englisch über `data-i18n`
- **Dark Mode:** über `html.dark-mode` (semantische Tokens mappen automatisch um)

---

## 🚦 Team-Workflow (bitte GENAU so, dann gibt es kein Chaos)

Das gestrige Durcheinander kam daher, dass mehrere Leute direkt auf `main` gepusht haben. Ab jetzt gelten **drei eiserne Regeln**:

1. **Niemand pusht auf `main`.** `main` ändert sich NUR über einen „Merge pull request" auf GitHub — und das macht **nur der Gruppenleiter**.
2. **Jeder arbeitet nur in seinen eigenen Dateien** (siehe Tabelle unten). Bleib in deiner Spur.
3. **Vor jedem Arbeiten:** `git checkout main && git pull`, dann in deinem Branch `git merge main`. So bleiben alle synchron.

### Datei-Zuständigkeit (das verhindert Merge-Konflikte)

| Person | Branch | Darf NUR diese Dateien ändern |
|---|---|---|
| Color | `feature/color-engine` | `color-engine.js`, `color-preview.css`, `<article id="tool-color">` |
| Type | `feature/type-engine` | `type-engine.js`, `type-pairing.css`, `<article id="tool-type">` |
| Layout | `feature/layout-engine` | `layout-engine.js`, `layout-blueprint.css`, `<article id="tool-layout">` |
| Export | `feature/export-system` | `export-system.js`, `export-panel.css` |
| Moodboard | `feature/moodboard` | `moodboard.js`, `moodboard.css`, `<article id="tool-moodboard">` |
| Prompt | `feature/prompt-parser` | `prompt-parser.js`, `prompt-input.css`, `<article id="tool-prompt">` |
| **Gruppenleiter** | `main` + Reviews | `main.js`, `index.html` (Rahmen), `tokens.css`, `de.js`, `en.js`, alle Merges |

Die **geteilten Dateien** (`main.js`, `tokens.css`, `de.js`/`en.js`) gehören dem Gruppenleiter allein. Brauchst du dort etwas (z. B. einen neuen i18n-Text-Key), sag ihm Bescheid.

### Tagesablauf pro Person

```bash
git checkout main && git pull          # neuesten Stand holen
git checkout -b feature/DEIN-TOOL      # (oder: git checkout feature/DEIN-TOOL)
git merge main                         # eigenen Branch aktualisieren
# ... an DEINEN Dateien arbeiten ...
git add .
git commit -m "kurz was du gemacht hast"
git push -u origin feature/DEIN-TOOL   # -u nur beim ersten Mal, danach: git push
```
Dann auf GitHub **„Compare & pull request"** → **Create pull request**. Fertig — der Gruppenleiter merged.

### Merge-Konflikt? Keine Panik
`git merge --abort` setzt alles zurück (nichts geht verloren) → Gruppenleiter fragen.

---

## Deine ausführliche Anleitung

Jede Rolle hat eine eigene Schritt-für-Schritt-Anleitung mit fertigen, copy-paste-baren KI-Prompts und Techniken gegen KI-Müll — in [`team-anleitungen/`](./team-anleitungen).

## Projektstruktur

```
src/
├── assets/            Bilder, Favicon
├── css/               ITCSS-Layer (00-settings … 09-print)
├── js/
│   ├── main.js        Einstiegspunkt, verdrahtet alle Tools (Gruppenleiter)
│   └── modules/       Die 6 Tool-Module + Kernsysteme (i18n, theme, xp, …)
├── pages/index.html   HTML-Rahmen + je eine <article> pro Tool
└── translations/      de.js / en.js
```

## Team

Team PRISMA @ KI Challenge 2026
