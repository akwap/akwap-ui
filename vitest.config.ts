import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.ts'

export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      environment: 'jsdom',
      globals: true,
      include: ['tests/unit/**/*.spec.ts'],
      setupFiles: ['tests/unit/setup.ts'],
      css: false,
      restoreMocks: true,
    },
  }),
)
