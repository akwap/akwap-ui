import { test as base, expect, type Page } from '@playwright/test'

/** Collects console errors and uncaught exceptions; tests assert it stays empty. */
export const test = base.extend<{ errors: string[] }>({
  errors: async ({ page }, use) => {
    const errors: string[] = []
    page.on('pageerror', (e) => errors.push(`pageerror: ${e.message}`))
    page.on('console', (m) => {
      if (m.type() === 'error') errors.push(`console: ${m.text()}`)
    })
    await use(errors)
  },
})
export { expect }

export async function setTheme(page: Page, theme: 'light' | 'dark' | 'high-contrast') {
  await page.addInitScript((t) => localStorage.setItem('akwapui:theme', t), theme)
}
