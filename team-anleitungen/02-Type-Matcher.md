# PRISMA — Anleitung: Type Matcher ✍️

**Dein Branch:** `feature/type-engine`  
**Deine Dateien:** `src/js/modules/type-engine.js`, `src/css/05-components/type-pairing.css`, dein Block `<article id="tool-type">` in `index.html`

---

## 1. Die 4 Grundregeln (nur verstehen, nicht auswendig lernen)

1. **Jede CSS-Klasse beginnt mit `challenge-`** (z. B. `.challenge-type-pairing__heading`) — nie `.card`, `.btn`. Ein zweites Team baut parallel, sonst ueberschreiben sich die Styles.
2. **IDs nur als JS-Hook**, nie zum Stylen.
3. **Sichtbare Texte nie hart reinschreiben** — ueber `data-i18n`, damit Deutsch UND Englisch geht. Neue Text-Keys sagst du dem **Gruppenleiter** (er pflegt `de.js`/`en.js`).
4. **Erst Handy, dann Desktop** (`@media (min-width: 768px)`), und jeder Button braucht `aria-label`.

Der KI-Prompt weiter unten baut diese Regeln automatisch ein.

## 2. WICHTIG: Dein Tool funktioniert schon! 🎉

Gestern wurde alles integriert. **Dein Modul ist bereits eingebaut und laeuft.** Scrolle im Browser zu **„Type Matcher"** und klick es an — es tut schon was.

Deine Aufgabe heute ist **nicht** „von null bauen", sondern:
- **Design verbessern** (es sieht aktuell noch schlicht aus),
- **Bugs ausbuegeln**, falls du welche findest,
- **die Bonus-Features** (unten) ergaenzen, wenn Zeit ist.

Deshalb gibst du der KI **immer zuerst die aktuelle Datei** und laesst sie *verbessern* — nicht neu erfinden. (Wie genau: Abschnitt 5.)

## 3. Git — Schritt fuer Schritt (fuer Anfaenger, nichts kann kaputtgehen)

> Merksatz: **`push` = hochladen, `pull` = runterladen.** Es gibt EIN Repo in der Cloud, jeder hat lokal eine Kopie. Chaos entsteht nur, wenn mehrere in denselben Branch pushen. Loesung: **jeder in seinem eigenen Branch.**

### 3.0 GitHub-Login vorbereiten (einmal pro Rechner)
Wenn dich Git spaeter beim `push` nach Login fragt: im Browser mit deinem GitHub-Konto bestaetigen. Alternativ ein **Personal Access Token** erstellen: github.com → Profilbild → **Settings** → ganz unten **Developer settings** → **Personal access tokens → Tokens (classic)** → **Generate new token (classic)** → Note `ki-challenge`, Expiration `7 days`, Haken bei **repo** → **Generate** → Code **sofort kopieren** (wird nur einmal gezeigt).

### 3.1 Frisch klonen (heute Morgen, EINMAL)
Alten Projektordner loeschen/umbenennen, dann:
```powershell
git clone https://github.com/prisma-projekt/ki-challenge-2026-prisma.git
cd ki-challenge-2026-prisma
npm install
npm run dev
```
(Falls Git-Login: mit Token so klonen — `git clone https://DEIN-NAME:DEIN-TOKEN@github.com/prisma-projekt/ki-challenge-2026-prisma.git`)

Warte auf **„VITE ready"**, dann im Browser: `http://localhost:5173/pages/index.html` — **Terminal offen lassen!**

### 3.2 Deinen eigenen Branch anlegen (EINMAL)
```powershell
git checkout -b feature/type-engine
```
Sagt Git „already exists"? Dann nur: `git checkout feature/type-engine`

### 3.3 Arbeiten → speichern → hochladen (alle 20–30 Min wiederholen!)
```powershell
git add .
git commit -m "kurz was du gemacht hast"
git push -u origin feature/type-engine
```
Das `-u origin feature/type-engine` brauchst du **nur beim allerersten Mal**. Danach reicht `git push`.

### 3.4 Am Ende: Pull Request stellen
Nach `git push` zeigt GitHub oben gelb **„Compare & pull request"** → anklicken → pruefen `base: main` ← `compare: feature/type-engine` → **„Create pull request"**. **Fertig fuer dich.** Du mergst NICHT selbst — das macht der Gruppenleiter.

### 3.5 Spaeter weiterarbeiten (Resync — damit du die Sachen der anderen bekommst)
```powershell
git checkout main
git pull
git checkout feature/type-engine
git merge main
```
Dann normal weiterarbeiten.

## 4. Dein Bereich — was du anfassen darfst

**DARFST du bearbeiten:**
- `src/js/modules/type-engine.js`
- `src/css/05-components/type-pairing.css`
- **Dein HTML-Block:** nur der Inhalt von `<article id="tool-type">…</article>` in `src/pages/index.html`. Dieser Block hat schon fertiges HTML — du aenderst nur *innerhalb* davon.

**NIEMALS anfassen** (gehoeren dem Gruppenleiter): `main.js`, `tokens.css`, `de.js`, `en.js`, und fremde `<article>`-Bloecke.

**Goldene Regel:** Bleib strikt in `<article id="tool-type">`. Nie ausserhalb, nie in fremden `<article id="tool-…">`-Bloecken. So gibt es beim Zusammenfuehren keine Konflikte — auch wenn alle in derselben Datei sind.

### ⚠️ Diese Funktionsnamen NICHT umbenennen
`main.js` ruft deine Funktionen ueber genau diese Namen auf. Benennst du sie um, ist dein Tool auf einmal „tot":
> `generatePairings`, `renderPairings`, `getCurrentCss`

Deine JS-Hooks (existieren schon im HTML — die KI muss GENAU diese Namen ansteuern):
  - `#type-usecase` (Auswahl) und `#type-generate` (Button)
  - `#type-preview` (Container, Klasse `.challenge-type-pairing__container`) — hier rendert `renderPairings`

## 5. So kriegst du GUTEN Code aus der KI (Anti-Muell-Technik)

Das ist der wichtigste Abschnitt. Halte dich dran, dann spuckt die KI keinen Dreck aus:

1. **Kontext zuerst.** Schick als ALLERERSTES den Kontext-Block aus Abschnitt 6.1. Warte auf „verstanden".
2. **Aktuelle Datei mitgeben.** Oeffne deine `type-engine.js` in VS Code, markiere alles (`Strg+A`), kopiere es, und schreib der KI: *„Hier ist die AKTUELLE Datei. Verbessere sie, erfinde nichts Neues, behalte alle Funktionsnamen:"* + einfuegen. So baut die KI auf dem Echten auf statt sich was auszudenken.
3. **Ganze Datei zurueckverlangen.** *„Gib mir die KOMPLETTE Datei zurueck, nicht nur Ausschnitte."* — dann musst du nichts zusammenpuzzeln.
4. **Funktionsnamen schuetzen.** Schreib dazu: *„Diese Namen duerfen NICHT umbenannt werden: `generatePairings`, `renderPairings`, `getCurrentCss`."*
5. **Eine Sache pro Runde.** Erst Design, testen. Dann ein Bonus, testen. Nicht 5 Dinge auf einmal.
6. **Nach JEDER Aenderung testen:** speichern (`Strg+S`) → Browser aktualisiert automatisch → anklicken → **F12 → Console** auf rote Fehler pruefen.
7. **Fehler zurueck an die KI.** Rote Meldung? Exakt kopieren und der KI geben: *„Ich bekomme diesen Fehler: … Bitte fixe nur das."*
8. **Token-Check.** Drueck in der Antwort `Strg+F` und such nach `#` — findest du feste Farben wie `#3B82F6` oder `background: white`, sag: *„Ersetze alle festen Farben durch die passenden --challenge-/--bg-/--text-Variablen."*
9. **Nichts anderes anfassen.** *„Aendere NUR type-engine.js und type-pairing.css. Fass keine anderen Dateien an."*

**Merksatz:** Kontext geben → aktuelle Datei geben → ganze Datei zurueck → testen → Fehler zurueckgeben. Wiederholen.

## 6. Deine fertigen KI-Prompts (copy-paste)

### 6.1 Kontext (immer zuerst, EINMAL pro Chat)
```markdown
Ich arbeite am Projekt PRISMA fuer die KI Challenge 2026 der HTL Traun (Klasse 2BHIT).
Es ist ein bestehendes, LAUFENDES Projekt. Halte dich strikt an diese Architektur:

- Build: Vite 6, Vanilla ES6 Module (import/export), KEINE Inline-Scripts im HTML.
- CSS: ITCSS mit @layer (settings, generic, elements, components, utilities, modes).
  Meine Komponente liegt in @layer components.
- Naming: BEM, ALLE Klassen mit .challenge-* Prefix. Keine generischen Klassen wie .card/.button.
- Keine IDs fuer Styling (IDs nur als JS-Hook).
- i18n: sichtbare Texte ueber data-i18n; Keys pflegt der Gruppenleiter in de.js/en.js.
- Mobile-First: Basis-Styles fuers Handy, Desktop ab @media (min-width: 768px).
- Semantisches HTML5 + aria-label auf ALLEN interaktiven Elementen.

WICHTIG — benutze GENAU diese CSS-Variablen aus tokens.css (erfinde KEINE eigenen!):
  Marke:    --challenge-primary (#4F46E5), --challenge-primary-light, --challenge-primary-dark,
            --challenge-accent (#06B6D4), --challenge-success, --challenge-warning, --challenge-error
  Flaechen: --bg-body, --bg-surface, --bg-surface-elevated, --bg-code
  Text:     --text-primary, --text-secondary, --text-muted, --text-inverse
  Rahmen:   --border-color, --border-color-strong
  Schrift:  --font-sans (Inter), --font-display (Poppins), --font-mono (JetBrains Mono);
            Groessen --text-xs bis --text-5xl
  Abstand:  --space-1 bis --space-24 (8px-Raster)
  Radius:   --radius-sm, --radius-md, --radius-lg, --radius-xl, --radius-full
  Schatten: --shadow-sm bis --shadow-xl, --shadow-glow (unser Signature-Hover!), --shadow-glow-accent

DARK MODE: laeuft automatisch ueber html.dark-mode. NIEMALS body[data-mode] benutzen.
Wenn du fuer Flaechen/Text/Rahmen die semantischen Variablen oben nimmst
(--bg-surface, --text-primary, --border-color ...), funktioniert Dark Mode voellig von allein.

SIGNATURE-STYLE: Beim :hover interaktiver Karten/Buttons setze zusaetzlich
  box-shadow: var(--shadow-glow);
Das ist das einheitliche Erkennungsmerkmal aller PRISMA-Tools.

Bestaetige mit "verstanden" und WARTE auf meine naechste Nachricht.
```

### 6.2 Aufgabe (danach, im selben Chat — davor deine aktuelle Datei einfuegen, siehe Abschnitt 5.2)
```markdown
Mein Type Matcher (type-engine.js) LAEUFT bereits (generatePairings, renderPairings,
Font-Roulette, Mini-Artikel-Mockup, getCurrentCss). Ich will ihn VERBESSERN, nicht neu bauen.
(Aktuelle Datei kommt gleich.)

DESIGN-POLISH (zuerst):
- Die Paarungs-Karten hochwertiger: klarere Hierarchie zwischen Heading-Preview und
  Body-Preview, ruhigere Trennlinien, angenehme Zeilenabstaende. Nur Tokens
  (--space-*, --radius-lg, --border-color, --text-secondary, Hover var(--shadow-glow)).
- Die gewaehlte Karte (--selected) deutlicher, aber dezent hervorheben.

BONUS (nur wenn Zeit):
- „Diese Paarung als CSS kopieren"-Button pro Karte: erzeugt
  :root { --challenge-font-heading: '...'; --challenge-font-body: '...'; } und kopiert es
  (navigator.clipboard), Button mit aria-label + kurzes Feedback.

REGELN:
- Funktionsnamen unveraendert lassen: generatePairings, renderPairings, getCurrentCss.
- Gib mir die KOMPLETTE type-engine.js zurueck, danach die komplette type-pairing.css.
- Aendere NUR diese Dateien.
```

## 7. Fertig? Schnell-Check vor dem Push
- [ ] Projekttyp waehlen → Button → Paarungs-Karten erscheinen mit Mini-Artikel
- [ ] Font-Roulette-Button blaettert kurz durch und landet auf einer Paarung
- [ ] Auswaehlen-Button markiert eine Karte (aria-pressed) + Hover-Glow
- [ ] `F12 → Console` zeigt KEINE roten Fehler
- [ ] Auf dem Handy-Format getestet (im Browser `F12` → Toggle-Device-Toolbar)
- [ ] Dark Mode getestet (Mond-Icon oben) — nichts wird unlesbar

## 8. Wenn's klemmt

| Problem | Loesung |
|---|---|
| „Authentication failed" | Token frisch kopieren (keine Leerzeichen), oder Browser-Login bestaetigen |
| „Repository not found" | Du bist noch nicht als Collaborator akzeptiert → Gruppenleiter |
| `npm run dev` meckert | Im richtigen Ordner? `cd ki-challenge-2026-prisma` |
| „connection refused" im Browser | Terminal zu / PC im Standby → `npm run dev` neu starten |
| Text zeigt roh den Key (z. B. `promptParser.copy`) | i18n-Key fehlt → Gruppenleiter soll ihn in `de.js`/`en.js` ergaenzen |
| Mein Tool tut nichts mehr | Hast du eine Funktion umbenannt? Namen aus Abschnitt 4 wiederherstellen |
| Farben sehen „falsch" aus / kein Dark Mode | Feste Farben (`#…`, `white`) durch Tokens ersetzen (Abschnitt 5.8) |
| Merge-Konflikt (rote `<<<<<<<`) | `git merge --abort` → nichts kaputt → Gruppenleiter fragen |
| Total verirrt | Lieber einmal zu oft fragen als eine Stunde festhaengen 💪 |
