import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    target: 'es2022',
    cssMinify: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Vue runtime + router in one long-cached chunk; icons are left to
          // Rollup so each page only loads the icons it uses.
          if (id.includes('node_modules') && !id.includes('@lucide')) return 'vendor'
        },
      },
    },
  },
})
