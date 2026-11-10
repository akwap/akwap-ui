import AxeBuilder from '@axe-core/playwright'
import { expect, setTheme, test } from './fixtures'

const pages = [
  '/',
  '/contact',
  '/auth/login',
  '/auth/register',
  '/dashboard',
  '/dashboard/users',
  '/dashboard/analytics',
  '/dashboard/notifications',
  '/dashboard/settings',
  '/account/profile',
  '/account/settings',
  '/docs/introduction/overview',
  '/docs/foundations/colors',
  '/docs/components/button',
  '/docs/components/input',
  '/docs/components/table',
  '/docs/playground',
]

for (const theme of ['light', 'dark'] as const) {
  test.describe(`axe (${theme})`, () => {
    for (const path of pages) {
      test(`${path} has no WCAG 2.1 AA violations`, async ({ page }) => {
        await setTheme(page, theme)
        await page.goto(path)
        await page.locator('h1').first().waitFor()
        await page.waitForTimeout(300) // let transitions settle before colour checks
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .exclude('iframe')
          .analyze()
        const summary = results.violations.map((v) => `${v.id} (${v.impact}): ${v.nodes.slice(0, 3).map((n) => n.target.join(' ')).join(' | ')}`)
        expect(summary).toEqual([])
      })
    }
  })
}
