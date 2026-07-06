# PRISMA — Deine Anleitung: Export Station 📦

**Dein Branch:** `feature/export-system`
**Deine Dateien:** `src/js/modules/export-system.js` und `src/css/05-components/export-panel.css`

**Besonderheit bei dir:** Anders als die anderen 5 hast du KEINE eigene Karte in `index.html` — es gibt kein `<article id="tool-export">`. Deine Funktionen (Copy-Button, Download, Share-Link) werden später in die ANDEREN 5 Tool-Karten eingebaut (z. B. ein "CSS kopieren"-Button bei der Color Engine, der deine Funktion aufruft). Das übernimmt der Gruppenleiter beim finalen Zusammenführen — du musst heute NICHT in `index.html`. Zum Testen deiner Funktionen reicht ein kleiner, temporärer Test-Button irgendwo auf deiner Seite oder ein Test direkt in der Browser-Konsole (`F12` → Console).

---

## 1. Die 4 wichtigsten Regeln (musst du nicht auswendig können, nur verstehen)

1. **Jede CSS-Klasse fängt mit `challenge-` an** (z. B. `.challenge-export-panel__button`) — nie `.card`, `.button` o.ä. Grund: Ein zweites Team baut parallel mit, sonst überschreiben sich die Styles.
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
git checkout feature/export-system
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
Links im Dateibaum: `src` → `js` → `modules` → **`export-system.js`** öffnen (und `src/css/05-components/export-panel.css` für dein Styling).

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
Erstelle mir die "Export Station" als ES6-Modul in der Datei `js/modules/export-system.js`.

PFLICHT:
1. copyToClipboard(text): navigator.clipboard.writeText() mit execCommand-Fallback, gibt true/false zurück.
2. combineCss({colorCss, typeCss, layoutCss}): kommentierter CSS-Block mit Abschnitten.
3. showFeedback(message, type='success'): Toast mit Icon, verschwindet nach 3s, role="status".
4. initExportButtons(): Click-Listener auf alle Export-Buttons, kopiert passenden CSS-Block, zeigt Feedback.

BONUS-ERWEITERUNG:
5. downloadFile(content, filename, mimeType): erstellt einen Blob, triggert einen echten Datei-Download im Browser (funktioniert für .css UND .json).
6. exportAsDesignTokensJson({colorPalette, fontPairing, layout}): baut ein strukturiertes JSON-Objekt (Design-Tokens-Format, z.B. {colors: {...}, typography: {...}, layout: {...}}) und bietet es über downloadFile() als design-tokens.json zum Download an.
7. buildShareableLink({colorPalette, fontPairing, layoutUseCase}): codiert den aktuellen Zustand kompakt in Base64 als URL-Query-Parameter (z.B. ?state=eyJjb2xvciI6...) und gibt die vollständige URL zurück. Ergänze eine parseShareableLink()-Funktion, die beim Laden der Seite prüft, ob ein ?state=-Parameter vorhanden ist, und falls ja, automatisch die entsprechende Palette/Font/Layout wieder herstellt.

Architektur-Vorgaben:
- BEM: .challenge-export-panel__download-btn, .challenge-export-panel__share-btn, .challenge-export-panel__share-link (Anzeige des generierten Links, selbst kopierbar).
- Buttons brauchen aria-label, Toast-Texte über data-i18n (export.feedback.success / export.feedback.error / export.feedback.linkCopied).
- downloadFile() darf keine Inline-Scripts erzeugen — reines DOM-Element (<a>) programmatisch erstellen und wieder entfernen.

Gib mir zuerst PFLICHT vollständig, danach BONUS-ERWEITERUNG separat.
```

Den zurückgegebenen Code in deine zwei Dateien einfügen, speichern (`Strg+S`), im Browser prüfen.

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
