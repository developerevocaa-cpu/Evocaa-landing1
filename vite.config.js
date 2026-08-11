import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// Evocaa — Vite multi-page build.
// index.html (landing) and booking.html (booking form) are both entry pages.
// `base: './'` keeps asset paths relative so the site works on Render.
export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: fileURLToPath(new URL('./index.html', import.meta.url)),
        booking: fileURLToPath(new URL('./booking.html', import.meta.url))
      }
    }
  }
});