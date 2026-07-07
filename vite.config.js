import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: 'src',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'src/pages/index.html'),
        promptParser: path.resolve(__dirname, 'src/pages/prompt-parser.html')
      }
    }
  },
  server: {
    proxy: {
      // Proxy für Groq API (nur im Dev-Server).
      // Im Produktivbetrieb braucht es ein Backend oder einen CORS-Proxy.
      '/api/groq': {
        target: 'https://api.groq.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/groq/, '')
      }
    }
  }
});
