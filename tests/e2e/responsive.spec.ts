import { appRoutes, docRoutes } from './routes'
import { expect, test } from './fixtures'

const widths = [320, 768, 1440]

for (const width of widths) {
  test.describe(`at ${width}px`, () => {
    test.use({ viewport: { width, height: 800 } })
    for (const path of width === 320 ? [...appRoutes, ...docRoutes] : appRoutes) {
      test(`${path} has no horizontal overflow`, async ({ page }) => {
        await page.goto(path)
        await page.locator('h1').first().waitFor()
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow).toBeLessThanOrEqual(0)
      })
    }
  })
}
