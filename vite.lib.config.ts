import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

/**
 * Library build: `npm run build:lib` → dist-lib/
 *   akwapui.js   ES module (components, composables, plugin)
 *   style.css    tokens, themes and every utility the components use
 * vue, vue-router and @lucide/vue stay external (peer dependencies).
 */
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  build: {
    outDir: 'dist-lib',
    emptyOutDir: true,
    target: 'es2022',
    copyPublicDir: false,
    lib: {
      entry: fileURLToPath(new URL('./src/design-system/index.ts', import.meta.url)),
      formats: ['es'],
      fileName: () => 'akwapui.js',
      cssFileName: 'style',
    },
    rollupOptions: {
      external: ['vue', 'vue-router', /^@lucide\/vue/],
    },
  },
})
