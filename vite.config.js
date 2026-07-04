import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src/pages',
  build: {
    outDir: '../../dist',
    emptyOutDir: true
  }
});