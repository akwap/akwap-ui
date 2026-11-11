import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Akwap Systems company website.
 * Built on AkwapUI: `@/` resolves to the design-system source in ../src,
 * `@site/` to this website's own code.
 */
export default defineConfig({
  root: fileURLToPath(new URL('.', import.meta.url)),
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@site': fileURLToPath(new URL('./src', import.meta.url)),
      '@': fileURLToPath(new URL('../src', import.meta.url)),
    },
  },
  build: {
    target: 'es2022',
    outDir: fileURLToPath(new URL('../dist-website', import.meta.url)),
    emptyOutDir: true,
  },
  server: { port: 5180 },
  preview: { port: 4180 },
})
