import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

/**
 * Builds the optional Vue islands into static/islands/ (npm run islands).
 * `akwapui` points at the library build in this repo (npm run build:lib at
 * the repo root). In your own project, `npm install akwapui` instead and
 * drop the alias.
 */
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: { akwapui: fileURLToPath(new URL('../../../dist-lib/akwapui.js', import.meta.url)) },
  },
  build: {
    outDir: 'static/islands',
    emptyOutDir: true,
    manifest: true,
    rollupOptions: {
      input: { islands: fileURLToPath(new URL('./frontend/islands.ts', import.meta.url)) },
      output: { entryFileNames: '[name].js', chunkFileNames: '[name]-[hash].js' },
    },
  },
})
