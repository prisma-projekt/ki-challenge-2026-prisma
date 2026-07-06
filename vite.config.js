import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  // 'src' ist jetzt der Web-Root. So liegen css/, js/, assets/ und translations/
  // (Geschwister von pages/) INNERHALB des servierbaren Bereichs, und relative
  // Pfade wie "../js/main.js" aus src/pages/index.html können korrekt aufgelöst werden.
  root: 'src',
  build: {
    // outDir wird relativ zu 'root' aufgelöst -> von 'src' aus eine Ebene hoch
    // ergibt wieder <projekt-root>/dist, genau wie vorher.
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      // Expliziter Entry-Point, da index.html jetzt unter src/pages/ liegt
      // und nicht mehr direkt im (neuen) root.
      input: fileURLToPath(new URL('./src/pages/index.html', import.meta.url))
    }
  },
  server: {
    // Bequemlichkeit: npm run dev öffnet direkt die richtige Seite
    // statt der leeren Root-URL.
    open: '/pages/index.html'
  }
});