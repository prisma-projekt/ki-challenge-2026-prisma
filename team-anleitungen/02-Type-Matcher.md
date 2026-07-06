# PRISMA — Deine Anleitung: Type Matcher ✍️

**Dein Branch:** `feature/type-engine`
**Deine Dateien:** `src/js/modules/type-engine.js` und `src/css/05-components/type-pairing.css` — sowie NUR dein eigener Block `<article id="tool-type">...</article>` in `src/pages/index.html` (nichts davor/danach anfassen!)

---

## 1. Die 4 wichtigsten Regeln (musst du nicht auswendig können, nur verstehen)

1. **Jede CSS-Klasse fängt mit `challenge-` an** (z. B. `.challenge-type-pairing__heading`) — nie `.card`, `.button` o.ä. Grund: Ein zweites Team baut parallel mit, sonst überschreiben sich die Styles.
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
git checkout feature/type-engine
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
Links im Dateibaum: `src` → `js` → `modules` → **`type-engine.js`** öffnen (und `src/css/05-components/type-pairing.css` für dein Styling).

---

## 2.5 Wichtig: Dein Bereich in `index.html`

In `src/pages/index.html` gibt es schon eine Karte für dein Tool: `<article id="tool-type">...</article>`. Darin steckt aktuell nur ein Platzhalter-Text (`<div class="tool-placeholder">`). Das ersetzt du gleich durch dein echtes Eingabefeld + Button + Ergebnis-Anzeige.

**Goldene Regel:** Bearbeite NUR den Inhalt innerhalb von `<article id="tool-type">...</article>`. Nichts davor, nichts danach — auch nicht bei anderen `<article id="tool-...">`-Blöcken, die gehören anderen Personen. Solange jeder nur in seinem eigenen Block bleibt, gibt es beim Zusammenführen keine Konflikte, auch wenn alle in derselben Datei arbeiten.

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
Erstelle mir den "Type Matcher" als ES6-Modul in der Datei `js/modules/type-engine.js`.

PFLICHT:
1. Objekt FONT_PAIRINGS mit mind. 5 Use Cases, je 3 Paarungen {heading, body, reason}.
2. generatePairings(useCase): normalisiert Input, gibt Paarungen zurück oder getDefaultPairings() als Fallback.
3. loadGoogleFonts(fontNames): lädt Fonts dynamisch über <link> zur Google Fonts API, keine Duplikate.
4. renderPairings(pairings, containerSelector = '#type-preview'): pro Paarung Heading-Preview, Body-Preview, Begründung, "Auswählen"-Button.
5. getDefaultPairings(): sinnvolle Fallback-Paarungen.

BONUS-ERWEITERUNG:
6. Statt nur isolierter Preview-Wörter: rendere die gewählte Paarung in einem realistischen Mini-Artikel-Mockup (Überschrift + 2 Absätze Fülltext + eine kleine "Autor"-Zeile), damit man sieht, wie die Fonts in echtem Kontext wirken.
7. Ein "Font-Roulette"-Button: beim Klick wird kurz (ca. 1,5 Sekunden) durch mehrere zufällige Paarungen "durchgeblättert" (schnelle CSS-Transition, wie ein Spielautomat), bevor eine finale Paarung "landet" und angezeigt wird.

Architektur-Vorgaben:
- BEM: .challenge-type-pairing, .challenge-type-pairing__article (Mockup-Container), .challenge-type-pairing__roulette-btn.
- Roulette-Animation muss prefers-reduced-motion respektieren (bei aktivierter Einstellung: keine Animation, Ergebnis erscheint direkt).
- "Auswählen"-Button mit aria-pressed, Roulette-Button mit aria-label.
- Preview-Texte über data-i18n, Key-Schema: typeMatcher.pairing.previewHeading / typeMatcher.pairing.previewBody / typeMatcher.pairing.previewArticle.

Gib mir zuerst PFLICHT vollständig, danach BONUS-ERWEITERUNG separat.

ZUSÄTZLICH: Gib mir auch das HTML-Snippet, das ich in `src/pages/index.html` INNERHALB von `<article id="tool-type">` anstelle des aktuellen `<div class="tool-placeholder">...</div>` einfügen soll (Eingabefeld/Auswahl + Button + Ergebnis-Container mit passender BEM-Klasse).
```

Den zurückgegebenen Code in deine zwei Dateien einfügen UND das HTML-Snippet in deinen `<article id="tool-type">`-Block in `index.html` (Platzhalter-Div ersetzen), speichern (`Strg+S`), im Browser prüfen.

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
