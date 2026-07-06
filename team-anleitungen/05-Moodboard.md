# PRISMA — Deine Anleitung: Moodboard 🖼️

**Dein Branch:** `feature/moodboard`
**Deine Dateien:** `src/js/modules/moodboard.js` und `src/css/05-components/moodboard.css` — sowie NUR dein eigener Block `<article id="tool-moodboard">...</article>` in `src/pages/index.html` (nichts davor/danach anfassen!)

---

## 1. Die 4 wichtigsten Regeln (musst du nicht auswendig können, nur verstehen)

1. **Jede CSS-Klasse fängt mit `challenge-` an** (z. B. `.challenge-moodboard__item`) — nie `.card`, `.button` o.ä. Grund: Ein zweites Team baut parallel mit, sonst überschreiben sich die Styles.
2. **Keine IDs für Styling** — IDs nur, wenn JS gezielt ein Element ansteuern muss.
3. **Sichtbare Texte NIE fest in den Code schreiben**, sondern über `data-i18n="..."` — die Seite muss Deutsch UND Englisch können.
4. **Erst fürs Handy stylen, dann für Desktop** (`@media (min-width: 768px)`), und jeder Button braucht ein `aria-label`.

Der KI-Prompt unten baut diese Regeln automatisch ein — du musst sie nicht selbst tippen.

---

## 2. Los geht's — Schritt für Schritt

### Schritt 0 (nur falls noch nicht gemacht): Deinen GitHub-Token erstellen
1. Auf github.com einloggen (mit deinem Account)
2. Profilbild oben rechts → **Settings**
3. Ganz unten links → **Developer settings**
4. **Personal access tokens** → **Tokens (classic)**
5. **Generate new token** → **Generate new token (classic)**
6. Note: `ki-challenge`, Expiration: `7 days`, Häkchen bei `repo`
7. **Generate token** → den grünen Code SOFORT kopieren und sichern (Notizen-App o. ä.) — wird nur einmal angezeigt!

### Schritt 1: Projekt klonen
Terminal öffnen, dann (ersetze `USERNAME` durch deinen GitHub-Namen und `TOKEN` durch deinen Code):
```powershell
git clone https://USERNAME:TOKEN@github.com/prisma-projekt/ki-challenge-2026-prisma.git
cd ki-challenge-2026-prisma
```

### Schritt 2: Auf deinen Branch wechseln
```powershell
git checkout feature/moodboard
```

### Schritt 3: Projekt öffnen und Server starten
```powershell
code .
```
Im sich öffnenden VS Code: Menü **Terminal → New Terminal**, dann:
```powershell
npm install
npm run dev
```
Warte auf „VITE ready", dann im Browser öffnen:
```
http://localhost:5173/pages/index.html
```
**Lass dieses Terminal-Fenster die ganze Zeit offen!**

### Schritt 4: Deine Datei finden
Links im Dateibaum: `src` → `js` → `modules` → **`moodboard.js`** öffnen (und `src/css/05-components/moodboard.css` für dein Styling).

---

## 2.5 Wichtig: Dein Bereich in `index.html`

In `src/pages/index.html` gibt es schon eine Karte für dein Tool: `<article id="tool-moodboard">...</article>`. Darin steckt aktuell nur ein Platzhalter-Text (`<div class="tool-placeholder">`). Das ersetzt du gleich durch dein echtes Eingabefeld + Button + Ergebnis-Anzeige.

**Goldene Regel:** Bearbeite NUR den Inhalt innerhalb von `<article id="tool-moodboard">...</article>`. Nichts davor, nichts danach — auch nicht bei anderen `<article id="tool-...">`-Blöcken, die gehören anderen Personen. Solange jeder nur in seinem eigenen Block bleibt, gibt es beim Zusammenführen keine Konflikte, auch wenn alle in derselben Datei arbeiten.

---

## 3. Dein KI-Prompt

Kopiere **zuerst** diesen Block in deine KI (egal welche):

```markdown
Ich arbeite am Projekt PRISMA für die KI Challenge 2026 der HTL Traun (Klasse 2BHIT) mit dieser Architektur:
- Build-Tool: Vite 6, Vanilla ES6 Module (import/export), 0 Inline-Scripts im HTML
- CSS: ITCSS mit @layer (settings, generic, elements, components, utilities, modes)
- Naming: BEM, ALLE Klassen mit .challenge-* Prefix — keine generischen Klassen wie .card/.button
- Keine IDs für Styling, nur für JS-Hooks
- i18n: data-i18n Attribute, Key-Schema feature.subfeature.element, de.js und en.js müssen synchron sein
- Mobile-First: Basis-Styles für Mobile, @media(min-width) ab 768px für Desktop
- Semantisches HTML5 + ARIA-Labels auf allen interaktiven Elementen
- Alle Farben/Abstände über CSS-Variablen aus tokens.css (z.B. var(--challenge-primary), var(--space-4))
Bitte halte dich strikt an diese Regeln, auch wenn ich es in der konkreten Anfrage nicht jedes Mal wiederhole.
```

**Danach direkt im selben Chat** diesen Block:

```markdown
Erstelle mir das "Moodboard"-Tool als ES6-Modul in der Datei `js/modules/moodboard.js`.

PFLICHT:
1. DEFAULT_ITEMS: mind. 6–8 Items, gemischt aus color/image/text.
2. initMoodboard(containerSelector='#moodboard-grid'): lädt via loadOrder() (Fallback DEFAULT_ITEMS), rendert, initialisiert Drag & Drop.
3. renderItems(items, containerSelector): rendert passend zum Typ, jedes Element draggable + Lösch-Button.
4. addItem(item) / removeItem(itemId): fügen hinzu/entfernen, speichern über saveOrder(), rendern neu.
5. saveOrder(items) / loadOrder(): JSON in/aus localStorage, Key 'prisma-moodboard'.
6. HTML5 Drag & Drop Events (dragstart, dragover, drop, dragend) für Neuanordnung per Maus.
7. Formular/Button zum Hinzufügen neuer Items (Bild-URL oder Text).

BONUS-ERWEITERUNG:
8. Tastatur-Alternative zum Drag & Drop: Wenn ein Item fokussiert ist (Tab-Taste), verschieben die Pfeiltasten (Links/Rechts oder Hoch/Runter) es eine Position nach vorne/hinten in der Reihenfolge — inklusive Speichern der neuen Reihenfolge, genau wie bei Maus-Drag.
9. Ein Button "Vibe analysieren": liest alle Items vom Typ 'color' aus dem aktuellen Moodboard aus, exportiert sie als benanntes CustomEvent ('prisma:vibe-detected', { detail: { colors: [...] } }), das andere Module (z.B. Color Engine) abfangen können, um daraus eine neue, personalisierte Stimmung/Palette vorzuschlagen.

Architektur-Vorgaben:
- BEM: .challenge-moodboard__item--dragging (Drag-Modifier), .challenge-moodboard__item--focused (Tastatur-Fokus-Modifier), .challenge-moodboard__vibe-btn.
- Jedes Item: aria-label mit Typ + Position (z.B. "Farbe #4F46E5, Position 2 von 8"), Lösch-Button eigenes aria-label.
- Tastatur-Verschieben muss den Fokus nach der Verschiebung auf demselben Item behalten (nicht verlieren).

Gib mir zuerst PFLICHT vollständig, danach BONUS-ERWEITERUNG separat.

ZUSÄTZLICH: Gib mir auch das HTML-Snippet, das ich in `src/pages/index.html` INNERHALB von `<article id="tool-moodboard">` anstelle des aktuellen `<div class="tool-placeholder">...</div>` einfügen soll (Eingabefeld/Auswahl + Button + Ergebnis-Container mit passender BEM-Klasse).
```

Den zurückgegebenen Code in deine zwei Dateien einfügen UND das HTML-Snippet in deinen `<article id="tool-moodboard">`-Block in `index.html` (Platzhalter-Div ersetzen), speichern (`Strg+S`), im Browser prüfen.

---

## 4. Speichern & Hochladen (alle 20–30 Minuten wiederholen!)

```powershell
git add .
git commit -m "kurze Beschreibung was du gemacht hast"
git push
```

---

## 5. Wenn's klemmt

| Problem | Lösung |
|---|---|
| "Authentication failed" beim Klonen | Token nochmal frisch kopieren, evtl. Leerzeichen mitkopiert |
| "Repository not found" | Du wurdest noch nicht als Collaborator akzeptiert → beim Gruppenleiter melden |
| `npm run dev` Fehler | Bist du im richtigen Ordner? `cd ki-challenge-2026-prisma` nicht vergessen |
| Browser zeigt "connection refused" | Terminal-Fenster geschlossen/PC im Standby → `npm run dev` neu eingeben |
| Sonst irgendwas unklar | Einfach den Gruppenleiter fragen — lieber einmal zu oft als stecken bleiben |
