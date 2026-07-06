# PRISMA — Deine Anleitung: Prompt Parser 🤖 (mit KI-API-Bonus)

**Dein Branch:** `feature/prompt-parser`
**Deine Dateien:** `src/js/modules/prompt-parser.js` und `src/css/05-components/prompt-input.css` — sowie NUR dein eigener Block `<article id="tool-prompt">...</article>` in `src/pages/index.html` (nichts davor/danach anfassen!)

---

## 1. Die 4 wichtigsten Regeln (musst du nicht auswendig können, nur verstehen)

1. **Jede CSS-Klasse fängt mit `challenge-` an** (z. B. `.challenge-prompt-input`) — nie `.card`, `.button` o.ä. Grund: Ein zweites Team baut parallel mit, sonst überschreiben sich die Styles.
2. **Keine IDs für Styling** — IDs nur, wenn JS gezielt ein Element ansteuern muss.
3. **Sichtbare Texte NIE fest in den Code schreiben**, sondern über `data-i18n="..."` — die Seite muss Deutsch UND Englisch können.
4. **Erst fürs Handy stylen, dann für Desktop** (`@media (min-width: 768px)`), und jeder Button braucht ein `aria-label`.

Der KI-Prompt unten baut diese Regeln automatisch ein — du musst sie nicht selbst tippen.

**Besonderheit bei deinem Modul:** Du baust zuerst eine Version, die KOMPLETT OHNE Internet/API funktioniert (regelbasiert). Die echte KI-API-Anbindung ist ein Bonus obendrauf — dafür braucht es einen API-Key, um den sich der Gruppenleiter kümmert. Frag ihn, wann du zu Punkt 6 (BONUS) übergehen sollst.

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
git checkout feature/prompt-parser
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
Links im Dateibaum: `src` → `js` → `modules` → **`prompt-parser.js`** öffnen (und `src/css/05-components/prompt-input.css` für dein Styling).

---

## 2.5 Wichtig: Dein Bereich in `index.html`

In `src/pages/index.html` gibt es schon eine Karte für dein Tool: `<article id="tool-prompt">...</article>`. Darin steckt aktuell nur ein Platzhalter-Text (`<div class="tool-placeholder">`). Das ersetzt du gleich durch dein echtes Eingabefeld + Button + Ergebnis-Anzeige.

**Goldene Regel:** Bearbeite NUR den Inhalt innerhalb von `<article id="tool-prompt">...</article>`. Nichts davor, nichts danach — auch nicht bei anderen `<article id="tool-...">`-Blöcken, die gehören anderen Personen. Solange jeder nur in seinem eigenen Block bleibt, gibt es beim Zusammenführen keine Konflikte, auch wenn alle in derselben Datei arbeiten.

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
Erstelle mir den "Prompt Parser" als ES6-Modul in der Datei `js/modules/prompt-parser.js`.

PFLICHT (muss IMMER offline funktionieren, ohne Internet/API):
1. PROMPT_RULES: mind. 10 Regeln {pattern: RegExp, replacement, explanation}.
2. optimizePrompt(input): wendet Regeln an, dokumentiert Änderungen, gibt {original, improved, changes} zurück.
3. renderResult(result, containerSelector='#prompt-result'): Original (ausgegraut), Verbessert (hervorgehoben), Änderungsliste mit Begründung, Copy-Button.
4. addContextHeader(prompt): stellt den ITCSS/BEM-Architektur-Kontext voran (siehe Kontext-Header oben).
5. PROMPT_TEMPLATES: 5–8 vordefinierte Vorlagen als Buttons, initPromptTemplates() füllt Eingabefeld beim Klick.

BONUS-ERWEITERUNG ("Prompt Battle" — regelbasiert vs. echte KI — NUR nach Rücksprache mit dem Gruppenleiter, braucht API-Key):
6. Ein Button "Mit echter KI vergleichen" sendet den ORIGINAL-Prompt an die Anthropic API (POST an /v1/messages, Modell "claude-sonnet-4-6", max_tokens 500). System-Prompt für den API-Call: "Du bist ein Prompt-Optimierer für ein Webprojekt mit ITCSS/BEM-Architektur (.challenge-* Klassen, Mobile-First, ARIA-Labels, data-i18n). Verbessere den folgenden Prompt und erkläre in maximal 2 Sätzen, warum er jetzt besser ist."
7. Zeige das Ergebnis in einer zweiten Spalte NEBEN der Regel-Engine-Ausgabe (Layout: "Regelbasiert" links, "Von echter KI verbessert" rechts).
8. Cache identische Anfragen, damit beim wiederholten Testen nicht erneut abgerechnet wird.
9. Fehlerbehandlung: Wenn der API-Call fehlschlägt, zeige eine freundliche Meldung ("KI gerade nicht erreichbar — hier ist trotzdem die regelbasierte Verbesserung") — die Regel-Engine-Seite bleibt immer nutzbar.

Architektur-Vorgaben:
- Kein API-Key im Frontend-Code hardcoden — Platzhalter-Kommentar einfügen, der Gruppenleiter kümmert sich um die sichere Handhabung.
- BEM: .challenge-prompt-result__column--rules, .challenge-prompt-result__column--ai, .challenge-prompt-result__compare-btn.
- Ergebnis-Panel mit aria-live="polite", damit Screenreader neue Ausgaben automatisch ankündigen.

Gib mir zuerst PFLICHT vollständig (muss ohne Internet/API funktionieren), danach BONUS-ERWEITERUNG als klar abgetrennten Zusatzblock.

ZUSÄTZLICH: Gib mir auch das HTML-Snippet, das ich in `src/pages/index.html` INNERHALB von `<article id="tool-prompt">` anstelle des aktuellen `<div class="tool-placeholder">...</div>` einfügen soll (Eingabefeld/Auswahl + Button + Ergebnis-Container mit passender BEM-Klasse).
```

Den zurückgegebenen Code in deine zwei Dateien einfügen UND das HTML-Snippet in deinen `<article id="tool-prompt">`-Block in `index.html` (Platzhalter-Div ersetzen), speichern (`Strg+S`), im Browser prüfen.

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
